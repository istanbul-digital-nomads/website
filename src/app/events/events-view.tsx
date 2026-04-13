"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import Link from "next/link";
import { Calendar, MapPin, Send } from "lucide-react";
import { EventsList } from "./events-list";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { socialLinks } from "@/lib/constants";
import type { Event } from "@/types/models";

const EventsMap = dynamic(
  () =>
    import("@/components/ui/events-map").then((mod) => ({
      default: mod.EventsMap,
    })),
  { ssr: false },
);

interface EventsViewProps {
  upcomingEvents: Event[];
  pastEvents: Event[];
}

export function EventsView({ upcomingEvents, pastEvents }: EventsViewProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

  const allEvents = [...upcomingEvents, ...pastEvents];
  const hasEvents = allEvents.length > 0;

  return (
    <div>
      {/* Map + Header integrated section */}
      <div className="relative">
        {/* Map background */}
        <div className="relative overflow-hidden">
          <EventsMap
            events={allEvents}
            selectedId={selectedId}
            onSelect={setSelectedId}
            expanded={expanded}
            onToggleExpand={() => setExpanded(!expanded)}
          />

          {/* Overlay header on top of map when NOT expanded */}
          {!expanded && (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-[var(--background)] via-[var(--background)]/80 to-transparent pb-6 pt-20">
              <Container>
                <div className="pointer-events-auto">
                  <h1 className="text-3xl font-bold tracking-tight text-[#1a1a2e] sm:text-4xl dark:text-[#f2f3f4]">
                    Events
                  </h1>
                  <p className="mt-2 max-w-lg text-[#5d6d7e] dark:text-[#99a3ad]">
                    Coworking, meetups, and workshops in Istanbul.
                    {!hasEvents && " New events are posted weekly."}
                  </p>
                </div>
              </Container>
            </div>
          )}
        </div>

        {/* Empty state overlay on map when no events */}
        {!hasEvents && !expanded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="mx-4 max-w-md rounded-2xl border border-primary-200/30 bg-white/90 p-8 text-center shadow-lg backdrop-blur-xl dark:border-[rgba(44,62,80,0.15)] dark:bg-[#15212c]/90">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/30">
                <Calendar className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-[#1a1a2e] dark:text-[#f2f3f4]">
                No events scheduled yet
              </h3>
              <p className="mt-2 text-sm text-[#5d6d7e] dark:text-[#99a3ad]">
                New events are posted weekly in the Telegram group. Join to get
                notified.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <a
                  href={socialLinks.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button size="sm" className="w-full rounded-xl sm:w-auto">
                    <Send className="h-4 w-4" />
                    Join Telegram
                  </Button>
                </a>
                <Link href="/guides">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full rounded-xl sm:w-auto"
                  >
                    <MapPin className="h-4 w-4" />
                    Explore guides
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Event cards below */}
      {hasEvents && (
        <EventsList
          upcomingEvents={upcomingEvents}
          pastEvents={pastEvents}
          selectedId={selectedId}
          onSelect={(id) => {
            setSelectedId(id);
            if (id && !expanded) {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
        />
      )}
    </div>
  );
}
