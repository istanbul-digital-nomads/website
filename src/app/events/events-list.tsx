"use client";

import { useState } from "react";
import { Calendar, MapPin, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { formatDate } from "@/lib/utils";
import { eventTypes } from "@/lib/constants";
import type { Event, EventType } from "@/types/models";

const tabs = ["upcoming", "past"] as const;
type Tab = (typeof tabs)[number];

interface EventsListProps {
  upcomingEvents: Event[];
  pastEvents: Event[];
  selectedId?: string | null;
  onSelect?: (id: string | null) => void;
}

export function EventsList({
  upcomingEvents,
  pastEvents,
  selectedId,
  onSelect,
}: EventsListProps) {
  const [tab, setTab] = useState<Tab>("upcoming");
  const [filterType, setFilterType] = useState<EventType | "all">("all");

  const events = tab === "upcoming" ? upcomingEvents : pastEvents;
  const filtered =
    filterType === "all" ? events : events.filter((e) => e.type === filterType);

  return (
    <Section>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-1 rounded-full border border-primary-100/80 bg-white/70 p-1 dark:border-white/10 dark:bg-white/5">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-full px-4 py-2 text-sm font-medium capitalize transition-colors ${
                tab === t
                  ? "bg-primary-600 text-white shadow-[0_10px_24px_rgba(200,53,31,0.18)] dark:bg-primary-500"
                  : "text-[#6b6257] hover:text-[#2a2018] dark:text-[#b8a898]"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilterType("all")}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              filterType === "all"
                ? "bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300"
                : "bg-white/70 text-[#6b6257] ring-1 ring-black/5 dark:bg-white/5 dark:text-[#b8a898] dark:ring-white/10"
            }`}
          >
            All
          </button>
          {(Object.keys(eventTypes) as EventType[]).map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                filterType === type
                  ? "bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300"
                  : "bg-white/70 text-[#6b6257] ring-1 ring-black/5 dark:bg-white/5 dark:text-[#b8a898] dark:ring-white/10"
              }`}
            >
              {eventTypes[type].label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-primary-200/50 bg-primary-50/30 p-12 text-center dark:border-primary-900/30 dark:bg-primary-950/10">
          <p className="text-[#6b6257] dark:text-[#b8a898]">
            {tab === "upcoming"
              ? "No events scheduled yet. New events are posted weekly in the Telegram group."
              : "No past events matching your filter."}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((event) => (
            <Card
              key={event.id}
              hoverable
              className={cn(
                "cursor-pointer transition-all",
                selectedId === event.id &&
                  "ring-2 ring-primary-500 ring-offset-2 dark:ring-offset-[#151010]",
              )}
              onClick={() =>
                onSelect?.(selectedId === event.id ? null : event.id)
              }
            >
              <CardContent>
                <div className="flex items-center justify-between">
                  <Badge variant={event.type}>
                    {eventTypes[event.type].label}
                  </Badge>
                  {tab === "past" && (
                    <span className="text-xs text-[#b8a898]">Past</span>
                  )}
                </div>
                <h3 className="mt-3 text-lg font-semibold">{event.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm text-[#6b6257] dark:text-[#b8a898]">
                  {event.description}
                </p>
                <div className="mt-4 space-y-2 text-sm text-[#6b6257] dark:text-[#b8a898]">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {formatDate(event.date)}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {event.location_name}
                  </div>
                  {event.capacity && (
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      {event.capacity} spots
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </Section>
  );
}
