import type { MetadataRoute } from "next";
import { guides } from "@/lib/data";
import { getAllBlogPosts } from "@/lib/blog";
import { getSupportedCountries } from "@/lib/path-to-istanbul";
import { neighborhoods } from "@/lib/neighborhoods";
import { locales, defaultLocale, bcp47, type Locale } from "@/lib/i18n/config";

const BASE_URL = "https://istanbulnomads.com";

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
    {
      path: "/tools/first-week-planner",
      changeFrequency: "weekly",
      priority: 0.8,
    },
    { path: "/local-guides", changeFrequency: "weekly", priority: 0.8 },
    { path: "/path-to-istanbul", changeFrequency: "weekly", priority: 0.9 },
    { path: "/local-guides/join", changeFrequency: "monthly", priority: 0.6 },
    { path: "/contact", changeFrequency: "monthly", priority: 0.5 },
    { path: "/credits", changeFrequency: "monthly", priority: 0.3 },
  ];

  const staticEntries = staticPaths.flatMap((p) =>
    withAlternates(p.path, now, p.changeFrequency, p.priority),
  );

  const neighborhoodEntries = neighborhoods.flatMap((n) =>
    withAlternates(`/guides/neighborhoods/${n.slug}`, now, "monthly", 0.75),
  );

  const guideEntries = guides.flatMap((guide) =>
    withAlternates(`/guides/${guide.slug}`, now, "monthly", 0.7),
  );

  const blogEntries = blogPosts.flatMap((post) =>
    withAlternates(`/blog/${post.slug}`, new Date(post.date), "monthly", 0.6),
  );

  const countryEntries = getSupportedCountries().flatMap((country) =>
    withAlternates(`/path-to-istanbul/${country.slug}`, now, "monthly", 0.75),
  );

  return [
    ...staticEntries,
    ...guideEntries,
    ...neighborhoodEntries,
    ...blogEntries,
    ...countryEntries,
  ];
}
