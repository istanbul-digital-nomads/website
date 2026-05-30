import { describe, it, expect } from "vitest";
import { summarizeReviews } from "./queries";
import { reviewUpsertSchema } from "./schema";

describe("summarizeReviews", () => {
  it("returns empty summary for no reviews", () => {
    expect(summarizeReviews([])).toEqual({
      average: null,
      count: 0,
      wouldReturnCount: 0,
    });
    expect(summarizeReviews(null)).toEqual({
      average: null,
      count: 0,
      wouldReturnCount: 0,
    });
  });

  it("averages ratings rounded to one decimal", () => {
    const s = summarizeReviews([
      { rating: 5, would_return: true },
      { rating: 4, would_return: true },
      { rating: 4, would_return: false },
    ]);
    expect(s.average).toBe(4.3);
    expect(s.count).toBe(3);
    expect(s.wouldReturnCount).toBe(2);
  });
});

describe("reviewUpsertSchema", () => {
  it("accepts a valid review", () => {
    const r = reviewUpsertSchema.safeParse({
      rating: 4,
      would_return: true,
      body: "Great walk",
    });
    expect(r.success).toBe(true);
  });

  it("coerces empty body to null", () => {
    const r = reviewUpsertSchema.safeParse({
      rating: 3,
      would_return: false,
      body: "   ",
    });
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.body).toBeNull();
  });

  it("rejects out-of-range ratings", () => {
    expect(
      reviewUpsertSchema.safeParse({ rating: 0, would_return: true }).success,
    ).toBe(false);
    expect(
      reviewUpsertSchema.safeParse({ rating: 6, would_return: true }).success,
    ).toBe(false);
  });

  it("requires would_return", () => {
    expect(reviewUpsertSchema.safeParse({ rating: 4 }).success).toBe(false);
  });

  it("rejects body over 1000 chars", () => {
    expect(
      reviewUpsertSchema.safeParse({
        rating: 4,
        would_return: true,
        body: "x".repeat(1001),
      }).success,
    ).toBe(false);
  });

  it("defaults photos to an empty array and coerces empty quote to null", () => {
    const r = reviewUpsertSchema.safeParse({ rating: 5, would_return: true });
    expect(r.success).toBe(true);
    if (r.success) {
      expect(r.data.photos).toEqual([]);
      expect(r.data.quote ?? null).toBeNull();
    }
  });

  it("rejects a quote over 140 chars", () => {
    expect(
      reviewUpsertSchema.safeParse({
        rating: 4,
        would_return: true,
        quote: "x".repeat(141),
      }).success,
    ).toBe(false);
  });

  it("accepts valid plan-photos URLs but rejects foreign hosts", () => {
    expect(
      reviewUpsertSchema.safeParse({
        rating: 4,
        would_return: true,
        photos: [
          "https://abc.supabase.co/storage/v1/object/public/plan-photos/u/p/1.jpg",
        ],
      }).success,
    ).toBe(true);
    expect(
      reviewUpsertSchema.safeParse({
        rating: 4,
        would_return: true,
        photos: ["https://evil.example.com/x.jpg"],
      }).success,
    ).toBe(false);
  });

  it("rejects more than 4 photos", () => {
    const url =
      "https://abc.supabase.co/storage/v1/object/public/plan-photos/u/p/x.jpg";
    expect(
      reviewUpsertSchema.safeParse({
        rating: 4,
        would_return: true,
        photos: [url, url, url, url, url],
      }).success,
    ).toBe(false);
  });
});
