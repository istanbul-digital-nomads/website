import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { defaultLocale, type Locale } from "@/lib/i18n/config";

const CONTENT_DIR = path.join(process.cwd(), "src/content/path-to-istanbul");

export interface HeroStat {
  label: string;
  value: string;
}

export interface PathFrontmatter {
  country: string;
  countryCode: string;
  slug: string;
  flag: string;
  lastUpdated?: string;
  summary: string;
  heroStats?: HeroStat[];
  relatedGuides?: string[];
  relatedPosts?: string[];
}

export interface PathContent {
  content: string;
  frontmatter: PathFrontmatter;
  translated: boolean;
}

function resolvePathFile(
  slug: string,
  locale: Locale,
): { filePath: string; translated: boolean } | null {
  const candidates: Array<{ filePath: string; translated: boolean }> = [];
  if (locale !== defaultLocale) {
    candidates.push({
      filePath: path.join(CONTENT_DIR, locale, `${slug}.mdx`),
      translated: true,
    });
    candidates.push({
      filePath: path.join(CONTENT_DIR, `${slug}.${locale}.mdx`),
      translated: true,
    });
  }
  candidates.push({
    filePath: path.join(CONTENT_DIR, defaultLocale, `${slug}.mdx`),
    translated: locale === defaultLocale,
  });
  candidates.push({
    filePath: path.join(CONTENT_DIR, `${slug}.mdx`),
    translated: locale === defaultLocale,
  });
  for (const c of candidates) {
    if (fs.existsSync(c.filePath)) return c;
  }
  return null;
}

export function getPathContent(
  slug: string,
  locale: Locale = defaultLocale,
): PathContent | null {
  const resolved = resolvePathFile(slug, locale);
  if (!resolved) return null;
  const raw = fs.readFileSync(resolved.filePath, "utf-8");
  const { content, data } = matter(raw);
  return {
    content,
    frontmatter: data as PathFrontmatter,
    translated: resolved.translated,
  };
}

export function hasPathContent(
  slug: string,
  locale: Locale = defaultLocale,
): boolean {
  return resolvePathFile(slug, locale) !== null;
}
