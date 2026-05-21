// Member activity aggregation - powers the "fun and good" profile
// sections (past plans, neighborhood passport, people you've met).
// One Supabase round-trip per profile load, scoped to attended plans
// only (plan_attendees.status='going' or 'confirmed').
//
// Hot path: /members/[id] renders this synchronously inside its
// async server component. Wrapped in `use cache` with a short TTL so
// repeated profile loads from a busy hood don't fan out.

import { cacheLife, cacheTag } from "next/cache";
import { createPublicClient } from "./supabase/server";

export type PastPlan = {
  id: string;
  title: string;
  scheduled_date: string;
  vibe: string | null;
  neighborhood_slug: string | null;
};

export type UpcomingPlan = PastPlan & {
  // True when the member is the plan creator (host) vs an attendee.
  // Drives a HOSTING vs GOING chip on the profile section.
  isHost: boolean;
};

export type CoAttendee = {
  id: string;
  display_name: string;
  avatar_url: string | null;
  // How many distinct plans this person shares with the subject.
  shared_count: number;
};

export type TrustSignals = {
  // Total plans the member has hosted (creator_id = member, any
  // status). Includes future-scheduled plans.
  hostedCount: number;
  // Subset of hostedCount with status='cancelled'. Powers the
  // 'Reliable host' badge - shown when hostedCount >= 3 and
  // cancelledHostedCount = 0.
  cancelledHostedCount: number;
  // Past plans the member attended (creator !== member, scheduled
  // before today, attended status).
  joinedCount: number;
  // Times the member was marked no_show by a host. Drives the 'All
  // on time' badge - shown when joinedCount >= 3 and noShowCount = 0.
  // We never display this number directly - it's a silent gate, no
  // shaming.
  noShowCount: number;
  // ISO date string of the most recent plan they attended. Null when
  // they've attended none.
  lastAttendedDate: string | null;
};

export type MemberActivity = {
  pastPlans: PastPlan[];
  upcomingPlans: UpcomingPlan[];
  totalPlanCount: number;
  neighborhoodsVisited: string[];
  coAttendees: CoAttendee[];
  trustSignals: TrustSignals;
};

const PAST_PLANS_LIMIT = 6;
const UPCOMING_PLANS_LIMIT = 6;
const CO_ATTENDEES_LIMIT = 8;

// "Attended" = the member appears in plan_attendees with one of these
// statuses. Excludes cancelled / waitlisted / no_show / requested.
const ATTENDED_STATUSES = ["going", "confirmed"] as const;
// "Trust-aware" pulls a wider set including no_show so we can count
// it for the silent gate.
const TRUST_AWARE_STATUSES = ["going", "confirmed", "no_show"] as const;

export async function getMemberActivity(
  memberId: string,
): Promise<MemberActivity> {
  "use cache";
  cacheLife("minutes");
  cacheTag("member-activity");

  const supabase = createPublicClient() as unknown as {
    from: (t: string) => any;
  };

  // Run all four independent queries in parallel:
  //   1. Plans the member attended (includes hosted - auto-attend row).
  //      creator_id pulled so we can flag HOSTING vs GOING on upcoming.
  //   2-4. Trust-signal counts (hosted / cancelled-hosted / no-show).
  // The co-attendees query (query 5) still runs after because it needs the
  // planIds returned by query 1.
  const [
    { data: attendances },
    { count: hostedCountRaw },
    { count: cancelledHostedCountRaw },
    { count: noShowCountRaw },
  ] = await Promise.all([
    supabase
      .from("plan_attendees")
      .select(
        `
        plan_id,
        status,
        plan:plans (
          id, title, scheduled_date, creator_id,
          stops:plan_stops (vibe, neighborhood_slug, ordinal)
        )
      `,
      )
      .eq("member_id", memberId)
      .in("status", ATTENDED_STATUSES as unknown as string[]),
    supabase
      .from("plans")
      .select("id", { count: "exact", head: true })
      .eq("creator_id", memberId),
    supabase
      .from("plans")
      .select("id", { count: "exact", head: true })
      .eq("creator_id", memberId)
      .eq("status", "cancelled"),
    supabase
      .from("plan_attendees")
      .select("plan_id", { count: "exact", head: true })
      .eq("member_id", memberId)
      .eq("status", "no_show"),
  ]);

  const rows = (attendances ?? []) as Array<{
    plan_id: string;
    status: string;
    plan: {
      id: string;
      title: string;
      scheduled_date: string;
      creator_id: string;
      stops: Array<{
        vibe: string | null;
        neighborhood_slug: string | null;
        ordinal: number;
      }>;
    } | null;
  }>;

  const plans = rows
    .map((r) => r.plan)
    .filter((p): p is NonNullable<typeof p> => p != null);

  // Split into past / upcoming on today's date in Istanbul. Use plain
  // YYYY-MM-DD string comparison (scheduled_date is a DATE column).
  const todayIstanbul = new Date().toLocaleDateString("en-CA", {
    timeZone: "Europe/Istanbul",
  });

  // Most recent past plans first.
  const past = plans
    .filter((p) => p.scheduled_date < todayIstanbul)
    .sort((a, b) => b.scheduled_date.localeCompare(a.scheduled_date));
  // Soonest upcoming first (today, then tomorrow, then...).
  const upcoming = plans
    .filter((p) => p.scheduled_date >= todayIstanbul)
    .sort((a, b) => a.scheduled_date.localeCompare(b.scheduled_date));

  const summarize = (p: (typeof plans)[number]): PastPlan => {
    const firstStop = (p.stops ?? [])
      .slice()
      .sort((a, b) => a.ordinal - b.ordinal)[0];
    return {
      id: p.id,
      title: p.title,
      scheduled_date: p.scheduled_date,
      vibe: firstStop?.vibe ?? null,
      neighborhood_slug: firstStop?.neighborhood_slug ?? null,
    };
  };
  const pastPlans: PastPlan[] = past.slice(0, PAST_PLANS_LIMIT).map(summarize);
  const upcomingPlans: UpcomingPlan[] = upcoming
    .slice(0, UPCOMING_PLANS_LIMIT)
    .map((p) => ({ ...summarize(p), isHost: p.creator_id === memberId }));

  // Distinct neighborhood slugs across every stop on every attended
  // plan. Powers the neighborhood passport section.
  const hoodSet = new Set<string>();
  for (const plan of plans) {
    for (const stop of plan.stops ?? []) {
      if (stop.neighborhood_slug) hoodSet.add(stop.neighborhood_slug);
    }
  }

  // 2. Other members on those plans. Aggregate by member, sort by
  //    shared_count descending, limit.
  const planIds = plans.map((p) => p.id);
  let coAttendees: CoAttendee[] = [];
  if (planIds.length > 0) {
    const { data: others } = await supabase
      .from("plan_attendees")
      .select(
        `
        plan_id,
        member:members (id, display_name, avatar_url, is_visible)
      `,
      )
      .in("plan_id", planIds)
      .in("status", ATTENDED_STATUSES as unknown as string[]);
    const otherRows = (others ?? []) as Array<{
      plan_id: string;
      member: {
        id: string;
        display_name: string;
        avatar_url: string | null;
        is_visible: boolean;
      } | null;
    }>;
    const counts = new Map<string, CoAttendee>();
    for (const row of otherRows) {
      if (!row.member) continue;
      if (row.member.id === memberId) continue;
      if (!row.member.is_visible) continue;
      const existing = counts.get(row.member.id);
      if (existing) {
        existing.shared_count += 1;
      } else {
        counts.set(row.member.id, {
          id: row.member.id,
          display_name: row.member.display_name,
          avatar_url: row.member.avatar_url,
          shared_count: 1,
        });
      }
    }
    coAttendees = Array.from(counts.values())
      .sort((a, b) => b.shared_count - a.shared_count)
      .slice(0, CO_ATTENDEES_LIMIT);
  }

  // Trust-signal counts are now fetched in the parallel batch above.
  void TRUST_AWARE_STATUSES;

  const trustSignals: TrustSignals = {
    hostedCount: hostedCountRaw ?? 0,
    cancelledHostedCount: cancelledHostedCountRaw ?? 0,
    joinedCount: past.filter((p) => p.creator_id !== memberId).length,
    noShowCount: noShowCountRaw ?? 0,
    lastAttendedDate: past[0]?.scheduled_date ?? null,
  };

  return {
    pastPlans,
    upcomingPlans,
    totalPlanCount: plans.length,
    neighborhoodsVisited: Array.from(hoodSet).sort(),
    coAttendees,
    trustSignals,
  };
}
