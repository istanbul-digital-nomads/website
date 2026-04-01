import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getEvents } from "@/lib/supabase/queries";

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
  const { title, description, type, date, end_date, location_name, location_address, location_url, capacity, image_url } = body;

  if (!title || !description || !type || !date || !location_name) {
    return NextResponse.json(
      { error: "Missing required fields: title, description, type, date, location_name" },
      { status: 400 },
    );
  }

  const { data, error } = await (supabase
    .from("events") as any)
    .insert({
      title,
      description,
      type,
      date,
      end_date: end_date ?? null,
      location_name,
      location_address: location_address ?? null,
      location_url: location_url ?? null,
      capacity: capacity ?? null,
      image_url: image_url ?? null,
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
