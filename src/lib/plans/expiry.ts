const ISTANBUL_TZ = "Europe/Istanbul";

function istanbulOffsetMinutes(date: Date): number {
  const utc = new Date(date.toLocaleString("en-US", { timeZone: "UTC" }));
  const local = new Date(
    date.toLocaleString("en-US", { timeZone: ISTANBUL_TZ }),
  );
  return Math.round((local.getTime() - utc.getTime()) / 60_000);
}

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

function offsetString(minutes: number): string {
  const sign = minutes >= 0 ? "+" : "-";
  const abs = Math.abs(minutes);
  return `${sign}${pad(Math.floor(abs / 60))}:${pad(abs % 60)}`;
}

/**
 * Compute when a plan should drop off the active feed.
 *
 * - If any stop has an end_time set, expiry = latest end_time + 1h grace
 *   on the scheduled date in Istanbul TZ.
 * - Otherwise: end of `scheduledDate` (23:59:59) in Istanbul TZ.
 *
 * Returns an ISO string suitable for a timestamptz column.
 */
export function computeExpiresAt(
  scheduledDate: string, // YYYY-MM-DD
  endTimes: Array<string | null | undefined>, // each "HH:MM[:SS]" or nullish
): string {
  const probe = new Date(`${scheduledDate}T12:00:00Z`);
  const offsetMin = istanbulOffsetMinutes(probe);
  const offset = offsetString(offsetMin);

  const latestEnd = endTimes
    .filter((t): t is string => !!t)
    .reduce<
      string | null
    >((max, t) => (max === null || t > max ? t : max), null);

  if (latestEnd) {
    const [hh = "0", mm = "0"] = latestEnd.split(":");
    const local = new Date(
      `${scheduledDate}T${pad(Number(hh))}:${pad(Number(mm))}:00${offset}`,
    );
    return new Date(local.getTime() + 60 * 60 * 1000).toISOString();
  }

  const endOfDay = new Date(`${scheduledDate}T23:59:59${offset}`);
  return endOfDay.toISOString();
}

/**
 * Returns the current date in Istanbul TZ as YYYY-MM-DD.
 */
export function todayInIstanbul(now: Date = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: ISTANBUL_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const y = parts.find((p) => p.type === "year")?.value ?? "1970";
  const m = parts.find((p) => p.type === "month")?.value ?? "01";
  const d = parts.find((p) => p.type === "day")?.value ?? "01";
  return `${y}-${m}-${d}`;
}

/**
 * Add `days` to a YYYY-MM-DD string and return the new YYYY-MM-DD.
 * UTC arithmetic so DST is irrelevant at the date level.
 */
export function addDays(date: string, days: number): string {
  const d = new Date(`${date}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}
