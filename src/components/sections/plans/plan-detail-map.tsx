"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Map, { Marker, Source, Layer, type MapRef } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { Loader2, MapPin } from "lucide-react";
import { useTheme } from "@/components/layout/theme-provider";
import { spaces } from "@/lib/spaces";
import { cn } from "@/lib/utils";
import type { PlanStop } from "@/lib/plans/queries";

const LIGHT_STYLE =
  "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json";
const DARK_STYLE =
  "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json";

const ISTANBUL_CENTER = { longitude: 29.0, latitude: 41.015 } as const;
const ISTANBUL_BOUNDS: [[number, number], [number, number]] = [
  [28.7, 40.85],
  [29.4, 41.2],
];

// Approximate center coordinates for every neighborhood. Used as a fallback
// when a stop has only a neighborhood_slug and no exact lat/lng or space_id.
// Coordinates are [lng, lat] (GeoJSON order, same as spaces.ts).
const NEIGHBORHOOD_CENTERS: Record<string, [number, number]> = {
  kadikoy:    [29.0228, 40.9902],
  moda:       [29.0200, 40.9815],
  cihangir:   [28.9818, 41.0293],
  besiktas:   [29.0044, 41.0425],
  galata:     [28.9747, 41.0246],
  uskudar:    [29.0150, 41.0230],
  nisantasi:  [28.9919, 41.0491],
  levent:     [28.9988, 41.0773],
  balat:      [28.9460, 41.0278],
  atasehir:   [29.1157, 40.9847],
  sisli:      [28.9870, 41.0600],
  taksim:     [28.9784, 41.0370],
  beyoglu:    [28.9758, 41.0336],
  fatih:      [28.9500, 41.0200],
  sultanahmet:[28.9730, 41.0055],
  bakirkoy:   [28.8700, 40.9800],
  sariyer:    [29.0570, 41.1660],
  bebek:      [29.0440, 41.0792],
  ortakoy:    [29.0267, 41.0470],
  bosphorus:  [29.0330, 41.0600],
};

function stopLatLng(stop: PlanStop): {
  lat: number;
  lng: number;
  approximate?: boolean;
} | null {
  // 1. Exact coordinates on the stop record - most precise.
  if (stop.lat != null && stop.lng != null) {
    return { lat: Number(stop.lat), lng: Number(stop.lng) };
  }
  // 2. Matched space from the static spaces catalog.
  if (stop.space_id) {
    const sp = spaces.find((s) => s.id === stop.space_id);
    if (sp) return { lat: sp.coordinates[1], lng: sp.coordinates[0] };
  }
  // 3. Neighborhood center fallback - approximate pin at the hood's midpoint.
  //    Marked so we can show a subtly different pin (hollow ring vs. solid dot).
  if (stop.neighborhood_slug) {
    const center = NEIGHBORHOOD_CENTERS[stop.neighborhood_slug];
    if (center) return { lat: center[1], lng: center[0], approximate: true };
  }
  return null;
}

interface Props {
  stops: PlanStop[];
}

/**
 * Read-only map for the plan detail page. Shows each stop as a numbered
 * terracotta pin, connected with a dashed line. Stops with only a
 * neighborhood_slug resolve to an approximate hood-center pin (hollow ring).
 * Hidden when no stop has any resolvable location at all.
 */
export function PlanDetailMap({ stops }: Props) {
  const { theme } = useTheme();
  const mapRef = useRef<MapRef>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  const positioned = useMemo(
    () =>
      stops
        .map((stop) => ({ stop, pos: stopLatLng(stop) }))
        .filter(
          (
            x,
          ): x is {
            stop: PlanStop;
            pos: NonNullable<ReturnType<typeof stopLatLng>>;
          } => x.pos !== null,
        ),
    [stops],
  );

  const routeGeo = useMemo(() => {
    if (positioned.length < 2) return null;
    return {
      type: "FeatureCollection" as const,
      features: [
        {
          type: "Feature" as const,
          properties: {},
          geometry: {
            type: "LineString" as const,
            coordinates: positioned.map((p) => [p.pos.lng, p.pos.lat]),
          },
        },
      ],
    };
  }, [positioned]);

  // Fit the map to all stop pins once the style has loaded. The effect runs
  // on both `positioned` changes AND `mapLoaded` so it fires correctly even
  // when the map finishes loading after the stops are already computed.
  useEffect(() => {
    if (!mapLoaded) return;
    const map = mapRef.current?.getMap();
    if (!map || positioned.length === 0) return;
    if (positioned.length === 1) {
      const p = positioned[0]!.pos;
      map.flyTo({ center: [p.lng, p.lat], zoom: 14, duration: 600 });
      return;
    }
    const lngs = positioned.map((p) => p.pos.lng);
    const lats = positioned.map((p) => p.pos.lat);
    map.fitBounds(
      [
        [Math.min(...lngs), Math.min(...lats)],
        [Math.max(...lngs), Math.max(...lats)],
      ],
      { padding: 72, maxZoom: 14, duration: 600 },
    );
  }, [positioned, mapLoaded]);

  if (positioned.length === 0) return null;

  return (
    <div
      className={cn(
        "relative h-[280px] w-full overflow-hidden rounded-lg border border-ink-3 sm:h-[360px]",
        isDark ? "bg-[#1a1d27]" : "bg-[#e8e0d4]",
      )}
    >
      <Map
        ref={mapRef}
        mapStyle={isDark ? DARK_STYLE : LIGHT_STYLE}
        initialViewState={{
          ...ISTANBUL_CENTER,
          zoom: 11.3,
        }}
        style={{ width: "100%", height: "100%" }}
        attributionControl={false}
        maxBounds={ISTANBUL_BOUNDS}
        minZoom={10}
        maxZoom={17}
        onLoad={() => setMapLoaded(true)}
        interactive
      >
        {positioned.map(({ stop, pos }, i) =>
          pos.approximate ? (
            // Approximate (neighborhood-level) pin: hollow ring with a
            // MapPin icon so users know it's not a pinpoint address.
            <Marker
              key={stop.id}
              longitude={pos.lng}
              latitude={pos.lat}
              anchor="bottom"
            >
              <span
                aria-label={`Stop ${i + 1} (approximate area)`}
                className="relative -translate-y-1"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-terracotta bg-terracotta/15 shadow-md backdrop-blur-sm">
                  <MapPin className="h-3.5 w-3.5 text-terracotta" aria-hidden />
                </span>
                <span className="absolute -bottom-0.5 left-1/2 flex h-5 min-w-[18px] -translate-x-1/2 items-center justify-center rounded-full bg-terracotta px-1 font-mono text-[9px] font-semibold text-ink-0 shadow ring-1 ring-paper/30">
                  {i + 1}
                </span>
              </span>
            </Marker>
          ) : (
            // Exact pin: solid terracotta circle with diamond tail.
            <Marker
              key={stop.id}
              longitude={pos.lng}
              latitude={pos.lat}
              anchor="bottom"
            >
              <span
                aria-label={`Stop ${i + 1}`}
                className="relative -translate-y-1"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full border border-paper bg-terracotta font-mono text-[10px] font-semibold text-ink-0 shadow-md">
                  {i + 1}
                </span>
                <span className="absolute -bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rotate-45 bg-terracotta" />
              </span>
            </Marker>
          ),
        )}

        {routeGeo && (
          <Source id="plan-route" type="geojson" data={routeGeo}>
            <Layer
              id="plan-route-glow"
              type="line"
              paint={{
                "line-color": "rgba(192,57,43,0.25)",
                "line-width": 8,
                "line-blur": 6,
              }}
            />
            <Layer
              id="plan-route-line"
              type="line"
              paint={{
                "line-color": "#c0392b",
                "line-width": 2.5,
                "line-dasharray": [2, 2],
              }}
            />
          </Source>
        )}
      </Map>

      {!mapLoaded && (
        <div
          role="status"
          aria-label="Loading map"
          className={cn(
            "pointer-events-none absolute inset-0 z-20 flex items-center justify-center",
            isDark ? "bg-[#1a1d27]" : "bg-[#e8e0d4]",
          )}
        >
          <Loader2
            className="h-6 w-6 animate-spin text-terracotta motion-reduce:animate-none"
            aria-hidden
          />
        </div>
      )}
    </div>
  );
}
