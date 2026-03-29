"use client";

import { useState } from "react";
import { Calendar, MapPin, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import {
  Section,
  SectionHeader,
  SectionTitle,
  SectionDescription,
} from "@/components/ui/section";
import { events } from "@/lib/data";
import { formatDate } from "@/lib/utils";
import { eventTypes, type EventType } from "@/lib/constants";

const tabs = ["upcoming", "past"] as const;
type Tab = (typeof tabs)[number];

export default function EventsPage() {
  const [tab, setTab] = useState<Tab>("upcoming");
  const [filterType, setFilterType] = useState<EventType | "all">("all");

  const filtered = events
    .filter((e) => (tab === "upcoming" ? !e.isPast : e.isPast))
    .filter((e) => (filterType === "all" ? true : e.type === filterType));

  return (
    <Section>
      <SectionHeader>
        <SectionTitle>Events</SectionTitle>
        <SectionDescription>
          Meetups, coworking sessions, workshops, and social events.
        </SectionDescription>
      </SectionHeader>

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Tabs */}
        <div className="flex gap-1 rounded-lg bg-neutral-100 p-1 dark:bg-neutral-800">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-md px-4 py-2 text-sm font-medium capitalize transition-colors ${
                tab === t
                  ? "bg-white text-neutral-900 shadow-sm dark:bg-neutral-700 dark:text-neutral-100"
                  : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-400"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilterType("all")}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              filterType === "all"
                ? "bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400"
                : "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
            }`}
          >
            All
          </button>
          {(Object.keys(eventTypes) as EventType[]).map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                filterType === type
                  ? "bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400"
                  : "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
              }`}
            >
              {eventTypes[type].label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-12 text-center dark:border-neutral-700 dark:bg-neutral-900/50">
          <p className="text-neutral-500">
            {tab === "upcoming"
              ? "No upcoming events right now. Check back soon!"
              : "No past events matching your filter."}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((event) => (
            <Card key={event.id} hoverable>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Badge variant={event.type}>{eventTypes[event.type].label}</Badge>
                  {event.isPast && (
                    <span className="text-xs text-neutral-400">Past</span>
                  )}
                </div>
                <h3 className="mt-3 text-lg font-semibold">{event.title}</h3>
                <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2">
                  {event.description}
                </p>
                <div className="mt-4 space-y-2 text-sm text-neutral-500 dark:text-neutral-400">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {formatDate(event.date)}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {event.location}
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    {event.attendees} attending
                    {event.capacity && ` / ${event.capacity} spots`}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </Section>
  );
}
