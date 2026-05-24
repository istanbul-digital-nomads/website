"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { eventTypes } from "@/lib/constants";
import type { Locale } from "@/lib/i18n/config";
import type { Event, EventType } from "@/types/models";

/**
 * Design System v2 Phase 4 - the events board. Tabs (upcoming / past) + a
 * type filter over an editorial row-list. The row is the unit, not a card.
 * Restyled to the ink/paper tokens; all data is real (Supabase `events`).
 */
const TABS = ["upcoming", "past"] as const;
type Tab = (typeof TABS)[number];

export function EventsBoard({
  upcomingEvents,
  pastEvents,
}: {
  upcomingEvents: Event[];
  pastEvents: Event[];
}) {
  const t = useTranslations("eventsV2");
  const tList = useTranslations("eventsPage.list");
  const locale = useLocale() as Locale;
  const [tab, setTab] = useState<Tab>("upcoming");
  const [filter, setFilter] = useState<EventType | "all">("all");

  const events = tab === "upcoming" ? upcomingEvents : pastEvents;
  const rows =
    filter === "all" ? events : events.filter((e) => e.type === filter);

  const dateFmt = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    timeZone: "Europe/Istanbul",
  });
  const timeFmt = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Europe/Istanbul",
  });

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-col gap-4 border-b border-ink-3 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-1">
          {TABS.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={`px-4 py-2 font-mono text-[11px] uppercase tracking-wider transition-colors duration-fast ${
                tab === key
                  ? "bg-terracotta text-[#06101f]"
                  : "text-paper-mute hover:text-paper"
              }`}
            >
              {tList(`tabs.${key}`)}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5">
          <FilterPill
            active={filter === "all"}
            onClick={() => setFilter("all")}
            label={tList("filters.all")}
          />
          {(Object.keys(eventTypes) as EventType[]).map((type) => (
            <FilterPill
              key={type}
              active={filter === type}
              onClick={() => setFilter(type)}
              label={tList(`types.${type}`)}
            />
          ))}
        </div>
      </div>

      {/* Rows */}
      {rows.length === 0 ? (
        <div className="px-2 py-12">
          <p className="font-mono text-[11px] uppercase tracking-wider text-paper-mute">
            {tab === "upcoming" ? tList("emptyUpcoming") : tList("emptyPast")}
          </p>
        </div>
      ) : (
        <div className="border-x border-b border-ink-3">
          {rows.map((event, i) => (
            <Link
              key={event.id}
              href={`/events/${event.slug ?? event.id}`}
              className="group grid grid-cols-[6rem_auto_1fr_auto] items-center gap-4 px-5 py-5 transition-colors duration-fast hover:bg-ink-2 sm:gap-8 sm:px-7"
              style={{
                borderTop: i === 0 ? undefined : "1px solid rgb(var(--ink-3))",
              }}
            >
              <div className="font-mono text-[11px] uppercase tracking-wider text-terracotta">
                <div>{dateFmt.format(new Date(event.date))}</div>
                <div className="mt-1 text-base tabular-nums text-paper">
                  {timeFmt.format(new Date(event.date))}
                </div>
              </div>
              <span className="hidden border border-ink-4 px-2.5 py-1 font-mono text-[9.5px] uppercase tracking-wider text-paper-mute sm:inline-block">
                {tList(`types.${event.type}`)}
              </span>
              <div className="min-w-0">
                <div className="truncate font-display text-h4 text-paper">
                  {event.title}
                </div>
                {event.location_name ? (
                  <div className="mt-0.5 truncate font-mono text-[10px] uppercase tracking-wider text-paper-faint">
                    {event.location_name}
                  </div>
                ) : null}
              </div>
              <div className="text-end">
                <div
                  className="font-mono text-[11px] uppercase tracking-wider text-paper-mute"
                  dir={event.price_try ? "ltr" : undefined}
                >
                  {event.price_try
                    ? `₺${event.price_try.toLocaleString("en-US")}`
                    : t("free")}
                </div>
                <div className="mt-1 inline-flex items-center gap-1.5 text-sm text-terracotta">
                  {tab === "upcoming" ? t("rsvp") : t("recap")}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function FilterPill({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-wide transition-colors duration-fast ${
        active
          ? "border-terracotta text-terracotta"
          : "border-ink-4 text-paper-mute hover:border-ink-5 hover:text-paper"
      }`}
    >
      {label}
    </button>
  );
}
