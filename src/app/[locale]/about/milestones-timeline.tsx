"use client";

import { MapPin, Lightbulb, Globe, Users, type LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

interface MilestoneMeta {
  id: "decided" | "idea" | "launched" | "firstMeetup";
  icon: LucideIcon;
  upcoming?: boolean;
}

const milestones: MilestoneMeta[] = [
  { id: "decided", icon: MapPin },
  { id: "idea", icon: Lightbulb },
  { id: "launched", icon: Globe },
  { id: "firstMeetup", icon: Users, upcoming: true },
];

export function MilestonesTimeline() {
  const t = useTranslations("about.milestones");
  const tItems = useTranslations("about.milestones.items");

  return (
    <div className="relative mx-auto max-w-2xl">
      <div
        aria-hidden="true"
        className="absolute left-[27px] top-4 bottom-4 w-px bg-gradient-to-b from-primary-500 via-primary-500/60 to-primary-500/10 sm:left-8"
      />

      <ol className="space-y-8 sm:space-y-10">
        {milestones.map((m, idx) => {
          const Icon = m.icon;
          const delay = Math.min(idx, 4) as 0 | 1 | 2 | 3 | 4;
          return (
            <li key={m.id}>
              <Reveal delay={delay}>
                <div className="flex gap-5 sm:gap-6">
                  <div className="relative flex-shrink-0">
                    <div
                      className={cn(
                        "relative flex h-14 w-14 items-center justify-center rounded-2xl ring-4 transition-transform hover:scale-105 sm:h-16 sm:w-16",
                        m.upcoming
                          ? "bg-white/60 text-primary-600 ring-primary-200/50 dark:bg-white/5 dark:text-primary-400 dark:ring-primary-900/30"
                          : "bg-primary-500 text-white ring-primary-100 shadow-lg shadow-primary-500/20 dark:ring-primary-950/50",
                      )}
                    >
                      {m.upcoming && (
                        <span
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-0 rounded-2xl bg-primary-500/25"
                          style={{
                            animation:
                              "milestone-pulse 3.2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                          }}
                        />
                      )}
                      <Icon className="relative h-6 w-6 sm:h-7 sm:w-7" />
                    </div>
                  </div>

                  <div
                    className={cn(
                      "min-w-0 flex-1 rounded-2xl border p-5 transition-colors sm:p-6",
                      m.upcoming
                        ? "border-dashed border-primary-300/50 bg-primary-50/30 dark:border-primary-700/40 dark:bg-primary-950/10"
                        : "border-black/5 bg-white/70 dark:border-white/10 dark:bg-white/5",
                    )}
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center rounded-full bg-primary-500/10 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-primary-700 dark:bg-primary-400/10 dark:text-primary-200">
                        {tItems(`${m.id}.date`)}
                      </span>
                      {m.upcoming && (
                        <span className="inline-flex items-center rounded-full border border-primary-300/40 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-primary-600 dark:border-primary-700/40 dark:text-primary-400">
                          {t("comingUp")}
                        </span>
                      )}
                    </div>
                    <h3 className="mt-2 text-lg font-semibold text-[#1a1a2e] dark:text-[#f2f3f4] sm:text-xl">
                      {tItems(`${m.id}.title`)}
                    </h3>
                    <p className="mt-1.5 text-sm leading-6 text-[#5d6d7e] dark:text-[#99a3ad]">
                      {tItems(`${m.id}.description`)}
                    </p>
                  </div>
                </div>
              </Reveal>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
