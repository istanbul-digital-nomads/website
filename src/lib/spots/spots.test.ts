import { describe, it, expect } from "vitest";
import { parseInstagramUrl } from "./detect";
import { matchCuratedSpace, extractPlaceCandidates } from "./resolve";

describe("parseInstagramUrl", () => {
  it("parses reel, post, and tv links", () => {
    expect(
      parseInstagramUrl("https://www.instagram.com/reel/Cabc123XYZ/"),
    ).toMatchObject({ kind: "reel", shortcode: "Cabc123XYZ" });
    expect(
      parseInstagramUrl("https://instagram.com/p/Cabc123XYZ/"),
    ).toMatchObject({ kind: "post", shortcode: "Cabc123XYZ" });
    expect(
      parseInstagramUrl("https://www.instagram.com/tv/Cabc123XYZ/"),
    ).toMatchObject({ kind: "tv", shortcode: "Cabc123XYZ" });
  });

  it("handles the /username/reel/CODE form and tracking params", () => {
    const parsed = parseInstagramUrl(
      "https://www.instagram.com/someuser/reel/Cabc123XYZ/?igsh=abcd",
    );
    expect(parsed).toMatchObject({ kind: "reel", shortcode: "Cabc123XYZ" });
    // Query is stripped from the canonical URL.
    expect(parsed?.canonicalUrl).toBe(
      "https://www.instagram.com/reel/Cabc123XYZ/",
    );
  });

  it("accepts a bare host without scheme", () => {
    expect(parseInstagramUrl("instagram.com/p/Cabc123XYZ/")).toMatchObject({
      kind: "post",
      shortcode: "Cabc123XYZ",
    });
  });

  it("rejects non-Instagram and non-content URLs", () => {
    expect(
      parseInstagramUrl("https://example.com/reel/Cabc123XYZ/"),
    ).toBeNull();
    expect(
      parseInstagramUrl("https://www.instagram.com/someprofile/"),
    ).toBeNull();
    expect(
      parseInstagramUrl("https://www.instagram.com/stories/x/123/"),
    ).toBeNull();
    expect(parseInstagramUrl("not a url")).toBeNull();
    expect(parseInstagramUrl("")).toBeNull();
  });
});

describe("matchCuratedSpace", () => {
  it("matches a curated space name inside caption text", () => {
    const match = matchCuratedSpace(
      "Amazing flat white at Kolektif House this morning ☕",
    );
    expect(match?.name).toBe("Kolektif House");
  });

  it("is case- and accent-insensitive", () => {
    expect(matchCuratedSpace("petra roasting co is great")?.name).toBe(
      "Petra Roasting Co",
    );
  });

  it("returns null when no curated space is mentioned", () => {
    expect(matchCuratedSpace("just a random beach sunset")).toBeNull();
  });
});

describe("extractPlaceCandidates", () => {
  it("prioritizes an explicit location tag", () => {
    const out = extractPlaceCandidates("nice coffee here", "Walter's Coffee");
    expect(out[0]).toBe("Walter's Coffee");
  });

  it("pulls @mentions and Title-Case phrases from a caption", () => {
    const out = extractPlaceCandidates("best brunch at @moda.kahve in Kadikoy");
    expect(out).toContain("moda kahve");
    expect(out.some((c) => c.includes("Kadikoy"))).toBe(true);
  });

  it("returns an empty list for an empty caption", () => {
    expect(extractPlaceCandidates(undefined)).toEqual([]);
  });
});
