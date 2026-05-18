"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Map, {
  Layer,
  Marker,
  Source,
  type MapRef,
} from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";

import {
  HERO_CATEGORIES,
  HERO_CATEGORY_GLYPHS,
  HERO_NEIGHBORHOODS,
  HERO_NOMADS,
  HERO_TOUR,
  HERO_VENUES,
  type HeroCategoryKey,
} from "@/lib/hero-data";
import { NomadMarker } from "./nomad-marker";
import { VenueLayer } from "./venue-layer";

// Build a data-URL SVG image for one category glyph (used as a MapLibre
// icon-image inside the venue dot). Drawn inside a 24x24 viewBox centered
// on the origin so the existing path d="" strings render cleanly.
function buildGlyphImage(cat: HeroCategoryKey): Promise<HTMLImageElement> {
  const glyph = HERO_CATEGORY_GLYPHS[cat];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="-10 -10 20 20"><path d="${glyph}" fill="none" stroke="#06101f" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" /></svg>`;
  const dataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  return new Promise((resolve, reject) => {
    const img = new Image(20, 20);
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = dataUrl;
  });
}

// Inline raster-tile style: CartoCDN dark_nolabels PNG tiles + dark_only_labels
// PNG tiles as a soft overlay. Raster tiles render as <img> elements so they
// paint without depending on the MapLibre WebGL animation loop - useful in
// SSR-hydrated environments where the page may briefly be backgrounded
// during initial mount.
const MAP_STYLE = {
  version: 8 as const,
  sources: {
    "carto-dark": {
      type: "raster" as const,
      tiles: [
        "https://a.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}@2x.png",
        "https://b.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}@2x.png",
        "https://c.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}@2x.png",
        "https://d.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}@2x.png",
      ],
      tileSize: 256,
      attribution: "© OpenStreetMap contributors © CARTO",
    },
    "carto-labels": {
      type: "raster" as const,
      tiles: [
        "https://a.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}@2x.png",
        "https://b.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}@2x.png",
        "https://c.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}@2x.png",
        "https://d.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}@2x.png",
      ],
      tileSize: 256,
    },
  },
  layers: [
    { id: "bg", type: "background" as const, paint: { "background-color": "#06101f" } },
    { id: "carto-dark-layer", type: "raster" as const, source: "carto-dark" },
    {
      id: "carto-labels-layer",
      type: "raster" as const,
      source: "carto-labels",
      paint: { "raster-opacity": 0.7 },
    },
  ],
  glyphs: "https://basemaps.cartocdn.com/gl/fonts/{fontstack}/{range}.pbf",
};
const STOP_INTERVAL_MS = 11_000;
const FLY_DURATION_MS = 8_000;

type Props = {
  onStopChange?: (idx: number) => void;
};

export function HeroCinematic({ onStopChange }: Props) {
  const mapRef = useRef<MapRef | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mountedRef = useRef(true);
  const pendingTimeoutsRef = useRef<number[]>([]);
  const [stopIdx, setStopIdx] = useState(0);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  // On unmount, mark unmounted and cancel any pending setTimeouts so their
  // callbacks don't fire against a destroyed MapLibre instance and crash
  // the parent (which boots the error boundary). Async work from
  // buildGlyphImage etc. also guards on mountedRef before touching the map.
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      for (const id of pendingTimeoutsRef.current) window.clearTimeout(id);
      pendingTimeoutsRef.current = [];
    };
  }, []);

  // MapLibre captures container dimensions at init time and doesn't always
  // auto-resize if hydration races with layout (e.g. embedded in a tab/iframe
  // that's currently hidden when init fires - container reports 0x0, the
  // canvas locks to that, and the map never recovers when the tab becomes
  // visible). We listen to every signal that "the container may now be
  // sized differently" and call map.resize() on each one. Same effect also
  // promotes the map to "loaded" once its style finishes parsing - we can't
  // rely on the onLoad prop alone because in a backgrounded tab rAF is
  // throttled and the event sometimes never fires.
  useEffect(() => {
    if (!containerRef.current) return;
    const tickFn = () => {
      const m = mapRef.current?.getMap();
      if (!m) return;
      try {
        m.resize();
        if (m.isStyleLoaded?.()) setMapLoaded(true);
      } catch {
        /* ignore - map disposed */
      }
    };
    const ro = new ResizeObserver(tickFn);
    ro.observe(containerRef.current);
    window.addEventListener("resize", tickFn);
    document.addEventListener("visibilitychange", tickFn);
    // Poll every 200ms for 8s so the gated children mount as soon as the
    // style is parsed, even if onLoad never fires.
    const tick = window.setInterval(tickFn, 200);
    const stop = window.setTimeout(() => window.clearInterval(tick), 8000);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", tickFn);
      document.removeEventListener("visibilitychange", tickFn);
      window.clearInterval(tick);
      window.clearTimeout(stop);
    };
  }, []);

  // Honour OS-level reduced-motion preference. Skip the auto-tour entirely
  // and snap the camera instantly on stop change.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const handler = () => setReduceMotion(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Tour interval. Pauses when reduced motion is on (camera holds on stop 0).
  useEffect(() => {
    if (reduceMotion) return;
    const id = window.setInterval(() => {
      setStopIdx((i) => (i + 1) % HERO_TOUR.length);
    }, STOP_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [reduceMotion]);

  // Surface the stop index to the parent (drives the floating callout copy).
  useEffect(() => {
    onStopChange?.(stopIdx);
  }, [stopIdx, onStopChange]);

  // Drive the camera. flyTo with smoothstep easing approximates Leaflet's
  // ease-in-out / linearity 0.1 from the design. Guarded with try/catch
  // because mapRef.getMap() may transiently return a stale instance during
  // client-side navigation transitions.
  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;
    const stop = HERO_TOUR[stopIdx];
    try {
      const map = mapRef.current.getMap();
      if (!map) return;
      if (reduceMotion) {
        map.jumpTo({ center: stop.center, zoom: stop.zoom });
        return;
      }
      map.flyTo({
        center: stop.center,
        zoom: stop.zoom,
        duration: FLY_DURATION_MS,
        curve: 1.42,
        essential: true,
        easing: (t: number) => t * t * (3 - 2 * t),
      });
    } catch {
      /* ignore - map disposed */
    }
  }, [stopIdx, mapLoaded, reduceMotion]);

  const stop = HERO_TOUR[stopIdx];
  const focusedHood = stop.id;

  const focusedHoodData = useMemo(
    () => (focusedHood ? HERO_NEIGHBORHOODS.find((h) => h.id === focusedHood) : null),
    [focusedHood],
  );

  // Group nomads by venue so we can offset clustered avatars horizontally
  // (otherwise multiple nomads at the same venue would render on top of
  // each other).
  const venueById = useMemo(
    () => Object.fromEntries(HERO_VENUES.map((v) => [v.id, v] as const)),
    [],
  );
  const clusters = useMemo(() => {
    const by: Record<string, typeof HERO_NOMADS> = {};
    HERO_NOMADS.forEach((n) => {
      if (!venueById[n.v]) return;
      (by[n.v] = by[n.v] || []).push(n);
    });
    return by;
  }, [venueById]);

  const spotlightData = useMemo(() => {
    if (!focusedHoodData) {
      return { type: "FeatureCollection" as const, features: [] };
    }
    return {
      type: "FeatureCollection" as const,
      features: [
        {
          type: "Feature" as const,
          properties: {},
          geometry: {
            type: "Point" as const,
            coordinates: [focusedHoodData.lng, focusedHoodData.lat],
          },
        },
      ],
    };
  }, [focusedHoodData]);

  const onLoad = useCallback(() => {
    const map = mapRef.current?.getMap();
    if (!map) return;
    // Register a glyph image per category. The venue-layer's symbol layer
    // resolves `icon-image: hero-glyph-{cat}` against these. Each async
    // callback guards on mountedRef so we don't touch a destroyed map
    // after a client-side navigation away from the homepage.
    (Object.keys(HERO_CATEGORIES) as HeroCategoryKey[]).forEach((cat) => {
      buildGlyphImage(cat)
        .then((img) => {
          if (!mountedRef.current) return;
          const m = mapRef.current?.getMap();
          if (!m) return;
          try {
            if (!m.hasImage(`hero-glyph-${cat}`)) {
              m.addImage(`hero-glyph-${cat}`, img);
            }
          } catch {
            /* map may have been removed between checks */
          }
        })
        .catch(() => {
          /* fail silently - dot still renders without glyph */
        });
    });
    setMapLoaded(true);
    // Belt-and-braces resize retries on top of the always-running poll in
    // the useEffect above. IDs are tracked so the unmount cleanup can
    // cancel any still-pending retries.
    [0, 50, 200, 600, 1500].forEach((ms) => {
      const id = window.setTimeout(() => {
        if (!mountedRef.current) return;
        try {
          mapRef.current?.getMap()?.resize();
        } catch {
          /* ignore - map disposed */
        }
      }, ms);
      pendingTimeoutsRef.current.push(id);
    });
  }, []);

  return (
    <div className="absolute inset-0" ref={containerRef}>
      <Map
        ref={mapRef}
        mapStyle={MAP_STYLE}
        initialViewState={{
          longitude: HERO_TOUR[0].center[0],
          latitude: HERO_TOUR[0].center[1],
          zoom: HERO_TOUR[0].zoom,
        }}
        style={{ width: "100%", height: "100%" }}
        dragPan={false}
        scrollZoom={false}
        doubleClickZoom={false}
        touchZoomRotate={false}
        keyboard={false}
        attributionControl={false}
        onLoad={onLoad}
      >
        {/* All children are gated on mapLoaded so they don't attempt to
            attach to map.style before it has finished loading. Without
            this guard, react-map-gl's setProps calls _updateStyleComponents
            against an undefined map.style during the brief window between
            Map construction and style-load, which crashes the page on
            client-side navigations back to the homepage. */}
        {mapLoaded && (
          <>
            <VenueLayer venues={HERO_VENUES} focusedHood={focusedHood} />

            {focusedHoodData && (
              <Source id="hero-spotlight" type="geojson" data={spotlightData}>
                <Layer
                  id="hero-spotlight-ring"
                  type="circle"
                  paint={{
                    "circle-radius": [
                      "interpolate",
                      ["linear"],
                      ["zoom"],
                      11, 30,
                      13, 80,
                      15, 160,
                    ],
                    "circle-color": "rgba(0,0,0,0)",
                    "circle-stroke-color": "#f4b860",
                    "circle-stroke-width": 1.2,
                    "circle-stroke-opacity": 0.55,
                  }}
                />
              </Source>
            )}

            {focusedHoodData && (
              <Marker
                longitude={focusedHoodData.lng}
                latitude={focusedHoodData.lat}
                anchor="bottom"
                offset={[0, -64]}
              >
                <span
                  className="font-editorial italic text-gold"
                  style={{
                    fontSize: 26,
                    textShadow: "0 2px 14px rgba(6,16,31,0.85)",
                    pointerEvents: "none",
                  }}
                >
                  {focusedHoodData.label}
                </span>
              </Marker>
            )}

            {Object.entries(clusters).map(([venueId, group]) => {
              const venue = venueById[venueId];
              if (!venue) return null;
              const inFocus = focusedHood === null || venue.hood === focusedHood;
              return group.map((nomad, i) => {
                // Spread clustered avatars left/right across the venue point.
                const clusterOffsetPx = (i - (group.length - 1) / 2) * 34;
                return (
                  <NomadMarker
                    key={nomad.id}
                    nomad={nomad}
                    venue={venue}
                    index={i}
                    clusterOffsetPx={clusterOffsetPx}
                    inFocus={inFocus}
                  />
                );
              });
            })}
          </>
        )}
      </Map>

      {/* Color tint overlay - warm gold wash over the dark map.
          Pointer-events disabled so map remains the click target (not that
          we accept clicks here, but for future). */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 60% 50%, rgba(244, 184, 96, 0.06) 0%, rgba(6, 16, 31, 0) 35%, rgba(6, 16, 31, 0.45) 100%)",
          mixBlendMode: "screen",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(244, 184, 96, 0) 60%, rgba(244, 184, 96, 0.08) 100%)",
          mixBlendMode: "overlay",
        }}
      />
    </div>
  );
}
