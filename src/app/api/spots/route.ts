import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseInstagramUrl } from "@/lib/spots/detect";

// GET -> the current member's saved spots (newest first).
export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("saved_spots")
    .select("*")
    .eq("member_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ data });
}

function isFiniteNumber(v: unknown): v is number {
  return typeof v === "number" && Number.isFinite(v);
}

// POST { label, lat, lng, source?, sourceUrl?, spaceId?, neighborhoodSlug?,
//        thumbnailUrl?, notifyOnPlanMatch? } -> the inserted spot.
export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const label = typeof body?.label === "string" ? body.label.trim() : "";
  const lat = body?.lat;
  const lng = body?.lng;

  if (label.length < 1 || label.length > 120) {
    return NextResponse.json({ error: "Invalid label" }, { status: 400 });
  }
  if (!isFiniteNumber(lat) || lat < -90 || lat > 90) {
    return NextResponse.json({ error: "Invalid latitude" }, { status: 400 });
  }
  if (!isFiniteNumber(lng) || lng < -180 || lng > 180) {
    return NextResponse.json({ error: "Invalid longitude" }, { status: 400 });
  }

  const source = body?.source === "manual" ? "manual" : "instagram";
  // Only persist a source URL we recognize as an Instagram link.
  const sourceUrl =
    typeof body?.sourceUrl === "string" && parseInstagramUrl(body.sourceUrl)
      ? parseInstagramUrl(body.sourceUrl)!.canonicalUrl
      : null;

  const row = {
    member_id: user.id,
    label,
    lat,
    lng,
    source,
    source_url: sourceUrl,
    space_id: typeof body?.spaceId === "string" ? body.spaceId : null,
    neighborhood_slug:
      typeof body?.neighborhoodSlug === "string" ? body.neighborhoodSlug : null,
    thumbnail_url:
      typeof body?.thumbnailUrl === "string" ? body.thumbnailUrl : null,
    notify_on_plan_match: body?.notifyOnPlanMatch === true,
  };

  const { data, error } = await (supabase.from("saved_spots") as any)
    .insert(row)
    .select()
    .single();

  if (error) {
    // Unique violation = this Instagram link is already saved by this member.
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "You've already saved this spot." },
        { status: 409 },
      );
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ data }, { status: 201 });
}
