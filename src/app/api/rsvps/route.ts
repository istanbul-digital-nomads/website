import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getRSVPsForEvent } from "@/lib/supabase/queries";

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

  const { event_id, status } = await request.json();

  if (!event_id || !status) {
    return NextResponse.json(
      { error: "Missing required fields: event_id, status" },
      { status: 400 },
    );
  }

  if (!["going", "maybe", "not_going"].includes(status)) {
    return NextResponse.json(
      { error: "Invalid status. Must be: going, maybe, or not_going" },
      { status: 400 },
    );
  }

  const { data, error } = await (supabase
    .from("rsvps") as any)
    .upsert(
      { event_id, member_id: user.id, status },
      { onConflict: "event_id,member_id" },
    )
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data }, { status: 201 });
}
