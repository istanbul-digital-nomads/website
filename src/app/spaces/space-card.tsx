"use client";

import { useState, useRef, useEffect } from "react";
import {
  ChevronDown,
  ChevronUp,
  MapPin,
  Clock,
  Wifi,
  Globe,
  ShieldCheck,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { NomadScoreBadge } from "./nomad-score-badge";
import { ScoreBreakdown } from "./score-breakdown";
import type { NomadSpace } from "@/lib/spaces";

export function SpaceCard({
  space,
  isSelected,
  onSelect,
}: {
  space: NomadSpace;
  isSelected: boolean;
  onSelect: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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
                    {space.type === "coworking" ? "Coworking" : "Cafe"}
                  </Badge>
                </div>
                <div className="mt-1 flex items-center gap-1 text-xs text-neutral-500 dark:text-[#85929e]">
                  <MapPin className="h-3 w-3" />
                  {space.neighborhood}
                </div>
              </div>
              <NomadScoreBadge scores={space.nomad_score} size="md" />
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

            {/* Description */}
            <p className="mt-3 text-sm leading-6 text-neutral-600 dark:text-[#99a3ad]">
              {expanded
                ? space.description
                : space.description.slice(0, 100) + "..."}
            </p>

            {/* Expanded content */}
            {expanded && (
              <div className="mt-4 space-y-4 border-t border-black/5 pt-4 dark:border-white/10">
                <ScoreBreakdown scores={space.nomad_score} />

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
                    Visit website
                  </a>
                )}

                {space.sources && space.sources.length > 0 && (
                  <div className="space-y-2 rounded-lg bg-black/[0.02] p-3 dark:bg-white/[0.03]">
                    <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-neutral-700 dark:text-[#99a3ad]">
                      <ShieldCheck className="h-3.5 w-3.5 text-primary-500" />
                      Sources
                      {space.last_verified && (
                        <span className="ml-1 font-normal normal-case text-neutral-500 dark:text-[#85929e]">
                          (verified {space.last_verified})
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
                  Show less <ChevronUp className="h-3 w-3" />
                </>
              ) : (
                <>
                  Score breakdown <ChevronDown className="h-3 w-3" />
                </>
              )}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
