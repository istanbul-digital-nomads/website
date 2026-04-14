"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Map, { Marker, NavigationControl } from "react-map-gl/maplibre";
import { useTheme } from "@/components/layout/theme-provider";
import { COUNTRIES, type Country } from "@/lib/path-to-istanbul";
import { cn } from "@/lib/utils";
import "maplibre-gl/dist/maplibre-gl.css";

const LIGHT_STYLE =
  "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json";
const DARK_STYLE =
  "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json";

function CountryMarker({
  country,
  onClick,
}: {
  country: Country;
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
        )}
      >
        <span aria-hidden="true">{country.flag}</span>
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
  const [mounted, setMounted] = useState(false);

  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="h-[320px] w-full animate-pulse rounded-2xl bg-neutral-100 dark:bg-white/5 sm:h-[420px]" />
    );
  }

  return (
    <div className="relative h-[320px] w-full overflow-hidden rounded-2xl border border-black/5 shadow-sm dark:border-white/10 sm:h-[420px]">
      <Map
        initialViewState={{ longitude: 40, latitude: 30, zoom: 1.4 }}
        minZoom={1}
        maxZoom={4}
        mapStyle={isDark ? DARK_STYLE : LIGHT_STYLE}
        style={{ width: "100%", height: "100%" }}
        attributionControl={false}
      >
        <NavigationControl position="top-right" showCompass={false} />
        {/* Istanbul destination marker */}
        <Marker longitude={28.9784} latitude={41.0082} anchor="bottom">
          <div
            aria-label="Istanbul - your destination"
            className="pointer-events-none flex flex-col items-center"
          >
            <span className="mb-1 rounded-full bg-[#1a1a2e] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-lg ring-2 ring-primary-500 sm:text-xs">
              Istanbul
            </span>
            <span
              aria-hidden="true"
              className="h-3 w-3 rounded-full bg-primary-500 ring-2 ring-white shadow-lg dark:ring-[#1a1a2e]"
            />
          </div>
        </Marker>
        {COUNTRIES.map((country) => (
          <CountryMarker
            key={country.code}
            country={country}
            onClick={() => {
              if (country.supported) {
                router.push(`/path-to-istanbul/${country.slug}`);
              }
            }}
          />
        ))}
      </Map>
    </div>
  );
}
