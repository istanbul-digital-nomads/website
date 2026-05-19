import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { cancelPlan, updatePlanStops } from "@/lib/plans/mutations";
import { planUpdateSchema } from "@/lib/plans/schema";
import { computeExpiresAt } from "@/lib/plans/expiry";

interface Ctx {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, { params }: Ctx) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const parsed = planUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 },
    );
  }

  const sb = supabase as unknown as { from: (t: string) => any };

  // If stops are included in the payload, replace them wholesale.
  if (parsed.data.stops) {
    const { data: existing } = await sb
      .from("plans")
      .select("scheduled_date")
      .eq("id", id)
      .eq("creator_id", user.id)
      .maybeSingle();
    if (!existing) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }
    const date = parsed.data.scheduled_date ?? existing.scheduled_date;
    const { error: stopsErr } = await updatePlanStops(
      id,
      user.id,
      parsed.data.stops,
      date,
    );
    if (stopsErr)
      return NextResponse.json({ error: stopsErr }, { status: 400 });
  }

  // Plan-level fields.
  const planUpdate: Record<string, unknown> = {};
  if (parsed.data.title !== undefined) planUpdate.title = parsed.data.title;
  if (parsed.data.capacity !== undefined)
    planUpdate.capacity = parsed.data.capacity;
  if (parsed.data.scheduled_date !== undefined) {
    planUpdate.scheduled_date = parsed.data.scheduled_date;
    // Recompute expires_at from current stops if date changed and we
    // didn't already overwrite via updatePlanStops above.
    if (!parsed.data.stops) {
      const { data: stops } = await sb
        .from("plan_stops")
        .select("end_time")
        .eq("plan_id", id);
      planUpdate.expires_at = computeExpiresAt(
        parsed.data.scheduled_date,
        ((stops ?? []) as Array<{ end_time: string | null }>).map(
          (s) => s.end_time,
        ),
      );
    }
  }

  if (Object.keys(planUpdate).length === 0) {
    return NextResponse.json({ data: { ok: true } });
  }

  const { data, error } = await sb
    .from("plans")
    .update(planUpdate)
    .eq("id", id)
    .eq("creator_id", user.id)
    .select("*")
    .maybeSingle();

  if (error || !data) {
    return NextResponse.json(
      { error: error?.message ?? "Not found" },
      { status: 404 },
    );
  }
  return NextResponse.json({ data });
}

export async function DELETE(_request: Request, { params }: Ctx) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { error } = await cancelPlan(id, user.id);
  if (error) return NextResponse.json({ error }, { status: 400 });
  return NextResponse.json({ data: { cancelled: true } });
}
