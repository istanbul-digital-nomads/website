import { NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import { verifyPayment } from "@/lib/payments/iyzico";
import { markTicketHeld, markTicketFailed } from "@/lib/payments/tickets";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://istanbulnomads.com";

// iyzico posts the checkout result here (form POST with token). We
// verify with iyzico, then flip the pending ticket to held (captured)
// or failed, and redirect the attendee back to the plan with a status
// flag. GET is also handled for the redirect-style flow.
//
// This is the only place a payment becomes "captured", so every failure
// mode is reported rather than swallowed. A THROWN verify (network blip,
// iyzico 5xx) is treated as unknown, not declined: we don't mark the ticket
// failed - the payment may actually have captured - and instead flag it for
// reconciliation so a transient error can't strand a paid attendee.
async function handle(request: Request) {
  const url = new URL(request.url);
  const conversationId = url.searchParams.get("c");
  let token = url.searchParams.get("token");

  // checkout-form posts the token in the body.
  if (!token && request.method === "POST") {
    try {
      const form = await request.formData();
      token = (form.get("token") as string) ?? null;
    } catch {
      // no body
    }
  }

  if (!conversationId || !token) {
    return NextResponse.redirect(`${SITE}/plans?pay=error`);
  }

  let result;
  try {
    result = await verifyPayment(token);
  } catch (err) {
    // Unknown outcome - capture verify may have succeeded at iyzico. Do NOT
    // mark failed; surface it for manual reconciliation.
    Sentry.captureException(err, {
      tags: { area: "payments", step: "verify" },
      extra: { conversationId },
    });
    console.error("iyzico verify threw:", conversationId, err);
    return NextResponse.redirect(`${SITE}/dashboard?pay=pending`);
  }

  try {
    if (result.ok && result.status === "captured") {
      await markTicketHeld(conversationId, result.paymentId);
      return NextResponse.redirect(`${SITE}/dashboard?pay=success`);
    }
    await markTicketFailed(conversationId);
    return NextResponse.redirect(`${SITE}/dashboard?pay=failed`);
  } catch (err) {
    // The processor decision is known but we couldn't persist it - report
    // loudly so the ledger can be reconciled instead of going silent.
    Sentry.captureException(err, {
      tags: { area: "payments", step: "persist" },
      extra: {
        conversationId,
        status: result.ok ? result.status : result.reason,
      },
    });
    console.error("iyzico callback persist failed:", conversationId, err);
    return NextResponse.redirect(`${SITE}/dashboard?pay=pending`);
  }
}

export async function POST(request: Request) {
  return handle(request);
}
export async function GET(request: Request) {
  return handle(request);
}
