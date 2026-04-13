"use client";

import { useCallback, useEffect, useRef, useState, memo } from "react";
import Map, {
  Marker,
  Source,
  Layer,
  NavigationControl,
} from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/layout/theme-provider";

// CartoCDN tiles - reliable, free, no API key needed
const MAP_STYLE_LIGHT =
  "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json";
const MAP_STYLE_DARK =
  "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json";

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
  labelSide: "left" | "right";
}

const neighborhoods: Neighborhood[] = [
  {
    name: "Galata",
    lng: 28.974,
    lat: 41.026,
    vibe: "Historic tower district, cafes, galleries, nightlife",
    side: "European",
    color: "#f39c12",
    bgClass: "bg-accent-warm text-neutral-950",
    labelSide: "right",
  },
  {
    name: "Besiktas",
    lng: 29.007,
    lat: 41.043,
    vibe: "Lively waterfront, markets, great transport links",
    side: "European",
    color: "#737373",
    bgClass:
      "bg-neutral-200 text-neutral-800 dark:bg-[#2c2f3a] dark:text-[#d5dce3]",
    labelSide: "left",
  },
  {
    name: "Kadikoy",
    lng: 29.027,
    lat: 40.993,
    vibe: "Calm Asian side, walkable cafes, daily rhythm hub",
    side: "Asian",
    color: "#c0392b",
    bgClass: "bg-primary-500 text-white",
    labelSide: "right",
  },
  {
    name: "Moda",
    lng: 29.026,
    lat: 40.978,
    vibe: "Seaside promenades, quiet streets, creative scene",
    side: "Asian",
    color: "#27ae60",
    bgClass: "bg-accent-green text-white",
    labelSide: "left",
  },
  {
    name: "Uskudar",
    lng: 29.015,
    lat: 41.023,
    vibe: "Traditional neighborhood, ferry hub, Bosphorus views",
    side: "Asian",
    color: "#737373",
    bgClass:
      "bg-neutral-200 text-neutral-800 dark:bg-[#2c2f3a] dark:text-[#d5dce3]",
    labelSide: "right",
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
    <Marker
      longitude={neighborhood.lng}
      latitude={neighborhood.lat}
      anchor="center"
    >
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
          className="relative block h-3.5 w-3.5 rounded-full shadow-lg ring-2 ring-white/90 dark:ring-[#1a1a2e]/80"
          style={{ backgroundColor: neighborhood.color }}
        />

        <div
          className={cn(
            "absolute top-1/2 -translate-y-1/2 whitespace-nowrap rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.25em] shadow-md transition-all duration-200",
            neighborhood.bgClass,
            neighborhood.labelSide === "right" ? "left-5" : "right-5",
            isActive
              ? "scale-105 opacity-100"
              : "opacity-90 group-hover:scale-105 group-hover:opacity-100",
          )}
        >
          {neighborhood.name}
        </div>

        {isActive && (
          <div
            className={cn(
              "animate-slide-up-fade absolute bottom-full mb-2 w-48 rounded-xl border border-black/10 bg-white/95 p-3 shadow-lg backdrop-blur-sm dark:border-white/10 dark:bg-[#1a1a2e]/95",
              neighborhood.labelSide === "right" ? "left-0" : "right-0",
            )}
          >
            <p className="text-xs font-medium text-neutral-900 dark:text-[#d5dce3]">
              {neighborhood.name}
            </p>
            <p className="mt-0.5 text-[10px] uppercase tracking-wider text-[#85929e]">
              {neighborhood.side} side
            </p>
            <p className="mt-1.5 text-xs leading-relaxed text-neutral-600 dark:text-[#99a3ad]">
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
  const [mapError, setMapError] = useState(false);
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
      map.on("error", () => setMapError(true));
      // Simplified zoom-in - shorter duration for better perceived perf
      map.flyTo({
        center: [ISTANBUL_CENTER.longitude, ISTANBUL_CENTER.latitude],
        zoom: INITIAL_ZOOM + 0.3,
        duration: 800,
        easing: (t: number) => t * (2 - t),
      });
    }
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden rounded-[2.3rem] border border-primary-200/60 bg-[#d5dce3] shadow-[0_30px_90px_rgba(15,23,42,0.12)] dark:border-primary-900/40 dark:bg-[#1a1d27] dark:shadow-[0_30px_90px_rgba(0,0,0,0.35)]">
      <div
        className={cn(
          "absolute inset-0 transition-opacity duration-700",
          mapLoaded ? "opacity-100" : "opacity-0",
        )}
      >
        <div
          className={cn(
            "absolute inset-0",
            isDark ? "map-canvas-dark" : "map-canvas-warm",
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
                    ? "rgba(39,174,96,0.25)"
                    : "rgba(39,174,96,0.15)",
                  "line-width": 8,
                  "line-blur": 6,
                }}
              />
              <Layer
                id="ferry-line"
                type="line"
                paint={{
                  "line-color": isDark
                    ? "rgba(39,174,96,0.7)"
                    : "rgba(39,174,96,0.5)",
                  "line-width": 2,
                  "line-dasharray": [2, 3],
                }}
              />
            </Source>

            {neighborhoods.map((n, i) => (
              <AnimatedMarker
                key={n.name}
                neighborhood={n}
                delay={200 + i * 100}
                onHover={() => setActiveMarker(n.name)}
                onLeave={() => setActiveMarker(null)}
                isActive={activeMarker === n.name}
              />
            ))}
          </Map>
        </div>

        {/* Warm tint overlay on the map tiles */}
        <div
          className={cn(
            "pointer-events-none absolute inset-0",
            isDark
              ? "bg-[rgba(15,10,8,0.12)]"
              : "bg-[radial-gradient(circle_at_40%_40%,rgba(192,57,43,0.06),transparent_60%),radial-gradient(circle_at_70%_70%,rgba(243,156,18,0.05),transparent_50%)]",
          )}
        />
      </div>

      <div className="pointer-events-none absolute inset-0 rounded-[2.3rem] ring-1 ring-inset ring-black/5 dark:ring-white/10" />

      <div className="absolute inset-x-4 bottom-4 sm:inset-x-6 sm:bottom-6">
        <div className="rounded-2xl border border-black/8 bg-white/88 px-5 py-4 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-[#1a1a2e]/85">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="eyebrow">First-month map - Istanbul</p>
              <p className="mt-2 max-w-sm text-sm leading-6 text-neutral-700 dark:text-[#99a3ad]">
                European side left, Asian side right, ferries tying the week
                together. Hover neighborhoods to explore.
              </p>
            </div>
            <div className="hidden rounded-full border border-black/10 bg-white/80 p-2.5 shadow-sm dark:border-white/10 dark:bg-white/10 sm:block">
              <MapPin className="h-4 w-4 text-primary-600 dark:text-primary-400" />
            </div>
          </div>
          <div className="mt-3 flex gap-4 text-xs text-[#5d6d7e] dark:text-[#85929e]">
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
