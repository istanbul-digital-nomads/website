import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getEvents } from "@/lib/supabase/queries";
import { validateCreateEvent } from "@/lib/validations";
import { rateLimit, rateLimitHeaders } from "@/lib/rate-limit";

const EVENTS_CREATE_LIMIT = 5;
const EVENTS_CREATE_WINDOW_MS = 60 * 60 * 1000; // 5 drafts per hour per user

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") ?? undefined;
  const past = searchParams.get("past");
  const limit = searchParams.get("limit");

  const { data, error } = await getEvents({
    type,
    past: past === "true" ? true : past === "false" ? false : undefined,
    limit: limit ? parseInt(limit) : undefined,
  });

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

  const rl = await rateLimit(
    `events-create:${user.id}`,
    EVENTS_CREATE_LIMIT,
    EVENTS_CREATE_WINDOW_MS,
  );
  const rlHeaders = rateLimitHeaders(rl, EVENTS_CREATE_LIMIT);
  if (!rl.allowed) {
    return NextResponse.json(
      {
        error: `You can create ${EVENTS_CREATE_LIMIT} events per hour. Try again in ${rl.retryAfterSeconds}s.`,
      },
      { status: 429, headers: rlHeaders },
    );
  }

  const body = await request.json();
  const result = validateCreateEvent(body);

  if (result.error) {
    return NextResponse.json(
      { error: result.error },
      { status: 400, headers: rlHeaders },
    );
  }

  const validated = result.data!;
  const { data, error } = await (supabase.from("events") as any)
    .insert({
      title: validated.title,
      description: validated.description,
      type: validated.type,
      date: validated.date,
      end_date: validated.end_date,
      location_name: validated.location_name,
      location_address: validated.location_address,
      location_url: validated.location_url,
      capacity: validated.capacity,
      image_url: validated.image_url,
      organizer_id: user.id,
      is_published: false,
    })
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
