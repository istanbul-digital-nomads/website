import type { Metadata } from "next";
import { getEvents } from "@/lib/supabase/queries";
import { EventsView } from "./events-view";

export const metadata: Metadata = {
  title: "Events",
  description:
    "Upcoming meetups, coworking sessions, workshops, and social events for digital nomads in Istanbul.",
};

export default async function EventsPage() {
  const [{ data: upcoming }, { data: past }] = await Promise.all([
    getEvents({ past: false }),
    getEvents({ past: true }),
  ]);

  return <EventsView upcomingEvents={upcoming ?? []} pastEvents={past ?? []} />;
}
