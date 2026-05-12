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

// Prose for each rhythm option (label/shortLabel/description) lives in the
// `sections.rhythmSignals` namespace and is read in the consumer via
// `useTranslations`. The data layer only owns the stable ordering and keys.
export interface RhythmOption {
  key: RhythmKey;
}

export const rhythmOptions: RhythmOption[] = [
  { key: "quiet" },
  { key: "social" },
  { key: "budget" },
  { key: "ferry" },
  { key: "seaside" },
  { key: "business" },
  { key: "nightlife" },
  { key: "character" },
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

// Reason codes resolved to localized strings on the client via the
// `sections.rhythmMatcher.reasons.*` namespace, with a special "oneLiner"
// code that the consumer maps to the neighborhood's localized one-liner.
export type ReasonCode =
  | "quiet"
  | "social"
  | "budget"
  | "ferry"
  | "seaside"
  | "business"
  | "nightlife"
  | "character"
  | "lowNoise"
  | "streetEnergy"
  | "oneLiner";

export interface NeighborhoodMatch {
  neighborhood: Neighborhood;
  score: number;
  reasons: ReasonCode[];
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
): ReasonCode[] {
  const reasons: ReasonCode[] = matchingRhythms
    .slice(0, 2)
    .map((option) => option.key as ReasonCode);

  if (reasons.length === 0) {
    reasons.push("oneLiner");
  }

  if (selected.includes("quiet") && neighborhood.noise === "Low") {
    reasons.push("lowNoise");
  } else if (selected.includes("social") && neighborhood.noise !== "Low") {
    reasons.push("streetEnergy");
  }

  return reasons.slice(0, 3);
}

// The prose for each entry lives in the
// `neighborhoodGuidePage.conditionalAreas.<id>` namespace; the data layer
// owns only the stable id and ordering.
export interface ConditionalAreaRef {
  id: string;
}

export const conditionalNeighborhoodAreas: ConditionalAreaRef[] = [
  { id: "yeldegirmeni" },
  { id: "bomontiFerikoy" },
  { id: "sisliMecidiyekoy" },
  { id: "etiler" },
  { id: "kagithane" },
];

// The prose for each entry lives in the
// `neighborhoodGuidePage.avoidAreas.<id>` namespace.
export interface AvoidAreaRef {
  id: string;
}

export const avoidFirstBaseAreas: AvoidAreaRef[] = [
  { id: "sultanahmet" },
  { id: "fatihCore" },
  { id: "esenyurtBeylikduzu" },
  { id: "basaksehir" },
  { id: "pendikTuzla" },
  { id: "princesIslands" },
];
