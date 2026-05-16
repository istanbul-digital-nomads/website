import { getPlansTodayCount } from "@/lib/plans/queries";
import { getTranslations } from "next-intl/server";

export async function PlansTodayCounter() {
  const t = await getTranslations("plans.counter");
  const { count, byNeighborhood } = await getPlansTodayCount();
  const hoodCount = byNeighborhood.length;

  return (
    <div className="border border-ink-3 bg-ink-1 p-6 lg:p-8">
      <div className="flex items-baseline justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-wider text-paper-mute">
            {t("eyebrow")}
          </p>
          <p className="mt-3 font-display text-display-lg leading-none text-paper">
            <span className="tabular-nums" dir="ltr">
              {count}
            </span>
          </p>
          <p className="mt-2 text-sm text-paper-dim">
            {t("activeAcross", { hoods: hoodCount })}
          </p>
        </div>
        {byNeighborhood.length > 0 && (
          <ul className="flex max-w-[60%] flex-wrap justify-end gap-1.5">
            {byNeighborhood.slice(0, 6).map((n) => (
              <li
                key={n.neighborhood_slug}
                className="inline-flex items-center gap-1.5 border border-ink-3 bg-ink-2 px-2 py-1 font-mono text-[10px] uppercase tracking-wide text-paper-dim"
              >
                <span>{n.neighborhood_slug}</span>
                <span className="text-terracotta" dir="ltr">
                  {n.count}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
