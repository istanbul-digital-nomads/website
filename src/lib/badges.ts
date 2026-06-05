// Phase 5: member badges - vanity signals, computed on read.
//
// Two kinds:
//  - "auto" badges come from a member's plan activity (a count threshold or
//    a time-since-first-plan). They're computed here, never stored, so they
//    can't drift out of sync with the underlying numbers.
//  - "manual" badges (best_nomad_year, top_host_year) have no formula - an
//    organizer awards them by hand. Those rows live in the member_badges
//    table; this module just merges the slugs in.
//
// Mirrors the positive-only spirit of the trust pills: a member only ever
// sees badges they've earned, never a "you haven't earned X" prompt.

export type BadgeSlug =
  | "first_plan"
  | "regular"
  | "veteran"
  | "one_year_istanbul"
  | "best_nomad_year"
  | "top_host_year";

export interface BadgeDef {
  slug: BadgeSlug;
  kind: "auto" | "manual";
  // A single glyph rendered in the pill (kept ASCII/emoji-light to match
  // the existing ★ / ✓ trust pills).
  icon: string;
  // Tier badges supersede each other: only the highest count tier a member
  // has reached is shown. `threshold` is the plan count that unlocks it.
  // Undefined for non-tier badges.
  threshold?: number;
}

// The three count tiers, ascending. A member at 7 plans is a "regular",
// not also a "first_plan" holder - we show the top tier only.
export const TIER_BADGES: BadgeDef[] = [
  { slug: "first_plan", kind: "auto", icon: "•", threshold: 1 },
  { slug: "regular", kind: "auto", icon: "◆", threshold: 5 },
  { slug: "veteran", kind: "auto", icon: "★", threshold: 15 },
];

// A single glyph per badge for the pill. Kept ASCII/emoji-light to sit
// next to the existing ★ / ✓ trust pills without looking out of place.
export const BADGE_ICONS: Record<BadgeSlug, string> = {
  first_plan: "•",
  regular: "◆",
  veteran: "★",
  one_year_istanbul: "⌖",
  best_nomad_year: "♛",
  top_host_year: "♚",
};

export const ONE_YEAR_DAYS = 365;

export interface BadgeInput {
  // Distinct plans the member has joined (hosting auto-joins, so this
  // already includes hosted plans). Drives the count tiers.
  planCount: number;
  // ISO date (YYYY-MM-DD) of the earliest plan they attended that's now in
  // the past, or null if they've attended none. Drives one_year_istanbul.
  firstAttendedDate: string | null;
  // Manually-awarded badge slugs from the member_badges table.
  manualBadgeSlugs: string[];
  // Today in Istanbul as YYYY-MM-DD, passed in so this stays a pure
  // function (no Date.now() inside a cached/server render).
  todayIstanbul: string;
}

// Whole days between two YYYY-MM-DD dates (b - a), UTC-noon anchored so DST
// never shifts the count.
function daysBetween(a: string, b: string): number {
  const ms =
    new Date(`${b}T12:00:00Z`).getTime() - new Date(`${a}T12:00:00Z`).getTime();
  return Math.floor(ms / 86_400_000);
}

// The badges a member has earned, in display order: highest count tier
// first, then the anniversary badge, then any manual honors.
export function computeBadges(input: BadgeInput): BadgeSlug[] {
  const earned: BadgeSlug[] = [];

  // Highest count tier reached (show only one).
  const topTier = [...TIER_BADGES]
    .reverse()
    .find((b) => input.planCount >= (b.threshold ?? Infinity));
  if (topTier) earned.push(topTier.slug);

  // One year since their first attended plan.
  if (
    input.firstAttendedDate &&
    daysBetween(input.firstAttendedDate, input.todayIstanbul) >= ONE_YEAR_DAYS
  ) {
    earned.push("one_year_istanbul");
  }

  // Manual honors, validated against the known slugs.
  const manualSlugs: BadgeSlug[] = ["best_nomad_year", "top_host_year"];
  for (const slug of manualSlugs) {
    if (input.manualBadgeSlugs.includes(slug)) earned.push(slug);
  }

  return earned;
}

// "Next badge: N plans to go" - the next count tier above the member's
// current plan count, plus how many more plans it takes. Null when they've
// already maxed the tiers (veteran).
export function nextTierProgress(
  planCount: number,
): { slug: BadgeSlug; remaining: number } | null {
  const next = TIER_BADGES.find((b) => planCount < (b.threshold ?? Infinity));
  if (!next || next.threshold == null) return null;
  return { slug: next.slug, remaining: next.threshold - planCount };
}
