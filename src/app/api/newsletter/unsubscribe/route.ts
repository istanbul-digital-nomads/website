import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { verifyUnsubscribe } from "@/lib/newsletter-token";
import { rateLimit, getClientIp, rateLimitHeaders } from "@/lib/rate-limit";

// Remove an email from newsletter_subscribers. Requires the HMAC token from
// the unsubscribe link so one visitor can't unsubscribe arbitrary addresses.
// Returns the same success whether or not the row existed (don't leak
// membership). Rate-limited like the other public newsletter endpoints.
const UNSUB_LIMIT = 5;
const UNSUB_WINDOW_MS = 60_000;

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const rl = await rateLimit(`unsub:${ip}`, UNSUB_LIMIT, UNSUB_WINDOW_MS);
  const rlHeaders = rateLimitHeaders(rl, UNSUB_LIMIT);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Try again in a minute." },
      { status: 429, headers: rlHeaders },
    );
  }

  const body = await request.json().catch(() => null);
  const email = (body?.email || "").trim().toLowerCase();
  const token = typeof body?.token === "string" ? body.token : "";

  if (!email || !verifyUnsubscribe(email, token)) {
    return NextResponse.json(
      { error: "This unsubscribe link is invalid or expired." },
      { status: 400, headers: rlHeaders },
    );
  }

  // Service-role client: newsletter_subscribers has no delete RLS policy by
  // design (anon can only insert/select), so the only way to remove a row is
  // through this token-gated route. The HMAC check above is the authorization.
  const supabase = createServiceClient();
  const { error } = await (supabase.from("newsletter_subscribers") as any)
    .delete()
    .eq("email", email);

  if (error) {
    return NextResponse.json(
      { error: "Couldn't update your subscription. Try again in a moment." },
      { status: 500, headers: rlHeaders },
    );
  }

  return NextResponse.json({ data: { success: true } }, { headers: rlHeaders });
}
