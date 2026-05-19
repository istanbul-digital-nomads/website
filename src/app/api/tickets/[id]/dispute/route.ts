import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { openDispute } from "@/lib/payments/tickets";

const disputeSchema = z.object({
  reason: z.string().trim().min(10).max(1000),
});

// Attendee files a dispute on a held ticket within 7 days of the
// plan's scheduled date. Freezes the payout (status held -> disputed);
// an organizer resolves it manually via Supabase for v1.
const DISPUTE_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;

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

  const body = await request.json().catch(() => null);
  const parsed = disputeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 },
    );
  }

  const sb = supabase as unknown as { from: (t: string) => any };
  const { data: ticket } = await sb
    .from("plan_tickets")
    .select("id, attendee_id, status, plan:plans(scheduled_date)")
    .eq("id", ticketId)
    .maybeSingle();

  if (!ticket || ticket.attendee_id !== user.id) {
    return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
  }
  if (ticket.status !== "held") {
    return NextResponse.json(
      { error: "Only an active (held) ticket can be disputed." },
      { status: 400 },
    );
  }
  const scheduled = ticket.plan?.scheduled_date
    ? new Date(`${ticket.plan.scheduled_date}T00:00:00+03:00`)
    : null;
  if (scheduled && Date.now() - scheduled.getTime() > DISPUTE_WINDOW_MS) {
    return NextResponse.json(
      { error: "Dispute window closed (more than 7 days after the plan)." },
      { status: 400 },
    );
  }

  const { error } = await openDispute(ticketId, parsed.data.reason);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
