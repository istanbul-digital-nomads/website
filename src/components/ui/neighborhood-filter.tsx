"use client";

import { cn } from "@/lib/utils";
import type { MapNeighborhood } from "@/lib/map-neighborhoods";

// Reusable neighborhood filter - chips grouped by side. Toggling a chip
// highlights that neighborhood's real OSM border on the map (the same `active`
// set drives the border highlight layer in istanbul-map). Lives outside the
// map so the controls aren't cramped over the canvas.

interface NeighborhoodFilterProps {
  neighborhoods: MapNeighborhood[];
  active: Set<string>;
  onToggle: (slug: string) => void;
  className?: string;
}

export function NeighborhoodFilter({
  neighborhoods,
  active,
  onToggle,
  className,
}: NeighborhoodFilterProps) {
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

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {groups.map((group) => (
        <div key={group.side} className="flex flex-wrap items-center gap-2">
          <span className="mr-1 font-mono text-[10px] uppercase tracking-wider text-paper-mute">
            {group.side}
          </span>
          {group.items.map((n) => {
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
        </div>
      ))}
    </div>
  );
}
