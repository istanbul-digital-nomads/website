import { getTranslations } from "next-intl/server";
import { getPlansForFeed, type PlanRange } from "@/lib/plans/queries";
import { PlanCard } from "./plan-card";
import { PLAN_VIBES, type PlanVibe } from "@/lib/plans/vibes";

interface Props {
  range: PlanRange;
  neighborhood?: string;
  vibe?: string;
  locale: string;
}

function formatTimeRange(
  date: string,
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
  const s = fmt.format(new Date(`${date}T${start}+03:00`));
  if (!end) return s;
  const e = fmt.format(new Date(`${date}T${end}+03:00`));
  return `${s} – ${e}`;
}

export async function PlanFeed({ range, neighborhood, vibe, locale }: Props) {
  const t = await getTranslations("plans");
  const { data: plans } = await getPlansForFeed({ range, neighborhood, vibe });

  if (plans.length === 0) {
    return (
      <div className="border border-dashed border-ink-3 bg-ink-1 px-6 py-16 text-center">
        <p className="font-display text-h3 text-paper">{t("empty.title")}</p>
        <p className="mt-3 text-sm text-paper-dim">{t("empty.body")}</p>
      </div>
    );
  }

  const vibeLabels = Object.fromEntries(
    PLAN_VIBES.map((v) => [v, t(`vibes.${v}`)]),
  ) as Record<PlanVibe, string>;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {plans.map((plan) => (
        <PlanCard
          key={plan.id}
          plan={plan}
          vibeLabels={vibeLabels}
          timeLabel={formatTimeRange(
            plan.scheduled_date,
            plan.start_time,
            plan.end_time,
            locale,
          )}
          todayLabel={t("range.today")}
          capacityOpenLabel={t("capacity.open")}
        />
      ))}
    </div>
  );
}
