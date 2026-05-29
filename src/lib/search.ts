import "server-only";
import { getCachedTranslations } from "@/lib/i18n/cache-translations";
import type { Locale } from "@/lib/i18n/config";
import { guides } from "@/lib/data";
import { neighborhoods } from "@/lib/neighborhoods";
import { circles } from "@/lib/circles";
import { getEventsPublic } from "@/lib/supabase/queries";

/**
 * Design System v2 Phase 6 - Command-K search dataset. Built server-side
 * per locale and passed to the client `CommandMenu` as a serializable list,
 * so per-keystroke filtering stays in-memory (no network during search).
 *
 * Each item is a flat, navigable record: `group` for the result heading,
 * `title` + optional `subtitle` for the row, `href` for the destination,
 * and a list of `keywords` to broaden matches (locations, kinds, slugs).
 */
export type SearchItem = {
  id: string;
  group: "pages" | "guides" | "neighborhoods" | "circles" | "events";
  title: string;
  subtitle?: string;
  href: string;
  keywords?: string[];
};

const STATIC_PAGE_KEYS = [
  { key: "home", href: "/" },
  { key: "about", href: "/about" },
  { key: "contact", href: "/contact" },
  { key: "events", href: "/events" },
  { key: "guides", href: "/guides" },
  { key: "help", href: "/help" },
  { key: "blog", href: "/blog" },
  { key: "spaces", href: "/spaces" },
  { key: "members", href: "/members" },
  { key: "circles", href: "/circles" },
  { key: "planner", href: "/plans" },
  { key: "pathToIstanbul", href: "/path-to-istanbul" },
  { key: "dashboard", href: "/dashboard" },
] as const;

export async function getSearchItems(locale: Locale): Promise<SearchItem[]> {
  const tGuides = getCachedTranslations(locale, "guides");
  const tNeighborhoods = getCachedTranslations(locale, "neighborhoodList");
  const tCircles = getCachedTranslations(locale, "circlesV2");
  const tSearch = getCachedTranslations(locale, "commandMenu");

  const items: SearchItem[] = [];

  // Pages
  for (const page of STATIC_PAGE_KEYS) {
    items.push({
      id: `page:${page.key}`,
      group: "pages",
      title: tSearch(`pages.${page.key}`),
      href: page.href,
    });
  }

  // Guides
  for (const guide of guides) {
    items.push({
      id: `guide:${guide.slug}`,
      group: "guides",
      title: tGuides(`${guide.slug}.title`),
      subtitle: tGuides(`${guide.slug}.description`),
      href: `/guides/${guide.slug}`,
      keywords: [guide.slug, guide.category],
    });
  }

  // Neighborhoods
  for (const hood of neighborhoods) {
    items.push({
      id: `hood:${hood.slug}`,
      group: "neighborhoods",
      title: tNeighborhoods(`${hood.slug}.name`),
      subtitle: tNeighborhoods(`${hood.slug}.oneLiner`),
      href: `/guides/neighborhoods/${hood.slug}`,
      keywords: [hood.slug, hood.side],
    });
  }

  // Circles. Circles with translation keys (the original six) use them;
  // newly added circles fall back to their static fields in src/lib/circles.ts
  // until their translations land.
  for (const circle of circles) {
    items.push({
      id: `circle:${circle.slug}`,
      group: "circles",
      title: tCircles.has(`names.${circle.slug}`)
        ? tCircles(`names.${circle.slug}`)
        : circle.name,
      subtitle: tCircles.has(`blurbs.${circle.slug}`)
        ? tCircles(`blurbs.${circle.slug}`)
        : circle.blurb,
      href: `/circles/${circle.slug}`,
      keywords: [circle.slug],
    });
  }

  // Events (live; degrades to empty if unreachable)
  try {
    const { data: events } = await getEventsPublic({ past: false, limit: 25 });
    for (const event of events ?? []) {
      items.push({
        id: `event:${event.id}`,
        group: "events",
        title: event.title,
        subtitle: event.location_name,
        href: `/events/${event.slug ?? event.id}`,
        keywords: [event.type, event.kind ?? ""].filter(Boolean) as string[],
      });
    }
  } catch {
    // Empty events on failure - search still works for everything else.
  }

  return items;
}
