import fs from "node:fs/promises";
import path from "node:path";
import { defaultLocale, type Locale } from "./config";

const CONTENT_ROOT = path.join(process.cwd(), "src", "content");

export type LocalizedContent = {
  raw: string;
  resolvedLocale: Locale;
  translated: boolean;
};

export async function getLocalizedMdx(
  category: string,
  slug: string,
  locale: Locale,
): Promise<LocalizedContent | null> {
  const localizedPath = path.join(
    CONTENT_ROOT,
    category,
    locale,
    `${slug}.mdx`,
  );
  const fallbackPath = path.join(
    CONTENT_ROOT,
    category,
    defaultLocale,
    `${slug}.mdx`,
  );

  try {
    const raw = await fs.readFile(localizedPath, "utf8");
    return {
      raw,
      resolvedLocale: locale,
      translated: locale !== defaultLocale,
    };
  } catch {
    try {
      const raw = await fs.readFile(fallbackPath, "utf8");
      return {
        raw,
        resolvedLocale: defaultLocale,
        translated: false,
      };
    } catch {
      const legacyPath = path.join(CONTENT_ROOT, category, `${slug}.mdx`);
      try {
        const raw = await fs.readFile(legacyPath, "utf8");
        return {
          raw,
          resolvedLocale: defaultLocale,
          translated: false,
        };
      } catch {
        return null;
      }
    }
  }
}

export async function listLocalizedSlugs(
  category: string,
  locale: Locale = defaultLocale,
): Promise<string[]> {
  const candidates = [
    path.join(CONTENT_ROOT, category, locale),
    path.join(CONTENT_ROOT, category, defaultLocale),
    path.join(CONTENT_ROOT, category),
  ];

  for (const dir of candidates) {
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      const slugs = entries
        .filter((e) => e.isFile() && e.name.endsWith(".mdx"))
        .map((e) => e.name.replace(/\.mdx$/, ""));
      if (slugs.length > 0) return slugs;
    } catch {
      // try next candidate
    }
  }
  return [];
}
