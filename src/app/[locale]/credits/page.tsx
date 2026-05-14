import type { Metadata } from "next";
import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { blogCoverImages } from "@/lib/blog-covers";
import { isValidLocale, defaultLocale, type Locale } from "@/lib/i18n/config";
import { alternatesFor } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : defaultLocale;
  const t = await getTranslations({ locale, namespace: "creditsPage.meta" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: alternatesFor(locale, "/credits"),
  };
}

interface AttributionEntry {
  slug: string;
  neighborhood: string;
  role: "hero" | "gallery";
  src: string;
  alt: string;
  author: string;
  source: string;
  sourceHref: string;
  license: string;
  licenseHref?: string;
}

const siteVisualKeys = [
  {
    key: "istanbulToday",
    author: "Istanbul Nomads",
    source: "OpenAI",
    sourceHref: "https://openai.com/",
    license: "Generated",
    licenseHref: "https://openai.com/policies/service-terms/",
  },
] as const;

function loadAttributions(): AttributionEntry[] {
  const manifestPath = path.join(
    process.cwd(),
    "public",
    "images",
    "neighborhoods",
    "attributions.json",
  );
  if (!fs.existsSync(manifestPath)) return [];
  try {
    const raw = fs.readFileSync(manifestPath, "utf-8");
    return JSON.parse(raw) as AttributionEntry[];
  } catch {
    return [];
  }
}

export default async function CreditsPage() {
  const t = await getTranslations("creditsPage");
  const tSiteVisuals = await getTranslations("creditsPage.siteVisualsItems");
  const entries = loadAttributions();
  const grouped = entries.reduce<Record<string, AttributionEntry[]>>(
    (acc, entry) => {
      (acc[entry.neighborhood] ??= []).push(entry);
      return acc;
    },
    {},
  );
  const blogCredits = Object.entries(blogCoverImages);

  return (
    <Section>
      <div className="mx-auto max-w-3xl">
        <nav className="mb-6 flex items-center gap-2 text-sm text-[#5d6d7e] dark:text-[#99a3ad]">
          <Link
            href="/"
            className="transition-colors hover:text-primary-600 dark:hover:text-primary-400"
          >
            {t("breadcrumb.home")}
          </Link>
          <span>/</span>
          <span className="text-[#1a1a2e] dark:text-[#f2f3f4]">
            {t("breadcrumb.current")}
          </span>
        </nav>

        <h1 className="text-4xl font-bold tracking-tight text-[#1a1a2e] dark:text-[#f2f3f4]">
          {t("heading")}
        </h1>
        <p className="mt-4 text-base leading-8 text-[#5d6d7e] dark:text-[#99a3ad]">
          {t("intro")}
        </p>

        <div className="mt-10 space-y-10">
          <div>
            <h2 className="text-2xl font-semibold text-[#1a1a2e] dark:text-[#f2f3f4]">
              {t("sections.siteVisuals")}
            </h2>
            <ul className="mt-4 space-y-3">
              {siteVisualKeys.map((image) => (
                <li
                  key={image.key}
                  className="flex flex-col gap-1 rounded-xl border border-black/10 bg-white/55 p-4 text-sm dark:border-white/10 dark:bg-white/5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-neutral-500 dark:text-[#85929e]">
                      {tSiteVisuals(`${image.key}.label`)}
                    </span>
                    <p className="mt-1 text-[#1a1a2e] dark:text-[#f2f3f4]">
                      {tSiteVisuals(`${image.key}.alt`)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-[#5d6d7e] dark:text-[#99a3ad]">
                    <a
                      href={image.sourceHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline decoration-dotted underline-offset-2 hover:text-primary-600 dark:hover:text-primary-300"
                    >
                      {image.author} / {image.source}
                    </a>
                    <a
                      href={image.licenseHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full border border-primary-500/20 bg-primary-50/60 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-primary-700 dark:border-primary-500/30 dark:bg-primary-950/30 dark:text-primary-200"
                    >
                      {image.license}
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {blogCredits.length > 0 ? (
            <div>
              <h2 className="text-2xl font-semibold text-[#1a1a2e] dark:text-[#f2f3f4]">
                {t("sections.blogCovers")}
              </h2>
              <ul className="mt-4 space-y-3">
                {blogCredits.map(([slug, image]) => (
                  <li
                    key={slug}
                    className="flex flex-col gap-1 rounded-xl border border-black/10 bg-white/55 p-4 text-sm dark:border-white/10 dark:bg-white/5 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-neutral-500 dark:text-[#85929e]">
                        {slug.replace(/-/g, " ")}
                      </span>
                      <p className="mt-1 text-[#1a1a2e] dark:text-[#f2f3f4]">
                        {image.alt}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-[#5d6d7e] dark:text-[#99a3ad]">
                      <a
                        href={image.credit.sourceHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline decoration-dotted underline-offset-2 hover:text-primary-600 dark:hover:text-primary-300"
                      >
                        {image.credit.author} / {image.credit.source}
                      </a>
                      <a
                        href={image.credit.licenseHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-full border border-primary-500/20 bg-primary-50/60 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-primary-700 dark:border-primary-500/30 dark:bg-primary-950/30 dark:text-primary-200"
                      >
                        {image.credit.license}
                      </a>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {Object.keys(grouped).length === 0 ? (
            <Container>
              <p className="rounded-xl border border-dashed border-primary-200/50 bg-primary-50/30 p-8 text-center text-[#5d6d7e] dark:border-primary-900/30 dark:bg-primary-950/10 dark:text-[#99a3ad]">
                {t("manifestMissing.before")}
                <code className="rounded bg-primary-50 px-1.5 py-0.5 text-primary-800 dark:bg-primary-950/30 dark:text-primary-200">
                  pnpm tsx scripts/fetch-neighborhood-photos.ts
                </code>
                {t("manifestMissing.after")}
              </p>
            </Container>
          ) : (
            Object.entries(grouped).map(([neighborhood, items]) => (
              <div key={neighborhood}>
                <h2 className="text-2xl font-semibold text-[#1a1a2e] dark:text-[#f2f3f4]">
                  {neighborhood}
                </h2>
                <ul className="mt-4 space-y-3">
                  {items.map((e) => (
                    <li
                      key={e.src}
                      className="flex flex-col gap-1 rounded-xl border border-black/10 bg-white/55 p-4 text-sm dark:border-white/10 dark:bg-white/5 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-neutral-500 dark:text-[#85929e]">
                          {e.role}
                        </span>
                        <p className="mt-1 text-[#1a1a2e] dark:text-[#f2f3f4]">
                          {e.alt}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-[#5d6d7e] dark:text-[#99a3ad]">
                        <a
                          href={e.sourceHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline decoration-dotted underline-offset-2 hover:text-primary-600 dark:hover:text-primary-300"
                        >
                          {e.author} / {e.source}
                        </a>
                        {e.licenseHref ? (
                          <a
                            href={e.licenseHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-full border border-primary-500/20 bg-primary-50/60 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-primary-700 dark:border-primary-500/30 dark:bg-primary-950/30 dark:text-primary-200"
                          >
                            {e.license}
                          </a>
                        ) : (
                          <span className="rounded-full border border-primary-500/20 bg-primary-50/60 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-primary-700 dark:border-primary-500/30 dark:bg-primary-950/30 dark:text-primary-200">
                            {e.license}
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </div>

        <div className="mt-12 rounded-xl border border-primary-500/20 bg-primary-50/30 p-6 text-sm leading-7 text-[#5d6d7e] dark:border-primary-500/30 dark:bg-primary-950/20 dark:text-[#99a3ad]">
          {t("contribute.before")}
          <a
            href="https://t.me/istanbul_digital_nomads"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-600 underline dark:text-primary-400"
          >
            {t("contribute.linkText")}
          </a>
          {t("contribute.after")}
        </div>
      </div>
    </Section>
  );
}
