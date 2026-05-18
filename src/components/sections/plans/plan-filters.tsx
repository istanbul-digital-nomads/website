"use client";

import { useRouter, usePathname } from "@/lib/i18n/routing";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { PLAN_VIBES, VIBE_ICONS, type PlanVibe } from "@/lib/plans/vibes";
import type { NeighborhoodSlug } from "@/lib/neighborhoods";

const RANGES = ["today", "tomorrow", "week"] as const;
type Range = (typeof RANGES)[number];

interface Props {
  neighborhoods: ReadonlyArray<{ slug: NeighborhoodSlug; name: string }>;
}

export function PlanFilters({ neighborhoods }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const range = (params.get("range") as Range) || "today";
  const neighborhood = params.get("neighborhood") || "";
  const vibe = params.get("vibe") || "";

  const t = useTranslations("plans");

  function update(key: string, value: string | null) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    router.replace(`${pathname}?${next.toString()}` as never);
  }

  return (
    <div className="space-y-4">
      {/* Range tabs */}
      <div className="flex flex-wrap gap-1.5 border-b border-ink-3 pb-2">
        {RANGES.map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => update("range", r === "today" ? null : r)}
            className={cn(
              "px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-colors",
              r === range
                ? "border border-terracotta bg-terracotta/10 text-paper"
                : "border border-transparent text-paper-mute hover:text-paper",
            )}
          >
            {t(`range.${r}`)}
          </button>
        ))}
      </div>

      {/* Neighborhood chips */}
      <div className="flex flex-wrap gap-1.5">
        <button
          type="button"
          onClick={() => update("neighborhood", null)}
          className={cn(
            "border px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider transition-colors",
            !neighborhood
              ? "border-paper text-paper"
              : "border-ink-4 text-paper-mute hover:border-ink-5",
          )}
        >
          {t("filters.all")}
        </button>
        {neighborhoods.map((n) => (
          <button
            key={n.slug}
            type="button"
            onClick={() =>
              update("neighborhood", n.slug === neighborhood ? null : n.slug)
            }
            className={cn(
              "border px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider transition-colors",
              n.slug === neighborhood
                ? "border-paper bg-paper/5 text-paper"
                : "border-ink-4 text-paper-mute hover:border-ink-5",
            )}
          >
            {n.name}
          </button>
        ))}
      </div>

      {/* Vibe chips */}
      <div className="flex flex-wrap gap-1.5">
        {PLAN_VIBES.map((v) => {
          const Icon = VIBE_ICONS[v as PlanVibe];
          const active = v === vibe;
          return (
            <button
              key={v}
              type="button"
              onClick={() => update("vibe", active ? null : v)}
              className={cn(
                "inline-flex items-center gap-1.5 border px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider transition-colors",
                active
                  ? "border-terracotta bg-terracotta/10 text-paper"
                  : "border-ink-4 text-paper-mute hover:border-ink-5",
              )}
            >
              <Icon className="h-3 w-3" />
              {t(`vibes.${v}`)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
