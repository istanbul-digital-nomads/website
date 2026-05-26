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
          "flex items-center justify-center rounded-full bg-white px-2 py-1 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta",
          interactive ? "cursor-pointer hover:scale-110" : "cursor-default",
          selected && "scale-110",
        )}
        // Brand-colour ring hugged by a soft white halo so it reads on the dark map.
        style={{
          boxShadow: `0 0 0 2px ${brand.color}, 0 0 0 4px rgba(255,255,255,0.92)`,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={brand.logo} alt="" aria-hidden className="h-4 w-auto" />
      </button>
    </Marker>
  );
}
