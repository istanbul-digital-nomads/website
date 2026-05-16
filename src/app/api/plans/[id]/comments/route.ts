import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { rateLimit, rateLimitHeaders } from "@/lib/rate-limit";
import { commentCreateSchema } from "@/lib/plans/schema";
import { addComment } from "@/lib/plans/mutations";

const COMMENT_LIMIT = 60;
const COMMENT_WINDOW_MS = 60 * 60 * 1000;

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
    `plan-comment:${user.id}`,
    COMMENT_LIMIT,
    COMMENT_WINDOW_MS,
  );
  const headers = rateLimitHeaders(rl, COMMENT_LIMIT);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: `Too many comments. Retry in ${rl.retryAfterSeconds}s.` },
      { status: 429, headers },
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = commentCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400, headers },
    );
  }

  const { data, error } = await addComment(id, user.id, parsed.data.body);
  if (error || !data) {
    return NextResponse.json(
      { error: error ?? "Failed to comment" },
      { status: 500, headers },
    );
  }
  return NextResponse.json({ data }, { status: 201, headers });
}
