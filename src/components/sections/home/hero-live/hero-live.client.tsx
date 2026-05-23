"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { HeroErrorBoundary } from "./hero-error-boundary";
import { HeroFrame } from "./hero-frame";
import { TourCallout } from "./tour-callout";
import "./hero-live.css";

// The cinematic hero is a full MapLibre WebGL map (raster tiles + markers + an
// animation loop). On a throttled mobile CPU that single component dominated
// Total Blocking Time (~13.8s mobile TBT / 14.3s Speed Index in PSI). We only
// run it where it earns its weight: desktop viewports with motion allowed.
// Everywhere else (mobile, prefers-reduced-motion) the hero is the static
// deep-water frame, and the ~1 MB maplibre chunk is never downloaded thanks to
// the dynamic import below.
const HeroCinematic = dynamic(
  () => import("./hero-cinematic").then((m) => m.HeroCinematic),
  { ssr: false },
);

type Props = { locale: string };

export function HeroLiveClient({ locale }: Props) {
  const [stopIdx, setStopIdx] = useState(0);
  const [cinematic, setCinematic] = useState(false);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 768px)").matches;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (!desktop || reduced) return; // static hero on mobile / reduced-motion
    // Defer the heavy MapLibre tree one tick so React settles any leftover
    // state from a previous client-side navigation (the rapid /about <-> /
    // case where the old WebGL canvas teardown raced the new mount).
    const id = window.setTimeout(() => setCinematic(true), 0);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <section
      className="relative w-full overflow-hidden bg-deep-water text-cream"
      style={{ height: "100vh", minHeight: 640 }}
    >
      {cinematic && (
        <HeroErrorBoundary
          resetKey="cinematic"
          fallback={<div className="absolute inset-0 bg-deep-water" />}
        >
          <HeroCinematic onStopChange={setStopIdx} />
        </HeroErrorBoundary>
      )}
      <HeroFrame locale={locale} />
      {cinematic && <TourCallout stopIdx={stopIdx} />}
    </section>
  );
}
