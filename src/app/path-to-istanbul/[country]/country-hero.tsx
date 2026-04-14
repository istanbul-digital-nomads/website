import { Calendar } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { Country } from "@/lib/path-to-istanbul";
import type { HeroStat } from "@/lib/path-to-istanbul-content";

interface CountryHeroProps {
  country: Country;
  summary: string;
  stats?: HeroStat[];
  lastUpdated?: string;
}

export function CountryHero({
  country,
  summary,
  stats,
  lastUpdated,
}: CountryHeroProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-primary-200/50 bg-gradient-to-br from-primary-50 via-white to-white p-5 dark:border-primary-900/30 dark:from-primary-950/40 dark:via-[#0f1117] dark:to-[#0f1117] sm:rounded-3xl sm:p-10 sm:py-14">
      <span
        aria-hidden="true"
        className="block text-6xl leading-none sm:inline-block sm:align-middle sm:text-7xl"
      >
        {country.flag}
      </span>
      <div className="mt-4 sm:mt-5">
        <p className="text-xs font-medium uppercase tracking-wider text-primary-600 dark:text-primary-400 sm:text-sm">
          Path to Istanbul
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#1a1a2e] dark:text-[#f2f3f4] sm:text-4xl">
          Moving from {country.name}
        </h1>
      </div>

      <p className="mt-4 max-w-2xl text-sm leading-6 text-[#5d6d7e] dark:text-[#99a3ad] sm:mt-5 sm:text-lg sm:leading-7">
        {summary}
      </p>

      {stats && stats.length > 0 && (
        <div className="mt-6 grid grid-cols-2 gap-2.5 sm:mt-8 sm:gap-3 sm:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-black/5 bg-white/80 p-3 backdrop-blur-sm dark:border-white/10 dark:bg-white/5 sm:p-4"
            >
              <p className="text-[10px] font-medium uppercase tracking-wider text-[#5d6d7e] dark:text-[#99a3ad] sm:text-xs">
                {stat.label}
              </p>
              <p className="mt-1 text-sm font-semibold leading-tight text-[#1a1a2e] dark:text-[#f2f3f4] sm:text-lg">
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      )}

      {lastUpdated && (
        <div className="mt-5 flex items-center gap-2 text-xs text-[#5d6d7e] dark:text-[#99a3ad] sm:mt-6">
          <Calendar className="h-3.5 w-3.5" />
          Last updated {formatDate(lastUpdated)}
        </div>
      )}
    </div>
  );
}
