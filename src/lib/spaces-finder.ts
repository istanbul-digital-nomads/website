import {
  computeNomadScore,
  isPartialScore,
  type NomadSpace,
} from "@/lib/spaces";

export type FinderMode =
  | "best"
  | "calls"
  | "quiet"
  | "rain"
  | "late"
  | "budget"
  | "first-visit";

export type SpaceTypeFilter = "all" | "cafe" | "coworking";
export type SpaceSort = "recommended" | "score" | "name";

export interface SpaceFinderFilters {
  search: string;
  mode: FinderMode;
  type: SpaceTypeFilter;
  neighborhood: string;
  needs: SpaceNeed[];
  sort: SpaceSort;
}

export type SpaceNeed =
  | "callsFriendly"
  | "quiet"
  | "strongSockets"
  | "rainSafe"
  | "firstVisit"
  | "openLate"
  | "budget";

export interface SpaceSignals {
  callsFriendly: boolean;
  quiet: boolean;
  strongSockets: boolean;
  rainSafe: boolean;
  firstVisit: boolean;
  openLate: boolean;
  budget: boolean;
  socialEnough: boolean;
  bringHeadphones: boolean;
  bestBeforeLunch: boolean;
  laptopSafe: boolean;
  score: number | null;
  partialScore: boolean;
  labels: string[];
  caution: string | null;
}

export interface RankedSpace {
  space: NomadSpace;
  signals: SpaceSignals;
  recommendationScore: number;
  matchReasons: string[];
}

export const finderModes: {
  value: FinderMode;
  label: string;
  description: string;
}[] = [
  {
    value: "best",
    label: "Best today",
    description: "Balanced picks for getting real work done.",
  },
  {
    value: "calls",
    label: "Calls",
    description: "Safer for meetings, booths, or quieter corners.",
  },
  {
    value: "quiet",
    label: "Quiet focus",
    description: "Lower noise and fewer peak-hour surprises.",
  },
  {
    value: "rain",
    label: "Rain-safe",
    description: "Indoor, reliable, and worth staying put.",
  },
  {
    value: "late",
    label: "Open late",
    description: "Better bets after normal cafe hours.",
  },
  {
    value: "budget",
    label: "Budget",
    description: "Lower-cost or stronger value signals.",
  },
  {
    value: "first-visit",
    label: "First visit",
    description: "Easy places to try before building a routine.",
  },
];

export const needOptions: {
  value: SpaceNeed;
  label: string;
  description: string;
}[] = [
  {
    value: "callsFriendly",
    label: "Calls-friendly",
    description: "Meeting rooms, booths, coworking, or quieter setup.",
  },
  {
    value: "quiet",
    label: "Quiet",
    description: "Good noise score or calm work profile.",
  },
  {
    value: "strongSockets",
    label: "Strong sockets",
    description: "Power score, charging sockets, or desk setup.",
  },
  {
    value: "rainSafe",
    label: "Rain-safe",
    description: "Indoor, stable, and not just a street-side coffee stop.",
  },
  {
    value: "firstVisit",
    label: "First visit",
    description: "Open, laptop-safe, and easier to understand quickly.",
  },
  {
    value: "openLate",
    label: "Open late",
    description: "Late hours or member access beyond the cafe day.",
  },
  {
    value: "budget",
    label: "Budget",
    description: "Lower price range or value score.",
  },
];

const defaultNeighborhood = "All neighborhoods";

export function getSpaceNeighborhoods(spaces: NomadSpace[]) {
  return [
    defaultNeighborhood,
    ...Array.from(new Set(spaces.map((space) => space.neighborhood))).sort(
      (a, b) => a.localeCompare(b),
    ),
  ];
}

export function getDefaultSpaceFinderFilters(): SpaceFinderFilters {
  return {
    search: "",
    mode: "best",
    type: "all",
    neighborhood: defaultNeighborhood,
    needs: [],
    sort: "recommended",
  };
}

export function rankSpaces(
  spaces: NomadSpace[],
  filters: SpaceFinderFilters,
): RankedSpace[] {
  const search = filters.search.trim().toLowerCase();
  const needs = new Set(filters.needs);

  return spaces
    .map((space) => {
      const signals = deriveSpaceSignals(space);
      return {
        space,
        signals,
        recommendationScore: scoreSpaceForMode(space, signals, filters.mode),
        matchReasons: buildMatchReasons(space, signals, filters.mode),
      };
    })
    .filter(({ space, signals }) => {
      if (filters.type !== "all" && space.type !== filters.type) return false;
      if (
        filters.neighborhood !== defaultNeighborhood &&
        space.neighborhood !== filters.neighborhood
      ) {
        return false;
      }
      if (search && !matchesSearch(space, signals, search)) return false;
      for (const need of needs) {
        if (!signals[need]) return false;
      }
      return true;
    })
    .sort((a, b) => sortRankedSpaces(a, b, filters.sort));
}

export function deriveSpaceSignals(space: NomadSpace): SpaceSignals {
  const score = computeNomadScore(space.nomad_score);
  const amenities = (space.amenities ?? []).join(" ").toLowerCase();
  const description = space.description.toLowerCase();
  const hours = space.hours?.toLowerCase() ?? "";
  const price = space.price_range ?? "";
  const coworking = space.type === "coworking";
  const noise = space.nomad_score.noise;
  const power = space.nomad_score.power;
  const comfort = space.nomad_score.comfort;
  const vibe = space.nomad_score.vibe;
  const value = space.nomad_score.value;

  const strongSockets =
    (power != null && power >= 4) ||
    /socket|outlet|power|charging|standing desk|desk/.test(amenities) ||
    /socket|outlet|power|charging|desk/.test(description);
  const quiet =
    (noise != null && noise >= 4) || /quiet|calm|minimal/.test(description);
  const callsFriendly =
    coworking ||
    (/phone booth|meeting room|call/.test(amenities) && quiet) ||
    (quiet && strongSockets && comfort != null && comfort >= 4);
  const openLate = /24\/7|2am|11pm|10pm|22:00|23:00|02:00/.test(hours);
  const budget =
    price === "$" ||
    (value != null && value >= 4) ||
    /free coffee|unlimited coffee|chain reliability/.test(amenities);
  const rainSafe =
    coworking ||
    (comfort != null && comfort >= 4 && strongSockets) ||
    /two floors|meeting room|lounge|library|inside|indoor/.test(amenities);
  const laptopSafe = space.laptop_friendly && space.status !== "closed";
  const firstVisit =
    laptopSafe &&
    space.status === "open" &&
    (score == null || score >= 3.2) &&
    (strongSockets || coworking || space.hours != null);
  const socialEnough =
    coworking ||
    (vibe != null && vibe >= 4) ||
    /event|community|group|social/.test(amenities);
  const bringHeadphones =
    (noise != null && noise <= 2) || /noisy|loud|peak/.test(description);
  const bestBeforeLunch =
    /peak|tight|small|fills|seating can be tight/.test(description) ||
    (space.type === "cafe" && !openLate && comfort != null && comfort <= 3);

  const labels = buildLabels({
    callsFriendly,
    quiet,
    strongSockets,
    rainSafe,
    firstVisit,
    openLate,
    budget,
    socialEnough,
    bringHeadphones,
    bestBeforeLunch,
    laptopSafe,
  });

  return {
    callsFriendly,
    quiet,
    strongSockets,
    rainSafe,
    firstVisit,
    openLate,
    budget,
    socialEnough,
    bringHeadphones,
    bestBeforeLunch,
    laptopSafe,
    score,
    partialScore: score != null && isPartialScore(space.nomad_score),
    labels,
    caution: buildCaution(space, bringHeadphones, bestBeforeLunch),
  };
}

function scoreSpaceForMode(
  space: NomadSpace,
  signals: SpaceSignals,
  mode: FinderMode,
) {
  let score = signals.score ?? 2.6;
  if (space.status === "open") score += 0.25;
  if (signals.laptopSafe) score += 0.25;
  if (signals.strongSockets) score += 0.25;
  if (signals.firstVisit) score += 0.15;
  if (signals.partialScore) score -= 0.1;

  const boosts: Record<FinderMode, Array<[boolean, number]>> = {
    best: [
      [signals.laptopSafe, 0.35],
      [signals.firstVisit, 0.25],
      [signals.rainSafe, 0.15],
    ],
    calls: [
      [signals.callsFriendly, 1.2],
      [signals.quiet, 0.35],
      [signals.strongSockets, 0.25],
    ],
    quiet: [
      [signals.quiet, 1.1],
      [signals.bringHeadphones, -0.6],
      [signals.bestBeforeLunch, -0.15],
    ],
    rain: [
      [signals.rainSafe, 1.1],
      [space.type === "coworking", 0.35],
      [signals.strongSockets, 0.2],
    ],
    late: [
      [signals.openLate, 1.1],
      [space.type === "coworking", 0.2],
    ],
    budget: [
      [signals.budget, 1],
      [space.price_range === "$$$", -0.45],
    ],
    "first-visit": [
      [signals.firstVisit, 1.1],
      [signals.bringHeadphones, -0.25],
      [space.status === "open", 0.25],
    ],
  };

  for (const [condition, value] of boosts[mode]) {
    if (condition) score += value;
  }

  return Math.round(score * 100) / 100;
}

function buildMatchReasons(
  space: NomadSpace,
  signals: SpaceSignals,
  mode: FinderMode,
) {
  const reasons: string[] = [];
  if (signals.score != null)
    reasons.push(`${signals.score.toFixed(1)} Nomad Score`);
  if (signals.callsFriendly && mode === "calls")
    reasons.push("safer for calls");
  if (signals.quiet && mode === "quiet") reasons.push("quiet profile");
  if (signals.rainSafe && mode === "rain") reasons.push("rain-safe setup");
  if (signals.openLate && mode === "late") reasons.push("late option");
  if (signals.budget && mode === "budget") reasons.push("budget-aware");
  if (signals.firstVisit && mode === "first-visit")
    reasons.push("easy first try");
  if (signals.strongSockets) reasons.push("socket confidence");
  if (space.type === "coworking") reasons.push("coworking baseline");
  if (reasons.length === 0) reasons.push("worth comparing");
  return reasons.slice(0, 3);
}

function buildLabels(
  signals: Omit<SpaceSignals, "score" | "partialScore" | "labels" | "caution">,
) {
  const labels: string[] = [];
  if (signals.callsFriendly) labels.push("Good for calls");
  if (signals.laptopSafe) labels.push("Laptop-safe");
  if (signals.strongSockets) labels.push("Strong sockets");
  if (signals.rainSafe) labels.push("Rain-safe");
  if (signals.openLate) labels.push("Open late");
  if (signals.budget) labels.push("Budget-aware");
  if (signals.socialEnough) labels.push("Social enough");
  if (signals.bringHeadphones) labels.push("Bring headphones");
  if (signals.bestBeforeLunch) labels.push("Best before lunch");
  return labels.slice(0, 5);
}

function buildCaution(
  space: NomadSpace,
  bringHeadphones: boolean,
  bestBeforeLunch: boolean,
) {
  if (space.unverified_fields?.includes("wifi_speed")) {
    return "Wifi speed still needs a live check.";
  }
  if (bringHeadphones) return "Noise can be part of the deal here.";
  if (bestBeforeLunch) return "Try it earlier before seating gets tight.";
  return null;
}

function matchesSearch(
  space: NomadSpace,
  signals: SpaceSignals,
  search: string,
) {
  const haystack = [
    space.name,
    space.description,
    space.neighborhood,
    space.address,
    space.type,
    space.price_range,
    space.hours,
    ...(space.amenities ?? []),
    ...signals.labels,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return haystack.includes(search);
}

function sortRankedSpaces(a: RankedSpace, b: RankedSpace, sort: SpaceSort) {
  if (sort === "name") return a.space.name.localeCompare(b.space.name);
  if (sort === "score") {
    return (b.signals.score ?? -1) - (a.signals.score ?? -1);
  }
  return b.recommendationScore - a.recommendationScore;
}
