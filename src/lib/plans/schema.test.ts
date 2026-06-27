import { describe, it, expect } from "vitest";
import { planCreateSchema } from "./schema";

const baseEventStop = {
  vibe: "social" as const,
  step_kind: "event" as const,
  event_provider: "luma" as const,
  event_url: "https://lu.ma/abc123",
  event_title: "Istanbul Nomads Meetup",
  event_starts_at: "2026-07-03T19:00:00+03:00",
  event_ends_at: "2026-07-03T22:00:00+03:00",
  start_time: "19:00",
  end_time: "22:00",
  custom_location: "Kadikoy Hall",
  lat: 40.99,
  lng: 29.02,
};

describe("planCreateSchema event steps", () => {
  it("accepts an event step whose date matches the plan day", () => {
    const result = planCreateSchema.safeParse({
      scheduled_date: "2026-07-03",
      title: "Meetup night",
      stops: [baseEventStop],
    });
    expect(result.success).toBe(true);
  });

  it("rejects an event step on a different day than the plan", () => {
    const result = planCreateSchema.safeParse({
      scheduled_date: "2026-07-05",
      title: "Meetup night",
      stops: [baseEventStop],
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toMatch(/Event date/i);
    }
  });

  it("requires a provider + url for an event step", () => {
    const result = planCreateSchema.safeParse({
      scheduled_date: "2026-07-03",
      title: "Meetup night",
      stops: [{ ...baseEventStop, event_url: null, event_provider: null }],
    });
    expect(result.success).toBe(false);
  });

  it("still accepts a normal place step", () => {
    const result = planCreateSchema.safeParse({
      scheduled_date: "2026-07-03",
      title: "Cowork day",
      stops: [{ vibe: "cowork", lat: 41.0, lng: 29.0 }],
    });
    expect(result.success).toBe(true);
  });
});
