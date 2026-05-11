import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getEvents } from "@/lib/supabase/queries";
import { EventsView } from "./events-view";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("eventsPage.meta");
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function EventsPage() {
  const [{ data: upcoming }, { data: past }] = await Promise.all([
    getEvents({ past: false }),
    getEvents({ past: true }),
  ]);

  return <EventsView upcomingEvents={upcoming ?? []} pastEvents={past ?? []} />;
}
