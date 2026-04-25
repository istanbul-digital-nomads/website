import { describe, it, expect } from "vitest";
import { chunk } from "./chunker";

const longerThanMinimum =
  "This is a paragraph long enough to clear the minimum chunk size, " +
  "with at least eighty characters of real content inside it.";

describe("chunker", () => {
  it("splits by H2 headings", () => {
    const out = chunk({
      source_type: "guide",
      source_slug: "test",
      source_url: "https://example.com/test",
      body: [
        "# Title",
        "",
        `Intro paragraph that lives without a section heading. ${longerThanMinimum}`,
        "",
        "## First section",
        "",
        `Body of the first section. ${longerThanMinimum}`,
        "",
        "## Second section",
        "",
        `Body of the second section. ${longerThanMinimum}`,
      ].join("\n"),
    });

    expect(out).toHaveLength(3);
    expect(out[0].section_heading).toBeNull();
    expect(out[1].section_heading).toBe("First section");
    expect(out[2].section_heading).toBe("Second section");
  });

  it("includes the heading inside the chunk content", () => {
    const out = chunk({
      source_type: "guide",
      source_slug: "test",
      source_url: "https://example.com/test",
      body: `## Heading X\n\n${longerThanMinimum}`,
    });
    expect(out[0].content).toContain("## Heading X");
    expect(out[0].content).toContain("paragraph long enough");
  });

  it("attaches source metadata to every chunk", () => {
    const out = chunk({
      source_type: "blog",
      source_slug: "first-week-mistakes",
      source_url: "https://istanbulnomads.com/blog/first-week-mistakes",
      body: `## A\n\n${longerThanMinimum}`,
    });
    expect(out[0].source_type).toBe("blog");
    expect(out[0].source_slug).toBe("first-week-mistakes");
    expect(out[0].metadata.source_url).toBe(
      "https://istanbulnomads.com/blog/first-week-mistakes",
    );
  });

  it("drops chunks below the minimum size", () => {
    const out = chunk({
      source_type: "guide",
      source_slug: "tiny",
      source_url: "https://example.com/tiny",
      body: "## Short\n\nToo short.",
    });
    expect(out).toHaveLength(0);
  });

  it("windows long sections with overlap", () => {
    const long = ("paragraph that is long. ".repeat(150) + "\n\n").repeat(3);
    const out = chunk({
      source_type: "guide",
      source_slug: "long",
      source_url: "https://example.com/long",
      body: `## Long\n\n${long}`,
    });
    expect(out.length).toBeGreaterThan(1);
    for (const c of out) {
      expect(c.section_heading).toBe("Long");
      expect(c.content.length).toBeLessThanOrEqual(2500);
    }
  });
});
