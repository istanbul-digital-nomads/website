import type { Metadata } from "next";
import { Suspense } from "react";
import { Link } from "@/lib/i18n/routing";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/container";
import { PlansLandingHero } from "@/components/plans/landing/hero";
import { PlansHowItWorks } from "@/components/plans/landing/how-it-works";
import { PlansToneDisclaimer } from "@/components/plans/landing/tone-disclaimer";
import { PlanFeed } from "@/components/plans/plan-feed";
import { PlanFilters } from "@/components/plans/plan-filters";
import { getCurrentMember } from "@/lib/supabase/queries";
import {
  defaultLocale,
  isValidLocale,
  type Locale,
} from "@/lib/i18n/config";
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
        <section className="border-b border-ink-3 bg-ink-0 py-12 lg:py-16">
          <Container>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="font-display text-h2 text-paper">
                  {t(`range.${range}`)}
                </h2>
                <p className="mt-2 text-sm text-paper-dim">
                  {t("feed.subtitle")}
                </p>
              </div>
              <Link
                href="/plans/new"
                className="inline-flex items-center gap-2 bg-terracotta px-5 py-3 text-sm font-medium text-ink-0 transition-colors hover:bg-terracotta-dim"
              >
                <Plus className="h-4 w-4" />
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
          </Container>
        </section>
      )}

      <PlansHowItWorks />
      <PlansToneDisclaimer />
    </>
  );
}
