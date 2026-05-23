"use client";

import dynamic from "next/dynamic";
import type { PlanStop } from "@/lib/plans/queries";

// The plan-detail map pulls in maplibre-gl + react-map-gl (~1 MB). Loading it
// eagerly put that bundle on every plan page's critical path. This client
// wrapper defers it: the map (which can only render client-side anyway) loads
// after hydration via a dynamic import, so the plan header is interactive
// without waiting on the map bundle. `loading: null` keeps current behavior -
// the map already returns null until it resolves stop coordinates, so there's
// no skeleton to shift the layout.
const PlanDetailMap = dynamic(
  () => import("./plan-detail-map").then((m) => m.PlanDetailMap),
  { ssr: false, loading: () => null },
);

export function PlanDetailMapLazy({ stops }: { stops: PlanStop[] }) {
  return <PlanDetailMap stops={stops} />;
}
