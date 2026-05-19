"use client";

import { useState, useRef, useEffect } from "react";
import {
  ChevronDown,
  ChevronUp,
  Clock,
  ExternalLink,
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

const labelKeys: Record<string, string> = {
  "Good for calls": "goodForCalls",
  "Laptop-safe": "laptopSafe",
  "Strong sockets": "strongSockets",
  "Rain-safe": "rainSafe",
  "Open late": "openLate",
  "Budget-aware": "budgetAware",
  "Social enough": "socialEnough",
  "Bring headphones": "bringHeadphones",
  "Best before lunch": "bestBeforeLunch",
};

const reasonKeys: Record<string, string> = {
  "safer for calls": "saferForCalls",
  "quiet profile": "quietProfile",
  "rain-safe setup": "rainSafeSetup",
  "late option": "lateOption",
  "budget-aware": "budgetAware",
  "easy first try": "easyFirstTry",
  "socket confidence": "socketConfidence",
  "coworking baseline": "coworkingBaseline",
  "worth comparing": "worthComparing",
};

const cautionKeys: Record<string, string> = {
  "Wifi speed still needs a live check.": "wifiLiveCheck",
  "Noise can be part of the deal here.": "noise",
  "Try it earlier before seating gets tight.": "earlySeating",
};

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

  const labelForSignal = (label: string) => {
    const key = labelKeys[label];
    return key ? t(`labels.${key}`) : label;
  };

  const reasonForSignal = (reason: string) => {
    const score = reason.match(/^([\d.]+) Nomad Score$/);
    if (score) return t("reasons.nomadScore", { score: score[1] });
    const key = reasonKeys[reason];
    return key ? t(`reasons.${key}`) : reason;
  };

  const caution = signals.caution
    ? t(`cautions.${cautionKeys[signals.caution] ?? "generic"}`)
    : null;

  return (
    <div ref={ref} className="h-full">
      <Card
        hoverable
        className={cn(
          "group h-full cursor-pointer overflow-hidden p-0 transition-all",
          isSelected &&
            "border-primary-500/55 ring-2 ring-primary-500/20 dark:border-primary-400/50 dark:ring-primary-400/20",
        )}
        onClick={() => onSelect(space.id)}
      >
        <CardContent className="h-full p-0">
          <article className="flex h-full min-h-[21rem] flex-col p-5">
            {/* Header row */}
            <div className="flex items-start justify-between gap-4 border-b border-black/5 pb-4 dark:border-white/5">
              <NomadScoreBadge
                scores={space.nomad_score}
                size="md"
                className="shrink-0"
                unverifiedLabel={t("score.unverified")}
                partialLabel={t("score.partial")}
                scoreLabel={t("score.nomad")}
              />
              <div className="min-w-0 flex-1 text-end">
                <div className="flex flex-wrap items-center justify-end gap-2">
                  <Badge
                    variant={
                      space.type === "coworking" ? "coworking" : "workshop"
                    }
                  >
                    {space.type === "coworking" ? t("coworking") : t("cafe")}
                  </Badge>
                  <h3
                    className="min-w-0 text-balance text-lg font-semibold leading-tight text-neutral-900 dark:text-[#f2f3f4]"
                    dir="auto"
                  >
                    {space.name}
                  </h3>
                </div>
                <div className="mt-2 flex items-center justify-end gap-1.5 text-xs text-neutral-500 dark:text-[#85929e]">
                  <span>{space.neighborhood}</span>
                  <MapPin className="h-3 w-3" />
                </div>
              </div>
            </div>

            <div className="mt-4 flex min-h-[4.25rem] flex-wrap content-start gap-1.5">
              {signals.labels.slice(0, 4).map((label) => (
                <span
                  key={label}
                  className={cn(
                    "rounded-sm px-2 py-1 text-xs font-medium",
                    label === "Bring headphones" ||
                      label === "Best before lunch"
                      ? "bg-amber-50 text-amber-800 dark:bg-amber-950/30 dark:text-amber-100"
                      : "bg-primary-50 text-primary-800 dark:bg-primary-950/30 dark:text-primary-200",
                  )}
                >
                  {labelForSignal(label)}
                </span>
              ))}
            </div>

            {/* Quick info - LTR-isolated to keep numbers, times, and price
                ranges readable inside RTL locales. */}
            <div className="mt-4 grid min-h-[3rem] gap-2 text-xs text-neutral-600 dark:text-[#99a3ad] sm:grid-cols-3">
              {space.wifi_speed && (
                <span className="flex min-w-0 items-center justify-between gap-2 rounded-sm bg-black/[0.025] px-2.5 py-2 dark:bg-white/[0.04]">
                  <Wifi className="h-3.5 w-3.5 text-primary-600 dark:text-primary-300" />
                  <bdi className="truncate">{space.wifi_speed}</bdi>
                </span>
              )}
              {space.hours && (
                <span className="flex min-w-0 items-center justify-between gap-2 rounded-sm bg-black/[0.025] px-2.5 py-2 dark:bg-white/[0.04]">
                  <Clock className="h-3.5 w-3.5 text-primary-600 dark:text-primary-300" />
                  <bdi className="truncate">{space.hours}</bdi>
                </span>
              )}
              {space.price_range && (
                <span className="flex items-center justify-end rounded-sm bg-black/[0.025] px-2.5 py-2 font-medium dark:bg-white/[0.04]">
                  <bdi>{space.price_range}</bdi>
                </span>
              )}
            </div>

            <p className="mt-4 min-h-10 text-xs font-medium leading-5 text-neutral-500 dark:text-[#94877d]">
              {matchReasons.map(reasonForSignal).join(" / ")}
            </p>

            {/* Description */}
            <p className="mt-3 line-clamp-3 flex-1 text-sm leading-7 text-neutral-600 dark:text-[#b7aaa0]">
              {expanded ? description : description.slice(0, 100) + "..."}
            </p>

            {/* Expanded content */}
            {expanded && (
              <div className="mt-4 space-y-4 border-t border-black/5 pt-4 dark:border-white/10">
                <ScoreBreakdown scores={space.nomad_score} />

                {caution ? (
                  <div className="rounded-md border border-amber-500/20 bg-amber-50 p-3 text-xs leading-5 text-amber-900 dark:border-amber-300/20 dark:bg-amber-950/25 dark:text-amber-100">
                    {caution}
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
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Globe className="h-3.5 w-3.5" />
                    {t("visitWebsite")}
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}

                {space.sources && space.sources.length > 0 && (
                  <div className="space-y-2 rounded-lg bg-black/[0.02] p-3 dark:bg-white/[0.03]">
                    <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-neutral-700 dark:text-[#99a3ad]">
                      <ShieldCheck className="h-3.5 w-3.5 text-primary-500" />
                      {t("sources")}
                      {space.last_verified && (
                        <span className="ms-1 font-normal normal-case text-neutral-500 dark:text-[#85929e]">
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
              className="mt-4 inline-flex items-center gap-1.5 self-start rounded-sm border-t border-black/5 pt-3 text-xs font-medium text-primary-600 transition-colors hover:text-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-white/5 dark:text-primary-400 dark:hover:text-primary-300 dark:focus-visible:ring-offset-[#1a1612]"
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
          </article>
        </CardContent>
      </Card>
    </div>
  );
}
