import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { isIyzicoConfigured, refundPayment } from "@/lib/payments/iyzico";
import { refundTicket } from "@/lib/payments/tickets";
import { notifyMember } from "@/lib/notifications/notify";
import { SITE_URL } from "@/lib/seo";

// Attendee-initiated refund. Allowed only 24h+ before the plan's
// scheduled date (the T&C cancellation window). Full refund, ticket
// flips held -> refunded.
const REFUND_WINDOW_MS = 24 * 60 * 60 * 1000;

export async function POST(
  request: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id: ticketId } = await ctx.params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Verify the ticket belongs to this attendee + is refundable.
  const sb = supabase as unknown as { from: (t: string) => any };
  const { data: ticket } = await sb
    .from("plan_tickets")
    .select(
      "id, attendee_id, status, gross_cents, payment_intent_id, plan_id, plan:plans(scheduled_date, creator_id, title)",
    )
    .eq("id", ticketId)
    .maybeSingle();

  if (!ticket || ticket.attendee_id !== user.id) {
    return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
  }
  if (ticket.status !== "held") {
    return NextResponse.json(
      { error: "This ticket can't be refunded." },
      { status: 400 },
    );
  }

  const scheduled = ticket.plan?.scheduled_date
    ? new Date(`${ticket.plan.scheduled_date}T00:00:00+03:00`)
    : null;
  if (scheduled && scheduled.getTime() - Date.now() < REFUND_WINDOW_MS) {
    return NextResponse.json(
      { error: "Refund window closed (less than 24h before the plan)." },
      { status: 400 },
    );
  }

  // Process iyzico refund first (when live), then flip ledger state.
  if (isIyzicoConfigured() && ticket.payment_intent_id) {
    const res = await refundPayment({
      paymentTransactionId: ticket.payment_intent_id,
      amountCents: ticket.gross_cents,
    });
    if (!res.ok) {
      return NextResponse.json(
        { error: res.message ?? "Refund failed at processor" },
        { status: 502 },
      );
    }
  }

  // Ledger update via service role (no client-write policy).
  void createServiceClient;
  const { error } = await refundTicket(ticketId, "attendee_cancelled");
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Tell the host an attendee refunded.
  if (ticket.plan?.creator_id) {
    await notifyMember({
      recipientId: ticket.plan.creator_id,
      actorId: user.id,
      category: "tickets",
      messageKey: "ticketRefunded",
      values: { title: ticket.plan.title },
      cta: {
        labelKey: "ctaOpenPlan",
        url: `${SITE_URL}/plans/${ticket.plan_id}`,
      },
    });
  }

  return NextResponse.json({ ok: true });
}
