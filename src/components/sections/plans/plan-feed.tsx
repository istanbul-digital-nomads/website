import { getTranslations } from "next-intl/server";
import { getPlansForFeed, type PlanRange } from "@/lib/plans/queries";
import { PlanCard } from "./plan-card";
import { PLAN_VIBES, type PlanVibe } from "@/lib/plans/vibes";
import { aliPlanCards, aliDetailHref } from "@/lib/ali-week-plans";

interface Props {
  range: PlanRange;
  neighborhood?: string;
  vibe?: string;
  locale: string;
}

export async function PlanFeed({ range, neighborhood, vibe, locale }: Props) {
  const t = await getTranslations("plans");
  const { data: dbPlans } = await getPlansForFeed({ range, neighborhood, vibe });

  // Mix Ali Sameni's showcase week into the feed. These are static (not DB)
  // so they stay visible regardless of the date range, but we still honour the
  // active neighborhood/vibe filter so filtering the feed behaves coherently.
  const aliPlans = aliPlanCards().filter((p) => {
    if (neighborhood && !p.stops.some((s) => s.neighborhood_slug === neighborhood)) {
      return false;
    }
    if (vibe && !p.stops.some((s) => s.vibe === vibe)) return false;
    return true;
  });

  const plans = [...dbPlans, ...aliPlans].sort((a, b) => {
    const aStart = a.stops[0]?.start_time ?? "99:99";
    const bStart = b.stops[0]?.start_time ?? "99:99";
    return (
      a.scheduled_date.localeCompare(b.scheduled_date) ||
      aStart.localeCompare(bStart)
    );
  });

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
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {plans.map((plan) => (
        <li key={plan.id}>
          <PlanCard
            plan={plan}
            vibeLabels={vibeLabels}
            todayLabel={t("range.today")}
            capacityOpenLabel={t("capacity.open")}
            locale={locale}
            href={aliDetailHref(plan.id) ?? undefined}
          />
        </li>
      ))}
    </ul>
  );
}
