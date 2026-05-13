import type { Metadata } from "next";
import { preconnect } from "react-dom";
import { getTranslations } from "next-intl/server";
import { getEvents } from "@/lib/supabase/queries";
import { isValidLocale, defaultLocale, type Locale } from "@/lib/i18n/config";
import { alternatesFor, localeUrl } from "@/lib/seo";
import { EventsView } from "./events-view";

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

export default async function EventsPage() {
  preconnect("https://basemaps.cartocdn.com");
  const [{ data: upcoming }, { data: past }] = await Promise.all([
    getEvents({ past: false }),
    getEvents({ past: true }),
  ]);

  return <EventsView upcomingEvents={upcoming ?? []} pastEvents={past ?? []} />;
}
