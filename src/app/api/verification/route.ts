import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { rateLimit, rateLimitHeaders } from "@/lib/rate-limit";
import { verificationApplySchema } from "@/lib/verification-schema";

const APPLY_LIMIT = 5;
const APPLY_WINDOW_MS = 24 * 60 * 60 * 1000;

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rl = await rateLimit(
    `verification-apply:${user.id}`,
    APPLY_LIMIT,
    APPLY_WINDOW_MS,
  );
  const headers = rateLimitHeaders(rl, APPLY_LIMIT);
  if (!rl.allowed) {
    return NextResponse.json(
      {
        error: `Too many verification requests. Retry in ${rl.retryAfterSeconds}s.`,
      },
      { status: 429, headers },
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = verificationApplySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400, headers },
    );
  }

  // Block Gold (trusted) self-service - PRODUCT.md says it requires an
  // in-person meet, organized via Telegram, not a form submission.
  if (parsed.data.requested_level === "trusted") {
    return NextResponse.json(
      {
        error:
          "Gold (trusted) badge isn't a self-service flow. Reach out to an organizer on Telegram.",
      },
      { status: 400, headers },
    );
  }

  const sb = supabase as unknown as { from: (t: string) => any };
  const { data, error } = await sb
    .from("verification_requests")
    .insert({
      member_id: user.id,
      requested_level: parsed.data.requested_level,
      reason: parsed.data.reason,
      status: "pending",
    })
    .select("*")
    .single();

  if (error || !data) {
    // Unique-index violation = there's already a pending request for
    // this member. Surface a friendlier error than the raw constraint.
    if (
      typeof error?.message === "string" &&
      error.message.includes("verification_requests_one_pending")
    ) {
      return NextResponse.json(
        { error: "You already have a pending verification request." },
        { status: 409, headers },
      );
    }
    return NextResponse.json(
      { error: error?.message ?? "Failed to submit request" },
      { status: 500, headers },
    );
  }

  return NextResponse.json({ data }, { status: 201, headers });
}
