import {
  neighborhoods,
  type Neighborhood,
  type NeighborhoodSlug,
} from "@/lib/neighborhoods";

export type RhythmKey =
  | "quiet"
  | "social"
  | "budget"
  | "ferry"
  | "seaside"
  | "business"
  | "nightlife"
  | "character";

export interface RhythmOption {
  key: RhythmKey;
  label: string;
  shortLabel: string;
  description: string;
}

export const rhythmOptions: RhythmOption[] = [
  {
    key: "quiet",
    label: "Quiet routine",
    shortLabel: "Quiet",
    description: "Low-noise streets, calmer evenings, easier focus.",
  },
  {
    key: "social",
    label: "Social momentum",
    shortLabel: "Social",
    description: "Easy first friends, events, cafes, and after-work plans.",
  },
  {
    key: "budget",
    label: "Budget aware",
    shortLabel: "Budget",
    description: "Better rent value without losing daily convenience.",
  },
  {
    key: "ferry",
    label: "Ferry-first",
    shortLabel: "Ferry",
    description: "A commute that feels like a reset instead of a chore.",
  },
  {
    key: "seaside",
    label: "Seaside walks",
    shortLabel: "Seaside",
    description: "Water, sunset routes, and an easier nervous system.",
  },
  {
    key: "business",
    label: "Business mode",
    shortLabel: "Business",
    description: "Coworking density, meeting access, gyms, and infrastructure.",
  },
  {
    key: "nightlife",
    label: "Nightlife nearby",
    shortLabel: "Nightlife",
    description: "Bars, dinners, galleries, and spontaneous evenings.",
  },
  {
    key: "character",
    label: "Character-heavy",
    shortLabel: "Character",
    description: "Historic streets, imperfect charm, and memorable texture.",
  },
];

type RhythmScoreMap = Record<RhythmKey, number>;

const rhythmScores: Record<NeighborhoodSlug, RhythmScoreMap> = {
  kadikoy: {
    quiet: 55,
    social: 72,
    budget: 86,
    ferry: 100,
    seaside: 70,
    business: 70,
    nightlife: 68,
    character: 74,
  },
  moda: {
    quiet: 96,
    social: 42,
    budget: 72,
    ferry: 76,
    seaside: 100,
    business: 48,
    nightlife: 38,
    character: 68,
  },
  cihangir: {
    quiet: 34,
    social: 98,
    budget: 32,
    ferry: 54,
    seaside: 42,
    business: 68,
    nightlife: 96,
    character: 88,
  },
  besiktas: {
    quiet: 24,
    social: 84,
    budget: 62,
    ferry: 92,
    seaside: 70,
    business: 64,
    nightlife: 78,
    character: 72,
  },
  galata: {
    quiet: 20,
    social: 82,
    budget: 26,
    ferry: 70,
    seaside: 45,
    business: 76,
    nightlife: 90,
    character: 92,
  },
  uskudar: {
    quiet: 90,
    social: 36,
    budget: 84,
    ferry: 96,
    seaside: 88,
    business: 45,
    nightlife: 28,
    character: 76,
  },
  nisantasi: {
    quiet: 58,
    social: 76,
    budget: 22,
    ferry: 20,
    seaside: 18,
    business: 78,
    nightlife: 70,
    character: 58,
  },
  levent: {
    quiet: 52,
    social: 42,
    budget: 44,
    ferry: 8,
    seaside: 10,
    business: 100,
    nightlife: 35,
    character: 22,
  },
  balat: {
    quiet: 48,
    social: 58,
    budget: 96,
    ferry: 38,
    seaside: 28,
    business: 32,
    nightlife: 52,
    character: 100,
  },
  atasehir: {
    quiet: 84,
    social: 30,
    budget: 68,
    ferry: 12,
    seaside: 16,
    business: 86,
    nightlife: 26,
    character: 18,
  },
};

export interface NeighborhoodMatch {
  neighborhood: Neighborhood;
  score: number;
  reasons: string[];
  matchingRhythms: RhythmOption[];
}

export function matchNeighborhoods(keys: RhythmKey[]): NeighborhoodMatch[] {
  const selected =
    keys.length > 0 ? keys : (["ferry", "budget"] as RhythmKey[]);

  return neighborhoods
    .map((neighborhood) => {
      const scores = rhythmScores[neighborhood.slug];
      const total = selected.reduce((sum, key) => sum + scores[key], 0);
      const matchingRhythms = rhythmOptions.filter(
        (option) => selected.includes(option.key) && scores[option.key] >= 70,
      );
      const reasons = buildReasons(neighborhood, selected, matchingRhythms);

      return {
        neighborhood,
        score: Math.round(total / selected.length),
        reasons,
        matchingRhythms,
      };
    })
    .sort((a, b) => b.score - a.score);
}

function buildReasons(
  neighborhood: Neighborhood,
  selected: RhythmKey[],
  matchingRhythms: RhythmOption[],
): string[] {
  const reasons: string[] = matchingRhythms.slice(0, 2).map((option) => {
    if (option.key === "quiet") return "The day-to-day pace stays calmer.";
    if (option.key === "social")
      return "It has enough social gravity for a first month.";
    if (option.key === "budget")
      return "Rent stays more forgiving than the premium core.";
    if (option.key === "ferry")
      return "Ferries can become part of the routine.";
    if (option.key === "seaside")
      return "Waterfront walks are part of the local rhythm.";
    if (option.key === "business")
      return "Work infrastructure is easy to reach.";
    if (option.key === "nightlife")
      return "Evenings are close without over-planning.";
    return "The streets have a stronger sense of place.";
  });

  if (reasons.length === 0) {
    reasons.push(neighborhood.oneLiner.replace(/\.$/, "."));
  }

  if (selected.includes("quiet") && neighborhood.noise === "Low") {
    reasons.push("Low-noise profile.");
  } else if (selected.includes("social") && neighborhood.noise !== "Low") {
    reasons.push("Enough street energy to meet people naturally.");
  }

  return reasons.slice(0, 3);
}

export const conditionalNeighborhoodAreas = [
  {
    area: "Yeldegirmeni",
    bestFor: "Cheaper Kadikoy-adjacent living, artists",
    tradeoff: "Older buildings, uneven apartment quality",
    verdict: "Yes, if Kadikoy is pricey",
  },
  {
    area: "Bomonti / Ferikoy",
    bestFor: "New builds, Bomontiada, central access",
    tradeoff: "Less village feeling, more taxi/metro planning",
    verdict: "Good for mid-stays",
  },
  {
    area: "Sisli / Mecidiyekoy",
    bestFor: "Metro access, errands, lower central rent",
    tradeoff: "Dense, busy, less charming",
    verdict: "Practical, not romantic",
  },
  {
    area: "Etiler",
    bestFor: "High budget, gyms, restaurants, comfort",
    tradeoff: "Expensive, less walkable for daily nomad community",
    verdict: "Yes, with a high budget",
  },
  {
    area: "Kagithane",
    bestFor: "Newer apartments, value near Levent",
    tradeoff: "Car-heavy pockets, less neighborhood texture",
    verdict: "Good if work is nearby",
  },
];

export const avoidFirstBaseAreas = [
  {
    area: "Sultanahmet",
    why: "Beautiful for sightseeing, but tourist-heavy and weak for daily work life.",
    exception: "Two or three nights before moving to a real base.",
  },
  {
    area: "Fatih core",
    why: "Central and cheaper, but harder for first-time apartment hunting.",
    exception: "You have local help and know the exact street.",
  },
  {
    area: "Esenyurt / Beylikduzu",
    why: "Cheaper rents, but far from the community and central work/social life.",
    exception: "Family reasons or a very specific west-side commitment.",
  },
  {
    area: "Basaksehir",
    why: "Newer housing, but car-dependent and disconnected from nomad routines.",
    exception: "You need that district for family, work, or school.",
  },
  {
    area: "Pendik / Tuzla",
    why: "Useful for specific Asian-side work, otherwise too far east.",
    exception: "Your office or partner is already there.",
  },
  {
    area: "Princes' Islands",
    why: "Beautiful and quiet, but ferry-dependent and awkward for regular meetups.",
    exception: "A deliberate writing retreat or weekend reset.",
  },
];
