import { getTranslations } from "next-intl/server";
import { getMemberPlansToday } from "@/lib/plans/queries";
import { PLAN_VIBES, type PlanVibe } from "@/lib/plans/vibes";
import { PlanCard } from "./plan-card";

interface Props {
  memberId: string;
  locale: string;
}

/**
 * "Today's plans by this member" surface for the profile page.
 * Returns null entirely if the member has no upcoming plans -
 * the profile shouldn't show empty sections.
 */
export async function MemberPlansToday({ memberId, locale }: Props) {
  const t = await getTranslations("plans");
  const plans = await getMemberPlansToday(memberId);
  if (plans.length === 0) return null;

  const vibeLabels = Object.fromEntries(
    PLAN_VIBES.map((v) => [v, t(`vibes.${v}`)]),
  ) as Record<PlanVibe, string>;

  return (
    <section
      aria-label="Today's plans by this member"
      className="mt-10 border-t border-ink-3 pt-8"
    >
      <h2 className="font-mono text-[11px] uppercase tracking-wider text-terracotta">
        {t("memberSurface.title")}
      </h2>
      <p className="mt-1 text-sm text-paper-dim">
        {t("memberSurface.subtitle")}
      </p>
      <ul className="mt-5 grid gap-4 sm:grid-cols-2">
        {plans.map((plan) => (
          <li key={plan.id}>
            <PlanCard
              plan={plan}
              vibeLabels={vibeLabels}
              capacityOpenLabel={t("capacity.open")}
              todayLabel={t("range.today")}
              locale={locale}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
