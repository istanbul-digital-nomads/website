import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getRSVPsForEvent } from "@/lib/supabase/queries";
import { validateCreateRSVP } from "@/lib/validations";

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

  const body = await request.json();
  const result = validateCreateRSVP(body);

  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  const { data, error } = await (supabase.from("rsvps") as any)
    .upsert(
      { ...result.data, member_id: user.id },
      { onConflict: "event_id,member_id" },
    )
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data }, { status: 201 });
}
