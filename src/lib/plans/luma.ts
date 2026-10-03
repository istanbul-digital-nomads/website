import "server-only";
import { Redis } from "@upstash/redis";

// Re-exported so the API route can pull the event-time converter from one place.
export { toIstanbulDateTime } from "./expiry";

// Read a public Luma (lu.ma) event page and pull out the bits a plan step
// needs: title, venue, start/end time, cover image.
//
// Honest constraint (same spirit as the spot-finder's Instagram read in
// src/lib/spots/detect.ts): there's no free official Luma API for an arbitrary
// event. But a lu.ma event page ships a schema.org JSON-LD `Event` block with
// startDate/endDate/location, plus the usual Open Graph tags. We read those.
// Never throws - returns null/partial so the caller can fall back to manual
// entry, and the host always confirms before saving.

export interface ParsedLumaUrl {
  slug: string;
  /** Normalized canonical URL, query/hash stripped. */
  canonicalUrl: string;
}

export interface LumaEvent {
  title?: string;
  /** Venue name, when the page exposes a physical location. */
  venueName?: string;
  lat?: number;
  lng?: number;
  coverUrl?: string;
  /** Full tz-aware ISO instant. */
  startsAt?: string;
  endsAt?: string;
}

// Luma serves events on both the short lu.ma domain and luma.com.
const LUMA_HOSTS = new Set(["lu.ma", "www.lu.ma", "luma.com", "www.luma.com"]);

// Event slugs and /e/ ids are URL-safe: letters, digits, - and _.
const SLUG_RE = /^[A-Za-z0-9_-]{2,80}$/;

/**
 * Parse and validate a lu.ma event link. Handles `lu.ma/<slug>`,
 * `lu.ma/e/<id>`, a missing protocol, and tracking query params. Returns null
 * for anything that isn't a recognizable lu.ma event URL.
 */
export function parseLumaUrl(input: string): ParsedLumaUrl | null {
  const raw = input?.trim();
  if (!raw) return null;

  let url: URL;
  try {
    url = new URL(raw.includes("://") ? raw : `https://${raw}`);
  } catch {
    return null;
  }

  if (url.protocol !== "https:" && url.protocol !== "http:") return null;
  if (!LUMA_HOSTS.has(url.hostname.toLowerCase())) return null;

  const segments = url.pathname.split("/").filter(Boolean);
  if (segments.length === 0) return null;

  // `/e/<id>` keeps the e prefix; a bare `/<slug>` is the common share form.
  const isEventPath = segments[0].toLowerCase() === "e";
  const slug = isEventPath ? segments[1] : segments[0];
  if (!slug || !SLUG_RE.test(slug)) return null;
  // Reject deeper paths (e.g. /<slug>/manage) - those aren't shareable events.
  if (segments.length > (isEventPath ? 2 : 1)) return null;

  const path = isEventPath ? `e/${slug}` : slug;
  return { slug, canonicalUrl: `https://lu.ma/${path}` };
}

function decodeEntities(text: string): string {
  return text
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\\u0026/g, "&")
    .replace(/\\"/g, '"')
    .trim();
}

function metaContent(html: string, property: string): string | undefined {
  const patterns = [
    new RegExp(
      `<meta[^>]+(?:property|name)=["']${property}["'][^>]+content=["']([^"']*)["']`,
      "i",
    ),
    new RegExp(
      `<meta[^>]+content=["']([^"']*)["'][^>]+(?:property|name)=["']${property}["']`,
      "i",
    ),
  ];
  for (const re of patterns) {
    const m = html.match(re);
    if (m?.[1]) return decodeEntities(m[1]);
  }
  return undefined;
}

type JsonLdNode = Record<string, unknown>;

// Walk JSON-LD that may be a single node, an array, wrapped in @graph, or
// nested inside an ItemList (calendar pages put events under itemListElement /
// item). Return the first node whose @type looks like an Event. A breadth-first
// walk over every object value finds it wherever it sits.
function findEventNode(parsed: unknown): JsonLdNode | null {
  const queue: unknown[] = [parsed];
  while (queue.length) {
    const node = queue.shift();
    if (Array.isArray(node)) {
      queue.push(...node);
      continue;
    }
    if (node && typeof node === "object") {
      const obj = node as JsonLdNode;
      const type = obj["@type"];
      const types = Array.isArray(type) ? type : [type];
      if (types.some((t) => typeof t === "string" && /Event$/i.test(t))) {
        return obj;
      }
      // Descend into every value so @graph, itemListElement, item, etc. are all
      // covered without naming each container explicitly.
      queue.push(...Object.values(obj));
    }
  }
  return null;
}

function asString(v: unknown): string | undefined {
  return typeof v === "string" && v.trim() ? v.trim() : undefined;
}

function asNumber(v: unknown): number | undefined {
  const n = typeof v === "string" ? Number(v) : typeof v === "number" ? v : NaN;
  return Number.isFinite(n) ? n : undefined;
}

export function parseEventFromJsonLd(html: string): LumaEvent | null {
  const blocks = html.matchAll(
    /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
  );
  for (const block of blocks) {
    let parsed: unknown;
    try {
      parsed = JSON.parse(block[1].trim());
    } catch {
      continue;
    }
    const node = findEventNode(parsed);
    if (!node) continue;

    const event: LumaEvent = {
      title: asString(node.name),
      startsAt: asString(node.startDate),
      endsAt: asString(node.endDate),
    };

    const image = node.image;
    event.coverUrl = Array.isArray(image)
      ? asString(image[0])
      : (asString(image) ??
        (image && typeof image === "object"
          ? asString((image as JsonLdNode).url)
          : undefined));

    const loc = node.location;
    if (loc && typeof loc === "object" && !Array.isArray(loc)) {
      const locObj = loc as JsonLdNode;
      event.venueName = asString(locObj.name);
      const geo = locObj.geo;
      if (geo && typeof geo === "object") {
        event.lat = asNumber((geo as JsonLdNode).latitude);
        event.lng = asNumber((geo as JsonLdNode).longitude);
      }
    } else if (typeof loc === "string") {
      event.venueName = asString(loc);
    }

    return event;
  }
  return null;
}

const LUMA_TTL_SECONDS = 60 * 60; // 1h - events get edited; keep it fresh-ish.

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

/**
 * Best-effort fetch of a public Luma event's details. Never throws - returns
 * null on any block/timeout/parse failure, or a partial object when only some
 * fields could be read. Cached in Redis (1h) keyed by canonical URL.
 */
export async function fetchLumaEvent(
  canonicalUrl: string,
): Promise<LumaEvent | null> {
  const redis = resolveRedis();
  const cacheKey = `luma:${canonicalUrl}`;
  if (redis) {
    try {
      const cached = await redis.get<LumaEvent | "miss">(cacheKey);
      if (cached === "miss") return null;
      if (cached) return cached;
    } catch {
      /* cache read is best-effort */
    }
  }

  let event: LumaEvent | null = null;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);
    const res = await fetch(canonicalUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
        Accept: "text/html",
      },
      cache: "no-store",
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (res.ok) {
      const html = await res.text();
      const fromJsonLd = parseEventFromJsonLd(html);
      // OG tags fill gaps (title/cover) the JSON-LD might have missed.
      const ogTitle = metaContent(html, "og:title");
      const ogImage = metaContent(html, "og:image");
      const merged: LumaEvent = {
        ...(fromJsonLd ?? {}),
        title: fromJsonLd?.title ?? ogTitle,
        coverUrl: fromJsonLd?.coverUrl ?? ogImage,
      };
      // Only treat it as a hit if we got something useful.
      if (merged.title || merged.startsAt) event = merged;
    }
  } catch {
    event = null;
  }

  if (redis) {
    try {
      await redis.set(cacheKey, event ?? "miss", { ex: LUMA_TTL_SECONDS });
    } catch {
      /* cache write is best-effort */
    }
  }
  return event;
}
