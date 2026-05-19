import { describe, it, expect } from "vitest";
import { computeExpiresAt, todayInIstanbul, addDays } from "./expiry";

describe("computeExpiresAt", () => {
  it("expires at end of day in Istanbul TZ when no stop has end_time", () => {
    const iso = computeExpiresAt("2026-05-16", [null, undefined]);
    const d = new Date(iso);
    // 23:59:59 Istanbul (UTC+3) = 20:59:59 UTC
    expect(d.getUTCHours()).toBe(20);
    expect(d.getUTCMinutes()).toBe(59);
    expect(d.toISOString().slice(0, 10)).toBe("2026-05-16");
  });

  it("expires 1h after the latest stop end_time", () => {
    const iso = computeExpiresAt("2026-05-16", ["14:00", "18:00", "16:30"]);
    const d = new Date(iso);
    // latest = 18:00 Istanbul + 1h = 19:00 Istanbul = 16:00 UTC
    expect(d.getUTCHours()).toBe(16);
    expect(d.getUTCMinutes()).toBe(0);
    expect(d.toISOString().slice(0, 10)).toBe("2026-05-16");
  });

  it("uses end-of-day when all stops have null end_time", () => {
    const iso = computeExpiresAt("2026-05-16", [null, null, null]);
    const d = new Date(iso);
    expect(d.getUTCHours()).toBe(20);
    expect(d.getUTCMinutes()).toBe(59);
  });

  it("rolls into next UTC day if latest end_time + grace crosses midnight", () => {
    const iso = computeExpiresAt("2026-05-16", ["23:30"]);
    const d = new Date(iso);
    // 23:30 Istanbul + 1h = 00:30 next-day Istanbul = 21:30 UTC same day
    expect(d.getUTCHours()).toBe(21);
    expect(d.getUTCMinutes()).toBe(30);
  });
});

describe("todayInIstanbul", () => {
  it("returns YYYY-MM-DD format", () => {
    const today = todayInIstanbul();
    expect(today).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("uses Istanbul TZ at the day boundary", () => {
    // 22:30 UTC on the 15th = 01:30 Istanbul on the 16th
    const date = new Date("2026-05-15T22:30:00Z");
    expect(todayInIstanbul(date)).toBe("2026-05-16");
  });

  it("uses Istanbul TZ early-morning UTC = same day", () => {
    const date = new Date("2026-05-16T03:00:00Z");
    expect(todayInIstanbul(date)).toBe("2026-05-16");
  });
});

describe("addDays", () => {
  it("adds positive days", () => {
    expect(addDays("2026-05-16", 1)).toBe("2026-05-17");
    expect(addDays("2026-05-16", 7)).toBe("2026-05-23");
  });

  it("handles month boundaries", () => {
    expect(addDays("2026-05-30", 3)).toBe("2026-06-02");
  });

  it("handles year boundaries", () => {
    expect(addDays("2026-12-30", 5)).toBe("2027-01-04");
  });
});
