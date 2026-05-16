import Image from "next/image";
import { Users } from "lucide-react";
import { Link } from "@/lib/i18n/routing";
import { cn } from "@/lib/utils";
import { spaces } from "@/lib/spaces";
import type { PlanCardSummary } from "@/lib/plans/queries";
import type { PlanVibe } from "@/lib/plans/vibes";
import { PlanVibeIcon } from "./plan-vibe-icon";
import { PlanAttendeeStack } from "./plan-attendee-stack";

interface Props {
  plan: PlanCardSummary;
  vibeLabels: Record<PlanVibe, string>;
  capacityOpenLabel: string;
  todayLabel: string;
  locale: string;
}

function stopLabel(stop: PlanCardSummary["stops"][number]): string {
  if (stop.space_id) {
    const sp = spaces.find((s) => s.id === stop.space_id);
    if (sp) return sp.name;
  }
  return stop.custom_location ?? stop.neighborhood_slug ?? "Pinned";
}

function formatStopTime(
  start: string | null,
  end: string | null,
  locale: string,
): string {
  if (!start) return "";
  const fmt = new Intl.DateTimeFormat(locale, {
    hour: "numeric",
    minute: "2-digit",
    hour12: locale.startsWith("en"),
  });
  // Construct a UTC datetime then format - we only care about the clock face,
  // not timezone here (card is glanceable).
  const today = new Date().toISOString().slice(0, 10);
  const s = fmt.format(new Date(`${today}T${start}`));
  if (!end) return s;
  const e = fmt.format(new Date(`${today}T${end}`));
  return `${s}-${e}`;
}

export function PlanCard({
  plan,
  vibeLabels,
  capacityOpenLabel,
  todayLabel,
  locale,
}: Props) {
  const firstStop = plan.stops[0];
  const moreStops = plan.stops.slice(1);
  const totalGoing = plan.attendee_count;

  return (
    <Link
      href={`/plans/${plan.id}`}
      className="group block border border-ink-3 bg-ink-1 transition-colors duration-fast hover:border-terracotta focus-visible:border-terracotta focus-visible:outline-none"
    >
      <article
        className="flex h-full flex-col"
        aria-label={`Plan: ${plan.title}, ${plan.stops.length} stop${plan.stops.length === 1 ? "" : "s"}`}
      >
        {/* Host strip */}
        <div className="flex items-center gap-3 border-b border-ink-3 px-4 py-3">
          <span
            aria-hidden
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-ink-3 text-xs font-medium text-paper"
          >
            {plan.host?.avatar_url ? (
              <Image
                src={plan.host.avatar_url}
                alt=""
                width={32}
                height={32}
                className="h-full w-full object-cover"
              />
            ) : (
              (plan.host?.display_name ?? "?").charAt(0)
            )}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-paper">
              {plan.host?.display_name ?? "-"}
            </p>
            {plan.host?.city_district && (
              <p className="truncate font-mono text-[10px] uppercase tracking-wider text-paper-mute">
                {plan.host.city_district}
              </p>
            )}
          </div>
          {firstStop && (
            <span className="inline-flex items-center gap-1.5 border border-ink-3 bg-ink-2 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-paper">
              <PlanVibeIcon
                vibe={firstStop.vibe}
                className="h-3 w-3 text-terracotta"
              />
              {vibeLabels[firstStop.vibe]}
            </span>
          )}
        </div>

        {/* Title */}
        <div className="px-4 pt-4">
          <h3 className="line-clamp-2 font-display text-lg leading-snug text-paper">
            {plan.title}
          </h3>
        </div>

        {/* Stops timeline */}
        <ol
          className="space-y-1.5 px-4 pb-3 pt-3 text-sm text-paper-dim"
          aria-label="Stops in this plan"
        >
          {firstStop && (
            <StopRow
              ordinal={1}
              label={stopLabel(firstStop)}
              time={formatStopTime(
                firstStop.start_time,
                firstStop.end_time,
                locale,
              )}
              isFirst
            />
          )}
          {moreStops.slice(0, 2).map((s, i) => (
            <StopRow
              key={s.id}
              ordinal={i + 2}
              label={stopLabel(s)}
              time={formatStopTime(s.start_time, s.end_time, locale)}
            />
          ))}
          {moreStops.length > 2 && (
            <li className="font-mono text-[10px] uppercase tracking-wider text-paper-mute">
              +{moreStops.length - 2} more
            </li>
          )}
        </ol>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 border-t border-ink-3 bg-ink-0/40 px-4 py-3">
          <span className="font-mono text-[10px] uppercase tracking-wider text-paper-mute">
            {firstStop &&
            formatStopTime(firstStop.start_time, firstStop.end_time, locale)
              ? formatStopTime(firstStop.start_time, firstStop.end_time, locale)
              : todayLabel}
          </span>
          <div className="flex items-center gap-3">
            <PlanAttendeeStack attendees={plan.attendees} />
            <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-paper-mute">
              <Users className="h-3 w-3" aria-hidden />
              {plan.capacity
                ? `${totalGoing}/${plan.capacity}`
                : capacityOpenLabel}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

function StopRow({
  ordinal,
  label,
  time,
  isFirst,
}: {
  ordinal: number;
  label: string;
  time: string;
  isFirst?: boolean;
}) {
  return (
    <li className="flex items-center gap-2">
      <span
        aria-hidden
        className={cn(
          "flex h-5 w-5 shrink-0 items-center justify-center rounded-full font-mono text-[10px] font-semibold",
          isFirst
            ? "bg-terracotta text-ink-0"
            : "border border-terracotta/60 bg-transparent text-terracotta",
        )}
      >
        {ordinal}
      </span>
      <span className="truncate">{label}</span>
      {time && (
        <span className="ms-auto font-mono text-[10px] uppercase tracking-wider text-paper-mute">
          {time}
        </span>
      )}
    </li>
  );
}

export function PlanCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "h-[14rem] animate-pulse border border-ink-3 bg-ink-1",
        className,
      )}
    />
  );
}
