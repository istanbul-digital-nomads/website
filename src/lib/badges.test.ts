import { describe, it, expect } from "vitest";
import {
  computeBadges,
  nextTierProgress,
  ONE_YEAR_DAYS,
  type BadgeInput,
} from "./badges";
import { deriveXp } from "./xp";

const base: BadgeInput = {
  planCount: 0,
  firstAttendedDate: null,
  manualBadgeSlugs: [],
  todayIstanbul: "2026-06-05",
};

describe("computeBadges", () => {
  it("awards no badges to a brand-new member", () => {
    expect(computeBadges(base)).toEqual([]);
  });

  it("awards first_plan at 1 plan and only the top tier as counts grow", () => {
    expect(computeBadges({ ...base, planCount: 1 })).toEqual(["first_plan"]);
    // 5 reaches 'regular' - first_plan is superseded, not stacked.
    expect(computeBadges({ ...base, planCount: 5 })).toEqual(["regular"]);
    expect(computeBadges({ ...base, planCount: 14 })).toEqual(["regular"]);
    expect(computeBadges({ ...base, planCount: 15 })).toEqual(["veteran"]);
  });

  it("awards one_year_istanbul only after 365+ days since first attended", () => {
    // 364 days back - not yet.
    expect(
      computeBadges({
        ...base,
        planCount: 1,
        firstAttendedDate: "2025-06-06",
      }),
    ).toEqual(["first_plan"]);
    // Exactly a year back - earned.
    expect(
      computeBadges({
        ...base,
        planCount: 1,
        firstAttendedDate: "2025-06-05",
      }),
    ).toEqual(["first_plan", "one_year_istanbul"]);
  });

  it("merges valid manual honors and ignores unknown slugs", () => {
    expect(
      computeBadges({
        ...base,
        planCount: 5,
        manualBadgeSlugs: ["best_nomad_year", "bogus_badge", "top_host_year"],
      }),
    ).toEqual(["regular", "best_nomad_year", "top_host_year"]);
  });
});

describe("nextTierProgress", () => {
  it("counts down to the next tier and returns null once maxed", () => {
    expect(nextTierProgress(0)).toEqual({ slug: "first_plan", remaining: 1 });
    expect(nextTierProgress(3)).toEqual({ slug: "regular", remaining: 2 });
    expect(nextTierProgress(14)).toEqual({ slug: "veteran", remaining: 1 });
    expect(nextTierProgress(15)).toBeNull();
    expect(nextTierProgress(40)).toBeNull();
  });
});

describe("deriveXp", () => {
  it("weights hosting above joining and sums them", () => {
    expect(deriveXp({ hostedCount: 0, joinedCount: 0 })).toBe(0);
    expect(deriveXp({ hostedCount: 2, joinedCount: 3 })).toBe(2 * 20 + 3 * 10);
  });
});

describe("ONE_YEAR_DAYS", () => {
  it("is a calendar year", () => {
    expect(ONE_YEAR_DAYS).toBe(365);
  });
});
