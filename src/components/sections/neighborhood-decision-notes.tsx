import { AlertTriangle, CheckCircle2, MoveUpRight } from "lucide-react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import {
  avoidFirstBaseAreas,
  conditionalNeighborhoodAreas,
} from "@/lib/neighborhood-decision";

export async function NeighborhoodDecisionNotes() {
  const t = await getTranslations("neighborhoodGuidePage.decisionNotes");
  const tConditional = await getTranslations(
    "neighborhoodGuidePage.conditionalAreas",
  );
  const tAvoid = await getTranslations("neighborhoodGuidePage.avoidAreas");

  return (
    <section className="border-y border-black/10 bg-[#fbfaf8] py-16 dark:border-white/10 dark:bg-[#14110f]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr]">
          <div>
            <p className="eyebrow">{t("eyebrow")}</p>
            <h2 className="mt-4 max-w-lg font-display text-h1 text-neutral-950 dark:text-[#f2f3f4]">
              {t("title")}
            </h2>
            <p className="mt-5 max-w-lg text-body-lg leading-8 text-[#5d6d7e] dark:text-[#b7aaa0]">
              {t("intro")}
            </p>
            <Link
              href="/blog/first-week-mistakes"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary-700 transition-colors hover:text-primary-900 dark:text-primary-300 dark:hover:text-primary-100"
            >
              {t("readFirstWeekMistakes")}
              <MoveUpRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-5 xl:grid-cols-2">
            <div className="rounded-md border border-black/10 bg-white/65 p-5 dark:border-white/10 dark:bg-white/5">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-accent-green" />
                <h3 className="font-display text-2xl font-extrabold text-neutral-950 dark:text-[#f2f3f4]">
                  {t("considerIf")}
                </h3>
              </div>
              <div className="mt-5 space-y-3">
                {conditionalNeighborhoodAreas.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-md border border-black/5 bg-white/70 p-4 dark:border-white/10 dark:bg-[#14110f]/50"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <p className="font-semibold text-neutral-950 dark:text-[#f2f3f4]">
                        {tConditional(`${item.id}.area`)}
                      </p>
                      <span className="rounded-md bg-primary-50 px-2 py-1 text-xs font-medium text-primary-800 dark:bg-primary-950/30 dark:text-primary-200">
                        {tConditional(`${item.id}.verdict`)}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-[#5d6d7e] dark:text-[#b7aaa0]">
                      {tConditional(`${item.id}.bestFor`)}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-neutral-500 dark:text-[#94877d]">
                      {t("tradeoffLabel", {
                        tradeoff: tConditional(`${item.id}.tradeoff`),
                      })}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-md border border-black/10 bg-[#1a1612] p-5 text-white dark:border-white/10">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-accent-warm" />
                <h3 className="font-display text-2xl font-extrabold">
                  {t("avoidAsFirstBase")}
                </h3>
              </div>
              <div className="mt-5 space-y-3">
                {avoidFirstBaseAreas.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-md border border-white/10 bg-white/[0.06] p-4"
                  >
                    <p className="font-semibold">{tAvoid(`${item.id}.area`)}</p>
                    <p className="mt-2 text-sm leading-6 text-white/72">
                      {tAvoid(`${item.id}.why`)}
                    </p>
                    <p className="mt-2 text-xs leading-5 text-white/50">
                      {t("exceptionLabel", {
                        exception: tAvoid(`${item.id}.exception`),
                      })}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
