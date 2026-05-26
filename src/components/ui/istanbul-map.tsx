"use client";

import { useCallback, useEffect, useRef, useState, memo } from "react";
import { useTranslations } from "next-intl";
import Map, {
  Marker,
  Source,
  Layer,
  NavigationControl,
  type MarkerInstance,
} from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/layout/theme-provider";
import {
  brands as defaultBrands,
  brandLocations as defaultBrandLocations,
  type BrandLocation,
  type NomadBrand,
} from "@/lib/brands";
import { BrandMarker } from "@/components/ui/brand-marker";
import { BrandFilterBar } from "@/components/ui/brand-filter-bar";
import {
  mapNeighborhoods,
  type MapNeighborhood,
} from "@/lib/map-neighborhoods";

// CartoCDN tiles - reliable, free, no API key needed
const MAP_STYLE_LIGHT =
  "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json";
const MAP_STYLE_DARK =
  "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json";

const ISTANBUL_CENTER = { longitude: 29.0, latitude: 41.015 } as const;
const INITIAL_ZOOM = 11.35;

// Clamp the viewport to Istanbul so the map can't be panned or zoomed out to
// the rest of the world - it's an Istanbul nomad map, nothing else belongs on
// it. [west, south] / [east, north], wide enough to hold every neighborhood
// and brand branch (Bakirkoy in the west to Pendik in the east) with a little
// pan room, and minZoom keeps the city filling the frame.
const ISTANBUL_BOUNDS: [[number, number], [number, number]] = [
  [28.45, 40.78],
  [29.55, 41.35],
];
const MIN_ZOOM = 9.5;

// Neighborhood marker list + filter metadata now live in @/lib/map-neighborhoods
// (shared with the external filter bar). Border polygons are fetched at runtime
// from public/data/neighborhood-borders.json (real OSM boundaries, ODbL).
type Neighborhood = MapNeighborhood;

interface BorderCollection {
  type: "FeatureCollection";
  features: Array<{
    type: "Feature";
    properties: { slug: string; name: string; side: string };
    geometry: { type: string; coordinates: unknown };
  }>;
}

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
  const markerRef = useRef<MarkerInstance>(null);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  // MapLibre's marker DOM gets a generic aria-label="Map marker" by default,
  // which fails WCAG label-in-name when the marker contains visible text
  // (e.g. "GALATA"). Override with the neighborhood name so the accessible
  // name matches the visible label.
  useEffect(() => {
    const el = markerRef.current?.getElement();
    if (el) el.setAttribute("aria-label", neighborhood.name);
  }, [neighborhood.name]);

  return (
    <Marker
      ref={markerRef}
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
          className="relative block h-3.5 w-3.5 rounded-full ring-2 ring-white/90 dark:ring-[#1a1612]/80"
          style={{ backgroundColor: neighborhood.color }}
        />

        <div
          className={cn(
            "absolute top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.25em] transition-all duration-200",
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
              "animate-slide-up-fade absolute bottom-full mb-2 w-48 rounded-md border border-black/10 bg-white/95 p-3 backdrop-blur-sm dark:border-white/10 dark:bg-[#1a1612]/95",
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

interface IstanbulMapProps {
  /** Brand catalogue (defaults to the static seed for client-only use). */
  brands?: NomadBrand[];
  /** Brand branches to plot when their brand filter is on. */
  brandLocations?: BrandLocation[];
  /**
   * Controlled brand filter. When provided, the in-map filter overlay is
   * suppressed and the parent owns the active set + toggling (used by the
   * /map page, which renders the filter bar outside the map). Omit for the
   * old self-contained behaviour (plan editor).
   */
  activeBrands?: Set<string>;
  onToggleBrand?: (slug: string) => void;
  /** Slugs whose OSM border polygon should be highlighted. */
  activeNeighborhoods?: Set<string>;
  /** Hide the in-map brand filter chips (filters live outside the map). */
  hideOverlayFilter?: boolean;
}

export function IstanbulMap({
  brands = defaultBrands,
  brandLocations = defaultBrandLocations,
  activeBrands: controlledBrands,
  onToggleBrand,
  activeNeighborhoods,
  hideOverlayFilter = false,
}: IstanbulMapProps = {}) {
  const tMap = useTranslations("sections.istanbulMap");
  const tCommon = useTranslations("common.side");
  const { theme } = useTheme();
  const [activeMarker, setActiveMarker] = useState<string | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);
  const mapRef = useRef<any>(null);

  // Brand layer: which brands are toggled on, and which branch popup is open.
  // Brands start off so the neighborhood overview stays the default focus.
  // `activeBrands` is controlled when the parent passes a set, else internal.
  const [internalBrands, setInternalBrands] = useState<Set<string>>(new Set());
  const activeBrands = controlledBrands ?? internalBrands;
  const [openLocation, setOpenLocation] = useState<string | null>(null);

  // Real OSM neighborhood boundaries, fetched once on mount (ODbL).
  const [borders, setBorders] = useState<BorderCollection | null>(null);
  useEffect(() => {
    let alive = true;
    fetch("/data/neighborhood-borders.json")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (alive && d) setBorders(d as BorderCollection);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  const toggleBrand = useCallback(
    (slug: string) => {
      if (onToggleBrand) {
        onToggleBrand(slug);
      } else {
        setInternalBrands((prev) => {
          const next = new Set(prev);
          if (next.has(slug)) next.delete(slug);
          else next.add(slug);
          return next;
        });
      }
      setOpenLocation(null);
    },
    [onToggleBrand],
  );

  const activeHoodArr = activeNeighborhoods ? [...activeNeighborhoods] : [];

  const brandsBySlug: Record<string, NomadBrand> = Object.fromEntries(
    brands.map((b) => [b.slug, b]),
  );
  const visibleLocations = brandLocations.filter((l) =>
    activeBrands.has(l.brand_slug),
  );

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
    <div className="absolute inset-0 overflow-hidden rounded-xl border border-black/10 bg-[#d5dce3] dark:border-white/10 dark:bg-[#1a1612]">
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
            maxBounds={ISTANBUL_BOUNDS}
            minZoom={MIN_ZOOM}
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

            {/* Real OSM neighborhood boundaries (ODbL). Always shown subtly so
                you can see the borders; the filter brightens the active ones. */}
            {borders && (
              <Source id="hood-borders" type="geojson" data={borders as never}>
                <Layer
                  id="hood-fill"
                  type="fill"
                  paint={{ "fill-color": "#c9a25e", "fill-opacity": 0.05 }}
                />
                <Layer
                  id="hood-line"
                  type="line"
                  paint={{
                    "line-color": "#c9a25e",
                    "line-width": 0.8,
                    "line-opacity": 0.4,
                  }}
                />
                {activeHoodArr.length > 0 && (
                  <>
                    <Layer
                      id="hood-fill-active"
                      type="fill"
                      filter={[
                        "in",
                        ["get", "slug"],
                        ["literal", activeHoodArr],
                      ]}
                      paint={{ "fill-color": "#f0c674", "fill-opacity": 0.25 }}
                    />
                    <Layer
                      id="hood-line-active"
                      type="line"
                      filter={[
                        "in",
                        ["get", "slug"],
                        ["literal", activeHoodArr],
                      ]}
                      paint={{
                        "line-color": "#f0c674",
                        "line-width": 2.5,
                        "line-opacity": 0.95,
                      }}
                    />
                  </>
                )}
              </Source>
            )}

            {mapNeighborhoods.map((n, i) => (
              <AnimatedMarker
                key={n.name}
                neighborhood={n}
                delay={200 + i * 100}
                onHover={() => setActiveMarker(n.name)}
                onLeave={() => setActiveMarker(null)}
                isActive={activeMarker === n.name}
              />
            ))}

            {/* Brand branches - only the toggled-on brands render. */}
            {visibleLocations.map((loc) => {
              const brand = brandsBySlug[loc.brand_slug];
              if (!brand) return null;
              return (
                <BrandMarker
                  key={loc.id}
                  brand={brand}
                  location={loc}
                  interactive
                  selected={openLocation === loc.id}
                  onSelect={() =>
                    setOpenLocation((prev) => (prev === loc.id ? null : loc.id))
                  }
                />
              );
            })}
          </Map>
        </div>

        {/* Brand filter chips - sit above the legend card, top-left. Hidden
            when the parent renders the filters outside the map (/map page). */}
        {!hideOverlayFilter && (
          <div className="pointer-events-auto absolute inset-x-4 top-4 sm:inset-x-6 sm:top-6">
            <BrandFilterBar
              brands={brands}
              active={activeBrands}
              onToggle={toggleBrand}
            />
          </div>
        )}

        {/* Open brand branch popup - simple card pinned bottom-center. */}
        {openLocation &&
          (() => {
            const loc = visibleLocations.find((l) => l.id === openLocation);
            const brand = loc && brandsBySlug[loc.brand_slug];
            if (!loc || !brand) return null;
            return (
              <div className="pointer-events-auto absolute inset-x-4 top-20 z-10 mx-auto max-w-xs sm:inset-x-auto sm:left-6">
                <div className="rounded-md border border-black/10 bg-white/95 p-3 backdrop-blur-sm dark:border-white/10 dark:bg-[#1a1612]/95">
                  <div className="flex items-center gap-2">
                    <span
                      className="flex items-center justify-center rounded-full bg-white px-1.5 py-0.5"
                      style={{ boxShadow: `0 0 0 1.5px ${brand.color}` }}
                      aria-hidden
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={brand.logo} alt="" className="h-3 w-auto" />
                    </span>
                    <p className="text-xs font-medium text-neutral-900 dark:text-[#d5dce3]">
                      {loc.name}
                    </p>
                  </div>
                  {loc.address && (
                    <p className="mt-1.5 text-[11px] leading-relaxed text-neutral-600 dark:text-[#99a3ad]">
                      {loc.address}
                    </p>
                  )}
                  <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-0.5 text-[10px] uppercase tracking-wider text-[#85929e]">
                    {loc.opening_hours && <span>{loc.opening_hours}</span>}
                    {loc.rating != null && (
                      <span>
                        {loc.rating.toFixed(1)}
                        {loc.reviews_count != null
                          ? ` (${loc.reviews_count}+)`
                          : ""}
                      </span>
                    )}
                  </div>
                  {loc.unverified_fields &&
                    loc.unverified_fields.length > 0 && (
                      <p className="mt-1.5 text-[10px] leading-relaxed text-[#85929e]">
                        Work scores aren&apos;t checked here yet.
                      </p>
                    )}
                </div>
              </div>
            );
          })()}

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

      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-black/5 dark:ring-white/10" />

      <div className="absolute inset-x-4 bottom-4 sm:inset-x-6 sm:bottom-6">
        <div className="rounded-md border border-black/10 bg-white/90 px-5 py-4 backdrop-blur-xl dark:border-white/10 dark:bg-[#1a1612]/88">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="eyebrow">{tMap("eyebrow")}</p>
              <p className="mt-2 max-w-sm text-sm leading-6 text-neutral-700 dark:text-[#99a3ad]">
                {tMap("body")}
              </p>
            </div>
            <div className="hidden rounded-md border border-black/10 bg-white/80 p-2.5 dark:border-white/10 dark:bg-white/10 sm:block">
              <MapPin className="h-4 w-4 text-primary-600 dark:text-primary-400" />
            </div>
          </div>
          <div className="mt-3 flex gap-4 text-xs text-[#5d6d7e] dark:text-[#85929e]">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-accent-warm" />
              {tCommon("european")}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-primary-500" />
              {tCommon("asian")}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-accent-green" />
              {tMap("ferryRoutes")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
