import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { rateLimit, rateLimitHeaders } from "@/lib/rate-limit";
import {
  parseLumaUrl,
  fetchLumaEvent,
  toIstanbulDateTime,
} from "@/lib/plans/luma";

const LUMA_LIMIT = 20;
const LUMA_WINDOW_MS = 60 * 60 * 1000;

// POST { url } -> { data: { provider, url, title?, venueName?, lat?, lng?,
//   coverUrl?, startsAt?, endsAt?, date?, startTime?, endTime? } }
//
// Only runs inside the authed plan builder. A recognized lu.ma URL always
// returns 200, even when we couldn't read the event details (the host then
// fills the time in manually). A missing/non-Luma URL is a 400.
export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rl = await rateLimit(
    `luma-detect:${user.id}`,
    LUMA_LIMIT,
    LUMA_WINDOW_MS,
  );
  const headers = rateLimitHeaders(rl, LUMA_LIMIT);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: `Too many lookups. Retry in ${rl.retryAfterSeconds}s.` },
      { status: 429, headers },
    );
  }

  const body = await request.json().catch(() => null);
  const url = typeof body?.url === "string" ? body.url : null;
  const parsed = url ? parseLumaUrl(url) : null;
  if (!parsed) {
    return NextResponse.json(
      { error: "Paste a valid lu.ma event link." },
      { status: 400, headers },
    );
  }

  const event = await fetchLumaEvent(parsed.canonicalUrl);
  const start = toIstanbulDateTime(event?.startsAt);
  const end = toIstanbulDateTime(event?.endsAt);

  return NextResponse.json(
    {
      data: {
        provider: "luma" as const,
        url: parsed.canonicalUrl,
        title: event?.title ?? null,
        venueName: event?.venueName ?? null,
        lat: event?.lat ?? null,
        lng: event?.lng ?? null,
        coverUrl: event?.coverUrl ?? null,
        startsAt: event?.startsAt ?? null,
        endsAt: event?.endsAt ?? null,
        date: start?.date ?? null,
        startTime: start?.time ?? null,
        endTime: end?.time ?? null,
      },
    },
    { status: 200, headers },
  );
}
