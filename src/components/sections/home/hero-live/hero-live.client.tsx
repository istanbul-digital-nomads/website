"use client";

import { useEffect, useState } from "react";
import { HeroCinematic } from "./hero-cinematic";
import { HeroErrorBoundary } from "./hero-error-boundary";
import { HeroFrame } from "./hero-frame";
import { TourCallout } from "./tour-callout";
import "./hero-live.css";

type Props = { locale: string };

export function HeroLiveClient({ locale }: Props) {
  const [stopIdx, setStopIdx] = useState(0);
  // Defer mounting the heavy MapLibre tree one tick so React has time to
  // settle any leftover state from a previous client-side navigation
  // (the rapid /about <-> / case where the WebGL canvas teardown of the
  // previous Map raced the new mount and tripped react-map-gl).
  const [mountKey, setMountKey] = useState(0);
  useEffect(() => {
    const id = window.setTimeout(() => setMountKey((k) => k + 1), 0);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <section
      className="relative w-full overflow-hidden bg-deep-water text-cream"
      style={{ height: "100vh", minHeight: 640 }}
    >
      <HeroErrorBoundary
        resetKey={String(mountKey)}
        fallback={<div className="absolute inset-0 bg-deep-water" />}
      >
        {mountKey > 0 && (
          <HeroCinematic key={mountKey} onStopChange={setStopIdx} />
        )}
      </HeroErrorBoundary>
      <HeroFrame locale={locale} />
      <TourCallout stopIdx={stopIdx} />
    </section>
  );
}
