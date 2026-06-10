import type { MetadataRoute } from "next";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { guides } from "@/lib/data";
import { getAllBlogPosts } from "@/lib/blog";
import { getSupportedCountries } from "@/lib/path-to-istanbul";
import { neighborhoods } from "@/lib/neighborhoods";
import { locales, defaultLocale, bcp47, type Locale } from "@/lib/i18n/config";

const BASE_URL = "https://istanbulnomads.com";

/**
 * Read the `lastUpdated` (preferred) or `date` field from an MDX file's
 * frontmatter. Returns `null` if the file doesn't exist or has no usable
 * date so callers can fall back to `now`.
 */
function readFrontmatterDate(filePath: string): Date | null {
  try {
    if (!fs.existsSync(filePath)) return null;
    const raw = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(raw);
    const fm = data as { lastUpdated?: string; date?: string };
    const value = fm.lastUpdated ?? fm.date;
    if (!value) return null;
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  } catch {
    return null;
  }
}

function localePath(locale: Locale, path: string) {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return locale === defaultLocale
    ? `${BASE_URL}${clean === "/" ? "" : clean}`
    : `${BASE_URL}/${locale}${clean === "/" ? "" : clean}`;
}

function withAlternates(
  path: string,
  lastModified: Date,
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"],
  priority: number,
): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(
    locales.map((l) => [bcp47[l], localePath(l, path)]),
  );
  languages["x-default"] = localePath(defaultLocale, path);

  return locales.map((locale) => ({
    url: localePath(locale, path),
    lastModified,
    changeFrequency,
    priority,
    alternates: { languages },
  }));
}

export default function sitemap(): MetadataRoute.Sitemap {
  const blogPosts = getAllBlogPosts();
  const now = new Date();

  const staticPaths: Array<{
    path: string;
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
    priority: number;
  }> = [
    { path: "/", changeFrequency: "weekly", priority: 1 },
    { path: "/about", changeFrequency: "monthly", priority: 0.8 },
    { path: "/guides", changeFrequency: "weekly", priority: 0.9 },
    { path: "/blog", changeFrequency: "weekly", priority: 0.8 },
    { path: "/events", changeFrequency: "daily", priority: 0.8 },
    { path: "/spaces", changeFrequency: "weekly", priority: 0.8 },
    { path: "/plans", changeFrequency: "daily", priority: 0.9 },
    { path: "/local-guides", changeFrequency: "weekly", priority: 0.8 },
    { path: "/path-to-istanbul", changeFrequency: "weekly", priority: 0.9 },
    { path: "/local-guides/join", changeFrequency: "monthly", priority: 0.6 },
    { path: "/members", changeFrequency: "weekly", priority: 0.7 },
    { path: "/circles", changeFrequency: "weekly", priority: 0.7 },
    { path: "/paperwork", changeFrequency: "weekly", priority: 0.7 },
    { path: "/map", changeFrequency: "weekly", priority: 0.6 },
    { path: "/help", changeFrequency: "monthly", priority: 0.6 },
    { path: "/contact", changeFrequency: "monthly", priority: 0.5 },
    { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
    { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
    { path: "/cookies", changeFrequency: "yearly", priority: 0.3 },
    { path: "/credits", changeFrequency: "monthly", priority: 0.3 },
  ];

  const staticEntries = staticPaths.flatMap((p) =>
    withAlternates(p.path, now, p.changeFrequency, p.priority),
  );

  const neighborhoodEntries = neighborhoods.flatMap((n) =>
    withAlternates(`/guides/neighborhoods/${n.slug}`, now, "monthly", 0.75),
  );

  const guideEntries = guides.flatMap((guide) => {
    const guideDate =
      readFrontmatterDate(
        path.join(process.cwd(), "src/content/guides/en", `${guide.slug}.mdx`),
      ) ?? now;
    return withAlternates(`/guides/${guide.slug}`, guideDate, "monthly", 0.7);
  });

  const blogEntries = blogPosts.flatMap((post) =>
    withAlternates(
      `/blog/${post.slug}`,
      new Date(post.lastUpdated ?? post.date),
      "weekly",
      0.7,
    ),
  );

  const countryEntries = getSupportedCountries().flatMap((country) => {
    const countryDate =
      readFrontmatterDate(
        path.join(
          process.cwd(),
          "src/content/path-to-istanbul/en",
          `${country.slug}.mdx`,
        ),
      ) ?? now;
    return withAlternates(
      `/path-to-istanbul/${country.slug}`,
      countryDate,
      "monthly",
      0.75,
    );
  });

  return [
    ...staticEntries,
    ...guideEntries,
    ...neighborhoodEntries,
    ...blogEntries,
    ...countryEntries,
  ];
}
