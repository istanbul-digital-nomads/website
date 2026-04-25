import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getWaitlistSummary } from "@/lib/supabase/queries";
import { validateWaitlistSignup } from "@/lib/validations";
import { rateLimit, getClientIp, rateLimitHeaders } from "@/lib/rate-limit";

const WAITLIST_LIMIT = 5;
const WAITLIST_WINDOW_MS = 60_000;

const UNIFIED_SUCCESS = {
  data: {
    success: true,
    message: "You're on the list. We'll email you when the date drops.",
  },
};

export async function GET() {
  const { data, error } = await getWaitlistSummary();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ data });
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const rl = await rateLimit(
    `waitlist:${ip}`,
    WAITLIST_LIMIT,
    WAITLIST_WINDOW_MS,
  );
  const rlHeaders = rateLimitHeaders(rl, WAITLIST_LIMIT);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again in a minute." },
      { status: 429, headers: rlHeaders },
    );
  }

  const body = await request.json().catch(() => null);
  const result = validateWaitlistSignup(body);
  if (result.error || !result.data) {
    return NextResponse.json(
      { error: result.error ?? "Invalid request body" },
      { status: 400, headers: rlHeaders },
    );
  }

  const payload = result.data;
  const supabase = await createClient();

  const { data: existing } = await (
    supabase.from("surprise_event_waitlist") as any
  )
    .select("id")
    .eq("email", payload.email)
    .single();

  if (existing) {
    return NextResponse.json(UNIFIED_SUCCESS, { headers: rlHeaders });
  }

  const { error: dbError } = await (
    supabase.from("surprise_event_waitlist") as any
  ).insert(payload);

  if (dbError) {
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500, headers: rlHeaders },
    );
  }

  return NextResponse.json(UNIFIED_SUCCESS, { headers: rlHeaders });
}
