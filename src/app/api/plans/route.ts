import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { rateLimit, rateLimitHeaders } from "@/lib/rate-limit";
import { planCreateSchema } from "@/lib/plans/schema";
import { createPlan } from "@/lib/plans/mutations";

const CREATE_LIMIT = 10;
const CREATE_WINDOW_MS = 60 * 60 * 1000;

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rl = await rateLimit(
    `plan-create:${user.id}`,
    CREATE_LIMIT,
    CREATE_WINDOW_MS,
  );
  const headers = rateLimitHeaders(rl, CREATE_LIMIT);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: `Too many plans created. Retry in ${rl.retryAfterSeconds}s.` },
      { status: 429, headers },
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = planCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400, headers },
    );
  }

  const { data, error } = await createPlan(parsed.data, user.id);
  if (error || !data) {
    return NextResponse.json(
      { error: error ?? "Failed to create plan" },
      { status: 500, headers },
    );
  }

  return NextResponse.json({ data }, { status: 201, headers });
}
