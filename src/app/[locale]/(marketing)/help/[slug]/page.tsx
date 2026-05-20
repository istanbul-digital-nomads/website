import type { Metadata } from "next";
import { Calendar } from "lucide-react";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/routing";
import { Section } from "@/components/ui/section";
import { helpDocs, getHelpDoc } from "@/lib/help-docs";
import {
  isValidLocale,
  defaultLocale,
  bcp47,
  type Locale,
} from "@/lib/i18n/config";
import { mdxComponents } from "@/components/ui/mdx-components";
import { formatDate } from "@/lib/utils";
import { mdxOptions } from "@/lib/mdx-options";
import { alternatesFor, SITE_URL, localeUrl } from "@/lib/seo";

interface DocPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
  return helpDocs.map((doc) => ({ slug: doc.slug }));
}

export async function generateMetadata(props: DocPageProps): Promise<Metadata> {
  const params = await props.params;
  const doc = helpDocs.find((d) => d.slug === params.slug);
  if (!doc) return {};
  const locale: Locale = isValidLocale(params.locale)
    ? params.locale
    : defaultLocale;
  const t = await getTranslations({ locale, namespace: "helpPage" });
  const title = t(`docs.${doc.slug}.title`);
  const description = t(`docs.${doc.slug}.description`);
  return {
    title,
    description,
    alternates: alternatesFor(locale, `/help/${doc.slug}`),
    openGraph: {
      type: "article",
      title,
      description,
      url: localeUrl(locale, `/help/${doc.slug}`),
    },
  };
}

export default async function HelpDocPage(props: DocPageProps) {
  const params = await props.params;
  const doc = helpDocs.find((d) => d.slug === params.slug);
  if (!doc) notFound();

  const locale: Locale = isValidLocale(params.locale)
    ? params.locale
    : defaultLocale;
  const docContent = getHelpDoc(params.slug, locale);
  const t = await getTranslations({ locale, namespace: "helpPage" });
  const tPage = await getTranslations({ locale, namespace: "guideDetailPage" });

  const localizedTitle = t(`docs.${doc.slug}.title`);
  const localizedDescription = t(`docs.${doc.slug}.description`);
  const canonicalUrl = localeUrl(locale, `/help/${doc.slug}`);
  const lastUpdated = docContent?.frontmatter.lastUpdated;
  const inLanguageTag =
    docContent?.translated || locale === defaultLocale
      ? bcp47[locale]
      : bcp47[defaultLocale];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${canonicalUrl}#article`,
        headline: localizedTitle,
        description: localizedDescription,
        url: canonicalUrl,
        ...(lastUpdated
          ? { datePublished: lastUpdated, dateModified: lastUpdated }
          : {}),
        inLanguage: inLanguageTag,
        author: {
          "@type": "Organization",
          "@id": `${SITE_URL}#organization`,
          name: "Istanbul Nomads",
        },
        publisher: { "@id": `${SITE_URL}#organization` },
        mainEntityOfPage: canonicalUrl,
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${canonicalUrl}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: tPage("breadcrumb.home"),
            item: localeUrl(locale, "/"),
          },
          {
            "@type": "ListItem",
            position: 2,
            name: t("eyebrow"),
            item: localeUrl(locale, "/help"),
          },
          {
            "@type": "ListItem",
            position: 3,
            name: localizedTitle,
            item: canonicalUrl,
          },
        ],
      },
    ],
  };

  return (
    <Section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-3xl">
        <nav className="mb-6 flex items-center gap-2 text-sm text-[#5d6d7e] dark:text-[#99a3ad]">
          <Link
            href="/"
            className="transition-colors hover:text-primary-600 dark:hover:text-primary-400"
          >
            {tPage("breadcrumb.home")}
          </Link>
          <span>/</span>
          <Link
            href="/help"
            className="transition-colors hover:text-primary-600 dark:hover:text-primary-400"
          >
            {t("eyebrow")}
          </Link>
          <span>/</span>
          <span className="text-[#1a1a2e] dark:text-[#f2f3f4]">
            {localizedTitle}
          </span>
        </nav>

        <h1 className="text-4xl font-bold tracking-tight text-[#1a1a2e] dark:text-[#f2f3f4]">
          {localizedTitle}
        </h1>
        <p className="mt-4 text-lg text-[#5d6d7e] dark:text-[#99a3ad]">
          {docContent?.frontmatter.description || localizedDescription}
        </p>

        {lastUpdated && (
          <div className="mt-4 flex items-center gap-2 text-sm text-[#5d6d7e] dark:text-[#99a3ad]">
            <Calendar className="h-4 w-4" />
            {tPage("lastUpdatedTemplate", {
              date: formatDate(lastUpdated, undefined, locale),
            })}
          </div>
        )}

        {docContent ? (
          <article className="mt-10">
            <MDXRemote
              source={docContent.content}
              components={mdxComponents}
              options={mdxOptions}
            />
          </article>
        ) : (
          <div className="mt-12 rounded-xl border border-dashed border-primary-200/50 bg-primary-50/30 p-12 text-center dark:border-primary-900/30 dark:bg-primary-950/10">
            <p className="text-[#5d6d7e] dark:text-[#99a3ad]">
              {tPage("comingSoon")}
            </p>
          </div>
        )}

        <div className="mt-12 border-t border-primary-200/30 pt-6 dark:border-[rgba(44,47,58,0.5)]">
          <Link
            href="/help"
            className="text-sm font-medium text-primary-600 hover:text-primary-800 dark:text-primary-400"
          >
            {t("backToHub")}
          </Link>
        </div>
      </div>
    </Section>
  );
}
