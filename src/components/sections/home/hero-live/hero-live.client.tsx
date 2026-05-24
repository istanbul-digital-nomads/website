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

    // Mount the heavy MapLibre tree on the first real engagement signal
    // (pointer move/down, wheel, scroll, key, touch) rather than on load.
    // The WebGL init + tile render is the dominant main-thread cost on the
    // homepage; running it during load is what kept Lighthouse's blocking
    // time high. Gating it on interaction means the page reaches an
    // interactive, settled state first, then the cinematic map fades in the
    // instant the visitor moves - which on a desktop hero is effectively
    // immediate. The headline and CTAs render regardless. A generous fallback
    // still mounts it for the rare visitor who never interacts.
    let done = false;
    const mount = () => {
      if (done) return;
      done = true;
      setCinematic(true);
    };
    const opts: AddEventListenerOptions = { once: true, passive: true };
    const events = [
      "pointermove",
      "pointerdown",
      "wheel",
      "scroll",
      "keydown",
      "touchstart",
    ];
    events.forEach((e) => window.addEventListener(e, mount, opts));
    const fallback = window.setTimeout(mount, 8000);
    return () => {
      events.forEach((e) => window.removeEventListener(e, mount));
      window.clearTimeout(fallback);
    };
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
