import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { createClient } from "@/lib/supabase/server";
import { rateLimit, rateLimitHeaders } from "@/lib/rate-limit";
import { isIyzicoConfigured, createCheckout } from "@/lib/payments/iyzico";
import { createPendingTicket } from "@/lib/payments/tickets";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://istanbulnomads.com";
const LIMIT = 20;
const WINDOW_MS = 60 * 60 * 1000;

// Start a checkout for a ticketed plan. Creates a pending plan_ticket
// + an iyzico checkout session, returns the hosted checkout URL. When
// iyzico isn't configured yet, returns 503 with a clear flag so the
// UI shows "payments aren't live yet" instead of a dead button.
export async function POST(
  request: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id: planId } = await ctx.params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rl = await rateLimit(`checkout:${user.id}`, LIMIT, WINDOW_MS);
  const headers = rateLimitHeaders(rl, LIMIT);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: `Too many attempts. Retry in ${rl.retryAfterSeconds}s.` },
      { status: 429, headers },
    );
  }

  const sb = supabase as unknown as { from: (t: string) => any };

  // Load the plan + host + entry fee. Only ticketed, active plans are
  // purchasable, and not your own plan.
  const { data: plan } = await sb
    .from("plans")
    .select("id, title, creator_id, status, is_ticketed")
    .eq("id", planId)
    .maybeSingle();
  if (!plan || !plan.is_ticketed || plan.status !== "active") {
    return NextResponse.json(
      { error: "Plan is not available for purchase." },
      { status: 400, headers },
    );
  }
  if (plan.creator_id === user.id) {
    return NextResponse.json(
      { error: "You host this plan - no ticket needed." },
      { status: 400, headers },
    );
  }

  // entry_fee_cents lives on the first ticketed stop.
  const { data: stop } = await sb
    .from("plan_stops")
    .select("entry_fee_cents, currency")
    .eq("plan_id", planId)
    .not("entry_fee_cents", "is", null)
    .order("ordinal", { ascending: true })
    .limit(1)
    .maybeSingle();
  const entryFeeCents: number | null = stop?.entry_fee_cents ?? null;
  if (!entryFeeCents || entryFeeCents <= 0) {
    return NextResponse.json(
      { error: "This plan has no entry fee set." },
      { status: 400, headers },
    );
  }

  // Host must have a sub-merchant key to receive the split.
  const { data: host } = await sb
    .from("members")
    .select("id, iyzico_submerchant_key, display_name")
    .eq("id", plan.creator_id)
    .maybeSingle();

  if (!isIyzicoConfigured()) {
    return NextResponse.json(
      { error: "payments_not_live", configured: false },
      { status: 503, headers },
    );
  }

  if (!host?.iyzico_submerchant_key) {
    return NextResponse.json(
      { error: "Host hasn't finished payout setup yet." },
      { status: 409, headers },
    );
  }

  const conversationId = randomUUID();
  const { data: ticket, error: ticketErr } = await createPendingTicket({
    planId,
    attendeeId: user.id,
    hostId: plan.creator_id,
    entryFeeCents,
    conversationId,
  });
  if (ticketErr || !ticket) {
    return NextResponse.json(
      { error: ticketErr?.message ?? "Could not create ticket" },
      { status: 500, headers },
    );
  }

  const checkout = await createCheckout({
    conversationId,
    grossCents: entryFeeCents,
    currency: "TRY",
    planTitle: plan.title,
    buyer: {
      id: user.id,
      name: user.email ?? "Member",
      email: user.email ?? "",
    },
    submerchantKey: host.iyzico_submerchant_key,
    netToHostCents: ticket.net_to_host_cents,
    callbackUrl: `${SITE}/api/payments/iyzico-callback?c=${conversationId}`,
  });

  if (!checkout.ok) {
    return NextResponse.json(
      { error: checkout.message ?? "Checkout init failed" },
      { status: 502, headers },
    );
  }

  return NextResponse.json(
    { checkoutUrl: checkout.checkoutUrl, token: checkout.token },
    { status: 200, headers },
  );
}
