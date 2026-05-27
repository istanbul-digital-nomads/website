"use client";

import { useCallback, useEffect, useMemo, useRef, useState, memo } from "react";
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
import { brands as defaultBrands, type NomadBrand } from "@/lib/brands";
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

// Clamp the viewport to the Istanbul province so the map can't be panned or
// zoomed out to the rest of the world - it's an Istanbul map, nothing else
// belongs on it. [west, south] / [east, north], wide enough to hold all 39
// districts (Silivri/Catalca in the far west to Sile in the far east, the
// Princes' Islands in the south) with a little pan room; minZoom keeps the
// province filling the frame.
const ISTANBUL_BOUNDS: [[number, number], [number, number]] = [
  [27.85, 40.72],
  [30.05, 41.7],
];
const MIN_ZOOM = 8.5;

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

// Bounding box of a (Multi)Polygon geometry's nested coordinate arrays, used to
// frame a neighborhood when its filter chip is selected. Returns [[w,s],[e,n]].
function geometryBounds(
  geometry: { coordinates: unknown } | undefined,
): [[number, number], [number, number]] | null {
  if (!geometry) return null;
  let w = Infinity,
    s = Infinity,
    e = -Infinity,
    n = -Infinity,
    found = false;
  const walk = (node: unknown) => {
    if (!Array.isArray(node)) return;
    if (typeof node[0] === "number" && typeof node[1] === "number") {
      const lng = node[0] as number;
      const lat = node[1] as number;
      w = Math.min(w, lng);
      e = Math.max(e, lng);
      s = Math.min(s, lat);
      n = Math.max(n, lat);
      found = true;
    } else {
      node.forEach(walk);
    }
  };
  walk(geometry.coordinates);
  return found
    ? [
        [w, s],
        [e, n],
      ]
    : null;
}

// Real Istanbul ferry network from OSM (public/data/ferries.json): every
// iskele (ferry port) plus the actual route line geometries. Fetched at
// runtime and rendered in the Bosphorus blue, toggled from the filter bar.
interface FerryPort {
  name: string;
  lng: number;
  lat: number;
}
interface FerryData {
  ports: FerryPort[];
  routes: {
    type: "FeatureCollection";
    features: Array<{
      type: "Feature";
      properties: { name: string; operator: string | null };
      geometry: { type: string; coordinates: unknown };
    }>;
  };
}
const FERRY_BLUE = "#2e9bd6";

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
          className={cn(
            "relative block rounded-full ring-2 ring-white/90 dark:ring-[#1a1612]/80",
            neighborhood.tier === "district" ? "h-2.5 w-2.5" : "h-3.5 w-3.5",
          )}
          style={{ backgroundColor: neighborhood.color }}
        />

        {/* Districts (full-city coverage) stay as bare dots to avoid clutter -
            their name shows in the hover card. Curated spots keep the label. */}
        {neighborhood.tier !== "district" && (
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
        )}

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

// An iskele (ferry port): a small Bosphorus-blue dot with the pier name on hover.
const FerryPortMarker = memo(function FerryPortMarker({
  port,
}: {
  port: FerryPort;
}) {
  return (
    <Marker longitude={port.lng} latitude={port.lat} anchor="center">
      <div className="group relative cursor-pointer">
        <span
          className="block h-2 w-2 rounded-full ring-1 ring-white/80 dark:ring-[#1a1612]/70"
          style={{ backgroundColor: FERRY_BLUE }}
        />
        <span className="pointer-events-none absolute left-1/2 top-3 z-10 -translate-x-1/2 whitespace-nowrap rounded bg-[#0f1722]/90 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-[#d5e8f5] opacity-0 transition-opacity duration-150 group-hover:opacity-100">
          {port.name}
        </span>
      </div>
    </Marker>
  );
});

// One brand branch, as stored in public/data/brand-locations.json (a GeoJSON
// FeatureCollection of every Istanbul branch we've collected from the official
// store locators). Far too many points (~490) for DOM markers, so they render
// as a single MapLibre circle layer instead.
interface BrandPoint {
  id: string;
  brand: string;
  name: string;
  address: string | null;
  district: string | null;
  lng: number;
  lat: number;
}
interface BrandFeatureCollection {
  type: "FeatureCollection";
  features: Array<{
    type: "Feature";
    geometry: { type: "Point"; coordinates: [number, number] };
    properties: Omit<BrandPoint, "lng" | "lat">;
  }>;
}

interface IstanbulMapProps {
  /** Brand catalogue (defaults to the static seed for client-only use). */
  brands?: NomadBrand[];
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
  /** Hide the bottom legend/caption card (redundant on the /map page). */
  hideLegend?: boolean;
  /** Show the iskele (ferry ports). Defaults on. */
  showFerryPorts?: boolean;
  /** Show the ferry route lines. Defaults on. */
  showFerryRoutes?: boolean;
}

export function IstanbulMap({
  brands = defaultBrands,
  activeBrands: controlledBrands,
  onToggleBrand,
  activeNeighborhoods,
  hideOverlayFilter = false,
  hideLegend = false,
  showFerryPorts = true,
  showFerryRoutes = true,
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
  // The clicked branch (drives the popup card). Holds the feature's props +
  // its coordinates so we don't need to look it up again.
  const [selectedFeature, setSelectedFeature] = useState<BrandPoint | null>(
    null,
  );
  const [cursor, setCursor] = useState<string>("");
  // The brand logos are rasterised into the map as icons on load; the symbol
  // layer only renders once they're registered.
  const [iconsReady, setIconsReady] = useState(false);

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

  // Real Istanbul ferry network (iskele + routes) from OSM. Only fetched when
  // the ferry layer is on.
  const [ferries, setFerries] = useState<FerryData | null>(null);
  useEffect(() => {
    if ((!showFerryPorts && !showFerryRoutes) || ferries) return;
    let alive = true;
    fetch("/data/ferries.json")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (alive && d) setFerries(d as FerryData);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [showFerryPorts, showFerryRoutes, ferries]);

  // Every Istanbul branch of every brand (from the official store locators),
  // fetched once the first brand filter is switched on. ~490 points, so they
  // render as a MapLibre circle layer rather than DOM markers.
  const [brandPoints, setBrandPoints] = useState<BrandFeatureCollection | null>(
    null,
  );
  useEffect(() => {
    if (activeBrands.size === 0 || brandPoints) return;
    let alive = true;
    fetch("/data/brand-locations.json")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (alive && d) setBrandPoints(d as BrandFeatureCollection);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [activeBrands, brandPoints]);

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
      setSelectedFeature(null);
    },
    [onToggleBrand],
  );

  const activeHoodArr = activeNeighborhoods ? [...activeNeighborhoods] : [];

  const brandsBySlug: Record<string, NomadBrand> = Object.fromEntries(
    brands.map((b) => [b.slug, b]),
  );

  // Only the toggled-on brands' branches get plotted. Memoised so the GeoJSON
  // source isn't rebuilt on every render.
  const brandFC = useMemo<BrandFeatureCollection>(() => {
    if (!brandPoints || activeBrands.size === 0) {
      return { type: "FeatureCollection", features: [] };
    }
    return {
      type: "FeatureCollection",
      features: brandPoints.features.filter((f) =>
        activeBrands.has(f.properties.brand),
      ),
    };
  }, [brandPoints, activeBrands]);

  // Colour each dot by its brand, in sync with the brand catalogue. BEX's near
  // black brand colour stays legible thanks to the white stroke below.
  const brandColorExpr = useMemo(() => {
    const expr: (string | string[])[] = ["match", ["get", "brand"]];
    for (const b of brands) expr.push(b.slug, b.color);
    expr.push("#888888");
    return expr as unknown as never;
  }, [brands]);

  const onBrandClick = useCallback((e: { features?: unknown[] }) => {
    const f = e.features?.[0] as
      | {
          geometry?: { coordinates?: [number, number] };
          properties?: Omit<BrandPoint, "lng" | "lat">;
        }
      | undefined;
    if (f?.properties && f.geometry?.coordinates) {
      const [lng, lat] = f.geometry.coordinates;
      setSelectedFeature({ ...f.properties, lng, lat });
    } else {
      setSelectedFeature(null);
    }
  }, []);

  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  const onLoad = useCallback(() => {
    setMapLoaded(true);
    const map = mapRef.current?.getMap();
    if (!map) return;
    map.on("error", () => setMapError(true));
    // Simplified zoom-in - shorter duration for better perceived perf
    map.flyTo({
      center: [ISTANBUL_CENTER.longitude, ISTANBUL_CENTER.latitude],
      zoom: INITIAL_ZOOM + 0.3,
      duration: 800,
      easing: (t: number) => t * (2 - t),
    });

    // Rasterise each brand logo onto a white circular pill (with the brand's
    // colour as a ring) and register it as a map image, so the symbol layer
    // can show the real logo on a dot wherever there's room.
    const SIZE = 48;
    const RING = 22;
    let pending = brands.length;
    const done = () => {
      if (--pending <= 0) setIconsReady(true);
    };
    if (pending === 0) {
      setIconsReady(true);
      return;
    }
    for (const b of brands) {
      const id = `brand-${b.slug}`;
      if (map.hasImage(id)) {
        done();
        continue;
      }
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          canvas.width = SIZE;
          canvas.height = SIZE;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.beginPath();
            ctx.arc(SIZE / 2, SIZE / 2, RING, 0, Math.PI * 2);
            ctx.fillStyle = "#ffffff";
            ctx.fill();
            ctx.lineWidth = 3;
            ctx.strokeStyle = b.color;
            ctx.stroke();
            const box = SIZE - 22; // padding inside the pill
            const iw = img.naturalWidth || img.width || box;
            const ih = img.naturalHeight || img.height || box;
            const ratio = Math.min(box / iw, box / ih) || 1;
            const w = iw * ratio;
            const h = ih * ratio;
            ctx.drawImage(img, (SIZE - w) / 2, (SIZE - h) / 2, w, h);
            const data = ctx.getImageData(0, 0, SIZE, SIZE);
            if (!map.hasImage(id)) map.addImage(id, data, { pixelRatio: 2 });
          }
        } catch {
          // ignore - the dot still renders without a logo
        }
        done();
      };
      img.onerror = done;
      img.src = b.logo;
    }
  }, [brands]);

  // Selecting a neighborhood in the filter focuses it on the map (like clicking
  // its point): fit to the real border polygon when we have one, else fly to
  // the marker point. Only fires for newly-added slugs, not on deselect.
  const prevHoodsRef = useRef<Set<string>>(new Set());
  useEffect(() => {
    // Wait until the map is ready before recording/acting, so a neighborhood
    // selected during initial load still gets focused once the map loads.
    if (!mapLoaded) return;
    const current = activeNeighborhoods ?? new Set<string>();
    const added = [...current].filter((s) => !prevHoodsRef.current.has(s));
    prevHoodsRef.current = new Set(current);
    if (!added.length) return;
    const slug = added[added.length - 1];
    const map = mapRef.current?.getMap();
    if (!map) return;
    const feature = borders?.features.find((f) => f.properties.slug === slug);
    const bounds = geometryBounds(feature?.geometry);
    if (bounds) {
      map.fitBounds(bounds, { padding: 64, maxZoom: 14.5, duration: 900 });
      return;
    }
    const point = mapNeighborhoods.find((x) => x.slug === slug);
    if (point) {
      map.flyTo({ center: [point.lng, point.lat], zoom: 14, duration: 900 });
    }
  }, [activeNeighborhoods, borders, mapLoaded]);

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
            // One finger scrolls the page past the map; two fingers (or
            // ctrl/cmd + scroll on desktop) pan/zoom it. Keeps the tall mobile
            // map from trapping the page scroll.
            cooperativeGestures
            attributionControl={false}
            onLoad={onLoad}
            cursor={cursor}
            interactiveLayerIds={["brand-circles", "brand-logos"]}
            onClick={onBrandClick}
            onMouseEnter={() => setCursor("pointer")}
            onMouseLeave={() => setCursor("")}
          >
            <NavigationControl position="top-right" showCompass={false} />

            {/* Real Istanbul ferry routes (OSM) in Bosphorus blue. */}
            {showFerryRoutes && ferries && (
              <Source
                id="ferry-routes"
                type="geojson"
                data={ferries.routes as never}
              >
                <Layer
                  id="ferry-glow"
                  source="ferry-routes"
                  type="line"
                  paint={{
                    "line-color": FERRY_BLUE,
                    "line-width": 6,
                    "line-blur": 5,
                    "line-opacity": 0.25,
                  }}
                />
                <Layer
                  id="ferry-line"
                  source="ferry-routes"
                  type="line"
                  paint={{
                    "line-color": FERRY_BLUE,
                    "line-width": 1.6,
                    "line-opacity": 0.85,
                    "line-dasharray": [2, 2.5],
                  }}
                />
              </Source>
            )}

            {/* Real OSM neighborhood boundaries (ODbL). Always shown subtly so
                you can see the borders; the filter brightens the active ones. */}
            {borders && (
              <Source id="hood-borders" type="geojson" data={borders as never}>
                <Layer
                  id="hood-fill"
                  source="hood-borders"
                  type="fill"
                  paint={{ "fill-color": "#c9a25e", "fill-opacity": 0.05 }}
                />
                <Layer
                  id="hood-line"
                  source="hood-borders"
                  type="line"
                  paint={{
                    "line-color": "#c9a25e",
                    "line-width": 0.8,
                    "line-opacity": 0.4,
                  }}
                />
                {/* Active highlight - explicit `source` because these aren't
                    direct <Source> children, so the source context isn't
                    injected for them. */}
                {activeHoodArr.length > 0 && (
                  <Layer
                    id="hood-fill-active"
                    source="hood-borders"
                    type="fill"
                    filter={["in", ["get", "slug"], ["literal", activeHoodArr]]}
                    paint={{ "fill-color": "#ffd166", "fill-opacity": 0.32 }}
                  />
                )}
                {activeHoodArr.length > 0 && (
                  <Layer
                    id="hood-line-active"
                    source="hood-borders"
                    type="line"
                    filter={["in", ["get", "slug"], ["literal", activeHoodArr]]}
                    paint={{
                      "line-color": "#ffd166",
                      "line-width": 3.5,
                      "line-opacity": 1,
                    }}
                  />
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

            {/* Brand branches - every Istanbul branch of the toggled-on brands,
                drawn as one circle layer (hundreds of points). Click a dot for
                its name + address. */}
            {brandFC.features.length > 0 && (
              <Source id="brand-points" type="geojson" data={brandFC as never}>
                <Layer
                  id="brand-glow"
                  source="brand-points"
                  type="circle"
                  paint={{
                    "circle-color": brandColorExpr,
                    "circle-opacity": 0.18,
                    "circle-blur": 0.6,
                    "circle-radius": [
                      "interpolate",
                      ["linear"],
                      ["zoom"],
                      9,
                      5,
                      13,
                      9,
                      16,
                      14,
                    ],
                  }}
                />
                <Layer
                  id="brand-circles"
                  source="brand-points"
                  type="circle"
                  paint={{
                    "circle-color": brandColorExpr,
                    "circle-opacity": 0.95,
                    "circle-stroke-color": "#ffffff",
                    "circle-stroke-width": 1.2,
                    "circle-radius": [
                      "interpolate",
                      ["linear"],
                      ["zoom"],
                      9,
                      2.5,
                      13,
                      4.5,
                      16,
                      7,
                    ],
                  }}
                />
                {/* Real brand logos on a white pill. Collision detection
                    (allow-overlap false) declutters them, so a few show at the
                    province overview and more pop in as you zoom into an area;
                    the coloured dot underneath always marks every branch. */}
                {iconsReady && (
                  <Layer
                    id="brand-logos"
                    source="brand-points"
                    type="symbol"
                    layout={{
                      "icon-image": ["concat", "brand-", ["get", "brand"]],
                      "icon-size": [
                        "interpolate",
                        ["linear"],
                        ["zoom"],
                        10,
                        0.4,
                        13,
                        0.6,
                        16,
                        0.85,
                      ],
                      "icon-allow-overlap": false,
                      "icon-padding": 2,
                    }}
                  />
                )}
              </Source>
            )}

            {/* Iskele - every Istanbul ferry port. */}
            {showFerryPorts &&
              ferries?.ports.map((port) => (
                <FerryPortMarker key={`${port.name}-${port.lng}`} port={port} />
              ))}
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

        {/* Open brand branch popup - simple card pinned top-left. */}
        {selectedFeature &&
          (() => {
            const brand = brandsBySlug[selectedFeature.brand];
            if (!brand) return null;
            return (
              <div className="pointer-events-auto absolute inset-x-4 top-20 z-10 mx-auto max-w-xs sm:inset-x-auto sm:left-6">
                <div className="rounded-md border border-black/10 bg-white/95 p-3 backdrop-blur-sm dark:border-white/10 dark:bg-[#1a1612]/95">
                  <div className="flex items-center justify-between gap-2">
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
                        {selectedFeature.name}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedFeature(null)}
                      className="text-neutral-400 hover:text-neutral-700 dark:hover:text-[#d5dce3]"
                      aria-label="Close"
                    >
                      ×
                    </button>
                  </div>
                  {selectedFeature.address && (
                    <p className="mt-1.5 text-[11px] leading-relaxed text-neutral-600 dark:text-[#99a3ad]">
                      {selectedFeature.address}
                    </p>
                  )}
                  {selectedFeature.district && (
                    <p className="mt-1.5 text-[10px] uppercase tracking-wider text-[#85929e]">
                      {selectedFeature.district}
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

      {!hideLegend && (
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
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: FERRY_BLUE }}
                />
                {tMap("ferryRoutes")}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
