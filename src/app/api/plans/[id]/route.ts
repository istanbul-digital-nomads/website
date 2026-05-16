import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { cancelPlan } from "@/lib/plans/mutations";
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

  const update: Record<string, unknown> = { ...parsed.data };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = supabase as any;
  if (parsed.data.scheduled_date || parsed.data.end_time !== undefined) {
    // Recompute expiry if either changed - fetch current to fill gaps.
    const { data: current } = await sb
      .from("plans")
      .select("scheduled_date, end_time")
      .eq("id", id)
      .eq("creator_id", user.id)
      .maybeSingle();
    if (!current) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }
    const scheduledDate = parsed.data.scheduled_date ?? current.scheduled_date;
    const endTime =
      parsed.data.end_time !== undefined ? parsed.data.end_time : current.end_time;
    update.expires_at = computeExpiresAt(scheduledDate, endTime ?? null);
  }

  const { data, error } = await sb
    .from("plans")
    .update(update)
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
