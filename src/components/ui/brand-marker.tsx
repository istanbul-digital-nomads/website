"use client";

import { Marker } from "react-map-gl/maplibre";
import { cn } from "@/lib/utils";
import type { BrandLocation, NomadBrand } from "@/lib/brands";

// Reusable brand marker - a coloured pin tinted with the brand colour and
// stamped with the brand icon. Shared between the neighborhood overview map
// and the plan editor so the styling stays consistent. Matches the existing
// neighborhood/space marker look (ring + scale-on-hover).

interface BrandMarkerProps {
  brand: NomadBrand;
  location: BrandLocation;
  /** When true, marker is interactive (cursor + hover scale + tab order). */
  interactive?: boolean;
  selected?: boolean;
  onSelect?: (location: BrandLocation, brand: NomadBrand) => void;
}

export function BrandMarker({
  brand,
  location,
  interactive = false,
  selected = false,
  onSelect,
}: BrandMarkerProps) {
  return (
    <Marker
      longitude={location.coordinates[0]}
      latitude={location.coordinates[1]}
      anchor="center"
      onClick={(e) => {
        if (!onSelect) return;
        e.originalEvent.stopPropagation();
        onSelect(location, brand);
      }}
    >
      <button
        type="button"
        aria-label={`${location.name} (${brand.name})`}
        tabIndex={interactive ? 0 : -1}
        onClick={() => onSelect?.(location, brand)}
        className={cn(
          "flex h-6 w-6 items-center justify-center rounded-full text-[11px] leading-none ring-2 ring-white/90 transition-transform dark:ring-[#1a1612]/80 focus-visible:outline-none focus-visible:ring-terracotta",
          interactive ? "cursor-pointer hover:scale-125" : "cursor-default",
          selected && "scale-125",
        )}
        style={{ backgroundColor: brand.color }}
      >
        <span aria-hidden>{brand.icon}</span>
      </button>
    </Marker>
  );
}
