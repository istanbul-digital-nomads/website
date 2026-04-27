import { NextResponse } from "next/server";
import { randomUUID, createHash } from "crypto";
import { rateLimit, getClientIp, rateLimitHeaders } from "@/lib/rate-limit";
import { createClient } from "@/lib/supabase/server";
import { relocationIntakeSchema } from "@/lib/agent/types";
import { retrieveContext } from "@/lib/agent/retrieve";
import { generatePlan } from "@/lib/agent/relocation-agent";

// LLM calls take time. Allow up to 60s before Vercel cuts the function
export const maxDuration = 60;

const ANON_LIMIT = 5;
const ANON_WINDOW_MS = 60 * 60 * 1000; // 5 plans per hour per IP
const USER_LIMIT = 20;
const USER_WINDOW_MS = 60 * 60 * 1000; // 20 plans per hour per user

function hashIntake(intake: unknown): string {
  return createHash("sha256")
    .update(JSON.stringify(intake))
    .digest("hex")
    .slice(0, 12);
}

export async function POST(request: Request) {
  const requestId = randomUUID();
  const startedAt = Date.now();

  // Resolve user up-front so the rate-limit key is auth-aware
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const limit = user ? USER_LIMIT : ANON_LIMIT;
  const windowMs = user ? USER_WINDOW_MS : ANON_WINDOW_MS;
  const rlKey = user
    ? `relocation-agent:user:${user.id}`
    : `relocation-agent:ip:${getClientIp(request)}`;

  const rl = await rateLimit(rlKey, limit, windowMs);
  const rlHeaders = rateLimitHeaders(rl, limit);

  if (!rl.allowed) {
    return NextResponse.json(
      {
        error: `Too many plans. Try again in ${rl.retryAfterSeconds}s.`,
        request_id: requestId,
      },
      { status: 429, headers: rlHeaders },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body.", request_id: requestId },
      { status: 400, headers: rlHeaders },
    );
  }

  const parsed = relocationIntakeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Some fields look off. Check the form and try again.",
        issues: parsed.error.issues,
        request_id: requestId,
      },
      { status: 400, headers: rlHeaders },
    );
  }
  const intake = parsed.data;

  try {
    const context = await retrieveContext(intake);
    const { plan, planText, model } = await generatePlan(intake, context);

    // Best-effort persistence for authenticated members. Failures are
    // logged but don't fail the response - the plan is already in hand
    if (user) {
      try {
        const { error: insertError } = await (
          supabase.from("relocation_plans") as any
        ).insert({
          member_id: user.id,
          intake,
          plan,
          plan_text: planText,
          model,
          retrieved_chunk_count: context.retrieved.length,
        });
        if (insertError) {
          console.warn(
            `[relocation-agent ${requestId}] persist failed: ${insertError.message}`,
          );
        }
      } catch (err) {
        console.warn(`[relocation-agent ${requestId}] persist threw:`, err);
      }
    }

    const durationMs = Date.now() - startedAt;
    console.info(
      `[relocation-agent ${requestId}] ok model=${model} retrieved=${context.retrieved.length} duration=${durationMs}ms intake=${hashIntake(intake)} user=${user ? "yes" : "no"}`,
    );

    return NextResponse.json(
      {
        data: {
          plan_text: planText,
          plan_json: plan,
          model,
          retrieved_chunk_count: context.retrieved.length,
          request_id: requestId,
        },
      },
      { headers: rlHeaders },
    );
  } catch (err) {
    const durationMs = Date.now() - startedAt;
    console.error(
      `[relocation-agent ${requestId}] failed after ${durationMs}ms:`,
      err,
    );
    return NextResponse.json(
      {
        error:
          "Couldn't build your plan. Try again in a minute - the agent's busy.",
        request_id: requestId,
      },
      { status: 502, headers: rlHeaders },
    );
  }
}
