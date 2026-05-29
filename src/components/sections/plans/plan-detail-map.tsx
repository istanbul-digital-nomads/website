"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import MapGL, {
  Marker,
  Popup,
  Source,
  Layer,
  type MapRef,
} from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import {
  Loader2,
  MapPin,
  Pause,
  Play,
  RotateCcw,
  Wallet,
  X,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useTheme } from "@/components/layout/theme-provider";
import { spaces } from "@/lib/spaces";
import { cn } from "@/lib/utils";
import { VIBE_ICONS, type PlanVibe } from "@/lib/plans/vibes";
import { TRANSPORT_ICONS } from "@/lib/plans/transport";
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

// How long the animation lingers on each stop before advancing.
const STEP_MS = 2600;

const ROUTE_COLOR = "#c0392b";

// Approximate center coordinates for every neighbourhood slug the plan
// composer can produce. Covers all slugs in neighborhoods.ts plus common
// alternatives used in free-text neighbourhood fields.
// Coordinates are [lng, lat] (GeoJSON / MapLibre order).
const NEIGHBORHOOD_CENTERS: Record<string, [number, number]> = {
  kadikoy: [29.0228, 40.9902],
  moda: [29.02, 40.9815],
  cihangir: [28.9818, 41.0293],
  besiktas: [29.0044, 41.0425],
  galata: [28.9747, 41.0246],
  karakoy: [28.9747, 41.0246], // same area as Galata
  beyoglu: [28.9758, 41.0336],
  taksim: [28.9784, 41.037],
  uskudar: [29.015, 41.023],
  nisantasi: [28.9919, 41.0491],
  levent: [28.9988, 41.0773],
  balat: [28.946, 41.0278],
  atasehir: [29.1157, 40.9847],
  sisli: [28.987, 41.06],
  fatih: [28.95, 41.02],
  sultanahmet: [28.973, 41.0055],
  bakirkoy: [28.87, 40.98],
  sariyer: [29.057, 41.166],
  bebek: [29.044, 41.0792],
  ortakoy: [29.0267, 41.047],
  bosphorus: [29.033, 41.06],
  arnavutkoy: [29.0381, 41.0614],
  etiler: [29.0305, 41.0733],
  maslak: [29.0143, 41.1095],
  eminonu: [28.971, 41.015],
  sirkeci: [28.979, 41.0128],
  kumkapi: [28.953, 41.001],
  yenikoy: [29.053, 41.122],
  tarabya: [29.06, 41.143],
};

function stopName(stop: PlanStop): string {
  if (stop.space_id) {
    const sp = spaces.find((s) => s.id === stop.space_id);
    if (sp) return sp.name;
  }
  return stop.custom_location ?? stop.neighborhood_slug ?? "Stop";
}

function stopLatLng(stop: PlanStop): {
  lat: number;
  lng: number;
  approximate?: boolean;
} | null {
  // 1. Exact coordinates on the stop record.
  if (stop.lat != null && stop.lng != null) {
    return { lat: Number(stop.lat), lng: Number(stop.lng) };
  }
  // 2. Matched space in the static catalog.
  if (stop.space_id) {
    const sp = spaces.find((s) => s.id === stop.space_id);
    if (sp) return { lat: sp.coordinates[1], lng: sp.coordinates[0] };
  }
  // 3. Neighbourhood center fallback.
  if (stop.neighborhood_slug) {
    const center = NEIGHBORHOOD_CENTERS[stop.neighborhood_slug];
    if (center) return { lat: center[1], lng: center[0], approximate: true };
  }
  return null;
}

// When multiple stops land on the exact same coordinate (e.g. two stops
// both fall back to the same neighbourhood center), spread them in a
// small circle (~60 m radius) so they're all visible and the route line
// is non-zero-length.
function dedupePositions(
  items: Array<{
    stop: PlanStop;
    pos: { lat: number; lng: number; approximate?: boolean };
  }>,
) {
  const seen = new Map<string, number>();
  return items.map((item) => {
    const key = `${item.pos.lat.toFixed(4)},${item.pos.lng.toFixed(4)}`;
    const count = seen.get(key) ?? 0;
    seen.set(key, count + 1);
    if (count === 0) return item;
    // Offset duplicates in a 60m radius circle (0.0006° ≈ 66 m).
    const angle = (count * 137.5 * Math.PI) / 180; // golden angle spread
    return {
      ...item,
      pos: {
        ...item.pos,
        lat: item.pos.lat + 0.0006 * Math.sin(angle),
        lng: item.pos.lng + 0.0006 * Math.cos(angle),
        approximate: true,
      },
    };
  });
}

interface Props {
  stops: PlanStop[];
}

export function PlanDetailMap({ stops }: Props) {
  const { theme } = useTheme();
  const tVibes = useTranslations("plans.vibes");
  const tTransport = useTranslations("plans.transport");
  const mapRef = useRef<MapRef>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  // Animation: index of the stop currently in focus + whether we're playing.
  const [stopIdx, setStopIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  const positioned = useMemo(() => {
    const resolved = stops
      .map((stop) => ({ stop, pos: stopLatLng(stop) }))
      .filter(
        (
          x,
        ): x is {
          stop: PlanStop;
          pos: NonNullable<ReturnType<typeof stopLatLng>>;
        } => x.pos !== null,
      );
    return dedupePositions(resolved);
  }, [stops]);

  // Faint dashed line through every stop (the whole route).
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

  // Solid trail up to (and including) the focused stop - grows while playing.
  const trailGeo = useMemo(() => {
    const coords = positioned
      .slice(0, stopIdx + 1)
      .map((p) => [p.pos.lng, p.pos.lat]);
    if (coords.length < 2) return null;
    return {
      type: "FeatureCollection" as const,
      features: [
        {
          type: "Feature" as const,
          properties: {},
          geometry: { type: "LineString" as const, coordinates: coords },
        },
      ],
    };
  }, [positioned, stopIdx]);

  const fitAll = useCallback(() => {
    const map = mapRef.current?.getMap();
    if (!map || positioned.length === 0) return;
    map.resize();
    if (positioned.length === 1) {
      map.flyTo({
        center: [positioned[0]!.pos.lng, positioned[0]!.pos.lat],
        zoom: 14,
        duration: 600,
      });
      return;
    }
    const lngs = positioned.map((p) => p.pos.lng);
    const lats = positioned.map((p) => p.pos.lat);
    map.fitBounds(
      [
        [Math.min(...lngs), Math.min(...lats)],
        [Math.max(...lngs), Math.max(...lats)],
      ],
      { padding: 80, maxZoom: 14, duration: 600 },
    );
  }, [positioned]);

  const handleLoad = useCallback(() => {
    setMapLoaded(true);
    fitAll();
  }, [fitAll]);

  // Flag ready on client-side remounts too: on a warm-cache <Link> nav the
  // MapLibre `load` event can fire before react-map-gl binds `onLoad`, which
  // would freeze the map at the world view. Grab the instance and either read
  // its already-loaded state or attach our own one-shot listener.
  useEffect(() => {
    const map = mapRef.current?.getMap();
    if (!map) return;
    if (map.loaded()) {
      handleLoad();
      return;
    }
    map.once("load", handleLoad);
    return () => {
      map.off("load", handleLoad);
    };
  }, [handleLoad]);

  // Auto-advance through the stops while playing; stop at the end.
  useEffect(() => {
    if (!isPlaying) return;
    const id = window.setTimeout(() => {
      setStopIdx((i) => {
        if (i >= positioned.length - 1) {
          setIsPlaying(false);
          return i;
        }
        return i + 1;
      });
    }, STEP_MS);
    return () => window.clearTimeout(id);
  }, [isPlaying, stopIdx, positioned.length]);

  // Fly the camera to the focused stop while playing.
  useEffect(() => {
    if (!mapLoaded || !isPlaying) return;
    const map = mapRef.current?.getMap();
    const p = positioned[stopIdx];
    if (!map || !p) return;
    map.flyTo({
      center: [p.pos.lng, p.pos.lat],
      zoom: 14.6,
      duration: 1200,
      essential: true,
    });
  }, [stopIdx, isPlaying, mapLoaded, positioned]);

  const play = useCallback(() => {
    setStopIdx((i) => (i >= positioned.length - 1 ? 0 : i));
    setIsPlaying(true);
  }, [positioned.length]);
  const pause = useCallback(() => setIsPlaying(false), []);
  const reset = useCallback(() => {
    setStopIdx(0);
    setIsPlaying(false);
    fitAll();
  }, [fitAll]);

  // Close popup on map click (outside a marker).
  const handleMapClick = useCallback(() => {
    setSelectedIdx(null);
  }, []);

  if (positioned.length === 0) return null;

  const selected = selectedIdx !== null ? positioned[selectedIdx] : null;
  const focused = positioned[stopIdx];
  const canAnimate = positioned.length > 1;

  return (
    <div
      className={cn(
        "relative h-[280px] w-full overflow-hidden rounded-lg border border-ink-3 sm:h-[360px]",
        isDark ? "bg-[#1a1d27]" : "bg-[#e8e0d4]",
      )}
    >
      <MapGL
        ref={mapRef}
        mapStyle={isDark ? DARK_STYLE : LIGHT_STYLE}
        initialViewState={{ ...ISTANBUL_CENTER, zoom: 11.3 }}
        style={{ width: "100%", height: "100%" }}
        attributionControl={false}
        maxBounds={ISTANBUL_BOUNDS}
        minZoom={10}
        maxZoom={17}
        onLoad={handleLoad}
        onClick={handleMapClick}
        interactive
      >
        {/* Faint full route + solid growing trail - gated on mapLoaded to
            avoid a GL style race. */}
        {mapLoaded && routeGeo && (
          <Source id="plan-route" type="geojson" data={routeGeo}>
            <Layer
              id="plan-route-line"
              type="line"
              paint={{
                "line-color": ROUTE_COLOR,
                "line-width": 2,
                "line-opacity": 0.3,
                "line-dasharray": [2, 2.5],
              }}
            />
          </Source>
        )}
        {mapLoaded && trailGeo && (
          <Source id="plan-trail" type="geojson" data={trailGeo}>
            <Layer
              id="plan-trail-glow"
              type="line"
              paint={{
                "line-color": ROUTE_COLOR,
                "line-width": 9,
                "line-blur": 6,
                "line-opacity": 0.3,
              }}
            />
            <Layer
              id="plan-trail-line"
              type="line"
              paint={{
                "line-color": ROUTE_COLOR,
                "line-width": 3,
                "line-opacity": 0.95,
              }}
            />
          </Source>
        )}

        {/* Transport chips at the midpoint of each leg (walk / ferry / …). */}
        {positioned.map(({ stop }, i) => {
          if (i === 0 || !stop.transport_mode) return null;
          const prev = positioned[i - 1]!;
          const cur = positioned[i]!;
          const TransportIcon = TRANSPORT_ICONS[stop.transport_mode];
          const activeLeg = isPlaying && i === stopIdx;
          return (
            <Marker
              key={`leg-${stop.id}`}
              longitude={(prev.pos.lng + cur.pos.lng) / 2}
              latitude={(prev.pos.lat + cur.pos.lat) / 2}
              anchor="center"
            >
              <span
                title={tTransport(stop.transport_mode)}
                aria-label={tTransport(stop.transport_mode)}
                className={cn(
                  "flex h-5 w-5 items-center justify-center rounded-full border shadow transition-transform",
                  isDark
                    ? "border-white/15 bg-[#1c2030] text-paper"
                    : "border-black/10 bg-white text-neutral-700",
                  activeLeg && "scale-125",
                )}
                style={
                  activeLeg
                    ? { boxShadow: `0 0 0 3px ${ROUTE_COLOR}55` }
                    : undefined
                }
              >
                <TransportIcon className="h-3 w-3" aria-hidden />
              </span>
            </Marker>
          );
        })}

        {/* Stop markers - vibe icon, highlighted by animation state. */}
        {positioned.map(({ stop, pos }, i) => {
          const Icon = VIBE_ICONS[stop.vibe as PlanVibe] ?? MapPin;
          const active = i === stopIdx;
          const visited = i < stopIdx;
          return (
            <Marker
              key={stop.id}
              longitude={pos.lng}
              latitude={pos.lat}
              anchor="center"
              onClick={(e) => {
                e.originalEvent.stopPropagation();
                setSelectedIdx(i === selectedIdx ? null : i);
                setStopIdx(i);
                setIsPlaying(false);
              }}
            >
              <span
                aria-label={`${stopName(stop)}${pos.approximate ? " (approximate area)" : ""}`}
                title={stopName(stop)}
                className={cn(
                  "flex cursor-pointer items-center justify-center rounded-full border-2 shadow-md transition-all",
                  active
                    ? "h-9 w-9 scale-105 border-paper bg-terracotta text-paper"
                    : visited
                      ? "h-7 w-7 border-paper/80 bg-terracotta/90 text-paper"
                      : "h-7 w-7 border-paper/60 bg-terracotta/30 text-paper hover:scale-110",
                  pos.approximate && "border-dashed",
                )}
                style={
                  active
                    ? { boxShadow: `0 0 0 4px ${ROUTE_COLOR}55` }
                    : undefined
                }
              >
                <Icon
                  className={active ? "h-4 w-4" : "h-3.5 w-3.5"}
                  aria-hidden
                />
              </span>
            </Marker>
          );
        })}

        {/* Click popup */}
        {selected && selectedIdx !== null && (
          <Popup
            longitude={selected.pos.lng}
            latitude={selected.pos.lat}
            anchor="bottom"
            offset={[0, -14] as [number, number]}
            closeButton={false}
            closeOnClick={false}
            onClose={() => setSelectedIdx(null)}
            className="plan-stop-popup"
          >
            <div
              className="min-w-[160px] max-w-[230px] rounded-lg border border-ink-3 p-3 shadow-xl"
              style={{
                background: isDark ? "#1c2030" : "#ffffff",
                color: isDark ? "#e8dfd4" : "#1a1a1a",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Vibe icon + name */}
              <div className="mb-1.5 flex items-start gap-2">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-terracotta text-paper">
                  {(() => {
                    const Icon =
                      VIBE_ICONS[selected.stop.vibe as PlanVibe] ?? MapPin;
                    return <Icon className="h-3 w-3" aria-hidden />;
                  })()}
                </span>
                <p className="text-[13px] font-medium leading-snug">
                  {stopName(selected.stop)}
                </p>
                <button
                  type="button"
                  onClick={() => setSelectedIdx(null)}
                  className="ml-auto shrink-0 opacity-50 hover:opacity-100"
                  aria-label="Close"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Vibe + time */}
              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                {selected.stop.vibe && (
                  <span className="font-mono text-[10px] uppercase tracking-wider opacity-60">
                    {tVibes(selected.stop.vibe)}
                  </span>
                )}
                {selected.stop.start_time && (
                  <span className="font-mono text-[10px] uppercase tracking-wider text-terracotta">
                    {selected.stop.start_time.slice(0, 5)}
                    {selected.stop.end_time
                      ? ` - ${selected.stop.end_time.slice(0, 5)}`
                      : ""}
                  </span>
                )}
              </div>

              {/* Transport used to arrive here */}
              {selectedIdx > 0 && selected.stop.transport_mode && (
                <div className="mt-1.5 flex items-center gap-1">
                  {(() => {
                    const TransportIcon =
                      TRANSPORT_ICONS[selected.stop.transport_mode];
                    return (
                      <TransportIcon
                        className="h-3 w-3 shrink-0 text-terracotta"
                        aria-hidden
                      />
                    );
                  })()}
                  <span className="font-mono text-[10px] uppercase tracking-wider opacity-70">
                    {tTransport(selected.stop.transport_mode)}
                    {selected.stop.transport_price_min != null ||
                    selected.stop.transport_price_max != null
                      ? ` · ₺${selected.stop.transport_price_min ?? selected.stop.transport_price_max}`
                      : ""}
                  </span>
                </div>
              )}

              {/* Notes */}
              {selected.stop.notes && (
                <p className="mt-1.5 line-clamp-3 text-[11px] leading-relaxed opacity-70">
                  {selected.stop.notes}
                </p>
              )}

              {/* Cost */}
              {(selected.stop.cost_min_cents != null ||
                selected.stop.cost_max_cents != null) && (
                <div className="mt-1.5 flex items-center gap-1">
                  <Wallet className="h-3 w-3 shrink-0 text-moss" aria-hidden />
                  <span className="font-mono text-[10px] uppercase tracking-wider opacity-70">
                    {selected.stop.cost_min_cents != null &&
                    selected.stop.cost_max_cents != null &&
                    selected.stop.cost_max_cents !==
                      selected.stop.cost_min_cents
                      ? `₺${selected.stop.cost_min_cents / 100} - ₺${selected.stop.cost_max_cents / 100}`
                      : `₺${(selected.stop.cost_min_cents ?? selected.stop.cost_max_cents)! / 100}`}
                  </span>
                </div>
              )}

              {/* Approximate location warning */}
              {selected.pos.approximate && (
                <p className="mt-1.5 text-[10px] italic opacity-40">
                  Approximate area - no exact pin
                </p>
              )}
            </div>
          </Popup>
        )}
      </MapGL>

      {/* Playback controls */}
      {canAnimate && (
        <div className="pointer-events-auto absolute inset-x-3 bottom-3 flex items-center justify-between gap-2 rounded-full border border-black/10 bg-white/90 px-2.5 py-1.5 backdrop-blur dark:border-white/10 dark:bg-[#1a1d27]/90">
          <button
            type="button"
            onClick={isPlaying ? pause : play}
            className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium text-neutral-900 transition-colors hover:bg-black/5 dark:text-paper dark:hover:bg-white/10"
            aria-label={isPlaying ? "Pause walkthrough" : "Play walkthrough"}
          >
            {isPlaying ? (
              <Pause className="h-3.5 w-3.5" aria-hidden />
            ) : (
              <Play className="h-3.5 w-3.5" aria-hidden />
            )}
            {isPlaying ? "Pause" : "Play"}
          </button>
          <span className="min-w-0 flex-1 truncate text-center font-mono text-[10px] uppercase tracking-wider text-neutral-500 dark:text-paper-mute">
            {stopIdx + 1}/{positioned.length}
            {focused ? ` · ${stopName(focused.stop)}` : ""}
          </span>
          <button
            type="button"
            onClick={reset}
            className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs text-neutral-700 transition-colors hover:bg-black/5 dark:text-paper-dim dark:hover:bg-white/10"
            aria-label="Reset walkthrough"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden />
          </button>
        </div>
      )}

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
