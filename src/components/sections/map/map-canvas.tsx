"use client";

import dynamic from "next/dynamic";

// The interactive Istanbul map (neighborhoods + coffee-brand layer) is the hero
// of the /map page, so we load it client-side on mount rather than gating it
// behind an IntersectionObserver - it's the main content, above the fold.
// MapLibre + style + worker is ~280 KB, so it's still a dynamic (ssr: false)
// import that streams in after first paint with a matching placeholder.
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

export function MapCanvas() {
  return (
    <div className="relative min-h-[420px] sm:min-h-[520px] lg:min-h-[640px]">
      <IstanbulMap />
    </div>
  );
}
