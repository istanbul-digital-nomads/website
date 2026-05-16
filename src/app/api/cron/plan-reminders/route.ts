import { NextResponse } from "next/server";
import { createPublicClient } from "@/lib/supabase/server";
import { sendTelegram } from "@/lib/plans/telegram";
import { todayInIstanbul } from "@/lib/plans/expiry";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://istanbulnomads.com";

interface PlanWithAttendees {
  id: string;
  title: string;
  scheduled_date: string;
  start_time: string | null;
  reminder_sent_at: string | null;
  attendees: Array<{
    member_id: string;
    member: { display_name: string } | null;
  }>;
}

export async function GET(request: Request) {
  const expected = process.env.CRON_SECRET;
  const auth = request.headers.get("authorization");
  if (!expected || auth !== `Bearer ${expected}`) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const serviceUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceUrl || !serviceKey) {
    return NextResponse.json(
      { error: "Service role not configured" },
      { status: 503 },
    );
  }

  const supabase = createPublicClient();
  // Window: plans starting in 55-70 min from now, today or tomorrow Istanbul TZ.
  const today = todayInIstanbul();
  const { data: plans, error } = await supabase
    .from("plans")
    .select(
      `
      id, title, scheduled_date, start_time, reminder_sent_at,
      attendees:plan_attendees (
        member_id, member:members(display_name)
      )
      `,
    )
    .eq("status", "active")
    .gte("scheduled_date", today)
    .not("start_time", "is", null)
    .is("reminder_sent_at", null);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const now = new Date();
  const sent: string[] = [];
  for (const raw of (plans ?? []) as unknown as PlanWithAttendees[]) {
    if (!raw.start_time) continue;
    const startISO = `${raw.scheduled_date}T${raw.start_time}+03:00`;
    const start = new Date(startISO).getTime();
    const minutesUntil = (start - now.getTime()) / 60_000;
    if (minutesUntil < 55 || minutesUntil > 70) continue;

    // Lookup chat IDs for all attendees
    const memberIds = raw.attendees.map((a) => a.member_id);
    if (!memberIds.length) continue;

    const subRes = await fetch(
      `${serviceUrl}/rest/v1/telegram_subscriptions?member_id=in.(${memberIds.join(",")})&select=member_id,telegram_chat_id`,
      {
        headers: {
          apikey: serviceKey,
          Authorization: `Bearer ${serviceKey}`,
        },
      },
    );
    const subs =
      ((await subRes.json().catch(() => [])) as Array<{
        telegram_chat_id: number;
      }>) ?? [];

    for (const s of subs) {
      await sendTelegram({
        chatId: s.telegram_chat_id,
        text: `<b>Starting in ~1h:</b> ${escapeHtml(raw.title)}`,
        cta: { text: "Open plan", url: `${SITE}/plans/${raw.id}` },
      });
    }

    // Mark reminder sent
    await fetch(`${serviceUrl}/rest/v1/plans?id=eq.${raw.id}`, {
      method: "PATCH",
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({ reminder_sent_at: new Date().toISOString() }),
    });
    sent.push(raw.id);
  }

  return NextResponse.json({ data: { sent } });
}

function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
