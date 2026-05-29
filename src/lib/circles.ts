/**
 * Design System v2 Phase 5b - Circles. Small rooms inside the big room (the
 * Telegram). These are static, editorial content - the slug, name, blurb, and
 * accent are real and fixed here; live member counts come from the
 * `circle_members` table once it's populated (see migration 013).
 *
 * Circles v2 (migration 031) groups circles into categories and mirrors this
 * file into a `circles` DB table for runtime data + a future admin. This file
 * stays the source of truth / fallback - the DB never overrides a slug, name,
 * or accent defined here. New optional fields (`category`, `badges`) are
 * additive; the original six circles below keep all their old fields.
 */

export type CircleAccent =
  | "terracotta"
  | "bosphorus"
  | "ferry-yellow"
  | "moss"
  | "terracotta-dim"
  | "bosphorus-dim";

/** The five discovery groups. Slugs match circle_categories in migration 031. */
export type CircleCategory =
  | "professional"
  | "lifestyle"
  | "growth"
  | "social"
  | "relationship";

export interface CircleCategoryMeta {
  slug: CircleCategory;
  name: string;
  /** One-line framing for the group header on the discovery page. */
  blurb: string;
  /** Lower sorts first. Matches circle_categories.sort_order. */
  sortOrder: number;
}

export interface Circle {
  slug: string;
  name: string;
  blurb: string;
  /** Longer editorial description for the circle landing page. */
  description: string;
  /** What a typical week in this circle looks like. */
  rhythm: string;
  accent: CircleAccent;
  /** Which discovery group this circle belongs to. */
  category: CircleCategory;
  /** Optional badge slugs a member can earn here (see circle_badges). */
  badges?: string[];
}

/**
 * The five groups, in display order. See docs/agents/CirclesResearch.md for
 * why these exist and which member need each one answers.
 */
export const circleCategories: CircleCategoryMeta[] = [
  {
    slug: "professional",
    name: "Professional",
    blurb: "Rooms by role and craft - shop talk, feedback, office hours.",
    sortOrder: 1,
  },
  {
    slug: "lifestyle",
    name: "Lifestyle",
    blurb: "Body, calm, and hobbies - the stuff outside the laptop.",
    sortOrder: 2,
  },
  {
    slug: "growth",
    name: "Growth",
    blurb: "Get better at something, with people keeping you honest.",
    sortOrder: 3,
  },
  {
    slug: "social",
    name: "Social",
    blurb: "Doing things together. No skill required.",
    sortOrder: 4,
  },
  {
    slug: "relationship",
    name: "Relationship",
    blurb: "Low-pressure doors in - for arriving and connecting. Not dating.",
    sortOrder: 5,
  },
];

export const circles: Circle[] = [
  // --- The original six (slugs, names, accents unchanged) ---
  {
    slug: "coworking",
    name: "Coworking",
    blurb: "Where the wifi works on a Tuesday.",
    description:
      "The default circle for most members. A running thread of which cafe has a free window seat, whose wifi dropped, and where the quiet tables are this week. No bookings, no desks to reserve - just people who work from the same handful of rooms comparing notes.",
    rhythm: "Daily chatter, a standing Thursday cowork session.",
    accent: "terracotta",
    category: "social",
  },
  {
    slug: "hiking",
    name: "Hiking",
    blurb: "Belgrad Forest, Mt. Aydos, most Saturdays.",
    description:
      "Out of the city on weekends. Belgrad Forest when it's hot, the Asian-side ridges when it's clear, the occasional bigger trip. Pace is conversational, not competitive - the point is the walk and the people, not the kilometres.",
    rhythm: "A Saturday walk most weeks, posted a few days ahead.",
    accent: "moss",
    category: "lifestyle",
  },
  {
    slug: "sailing",
    name: "Sailing",
    blurb: "Bareboat days out of Bostanci.",
    description:
      "Day sails on the Marmara when the wind cooperates, out of Bostanci and Kalamis. Some members have licences, most don't - you learn by crewing. Costs are split per boat, posted before each trip.",
    rhythm: "Weather-dependent. Trips posted when the forecast is good.",
    accent: "bosphorus",
    category: "social",
  },
  {
    slug: "photography",
    name: "Photography",
    blurb: "Quiet walks with cameras out.",
    description:
      "Slow walks through neighborhoods with cameras - Balat, the Tuesday market, the ferries at dusk. Any camera, any level. The walks double as a good way to learn a neighborhood properly.",
    rhythm: "A photo walk every couple of weeks.",
    accent: "ferry-yellow",
    category: "lifestyle",
  },
  {
    slug: "wine",
    name: "Wine",
    blurb: "Anatolian bottles, no scoring.",
    description:
      "Anatolian wine, mostly - the local grapes are good and underrated. Informal tastings at someone's flat or a wine bar in Cihangir. No scoring, no snobbery, just bottles worth knowing about.",
    rhythm: "A tasting roughly monthly.",
    accent: "terracotta-dim",
    category: "lifestyle",
  },
  {
    slug: "founders",
    name: "Founders",
    blurb: "Office hours every other Thursday.",
    description:
      "For members building something - solo founders, freelancers scaling up, small remote teams. Office hours every other Thursday: bring a problem, get a room of people who've hit it before.",
    rhythm: "Office hours every other Thursday.",
    accent: "bosphorus-dim",
    category: "professional",
  },

  // --- Circles v2 additions (see docs/agents/CirclesResearch.md). Accents
  // reuse the existing palette so the Tailwind class maps stay valid. ---

  // Professional
  {
    slug: "developers",
    name: "Developers",
    blurb: "Code review, stack chat, shipping.",
    description:
      "The room for people who write code for a living. Stack opinions, code review when someone asks, and the practical Turkey questions - invoicing clients, tax, getting paid - that only other devs have answered.",
    rhythm: "Always-on thread, an occasional show-and-tell.",
    accent: "bosphorus",
    category: "professional",
  },
  {
    slug: "designers",
    name: "Designers",
    blurb: "Crit, portfolios, and good type.",
    description:
      "Product, brand, and UX designers swapping work for honest crit. Post a screen, get feedback. Less shop talk than the dev room, more eyes on the actual pixels.",
    rhythm: "Crit when someone posts, a casual meetup now and then.",
    accent: "ferry-yellow",
    category: "professional",
  },
  {
    slug: "product",
    name: "Product & PM",
    blurb: "Roadmaps, discovery, hiring.",
    description:
      "For product managers and ops people who don't fit cleanly in the dev or design rooms. Discovery, prioritisation, the messy people side of shipping, and who's hiring.",
    rhythm: "A slower thread - depth over volume.",
    accent: "terracotta",
    category: "professional",
  },
  {
    slug: "ai-builders",
    name: "AI builders",
    blurb: "Shipping with the new tools.",
    description:
      "People building AI into real products - comparing tools, sharing what actually worked, and the bits that didn't. Practical, not hype.",
    rhythm: "Fast-moving thread, the odd demo night.",
    accent: "bosphorus-dim",
    category: "professional",
  },

  // Lifestyle
  {
    slug: "fitness",
    name: "Fitness",
    blurb: "Find a gym buddy in a new city.",
    description:
      "Lifting, classes, and the eternal new-city problem of finding a decent gym and someone to train with. Share gym leads, day passes, and training plans.",
    rhythm: "Loose - people pair up and go.",
    accent: "moss",
    category: "lifestyle",
  },
  {
    slug: "running",
    name: "Running",
    blurb: "Social runs along the water.",
    description:
      "Easy social runs - the Caddebostan coast, Belgrad Forest loops, the bridges when someone's feeling brave. All paces, the back of the pack always waits.",
    rhythm: "A weekly social run, posted ahead.",
    accent: "ferry-yellow",
    category: "lifestyle",
  },
  {
    slug: "coffee",
    name: "Coffee lovers",
    blurb: "Specialty cups around the city.",
    description:
      "Istanbul is a cafe city. This is the room for the good third-wave spots, who roasts well, and a daytime reason to get out of the flat. Doubles as a soft cowork door.",
    rhythm: "Daily chatter, the odd cafe crawl.",
    accent: "terracotta-dim",
    category: "lifestyle",
  },
  {
    slug: "meditation",
    name: "Meditation",
    blurb: "A quiet counterweight to deep work.",
    description:
      "A small, calm room for sits, breath, and the occasional group session. Useful when the deep-work weeks start to grind. No dogma, all levels.",
    rhythm: "A weekly sit when there's interest.",
    accent: "moss",
    category: "lifestyle",
  },

  // Growth
  {
    slug: "accountability",
    name: "Accountability",
    blurb: "Weekly goals, weekly check-ins.",
    description:
      "The fix for working solo with nobody keeping you honest. Post your week's goals on Monday, report back on Friday. Small group, real check-ins.",
    rhythm: "Monday goals, Friday check-in.",
    accent: "terracotta",
    category: "growth",
  },
  {
    slug: "language-exchange",
    name: "Language exchange",
    blurb: "Turkish practice, your language too.",
    description:
      "Practise Turkish with people doing the same, and trade your own language with someone learning it. Low-pressure, useful, and a fast way to actually meet locals.",
    rhythm: "A weekly exchange meetup.",
    accent: "bosphorus",
    category: "growth",
  },
  {
    slug: "startup-builders",
    name: "Startup builders",
    blurb: "Building toward a launch.",
    description:
      "For people building toward something - side projects, pre-revenue, build-in-public energy. Distinct from Founders: this is the room before you're running a company.",
    rhythm: "Always-on, the odd build night.",
    accent: "bosphorus-dim",
    category: "growth",
  },

  // Social
  {
    slug: "weekend-explorers",
    name: "Weekend explorers",
    blurb: "What's everyone doing Saturday?",
    description:
      "Day trips, neighborhoods, markets, the museum nobody's been to yet. The broad 'what's the plan this weekend' room - more city, less trail than hiking.",
    rhythm: "Plans posted through the week.",
    accent: "ferry-yellow",
    category: "social",
  },
  {
    slug: "food-lovers",
    name: "Food lovers",
    blurb: "Where to eat, group dinners.",
    description:
      "Where to eat and who wants to go. Group dinners, market runs, the lokanta a member swears by. Istanbul food is the easy part - this is the room that organises it.",
    rhythm: "A group dinner every week or two.",
    accent: "terracotta-dim",
    category: "social",
  },

  // Relationship (platonic - the community isn't a dating app)
  {
    slug: "new-in-istanbul",
    name: "New in Istanbul",
    blurb: "Just landed? Start here.",
    description:
      "The first door for people who just arrived. SIM cards, neighborhoods, the dumb-but-important questions, and a friendly face for week one. The funnel into everything else.",
    rhythm: "Always-on, lots of welcomes.",
    accent: "moss",
    category: "relationship",
  },
  {
    slug: "looking-for-friends",
    name: "Looking for friends",
    blurb: "The hard ask, made easy.",
    description:
      "Making friends as an adult in a new city is hard and nobody likes asking. This is the room that makes it normal. Coffees, walks, low-key hangs. Strictly platonic.",
    rhythm: "Ongoing - people post and meet up.",
    accent: "terracotta",
    category: "relationship",
  },
  {
    slug: "travel-partners",
    name: "Travel partners",
    blurb: "Find people for trips in Turkey.",
    description:
      "Cappadocia, the coast, a weekend in Izmir - find people to go with. Trip-scoped and practical: dates, budgets, who's in.",
    rhythm: "Per-trip, posted when someone's planning one.",
    accent: "bosphorus",
    category: "relationship",
  },
];

export function getCircleBySlug(slug: string): Circle | undefined {
  return circles.find((c) => c.slug === slug);
}

/** All active circles in a category, in declaration order. */
export function getCirclesByCategory(category: CircleCategory): Circle[] {
  return circles.filter((c) => c.category === category);
}

/** Category metadata by slug. */
export function getCategoryMeta(
  slug: CircleCategory,
): CircleCategoryMeta | undefined {
  return circleCategories.find((c) => c.slug === slug);
}

/**
 * Circles grouped by category, in category sort order, skipping empty groups.
 * Handy for the grouped discovery view.
 */
export function getCirclesGroupedByCategory(): Array<{
  category: CircleCategoryMeta;
  circles: Circle[];
}> {
  return [...circleCategories]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((category) => ({
      category,
      circles: getCirclesByCategory(category.slug),
    }))
    .filter((group) => group.circles.length > 0);
}
