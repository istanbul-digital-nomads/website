import "server-only";

// iyzico marketplace integration (Phase 5).
//
// STATUS: env-gated, sandbox-ready. There are no iyzico credentials
// wired up yet, so every call is guarded by `isIyzicoConfigured()`.
// When IYZICO_API_KEY + IYZICO_SECRET_KEY + IYZICO_BASE_URL are
// present, the real REST calls run; until then each function returns
// a typed "not configured" result and callers surface a clean
// "payments aren't live yet" state (never a fake payment UI).
//
// iyzico's marketplace model:
//   - Platform = main merchant.
//   - Each guide = a sub-merchant (created once, key stored on
//     members.iyzico_submerchant_key).
//   - A checkout splits the payment: platform keeps its fee, the
//     sub-merchant's share is held in escrow, released on payout.
//
// The official `iyzipay` Node SDK handles HMAC auth. We call it
// lazily (dynamic import) so the dependency is only loaded when
// configured - keeps it off the bundle for the common unconfigured
// path and avoids a hard failure if the package isn't installed yet.

export function isIyzicoConfigured(): boolean {
  return Boolean(
    process.env.IYZICO_API_KEY &&
    process.env.IYZICO_SECRET_KEY &&
    process.env.IYZICO_BASE_URL,
  );
}

export type CheckoutInit =
  | { ok: true; token: string; checkoutUrl: string }
  | { ok: false; reason: "not_configured" | "error"; message?: string };

export type CheckoutInput = {
  conversationId: string;
  grossCents: number;
  currency: "TRY";
  planTitle: string;
  buyer: {
    id: string;
    name: string;
    email: string;
  };
  // The guide's iyzico sub-merchant key + their net share in cents.
  submerchantKey: string;
  netToHostCents: number;
  callbackUrl: string;
};

// Initialise a checkout-form session. Returns a token + hosted URL the
// client redirects to / embeds. Stubbed until configured.
export async function createCheckout(
  input: CheckoutInput,
): Promise<CheckoutInit> {
  if (!isIyzicoConfigured()) {
    return { ok: false, reason: "not_configured" };
  }
  try {
    // When live: build an iyzipay.checkoutFormInitialize request with
    // basketItems carrying the sub-merchant split. Left as the single
    // integration point to fill once keys + the iyzipay SDK land.
    //
    // const Iyzipay = (await import("iyzipay")).default;
    // const client = new Iyzipay({ apiKey, secretKey, uri });
    // const res = await new Promise(...) ...
    // return { ok: true, token: res.token, checkoutUrl: res.paymentPageUrl };
    void input;
    return {
      ok: false,
      reason: "error",
      message: "iyzico live integration not yet implemented",
    };
  } catch (e) {
    return {
      ok: false,
      reason: "error",
      message: e instanceof Error ? e.message : "iyzico checkout failed",
    };
  }
}

export type PaymentStatus =
  | { ok: true; status: "captured"; paymentId: string }
  | { ok: true; status: "pending" | "failure" }
  | { ok: false; reason: "not_configured" | "error"; message?: string };

// Verify a checkout result by token (called from the callback route).
export async function verifyPayment(token: string): Promise<PaymentStatus> {
  if (!isIyzicoConfigured()) return { ok: false, reason: "not_configured" };
  try {
    // When live: checkoutForm.retrieve({ token }) -> map paymentStatus.
    void token;
    return { ok: false, reason: "error", message: "not implemented" };
  } catch (e) {
    return {
      ok: false,
      reason: "error",
      message: e instanceof Error ? e.message : "verify failed",
    };
  }
}

export type SubmerchantResult =
  | { ok: true; submerchantKey: string }
  | { ok: false; reason: "not_configured" | "error"; message?: string };

// Create / fetch the guide's sub-merchant record (one-time). Called
// when a verified guide adds their payout IBAN.
export async function ensureSubmerchant(input: {
  memberId: string;
  name: string;
  iban: string;
  email: string;
}): Promise<SubmerchantResult> {
  if (!isIyzicoConfigured()) return { ok: false, reason: "not_configured" };
  try {
    void input;
    return { ok: false, reason: "error", message: "not implemented" };
  } catch (e) {
    return {
      ok: false,
      reason: "error",
      message: e instanceof Error ? e.message : "submerchant failed",
    };
  }
}

export type PayoutResult =
  | { ok: true }
  | { ok: false; reason: "not_configured" | "error"; message?: string };

// Approve the sub-merchant's escrowed share for a captured payment
// (iyzico "approve" call). Called by the payout-release cron once the
// 7-day holdback clears.
export async function releaseToSubmerchant(input: {
  paymentTransactionId: string;
}): Promise<PayoutResult> {
  if (!isIyzicoConfigured()) return { ok: false, reason: "not_configured" };
  try {
    void input;
    return { ok: false, reason: "error", message: "not implemented" };
  } catch (e) {
    return {
      ok: false,
      reason: "error",
      message: e instanceof Error ? e.message : "release failed",
    };
  }
}

export type RefundResult =
  | { ok: true }
  | { ok: false; reason: "not_configured" | "error"; message?: string };

export async function refundPayment(input: {
  paymentTransactionId: string;
  amountCents: number;
}): Promise<RefundResult> {
  if (!isIyzicoConfigured()) return { ok: false, reason: "not_configured" };
  try {
    void input;
    return { ok: false, reason: "error", message: "not implemented" };
  } catch (e) {
    return {
      ok: false,
      reason: "error",
      message: e instanceof Error ? e.message : "refund failed",
    };
  }
}
