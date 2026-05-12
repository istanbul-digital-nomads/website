import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { defaultLocale, type Locale } from "@/lib/i18n/config";

const GUIDES_DIR = path.join(process.cwd(), "src/content/guides");

interface GuideFrontmatter {
  title?: string;
  description?: string;
  lastUpdated?: string;
}

export interface GuideContent {
  content: string;
  frontmatter: GuideFrontmatter;
  translated: boolean;
}

/**
 * Resolve the guide MDX file for a slug + locale. Per-locale folder is the
 * canonical layout (`src/content/guides/{locale}/{slug}.mdx`). A
 * `{slug}.{locale}.mdx` suffix and a legacy root `{slug}.mdx` are accepted
 * as fallbacks. Falls back to the English source when no per-locale file
 * exists and reports that via the `translated` flag.
 */
function resolveGuideFile(
  slug: string,
  locale: Locale,
): { filePath: string; translated: boolean } | null {
  const candidates: Array<{ filePath: string; translated: boolean }> = [];
  if (locale !== defaultLocale) {
    candidates.push({
      filePath: path.join(GUIDES_DIR, locale, `${slug}.mdx`),
      translated: true,
    });
    candidates.push({
      filePath: path.join(GUIDES_DIR, `${slug}.${locale}.mdx`),
      translated: true,
    });
  }
  candidates.push({
    filePath: path.join(GUIDES_DIR, defaultLocale, `${slug}.mdx`),
    translated: locale === defaultLocale,
  });
  candidates.push({
    filePath: path.join(GUIDES_DIR, `${slug}.mdx`),
    translated: locale === defaultLocale,
  });
  for (const c of candidates) {
    if (fs.existsSync(c.filePath)) return c;
  }
  return null;
}

export function getGuideContent(
  slug: string,
  locale: Locale = defaultLocale,
): GuideContent | null {
  const resolved = resolveGuideFile(slug, locale);
  if (!resolved) return null;
  const raw = fs.readFileSync(resolved.filePath, "utf-8");
  const { content, data } = matter(raw);
  return {
    content,
    frontmatter: data as GuideFrontmatter,
    translated: resolved.translated,
  };
}

export function hasGuideContent(
  slug: string,
  locale: Locale = defaultLocale,
): boolean {
  return resolveGuideFile(slug, locale) !== null;
}
