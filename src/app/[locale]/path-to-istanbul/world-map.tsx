"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Map, {
  type MapRef,
  Marker,
  NavigationControl,
} from "react-map-gl/maplibre";
import type { Map as MaplibreMap } from "maplibre-gl";
import { Loader2 } from "lucide-react";
import { useTheme } from "@/components/layout/theme-provider";
import { COUNTRIES, type Country } from "@/lib/path-to-istanbul";
import { cn } from "@/lib/utils";
import "maplibre-gl/dist/maplibre-gl.css";

const LIGHT_STYLE =
  "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json";
const DARK_STYLE =
  "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json";

const ISTANBUL: [number, number] = [28.9784, 41.0082];
const BRAND = "#c0392b"; // primary-500

// Densify a great-circle path between two lng/lat points.
function greatCircle(
  from: [number, number],
  to: [number, number],
  steps = 48,
): [number, number][] {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const toDeg = (r: number) => (r * 180) / Math.PI;
  const [lon1, lat1] = [toRad(from[0]), toRad(from[1])];
  const [lon2, lat2] = [toRad(to[0]), toRad(to[1])];
  const d =
    2 *
    Math.asin(
      Math.sqrt(
        Math.sin((lat2 - lat1) / 2) ** 2 +
          Math.cos(lat1) * Math.cos(lat2) * Math.sin((lon2 - lon1) / 2) ** 2,
      ),
    );
  if (d === 0) return [from, to];
  const points: [number, number][] = [];
  for (let i = 0; i <= steps; i++) {
    const f = i / steps;
    const A = Math.sin((1 - f) * d) / Math.sin(d);
    const B = Math.sin(f * d) / Math.sin(d);
    const x =
      A * Math.cos(lat1) * Math.cos(lon1) + B * Math.cos(lat2) * Math.cos(lon2);
    const y =
      A * Math.cos(lat1) * Math.sin(lon1) + B * Math.cos(lat2) * Math.sin(lon2);
    const z = A * Math.sin(lat1) + B * Math.sin(lat2);
    const lat = Math.atan2(z, Math.sqrt(x * x + y * y));
    const lon = Math.atan2(y, x);
    points.push([toDeg(lon), toDeg(lat)]);
  }
  return points;
}

function CountryMarker({
  country,
  isLoading,
  onClick,
}: {
  country: Country;
  isLoading: boolean;
  onClick: () => void;
}) {
  return (
    <Marker
      longitude={country.coordinates[0]}
      latitude={country.coordinates[1]}
      anchor="center"
      onClick={(e) => {
        e.originalEvent.stopPropagation();
        onClick();
      }}
    >
      <button
        type="button"
        aria-label={
          country.supported
            ? `Open guide for ${country.name}`
            : `${country.name} - coming soon`
        }
        className={cn(
          "group relative flex items-center justify-center rounded-full shadow-lg ring-2 transition-transform hover:scale-125 focus:outline-none focus:ring-4 focus:ring-primary-400",
          country.supported
            ? "h-7 w-7 cursor-pointer bg-primary-500 text-base ring-white/90 dark:ring-[#1a1a2e]/80 sm:h-8 sm:w-8 sm:text-lg"
            : "h-5 w-5 cursor-not-allowed bg-white/80 text-xs ring-black/20 dark:bg-white/10 dark:ring-white/20 sm:h-6 sm:w-6 sm:text-sm",
          isLoading && "scale-125 animate-pulse ring-4 ring-primary-300",
        )}
      >
        {country.supported && !isLoading && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-full bg-primary-500/50 animate-ping"
          />
        )}
        <span aria-hidden="true" className="relative">
          {country.flag}
        </span>
        <span className="pointer-events-none absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap rounded bg-black/80 px-2 py-0.5 text-[10px] font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
          {country.name}
          {!country.supported && " · coming soon"}
        </span>
      </button>
    </Marker>
  );
}

export function WorldMap() {
  const router = useRouter();
  const { theme } = useTheme();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapRef | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [loadingCode, setLoadingCode] = useState<string | null>(null);

  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  const routesGeo = useMemo<GeoJSON.FeatureCollection>(
    () => ({
      type: "FeatureCollection",
      features: COUNTRIES.filter((c) => c.supported).map((c) => ({
        type: "Feature",
        properties: { code: c.code, name: c.name },
        geometry: {
          type: "LineString",
          coordinates: greatCircle(c.coordinates, ISTANBUL),
        },
      })),
    }),
    [],
  );

  useEffect(() => setMounted(true), []);

  // Prefetch supported country routes so clicks feel instant.
  useEffect(() => {
    COUNTRIES.filter((c) => c.supported).forEach((c) => {
      router.prefetch(`/path-to-istanbul/${c.slug}`);
    });
  }, [router]);

  // Keep canvas sized to the container.
  useEffect(() => {
    if (!mounted || !containerRef.current) return;
    const obs = new ResizeObserver(() => {
      mapRef.current?.resize();
    });
    obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, [mounted]);

  // Add Turkey fill + route lines imperatively once the style is loaded.
  const handleMapLoad = async () => {
    const map = mapRef.current?.getMap() as MaplibreMap | undefined;
    if (!map) return;

    try {
      const turkeyRes = await fetch("/data/turkey.geo.json");
      const turkeyGeo = await turkeyRes.json();

      const apply = () => {
        if (!map.getSource("turkey")) {
          map.addSource("turkey", { type: "geojson", data: turkeyGeo });
          map.addLayer({
            id: "turkey-fill",
            type: "fill",
            source: "turkey",
            paint: {
              "fill-color": BRAND,
              "fill-opacity": isDark ? 0.55 : 0.7,
            },
          });
          map.addLayer({
            id: "turkey-outline",
            type: "line",
            source: "turkey",
            paint: {
              "line-color": BRAND,
              "line-width": 1.5,
              "line-opacity": 0.95,
            },
          });
        }
        if (!map.getSource("routes")) {
          map.addSource("routes", { type: "geojson", data: routesGeo });
          map.addLayer({
            id: "routes-glow",
            type: "line",
            source: "routes",
            layout: { "line-cap": "round", "line-join": "round" },
            paint: {
              "line-color": BRAND,
              "line-width": 6,
              "line-opacity": 0.18,
              "line-blur": 2,
            },
          });
          map.addLayer({
            id: "routes-line",
            type: "line",
            source: "routes",
            layout: { "line-cap": "round", "line-join": "round" },
            paint: {
              "line-color": BRAND,
              "line-width": 2,
              "line-opacity": 0.85,
              "line-dasharray": [2, 1.5],
            },
          });
        }
        map.resize();
      };

      if (map.isStyleLoaded()) apply();
      else map.once("styledata", apply);
    } catch {
      // Fail silently; markers still render.
    }
  };

  function handleCountryClick(country: Country) {
    if (!country.supported) return;
    setLoadingCode(country.code);
    startTransition(() => {
      router.push(`/path-to-istanbul/${country.slug}`);
    });
  }

  if (!mounted) {
    return (
      <div className="h-[320px] w-full animate-pulse rounded-2xl bg-neutral-100 dark:bg-white/5 sm:h-[420px]" />
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative h-[320px] w-full overflow-hidden rounded-2xl border border-black/5 shadow-sm dark:border-white/10 sm:h-[420px]"
    >
      <Map
        ref={(r) => {
          mapRef.current = r;
          if (r) {
            requestAnimationFrame(() => r.resize());
            setTimeout(() => r.resize(), 300);
            const m = r.getMap() as MaplibreMap;
            if (m.loaded()) handleMapLoad();
            else m.once("load", handleMapLoad);
          }
        }}
        initialViewState={{ longitude: 40, latitude: 30, zoom: 1.4 }}
        minZoom={1}
        maxZoom={4}
        mapStyle={isDark ? DARK_STYLE : LIGHT_STYLE}
        style={{ width: "100%", height: "100%" }}
        attributionControl={false}
      >
        <NavigationControl position="top-right" showCompass={false} />

        {/* Turkey destination label (always visible HTML marker, independent of map layers) */}
        <Marker longitude={35.2433} latitude={39.1} anchor="center">
          <div
            aria-label="Turkey - your destination country"
            className="pointer-events-none flex items-center gap-1.5 rounded-full bg-primary-500 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg ring-2 ring-white/80 dark:ring-[#1a1a2e]/80"
          >
            <span aria-hidden="true">🇹🇷</span>
            <span>Turkey</span>
          </div>
        </Marker>

        {/* Istanbul pin */}
        <Marker longitude={ISTANBUL[0]} latitude={ISTANBUL[1]} anchor="bottom">
          <div
            aria-label="Istanbul - your destination"
            className="pointer-events-none flex flex-col items-center"
          >
            <span className="mb-1 rounded-full bg-[#1a1a2e] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-lg ring-2 ring-primary-500">
              Istanbul
            </span>
            <span
              aria-hidden="true"
              className="h-2.5 w-2.5 rounded-full bg-primary-500 ring-2 ring-white shadow-lg dark:ring-[#1a1a2e]"
            />
          </div>
        </Marker>

        {COUNTRIES.map((country) => (
          <CountryMarker
            key={country.code}
            country={country}
            isLoading={loadingCode === country.code}
            onClick={() => handleCountryClick(country)}
          />
        ))}
      </Map>

      {/* Loading overlay during route transition */}
      {isPending && loadingCode && (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-black/30 backdrop-blur-[1px] transition-opacity dark:bg-black/50">
          <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-[#1a1a2e] shadow-xl dark:bg-[#1a1a2e] dark:text-[#f2f3f4]">
            <Loader2 className="h-4 w-4 animate-spin text-primary-500" />
            Loading path to Istanbul...
          </div>
        </div>
      )}
    </div>
  );
}
