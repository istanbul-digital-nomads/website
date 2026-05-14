import "server-only";
import { cacheLife } from "next/cache";
import { createPublicClient } from "@/lib/supabase/server";

/**
 * Live "ambient" signals for the v2 design system: Istanbul local time,
 * time-of-day accent, weather, FX, ferry status, members count.
 *
 * Every fetcher is wrapped in `use cache` with a short `cacheLife` and has a
 * static fallback - the AmbientBar renders on every page and must never throw
 * or block render if a partner API is slow or down. `Date.now()` inside
 * `use cache` is frozen per cache entry, so `cacheLife` is what keeps the
 * time-based values fresh.
 */

export type TimeOfDay = "dawn" | "midday" | "dusk" | "night";

export type Weather = {
  temp: number;
  label: string;
};

export type FxRate = {
  usdTry: string;
};

export type FerryStatus = {
  route: string;
  next: string;
  running: boolean;
};

// Istanbul is UTC+3 year-round (no DST since 2016).
const ISTANBUL_OFFSET_MS = 3 * 60 * 60 * 1000;

function istanbulNow(): Date {
  return new Date(Date.now() + ISTANBUL_OFFSET_MS);
}

/**
 * Time-of-day bucket, used for the `tod-*` accent class on <html>.
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

/** Istanbul local time as `HH:MM`. */
export async function getIstanbulTime(): Promise<string> {
  "use cache";
  cacheLife("minutes");
  const d = istanbulNow();
  const hh = String(d.getUTCHours()).padStart(2, "0");
  const mm = String(d.getUTCMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

// WMO weather codes -> short lowercase label.
function weatherLabel(code: number): string {
  if (code === 0) return "clear";
  if (code <= 3) return "cloud";
  if (code <= 48) return "fog";
  if (code <= 67) return "rain";
  if (code <= 77) return "snow";
  if (code <= 82) return "showers";
  if (code <= 86) return "snow";
  return "storm";
}

/**
 * Current Istanbul weather via Open-Meteo (keyless, generous free tier).
 * Falls back to a calm static reading if the API is unreachable.
 */
export async function getWeather(): Promise<Weather> {
  "use cache";
  cacheLife("minutes");
  try {
    const r = await fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=41.0082&longitude=28.9784&current=temperature_2m,weather_code&timezone=Europe%2FIstanbul",
      { signal: AbortSignal.timeout(4000) },
    );
    if (!r.ok) throw new Error(`weather ${r.status}`);
    const d = await r.json();
    return {
      temp: Math.round(d.current.temperature_2m),
      label: weatherLabel(d.current.weather_code),
    };
  } catch {
    return { temp: 18, label: "clear" };
  }
}

/**
 * USD -> TRY rate via Frankfurter (keyless, ECB-sourced). exchangerate.host
 * now requires an API key, so we use Frankfurter instead. Static fallback on
 * failure - a stale-looking rate is better than a broken bar.
 */
export async function getFxRate(): Promise<FxRate> {
  "use cache";
  cacheLife("hours");
  try {
    const r = await fetch("https://api.frankfurter.app/latest?from=USD&to=TRY", {
      signal: AbortSignal.timeout(4000),
    });
    if (!r.ok) throw new Error(`fx ${r.status}`);
    const d = await r.json();
    const rate = d?.rates?.TRY;
    if (typeof rate !== "number") throw new Error("fx shape");
    return { usdTry: rate.toFixed(2) };
  } catch {
    return { usdTry: "—" };
  }
}

// Kadikoy -> Karakoy ferry. Static schedule for v1 (a scrape of
// sehirhatlari.istanbul can replace this later). Times are Istanbul-local
// minutes-of-day, roughly every 20-30 minutes through the service day.
const FERRY_DEPARTURES: number[] = (() => {
  const out: number[] = [];
  // 07:00 - 21:00, every 20 minutes; then 21:30, 22:10, 22:40.
  for (let m = 7 * 60; m <= 21 * 60; m += 20) out.push(m);
  out.push(21 * 60 + 30, 22 * 60 + 10, 22 * 60 + 40);
  return out;
})();

export async function getFerryStatus(): Promise<FerryStatus> {
  "use cache";
  cacheLife("minutes");
  const d = istanbulNow();
  const minutes = d.getUTCHours() * 60 + d.getUTCMinutes();
  const next = FERRY_DEPARTURES.find((t) => t > minutes);
  const fmt = (t: number) =>
    `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`;
  return {
    route: "Kadıköy → Karaköy",
    next: next ? fmt(next) : `first ${fmt(FERRY_DEPARTURES[0])}`,
    running: next !== undefined,
  };
}

/**
 * Count of opted-in (publicly visible) members. There is no presence
 * tracking yet (`last_seen_at` lands with the member surfaces in a later
 * phase), so this is a directory count, not a true "online now" figure -
 * the AmbientBar labels it honestly. Returns null on failure so the bar can
 * omit the cell rather than show a fabricated number.
 */
export async function getMemberCount(): Promise<number | null> {
  "use cache";
  cacheLife("hours");
  try {
    const supabase = createPublicClient();
    const { count, error } = await supabase
      .from("members")
      .select("*", { count: "exact", head: true })
      .eq("is_visible", true);
    if (error) throw error;
    return count ?? null;
  } catch {
    return null;
  }
}
