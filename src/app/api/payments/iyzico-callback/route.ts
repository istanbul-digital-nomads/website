import { NextResponse } from "next/server";
import { verifyPayment } from "@/lib/payments/iyzico";
import { markTicketHeld, markTicketFailed } from "@/lib/payments/tickets";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://istanbulnomads.com";

// iyzico posts the checkout result here (form POST with token). We
// verify with iyzico, then flip the pending ticket to held (captured)
// or failed, and redirect the attendee back to the plan with a status
// flag. GET is also handled for the redirect-style flow.
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

  const result = await verifyPayment(token);
  if (result.ok && result.status === "captured") {
    await markTicketHeld(conversationId, result.paymentId);
    return NextResponse.redirect(`${SITE}/dashboard?pay=success`);
  }

  await markTicketFailed(conversationId);
  return NextResponse.redirect(`${SITE}/dashboard?pay=failed`);
}

export async function POST(request: Request) {
  return handle(request);
}
export async function GET(request: Request) {
  return handle(request);
}
