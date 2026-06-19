import "server-only";

// Best-effort location detection from an Instagram link.
//
// Honest constraint: there is no official, free Instagram API that returns a
// location for an arbitrary public reel/post. The old public oEmbed endpoint
// was removed in 2020, and the Graph API only covers content you own. So we do
// the only free thing that works some of the time: fetch the public page and
// read its Open Graph meta (and any location hint in the embedded JSON). When
// that returns nothing, the caller falls through to the manual-pin flow - the
// user always confirms the pin on a map before saving, so a wrong or empty
// guess is never silently saved.

export type InstagramKind = "reel" | "post" | "tv";

export interface ParsedInstagramUrl {
  kind: InstagramKind;
  shortcode: string;
  /** Normalized canonical URL, query stripped. */
  canonicalUrl: string;
}

export interface InstagramMeta {
  caption?: string;
  /** A place name if the page exposed one (rare on reels). */
  locationTag?: string;
  thumbnail?: string;
  author?: string;
}

const INSTAGRAM_HOSTS = new Set([
  "instagram.com",
  "www.instagram.com",
  "m.instagram.com",
  "instagr.am",
  "www.instagr.am",
]);

// Shortcodes are URL-safe base64-ish: letters, digits, - and _.
const SHORTCODE_RE = /^[A-Za-z0-9_-]{5,40}$/;

const SEGMENT_TO_KIND: Record<string, InstagramKind> = {
  reel: "reel",
  reels: "reel",
  p: "post",
  tv: "tv",
};

/**
 * Parse and validate an Instagram reel/post/tv link. Returns null for anything
 * that isn't a recognizable Instagram content URL (profiles, stories, other
 * hosts, junk). Tolerates the `/username/reel/CODE/` form and tracking query
 * params (e.g. `?igsh=...`).
 */
export function parseInstagramUrl(input: string): ParsedInstagramUrl | null {
  const raw = input?.trim();
  if (!raw) return null;

  let url: URL;
  try {
    url = new URL(raw.includes("://") ? raw : `https://${raw}`);
  } catch {
    return null;
  }

  if (url.protocol !== "https:" && url.protocol !== "http:") return null;
  if (!INSTAGRAM_HOSTS.has(url.hostname.toLowerCase())) return null;

  const segments = url.pathname.split("/").filter(Boolean);
  // Find a known content segment followed by a shortcode. This covers
  // /reel/CODE, /p/CODE, /tv/CODE and /username/reel/CODE.
  for (let i = 0; i < segments.length - 1; i++) {
    const kind = SEGMENT_TO_KIND[segments[i].toLowerCase()];
    const code = segments[i + 1];
    if (kind && SHORTCODE_RE.test(code)) {
      return {
        kind,
        shortcode: code,
        canonicalUrl: `https://www.instagram.com/${segments[i].toLowerCase()}/${code}/`,
      };
    }
  }
  return null;
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
  // Match <meta property="og:x" content="..."> in either attribute order.
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

// og:title on Instagram looks like: `Name (@handle) on Instagram: "caption"`.
// Pull the caption out of the quotes; fall back to og:description.
function extractCaption(
  ogTitle?: string,
  ogDescription?: string,
): { caption?: string; author?: string } {
  let author: string | undefined;
  let caption: string | undefined;

  if (ogTitle) {
    const handle = ogTitle.match(/\(@([A-Za-z0-9._]+)\)/);
    if (handle) author = handle[1];
    const quoted = ogTitle.match(/:\s*[""“]([\s\S]+)[""”]\s*$/);
    if (quoted) caption = quoted[1].trim();
  }
  // og:description is often `N likes, M comments - Name on Instagram: "caption"`.
  if (!caption && ogDescription) {
    const quoted = ogDescription.match(/:\s*[""“]([\s\S]+)[""”]\s*$/);
    caption = quoted ? quoted[1].trim() : ogDescription.trim();
  }
  return { caption, author };
}

/**
 * Best-effort fetch of public metadata for an Instagram URL. Never throws -
 * returns an empty object on any block, timeout, or parse failure so the
 * detection pipeline degrades gracefully to the manual-pin flow.
 */
export async function fetchInstagramMeta(
  canonicalUrl: string,
): Promise<InstagramMeta> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);
    const res = await fetch(canonicalUrl, {
      headers: {
        // A real browser UA gets the og: tags meant for link unfurling;
        // the bare fetch UA tends to hit a login wall with no meta.
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
        Accept: "text/html",
      },
      cache: "no-store",
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!res.ok) return {};

    const html = await res.text();
    const ogTitle = metaContent(html, "og:title");
    const ogDescription = metaContent(html, "og:description");
    const thumbnail = metaContent(html, "og:image");
    const { caption, author } = extractCaption(ogTitle, ogDescription);

    // Location is rarely in og: tags; try the embedded JSON as a long shot.
    let locationTag: string | undefined;
    const loc = html.match(/"location":\s*\{[^}]*?"name":\s*"([^"]+)"/);
    if (loc?.[1]) locationTag = decodeEntities(loc[1]);

    return { caption, locationTag, thumbnail, author };
  } catch {
    return {};
  }
}
