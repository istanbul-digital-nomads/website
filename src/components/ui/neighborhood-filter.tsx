"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { MapNeighborhood } from "@/lib/map-neighborhoods";

// How many chips to show per side before the "show more" cut. The curated
// nomad spots come first in the list, so the relevant ones stay visible and
// the long district tail folds away.
const COLLAPSED_PER_SIDE = 10;

// Reusable neighborhood filter - chips grouped by side. Toggling a chip
// highlights that neighborhood's real OSM border on the map (the same `active`
// set drives the border highlight layer in istanbul-map). Each side collapses
// to a short list with a show-more toggle so the full 50-area list stays tidy.

interface NeighborhoodFilterProps {
  neighborhoods: MapNeighborhood[];
  active: Set<string>;
  onToggle: (slug: string) => void;
  labels: { showMore: string; showLess: string };
  className?: string;
}

export function NeighborhoodFilter({
  neighborhoods,
  active,
  onToggle,
  labels,
  className,
}: NeighborhoodFilterProps) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const groups: Array<{
    side: "European" | "Asian";
    items: MapNeighborhood[];
  }> = [
    {
      side: "European",
      items: neighborhoods.filter((n) => n.side === "European"),
    },
    { side: "Asian", items: neighborhoods.filter((n) => n.side === "Asian") },
  ];

  const toggleSide = (side: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(side)) next.delete(side);
      else next.add(side);
      return next;
    });

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {groups.map((group) => {
        const isExpanded = expanded.has(group.side);
        const visible = isExpanded
          ? group.items
          : group.items.slice(0, COLLAPSED_PER_SIDE);
        const hiddenCount = group.items.length - visible.length;
        return (
          <div key={group.side} className="flex flex-wrap items-center gap-2">
            <span className="mr-1 font-mono text-[10px] uppercase tracking-wider text-paper-mute">
              {group.side}
            </span>
            {visible.map((n) => {
              const isOn = active.has(n.slug);
              return (
                <button
                  key={n.slug}
                  type="button"
                  aria-pressed={isOn}
                  onClick={() => onToggle(n.slug)}
                  title={n.vibe}
                  className={cn(
                    "rounded-full border px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold",
                    isOn
                      ? "border-gold bg-gold/15 text-paper"
                      : "border-ink-3 text-paper-mute hover:border-paper-mute hover:text-paper-dim",
                  )}
                >
                  {n.name}
                </button>
              );
            })}
            {(hiddenCount > 0 || isExpanded) && (
              <button
                type="button"
                aria-expanded={isExpanded}
                onClick={() => toggleSide(group.side)}
                className="rounded-full px-2 py-1 font-mono text-[11px] uppercase tracking-wider text-gold transition-colors hover:text-gold/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              >
                {isExpanded ? `${labels.showLess} −` : `${labels.showMore} +`}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
