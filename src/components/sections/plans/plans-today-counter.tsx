import { getPlansTodayCount } from "@/lib/plans/queries";
import { getTranslations } from "next-intl/server";

export async function PlansTodayCounter() {
  const t = await getTranslations("plans.counter");
  const { count, byNeighborhood } = await getPlansTodayCount();
  const hoodCount = byNeighborhood.length;

  return (
    <div
      className="rounded-xl border bg-deep-water/40 p-6 backdrop-blur-sm md:p-7"
      style={{ borderColor: "rgba(244,184,96,0.22)" }}
    >
      <div className="flex items-baseline justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gold/55">
            {t("eyebrow")}
          </p>
          <p
            className="mt-3 font-editorial leading-none text-gold"
            style={{ fontSize: "clamp(3.5rem, 7vw, 5rem)" }}
          >
            <span className="tabular-nums" dir="ltr">
              {count}
            </span>
          </p>
          <p className="mt-2 text-sm text-cream/70">
            {t("activeAcross", { hoods: hoodCount })}
          </p>
        </div>
      </div>

      {byNeighborhood.length > 0 && (
        <ul className="mt-5 flex flex-wrap gap-1.5">
          {byNeighborhood.slice(0, 8).map((n) => (
            <li
              key={n.neighborhood_slug}
              className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-wide text-cream/70"
              style={{
                borderColor: "rgba(244, 184, 96, 0.18)",
                background: "rgba(244, 184, 96, 0.05)",
              }}
            >
              <span>{n.neighborhood_slug}</span>
              <span className="text-gold" dir="ltr">
                {n.count}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
