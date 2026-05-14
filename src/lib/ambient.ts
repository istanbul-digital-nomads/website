import "server-only";
import { cacheLife } from "next/cache";

/**
 * Live "ambient" signals for the v2 design system: Istanbul local time,
 * time-of-day accent, weather, FX, ferry status, members online.
 *
 * Every fetcher is wrapped in `use cache` with a short `cacheLife` and has a
 * static fallback - the AmbientBar renders on every page and must never throw
 * or block render if a partner API is slow or down.
 */

export type TimeOfDay = "dawn" | "midday" | "dusk" | "night";

// Istanbul is UTC+3 year-round (no DST since 2016).
const ISTANBUL_OFFSET_MS = 3 * 60 * 60 * 1000;

function istanbulNow(): Date {
  return new Date(Date.now() + ISTANBUL_OFFSET_MS);
}

/**
 * Time-of-day bucket, used for the `tod-*` accent class on <html>.
 * `Date.now()` inside `use cache` is frozen per cache entry, so `cacheLife`
 * keeps it fresh - the class catches up within a few minutes.
 */
export async function getTimeOfDay(): Promise<TimeOfDay> {
  "use cache";
  cacheLife("minutes");
  const h = istanbulNow().getUTCHours();
  if (h >= 5 && h < 9) return "dawn";
  if (h >= 9 && h < 17) return "midday";
  if (h >= 17 && h < 21) return "dusk";
  return "night";
}
