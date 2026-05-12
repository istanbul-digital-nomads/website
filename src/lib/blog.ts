import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { getBlogCoverImage, type BlogCoverImage } from "@/lib/blog-covers";
import { defaultLocale, type Locale } from "@/lib/i18n/config";

const BLOG_DIR = path.join(process.cwd(), "src/content/blog");

export interface BlogPostMeta {
  slug: string;
  title: string;
  description: string;
  author: string;
  date: string;
  tags: string[];
  keywords?: string[];
  readingTime: string;
  coverImage?: BlogCoverImage;
  translated: boolean;
}

interface BlogFrontmatter {
  title?: string;
  description?: string;
  author?: string;
  date?: string;
  tags?: string[];
  keywords?: string[];
}

function estimateReadingTime(content: string): string {
  const words = content.split(/\s+/).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}

/**
 * Resolve the MDX file path for a slug in a given locale, falling back to
 * the English source when a per-locale version isn't available. Supports
 * three layouts:
 *   1. `src/content/blog/{locale}/{slug}.mdx`   (per-locale folder)
 *   2. `src/content/blog/{slug}.{locale}.mdx`   (per-locale suffix)
 *   3. `src/content/blog/{slug}.mdx`            (English canonical)
 */
function resolveBlogFile(
  slug: string,
  locale: Locale,
): { filePath: string; translated: boolean } | null {
  const candidates: Array<{ filePath: string; translated: boolean }> = [];
  if (locale !== defaultLocale) {
    candidates.push({
      filePath: path.join(BLOG_DIR, locale, `${slug}.mdx`),
      translated: true,
    });
    candidates.push({
      filePath: path.join(BLOG_DIR, `${slug}.${locale}.mdx`),
      translated: true,
    });
  }
  candidates.push({
    filePath: path.join(BLOG_DIR, `${slug}.mdx`),
    translated: locale === defaultLocale,
  });
  candidates.push({
    filePath: path.join(BLOG_DIR, defaultLocale, `${slug}.mdx`),
    translated: false,
  });
  for (const c of candidates) {
    if (fs.existsSync(c.filePath)) return c;
  }
  return null;
}

function listSlugsForLocale(locale: Locale): string[] {
  const slugs = new Set<string>();
  const dir = path.join(BLOG_DIR, locale);
  if (fs.existsSync(dir)) {
    fs.readdirSync(dir)
      .filter((f) => f.endsWith(".mdx"))
      .forEach((f) => slugs.add(f.replace(".mdx", "")));
  }
  if (fs.existsSync(BLOG_DIR)) {
    fs.readdirSync(BLOG_DIR)
      .filter((f) => f.endsWith(".mdx"))
      .forEach((f) => {
        const base = f.replace(".mdx", "");
        const localeSuffix = base.match(/\.([a-z]{2})$/);
        if (localeSuffix) {
          if (localeSuffix[1] === locale) slugs.add(base.slice(0, -3));
        } else {
          slugs.add(base);
        }
      });
  }
  return Array.from(slugs);
}

export function getAllBlogPosts(
  locale: Locale = defaultLocale,
): BlogPostMeta[] {
  const slugs = listSlugsForLocale(locale);

  const posts: BlogPostMeta[] = [];
  for (const slug of slugs) {
    const resolved = resolveBlogFile(slug, locale);
    if (!resolved) continue;
    const raw = fs.readFileSync(resolved.filePath, "utf-8");
    const { content, data } = matter(raw);
    const fm = data as BlogFrontmatter;
    posts.push({
      slug,
      title: fm.title || slug,
      description: fm.description || "",
      author: fm.author || "Istanbul Digital Nomads",
      date: fm.date || "2026-01-01",
      tags: fm.tags || [],
      keywords: fm.keywords,
      readingTime: estimateReadingTime(content),
      coverImage: getBlogCoverImage(slug),
      translated: resolved.translated,
    });
  }

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

export function getBlogPost(slug: string, locale: Locale = defaultLocale) {
  const resolved = resolveBlogFile(slug, locale);
  if (!resolved) return null;

  const raw = fs.readFileSync(resolved.filePath, "utf-8");
  const { content, data } = matter(raw);
  const fm = data as BlogFrontmatter;

  return {
    content,
    meta: {
      slug,
      title: fm.title || slug,
      description: fm.description || "",
      author: fm.author || "Istanbul Digital Nomads",
      date: fm.date || "2026-01-01",
      tags: fm.tags || [],
      keywords: fm.keywords,
      readingTime: estimateReadingTime(content),
      coverImage: getBlogCoverImage(slug),
      translated: resolved.translated,
    } satisfies BlogPostMeta,
  };
}

export function getAllTags(locale: Locale = defaultLocale): string[] {
  const posts = getAllBlogPosts(locale);
  const tags = new Set<string>();
  posts.forEach((post) => post.tags.forEach((tag) => tags.add(tag)));
  return Array.from(tags).sort();
}
