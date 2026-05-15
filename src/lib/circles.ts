/**
 * Design System v2 Phase 5b - the six Circles. Small rooms inside the big
 * room (the Telegram). These are static, editorial content - the slug,
 * name, blurb, and accent are real and fixed here; live member counts come
 * from the `circle_members` table once it's populated (see migration 013).
 */

export type CircleAccent =
  | "terracotta"
  | "bosphorus"
  | "ferry-yellow"
  | "moss"
  | "terracotta-dim"
  | "bosphorus-dim";

export interface Circle {
  slug: string;
  name: string;
  blurb: string;
  /** Longer editorial description for the circle landing page. */
  description: string;
  /** What a typical week in this circle looks like. */
  rhythm: string;
  accent: CircleAccent;
}

export const circles: Circle[] = [
  {
    slug: "coworking",
    name: "Coworking",
    blurb: "Where the wifi works on a Tuesday.",
    description:
      "The default circle for most members. A running thread of which cafe has a free window seat, whose wifi dropped, and where the quiet tables are this week. No bookings, no desks to reserve - just people who work from the same handful of rooms comparing notes.",
    rhythm: "Daily chatter, a standing Thursday cowork session.",
    accent: "terracotta",
  },
  {
    slug: "hiking",
    name: "Hiking",
    blurb: "Belgrad Forest, Mt. Aydos, most Saturdays.",
    description:
      "Out of the city on weekends. Belgrad Forest when it's hot, the Asian-side ridges when it's clear, the occasional bigger trip. Pace is conversational, not competitive - the point is the walk and the people, not the kilometres.",
    rhythm: "A Saturday walk most weeks, posted a few days ahead.",
    accent: "moss",
  },
  {
    slug: "sailing",
    name: "Sailing",
    blurb: "Bareboat days out of Bostanci.",
    description:
      "Day sails on the Marmara when the wind cooperates, out of Bostanci and Kalamis. Some members have licences, most don't - you learn by crewing. Costs are split per boat, posted before each trip.",
    rhythm: "Weather-dependent. Trips posted when the forecast is good.",
    accent: "bosphorus",
  },
  {
    slug: "photography",
    name: "Photography",
    blurb: "Quiet walks with cameras out.",
    description:
      "Slow walks through neighborhoods with cameras - Balat, the Tuesday market, the ferries at dusk. Any camera, any level. The walks double as a good way to learn a neighborhood properly.",
    rhythm: "A photo walk every couple of weeks.",
    accent: "ferry-yellow",
  },
  {
    slug: "wine",
    name: "Wine",
    blurb: "Anatolian bottles, no scoring.",
    description:
      "Anatolian wine, mostly - the local grapes are good and underrated. Informal tastings at someone's flat or a wine bar in Cihangir. No scoring, no snobbery, just bottles worth knowing about.",
    rhythm: "A tasting roughly monthly.",
    accent: "terracotta-dim",
  },
  {
    slug: "founders",
    name: "Founders",
    blurb: "Office hours every other Thursday.",
    description:
      "For members building something - solo founders, freelancers scaling up, small remote teams. Office hours every other Thursday: bring a problem, get a room of people who've hit it before.",
    rhythm: "Office hours every other Thursday.",
    accent: "bosphorus-dim",
  },
];

export function getCircleBySlug(slug: string): Circle | undefined {
  return circles.find((c) => c.slug === slug);
}
