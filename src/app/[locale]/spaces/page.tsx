import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock3, Headphones, MapPin, PlugZap } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/container";
import { spaces } from "@/lib/spaces";
import { SpacesDirectory } from "./spaces-directory";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("spacesPage.meta");
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function SpacesPage() {
  const t = await getTranslations("spacesPage");
  const openSpaces = spaces.filter((space) => space.status !== "closed");
  const neighborhoods = new Set(spaces.map((space) => space.neighborhood)).size;

  return (
    <div className="overflow-hidden">
      <section className="border-b border-black/10 bg-[#fbfaf8] py-12 dark:border-white/10 dark:bg-[#14110f] lg:py-16">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-end">
            <div>
              <p className="eyebrow">{t("hero.eyebrow")}</p>
              <h1 className="mt-4 max-w-3xl font-display text-5xl font-extrabold leading-[0.98] text-neutral-950 sm:text-[4.5rem] dark:text-[#f2f3f4]">
                {t("hero.title")}
              </h1>
              <p className="mt-5 max-w-2xl text-body-lg leading-8 text-[#5d6d7e] dark:text-[#b7aaa0]">
                {t("hero.body")}
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#space-finder"
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-neutral-950 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-neutral-800 dark:bg-[#f2f3f4] dark:text-[#14110f] dark:hover:bg-[#d8d0c8]"
                >
                  {t("hero.openFinder")}
                  <ArrowRight className="h-4 w-4" />
                </a>
                <Link
                  href="/tools/first-week-planner"
                  className="inline-flex items-center justify-center gap-2 rounded-md border border-black/15 px-5 py-3 text-sm font-semibold text-neutral-950 transition-colors hover:border-primary-500/40 hover:bg-white/60 dark:border-white/20 dark:text-[#f2f3f4] dark:hover:bg-white/10"
                >
                  {t("hero.planWeekOne")}
                </Link>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <HeroSignal
                icon={PlugZap}
                label={t("hero.signals.workReady.label")}
                value={t("hero.signals.workReady.value", {
                  count: openSpaces.length,
                })}
                detail={t("hero.signals.workReady.detail")}
              />
              <HeroSignal
                icon={MapPin}
                label={t("hero.signals.coverage.label")}
                value={t("hero.signals.coverage.value", {
                  count: neighborhoods,
                })}
                detail={t("hero.signals.coverage.detail")}
              />
              <HeroSignal
                icon={Headphones}
                label={t("hero.signals.decisionLabels.label")}
                value={t("hero.signals.decisionLabels.value")}
                detail={t("hero.signals.decisionLabels.detail")}
              />
              <HeroSignal
                icon={Clock3}
                label={t("hero.signals.realityCheck.label")}
                value={t("hero.signals.realityCheck.value")}
                detail={t("hero.signals.realityCheck.detail")}
              />
            </div>
          </div>
        </Container>
      </section>

      <section id="space-finder" className="py-12 lg:py-16">
        <Container>
          <SpacesDirectory spaces={spaces} />
        </Container>
      </section>
    </div>
  );
}

function HeroSignal({
  icon: Icon,
  label,
  value,
  detail,
}: {
  icon: typeof PlugZap;
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-md border border-black/10 bg-white/70 p-4 dark:border-white/10 dark:bg-white/[0.04]">
      <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-neutral-500 dark:text-[#94877d]">
        <Icon className="h-4 w-4 text-primary-600 dark:text-primary-300" />
        {label}
      </div>
      <p className="mt-3 font-display text-2xl font-extrabold text-neutral-950 dark:text-[#f2f3f4]">
        {value}
      </p>
      <p className="mt-2 text-sm leading-6 text-[#5d6d7e] dark:text-[#b7aaa0]">
        {detail}
      </p>
    </div>
  );
}
