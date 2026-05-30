import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { rateLimit, rateLimitHeaders } from "@/lib/rate-limit";
import { reviewUpsertSchema } from "@/lib/plans/schema";
import { upsertReview, deleteReview } from "@/lib/plans/mutations";

const REVIEW_LIMIT = 30;
const REVIEW_WINDOW_MS = 60 * 60 * 1000;

interface Ctx {
  params: Promise<{ id: string }>;
}

export async function POST(request: Request, { params }: Ctx) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rl = await rateLimit(
    `plan-review:${user.id}`,
    REVIEW_LIMIT,
    REVIEW_WINDOW_MS,
  );
  const headers = rateLimitHeaders(rl, REVIEW_LIMIT);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: `Too many reviews. Retry in ${rl.retryAfterSeconds}s.` },
      { status: 429, headers },
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = reviewUpsertSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400, headers },
    );
  }

  const { data, error } = await upsertReview(id, user.id, parsed.data);
  if (error || !data) {
    return NextResponse.json(
      { error: error ?? "Failed to save review" },
      { status: 400, headers },
    );
  }
  return NextResponse.json({ data }, { status: 201, headers });
}

export async function DELETE(_request: Request, { params }: Ctx) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { error } = await deleteReview(id, user.id);
  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
  return NextResponse.json({ data: { ok: true } });
}
