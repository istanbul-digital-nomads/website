"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { HeroErrorBoundary } from "./hero-error-boundary";
import { HeroFrame } from "./hero-frame";
import { TourCallout } from "./tour-callout";
import "./hero-live.css";

// The cinematic hero is a full MapLibre WebGL map (raster tiles + markers + an
// animation loop). On a throttled mobile CPU that single component dominated
// Total Blocking Time (~13.8s mobile TBT / 14.3s Speed Index in PSI), so we
// keep two protections everywhere: the ~1 MB maplibre chunk loads via the
// dynamic import below (never part of the initial bundle), and we don't mount
// it until the page is interactive (see the gated effect). The map IS shown on
// mobile - a black hero reads as broken - but mobile gets a shorter unattended
// fallback so it appears without forcing the visitor to interact first. Only
// prefers-reduced-motion keeps the static deep-water frame.
const HeroCinematic = dynamic(
  () => import("./hero-cinematic").then((m) => m.HeroCinematic),
  { ssr: false },
);

type Props = { locale: string; nomadCount: number };

export function HeroLiveClient({ locale, nomadCount }: Props) {
  const [stopIdx, setStopIdx] = useState(0);
  const [cinematic, setCinematic] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduced) return; // static hero for reduced-motion only
    const desktop = window.matchMedia("(min-width: 768px)").matches;

    // Mount the heavy MapLibre tree on the first real engagement signal
    // (pointer move/down, wheel, scroll, key, touch) rather than on load.
    // The WebGL init + tile render is the dominant main-thread cost on the
    // homepage; running it during load is what kept Lighthouse's blocking
    // time high. Gating it on interaction means the page reaches an
    // interactive, settled state first, then the cinematic map fades in the
    // instant the visitor moves. The headline and CTAs render regardless. A
    // fallback timer still mounts it for visitors who never interact - shorter
    // on mobile, where there's no pointer hovering to trigger an early mount,
    // so the map reliably appears instead of leaving a black hero.
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
    const fallback = window.setTimeout(mount, desktop ? 8000 : 3000);
    return () => {
      events.forEach((e) => window.removeEventListener(e, mount));
      window.clearTimeout(fallback);
    };
  }, []);

  // 100dvh (not 100vh) so the hero matches the *visible* viewport on mobile
  // Safari/Chrome - with 100vh the browser chrome overlaps the bottom CTAs
  // until the user scrolls. minHeight keeps it from collapsing on very short
  // landscape viewports.
  return (
    // `isolate` contains the hero's internal z-stack. Its overlays use very
    // high z-index values (the z-[1050] text-mask, z-[1100] header, z-[1200]
    // tour callout) to sit above the map. Without an isolation boundary the
    // section is z-auto and not a stacking context, so those values leak into
    // the root stacking context and paint over the global fixed mobile nav
    // (BottomTabBar, z-50) - darkening the left "Home" tab. Isolating scopes
    // them to the hero so the bottom nav stays on top.
    <section
      className="relative isolate w-full overflow-hidden bg-deep-water text-cream"
      style={{ height: "100dvh", minHeight: 640 }}
    >
      {cinematic && (
        <HeroErrorBoundary
          resetKey="cinematic"
          fallback={<div className="absolute inset-0 bg-deep-water" />}
        >
          <HeroCinematic onStopChange={setStopIdx} />
        </HeroErrorBoundary>
      )}
      <HeroFrame locale={locale} nomadCount={nomadCount} />
      {cinematic && <TourCallout stopIdx={stopIdx} />}
    </section>
  );
}
