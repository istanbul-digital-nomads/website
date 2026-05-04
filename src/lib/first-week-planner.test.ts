import { describe, expect, it } from "vitest";
import {
  buildFirstWeekPlan,
  defaultPlannerInput,
  encodePlannerInput,
  parsePlannerInput,
} from "./first-week-planner";

describe("buildFirstWeekPlan", () => {
  it("returns a deterministic seven-day plan for the default input", () => {
    const a = buildFirstWeekPlan(defaultPlannerInput);
    const b = buildFirstWeekPlan(defaultPlannerInput);

    expect(a.days).toHaveLength(7);
    expect(a.baseNeighborhood.slug).toBe("kadikoy");
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
  });

  it("honors a chosen neighborhood instead of the profile recommendation", () => {
    const plan = buildFirstWeekPlan({
      ...defaultPlannerInput,
      neighborhood: "moda",
    });

    expect(plan.baseNeighborhood.slug).toBe("moda");
    expect(plan.summary).toContain("Moda is your chosen base");
  });

  it("adds paperwork-specific admin guidance when paperwork is the arrival profile", () => {
    const plan = buildFirstWeekPlan({
      ...defaultPlannerInput,
      arrivalProfile: "paperwork",
    });

    expect(plan.days[4].title).toBe("Admin day");
    expect(plan.avoid.join(" ")).toContain("documents");
  });

  it("keeps every day connected to a useful next action", () => {
    const plan = buildFirstWeekPlan(defaultPlannerInput);

    expect(plan.days.every((day) => day.links.length > 0)).toBe(true);
    expect(plan.saveLinks.map((link) => link.href)).toContain("/events");
  });
});

describe("planner query params", () => {
  it("round-trips valid planner input through query params", () => {
    const input = {
      ...defaultPlannerInput,
      arrivalProfile: "returning" as const,
      neighborhood: "cihangir" as const,
      workStyle: "calls" as const,
      socialAppetite: "fast" as const,
      budgetComfort: "comfort" as const,
    };

    expect(
      parsePlannerInput(new URLSearchParams(encodePlannerInput(input))),
    ).toEqual(input);
  });

  it("falls back to safe defaults for invalid params", () => {
    const parsed = parsePlannerInput(
      new URLSearchParams(
        "profile=nope&base=nowhere&work=bad&social=wrong&budget=odd",
      ),
    );

    expect(parsed).toEqual(defaultPlannerInput);
  });
});
