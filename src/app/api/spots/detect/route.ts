import { NextResponse } from "next/server";
import { rateLimit, rateLimitHeaders, getClientIp } from "@/lib/rate-limit";
import { parseInstagramUrl, fetchInstagramMeta } from "@/lib/spots/detect";
import { resolveCandidates } from "@/lib/spots/resolve";

const DETECT_LIMIT = 20;
const DETECT_WINDOW_MS = 60 * 60 * 1000;

// POST { url } -> { caption?, thumbnail?, candidates[] }
//
// Public: the spot-finder is usable logged-out (saving requires auth). Detection
// is best-effort - a recognized Instagram URL always returns 200, even with zero
// candidates, so the client falls through to the manual-pin flow. Only a missing
// or non-Instagram URL is a 400.
export async function POST(request: Request) {
  const ip = getClientIp(request);
  const rl = await rateLimit(
    `spot-detect:${ip}`,
    DETECT_LIMIT,
    DETECT_WINDOW_MS,
  );
  const headers = rateLimitHeaders(rl, DETECT_LIMIT);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: `Too many lookups. Retry in ${rl.retryAfterSeconds}s.` },
      { status: 429, headers },
    );
  }

  const body = await request.json().catch(() => null);
  const url = typeof body?.url === "string" ? body.url : null;
  const parsed = url ? parseInstagramUrl(url) : null;
  if (!parsed) {
    return NextResponse.json(
      { error: "Paste a valid Instagram reel or post link." },
      { status: 400, headers },
    );
  }

  const meta = await fetchInstagramMeta(parsed.canonicalUrl);
  const candidates = await resolveCandidates(meta.caption, meta.locationTag);

  return NextResponse.json(
    {
      data: {
        caption: meta.caption ?? null,
        thumbnail: meta.thumbnail ?? null,
        candidates,
      },
    },
    { status: 200, headers },
  );
}
