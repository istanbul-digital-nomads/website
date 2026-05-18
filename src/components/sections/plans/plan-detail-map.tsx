"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Map, { Marker, Source, Layer, type MapRef } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { Loader2 } from "lucide-react";
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

function stopLatLng(stop: PlanStop): { lat: number; lng: number } | null {
  if (stop.lat != null && stop.lng != null) {
    return { lat: Number(stop.lat), lng: Number(stop.lng) };
  }
  if (stop.space_id) {
    const sp = spaces.find((s) => s.id === stop.space_id);
    if (sp) return { lat: sp.coordinates[1], lng: sp.coordinates[0] };
  }
  return null;
}

interface Props {
  stops: PlanStop[];
}

/**
 * Read-only map for the plan detail page. Shows each stop as a numbered
 * terracotta pin and connects them with a dashed line in order.
 * Hidden when no stop has a resolvable location.
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
          (x): x is { stop: PlanStop; pos: { lat: number; lng: number } } =>
            x.pos !== null,
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

  // Fit the map to include all stops once loaded.
  useEffect(() => {
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
      { padding: 60, maxZoom: 14, duration: 600 },
    );
  }, [positioned]);

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
        {positioned.map(({ stop, pos }, i) => (
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
        ))}

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
