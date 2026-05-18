// View-model types for the Today board. The board groups plans into
// morning / afternoon / evening slots based on the first stop's start_time.
// Mirrors today-v2.jsx's shape closely but only keeps fields backed by our
// schema. Guide-type plans, languages, fees etc. are not modelled here
// yet - the Today board ships nomad-type only for v1.

import type { PlanCardSummary } from "@/lib/plans/queries";

export type TodaySlot = "morning" | "afternoon" | "evening";

export type TodayPlanCard = {
  id: string;
  slot: TodaySlot;
  startTime: string; // "HH:MM" or "-"
  endTime: string;
  durationLabel: string; // "1h", "1h 30m"
  stops: number;
  hood: string | null;
  vibeLabel: string | null;
  title: string;
  host: {
    name: string;
    avatarUrl: string | null;
    type: "nomad" | "guide";
  } | null;
  // Capacity-derived: filled = attendee_count (incl. host). seats = capacity.
  filled: number;
  seats: number | null; // null means "no cap"
  attendees: Array<{
    name: string;
    avatarUrl: string | null;
  }>;
  budgetLabel: string | null; // e.g. "Free", "~₺180"
  agenda: Array<{
    time: string;
    title: string; // notes or vibe-based fallback
    place: string;
    cost: string | null;
  }>;
  // True when the viewer is the host. Highlights the card.
  mine: boolean;
};

const HHMM = /^(\d{2}):(\d{2})/;

function parseHHMM(s: string | null | undefined): number | null {
  if (!s) return null;
  const m = HHMM.exec(s);
  if (!m) return null;
  return Number(m[1]) * 60 + Number(m[2]);
}

function fmtHHMM(s: string | null | undefined): string {
  if (!s) return "-";
  const m = HHMM.exec(s);
  return m ? `${m[1]}:${m[2]}` : "-";
}

function durationLabel(startMin: number | null, endMin: number | null): string {
  if (startMin == null || endMin == null) return "-";
  const diff = Math.max(0, endMin - startMin);
  if (diff === 0) return "-";
  const h = Math.floor(diff / 60);
  const m = diff % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

function slotFor(startMin: number | null): TodaySlot {
  if (startMin == null) return "afternoon";
  if (startMin < 12 * 60) return "morning";
  if (startMin < 18 * 60) return "afternoon";
  return "evening";
}

function fmtBudget(
  stops: Array<{
    transport_price_min: number | null;
    transport_price_max: number | null;
  }>,
): string | null {
  // Sum the per-stop transport upper bound. plan_stops doesn't carry a
  // food/activity budget yet, so this is a "transport budget" proxy. We
  // show "Free" when nothing's set on any stop.
  let max = 0;
  let any = false;
  for (const s of stops) {
    const m =
      typeof s.transport_price_max === "number" ? s.transport_price_max : null;
    const lo =
      typeof s.transport_price_min === "number" ? s.transport_price_min : null;
    const v = m ?? lo;
    if (v != null) {
      any = true;
      max += v;
    }
  }
  if (!any) return "Free";
  return `~₺${max}`;
}

export function adaptPlanToCard(
  raw: PlanCardSummary,
  viewerId: string | null,
): TodayPlanCard {
  const firstStop = raw.stops[0];
  const lastStop = raw.stops[raw.stops.length - 1];
  const startMin = parseHHMM(firstStop?.start_time);
  const endMin =
    parseHHMM(lastStop?.end_time) ??
    parseHHMM(lastStop?.start_time) ??
    startMin;

  const hood = firstStop?.neighborhood_slug ?? null;
  const vibe = firstStop?.vibe ?? null;

  const seenNames = new Set<string>();
  const attendees = raw.attendees
    .filter((a) => {
      if (seenNames.has(a.display_name)) return false;
      seenNames.add(a.display_name);
      return true;
    })
    .map((a) => ({ name: a.display_name, avatarUrl: a.avatar_url }));

  // Budget summary - transport per stop summed; food/activity costs aren't
  // schema'd yet so this reads as a transport budget for now.
  const stopsForBudget = raw.stops.map((s) => ({
    transport_price_min: s.transport_price_min ?? null,
    transport_price_max: s.transport_price_max ?? null,
  }));

  return {
    id: raw.id,
    slot: slotFor(startMin),
    startTime: fmtHHMM(firstStop?.start_time),
    endTime: fmtHHMM(lastStop?.end_time ?? lastStop?.start_time),
    durationLabel: durationLabel(startMin, endMin),
    stops: raw.stops.length,
    hood,
    vibeLabel: vibe ? String(vibe) : null,
    title: raw.title ?? "Untitled plan",
    host: raw.host
      ? {
          name: raw.host.display_name,
          avatarUrl: raw.host.avatar_url,
          type: raw.host.member_type === "guide" ? "guide" : "nomad",
        }
      : null,
    filled: raw.attendee_count,
    seats: raw.capacity ?? null,
    attendees,
    budgetLabel: fmtBudget(stopsForBudget),
    agenda: raw.stops.map((s) => {
      const cost = s.transport_price_max ?? s.transport_price_min ?? null;
      return {
        time: fmtHHMM(s.start_time),
        title: s.notes ?? (s.vibe ? String(s.vibe) : "Stop"),
        place: s.custom_location ?? s.neighborhood_slug ?? "",
        cost: cost != null ? `₺${cost}` : null,
      };
    }),
    mine: !!viewerId && raw.creator_id === viewerId,
  };
}

export function groupBySlot(
  cards: TodayPlanCard[],
): Record<TodaySlot, TodayPlanCard[]> {
  const by: Record<TodaySlot, TodayPlanCard[]> = {
    morning: [],
    afternoon: [],
    evening: [],
  };
  for (const c of cards) by[c.slot].push(c);
  return by;
}
