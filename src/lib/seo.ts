/**
 * Shared SEO + AEO helpers.
 *
 * Builds locale-aware canonical URLs, hreflang alternates, and JSON-LD
 * graphs for the App Router. Centralised here so every page emits the
 * same shape and we don't drift from the sitemap.
 */

import { siteConfig } from "@/lib/constants";
import { bcp47, defaultLocale, locales, type Locale } from "@/lib/i18n/config";

export const SITE_URL = siteConfig.url;

/**
 * Build the absolute URL for a path on a given locale, honoring the
 * `as-needed` prefix rule (no `/en` for English).
 */
export function localeUrl(locale: Locale, path: string): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  if (locale === defaultLocale) {
    return clean === "/" ? SITE_URL : `${SITE_URL}${clean}`;
  }
  return clean === "/"
    ? `${SITE_URL}/${locale}`
    : `${SITE_URL}/${locale}${clean}`;
}

/**
 * Build a Next.js `alternates` block for a page: the canonical URL for the
 * current locale plus the BCP 47 `languages` map (hreflang) for every other
 * locale, with `x-default` pointing at the English source.
 */
export function alternatesFor(
  locale: Locale,
  path: string,
): {
  canonical: string;
  languages: Record<string, string>;
} {
  const languages: Record<string, string> = {};
  for (const l of locales) {
    languages[bcp47[l]] = localeUrl(l, path);
  }
  languages["x-default"] = localeUrl(defaultLocale, path);
  return {
    canonical: localeUrl(locale, path),
    languages,
  };
}

/**
 * The Organization schema used everywhere we need a publisher reference.
 * `@id` is stable so other graphs can `{"@id": "..."}` reference it
 * instead of inlining the whole object.
 */
export function organizationSchema() {
  return {
    "@type": "Organization",
    "@id": `${SITE_URL}#organization`,
    name: siteConfig.name,
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/images/logo-light.png`,
      width: 220,
      height: 280,
    },
    sameAs: [
      "https://t.me/istanbul_digital_nomads",
      "https://twitter.com/istanbulnomads",
      "https://github.com/istanbul-digital-nomads",
    ],
  };
}

/**
 * The WebSite schema for the home page. Includes a SearchAction so
 * Google can wire up the sitelinks search box.
 */
export function websiteSchema(locale: Locale) {
  return {
    "@type": "WebSite",
    "@id": `${SITE_URL}#website`,
    url: SITE_URL,
    name: siteConfig.name,
    description: siteConfig.description,
    inLanguage: bcp47[locale],
    publisher: { "@id": `${SITE_URL}#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/blog?tag={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/**
 * Build a BreadcrumbList graph entry. Pass items in order from root to
 * current page.
 */
export function breadcrumbSchema(
  locale: Locale,
  items: Array<{ name: string; path: string }>,
) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: localeUrl(locale, item.path),
    })),
  };
}

/**
 * Build a FAQPage graph entry. Drops entries where either side is empty so
 * we never emit a broken Question.
 */
export function faqPageSchema(
  faqs: Array<{ question: string; answer: string }>,
) {
  const items = faqs.filter((f) => f.question && f.answer);
  if (items.length === 0) return null;
  return {
    "@type": "FAQPage",
    mainEntity: items.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

/**
 * Wrap an arbitrary set of graph nodes into a JSON-LD payload ready for
 * stringification. Filters falsy nodes so callers can use conditional
 * spreading freely.
 */
export function jsonLdGraph(...nodes: Array<unknown>) {
  return {
    "@context": "https://schema.org",
    "@graph": nodes.filter(Boolean),
  };
}
