import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getRSVPsForEvent } from "@/lib/supabase/queries";
import { validateCreateRSVP } from "@/lib/validations";
import { rateLimit, rateLimitHeaders } from "@/lib/rate-limit";

const RSVP_LIMIT = 30;
const RSVP_WINDOW_MS = 60 * 60 * 1000; // 30 RSVPs per hour per user

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const eventId = searchParams.get("event_id");

  if (!eventId) {
    return NextResponse.json(
      { error: "event_id query parameter is required" },
      { status: 400 },
    );
  }

  const { data, error } = await getRSVPsForEvent(eventId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rl = await rateLimit(`rsvp:${user.id}`, RSVP_LIMIT, RSVP_WINDOW_MS);
  const rlHeaders = rateLimitHeaders(rl, RSVP_LIMIT);
  if (!rl.allowed) {
    return NextResponse.json(
      {
        error: `Too many RSVPs. Try again in ${rl.retryAfterSeconds}s.`,
      },
      { status: 429, headers: rlHeaders },
    );
  }

  const body = await request.json();
  const result = validateCreateRSVP(body);

  if (result.error) {
    return NextResponse.json(
      { error: result.error },
      { status: 400, headers: rlHeaders },
    );
  }

  const { data, error } = await (supabase.from("rsvps") as any)
    .upsert(
      { ...result.data, member_id: user.id },
      { onConflict: "event_id,member_id" },
    )
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500, headers: rlHeaders },
    );
  }

  return NextResponse.json({ data }, { status: 201, headers: rlHeaders });
}
