import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getCachedTranslations } from "@/lib/i18n/cache-translations";
import { getEventsPublic } from "@/lib/supabase/queries";
import { isValidLocale, defaultLocale, type Locale } from "@/lib/i18n/config";
import { alternatesFor, localeUrl } from "@/lib/seo";
import { Container } from "@/components/ui/container";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { EventsBoard } from "@/components/sections/events/events-board";
import { SurpriseEventWaitlist } from "./surprise-event-waitlist";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : defaultLocale;
  const t = await getTranslations({ locale, namespace: "eventsPage.meta" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: alternatesFor(locale, "/events"),
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: localeUrl(locale, "/events"),
      type: "website",
    },
  };
}

export default async function EventsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : defaultLocale;
  const t = getCachedTranslations(locale, "eventsV2");

  const [{ data: upcoming }, { data: past }] = await Promise.all([
    getEventsPublic({ past: false }),
    getEventsPublic({ past: true }),
  ]);

  return (
    <section className="bg-ink-1 pt-16 lg:pt-24">
      <Container>
        <SectionEyebrow num="N° 01" label={t("eyebrow")} />
        <h1 className="mt-8 max-w-3xl font-display text-h1 leading-none text-paper lg:text-display-lg">
          {t("title")}{" "}
          <span className="italic text-terracotta">{t("titleItalic")}</span>
        </h1>
        <p className="mt-8 max-w-2xl text-lede leading-relaxed text-paper-dim">
          {t("lede")}
        </p>

        <div className="mt-14">
          <EventsBoard
            upcomingEvents={upcoming ?? []}
            pastEvents={past ?? []}
          />
        </div>

        <p className="mt-6 font-mono text-[10.5px] uppercase tracking-wider text-paper-faint">
          {t("note")}
        </p>

        <div className="mt-20 border-t border-ink-3 pb-24 pt-16">
          <SurpriseEventWaitlist />
        </div>
      </Container>
    </section>
  );
}
