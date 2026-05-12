#!/usr/bin/env tsx
/**
 * i18n content scaffold CLI.
 *
 * Reports the per-locale translation status of MDX content and seeds stub
 * files that the nomad-{locale}-editor agents can fill in.
 *
 * Usage:
 *   pnpm i18n:status                              # matrix of all categories
 *   pnpm i18n:status blog                         # one category
 *   pnpm i18n:stub tr blog ferry-commute-guide    # seed one stub
 *   pnpm i18n:stub tr blog                        # seed every missing TR blog post
 *   pnpm i18n:stub tr                             # seed every missing TR file across categories
 *
 * Per-locale folder is the canonical layout:
 *   src/content/{category}/{locale}/{slug}.mdx
 */
import fs from "node:fs";
import path from "node:path";

const CONTENT_ROOT = path.join(process.cwd(), "src/content");
const LOCALES = ["en", "tr", "fa", "ar", "ru"] as const;
const DEFAULT_LOCALE: Locale = "en";
const CATEGORIES = ["blog", "guides", "path-to-istanbul"] as const;

type Locale = (typeof LOCALES)[number];
type Category = (typeof CATEGORIES)[number];

const STATUS_MARK = {
  present: "✓", // ✓
  missing: ".",
};

function listEnglishSlugs(category: Category): string[] {
  const dir = path.join(CONTENT_ROOT, category, DEFAULT_LOCALE);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""))
    .sort();
}

function hasLocaleFile(
  category: Category,
  locale: Locale,
  slug: string,
): boolean {
  if (locale === DEFAULT_LOCALE) {
    return fs.existsSync(
      path.join(CONTENT_ROOT, category, DEFAULT_LOCALE, `${slug}.mdx`),
    );
  }
  const folder = path.join(CONTENT_ROOT, category, locale, `${slug}.mdx`);
  const suffix = path.join(CONTENT_ROOT, category, `${slug}.${locale}.mdx`);
  return fs.existsSync(folder) || fs.existsSync(suffix);
}

function readEnglishSource(category: Category, slug: string): string | null {
  const filePath = path.join(
    CONTENT_ROOT,
    category,
    DEFAULT_LOCALE,
    `${slug}.mdx`,
  );
  if (!fs.existsSync(filePath)) return null;
  return fs.readFileSync(filePath, "utf-8");
}

function printStatus(filter?: Category) {
  const cats: readonly Category[] = filter ? [filter] : CATEGORIES;
  for (const cat of cats) {
    const slugs = listEnglishSlugs(cat);
    if (slugs.length === 0) {
      console.log(`\n[${cat}] no English source files`);
      continue;
    }
    console.log(`\n[${cat}] ${slugs.length} posts`);
    const slugCol = Math.max(...slugs.map((s) => s.length), 8) + 2;
    const header =
      "slug".padEnd(slugCol) + LOCALES.map((l) => l.padEnd(5)).join("");
    console.log(header);
    console.log("-".repeat(header.length));
    let counts: Record<Locale, number> = {
      en: 0,
      tr: 0,
      fa: 0,
      ar: 0,
      ru: 0,
    };
    for (const slug of slugs) {
      const row =
        slug.padEnd(slugCol) +
        LOCALES.map((l) => {
          const present = hasLocaleFile(cat, l, slug);
          if (present) counts[l]++;
          return (present ? STATUS_MARK.present : STATUS_MARK.missing).padEnd(
            5,
          );
        }).join("");
      console.log(row);
    }
    const total = slugs.length;
    const footer =
      "coverage".padEnd(slugCol) +
      LOCALES.map((l) => {
        const pct = Math.round((counts[l] / total) * 100);
        return `${pct}%`.padEnd(5);
      }).join("");
    console.log("-".repeat(header.length));
    console.log(footer);
  }
}

function seedStub(category: Category, locale: Locale, slug: string): boolean {
  if (locale === DEFAULT_LOCALE) {
    console.error(`refuse to seed stub for default locale (${DEFAULT_LOCALE})`);
    return false;
  }
  const targetDir = path.join(CONTENT_ROOT, category, locale);
  const targetFile = path.join(targetDir, `${slug}.mdx`);
  if (fs.existsSync(targetFile)) {
    console.log(`skip ${category}/${locale}/${slug}.mdx (exists)`);
    return false;
  }
  const source = readEnglishSource(category, slug);
  if (!source) {
    console.error(
      `refuse to seed ${category}/${locale}/${slug}.mdx (no English source at ${category}/en/${slug}.mdx)`,
    );
    return false;
  }
  fs.mkdirSync(targetDir, { recursive: true });
  // Prepend a TODO HTML comment so the agent sees the directive immediately.
  const stub = `<!-- TODO ${locale.toUpperCase()}: translate this file. The frontmatter title/description and the body prose need translation. Preserve all markdown structure (headings, lists, tables, code blocks, image refs, cross-links). Slug stays the same. -->\n${source}`;
  fs.writeFileSync(targetFile, stub, "utf-8");
  console.log(`seeded ${category}/${locale}/${slug}.mdx`);
  return true;
}

function seedAllMissing(category: Category, locale: Locale) {
  let seeded = 0;
  for (const slug of listEnglishSlugs(category)) {
    if (!hasLocaleFile(category, locale, slug)) {
      if (seedStub(category, locale, slug)) seeded++;
    }
  }
  console.log(`\ndone: seeded ${seeded} files in ${category}/${locale}/`);
}

function main() {
  const [cmd, ...args] = process.argv.slice(2);

  if (!cmd || cmd === "status") {
    const filter = args[0] as Category | undefined;
    if (filter && !CATEGORIES.includes(filter as Category)) {
      console.error(`unknown category '${filter}'`);
      console.error(`valid: ${CATEGORIES.join(", ")}`);
      process.exit(1);
    }
    printStatus(filter);
    return;
  }

  if (cmd === "stub") {
    const [locale, category, slug] = args as [
      Locale | undefined,
      Category | undefined,
      string | undefined,
    ];
    if (!locale || !LOCALES.includes(locale)) {
      console.error(`usage: pnpm i18n:stub <locale> [<category>] [<slug>]`);
      console.error(`valid locales: ${LOCALES.filter((l) => l !== "en").join(", ")}`);
      process.exit(1);
    }
    if (locale === DEFAULT_LOCALE) {
      console.error(`refuse to stub the default locale (${DEFAULT_LOCALE})`);
      process.exit(1);
    }
    if (category && !CATEGORIES.includes(category)) {
      console.error(`unknown category '${category}'`);
      process.exit(1);
    }
    if (category && slug) {
      seedStub(category, locale, slug);
      return;
    }
    if (category) {
      seedAllMissing(category, locale);
      return;
    }
    for (const c of CATEGORIES) seedAllMissing(c, locale);
    return;
  }

  console.error(`unknown command '${cmd}'`);
  console.error(`usage:`);
  console.error(`  pnpm i18n:status [category]`);
  console.error(`  pnpm i18n:stub <locale> [<category>] [<slug>]`);
  process.exit(1);
}

main();
