import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { defaultLocale, type Locale } from "@/lib/i18n/config";

// Platform "how-to" docs - how the product itself works (plans,
// verification, paperwork, payments, safety). Authored as MDX under
// src/content/help/{locale}/{slug}.mdx and rendered at /help/[slug] with
// the same pipeline the city guides use. EN is the source; other locales
// fall back to EN until translated (reported via the `translated` flag).

const HELP_DIR = path.join(process.cwd(), "src/content/help");

// Catalog drives the hub cards, /help/[slug] static params, and search.
// `category` lines up with the FAQ categories. `icon` is a lucide name.
export interface HelpDocMeta {
  slug: string;
  category: string;
  icon: string;
}

export const helpDocs: HelpDocMeta[] = [
  { slug: "getting-started", category: "getting-started", icon: "Compass" },
  { slug: "how-plans-work", category: "plans", icon: "CalendarDays" },
  { slug: "getting-verified", category: "verification", icon: "BadgeCheck" },
  { slug: "paperwork-help", category: "paperwork", icon: "FileText" },
  {
    slug: "payments-and-escrow",
    category: "payments",
    icon: "ShieldCheck",
  },
  { slug: "trust-and-safety", category: "safety", icon: "HeartHandshake" },
];

export function isHelpDocSlug(slug: string): boolean {
  return helpDocs.some((d) => d.slug === slug);
}

interface HelpFrontmatter {
  title?: string;
  description?: string;
  lastUpdated?: string;
}

export interface HelpDocContent {
  content: string;
  frontmatter: HelpFrontmatter;
  translated: boolean;
}

// Resolve the MDX file for a slug + locale. Per-locale folder is
// canonical; falls back to the English source and reports it via
// `translated` (mirrors the guides resolver in src/lib/guides.ts).
function resolveHelpFile(
  slug: string,
  locale: Locale,
): { filePath: string; translated: boolean } | null {
  const candidates: Array<{ filePath: string; translated: boolean }> = [];
  if (locale !== defaultLocale) {
    candidates.push({
      filePath: path.join(HELP_DIR, locale, `${slug}.mdx`),
      translated: true,
    });
  }
  candidates.push({
    filePath: path.join(HELP_DIR, defaultLocale, `${slug}.mdx`),
    translated: locale === defaultLocale,
  });
  for (const c of candidates) {
    if (fs.existsSync(c.filePath)) return c;
  }
  return null;
}

export function getHelpDoc(
  slug: string,
  locale: Locale = defaultLocale,
): HelpDocContent | null {
  const resolved = resolveHelpFile(slug, locale);
  if (!resolved) return null;
  const raw = fs.readFileSync(resolved.filePath, "utf-8");
  const { content, data } = matter(raw);
  return {
    content,
    frontmatter: data as HelpFrontmatter,
    translated: resolved.translated,
  };
}
