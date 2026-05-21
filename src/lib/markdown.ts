import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { getAllBlogPosts, getBlogPost } from "./blog";
import { getGuideContent } from "./guides";
import { helpDocs, getHelpDoc } from "./help-docs";
import { getPathContent } from "./path-to-istanbul-content";
import { getSupportedCountries, getCountryBySlug } from "./path-to-istanbul";
import { neighborhoods } from "./neighborhoods";
import { spaces } from "./spaces";
import { guides } from "./data";
import { circles } from "./circles";
import { SERVICE_TYPES } from "./paperwork";
import {
  getPaperworkServicesPublic,
  type PaperworkServicePublic,
} from "./supabase/queries";
import { defaultLocale, isValidLocale, type Locale } from "./i18n/config";

const SITE = "https://istanbulnomads.com";

function mdxToMarkdown(content: string): string {
  return content
    .replace(/^import\s+.*?$/gm, "")
    .replace(/^export\s+.*?$/gm, "")
    .replace(/<(\/)?([A-Z][A-Za-z0-9]*)[^>]*>/g, "")
    .trim();
}

function frontmatterHeader(
  title: string,
  description?: string,
  canonical?: string,
): string {
  const lines: string[] = [`# ${title}`, ""];
  if (description) lines.push(`> ${description}`, "");
  if (canonical) lines.push(`Canonical URL: ${canonical}`, "");
  return lines.join("\n");
}

function guideListingMarkdown(): string {
  const header = frontmatterHeader(
    "Istanbul Digital Nomad Guides",
    "Practical guides for living and working as a digital nomad in Istanbul - visas, neighborhoods, coworking, internet, cost of living, transport, healthcare.",
    `${SITE}/guides`,
  );
  const items = guides
    .map(
      (g) => `- [${g.title}](${SITE}/guides/${g.slug}.md) - ${g.description}`,
    )
    .join("\n");
  return `${header}\n## Available guides\n\n${items}\n`;
}

function blogListingMarkdown(): string {
  const posts = getAllBlogPosts();
  const header = frontmatterHeader(
    "Istanbul Nomads - Blog",
    "Articles and first-hand experience from nomads living in Istanbul.",
    `${SITE}/blog`,
  );
  const items = posts
    .map(
      (p) =>
        `- [${p.title}](${SITE}/blog/${p.slug}.md) (${p.date}) - ${p.description}`,
    )
    .join("\n");
  return `${header}\n## Posts\n\n${items}\n`;
}

function neighborhoodMarkdown(slug: string): string | null {
  const n = neighborhoods.find((x) => x.slug === slug);
  if (!n) return null;
  const spacesHere = spaces.filter((s) =>
    n.spaceMatchers.some((m) => s.neighborhood.toLowerCase().includes(m)),
  );
  const lines: string[] = [
    frontmatterHeader(
      `${n.name} - Istanbul Neighborhood Guide`,
      n.oneLiner,
      `${SITE}/guides/neighborhoods/${n.slug}`,
    ),
    `## Overview`,
    ``,
    n.description,
    ``,
    `## Verified stats`,
    ``,
    `- **Side:** ${n.side}`,
    `- **Rent (1BR):** $${n.rentUsd.low}-${n.rentUsd.high} USD / ${n.rentTl.low.toLocaleString()}-${n.rentTl.high.toLocaleString()} TL`,
    `- **Transport:** ${n.transport}`,
    `- **Noise level:** ${n.noise}`,
    `- **Vibe:** ${n.vibe}`,
    `- **Best for:** ${n.bestFor.join(", ")}`,
    ``,
  ];
  if (spacesHere.length > 0) {
    lines.push(`## Coworking and cafes here`, ``);
    for (const s of spacesHere) {
      lines.push(`- **${s.name}** (${s.type}) - ${s.neighborhood}`);
    }
    lines.push(``);
  }
  return lines.join("\n");
}

function neighborhoodsOverviewMarkdown(): string {
  const header = frontmatterHeader(
    "Where to live in Istanbul - Neighborhood Guide",
    "Ten full Istanbul neighborhood guides for digital nomads, plus broader notes on conditional areas and places we usually would not start from.",
    `${SITE}/guides/neighborhoods`,
  );
  const items = neighborhoods
    .map(
      (n) =>
        `### [${n.name}](${SITE}/guides/neighborhoods/${n.slug}.md)\n\n${n.oneLiner}\n\n- Side: ${n.side}\n- Rent: $${n.rentUsd.low}-${n.rentUsd.high} USD\n- Best for: ${n.bestFor.join(", ")}\n`,
    )
    .join("\n");
  return `${header}${items}`;
}

function pathIndexMarkdown(): string {
  const countries = getSupportedCountries();
  const header = frontmatterHeader(
    "Path to Istanbul - Country Relocation Guides",
    "Country-specific guides for relocating to Istanbul: visas, paperwork, cost differences, community ties.",
    `${SITE}/path-to-istanbul`,
  );
  const items = countries
    .map(
      (c) => `- [${c.flag} ${c.name}](${SITE}/path-to-istanbul/${c.slug}.md)`,
    )
    .join("\n");
  return `${header}## Supported countries\n\n${items}\n`;
}

function spacesIndexMarkdown(): string {
  const header = frontmatterHeader(
    "Coworking spaces and laptop-friendly cafes in Istanbul",
    `${spaces.length} verified spaces across Istanbul neighborhoods, with wifi, hours, and pricing.`,
    `${SITE}/spaces`,
  );
  const byHood: Record<string, typeof spaces> = {};
  for (const s of spaces) {
    (byHood[s.neighborhood] ||= []).push(s);
  }
  const sections = Object.keys(byHood)
    .sort()
    .map((hood) => {
      const items = byHood[hood]
        .map((s) => `- **${s.name}** (${s.type})`)
        .join("\n");
      return `### ${hood}\n\n${items}`;
    })
    .join("\n\n");
  return `${header}${sections}\n`;
}

function helpListingMarkdown(locale: Locale): string {
  const prefix = locale === defaultLocale ? "" : `/${locale}`;
  const header = frontmatterHeader(
    "Istanbul Nomads - Help & FAQ",
    "How the platform works (plans, verification, paperwork, payments, trust & safety) plus a searchable FAQ. The HTML hub also has a guided assistant and category-grouped FAQ.",
    `${SITE}${prefix}/help`,
  );
  const items = helpDocs
    .map((d) => {
      const doc = getHelpDoc(d.slug, locale);
      const title = doc?.frontmatter.title ?? d.slug;
      const desc = doc?.frontmatter.description ?? "";
      return `- [${title}](${SITE}${prefix}/help/${d.slug}.md) - ${desc}`;
    })
    .join("\n");
  return `${header}## Platform docs\n\n${items}\n\nFor the full FAQ, see the HTML hub at ${SITE}${prefix}/help.\n`;
}

function circlesListingMarkdown(): string {
  const header = frontmatterHeader(
    "Istanbul Nomads - Circles",
    "Smaller sub-communities (rooms inside the community) organized around a shared interest - coworking, hiking, and more.",
    `${SITE}/circles`,
  );
  const items = circles
    .map((c) => `- [${c.name}](${SITE}/circles/${c.slug}.md) - ${c.blurb}`)
    .join("\n");
  return `${header}## Circles\n\n${items}\n`;
}

function circleMarkdown(slug: string): string | null {
  const c = circles.find((x) => x.slug === slug);
  if (!c) return null;
  return [
    frontmatterHeader(
      `${c.name} - Istanbul Nomads Circle`,
      c.blurb,
      `${SITE}/circles/${c.slug}`,
    ),
    `## About this circle`,
    ``,
    c.description,
    ``,
    `## A typical week`,
    ``,
    c.rhythm,
    ``,
  ].join("\n");
}

// Static labels for the paperwork service types (the agent directory at
// /paperwork is live HTML; this overview is the markdown twin).
const SERVICE_TYPE_LABELS: Record<string, string> = {
  visa: "Visa support",
  ikamet: "Residence permit (ikamet)",
  residency_permit: "Residency permit",
  bank_account: "Bank account opening",
  notary: "Notary and document work",
  gbt: "Foreigner ID / GBT queries",
  tax_office: "Tax number and tax office",
  other: "Other paperwork",
};

function paperworkListingMarkdown(services: PaperworkServicePublic[]): string {
  const header = frontmatterHeader(
    "Istanbul Nomads - Paperwork help",
    "Directory of verified independent agents who help nomads with Turkish bureaucracy - residence permits, tax numbers, bank accounts, and more.",
    `${SITE}/paperwork`,
  );
  const types = SERVICE_TYPES.map(
    (t) => `- ${SERVICE_TYPE_LABELS[t] ?? t}`,
  ).join("\n");

  // Live listings, grouped by service type.
  let listings = "";
  if (services.length > 0) {
    const byType = new Map<string, PaperworkServicePublic[]>();
    for (const s of services) {
      const arr = byType.get(s.service_type) ?? [];
      arr.push(s);
      byType.set(s.service_type, arr);
    }
    const sections: string[] = [];
    for (const t of SERVICE_TYPES) {
      const items = byType.get(t);
      if (!items || items.length === 0) continue;
      const rows = items
        .map((s) => {
          const price = `${(s.price_cents / 100).toLocaleString("en-US")} ${s.currency}`;
          const host = s.host?.display_name ?? "Verified agent";
          const langs = s.languages?.length
            ? ` · ${s.languages.join("/")}`
            : "";
          return `- **${s.title}** - ${price} · ${host}${langs}\n  ${SITE}/paperwork/${s.id}`;
        })
        .join("\n");
      sections.push(`### ${SERVICE_TYPE_LABELS[t] ?? t}\n\n${rows}`);
    }
    listings = `\n## Available services (${services.length})\n\n${sections.join("\n\n")}\n`;
  }

  return `${header}## Service types

${types}
${listings}
## How it works

Each agent lists what they handle with clear pricing. Every agent is verified before they can list, but they're independent providers - not employees - and we don't give legal advice. See [how paperwork help works](${SITE}/help/paperwork-help.md). Browse and contact agents at the live directory: ${SITE}/paperwork
`;
}

function homepageMarkdown(): string {
  return `# Istanbul Nomads

> The community hub for digital nomads living and working in Istanbul - verified coworking spaces, neighborhood guides, visa and residency info, and a weekly event calendar.

Canonical URL: ${SITE}

## What you'll find here

- **[Neighborhood guides](${SITE}/guides/neighborhoods.md)** - Ten full guides plus broader coverage for conditional areas and places we usually would not start from
- **[Coworking and cafes](${SITE}/spaces.md)** - ${spaces.length} verified spaces with wifi speeds, hours, and prices
- **[Living-in-Istanbul guides](${SITE}/guides.md)** - Visa, housing, internet, cost of living, healthcare, transport, food, culture
- **[Blog](${SITE}/blog.md)** - First-hand articles from nomads already here
- **[Path to Istanbul](${SITE}/path-to-istanbul.md)** - Country-specific relocation guides

## For AI agents and crawlers

- Sitemap: ${SITE}/sitemap.xml
- Content signals: search=yes, ai-input=yes, ai-train=no (see ${SITE}/robots.txt)
- Markdown variants: append \`.md\` to any page URL, or send \`Accept: text/markdown\`
- Site index for LLMs: ${SITE}/llms.txt
`;
}

function simpleStubMarkdown(
  title: string,
  description: string,
  canonical: string,
): string {
  return `${frontmatterHeader(title, description, canonical)}See the HTML version at ${canonical} for the full interactive page.\n`;
}

export async function getMarkdownForPath(
  pathname: string,
): Promise<{ body: string } | null> {
  let p = pathname.replace(/\/$/, "") || "/";

  // Strip a leading locale prefix (e.g. `/tr/help/x` -> `/help/x`) and use
  // it to fetch the translated content. The default locale (en) has no
  // prefix and behaves exactly as before. Loaders for per-locale MDX
  // (guides, help, blog, path-to-istanbul) get the locale; data-driven
  // listings (neighborhoods, spaces) stay English.
  let locale: Locale = defaultLocale;
  const firstSeg = p.split("/")[1];
  if (firstSeg && isValidLocale(firstSeg)) {
    locale = firstSeg;
    p = "/" + p.split("/").slice(2).join("/");
    p = p.replace(/\/$/, "") || "/";
  }
  // Canonical-URL prefix for the active locale (empty for the default).
  const prefix = locale === defaultLocale ? "" : `/${locale}`;

  if (p === "/" || p === "/home" || p === "/index") {
    return { body: homepageMarkdown() };
  }

  if (p === "/about") {
    return {
      body: simpleStubMarkdown(
        "About Istanbul Nomads",
        "Community hub run by nomads who live here - practical, verified, no tourist fluff.",
        `${SITE}/about`,
      ),
    };
  }

  if (p === "/events") {
    return {
      body: simpleStubMarkdown(
        "Istanbul Nomads - Events",
        "Weekly meetups, coworking days, and nomad events in Istanbul.",
        `${SITE}/events`,
      ),
    };
  }

  if (p === "/contact") {
    return {
      body: simpleStubMarkdown(
        "Contact Istanbul Nomads",
        "Reach the team for partnerships, corrections, or community questions.",
        `${SITE}/contact`,
      ),
    };
  }

  if (p === "/credits") {
    return {
      body: simpleStubMarkdown(
        "Photo credits",
        "Attribution for every photo used across the site, grouped by neighborhood.",
        `${SITE}/credits`,
      ),
    };
  }

  if (p === "/local-guides" || p === "/local-guides/join") {
    return {
      body: simpleStubMarkdown(
        "Local guides - Istanbul Nomads",
        "Human guides from the community who show nomads around Istanbul.",
        `${SITE}${p}`,
      ),
    };
  }

  if (p === "/guides") return { body: guideListingMarkdown() };

  if (p === "/guides/neighborhoods") {
    return { body: neighborhoodsOverviewMarkdown() };
  }

  const neighborhoodMatch = p.match(/^\/guides\/neighborhoods\/([^/]+)$/);
  if (neighborhoodMatch) {
    const md = neighborhoodMarkdown(neighborhoodMatch[1]);
    return md ? { body: md } : null;
  }

  const guideMatch = p.match(/^\/guides\/([^/]+)$/);
  if (guideMatch) {
    const content = getGuideContent(guideMatch[1], locale);
    if (!content) return null;
    const title =
      content.frontmatter.title ||
      guides.find((g) => g.slug === guideMatch[1])?.title ||
      guideMatch[1];
    return {
      body: `${frontmatterHeader(
        title,
        content.frontmatter.description,
        `${SITE}${prefix}/guides/${guideMatch[1]}`,
      )}${mdxToMarkdown(content.content)}\n`,
    };
  }

  if (p === "/blog") return { body: blogListingMarkdown() };

  const blogMatch = p.match(/^\/blog\/([^/]+)$/);
  if (blogMatch) {
    const post = getBlogPost(blogMatch[1], locale);
    if (!post) return null;
    return {
      body: `${frontmatterHeader(
        post.meta.title,
        post.meta.description,
        `${SITE}${prefix}/blog/${blogMatch[1]}`,
      )}*By ${post.meta.author} - ${post.meta.date} - ${post.meta.readingTime}*\n\n${mdxToMarkdown(post.content)}\n`,
    };
  }

  if (p === "/path-to-istanbul") return { body: pathIndexMarkdown() };

  const pathMatch = p.match(/^\/path-to-istanbul\/([^/]+)$/);
  if (pathMatch) {
    const country = getCountryBySlug(pathMatch[1]);
    const content = getPathContent(pathMatch[1], locale);
    if (!country || !content) return null;
    return {
      body: `${frontmatterHeader(
        `${country.flag} ${country.name} to Istanbul`,
        content.frontmatter.summary,
        `${SITE}${prefix}/path-to-istanbul/${pathMatch[1]}`,
      )}${mdxToMarkdown(content.content)}\n`,
    };
  }

  if (p === "/spaces") return { body: spacesIndexMarkdown() };

  if (p === "/circles") return { body: circlesListingMarkdown() };

  const circleMatch = p.match(/^\/circles\/([^/]+)$/);
  if (circleMatch) {
    const md = circleMarkdown(circleMatch[1]);
    return md ? { body: md } : null;
  }

  if (p === "/paperwork") {
    const { data } = await getPaperworkServicesPublic();
    return { body: paperworkListingMarkdown(data) };
  }

  if (p === "/help") return { body: helpListingMarkdown(locale) };

  const helpMatch = p.match(/^\/help\/([^/]+)$/);
  if (helpMatch) {
    const content = getHelpDoc(helpMatch[1], locale);
    if (!content) return null;
    return {
      body: `${frontmatterHeader(
        content.frontmatter.title || helpMatch[1],
        content.frontmatter.description,
        `${SITE}${prefix}/help/${helpMatch[1]}`,
      )}${mdxToMarkdown(content.content)}\n`,
    };
  }

  return null;
}
