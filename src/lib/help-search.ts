import "server-only";
import { getCachedTranslations } from "@/lib/i18n/cache-translations";
import type { Locale } from "@/lib/i18n/config";
import { faqItems } from "@/lib/faq";
import { helpDocs } from "@/lib/help-docs";
import { guides } from "@/lib/data";

// Flat, navigable list powering the /help hub's in-memory search box.
// Built server-side per locale (mirrors getSearchItems in src/lib/search.ts)
// so per-keystroke filtering happens client-side with no network.

export type HelpSearchItem = {
  id: string;
  kind: "faq" | "doc" | "guide";
  title: string;
  subtitle?: string;
  href: string;
  keywords?: string[];
};

export function getHelpSearchItems(locale: Locale): HelpSearchItem[] {
  const tFaq = getCachedTranslations(locale, "faqItems");
  const tHelp = getCachedTranslations(locale, "helpPage");
  const tGuides = getCachedTranslations(locale, "guides");

  const items: HelpSearchItem[] = [];

  // Platform docs
  for (const doc of helpDocs) {
    items.push({
      id: `doc:${doc.slug}`,
      kind: "doc",
      title: tHelp(`docs.${doc.slug}.title`),
      subtitle: tHelp(`docs.${doc.slug}.description`),
      href: `/help/${doc.slug}`,
      keywords: [doc.slug, doc.category],
    });
  }

  // FAQ questions
  for (const item of faqItems) {
    items.push({
      id: `faq:${item.id}`,
      kind: "faq",
      title: tFaq(`${item.id}.question`),
      href: item.href,
      keywords: [item.id, item.category],
    });
  }

  // City guides
  for (const guide of guides) {
    items.push({
      id: `guide:${guide.slug}`,
      kind: "guide",
      title: tGuides(`${guide.slug}.title`),
      subtitle: tGuides(`${guide.slug}.description`),
      href: `/guides/${guide.slug}`,
      keywords: [guide.slug, guide.category],
    });
  }

  return items;
}
