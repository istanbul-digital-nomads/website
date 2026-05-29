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
              "flex items-center gap-1.5 rounded-full border bg-white px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta",
              isOn
                ? "text-neutral-900"
                : "border-black/10 text-neutral-500 opacity-70 hover:opacity-100",
            )}
            style={
              isOn ? { borderColor: brand.color, borderWidth: 2 } : undefined
            }
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={brand.logo} alt="" aria-hidden className="h-3.5 w-auto" />
            {brand.name}
          </button>
        );
      })}
    </div>
  );
}
