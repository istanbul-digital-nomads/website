"use client";

import { cn } from "@/lib/utils";
import type { NomadBrand } from "@/lib/brands";

// Reusable brand filter - a row of toggle chips, one per brand. Tapping a chip
// shows/hides that brand's markers. Used on the neighborhood overview map; the
// same `active` set drives which BrandMarkers render.

interface BrandFilterBarProps {
  brands: NomadBrand[];
  /** Set of active brand slugs. */
  active: Set<string>;
  onToggle: (slug: string) => void;
  className?: string;
}

export function BrandFilterBar({
  brands,
  active,
  onToggle,
  className,
}: BrandFilterBarProps) {
  if (brands.length === 0) return null;
  return (
    <div
      role="group"
      aria-label="Filter coffee brands"
      className={cn("flex flex-wrap items-center gap-2", className)}
    >
      {brands.map((brand) => {
        const isOn = active.has(brand.slug);
        return (
          <button
            key={brand.slug}
            type="button"
            aria-pressed={isOn}
            onClick={() => onToggle(brand.slug)}
            className={cn(
              "flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta",
              isOn
                ? "border-transparent text-white shadow-sm"
                : "border-black/10 bg-white/80 text-neutral-600 hover:border-black/20 dark:border-white/10 dark:bg-white/5 dark:text-[#99a3ad]",
            )}
            style={isOn ? { backgroundColor: brand.color } : undefined}
          >
            <span aria-hidden>{brand.icon}</span>
            {brand.name}
          </button>
        );
      })}
    </div>
  );
}
