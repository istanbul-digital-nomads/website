import { describe, it, expect } from "vitest";
import {
  cn,
  formatDate,
  formatDateShort,
  formatEventDate,
  truncate,
} from "@/lib/utils";

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("handles conditional classes", () => {
    expect(cn("base", false && "hidden", "visible")).toBe("base visible");
  });

  it("deduplicates tailwind classes", () => {
    expect(cn("p-4", "p-8")).toBe("p-8");
  });
});

describe("formatDate", () => {
  it("formats date with default options", () => {
    const result = formatDate("2026-04-15T10:00:00Z");
    expect(result).toContain("April");
    expect(result).toContain("15");
    expect(result).toContain("2026");
  });

  it("accepts Date objects", () => {
    const result = formatDate(new Date("2026-01-01"));
    expect(result).toContain("2026");
  });
});

describe("formatDateShort", () => {
  it("formats with short month", () => {
    const result = formatDateShort("2026-04-15");
    expect(result).toContain("Apr");
    expect(result).toContain("15");
  });
});

describe("formatEventDate", () => {
  it("includes weekday", () => {
    const result = formatEventDate("2026-04-15T10:00:00Z");
    expect(result).toContain("Apr");
    expect(result).toContain("15");
  });
});

describe("truncate", () => {
  it("truncates long strings", () => {
    expect(truncate("Hello World, this is a long string", 11)).toBe(
      "Hello World...",
    );
  });

  it("returns short strings unchanged", () => {
    expect(truncate("Hello", 10)).toBe("Hello");
  });

  it("handles exact length", () => {
    expect(truncate("Hello", 5)).toBe("Hello");
  });
});
