import "server-only";
import { Redis } from "@upstash/redis";
import { spaces, type NomadSpace } from "@/lib/spaces";
import { neighborhoods } from "@/lib/neighborhoods";

// Turn a place name (from an Instagram caption, location tag, or the user's own
// typing) into map coordinates - without a paid geocoder. Two free layers:
//
//   1. Our own curated NomadSpaces (src/lib/spaces.ts). A hit is the best
//      possible result: exact coordinates plus a link back to our spot page.
//   2. OpenStreetMap Nominatim, biased to Istanbul. Free, no API key, but
//      rate-limited and weaker on tiny venues - so results are cached and the
//      user always confirms the pin.

export type CandidateSource = "curated" | "geocoded";

export interface SpotCandidate {
  label: string;
  lat: number;
  lng: number;
  spaceId?: string;
  neighborhoodSlug?: string;
  source: CandidateSource;
  confidence: "high" | "medium" | "low";
}

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "") // strip combining diacritics
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Map a curated space's free-text neighborhood to a NeighborhoodSlug, if any. */
function neighborhoodSlugForName(name: string): string | undefined {
  const n = normalize(name);
  for (const hood of neighborhoods) {
    if (hood.spaceMatchers.some((m) => n.includes(normalize(m)))) {
      return hood.slug;
    }
  }
  return undefined;
}

/**
 * Fuzzy-match free text against our curated NomadSpaces by name. Returns the
 * longest-named match found in the text (longer name = more specific, avoids a
 * stray "Moda" matching a cafe literally called "Moda"). Coordinates are
 * stored [lng, lat] on a NomadSpace and converted to lat/lng here.
 */
export function matchCuratedSpace(text: string): NomadSpace | null {
  if (!text) return null;
  const haystack = normalize(text);
  let best: NomadSpace | null = null;
  for (const space of spaces) {
    const needle = normalize(space.name);
    // Require a reasonably specific name so short words don't false-match.
    if (needle.length < 4) continue;
    if (haystack.includes(needle)) {
      if (!best || space.name.length > best.name.length) best = space;
    }
  }
  return best;
}

function curatedToCandidate(space: NomadSpace): SpotCandidate {
  const [lng, lat] = space.coordinates;
  return {
    label: space.name,
    lat,
    lng,
    spaceId: space.id,
    neighborhoodSlug: neighborhoodSlugForName(space.neighborhood),
    source: "curated",
    confidence: "high",
  };
}

/**
 * Pull plausible place-name queries out of a caption with pattern matching
 * only (no LLM). Order: explicit location tag, @mentions (often the venue's
 * handle), then Title-Case multi-word phrases. Deduped, capped.
 */
export function extractPlaceCandidates(
  caption: string | undefined,
  locationTag?: string,
): string[] {
  const out: string[] = [];
  const push = (s: string) => {
    const v = s.trim();
    if (v.length >= 3 && !out.some((o) => normalize(o) === normalize(v))) {
      out.push(v);
    }
  };

  if (locationTag) push(locationTag);

  if (caption) {
    // @venue.handle -> "venue handle"
    for (const m of caption.matchAll(/@([A-Za-z0-9._]{2,30})/g)) {
      push(m[1].replace(/[._]+/g, " "));
    }
    // Title-Case runs like "Walter's Coffee Roastery", "Kronotrop Bebek".
    for (const m of caption.matchAll(
      /\b([A-ZÇĞİÖŞÜ][\wçğıöşü'’&-]+(?:\s+[A-ZÇĞİÖŞÜ][\wçğıöşü'’&-]+){0,3})\b/g,
    )) {
      push(m[1]);
    }
  }

  return out.slice(0, 6);
}

// Istanbul viewbox for Nominatim: left,top,right,bottom (lon_min,lat_max,lon_max,lat_min).
const IST_VIEWBOX = "27.85,41.7,30.05,40.72";
const GEOCODE_TTL_SECONDS = 60 * 60 * 24 * 30; // 30 days

function resolveRedis(): Redis | null {
  const env = process.env;
  const pairs: Array<[string | undefined, string | undefined]> = [
    [env.UPSTASH_REDIS_REST_URL, env.UPSTASH_REDIS_REST_TOKEN],
    [
      env.UPSTASH_REDIS_REST_KV_REST_API_URL,
      env.UPSTASH_REDIS_REST_KV_REST_API_TOKEN,
    ],
    [env.KV_REST_API_URL, env.KV_REST_API_TOKEN],
  ];
  for (const [url, token] of pairs) {
    if (url && token) return new Redis({ url, token });
  }
  return null;
}

interface GeocodeHit {
  lat: number;
  lng: number;
  displayName: string;
}

/**
 * Geocode a query via Nominatim, biased to Istanbul. Cached in Redis to respect
 * the OSM usage policy (1 req/s, identify yourself). Never throws.
 */
export async function geocodeNominatim(
  query: string,
): Promise<GeocodeHit | null> {
  const q = `${query}, Istanbul, Turkey`;
  const cacheKey = `geocode:${normalize(q)}`;
  const redis = resolveRedis();

  if (redis) {
    try {
      const cached = await redis.get<GeocodeHit | "miss">(cacheKey);
      if (cached === "miss") return null;
      if (cached) return cached;
    } catch {
      /* cache read is best-effort */
    }
  }

  let hit: GeocodeHit | null = null;
  try {
    const params = new URLSearchParams({
      format: "jsonv2",
      q,
      viewbox: IST_VIEWBOX,
      bounded: "1",
      countrycodes: "tr",
      limit: "1",
    });
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?${params}`,
      {
        headers: {
          // OSM policy requires a real identifier with contact info.
          "User-Agent":
            "IstanbulNomads/1.0 (spot-finder; hello@istanbulnomads.com)",
          "Accept-Language": "en",
        },
        cache: "no-store",
        signal: controller.signal,
      },
    );
    clearTimeout(timeout);
    if (res.ok) {
      const data = (await res.json()) as Array<{
        lat: string;
        lon: string;
        display_name: string;
      }>;
      const first = data[0];
      if (first) {
        hit = {
          lat: Number(first.lat),
          lng: Number(first.lon),
          displayName: first.display_name,
        };
      }
    }
  } catch {
    hit = null;
  }

  if (redis) {
    try {
      await redis.set(cacheKey, hit ?? "miss", { ex: GEOCODE_TTL_SECONDS });
    } catch {
      /* cache write is best-effort */
    }
  }
  return hit;
}

/**
 * Full resolution pipeline: curated match first, then geocode the best caption
 * candidates. Returns an ordered, deduped candidate list (may be empty - the
 * caller then lets the user drop a pin manually).
 */
export async function resolveCandidates(
  caption: string | undefined,
  locationTag: string | undefined,
): Promise<SpotCandidate[]> {
  const candidates: SpotCandidate[] = [];
  const seen = new Set<string>();
  const add = (c: SpotCandidate) => {
    const key = `${c.lat.toFixed(4)},${c.lng.toFixed(4)}`;
    if (!seen.has(key)) {
      seen.add(key);
      candidates.push(c);
    }
  };

  const curated = matchCuratedSpace(`${locationTag ?? ""} ${caption ?? ""}`);
  if (curated) add(curatedToCandidate(curated));

  const queries = extractPlaceCandidates(caption, locationTag);
  for (const q of queries) {
    // A curated name we already matched needs no external geocode.
    if (curated && normalize(q) === normalize(curated.name)) continue;
    const hit = await geocodeNominatim(q);
    if (hit) {
      add({
        label: q,
        lat: hit.lat,
        lng: hit.lng,
        neighborhoodSlug: neighborhoodSlugForName(hit.displayName),
        source: "geocoded",
        confidence: locationTag && q === locationTag ? "medium" : "low",
      });
    }
    if (candidates.length >= 4) break;
  }

  return candidates;
}
