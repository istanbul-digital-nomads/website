import Image from "next/image";
import { MapPin, Users } from "lucide-react";
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
  timeLabel: string; // pre-formatted for locale
  capacityOpenLabel: string;
  todayLabel: string;
}

export function PlanCard({
  plan,
  vibeLabels,
  timeLabel,
  capacityOpenLabel,
  todayLabel,
}: Props) {
  const space = plan.space_id
    ? spaces.find((s) => s.id === plan.space_id)
    : null;
  const locationName =
    space?.name ?? plan.custom_location ?? plan.neighborhood_slug ?? "";

  return (
    <Link
      href={`/plans/${plan.id}`}
      className="group block border border-ink-3 bg-ink-1 transition-colors duration-fast hover:border-terracotta"
    >
      <article className="flex h-full flex-col">
        {/* Header strip with host */}
        <div className="flex items-center gap-3 border-b border-ink-3 px-4 py-3">
          <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-ink-3 text-xs font-medium text-paper">
            {plan.host?.avatar_url ? (
              <Image
                src={plan.host.avatar_url}
                alt={plan.host.display_name}
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
          <span className="inline-flex items-center gap-1.5 border border-ink-3 bg-ink-2 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-paper">
            <PlanVibeIcon
              vibe={plan.vibe}
              className="h-3 w-3 text-terracotta"
            />
            {vibeLabels[plan.vibe]}
          </span>
        </div>

        {/* Body */}
        <div className="flex-1 px-4 pb-3 pt-4">
          <h3 className="line-clamp-2 font-display text-lg leading-snug text-paper">
            {plan.title}
          </h3>
          {plan.notes && (
            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-paper-dim">
              {plan.notes}
            </p>
          )}
          <div className="mt-3 flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wide text-paper-mute">
            <MapPin className="h-3 w-3 shrink-0" />
            <span className="truncate">{locationName}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 border-t border-ink-3 bg-ink-0/40 px-4 py-3">
          <span
            className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-terracotta"
            dir="ltr"
          >
            {timeLabel || todayLabel}
          </span>
          <div className="flex items-center gap-3">
            <PlanAttendeeStack attendees={plan.attendees} />
            <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-paper-mute">
              <Users className="h-3 w-3" />
              {plan.capacity
                ? `${plan.attendee_count}/${plan.capacity}`
                : capacityOpenLabel}
            </span>
          </div>
        </div>
      </article>
    </Link>
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
