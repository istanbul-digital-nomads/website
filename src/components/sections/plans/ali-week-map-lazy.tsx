"use client";

import dynamic from "next/dynamic";

// The animated week viewer pulls in maplibre-gl + react-map-gl. Defer it from
// the server-rendered page via this client wrapper so the page shell paints
// without waiting on the map bundle.
const AliWeekMap = dynamic(
  () => import("./ali-week-map").then((m) => m.AliWeekMap),
  {
    ssr: false,
    loading: () => (
      <div className="h-[60vh] min-h-[440px] animate-pulse rounded-2xl border border-ink-3 bg-black/20 lg:h-[640px]" />
    ),
  },
);

export function AliWeekMapLazy() {
  return <AliWeekMap />;
}
