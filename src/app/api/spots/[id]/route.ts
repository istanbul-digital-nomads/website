import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type Params = { params: Promise<{ id: string }> };

// PATCH { label?, notifyOnPlanMatch? } -> the updated spot. RLS scopes writes
// to the owner; we also filter on member_id defensively.
export async function PATCH(request: Request, { params }: Params) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const patch: { label?: string; notify_on_plan_match?: boolean } = {};

  if (body?.label !== undefined) {
    const label = typeof body.label === "string" ? body.label.trim() : "";
    if (label.length < 1 || label.length > 120) {
      return NextResponse.json({ error: "Invalid label" }, { status: 400 });
    }
    patch.label = label;
  }
  if (body?.notifyOnPlanMatch !== undefined) {
    patch.notify_on_plan_match = body.notifyOnPlanMatch === true;
  }
  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  const { data, error } = await (supabase.from("saved_spots") as any)
    .update(patch)
    .eq("id", id)
    .eq("member_id", user.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ data });
}

// DELETE -> removes the spot (owner only).
export async function DELETE(_request: Request, { params }: Params) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { error } = await supabase
    .from("saved_spots")
    .delete()
    .eq("id", id)
    .eq("member_id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ data: { deleted: true } });
}
