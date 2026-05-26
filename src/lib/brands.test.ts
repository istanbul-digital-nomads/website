import { describe, expect, it } from "vitest";
import {
  BRAND_SCORE_FIELDS,
  brandLocations,
  brands,
  getBrandBySlug,
  getLocationsByBrand,
  getLocationsByNeighborhood,
  type BrandLocation,
} from "./brands";

describe("brands catalogue", () => {
  it("has unique, well-formed brand slugs", () => {
    const slugs = brands.map((b) => b.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const b of brands) {
      expect(b.slug).toMatch(/^[a-z0-9-]+$/);
      expect(b.name.length).toBeGreaterThan(0);
      expect(b.color).toMatch(/^#[0-9a-fA-F]{6}$/);
      expect(["coffee", "cowork", "gym", "food"]).toContain(b.category);
    }
  });
});

describe("brand locations", () => {
  const brandSlugs = new Set(brands.map((b) => b.slug));

  it("every location points at a real brand", () => {
    for (const loc of brandLocations) {
      expect(brandSlugs.has(loc.brand_slug)).toBe(true);
    }
  });

  it("uses [lng, lat] coordinates inside the Istanbul bounding box", () => {
    for (const loc of brandLocations) {
      const [lng, lat] = loc.coordinates;
      expect(lng).toBeGreaterThan(28);
      expect(lng).toBeLessThan(30);
      expect(lat).toBeGreaterThan(40);
      expect(lat).toBeLessThan(42);
    }
  });

  // The no-fabrication contract (mirrors spaces.ts): a score is either cited
  // (non-null and NOT flagged) or absent (null and listed in unverified_fields).
  it("keeps every work-quality score honest", () => {
    for (const loc of brandLocations) {
      const flagged = new Set(loc.unverified_fields ?? []);
      for (const field of BRAND_SCORE_FIELDS) {
        const value = loc[field as keyof BrandLocation];
        if (value == null) {
          expect(flagged.has(field)).toBe(true);
        } else {
          expect(flagged.has(field)).toBe(false);
        }
      }
    }
  });

  it("never shows a rating without at least one cited source", () => {
    for (const loc of brandLocations) {
      if (loc.rating != null) {
        expect(loc.sources && loc.sources.length).toBeGreaterThan(0);
      }
    }
    // Every source carries a real-looking URL.
    for (const loc of brandLocations) {
      for (const s of loc.sources ?? []) {
        expect(s.url).toMatch(/^https?:\/\//);
        expect(s.label.length).toBeGreaterThan(0);
      }
    }
  });
});

describe("brand lookups", () => {
  it("getBrandBySlug returns the brand or undefined", () => {
    expect(getBrandBySlug("espressolab")?.name).toBe("Espressolab");
    expect(getBrandBySlug("does-not-exist")).toBeUndefined();
  });

  it("getLocationsByBrand returns only that brand's branches", () => {
    const espresso = getLocationsByBrand("espressolab");
    expect(espresso.length).toBeGreaterThan(0);
    expect(espresso.every((l) => l.brand_slug === "espressolab")).toBe(true);
  });

  it("getLocationsByNeighborhood filters by neighborhood slug", () => {
    const kadikoy = getLocationsByNeighborhood("kadikoy");
    expect(kadikoy.every((l) => l.neighborhood_slug === "kadikoy")).toBe(true);
  });
});
