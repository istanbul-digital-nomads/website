import type { PlanCardSummary } from "@/lib/plans/queries";

// Proper display names for the neighbourhood slugs the composer produces.
// Neighbourhood names are proper nouns (same across locales), so a static map
// keeps the Turkish diacritics correct without an i18n round-trip; unknown
// slugs fall back to a title-cased version.
const NEIGHBORHOOD_LABELS: Record<string, string> = {
  kadikoy: "Kadıköy",
  moda: "Moda",
  sisli: "Şişli",
  nisantasi: "Nişantaşı",
  besiktas: "Beşiktaş",
  beyoglu: "Beyoğlu",
  karakoy: "Karaköy",
  galata: "Galata",
  taksim: "Taksim",
  cihangir: "Cihangir",
  uskudar: "Üsküdar",
  levent: "Levent",
  balat: "Balat",
  fatih: "Fatih",
  sultanahmet: "Sultanahmet",
  bakirkoy: "Bakırköy",
  sariyer: "Sarıyer",
  bebek: "Bebek",
  ortakoy: "Ortaköy",
  arnavutkoy: "Arnavutköy",
  etiler: "Etiler",
  maslak: "Maslak",
  eminonu: "Eminönü",
  atasehir: "Ataşehir",
};

export function neighborhoodLabel(slug: string | null | undefined): string {
  if (!slug) return "";
  return (
    NEIGHBORHOOD_LABELS[slug] ??
    slug
      .split("-")
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
      .join(" ")
  );
}

// Unique neighbourhood labels across a plan's stops, in stop order.
export function planNeighborhoods(plan: PlanCardSummary): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const stop of plan.stops) {
    const slug = stop.neighborhood_slug;
    if (!slug || seen.has(slug)) continue;
    seen.add(slug);
    out.push(neighborhoodLabel(slug));
  }
  return out;
}

// Display name for a stop on the share images (no DB/space lookup - uses the
// custom_location the plan carries, falling back to the neighbourhood).
export function planStopName(stop: PlanCardSummary["stops"][number]): string {
  return (
    stop.custom_location ?? neighborhoodLabel(stop.neighborhood_slug) ?? "Stop"
  );
}

export function planDateLabel(scheduledDate: string, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date(`${scheduledDate}T12:00:00Z`));
}

// "09:00 - 11:30" from a stop's times.
export function planStopTime(start: string | null, end: string | null): string {
  if (!start) return "";
  const s = start.slice(0, 5);
  return end ? `${s} - ${end.slice(0, 5)}` : s;
}
