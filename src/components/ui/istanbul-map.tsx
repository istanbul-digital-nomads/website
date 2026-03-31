"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Map, { Marker, Source, Layer, NavigationControl } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/layout/theme-provider";

const MAP_STYLE_LIGHT = "https://tiles.openfreemap.org/styles/liberty";
const MAP_STYLE_DARK = "https://tiles.openfreemap.org/styles/dark";

const ISTANBUL_CENTER = { longitude: 29.0, latitude: 41.015 } as const;
const INITIAL_ZOOM = 12.2;

interface Neighborhood {
  name: string;
  lng: number;
  lat: number;
  vibe: string;
  side: "European" | "Asian";
  color: string;
  bgClass: string;
}

const neighborhoods: Neighborhood[] = [
  {
    name: "Galata",
    lng: 28.974,
    lat: 41.026,
    vibe: "Historic tower district, cafes, galleries, nightlife",
    side: "European",
    color: "#d49a45",
    bgClass: "bg-accent-warm text-neutral-950",
  },
  {
    name: "Besiktas",
    lng: 29.007,
    lat: 41.043,
    vibe: "Lively waterfront, markets, great transport links",
    side: "European",
    color: "#737373",
    bgClass: "bg-neutral-200 text-neutral-800 dark:bg-neutral-700 dark:text-neutral-100",
  },
  {
    name: "Kadikoy",
    lng: 29.025,
    lat: 40.99,
    vibe: "Calm Asian side, walkable cafes, daily rhythm hub",
    side: "Asian",
    color: "#e34b32",
    bgClass: "bg-primary-500 text-white",
  },
  {
    name: "Moda",
    lng: 29.031,
    lat: 40.983,
    vibe: "Seaside promenades, quiet streets, creative scene",
    side: "Asian",
    color: "#2f8f7b",
    bgClass: "bg-accent-green text-white",
  },
  {
    name: "Uskudar",
    lng: 29.015,
    lat: 41.023,
    vibe: "Traditional neighborhood, ferry hub, Bosphorus views",
    side: "Asian",
    color: "#737373",
    bgClass: "bg-neutral-200 text-neutral-800 dark:bg-neutral-700 dark:text-neutral-100",
  },
];

const ferryRoute = {
  type: "FeatureCollection" as const,
  features: [
    {
      type: "Feature" as const,
      properties: {},
      geometry: {
        type: "LineString" as const,
        coordinates: [
          [29.023, 40.992],
          [29.015, 41.0],
          [29.005, 41.007],
          [28.997, 41.013],
          [28.978, 41.018],
        ],
      },
    },
    {
      type: "Feature" as const,
      properties: {},
      geometry: {
        type: "LineString" as const,
        coordinates: [
          [29.023, 40.992],
          [29.018, 41.005],
          [29.015, 41.023],
        ],
      },
    },
  ],
};

function AnimatedMarker({
  neighborhood,
  delay,
  onHover,
  onLeave,
  isActive,
}: {
  neighborhood: Neighborhood;
  delay: number;
  onHover: () => void;
  onLeave: () => void;
  isActive: boolean;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <Marker longitude={neighborhood.lng} latitude={neighborhood.lat} anchor="center">
      <div
        className={cn(
          "map-marker group relative cursor-pointer transition-all duration-300",
          visible ? "scale-100 opacity-100" : "scale-0 opacity-0",
        )}
        onMouseEnter={onHover}
        onMouseLeave={onLeave}
      >
        <span
          className="absolute inset-0 animate-ping rounded-full opacity-40"
          style={{
            backgroundColor: neighborhood.color,
            animationDuration: "2.5s",
            animationDelay: `${delay}ms`,
          }}
        />
        <span
          className="relative block h-3.5 w-3.5 rounded-full shadow-lg ring-2 ring-white/90 dark:ring-neutral-900/80"
          style={{ backgroundColor: neighborhood.color }}
        />

        <div
          className={cn(
            "absolute left-5 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.25em] shadow-md transition-all duration-200",
            neighborhood.bgClass,
            isActive
              ? "scale-105 opacity-100"
              : "opacity-90 group-hover:scale-105 group-hover:opacity-100",
          )}
        >
          {neighborhood.name}
        </div>

        {isActive && (
          <div className="animate-slide-up-fade absolute left-5 top-full mt-1 w-48 rounded-xl border border-black/10 bg-white/95 p-3 shadow-lg backdrop-blur-sm dark:border-white/10 dark:bg-neutral-900/95">
            <p className="text-xs font-medium text-neutral-900 dark:text-neutral-100">
              {neighborhood.name}
            </p>
            <p className="mt-0.5 text-[10px] uppercase tracking-wider text-neutral-500">
              {neighborhood.side} side
            </p>
            <p className="mt-1.5 text-xs leading-relaxed text-neutral-600 dark:text-neutral-300">
              {neighborhood.vibe}
            </p>
          </div>
        )}
      </div>
    </Marker>
  );
}

export function IstanbulMap() {
  const { theme } = useTheme();
  const [activeMarker, setActiveMarker] = useState<string | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef<any>(null);

  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  const onLoad = useCallback(() => {
    setMapLoaded(true);
    const map = mapRef.current?.getMap();
    if (map) {
      map.flyTo({
        center: [ISTANBUL_CENTER.longitude, ISTANBUL_CENTER.latitude],
        zoom: INITIAL_ZOOM + 0.3,
        duration: 2000,
        easing: (t: number) => t * (2 - t),
      });
    }
  }, []);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-[2.3rem] border border-primary-200/60 bg-[#e8e0d4] shadow-[0_30px_90px_rgba(15,23,42,0.12)] dark:border-primary-900/40 dark:bg-[#0d1a26] dark:shadow-[0_30px_90px_rgba(0,0,0,0.35)]">
      <div
        className={cn(
          "absolute inset-0 transition-opacity duration-700",
          mapLoaded ? "opacity-100" : "opacity-0",
        )}
      >
      <Map
        ref={mapRef}
        mapStyle={isDark ? MAP_STYLE_DARK : MAP_STYLE_LIGHT}
        initialViewState={{
          ...ISTANBUL_CENTER,
          zoom: INITIAL_ZOOM,
        }}
        style={{ width: "100%", height: "100%" }}
        scrollZoom={false}
        attributionControl={false}
        onLoad={onLoad}
      >
        <NavigationControl position="top-right" showCompass={false} />

        <Source id="ferry-routes" type="geojson" data={ferryRoute}>
          <Layer
            id="ferry-glow"
            type="line"
            paint={{
              "line-color": isDark
                ? "rgba(47,143,123,0.25)"
                : "rgba(47,143,123,0.15)",
              "line-width": 8,
              "line-blur": 6,
            }}
          />
          <Layer
            id="ferry-line"
            type="line"
            paint={{
              "line-color": isDark
                ? "rgba(47,143,123,0.7)"
                : "rgba(47,143,123,0.5)",
              "line-width": 2,
              "line-dasharray": [2, 3],
            }}
          />
        </Source>

        {neighborhoods.map((n, i) => (
          <AnimatedMarker
            key={n.name}
            neighborhood={n}
            delay={600 + i * 250}
            onHover={() => setActiveMarker(n.name)}
            onLeave={() => setActiveMarker(null)}
            isActive={activeMarker === n.name}
          />
        ))}
      </Map>
      </div>

      <div className="pointer-events-none absolute inset-0 rounded-[2.3rem] ring-1 ring-inset ring-black/5 dark:ring-white/10" />

      <div className="absolute inset-x-4 bottom-4 sm:inset-x-6 sm:bottom-6">
        <div className="rounded-2xl border border-black/8 bg-white/88 px-5 py-4 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-neutral-900/85">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="eyebrow">First-month map - Istanbul</p>
              <p className="mt-2 max-w-sm text-sm leading-6 text-neutral-700 dark:text-neutral-300">
                European side left, Asian side right, ferries tying the week
                together. Hover neighborhoods to explore.
              </p>
            </div>
            <div className="hidden rounded-full border border-black/10 bg-white/80 p-2.5 shadow-sm dark:border-white/10 dark:bg-white/10 sm:block">
              <MapPin className="h-4 w-4 text-primary-600 dark:text-primary-400" />
            </div>
          </div>
          <div className="mt-3 flex gap-4 text-xs text-neutral-500 dark:text-neutral-400">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-accent-warm" />
              European side
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-primary-500" />
              Asian side
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-accent-green" />
              Ferry routes
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
