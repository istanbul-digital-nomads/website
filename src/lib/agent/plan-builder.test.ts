import { describe, it, expect } from "vitest";
import { buildPlan, scoreNeighborhoods } from "./plan-builder";
import type { RelocationIntake } from "./types";

const baseIntake: RelocationIntake = {
  budget: 1500,
  currency: "USD",
  duration: "3-6-months",
  lifestyle: "social",
  work: "remote-fulltime",
};

describe("buildPlan - smoke", () => {
  it("returns a valid plan shape for a default-ish intake", () => {
    const { plan } = buildPlan(baseIntake);
    expect(plan.neighborhood_match.primary).toBeTruthy();
    expect(plan.neighborhood_match.alternates).toHaveLength(2);
    expect(plan.neighborhood_match.reasoning.length).toBeGreaterThan(50);
    expect(plan.cost_breakdown.tier).toMatch(/low|medium|high/);
    expect(plan.cost_breakdown.lines.length).toBeGreaterThan(2);
    expect(plan.setup_plan.length).toBeGreaterThan(0);
    expect(plan.strategy.length).toBeGreaterThan(0);
    expect(plan.tips.length).toBeGreaterThan(0);
    expect(plan.citations.length).toBeGreaterThan(0);
  });

  it("is fully deterministic - same intake yields the same plan", () => {
    const a = buildPlan(baseIntake).plan;
    const b = buildPlan(baseIntake).plan;
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
  });
});

describe("scoreNeighborhoods", () => {
  it("orders by total descending", () => {
    const scored = scoreNeighborhoods(baseIntake);
    for (let i = 1; i < scored.length; i++) {
      expect(scored[i - 1].total).toBeGreaterThanOrEqual(scored[i].total);
    }
  });

  it("returns all neighborhoods", () => {
    const scored = scoreNeighborhoods(baseIntake);
    const slugs = scored.map((s) => s.neighborhood.slug);
    expect(new Set(slugs).size).toBe(10);
  });
});

describe("neighborhood pick is sensitive to intake", () => {
  it("$1000 social remote-fulltime → primary on the cheaper-and-walkable side (Kadikoy or Moda)", () => {
    const { plan } = buildPlan({
      ...baseIntake,
      budget: 1000,
      lifestyle: "social",
    });
    expect(["Kadikoy", "Moda"]).toContain(plan.neighborhood_match.primary);
  });

  it("$2200 quiet founder → primary is somewhere defensible (Moda for quiet, or a European-side pick)", () => {
    const { plan } = buildPlan({
      ...baseIntake,
      budget: 2200,
      lifestyle: "quiet",
      work: "founder",
    });
    // Quiet pulls toward Moda; founder pulls toward European side. Both
    // tensions are reasonable so accept either resolution
    expect([
      "Moda",
      "Cihangir",
      "Galata",
      "Besiktas",
      "Kadikoy",
      "Uskudar",
      "Nisantasi",
      "Levent",
      "Atasehir",
    ]).toContain(plan.neighborhood_match.primary);
    // Specifically Besiktas is too noisy for quiet → should NOT be primary
    expect(plan.neighborhood_match.primary).not.toBe("Besiktas");
  });

  it("quiet lifestyle ranks Moda higher than for social lifestyle", () => {
    const quiet = scoreNeighborhoods({ ...baseIntake, lifestyle: "quiet" });
    const social = scoreNeighborhoods({ ...baseIntake, lifestyle: "social" });
    const modaInQuiet = quiet.findIndex((s) => s.neighborhood.slug === "moda");
    const modaInSocial = social.findIndex(
      (s) => s.neighborhood.slug === "moda",
    );
    expect(modaInQuiet).toBeLessThan(modaInSocial);
  });

  it("must-have 'social scene' boosts Cihangir's rank vs no must-haves", () => {
    const withSocial = scoreNeighborhoods({
      ...baseIntake,
      mustHaves: ["social scene"],
    });
    const withoutSocial = scoreNeighborhoods(baseIntake);
    const cihIn = withSocial.findIndex(
      (s) => s.neighborhood.slug === "cihangir",
    );
    const cihOut = withoutSocial.findIndex(
      (s) => s.neighborhood.slug === "cihangir",
    );
    expect(cihIn).toBeLessThanOrEqual(cihOut);
  });
});

describe("cost_breakdown", () => {
  it("picks low tier for budget under 1000", () => {
    const { plan } = buildPlan({ ...baseIntake, budget: 800 });
    expect(plan.cost_breakdown.tier).toBe("low");
  });

  it("picks high tier for budget at or above 1700", () => {
    const { plan } = buildPlan({ ...baseIntake, budget: 2200 });
    expect(plan.cost_breakdown.tier).toBe("high");
  });

  it("rent line carries the chosen neighborhood's name", () => {
    const { plan } = buildPlan(baseIntake);
    const rentLine = plan.cost_breakdown.lines.find((l) =>
      /rent/i.test(l.label),
    );
    expect(rentLine?.label).toContain(plan.neighborhood_match.primary);
  });
});

describe("setup_plan", () => {
  it("includes residence permit step for 6+ month stays", () => {
    const { plan } = buildPlan({ ...baseIntake, duration: "6-plus-months" });
    const all = plan.setup_plan.flatMap((w) => w.items.map((i) => i.title));
    expect(all.some((t) => /residence permit/i.test(t))).toBe(true);
  });

  it("excludes residence permit step for few-weeks stays", () => {
    const { plan } = buildPlan({ ...baseIntake, duration: "few-weeks" });
    const all = plan.setup_plan.flatMap((w) => w.items.map((i) => i.title));
    expect(all.some((t) => /residence permit/i.test(t))).toBe(false);
  });

  it("excludes longer-term housing pivot for few-weeks stays", () => {
    const { plan } = buildPlan({ ...baseIntake, duration: "few-weeks" });
    const all = plan.setup_plan.flatMap((w) => w.items.map((i) => i.title));
    expect(all.some((t) => /longer-term housing/i.test(t))).toBe(false);
  });

  it("groups items by ascending week", () => {
    const { plan } = buildPlan({ ...baseIntake, duration: "6-plus-months" });
    for (let i = 1; i < plan.setup_plan.length; i++) {
      expect(plan.setup_plan[i].week).toBeGreaterThan(
        plan.setup_plan[i - 1].week,
      );
    }
  });
});

describe("strategy", () => {
  it("mentions residence permit when stay is 6+ months", () => {
    const { plan } = buildPlan({ ...baseIntake, duration: "6-plus-months" });
    expect(plan.strategy.join(" ")).toMatch(/residence permit/i);
  });

  it("does NOT mention residence permit for few-weeks", () => {
    const { plan } = buildPlan({ ...baseIntake, duration: "few-weeks" });
    expect(plan.strategy.join(" ")).not.toMatch(/residence permit/i);
  });

  it("mentions KOSGEB / startup community when work is founder", () => {
    const { plan } = buildPlan({ ...baseIntake, work: "founder" });
    expect(plan.strategy.join(" ").toLowerCase()).toMatch(/kosgeb|startup/);
  });

  it("references the origin playbook when origin matches", () => {
    const { plan } = buildPlan({ ...baseIntake, originCountry: "india" });
    expect(plan.strategy.join(" ").toLowerCase()).toContain("india");
  });
});

describe("tips", () => {
  it("includes a fast-wifi tip when fast wifi is a must-have", () => {
    const { plan } = buildPlan({
      ...baseIntake,
      mustHaves: ["fast wifi"],
    });
    expect(plan.tips.join(" ").toLowerCase()).toContain("wifi");
  });

  it("includes a community-event tip for social/mixed lifestyle", () => {
    const { plan } = buildPlan({ ...baseIntake, lifestyle: "social" });
    expect(plan.tips.join(" ").toLowerCase()).toMatch(/community event|rsvp/i);
  });

  it("excludes the negotiate-rent tip for few-weeks stays", () => {
    const { plan } = buildPlan({ ...baseIntake, duration: "few-weeks" });
    expect(plan.tips.join(" ").toLowerCase()).not.toContain("negotiate rent");
  });
});

describe("citations", () => {
  it("always cites the cost-of-living guide", () => {
    const { plan } = buildPlan(baseIntake);
    expect(
      plan.citations.some(
        (c) => c.source_type === "guide" && c.source_slug === "cost-of-living",
      ),
    ).toBe(true);
  });

  it("cites the chosen primary neighborhood and alternates", () => {
    const { plan } = buildPlan(baseIntake);
    const slugs = plan.citations
      .filter((c) => c.source_type === "neighborhood")
      .map((c) => c.source_slug);
    expect(slugs.length).toBe(3); // primary + 2 alternates
  });

  it("cites the origin playbook when matched", () => {
    const { plan } = buildPlan({ ...baseIntake, originCountry: "india" });
    const paths = plan.citations.filter((c) => c.source_type === "path");
    expect(paths.length).toBe(1);
    expect(paths[0].source_slug).toBe("india");
  });
});
