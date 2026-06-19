import { describe, it, expect } from "vitest";
import { metersBetween, planIncludesSpot, type MatchStop } from "./match";

describe("metersBetween", () => {
  it("is ~0 for identical points", () => {
    expect(metersBetween(41.0, 29.0, 41.0, 29.0)).toBeCloseTo(0, 5);
  });

  it("measures a known short distance", () => {
    // ~0.0009 deg latitude ≈ 100m near Istanbul.
    const d = metersBetween(41.0, 29.0, 41.0009, 29.0);
    expect(d).toBeGreaterThan(90);
    expect(d).toBeLessThan(110);
  });
});

describe("planIncludesSpot", () => {
  const spot = { space_id: null, lat: 41.0, lng: 29.0 };

  it("matches a stop within 150m of the pin", () => {
    const stops: MatchStop[] = [
      { space_id: null, lat: 41.0008, lng: 29.0 }, // ~89m
    ];
    expect(planIncludesSpot(spot, stops)).toBe(true);
  });

  it("does not match a stop well beyond 150m", () => {
    const stops: MatchStop[] = [
      { space_id: null, lat: 41.01, lng: 29.0 }, // ~1.1km
    ];
    expect(planIncludesSpot(spot, stops)).toBe(false);
  });

  it("matches on identical curated space_id regardless of coordinates", () => {
    const curatedSpot = { space_id: "kolektif-house", lat: 41.0, lng: 29.0 };
    const stops: MatchStop[] = [
      { space_id: "kolektif-house", lat: null, lng: null },
    ];
    expect(planIncludesSpot(curatedSpot, stops)).toBe(true);
  });

  it("ignores stops with no coordinates and no matching space", () => {
    const stops: MatchStop[] = [
      { space_id: "some-other-space", lat: null, lng: null },
    ];
    expect(planIncludesSpot(spot, stops)).toBe(false);
  });

  it("handles string-typed numeric coordinates (Supabase numeric)", () => {
    const stringSpot = { space_id: null, lat: "41.0", lng: "29.0" };
    const stops: MatchStop[] = [
      { space_id: null, lat: "41.0008", lng: "29.0" },
    ];
    expect(planIncludesSpot(stringSpot, stops)).toBe(true);
  });

  it("returns false for a plan with no stops", () => {
    expect(planIncludesSpot(spot, [])).toBe(false);
  });
});
