// Deterministic plan builder. No LLM. Picks the best-fit neighborhood for
// a given intake by scoring each neighborhood we cover, then
// composes the rest of the plan from typed structured data:
//
//   - cost_breakdown: tier-based, with rent line swapped for the chosen
//     neighborhood's actual range
//   - setup_plan: bucketed from the 12 typed setup steps
//   - strategy: rule-based templates conditional on intake
//   - tips: curated tips, filtered + ordered by intake
//   - citations: every source we actually read
//
// Sub-millisecond, free, predictable. Same intake = same plan.

import { neighborhoods, type Neighborhood } from "@/lib/neighborhoods";
import { costTiers, pickTierForBudget } from "./cost-tiers";
import { setupSteps } from "./setup-steps";
import type { RelocationIntake, RelocationPlan } from "./types";

// ----------------------------------------------------------------------------
// Neighborhood profile - hand-tuned axes per neighborhood. Each axis is
// 0-100. These are derived from the prose vibe + bestFor + side fields in
// neighborhoods.ts but encoded explicitly so scoring is fast and tweakable
// without re-parsing strings
// ----------------------------------------------------------------------------

interface NeighborhoodProfile {
  social: number;
  quiet: number;
  ferryAccess: number;
  socialScene: number;
  nearCoworking: number;
  // Higher = more affordable feel for budget-conscious nomads
  budgetFriendly: number;
  // Higher = closer to the tourist/business core
  central: number;
}

const PROFILES: Record<string, NeighborhoodProfile> = {
  kadikoy: {
    social: 60,
    quiet: 50,
    ferryAccess: 100,
    socialScene: 60,
    nearCoworking: 95,
    budgetFriendly: 90,
    central: 60,
  },
  moda: {
    social: 30,
    quiet: 95,
    ferryAccess: 70,
    socialScene: 30,
    nearCoworking: 60,
    budgetFriendly: 75,
    central: 40,
  },
  cihangir: {
    social: 95,
    quiet: 30,
    ferryAccess: 60,
    socialScene: 95,
    nearCoworking: 80,
    budgetFriendly: 30,
    central: 90,
  },
  besiktas: {
    social: 80,
    quiet: 20,
    ferryAccess: 90,
    socialScene: 75,
    nearCoworking: 70,
    budgetFriendly: 60,
    central: 85,
  },
  galata: {
    social: 75,
    quiet: 25,
    ferryAccess: 65,
    socialScene: 80,
    nearCoworking: 75,
    budgetFriendly: 20,
    central: 100,
  },
  uskudar: {
    social: 40,
    quiet: 85,
    ferryAccess: 95,
    socialScene: 35,
    nearCoworking: 45,
    budgetFriendly: 85,
    central: 65,
  },
  nisantasi: {
    social: 70,
    quiet: 55,
    ferryAccess: 25,
    socialScene: 70,
    nearCoworking: 75,
    budgetFriendly: 25,
    central: 90,
  },
  levent: {
    social: 45,
    quiet: 50,
    ferryAccess: 10,
    socialScene: 45,
    nearCoworking: 100,
    budgetFriendly: 40,
    central: 80,
  },
  balat: {
    social: 55,
    quiet: 45,
    ferryAccess: 45,
    socialScene: 60,
    nearCoworking: 35,
    budgetFriendly: 95,
    central: 70,
  },
  atasehir: {
    social: 35,
    quiet: 80,
    ferryAccess: 15,
    socialScene: 35,
    nearCoworking: 80,
    budgetFriendly: 70,
    central: 45,
  },
};

// ----------------------------------------------------------------------------
// Scoring axes
// ----------------------------------------------------------------------------

// Budget fit: roughly 45% of monthly budget should cover rent. Score 100
// if the neighborhood's average rent is at or below that ceiling, with a
// linear penalty as it goes over (and a smaller bonus if there's headroom)
function budgetFitScore(neighborhood: Neighborhood, budgetUsd: number): number {
  const avgRent = (neighborhood.rentUsd.low + neighborhood.rentUsd.high) / 2;
  const ceiling = budgetUsd * 0.45;
  if (avgRent <= ceiling) {
    // Headroom bonus, capped so a tiny rent doesn't dominate the score
    const headroom = Math.min((ceiling - avgRent) / ceiling, 0.3);
    return 100 - 20 * headroom; // 80 to 100
  }
  // Over budget: linear falloff
  const overshoot = (avgRent - ceiling) / ceiling;
  return Math.max(0, 100 - overshoot * 200);
}

function lifestyleScore(
  profile: NeighborhoodProfile,
  lifestyle: RelocationIntake["lifestyle"],
): number {
  if (lifestyle === "social") return profile.social;
  if (lifestyle === "quiet") return profile.quiet;
  // mixed
  return (profile.social + profile.quiet) / 2;
}

const MUST_HAVE_AXIS: Record<string, keyof NeighborhoodProfile | null> = {
  "fast wifi": null, // every neighborhood has fast wifi options - neutral
  "ferry commute": "ferryAccess",
  "quiet street": "quiet",
  "social scene": "socialScene",
  "gym nearby": null, // no structured gym data yet
  "vegetarian-friendly": null, // no structured veg data yet
  "near coworking": "nearCoworking",
};

function mustHavesScore(
  profile: NeighborhoodProfile,
  mustHaves: string[] | undefined,
): number {
  if (!mustHaves || mustHaves.length === 0) return 70; // neutral
  let total = 0;
  let counted = 0;
  for (const tag of mustHaves) {
    const axis = MUST_HAVE_AXIS[tag];
    if (axis) {
      total += profile[axis];
      counted++;
    }
  }
  if (counted === 0) return 70;
  return total / counted;
}

function workScore(
  profile: NeighborhoodProfile,
  work: RelocationIntake["work"],
): number {
  switch (work) {
    case "remote-fulltime":
      // Calls all day → wants quieter neighborhoods with coworking nearby
      return profile.quiet * 0.5 + profile.nearCoworking * 0.5;
    case "remote-flex":
      // Mix of work and exploring → balanced
      return (
        profile.quiet * 0.3 +
        profile.socialScene * 0.4 +
        profile.nearCoworking * 0.3
      );
    case "freelance":
      // Cash flow varies → favor cheaper
      return profile.budgetFriendly * 0.6 + profile.nearCoworking * 0.4;
    case "founder":
      // Networking matters → European-side bias + central
      return profile.central * 0.5 + profile.socialScene * 0.5;
    case "other":
    default:
      return 60;
  }
}

function durationScore(
  profile: NeighborhoodProfile,
  duration: RelocationIntake["duration"],
): number {
  switch (duration) {
    case "few-weeks":
      // Visiting → central, touristy is fine
      return profile.central * 0.6 + profile.socialScene * 0.4;
    case "1-3-months":
      // Mid-stay → balanced
      return (
        profile.budgetFriendly * 0.4 +
        profile.central * 0.3 +
        profile.nearCoworking * 0.3
      );
    case "3-6-months":
    case "6-plus-months":
      // Settling in → favor cheaper + walkable communities
      return profile.budgetFriendly * 0.6 + profile.nearCoworking * 0.4;
    default:
      return 60;
  }
}

interface NeighborhoodScore {
  neighborhood: Neighborhood;
  total: number;
  parts: {
    budget: number;
    lifestyle: number;
    mustHaves: number;
    work: number;
    duration: number;
  };
}

// Weight matters here. Budget and lifestyle are the big signals. Others
// are tie-breakers
const WEIGHTS = {
  budget: 0.3,
  lifestyle: 0.25,
  mustHaves: 0.2,
  work: 0.15,
  duration: 0.1,
};

export function scoreNeighborhoods(
  intake: RelocationIntake,
): NeighborhoodScore[] {
  const usdBudget = toUsd(intake.budget, intake.currency);
  const scored = neighborhoods.map((n) => {
    const profile = PROFILES[n.slug] ?? {
      social: 50,
      quiet: 50,
      ferryAccess: 50,
      socialScene: 50,
      nearCoworking: 50,
      budgetFriendly: 50,
      central: 50,
    };
    const parts = {
      budget: budgetFitScore(n, usdBudget),
      lifestyle: lifestyleScore(profile, intake.lifestyle),
      mustHaves: mustHavesScore(profile, intake.mustHaves),
      work: workScore(profile, intake.work),
      duration: durationScore(profile, intake.duration),
    };
    const total =
      parts.budget * WEIGHTS.budget +
      parts.lifestyle * WEIGHTS.lifestyle +
      parts.mustHaves * WEIGHTS.mustHaves +
      parts.work * WEIGHTS.work +
      parts.duration * WEIGHTS.duration;
    return { neighborhood: n, total, parts };
  });
  // Highest score first
  scored.sort((a, b) => b.total - a.total);
  return scored;
}

// Loose currency conversion for intake comparison only. We don't quote
// these numbers back to the user; they read native USD/TL throughout
function toUsd(amount: number, currency: RelocationIntake["currency"]): number {
  if (currency === "USD") return amount;
  if (currency === "EUR") return amount * 1.08;
  // TL: rough rate; the agent's budget tiers are in USD anyway
  return amount / 31;
}

// ----------------------------------------------------------------------------
// Reasoning prose. Templated, but uses the neighborhood's own oneLiner +
// vibe to feel natural. No em dashes, casual contractions, brand voice
// ----------------------------------------------------------------------------

function describeLifestyleMatch(
  lifestyle: RelocationIntake["lifestyle"],
  neighborhood: Neighborhood,
): string {
  const profile = PROFILES[neighborhood.slug];
  if (!profile) return "";
  if (lifestyle === "social" && profile.social >= 70) {
    return `It's one of the most socially alive spots we cover, with a ${neighborhood.noise.toLowerCase()}-noise rhythm to match.`;
  }
  if (lifestyle === "quiet" && profile.quiet >= 70) {
    return `It's one of the quietest neighborhoods we recommend - ${neighborhood.noise.toLowerCase()} noise level, a calmer pace, easy mornings.`;
  }
  if (lifestyle === "mixed") {
    return `The vibe lands in the middle: lively when you want it, calm when you don't.`;
  }
  return `The vibe is ${neighborhood.vibe.split(".")[0].toLowerCase()}.`;
}

function buildReasoning(
  neighborhood: Neighborhood,
  intake: RelocationIntake,
): string {
  const parts: string[] = [];

  // Lead with neighborhood oneLiner stripped of trailing period
  const oneLiner = neighborhood.oneLiner.trim().replace(/\.$/, "");
  parts.push(`${oneLiner}.`);

  parts.push(describeLifestyleMatch(intake.lifestyle, neighborhood));

  // Rent context
  const rentLow = neighborhood.rentUsd.low;
  const rentHigh = neighborhood.rentUsd.high;
  parts.push(
    `Furnished 1BR runs $${rentLow}-${rentHigh} a month, which fits comfortably inside your ${intake.currency} ${intake.budget} budget once you add groceries and transport.`,
  );

  // Must-have callouts that genuinely match
  const profile = PROFILES[neighborhood.slug];
  if (intake.mustHaves && profile) {
    const matched: string[] = [];
    for (const mh of intake.mustHaves) {
      const axis = MUST_HAVE_AXIS[mh];
      if (axis && profile[axis] >= 75) {
        matched.push(mh);
      }
    }
    if (matched.length === 1) {
      parts.push(`On your "${matched[0]}" must-have, this is the right pick.`);
    } else if (matched.length > 1) {
      const last = matched[matched.length - 1];
      const head = matched.slice(0, -1).join(", ");
      parts.push(
        `On your "${head}" and "${last}" must-haves, this is the right pick.`,
      );
    }
  }

  return parts.filter(Boolean).join(" ");
}

// ----------------------------------------------------------------------------
// Cost breakdown - pick the tier that matches the budget, then swap the
// rent line for the chosen neighborhood's actual range so the breakdown
// reflects the recommended location
// ----------------------------------------------------------------------------

function buildCostBreakdown(
  intake: RelocationIntake,
  primary: Neighborhood,
): RelocationPlan["cost_breakdown"] {
  const usdBudget = toUsd(intake.budget, intake.currency);
  const tier = pickTierForBudget(usdBudget);
  const tierData = costTiers.find((t) => t.tier === tier)!;

  // Replace the rent line with neighborhood-specific values. Tier line items
  // are immutable (typed), so we build a new array
  const lines = tierData.lines.map((line) => {
    if (line.label.toLowerCase().startsWith("rent")) {
      const avgUsd = Math.round(
        (primary.rentUsd.low + primary.rentUsd.high) / 2,
      );
      const avgTl = Math.round((primary.rentTl.low + primary.rentTl.high) / 2);
      return {
        label: `Rent (${primary.name}, furnished 1BR)`,
        usd: avgUsd,
        tl: avgTl,
        note: `Range: $${primary.rentUsd.low}-${primary.rentUsd.high}`,
      };
    }
    return { ...line };
  });

  const total = lines.reduce((sum, l) => sum + l.usd, 0);

  return {
    tier,
    monthly_total_usd: total,
    lines,
  };
}

// ----------------------------------------------------------------------------
// Setup plan - bucket the 12 typed setup steps by week, optionally trim
// long-term steps for short stays
// ----------------------------------------------------------------------------

function buildSetupPlan(
  intake: RelocationIntake,
): RelocationPlan["setup_plan"] {
  const isResidencePermit = (title: string) => /residence permit/i.test(title);
  const isLongHousing = (title: string) => /longer-term housing/i.test(title);

  const steps = setupSteps.filter((s) => {
    // Short stays don't need the residence permit step or the
    // unfurnished-housing pivot
    if (intake.duration === "few-weeks") {
      if (isResidencePermit(s.title)) return false;
      if (isLongHousing(s.title)) return false;
    }
    // 1-3 month visitors get most steps but not the residence-permit one
    if (intake.duration === "1-3-months" && isResidencePermit(s.title)) {
      return false;
    }
    return true;
  });

  // Group by week
  const byWeek = new Map<
    number,
    RelocationPlan["setup_plan"][number]["items"]
  >();
  for (const s of steps) {
    const items = byWeek.get(s.week) ?? [];
    items.push({ title: s.title, why: s.why, link: s.source_url });
    byWeek.set(s.week, items);
  }

  return Array.from(byWeek.entries())
    .sort(([a], [b]) => a - b)
    .map(([week, items]) => ({ week, items }));
}

// ----------------------------------------------------------------------------
// Strategy - rule-based contextual advice. Each rule fires conditionally
// on intake. Order matters; we keep them flowing logically
// ----------------------------------------------------------------------------

function buildStrategy(
  intake: RelocationIntake,
  primary: Neighborhood,
  alternates: Neighborhood[],
  costTier: "low" | "medium" | "high",
): string[] {
  const out: string[] = [];

  // Budget reality
  if (costTier === "low") {
    out.push(
      `Your budget puts you in the budget tier. Doable in ${primary.name} if you share a flat or take a smaller studio outside the absolute centre, cook most meals, and skip premium coworking.`,
    );
  } else if (costTier === "high") {
    out.push(
      `Your budget is comfortable. You can afford the best of ${primary.name} without tracking daily expenses, but it's still worth using Wise for currency conversion - bank ATMs charge 3-5% on top of the spread.`,
    );
  } else {
    out.push(
      `Your budget hits the sweet spot most nomads land at. Comfortable in ${primary.name} without overspending, with real margin for restaurants, day trips, and the occasional taxi.`,
    );
  }

  // Duration guidance
  if (intake.duration === "6-plus-months") {
    out.push(
      `Staying past 90 days means you'll need a residence permit. Start the paperwork in week 3 - it takes 4-8 weeks to process and you don't want to be racing your e-visa expiry.`,
    );
    out.push(
      `For 6+ months, switch from short-stay platforms to Sahibinden or Facebook groups by month two. Unfurnished apartments are 20-35% cheaper, and you'll save the difference on a few months of IKEA.`,
    );
  } else if (intake.duration === "few-weeks") {
    out.push(
      `For a few-week stay, skip the residence-permit hassle and stick with short-stay platforms (Airbnb / Flatio). Optimise for location over price - you don't have time to commute.`,
    );
  } else {
    out.push(
      `Mid-stay (1-6 months) sits in the housing sweet spot for Flatio and Spotahome. Book the first 2-4 weeks short, then pivot to a 1-3 month listing once you've walked a few neighborhoods on the ground.`,
    );
  }

  // Work-mode guidance
  if (intake.work === "founder") {
    out.push(
      `Building something here? KOSGEB has support programmes for founders, and Galata + Cihangir are where most of the local startup community gathers in person. Consider attending a Startup Istanbul or Girisim demo night within the first month.`,
    );
  } else if (intake.work === "remote-fulltime") {
    out.push(
      `Full-time remote means wifi reliability is a non-negotiable. Test your apartment's actual upload speed on day one - listings often misstate. If it's under 30 Mbps, ask the landlord to upgrade or move on.`,
    );
  }

  // Origin nudge
  if (intake.originCountry) {
    out.push(
      `Read our ${formatCountry(intake.originCountry)}-to-Istanbul playbook for visa specifics and community contacts you can lean on in the first weeks.`,
    );
  }

  // Alternates fallback
  if (alternates.length > 0) {
    out.push(
      `If ${primary.name} doesn't click on the ground, ${alternates.map((n) => n.name).join(" or ")} are the next-best fits for your profile. A two-week trial in your chosen spot before committing for longer is worth the extra Airbnb fee.`,
    );
  }

  return out;
}

function formatCountry(slug: string): string {
  // Slugs are kebab-case. Pretty-print
  return slug
    .split("-")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
}

// ----------------------------------------------------------------------------
// Tips - curated pool, ordered by intake relevance
// ----------------------------------------------------------------------------

interface Tip {
  text: string;
  // If set, the tip only applies when the intake matches one of these
  conditions?: Partial<{
    duration: RelocationIntake["duration"][];
    work: RelocationIntake["work"][];
    lifestyle: RelocationIntake["lifestyle"][];
    mustHave: string;
    sideAffinity: "Asian" | "European";
  }>;
  // Higher = surfaces sooner
  weight: number;
}

const TIP_POOL: Tip[] = [
  {
    text: "Use Wise or Revolut for currency conversion. Turkish bank ATMs charge 3-5% on top of the spread, which adds up over a few months.",
    weight: 90,
  },
  {
    text: "Get a personalised Istanbulkart at any customer service centre with your passport. Anonymous tourist cards cost 2-3x more per ride.",
    weight: 85,
  },
  {
    text: "Speed-test cafe wifi with fast.com before committing to a full work session. Posted speeds are often half the reality, and a few minutes of testing saves a half-day of frustration.",
    weight: 80,
    conditions: { mustHave: "fast wifi" },
  },
  {
    text: "Pay in TL, not USD. If a shop offers to charge in dollars, decline - their exchange rate is always worse than your card's.",
    weight: 75,
  },
  {
    text: "Negotiate rent. Unlike most of Western Europe, asking prices in Istanbul are negotiable, especially for stays of 3+ months. Offer 10-15% below the listing.",
    weight: 70,
    conditions: { duration: ["3-6-months", "6-plus-months"] },
  },
  {
    text: "Find your weekly pazar (street market) early. Every neighborhood has one and the produce is half the supermarket price.",
    weight: 65,
  },
  {
    text: "Don't book an Airbnb sight-unseen for more than two weeks. Walk the neighborhoods on the ground, then commit.",
    weight: 70,
    conditions: { duration: ["1-3-months", "3-6-months", "6-plus-months"] },
  },
  {
    text: "Use the BiTaksi app instead of hailing taxis. It shows the fare upfront and prevents meter scams.",
    weight: 60,
  },
  {
    text: "RSVP to one community event in your first two weeks. The feeling-lonely phase shortens dramatically once you've met five people in person.",
    weight: 65,
    conditions: { lifestyle: ["social", "mixed"] },
  },
  {
    text: "On the Asian side, the ferry is often faster than the Marmaray during rush hour. The view also doesn't hurt.",
    weight: 50,
    conditions: { sideAffinity: "Asian" },
  },
];

function buildTips(intake: RelocationIntake, primary: Neighborhood): string[] {
  const matchesIntake = (tip: Tip): boolean => {
    if (!tip.conditions) return true;
    const c = tip.conditions;
    if (c.duration && !c.duration.includes(intake.duration)) return false;
    if (c.work && !c.work.includes(intake.work)) return false;
    if (c.lifestyle && !c.lifestyle.includes(intake.lifestyle)) return false;
    if (c.mustHave && !(intake.mustHaves ?? []).includes(c.mustHave)) {
      return false;
    }
    if (c.sideAffinity && primary.side !== c.sideAffinity) return false;
    return true;
  };

  return TIP_POOL.filter(matchesIntake)
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 8)
    .map((t) => t.text);
}

// ----------------------------------------------------------------------------
// Citations - every source we drew from. We always read the cost-of-living
// guide + the chosen neighborhood. Setup steps and tips also cite their
// underlying guides
// ----------------------------------------------------------------------------

function buildCitations(
  primary: Neighborhood,
  alternates: Neighborhood[],
  setupPlan: RelocationPlan["setup_plan"],
  hasOriginPlaybook: boolean,
  originSlug: string | undefined,
): RelocationPlan["citations"] {
  const cites: RelocationPlan["citations"] = [];

  // Always: cost of living
  cites.push({
    source: "Cost of Living guide",
    source_type: "guide",
    source_slug: "cost-of-living",
  });

  // Primary + alternates
  cites.push({
    source: `${primary.name} neighborhood`,
    source_type: "neighborhood",
    source_slug: primary.slug,
  });
  for (const alt of alternates) {
    cites.push({
      source: `${alt.name} neighborhood`,
      source_type: "neighborhood",
      source_slug: alt.slug,
    });
  }

  // Setup steps - dedupe by source_slug
  const setupSlugs = new Set<string>();
  for (const week of setupPlan) {
    for (const item of week.items) {
      const matched = setupSteps.find((s) => s.title === item.title);
      if (matched && !setupSlugs.has(matched.source_slug)) {
        setupSlugs.add(matched.source_slug);
        cites.push({
          source: prettySlug(matched.source_slug),
          source_type: "guide",
          source_slug: matched.source_slug,
        });
      }
    }
  }

  // Origin playbook
  if (hasOriginPlaybook && originSlug) {
    cites.push({
      source: `${formatCountry(originSlug)} relocation playbook`,
      source_type: "path",
      source_slug: originSlug,
    });
  }

  return cites;
}

function prettySlug(slug: string): string {
  return slug
    .split("-")
    .map((w) => (w.length <= 2 ? w : w[0].toUpperCase() + w.slice(1)))
    .join(" ");
}

// ----------------------------------------------------------------------------
// Plan-text narrative. Deterministic synthesis from the structured plan.
// Brand voice: contractions, no em dashes, friendly. Reuses the agent's own
// reasoning + tips for grounding
// ----------------------------------------------------------------------------

export function synthesizeNarrative(plan: RelocationPlan): string {
  const primary = plan.neighborhood_match.primary;
  const alternates = plan.neighborhood_match.alternates ?? [];
  const reasoning = plan.neighborhood_match.reasoning.trim();
  const total = plan.cost_breakdown.monthly_total_usd;
  const tier = plan.cost_breakdown.tier;
  const tierWord =
    tier === "low" ? "budget" : tier === "high" ? "comfortable" : "moderate";

  const week1 = plan.setup_plan
    .filter((w) => w.week === 1)
    .flatMap((w) => w.items)
    .slice(0, 1);
  const firstTip = (plan.tips ?? [])[0];

  const parts: string[] = [];
  parts.push(`${primary} is your best landing spot.`);
  if (reasoning) parts.push(reasoning);
  parts.push(
    `At the ${tierWord} tier, you're looking at about $${total} a month, all in.`,
  );
  if (alternates.length > 0) {
    if (alternates.length === 1) {
      parts.push(
        `If ${primary} doesn't click once you're on the ground, ${alternates[0]} is the next-best fit.`,
      );
    } else {
      const last = alternates[alternates.length - 1];
      const head = alternates.slice(0, -1).join(", ");
      parts.push(
        `${head} and ${last} are solid alternates if ${primary} doesn't click in person.`,
      );
    }
  }
  if (week1.length > 0) {
    parts.push(`Week one, the move is: ${week1[0].title}. ${week1[0].why}`);
  }
  if (firstTip) {
    parts.push(`One thing you'll thank us for later: ${firstTip}`);
  }
  return parts.join(" ");
}

// ----------------------------------------------------------------------------
// Public entry point
// ----------------------------------------------------------------------------

export interface BuildPlanResult {
  plan: RelocationPlan;
  /** Top-3 score breakdown, useful for debugging / observability */
  scores: NeighborhoodScore[];
}

export function buildPlan(intake: RelocationIntake): BuildPlanResult {
  const scored = scoreNeighborhoods(intake);
  const primary = scored[0].neighborhood;
  const alternates = scored.slice(1, 3).map((s) => s.neighborhood);

  const cost_breakdown = buildCostBreakdown(intake, primary);
  const setup_plan = buildSetupPlan(intake);
  const strategy = buildStrategy(
    intake,
    primary,
    alternates,
    cost_breakdown.tier,
  );
  const tips = buildTips(intake, primary);

  // Did the user supply a known origin country with a playbook?
  const knownPaths = ["india", "iran", "russia", "pakistan", "nigeria"];
  const hasOriginPlaybook = !!(
    intake.originCountry && knownPaths.includes(intake.originCountry)
  );
  const citations = buildCitations(
    primary,
    alternates,
    setup_plan,
    hasOriginPlaybook,
    intake.originCountry,
  );

  const plan: RelocationPlan = {
    neighborhood_match: {
      primary: primary.name,
      alternates: alternates.map((n) => n.name),
      reasoning: buildReasoning(primary, intake),
    },
    cost_breakdown,
    setup_plan,
    strategy,
    tips,
    citations,
  };

  return { plan, scores: scored };
}
