import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getCachedTranslations } from "@/lib/i18n/cache-translations";
import {
  bcp47,
  defaultLocale,
  isValidLocale,
  type Locale,
} from "@/lib/i18n/config";
import {
  alternatesFor,
  jsonLdGraph,
  organizationSchema,
  websiteSchema,
} from "@/lib/seo";
import { HeroIssue } from "@/components/sections/home/hero-issue";
import { ThreeDoors } from "@/components/sections/home/three-doors";
import { WeekShape } from "@/components/sections/home/week-shape";
import { GuidesShelf } from "@/components/sections/home/guides-shelf";
import { NeighborhoodRhythmMatcher } from "@/components/sections/neighborhood-rhythm-matcher";
import { EventsStrip } from "@/components/sections/home/events-strip";
import { SundayLetterPreview } from "@/components/sections/home/sunday-letter-preview";
import { QuietCta } from "@/components/sections/home/quiet-cta";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : defaultLocale;
  const t = await getTranslations({ locale, namespace: "home.seo" });
  const tSite = await getTranslations({ locale, namespace: "site" });
  return {
    title: t("title"),
    description: t("description"),
    keywords: t("keywords")
      .split(",")
      .map((k) => k.trim()),
    alternates: alternatesFor(locale, "/"),
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: locale === defaultLocale ? "/" : `/${locale}`,
      type: "website",
      siteName: tSite("name"),
    },
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  setRequestLocale(rawLocale);
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : defaultLocale;
  return <HomePageContent locale={locale} />;
}

async function HomePageContent({ locale }: { locale: Locale }) {
  "use cache";
  const t = getCachedTranslations(locale, "home");
  const homeSchema = {
    "@type": "WebPage",
    "@id": "https://istanbulnomads.com#webpage",
    url:
      locale === defaultLocale
        ? "https://istanbulnomads.com"
        : `https://istanbulnomads.com/${locale}`,
    name: t("seo.title"),
    description: t("seo.description"),
    inLanguage: bcp47[locale],
    isPartOf: { "@id": "https://istanbulnomads.com#website" },
    about: { "@id": "https://istanbulnomads.com#organization" },
  };
  const jsonLd = jsonLdGraph(
    organizationSchema(),
    websiteSchema(locale),
    homeSchema,
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HeroIssue locale={locale} />
      <ThreeDoors locale={locale} />
      <WeekShape locale={locale} />
      <GuidesShelf locale={locale} />
      <NeighborhoodRhythmMatcher eyebrowNum="N° 05" />
      <EventsStrip locale={locale} />
      <SundayLetterPreview locale={locale} />
      <QuietCta locale={locale} />
    </>
  );
}
