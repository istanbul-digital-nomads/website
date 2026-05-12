"use client";

import { useState, useRef, useEffect } from "react";
import {
  ChevronDown,
  ChevronUp,
  Clock,
  Globe,
  MapPin,
  ShieldCheck,
  Wifi,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { NomadScoreBadge } from "./nomad-score-badge";
import { ScoreBreakdown } from "./score-breakdown";
import type { NomadSpace } from "@/lib/spaces";
import type { SpaceSignals } from "@/lib/spaces-finder";

export function SpaceCard({
  space,
  signals,
  matchReasons,
  isSelected,
  onSelect,
}: {
  space: NomadSpace;
  signals: SpaceSignals;
  matchReasons: string[];
  isSelected: boolean;
  onSelect: (id: string) => void;
}) {
  const t = useTranslations("spacesPage.card");
  const tSpaces = useTranslations("spacesList");
  const [expanded, setExpanded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Prefer the localized description; fall back to the English prose in the
  // data file if a translation key is missing so the UI degrades gracefully.
  const description = tSpaces.has(`${space.id}.description`)
    ? tSpaces(`${space.id}.description`)
    : space.description;

  useEffect(() => {
    if (isSelected && ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [isSelected]);

  return (
    <div ref={ref}>
      <Card
        hoverable
        className={cn(
          "cursor-pointer transition-all",
          isSelected && "ring-2 ring-primary-500/50 dark:ring-primary-400/50",
        )}
        onClick={() => onSelect(space.id)}
      >
        <CardContent className="p-0">
          <div className="p-5">
            {/* Header row */}
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-semibold text-neutral-900 dark:text-[#f2f3f4]">
                    {space.name}
                  </h3>
                  <Badge
                    variant={
                      space.type === "coworking" ? "coworking" : "workshop"
                    }
                  >
                    {space.type === "coworking" ? t("coworking") : t("cafe")}
                  </Badge>
                </div>
                <div className="mt-1 flex items-center gap-1 text-xs text-neutral-500 dark:text-[#85929e]">
                  <MapPin className="h-3 w-3" />
                  {space.neighborhood}
                </div>
              </div>
              <NomadScoreBadge scores={space.nomad_score} size="md" />
            </div>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {signals.labels.slice(0, 4).map((label) => (
                <span
                  key={label}
                  className={cn(
                    "rounded-md px-2 py-1 text-xs font-medium",
                    label === "Bring headphones" ||
                      label === "Best before lunch"
                      ? "bg-amber-50 text-amber-800 dark:bg-amber-950/30 dark:text-amber-100"
                      : "bg-primary-50 text-primary-800 dark:bg-primary-950/30 dark:text-primary-200",
                  )}
                >
                  {label}
                </span>
              ))}
            </div>

            {/* Quick info */}
            <div className="mt-3 flex flex-wrap gap-3 text-xs text-neutral-600 dark:text-[#99a3ad]">
              {space.wifi_speed && (
                <span className="flex items-center gap-1">
                  <Wifi className="h-3 w-3" />
                  {space.wifi_speed}
                </span>
              )}
              {space.hours && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {space.hours}
                </span>
              )}
              {space.price_range && (
                <span className="font-medium">{space.price_range}</span>
              )}
            </div>

            <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-500 dark:text-[#85929e]">
              {matchReasons.join(" / ")}
            </p>

            {/* Description */}
            <p className="mt-3 text-sm leading-6 text-neutral-600 dark:text-[#99a3ad]">
              {expanded ? description : description.slice(0, 100) + "..."}
            </p>

            {/* Expanded content */}
            {expanded && (
              <div className="mt-4 space-y-4 border-t border-black/5 pt-4 dark:border-white/10">
                <ScoreBreakdown scores={space.nomad_score} />

                {signals.caution ? (
                  <div className="rounded-md border border-amber-500/20 bg-amber-50 p-3 text-xs leading-5 text-amber-900 dark:border-amber-300/20 dark:bg-amber-950/25 dark:text-amber-100">
                    {signals.caution}
                  </div>
                ) : null}

                {space.amenities && space.amenities.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {space.amenities.map((a) => (
                      <span
                        key={a}
                        className="rounded-full bg-black/5 px-2.5 py-1 text-xs text-neutral-600 dark:bg-white/5 dark:text-[#99a3ad]"
                      >
                        {a}
                      </span>
                    ))}
                  </div>
                )}

                {space.website && (
                  <a
                    href={space.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Globe className="h-3.5 w-3.5" />
                    {t("visitWebsite")}
                  </a>
                )}

                {space.sources && space.sources.length > 0 && (
                  <div className="space-y-2 rounded-lg bg-black/[0.02] p-3 dark:bg-white/[0.03]">
                    <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-neutral-700 dark:text-[#99a3ad]">
                      <ShieldCheck className="h-3.5 w-3.5 text-primary-500" />
                      {t("sources")}
                      {space.last_verified && (
                        <span className="ml-1 font-normal normal-case text-neutral-500 dark:text-[#85929e]">
                          {t("verified", { date: space.last_verified })}
                        </span>
                      )}
                    </div>
                    <ul className="flex flex-wrap gap-x-3 gap-y-1.5 text-xs">
                      {space.sources.map((s) => (
                        <li key={s.url}>
                          <a
                            href={s.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary-600 underline decoration-primary-300 underline-offset-2 hover:text-primary-700 dark:text-primary-400 dark:decoration-primary-700 dark:hover:text-primary-300"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {s.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Toggle */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setExpanded(!expanded);
              }}
              className="mt-2 flex items-center gap-1 text-xs font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
            >
              {expanded ? (
                <>
                  {t("showLess")} <ChevronUp className="h-3 w-3" />
                </>
              ) : (
                <>
                  {t("scoreBreakdown")} <ChevronDown className="h-3 w-3" />
                </>
              )}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
