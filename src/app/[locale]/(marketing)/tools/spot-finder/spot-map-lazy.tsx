"use client";

import dynamic from "next/dynamic";

// Defers maplibre-gl + react-map-gl (~1 MB) until a location is detected and a
// pin needs to render, keeping it off the tool's initial bundle.
const SpotMap = dynamic(() => import("./spot-map").then((m) => m.SpotMap), {
  ssr: false,
  loading: () => (
    <div className="h-[280px] w-full animate-pulse rounded-lg border border-ink-3 bg-ink-2/40 motion-reduce:animate-none sm:h-[340px]" />
  ),
});

export { SpotMap };
