import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock3, Headphones, MapPin, PlugZap } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/container";
import { spaces } from "@/lib/spaces";
import {
  bcp47,
  defaultLocale,
  isValidLocale,
  type Locale,
} from "@/lib/i18n/config";
import { alternatesFor, localeUrl, SITE_URL } from "@/lib/seo";
import { SpacesDirectory } from "./spaces-directory";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : defaultLocale;
  const t = await getTranslations({ locale, namespace: "spacesPage.meta" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: alternatesFor(locale, "/spaces"),
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: localeUrl(locale, "/spaces"),
      type: "website",
    },
  };
}

export default async function SpacesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : defaultLocale;
  const t = await getTranslations("spacesPage");
  const openSpaces = spaces.filter((space) => space.status !== "closed");
  const neighborhoods = new Set(spaces.map((space) => space.neighborhood)).size;

  const canonicalUrl = localeUrl(locale, "/spaces");
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${canonicalUrl}#spaces`,
    name: t("meta.title"),
    description: t("meta.description"),
    inLanguage: bcp47[locale],
    numberOfItems: openSpaces.length,
    itemListElement: openSpaces.map((space, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type":
          space.type === "coworking" ? "LocalBusiness" : "CafeOrCoffeeShop",
        "@id": `${SITE_URL}/spaces#${space.id}`,
        name: space.name,
        address: {
          "@type": "PostalAddress",
          streetAddress: space.address,
          addressLocality: space.neighborhood,
          addressRegion: "Istanbul",
          addressCountry: "TR",
        },
        geo: {
          "@type": "GeoCoordinates",
          longitude: space.coordinates[0],
          latitude: space.coordinates[1],
        },
        ...(space.website ? { url: space.website } : {}),
        ...(space.hours ? { openingHours: space.hours } : {}),
        ...(space.amenities && space.amenities.length > 0
          ? { amenityFeature: space.amenities }
          : {}),
        ...(space.price_range ? { priceRange: space.price_range } : {}),
      },
    })),
  };

  return (
    <div className="overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <section className="border-b border-black/10 bg-[#fbfaf8] py-12 dark:border-white/10 dark:bg-[#14110f] lg:py-16">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-end">
            <div>
              <p className="eyebrow">{t("hero.eyebrow")}</p>
              <h1 className="mt-4 max-w-3xl font-display text-5xl font-extrabold leading-[0.98] text-neutral-950 sm:text-[4.5rem] dark:text-[#f2f3f4]">
                {t("hero.title")}
              </h1>
              <p className="mt-5 max-w-2xl text-body-lg leading-8 text-[#5d6d7e] dark:text-[#b7aaa0]">
                {t("hero.body")}
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#space-finder"
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-neutral-950 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-neutral-800 dark:bg-[#f2f3f4] dark:text-[#14110f] dark:hover:bg-[#d8d0c8]"
                >
                  {t("hero.openFinder")}
                  <ArrowRight className="h-4 w-4" />
                </a>
                <Link
                  href="/tools/first-week-planner"
                  className="inline-flex items-center justify-center gap-2 rounded-md border border-black/15 px-5 py-3 text-sm font-semibold text-neutral-950 transition-colors hover:border-primary-500/40 hover:bg-white/60 dark:border-white/20 dark:text-[#f2f3f4] dark:hover:bg-white/10"
                >
                  {t("hero.planWeekOne")}
                </Link>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <HeroSignal
                icon={PlugZap}
                label={t("hero.signals.workReady.label")}
                value={t("hero.signals.workReady.value", {
                  count: openSpaces.length,
                })}
                detail={t("hero.signals.workReady.detail")}
              />
              <HeroSignal
                icon={MapPin}
                label={t("hero.signals.coverage.label")}
                value={t("hero.signals.coverage.value", {
                  count: neighborhoods,
                })}
                detail={t("hero.signals.coverage.detail")}
              />
              <HeroSignal
                icon={Headphones}
                label={t("hero.signals.decisionLabels.label")}
                value={t("hero.signals.decisionLabels.value")}
                detail={t("hero.signals.decisionLabels.detail")}
              />
              <HeroSignal
                icon={Clock3}
                label={t("hero.signals.realityCheck.label")}
                value={t("hero.signals.realityCheck.value")}
                detail={t("hero.signals.realityCheck.detail")}
              />
            </div>
          </div>
        </Container>
      </section>

      <section id="space-finder" className="py-12 lg:py-16">
        <Container>
          <SpacesDirectory spaces={spaces} />
        </Container>
      </section>
    </div>
  );
}

function HeroSignal({
  icon: Icon,
  label,
  value,
  detail,
}: {
  icon: typeof PlugZap;
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-md border border-black/10 bg-white/70 p-4 dark:border-white/10 dark:bg-white/[0.04]">
      <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-neutral-500 dark:text-[#94877d]">
        <Icon className="h-4 w-4 text-primary-600 dark:text-primary-300" />
        {label}
      </div>
      <p className="mt-3 font-display text-2xl font-extrabold text-neutral-950 dark:text-[#f2f3f4]">
        {value}
      </p>
      <p className="mt-2 text-sm leading-6 text-[#5d6d7e] dark:text-[#b7aaa0]">
        {detail}
      </p>
    </div>
  );
}
