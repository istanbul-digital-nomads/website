import "server-only";

import { createServiceClient } from "@/lib/supabase/server";
import { computeFeeBreakdown } from "./fees";

// Ticket ledger operations. All run with the service-role client
// because plan_tickets has no client-writable RLS policy - money rows
// are only ever touched by these server-side helpers (checkout,
// callback, payout cron, refund/dispute handlers).

type AnySupabase = { from: (t: string) => any };

export type CreatePendingTicketInput = {
  planId: string;
  attendeeId: string;
  hostId: string;
  entryFeeCents: number;
  conversationId: string;
};

export async function createPendingTicket(input: CreatePendingTicketInput) {
  const sb = createServiceClient() as unknown as AnySupabase;
  const fees = computeFeeBreakdown(input.entryFeeCents);
  const { data, error } = await sb
    .from("plan_tickets")
    .insert({
      plan_id: input.planId,
      attendee_id: input.attendeeId,
      host_id: input.hostId,
      gross_cents: fees.grossCents,
      platform_fee_cents: fees.platformFeeCents,
      processor_fee_cents: fees.processorFeeCents,
      net_to_host_cents: fees.netToHostCents,
      currency: "TRY",
      status: "pending",
      payment_provider: "iyzico",
      conversation_id: input.conversationId,
    })
    .select("*")
    .single();
  return { data, error };
}

export async function markTicketHeld(
  conversationId: string,
  paymentIntentId: string,
) {
  const sb = createServiceClient() as unknown as AnySupabase;
  const { error } = await sb
    .from("plan_tickets")
    .update({
      status: "held",
      payment_intent_id: paymentIntentId,
      paid_at: new Date().toISOString(),
    })
    .eq("conversation_id", conversationId)
    .eq("status", "pending");
  return { error };
}

export async function markTicketFailed(conversationId: string) {
  const sb = createServiceClient() as unknown as AnySupabase;
  const { error } = await sb
    .from("plan_tickets")
    .update({ status: "failed" })
    .eq("conversation_id", conversationId)
    .eq("status", "pending");
  return { error };
}

export async function refundTicket(ticketId: string, reason: string) {
  const sb = createServiceClient() as unknown as AnySupabase;
  const { error } = await sb
    .from("plan_tickets")
    .update({
      status: "refunded",
      refunded_at: new Date().toISOString(),
      refunded_reason: reason,
    })
    .eq("id", ticketId)
    .in("status", ["held", "disputed"]);
  return { error };
}

export async function openDispute(ticketId: string, reason: string) {
  const sb = createServiceClient() as unknown as AnySupabase;
  const { error } = await sb
    .from("plan_tickets")
    .update({
      status: "disputed",
      disputed_at: new Date().toISOString(),
      dispute_reason: reason,
    })
    .eq("id", ticketId)
    .eq("status", "held");
  return { error };
}

// Used by the payout-release cron: flip held -> released for tickets
// whose plan ended >= holdbackDays ago and have no open dispute.
export async function releaseClearedTickets(holdbackDays: number) {
  const sb = createServiceClient() as unknown as AnySupabase;
  const cutoff = new Date(
    Date.now() - holdbackDays * 24 * 60 * 60 * 1000,
  ).toISOString();
  // paid_at is the capture time; for v1 we hold from capture. A future
  // refinement keys off plan end-time instead.
  const { data, error } = await sb
    .from("plan_tickets")
    .update({ status: "released", released_at: new Date().toISOString() })
    .eq("status", "held")
    .lt("paid_at", cutoff)
    .select("id");
  return { releasedCount: data?.length ?? 0, error };
}
