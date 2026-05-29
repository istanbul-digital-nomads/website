// Adapters that turn Ali Sameni's static showcase week (src/lib/ali-week.ts)
// into the same PlanCardSummary shape the live plans feed and detail UI use.
// We keep these as static data (not Supabase rows) on purpose: the feed only
// surfaces plans dated today..+7 that haven't expired, and the /plans/[id]
// detail route is login-gated - neither fits a permanent, public showcase.
// Rendering from static data keeps Ali's week always visible and public.

import type { PlanVibe } from "@/lib/plans/vibes";
import type { PlanCardSummary, PlanStop } from "@/lib/plans/queries";
import { aliMember, aliWeek, type AliDayPlan, type AliStop } from "@/lib/ali-week";

// Synthetic id namespace so the feed can tell Ali's cards apart from DB plans
// and point them at their static detail pages instead of /plans/[id].
export const ALI_PLAN_ID_PREFIX = "ali-week-";

const NEIGHBORHOOD_SLUG: Record<AliDayPlan["neighborhood"], string> = {
  Kadıköy: "kadikoy",
  Şişli: "sisli",
  Beyoğlu: "beyoglu",
};

// Vibe per stop, derived from what Ali actually does there (not invented data -
// these label the activity already described in each stop's note).
const STOP_VIBES: Record<string, PlanVibe> = {
  "mon-1": "cowork",
  "mon-2": "outdoor",
  "mon-3": "meal",
  "mon-4": "culture",
  "tue-1": "focus",
  "tue-2": "meal",
  "tue-3": "outdoor",
  "tue-4": "after-work",
  "wed-1": "cowork",
  "wed-2": "meal",
  "wed-3": "culture",
  "wed-4": "outdoor",
  "thu-1": "focus",
  "thu-2": "meal",
  "thu-3": "outdoor",
  "thu-4": "outdoor",
  "fri-1": "cowork",
  "fri-2": "meal",
  "fri-3": "social",
  "fri-4": "after-work",
  "sat-1": "meal",
  "sat-2": "outdoor",
  "sat-3": "social",
  "sat-4": "after-work",
  "sun-1": "meal",
  "sun-2": "meal",
  "sun-3": "outdoor",
  "sun-4": "meal",
};

export function daySlug(day: AliDayPlan): string {
  return day.weekday.toLowerCase(); // mon..sun
}

export function aliPlanId(day: AliDayPlan): string {
  return `${ALI_PLAN_ID_PREFIX}${daySlug(day)}`;
}

export const aliDaySlugs: string[] = aliWeek.map(daySlug);

export function getAliDayBySlug(slug: string): AliDayPlan | undefined {
  return aliWeek.find((d) => daySlug(d) === slug.toLowerCase());
}

// `/plans/ali-week/mon` for Ali's cards; null for real DB plans.
export function aliDetailHref(planId: string): string | null {
  if (!planId.startsWith(ALI_PLAN_ID_PREFIX)) return null;
  return `/plans/ali-week/${planId.slice(ALI_PLAN_ID_PREFIX.length)}`;
}

// "09:00 – 11:30" (en-dash or hyphen) -> { start: "09:00", end: "11:30" }.
function parseTime(time: string): {
  start: string | null;
  end: string | null;
} {
  const [start, end] = time.split(/\s*[–-]\s*/).map((p) => p.trim());
  return { start: start || null, end: end || null };
}

function toPlanStop(
  stop: AliStop,
  ordinal: number,
  neighborhoodSlug: string,
  planId: string,
  isoDate: string,
): PlanStop {
  const { start, end } = parseTime(stop.time);
  return {
    id: stop.id,
    plan_id: planId,
    ordinal,
    space_id: null,
    custom_location: stop.title,
    neighborhood_slug: neighborhoodSlug,
    lat: stop.lat,
    lng: stop.lng,
    start_time: start,
    end_time: end,
    vibe: STOP_VIBES[stop.id] ?? "social",
    notes: stop.note,
    transport_mode: null,
    transport_price_min: null,
    transport_price_max: null,
    cost_min_cents: null,
    cost_max_cents: null,
    created_at: `${isoDate}T08:00:00.000Z`,
  };
}

export function aliDayToPlanCard(day: AliDayPlan): PlanCardSummary {
  const planId = aliPlanId(day);
  const slug = NEIGHBORHOOD_SLUG[day.neighborhood];
  const host: NonNullable<PlanCardSummary["host"]> = {
    id: `${ALI_PLAN_ID_PREFIX}host`,
    display_name: aliMember.name,
    avatar_url: null,
    city_district: day.neighborhood,
    member_type: "nomad",
    verification_level: "verified",
  };
  return {
    id: planId,
    creator_id: host.id,
    scheduled_date: day.date,
    title: day.title,
    capacity: null,
    status: "active",
    reminder_sent_at: null,
    expires_at: `${day.date}T23:59:59.000Z`,
    language: "en",
    is_ticketed: false,
    entry_fee_cents: null,
    budget_per_person_min_cents: null,
    budget_per_person_max_cents: null,
    currency: "TRY",
    host_role_at_creation: "nomad",
    host_badge_at_creation: "verified",
    created_at: `${day.date}T08:00:00.000Z`,
    updated_at: `${day.date}T08:00:00.000Z`,
    host,
    attendees: [],
    attendee_count: 0,
    stops: day.stops.map((s, i) =>
      toPlanStop(s, i + 1, slug, planId, day.date),
    ),
  };
}

export function aliPlanCards(): PlanCardSummary[] {
  return aliWeek.map(aliDayToPlanCard);
}
