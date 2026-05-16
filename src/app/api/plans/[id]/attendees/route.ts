import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { rateLimit, rateLimitHeaders } from "@/lib/rate-limit";
import { joinPlan, leavePlan } from "@/lib/plans/mutations";

const JOIN_LIMIT = 30;
const JOIN_WINDOW_MS = 60 * 60 * 1000;

interface Ctx {
  params: Promise<{ id: string }>;
}

export async function POST(_request: Request, { params }: Ctx) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rl = await rateLimit(`plan-join:${user.id}`, JOIN_LIMIT, JOIN_WINDOW_MS);
  const headers = rateLimitHeaders(rl, JOIN_LIMIT);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: `Too many joins. Retry in ${rl.retryAfterSeconds}s.` },
      { status: 429, headers },
    );
  }

  const { error } = await joinPlan(id, user.id);
  if (error) {
    const status = error === "Plan is full" ? 409 : 400;
    return NextResponse.json({ error }, { status, headers });
  }
  return NextResponse.json({ data: { joined: true } }, { status: 201, headers });
}

export async function DELETE(_request: Request, { params }: Ctx) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { error } = await leavePlan(id, user.id);
  if (error) return NextResponse.json({ error }, { status: 400 });
  return NextResponse.json({ data: { left: true } });
}
