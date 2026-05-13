import { describe, expect, it } from "vitest";
import {
  deriveSpaceSignals,
  getDefaultSpaceFinderFilters,
  rankSpaces,
} from "./spaces-finder";
import { spaces } from "./spaces";

describe("deriveSpaceSignals", () => {
  it("marks coworking spaces as calls-friendly and rain-safe", () => {
    const impactHub = spaces.find((space) => space.id === "impact-hub");
    expect(impactHub).toBeTruthy();

    const signals = deriveSpaceSignals(impactHub!);
    expect(signals.callsFriendly).toBe(true);
    expect(signals.rainSafe).toBe(true);
    expect(signals.labels).toContain("Good for calls");
  });

  it("surfaces caution labels for noisy or tight cafes", () => {
    const petra = spaces.find((space) => space.id === "petra-roasting");
    expect(petra).toBeTruthy();

    const signals = deriveSpaceSignals(petra!);
    expect(signals.bringHeadphones).toBe(true);
    expect(signals.labels).toContain("Bring headphones");
  });
});

describe("rankSpaces", () => {
  it("filters by neighborhood, type, and selected needs", () => {
    const ranked = rankSpaces(spaces, {
      ...getDefaultSpaceFinderFilters(),
      neighborhood: "Cihangir",
      type: "cafe",
      needs: ["strongSockets"],
    });

    expect(ranked.length).toBeGreaterThan(0);
    expect(
      ranked.every(
        ({ space, signals }) =>
          space.neighborhood === "Cihangir" &&
          space.type === "cafe" &&
          signals.strongSockets,
      ),
    ).toBe(true);
  });

  it("boosts calls mode toward coworking or calls-friendly places", () => {
    const ranked = rankSpaces(spaces, {
      ...getDefaultSpaceFinderFilters(),
      mode: "calls",
    });

    expect(ranked[0].signals.callsFriendly).toBe(true);
    expect(ranked[0].matchReasons.join(" ")).toMatch(/calls|coworking/i);
  });

  it("searches labels and amenities, not only names", () => {
    const ranked = rankSpaces(spaces, {
      ...getDefaultSpaceFinderFilters(),
      search: "standing desks",
    });

    expect(ranked.map(({ space }) => space.id)).toContain("impact-hub");
  });
});
