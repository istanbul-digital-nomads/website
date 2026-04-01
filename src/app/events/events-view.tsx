"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { EventsList } from "./events-list";
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

  return (
    <div className="space-y-8">
      <div className="px-4 pt-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <EventsMap
            events={allEvents}
            selectedId={selectedId}
            onSelect={setSelectedId}
            expanded={expanded}
            onToggleExpand={() => setExpanded(!expanded)}
          />
        </div>
      </div>

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
    </div>
  );
}
