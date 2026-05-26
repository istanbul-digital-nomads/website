"use client";

import dynamic from "next/dynamic";
import { useCallback, useState } from "react";
import { brands } from "@/lib/brands";
import { mapNeighborhoods } from "@/lib/map-neighborhoods";
import { BrandFilterBar } from "@/components/ui/brand-filter-bar";
import { NeighborhoodFilter } from "@/components/ui/neighborhood-filter";

// The /map experience: filter controls live ABOVE the map (not as an on-canvas
// overlay), and drive the map through controlled props. The map itself is the
// heavy MapLibre chunk, loaded client-side after first paint.
const IstanbulMap = dynamic(
  () =>
    import("@/components/ui/istanbul-map").then((mod) => ({
      default: mod.IstanbulMap,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 rounded-2xl border border-ink-3 bg-[#1a1612]" />
    ),
  },
);

const toggleIn = (set: Set<string>, slug: string) => {
  const next = new Set(set);
  if (next.has(slug)) next.delete(slug);
  else next.add(slug);
  return next;
};

interface MapExplorerProps {
  labels: { brands: string; neighborhoods: string };
}

export function MapExplorer({ labels }: MapExplorerProps) {
  const [activeBrands, setActiveBrands] = useState<Set<string>>(new Set());
  const [activeHoods, setActiveHoods] = useState<Set<string>>(new Set());

  const toggleBrand = useCallback(
    (slug: string) => setActiveBrands((prev) => toggleIn(prev, slug)),
    [],
  );
  const toggleHood = useCallback(
    (slug: string) => setActiveHoods((prev) => toggleIn(prev, slug)),
    [],
  );

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-4 rounded-2xl border border-ink-3 bg-black/20 p-4 sm:p-5">
        <div className="flex flex-col gap-2">
          <span className="font-mono text-[10px] uppercase tracking-wider text-paper-mute">
            {labels.brands}
          </span>
          <BrandFilterBar
            brands={brands}
            active={activeBrands}
            onToggle={toggleBrand}
          />
        </div>
        <div className="flex flex-col gap-2">
          <span className="font-mono text-[10px] uppercase tracking-wider text-paper-mute">
            {labels.neighborhoods}
          </span>
          <NeighborhoodFilter
            neighborhoods={mapNeighborhoods}
            active={activeHoods}
            onToggle={toggleHood}
          />
        </div>
      </div>

      <div className="relative min-h-[420px] sm:min-h-[520px] lg:min-h-[640px]">
        <IstanbulMap
          activeBrands={activeBrands}
          onToggleBrand={toggleBrand}
          activeNeighborhoods={activeHoods}
          hideOverlayFilter
        />
      </div>
    </div>
  );
}
