import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { notifyMember } from "@/lib/notifications/notify";
import { todayInIstanbul } from "@/lib/plans/expiry";
import { planIncludesSpot, type MatchStop } from "@/lib/spots/match";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://istanbulnomads.com";

interface SavedSpot {
  id: string;
  member_id: string;
  label: string;
  space_id: string | null;
  lat: number | string;
  lng: number | string;
}

interface PlanRow {
  id: string;
  title: string;
  creator_id: string;
  stops: MatchStop[];
}

// Cron: ping members when an active, upcoming plan stops by a spot they've
// saved and toggled on. Idempotent via spot_match_notifications (one row per
// spot+plan). Mirrors the auth + shape of plan-reminders.
export async function GET(request: Request) {
  const expected = process.env.CRON_SECRET;
  const auth = request.headers.get("authorization");
  if (!expected || auth !== `Bearer ${expected}`) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const supabase = createServiceClient() as unknown as {
    from: (t: string) => any;
  };

  const { data: spotsData } = await supabase
    .from("saved_spots")
    .select("id, member_id, label, space_id, lat, lng")
    .eq("notify_on_plan_match", true);
  const spots = (spotsData ?? []) as SavedSpot[];
  if (spots.length === 0) {
    return NextResponse.json({ data: { matched: [] } });
  }

  const today = todayInIstanbul();
  const { data: plansData, error } = await supabase
    .from("plans")
    .select(
      `
      id, title, creator_id,
      stops:plan_stops ( space_id, lat, lng )
      `,
    )
    .eq("status", "active")
    .gte("scheduled_date", today);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  const plans = (plansData ?? []) as PlanRow[];

  // Pairs we've already pinged about, so we never double-notify.
  const { data: seenData } = await supabase
    .from("spot_match_notifications")
    .select("saved_spot_id, plan_id");
  const seen = new Set(
    ((seenData ?? []) as Array<{ saved_spot_id: string; plan_id: string }>).map(
      (r) => `${r.saved_spot_id}:${r.plan_id}`,
    ),
  );

  const matched: Array<{ spotId: string; planId: string }> = [];

  for (const spot of spots) {
    for (const plan of plans) {
      // Don't ping the plan's own host about their own plan.
      if (plan.creator_id === spot.member_id) continue;
      const key = `${spot.id}:${plan.id}`;
      if (seen.has(key)) continue;
      if (!planIncludesSpot(spot, plan.stops)) continue;

      // notifyMember gates on the recipient's master switch + notify_spot_matches
      // toggle + Telegram subscription, and localizes the message.
      await notifyMember({
        recipientId: spot.member_id,
        category: "spot_matches",
        messageKey: "spotMatch",
        values: { spot: spot.label, title: plan.title },
        cta: { labelKey: "ctaOpenPlan", url: `${SITE}/plans/${plan.id}` },
      });

      await supabase
        .from("spot_match_notifications")
        .insert({ saved_spot_id: spot.id, plan_id: plan.id });
      seen.add(key);
      matched.push({ spotId: spot.id, planId: plan.id });
    }
  }

  return NextResponse.json({ data: { matched } });
}
