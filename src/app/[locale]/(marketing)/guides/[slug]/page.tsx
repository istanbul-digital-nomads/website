import type { Metadata } from "next";
import Link from "next/link";
import { Calendar } from "lucide-react";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getTranslations } from "next-intl/server";
import { Section } from "@/components/ui/section";
import { guides } from "@/lib/data";
import { getGuideContent } from "@/lib/guides";
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
import { ShareButton } from "@/components/ui/share-button";

interface GuidePageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
  return guides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata(
  props: GuidePageProps,
): Promise<Metadata> {
  const params = await props.params;
  const guide = guides.find((g) => g.slug === params.slug);
  if (!guide) return {};
  const locale: Locale = isValidLocale(params.locale)
    ? params.locale
    : defaultLocale;
  const t = await getTranslations({ locale, namespace: "guides" });
  const title = t(`${guide.slug}.title`);
  const description = t(`${guide.slug}.description`);
  return {
    title,
    description,
    alternates: alternatesFor(locale, `/guides/${guide.slug}`),
    openGraph: {
      type: "article",
      title,
      description,
      url: localeUrl(locale, `/guides/${guide.slug}`),
    },
  };
}

export default async function GuidePage(props: GuidePageProps) {
  const params = await props.params;
  const guide = guides.find((g) => g.slug === params.slug);
  if (!guide) notFound();

  const locale: Locale = isValidLocale(params.locale)
    ? params.locale
    : defaultLocale;
  const guideContent = getGuideContent(params.slug, locale);
  const t = await getTranslations({ locale, namespace: "guides" });
  const tPage = await getTranslations({
    locale,
    namespace: "guideDetailPage",
  });
  const localizedTitle = t(`${guide.slug}.title`);
  const localizedDescription = t(`${guide.slug}.description`);
  const canonicalUrl = localeUrl(locale, `/guides/${guide.slug}`);
  const lastUpdated = guideContent?.frontmatter.lastUpdated;
  const inLanguageTag =
    guideContent?.translated || locale === defaultLocale
      ? bcp47[locale]
      : bcp47[defaultLocale];
  const articleSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${canonicalUrl}#article`,
        headline: localizedTitle,
        description: localizedDescription,
        url: canonicalUrl,
        ...(lastUpdated
          ? {
              datePublished: lastUpdated,
              dateModified: lastUpdated,
            }
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
            name: tPage("breadcrumb.guides"),
            item: localeUrl(locale, "/guides"),
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <nav className="flex items-center gap-2 text-sm text-paper-mute">
            <Link href="/" className="transition-colors hover:text-gold-ink">
              {tPage("breadcrumb.home")}
            </Link>
            <span className="text-paper-faint">/</span>
            <Link
              href="/guides"
              className="transition-colors hover:text-gold-ink"
            >
              {tPage("breadcrumb.guides")}
            </Link>
            <span className="text-paper-faint">/</span>
            <span className="text-paper">{localizedTitle}</span>
          </nav>
          <ShareButton
            kind="guide"
            entityId={guide.slug}
            path={`/guides/${guide.slug}`}
            title={localizedTitle}
          />
        </div>

        <h1 className="font-display text-4xl text-paper md:text-5xl">
          {localizedTitle}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-paper-dim">
          {guideContent?.frontmatter.description || localizedDescription}
        </p>

        {guideContent?.frontmatter.lastUpdated && (
          <div className="mt-4 flex items-center gap-2 text-sm text-paper-mute">
            <Calendar className="h-4 w-4" />
            {tPage("lastUpdatedTemplate", {
              date: formatDate(
                guideContent.frontmatter.lastUpdated,
                undefined,
                locale,
              ),
            })}
          </div>
        )}

        {guideContent ? (
          <article className="mt-10">
            <MDXRemote
              source={guideContent.content}
              components={mdxComponents}
              options={mdxOptions}
            />
          </article>
        ) : (
          <div className="mt-12 rounded-xl border border-dashed border-ink-3 bg-ink-2/30 p-12 text-center">
            <p className="text-paper-dim">{tPage("comingSoon")}</p>
            <p className="mt-2 text-sm text-paper-mute">
              {tPage("contributeIntro")}{" "}
              <a
                href="https://t.me/istanbul_digital_nomads"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold-ink underline"
              >
                {tPage("telegramLinkText")}
              </a>
              .
            </p>
          </div>
        )}
      </div>
    </Section>
  );
}
