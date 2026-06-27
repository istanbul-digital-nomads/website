"use client";

import { CalendarDays, MapPin, ExternalLink } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

export interface LumaEventCardData {
  title: string | null;
  venueName: string | null;
  coverUrl: string | null;
  url: string;
  /** YYYY-MM-DD, Istanbul-local. */
  date: string | null;
  /** HH:MM, Istanbul-local. */
  startTime: string | null;
  endTime: string | null;
}

function formatDate(date: string | null, locale: string): string | null {
  if (!date) return null;
  const d = new Date(`${date}T12:00:00Z`);
  if (Number.isNaN(d.getTime())) return null;
  return new Intl.DateTimeFormat(locale, {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  }).format(d);
}

function formatTime(
  start: string | null,
  end: string | null,
  locale: string,
): string | null {
  if (!start) return null;
  const fmt = new Intl.DateTimeFormat(locale, {
    hour: "numeric",
    minute: "2-digit",
    hour12: locale.startsWith("en"),
  });
  const day = "2000-01-01";
  const s = fmt.format(new Date(`${day}T${start}`));
  if (!end) return s;
  return `${s} - ${fmt.format(new Date(`${day}T${end}`))}`;
}

// The rich Luma event card shown for an `event` plan step. Read-only: the
// title/venue/time all come from the lu.ma page, so this is a confirmation
// surface, not an editor.
export function LumaEventCard({
  data,
  locale,
  className,
}: {
  data: LumaEventCardData;
  locale: string;
  className?: string;
}) {
  const t = useTranslations("plans.event");
  const dateLabel = formatDate(data.date, locale);
  const timeLabel = formatTime(data.startTime, data.endTime, locale);

  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border border-ink-3 bg-ink-0/40",
        className,
      )}
    >
      {data.coverUrl && (
        // External lu.ma CDN image - plain <img> avoids next/image remote config.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={data.coverUrl}
          alt=""
          loading="lazy"
          className="h-28 w-full object-cover"
        />
      )}
      <div className="space-y-2 p-3">
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1 rounded-full border border-[#e54d63]/40 bg-[#e54d63]/10 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-[#e54d63]">
            {t("lumaBadge")}
          </span>
          <a
            href={data.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-paper-mute transition-colors hover:text-paper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
          >
            {t("viewOnLuma")}
            <ExternalLink className="h-3 w-3" aria-hidden />
          </a>
        </div>

        <p className="text-base font-medium leading-snug text-paper">
          {data.title ?? t("untitled")}
        </p>

        <div className="space-y-1 text-sm text-paper-dim">
          {(dateLabel || timeLabel) && (
            <p className="flex items-center gap-1.5">
              <CalendarDays
                className="h-3.5 w-3.5 shrink-0 text-terracotta"
                aria-hidden
              />
              <span>{[dateLabel, timeLabel].filter(Boolean).join(" · ")}</span>
            </p>
          )}
          {data.venueName && (
            <p className="flex items-center gap-1.5">
              <MapPin
                className="h-3.5 w-3.5 shrink-0 text-terracotta"
                aria-hidden
              />
              <span className="truncate">{data.venueName}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
