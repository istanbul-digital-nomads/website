import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getEvents } from "@/lib/supabase/queries";
import { validateCreateEvent } from "@/lib/validations";

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

  const body = await request.json();
  const result = validateCreateEvent(body);

  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 400 });
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
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data }, { status: 201 });
}
