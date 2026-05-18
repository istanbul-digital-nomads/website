import type { Metadata } from "next";
import { Suspense } from "react";
import { Link } from "@/lib/i18n/routing";
import { getTranslations } from "next-intl/server";
import { PlansLandingHero } from "@/components/sections/plans/landing/hero";
import { PlansHowItWorks } from "@/components/sections/plans/landing/how-it-works";
import { PlansToneDisclaimer } from "@/components/sections/plans/landing/tone-disclaimer";
import { PlanFeed } from "@/components/sections/plans/plan-feed";
import { PlanFilters } from "@/components/sections/plans/plan-filters";
import { getCurrentMember } from "@/lib/supabase/queries";
import { defaultLocale, isValidLocale, type Locale } from "@/lib/i18n/config";
import { alternatesFor, localeUrl } from "@/lib/seo";
import { neighborhoods } from "@/lib/neighborhoods";
import type { PlanRange } from "@/lib/plans/queries";
import { Plus } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : defaultLocale;
  const t = await getTranslations({ locale, namespace: "plans.meta" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: alternatesFor(locale, "/plans"),
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: localeUrl(locale, "/plans"),
      type: "website",
    },
  };
}

export default function PlansPage(props: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    range?: string;
    neighborhood?: string;
    vibe?: string;
  }>;
}) {
  return (
    <Suspense fallback={null}>
      <PlansPageContent {...props} />
    </Suspense>
  );
}

async function PlansPageContent({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    range?: string;
    neighborhood?: string;
    vibe?: string;
  }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : defaultLocale;
  const sp = await searchParams;
  const range: PlanRange =
    sp.range === "tomorrow" || sp.range === "week" ? sp.range : "today";

  const { data: member } = await getCurrentMember();
  const isAuthed = !!member;
  const t = await getTranslations("plans");

  const hoodLookup = await Promise.all(
    neighborhoods.map(async (n) => ({
      slug: n.slug,
      name: (await getTranslations({ locale, namespace: "neighborhoodList" }))(
        `${n.slug}.name`,
      ),
    })),
  );

  return (
    <>
      <PlansLandingHero isAuthed={isAuthed} />

      {isAuthed && (
        <section className="relative overflow-hidden bg-deep-water font-grotesk text-cream">
          <div
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                "linear-gradient(180deg, #06101f, #0a1a2f 60%, #06101f)",
            }}
          />
          <div className="relative mx-auto max-w-[1320px] px-6 py-12 md:px-10 md:py-16">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2
                  className="font-editorial text-cream"
                  style={{
                    fontSize: "clamp(2rem, 4vw, 2.75rem)",
                    letterSpacing: "-0.015em",
                    lineHeight: 1.05,
                    fontWeight: 400,
                  }}
                >
                  {t(`range.${range}`)}
                </h2>
                <p className="mt-2 text-sm text-cream/70">
                  {t("feed.subtitle")}
                </p>
              </div>
              <Link
                href="/plans/new"
                className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-3 text-sm font-semibold text-deep-water transition-colors hover:bg-gold/90"
              >
                <Plus className="h-3.5 w-3.5" />
                {t("landing.ctaShare")}
              </Link>
            </div>

            <div className="mt-8">
              <PlanFilters neighborhoods={hoodLookup} />
            </div>

            <div className="mt-8">
              <Suspense fallback={null}>
                <PlanFeed
                  range={range}
                  neighborhood={sp.neighborhood}
                  vibe={sp.vibe}
                  locale={locale}
                />
              </Suspense>
            </div>
          </div>
        </section>
      )}

      <PlansHowItWorks />
      <PlansToneDisclaimer />
    </>
  );
}
