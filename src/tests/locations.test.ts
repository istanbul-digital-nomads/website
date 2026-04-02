import { describe, it, expect } from "vitest";
import { getEventCoordinates, EVENT_TYPE_COLORS } from "@/lib/locations";

describe("getEventCoordinates", () => {
  it("returns coordinates for known venues", () => {
    expect(getEventCoordinates("MOB Kadikoy")).toEqual([29.025, 40.99]);
    expect(getEventCoordinates("Galata Tower")).toEqual([28.974, 41.026]);
  });

  it("fuzzy matches location names", () => {
    expect(getEventCoordinates("Beyoglu Rooftop Bar")).toEqual([
      28.977, 41.034,
    ]);
    expect(getEventCoordinates("Setup Cihangir")).toEqual([28.984, 41.031]);
  });

  it("returns null for online events", () => {
    expect(getEventCoordinates("Online")).toBeNull();
    expect(getEventCoordinates("Online (Zoom)")).toBeNull();
    expect(getEventCoordinates("Virtual Meetup")).toBeNull();
  });

  it("returns Istanbul default for unknown locations", () => {
    expect(getEventCoordinates("Some Random Cafe")).toEqual([29.0, 41.015]);
  });

  it("is case insensitive", () => {
    expect(getEventCoordinates("KADIKOY")).toEqual([29.025, 40.99]);
    expect(getEventCoordinates("besiktas")).toEqual([29.007, 41.043]);
  });
});

describe("EVENT_TYPE_COLORS", () => {
  it("has colors for all event types", () => {
    expect(EVENT_TYPE_COLORS.meetup).toBeDefined();
    expect(EVENT_TYPE_COLORS.coworking).toBeDefined();
    expect(EVENT_TYPE_COLORS.workshop).toBeDefined();
    expect(EVENT_TYPE_COLORS.social).toBeDefined();
  });

  it("uses hex color format", () => {
    Object.values(EVENT_TYPE_COLORS).forEach((color) => {
      expect(color).toMatch(/^#[0-9a-f]{6}$/i);
    });
  });
});
