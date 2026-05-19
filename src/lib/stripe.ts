import "server-only";

/**
 * Stripe Checkout integration for paid events (Design System v2 Phase 4).
 *
 * STATUS: stubbed. There is no Stripe account/keys wired up yet, so this
 * module is env-gated. When `STRIPE_SECRET_KEY` is present a real Checkout
 * session should be created here; until then `createEventCheckout` returns
 * `null` and callers fall back to the free Telegram RSVP path. No fake
 * payment UI is shown - an unconfigured paywall is a dead end, not a lie.
 */

export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

export type EventCheckoutInput = {
  eventId: string;
  title: string;
  priceTry: number;
};

/**
 * Create a Stripe Checkout session for a paid event seat. Returns the
 * hosted-checkout URL, or `null` when Stripe isn't configured yet.
 *
 * TODO: when STRIPE_SECRET_KEY is set, install `stripe`, create a session
 * with the TRY price, capture the seat in Supabase on the webhook, and
 * return `session.url`.
 */
export async function createEventCheckout(
  _input: EventCheckoutInput,
): Promise<string | null> {
  if (!isStripeConfigured()) return null;
  // Intentionally unimplemented until Stripe is provisioned.
  return null;
}
