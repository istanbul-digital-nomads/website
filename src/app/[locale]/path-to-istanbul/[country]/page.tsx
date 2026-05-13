import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { mdxComponents } from "@/components/ui/mdx-components";
import { mdxOptions } from "@/lib/mdx-options";
import {
  getSupportedCountries,
  getCountryBySlug,
} from "@/lib/path-to-istanbul";
import { getPathContent } from "@/lib/path-to-istanbul-content";
import {
  isValidLocale,
  defaultLocale,
  bcp47,
  type Locale,
} from "@/lib/i18n/config";
import { guides as cityGuides } from "@/lib/data";
import { getAllBlogPosts } from "@/lib/blog";
import { alternatesFor, localeUrl } from "@/lib/seo";
import { CountryHero } from "./country-hero";
import { CountryTOC } from "./country-toc";
import { GuidesFromCountry } from "../guides-from-country";

interface CountryPageProps {
  params: Promise<{ locale: string; country: string }>;
}

export async function generateStaticParams() {
  return getSupportedCountries().map((c) => ({ country: c.slug }));
}

export async function generateMetadata(
  props: CountryPageProps,
): Promise<Metadata> {
  const params = await props.params;
  const country = getCountryBySlug(params.country);
  if (!country) return {};
  const locale = isValidLocale(params.locale) ? params.locale : defaultLocale;
  const content = getPathContent(country.slug, locale);
  const t = await getTranslations({ locale, namespace: "countryPage.meta" });
  const tCountries = await getTranslations({
    locale,
    namespace: "lookups.countryNames",
  });
  const countryName = tCountries.has(country.slug)
    ? tCountries(country.slug)
    : country.name;
  const title = t("titleTemplate", { country: countryName });
  const description =
    content?.frontmatter.summary ??
    t("fallbackDescription", { country: countryName });
  return {
    title,
    description,
    alternates: alternatesFor(locale, `/path-to-istanbul/${country.slug}`),
    openGraph: {
      title,
      description,
      type: "article",
      url: localeUrl(locale, `/path-to-istanbul/${country.slug}`),
    },
  };
}

export default async function CountryPage(props: CountryPageProps) {
  const params = await props.params;
  const country = getCountryBySlug(params.country);
  if (!country || !country.supported) notFound();

  const locale: Locale = isValidLocale(params.locale)
    ? params.locale
    : defaultLocale;
  const content = getPathContent(country.slug, locale);
  if (!content) notFound();

  const t = await getTranslations("countryPage");
  const tGuides = await getTranslations({ locale, namespace: "guides" });
  const tCountries = await getTranslations({
    locale,
    namespace: "lookups.countryNames",
  });
  const countryName = tCountries.has(country.slug)
    ? tCountries(country.slug)
    : country.name;

  const { content: mdxSource, frontmatter } = content;

  const relatedGuideObjects = (frontmatter.relatedGuides ?? [])
    .map((slug) => cityGuides.find((g) => g.slug === slug))
    .filter((g): g is NonNullable<typeof g> => Boolean(g));

  const allPosts = getAllBlogPosts();
  const relatedPostObjects = (frontmatter.relatedPosts ?? [])
    .map((slug) => allPosts.find((p) => p.slug === slug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: t("meta.titleTemplate", { country: countryName }),
    description: frontmatter.summary,
    inLanguage: content.translated ? bcp47[locale] : bcp47[defaultLocale],
    step: [
      {
        "@type": "HowToStep",
        name: t("schema.visaStep"),
        url: `https://istanbulnomads.com/path-to-istanbul/${country.slug}#visa-residence-documents`,
      },
      {
        "@type": "HowToStep",
        name: t("schema.flightsStep"),
        url: `https://istanbulnomads.com/path-to-istanbul/${country.slug}#flights-arrival-money`,
      },
      {
        "@type": "HowToStep",
        name: t("schema.housingStep"),
        url: `https://istanbulnomads.com/path-to-istanbul/${country.slug}#housing-healthcare-community`,
      },
    ],
  };

  return (
    <section className="py-8 md:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Container>
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-[#5d6d7e] dark:text-[#99a3ad]">
          <Link
            href="/"
            className="transition-colors hover:text-primary-600 dark:hover:text-primary-400"
          >
            {t("breadcrumb.home")}
          </Link>
          <span>/</span>
          <Link
            href="/path-to-istanbul"
            className="transition-colors hover:text-primary-600 dark:hover:text-primary-400"
          >
            {t("breadcrumb.pathToIstanbul")}
          </Link>
          <span>/</span>
          <span className="text-[#1a1a2e] dark:text-[#f2f3f4]">
            {countryName}
          </span>
        </nav>

        <div className="lg:grid lg:grid-cols-[1fr_14rem] lg:gap-10">
          <div className="min-w-0">
            <CountryHero
              country={country}
              summary={frontmatter.summary}
              stats={frontmatter.heroStats}
              lastUpdated={frontmatter.lastUpdated}
              locale={locale}
            />

            <article className="mt-8 max-w-3xl sm:mt-12">
              <MDXRemote
                source={mdxSource}
                components={mdxComponents}
                options={mdxOptions}
              />
            </article>

            <div id="guides" className="mt-12 max-w-3xl scroll-mt-24 sm:mt-16">
              <GuidesFromCountry country={country} />
            </div>

            {(relatedGuideObjects.length > 0 ||
              relatedPostObjects.length > 0) && (
              <div
                id="related"
                className="mt-12 max-w-3xl scroll-mt-24 sm:mt-16"
              >
                <h2 className="mb-6 text-2xl font-bold text-[#1a1a2e] dark:text-[#f2f3f4]">
                  {t("related.title")}
                </h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {relatedGuideObjects.map((g) => (
                    <Link
                      key={g.slug}
                      href={`/guides/${g.slug}`}
                      className="group rounded-xl border border-black/5 bg-white/70 p-4 transition-colors hover:border-primary-300 hover:bg-primary-50/50 dark:border-white/10 dark:bg-white/5 dark:hover:border-primary-700 dark:hover:bg-primary-950/20"
                    >
                      <p className="text-xs font-medium uppercase tracking-wider text-primary-600 dark:text-primary-400">
                        {t("related.cityGuideLabel")}
                      </p>
                      <p className="mt-1 font-semibold text-[#1a1a2e] dark:text-[#f2f3f4]">
                        {tGuides(`${g.slug}.title`)}
                      </p>
                      <p className="mt-1 line-clamp-2 text-sm text-[#5d6d7e] dark:text-[#99a3ad]">
                        {tGuides(`${g.slug}.description`)}
                      </p>
                    </Link>
                  ))}
                  {relatedPostObjects.map((p) => (
                    <Link
                      key={p.slug}
                      href={`/blog/${p.slug}`}
                      className="group rounded-xl border border-black/5 bg-white/70 p-4 transition-colors hover:border-primary-300 hover:bg-primary-50/50 dark:border-white/10 dark:bg-white/5 dark:hover:border-primary-700 dark:hover:bg-primary-950/20"
                    >
                      <p className="text-xs font-medium uppercase tracking-wider text-primary-600 dark:text-primary-400">
                        {t("related.blogLabel")}
                      </p>
                      <p className="mt-1 font-semibold text-[#1a1a2e] dark:text-[#f2f3f4]">
                        {p.title}
                      </p>
                      <p className="mt-1 line-clamp-2 text-sm text-[#5d6d7e] dark:text-[#99a3ad]">
                        {p.description}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="mt-12 max-w-3xl rounded-2xl border border-primary-500/20 bg-[linear-gradient(135deg,#8a2a1a_0%,#5c1a12_50%,#3d1410_100%)] p-6 text-center text-white dark:bg-[linear-gradient(135deg,#5c1a12_0%,#3d1410_50%,#1e2130_100%)] sm:mt-16 sm:p-8">
              <h2 className="text-xl font-semibold sm:text-2xl">
                {t("cta.title")}
              </h2>
              <p className="mt-3 text-sm text-white/80 sm:text-base">
                {t("cta.body")}
              </p>
              <Link
                href="https://t.me/istanbul_digital_nomads"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-block"
              >
                <Button
                  size="lg"
                  className="rounded-full bg-white px-8 text-neutral-950 hover:bg-primary-50"
                >
                  {t("cta.button")} <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>

          <aside className="hidden lg:block">
            <CountryTOC />
          </aside>
        </div>
      </Container>
    </section>
  );
}
