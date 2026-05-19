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

export type CoAttendee = {
  id: string;
  display_name: string;
  avatar_url: string | null;
  // How many distinct plans this person shares with the subject.
  shared_count: number;
};

export type MemberActivity = {
  pastPlans: PastPlan[];
  totalPlanCount: number;
  neighborhoodsVisited: string[];
  coAttendees: CoAttendee[];
};

const PAST_PLANS_LIMIT = 6;
const CO_ATTENDEES_LIMIT = 8;

// "Attended" = the member appears in plan_attendees with one of these
// statuses. Excludes cancelled / waitlisted / no_show.
const ATTENDED_STATUSES = ["going", "confirmed"] as const;

export async function getMemberActivity(
  memberId: string,
): Promise<MemberActivity> {
  "use cache";
  cacheLife("minutes");
  cacheTag("member-activity");

  const supabase = createPublicClient() as unknown as {
    from: (t: string) => any;
  };

  // 1. Plans the member attended (includes plans they hosted - the
  //    auto-attend on createPlan inserts a plan_attendees row).
  const { data: attendances } = await supabase
    .from("plan_attendees")
    .select(
      `
      plan_id,
      status,
      plan:plans (
        id, title, scheduled_date,
        stops:plan_stops (vibe, neighborhood_slug, ordinal)
      )
    `,
    )
    .eq("member_id", memberId)
    .in("status", ATTENDED_STATUSES as unknown as string[]);

  const rows = (attendances ?? []) as Array<{
    plan_id: string;
    status: string;
    plan: {
      id: string;
      title: string;
      scheduled_date: string;
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

  // Most recent N plans, with the first-stop vibe + neighborhood as
  // the plan-level summary (matches how /today renders cards).
  plans.sort((a, b) => b.scheduled_date.localeCompare(a.scheduled_date));
  const pastPlans: PastPlan[] = plans.slice(0, PAST_PLANS_LIMIT).map((p) => {
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
  });

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

  return {
    pastPlans,
    totalPlanCount: plans.length,
    neighborhoodsVisited: Array.from(hoodSet).sort(),
    coAttendees,
  };
}
