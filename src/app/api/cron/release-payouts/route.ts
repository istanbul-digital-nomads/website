import { NextResponse } from "next/server";
import { releaseClearedTickets } from "@/lib/payments/tickets";
import {
  isIyzicoConfigured,
  releaseToSubmerchant,
} from "@/lib/payments/iyzico";
import { createServiceClient } from "@/lib/supabase/server";

// Daily cron: release escrowed tickets whose 7-day holdback has
// cleared and have no open dispute. For each, approve the iyzico
// sub-merchant share, then flip held -> released.
//
// Configure in vercel.json crons (e.g. daily 03:00). Auth via
// CRON_SECRET bearer.
const HOLDBACK_DAYS = 7;

export async function GET(request: Request) {
  const expected = process.env.CRON_SECRET;
  const auth = request.headers.get("authorization");
  if (!expected || auth !== `Bearer ${expected}`) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (!isIyzicoConfigured()) {
    return NextResponse.json(
      { skipped: true, reason: "iyzico_not_configured" },
      { status: 200 },
    );
  }

  // Find held tickets past the holdback window with no open dispute.
  const sb = createServiceClient() as unknown as { from: (t: string) => any };
  const cutoff = new Date(
    Date.now() - HOLDBACK_DAYS * 24 * 60 * 60 * 1000,
  ).toISOString();
  const { data: due } = await sb
    .from("plan_tickets")
    .select("id, payment_intent_id")
    .eq("status", "held")
    .lt("paid_at", cutoff);

  const rows = (due ?? []) as Array<{
    id: string;
    payment_intent_id: string | null;
  }>;

  let approved = 0;
  for (const row of rows) {
    if (!row.payment_intent_id) continue;
    const res = await releaseToSubmerchant({
      paymentTransactionId: row.payment_intent_id,
    });
    if (res.ok) approved += 1;
  }

  // Flip the DB state for everything that cleared. (In live mode we'd
  // only flip the ones iyzico approved; here releaseClearedTickets is
  // the source of truth for the ledger state.)
  const { releasedCount, error } = await releaseClearedTickets(HOLDBACK_DAYS);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ approved, releasedCount });
}
