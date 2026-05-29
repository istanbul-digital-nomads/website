"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Map, {
  Marker,
  Source,
  Layer,
  NavigationControl,
  type MapRef,
} from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { Play, Pause, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/layout/theme-provider";
import { aliMember, aliWeek, type AliDayPlan } from "@/lib/ali-week";

const MAP_STYLE_LIGHT =
  "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json";
const MAP_STYLE_DARK =
  "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json";

// Per-day theme colour for the route line + active stop ring. Keeps the
// week visually distinct as you tab between days.
const NEIGHBORHOOD_COLOR: Record<AliDayPlan["neighborhood"], string> = {
  Kadıköy: "#c0392b",
  Şişli: "#2980b9",
  Beyoğlu: "#d4a24e",
};

const STEP_MS = 2800;

function dayBounds(day: AliDayPlan): [[number, number], [number, number]] {
  const lngs = day.stops.map((s) => s.lng);
  const lats = day.stops.map((s) => s.lat);
  return [
    [Math.min(...lngs), Math.min(...lats)],
    [Math.max(...lngs), Math.max(...lats)],
  ];
}

// "Mon 1 Jun" - keeps the day chip compact.
function shortDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

interface NumberedMarkerProps {
  n: number;
  lng: number;
  lat: number;
  active: boolean;
  visited: boolean;
  color: string;
  onClick: () => void;
}

function NumberedMarker({
  n,
  lng,
  lat,
  active,
  visited,
  color,
  onClick,
}: NumberedMarkerProps) {
  return (
    <Marker longitude={lng} latitude={lat} anchor="center">
      <button
        type="button"
        onClick={onClick}
        aria-label={`Stop ${n}`}
        className={cn(
          "relative flex h-7 w-7 items-center justify-center rounded-full border-2 text-[11px] font-bold transition-all",
          active
            ? "scale-125 border-white bg-white shadow-lg"
            : visited
              ? "border-white/80 bg-white/95"
              : "border-white/60 bg-white/80",
        )}
        style={{
          color: active || visited ? color : "#5d6d7e",
          boxShadow: active ? `0 0 0 4px ${color}66` : undefined,
        }}
      >
        {n}
      </button>
    </Marker>
  );
}

interface Props {
  initialDay?: number; // 1..7
}

export function AliWeekMap({ initialDay = 1 }: Props) {
  const { theme } = useTheme();
  const mapRef = useRef<MapRef>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [dayIdx, setDayIdx] = useState(
    Math.min(6, Math.max(0, initialDay - 1)),
  );
  const [stopIdx, setStopIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const day = aliWeek[dayIdx]!;
  const color = NEIGHBORHOOD_COLOR[day.neighborhood];

  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  // Full route (faint dashed) - all stops of the active day.
  const routeFull = useMemo(
    () => ({
      type: "FeatureCollection" as const,
      features: [
        {
          type: "Feature" as const,
          properties: {},
          geometry: {
            type: "LineString" as const,
            coordinates: day.stops.map((s) => [s.lng, s.lat]),
          },
        },
      ],
    }),
    [day],
  );

  // Trail - the solid portion of the route up to (and including) the current
  // stop. Grows as the animation advances.
  const routeTrail = useMemo(() => {
    const coords = day.stops.slice(0, stopIdx + 1).map((s) => [s.lng, s.lat]);
    return {
      type: "FeatureCollection" as const,
      features:
        coords.length > 1
          ? [
              {
                type: "Feature" as const,
                properties: {},
                geometry: {
                  type: "LineString" as const,
                  coordinates: coords,
                },
              },
            ]
          : [],
    };
  }, [day, stopIdx]);

  // Reliably flag the map as loaded - including on client-side navigation.
  // On a Next <Link> remount the basemap style/tiles are usually warm in the
  // HTTP cache, so MapLibre's `load` event can fire before react-map-gl's
  // `onLoad` prop binds, leaving `mapLoaded` stuck false and the camera frozen
  // at the initial world view. We grab the instance ourselves the moment it
  // exists and either read its already-loaded state or attach our own one-shot
  // listener. `resize()` covers the case where the container was measured at
  // zero size mid-transition, which leaves the canvas blank until nudged.
  useEffect(() => {
    const map = mapRef.current?.getMap();
    if (!map) return;
    const markReady = () => {
      setMapLoaded(true);
      map.resize();
    };
    if (map.loaded()) {
      markReady();
      return;
    }
    map.once("load", markReady);
    return () => {
      map.off("load", markReady);
    };
  }, []);

  // Fit bounds when the day changes (and on initial load).
  useEffect(() => {
    if (!mapLoaded) return;
    const map = mapRef.current?.getMap();
    if (!map) return;
    map.fitBounds(dayBounds(day), {
      padding: { top: 80, bottom: 80, left: 60, right: 60 },
      duration: 900,
      maxZoom: 15.5,
    });
  }, [day, mapLoaded]);

  // Fly to the active stop while playing.
  useEffect(() => {
    if (!mapLoaded) return;
    const map = mapRef.current?.getMap();
    if (!map) return;
    const stop = day.stops[stopIdx];
    if (!stop) return;
    if (isPlaying) {
      map.flyTo({
        center: [stop.lng, stop.lat],
        zoom: 15.2,
        duration: 1400,
        essential: true,
      });
    }
  }, [stopIdx, isPlaying, mapLoaded, day]);

  // Auto-advance while playing. Stops at the end of the day.
  useEffect(() => {
    if (!isPlaying) return;
    const id = window.setTimeout(() => {
      setStopIdx((i) => {
        if (i >= day.stops.length - 1) {
          setIsPlaying(false);
          return i;
        }
        return i + 1;
      });
    }, STEP_MS);
    return () => window.clearTimeout(id);
  }, [isPlaying, stopIdx, day]);

  const selectDay = useCallback((i: number) => {
    setDayIdx(i);
    setStopIdx(0);
    setIsPlaying(false);
  }, []);

  const play = useCallback(() => {
    if (stopIdx >= day.stops.length - 1) setStopIdx(0);
    setIsPlaying(true);
  }, [stopIdx, day]);

  const pause = useCallback(() => setIsPlaying(false), []);
  const restart = useCallback(() => {
    setStopIdx(0);
    setIsPlaying(false);
  }, []);

  const currentStop = day.stops[stopIdx]!;

  return (
    <div className="flex flex-col gap-4">
      {/* Day selector chips */}
      <div className="-mx-1 flex items-center gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {aliWeek.map((d, i) => {
          const active = i === dayIdx;
          const c = NEIGHBORHOOD_COLOR[d.neighborhood];
          return (
            <button
              key={d.day}
              type="button"
              onClick={() => selectDay(i)}
              className={cn(
                "shrink-0 rounded-full border px-3 py-1.5 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold",
                active
                  ? "border-paper bg-paper/10 text-paper"
                  : "border-ink-3 text-paper-mute hover:border-paper-mute",
              )}
              style={active ? { borderColor: c, color: c } : undefined}
            >
              <div className="font-mono text-[10px] uppercase tracking-wider">
                {d.weekday} · {shortDate(d.date)}
              </div>
              <div className="text-[11px]">{d.neighborhood}</div>
            </button>
          );
        })}
      </div>

      {/* Map + description card */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_320px]">
        <div className="relative h-[60vh] min-h-[440px] overflow-hidden rounded-2xl border border-ink-3 bg-[#1a1612] lg:h-[640px]">
          <Map
            ref={mapRef}
            mapStyle={isDark ? MAP_STYLE_DARK : MAP_STYLE_LIGHT}
            initialViewState={{ longitude: 29.0, latitude: 41.015, zoom: 11 }}
            style={{ width: "100%", height: "100%" }}
            scrollZoom={false}
            cooperativeGestures
            attributionControl={false}
            onLoad={(e) => {
              setMapLoaded(true);
              e.target.resize();
            }}
          >
            <NavigationControl position="top-right" showCompass={false} />

            {/* Faint full route */}
            <Source id="ali-route-full" type="geojson" data={routeFull}>
              <Layer
                id="ali-route-full-line"
                type="line"
                paint={{
                  "line-color": color,
                  "line-width": 2,
                  "line-opacity": 0.35,
                  "line-dasharray": [2, 2.5],
                }}
              />
            </Source>

            {/* Solid trail up to the current stop */}
            <Source id="ali-route-trail" type="geojson" data={routeTrail}>
              <Layer
                id="ali-route-trail-glow"
                type="line"
                paint={{
                  "line-color": color,
                  "line-width": 8,
                  "line-blur": 6,
                  "line-opacity": 0.35,
                }}
              />
              <Layer
                id="ali-route-trail-line"
                type="line"
                paint={{
                  "line-color": color,
                  "line-width": 3,
                  "line-opacity": 0.95,
                }}
              />
            </Source>

            {day.stops.map((s, i) => (
              <NumberedMarker
                key={s.id}
                n={i + 1}
                lng={s.lng}
                lat={s.lat}
                active={i === stopIdx}
                visited={i < stopIdx}
                color={color}
                onClick={() => {
                  setStopIdx(i);
                  setIsPlaying(false);
                }}
              />
            ))}
          </Map>

          {/* Play controls */}
          <div className="pointer-events-auto absolute inset-x-4 bottom-4 flex items-center justify-between gap-3 rounded-full border border-black/10 bg-white/90 px-3 py-2 backdrop-blur dark:border-white/10 dark:bg-[#1a1612]/90">
            <button
              type="button"
              onClick={isPlaying ? pause : play}
              className="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium text-neutral-900 hover:bg-black/5 dark:text-paper dark:hover:bg-white/10"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause className="h-3.5 w-3.5" />
              ) : (
                <Play className="h-3.5 w-3.5" />
              )}
              {isPlaying ? "Pause" : "Play day"}
            </button>
            <div className="font-mono text-[10px] uppercase tracking-wider text-neutral-500 dark:text-paper-mute">
              Stop {stopIdx + 1} / {day.stops.length}
            </div>
            <button
              type="button"
              onClick={restart}
              className="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs text-neutral-700 hover:bg-black/5 dark:text-paper-dim dark:hover:bg-white/10"
              aria-label="Restart"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </button>
          </div>
        </div>

        {/* Description card */}
        <div className="flex flex-col gap-4 rounded-2xl border border-ink-3 bg-black/20 p-5">
          <div>
            <div
              className="font-mono text-[10px] uppercase tracking-wider"
              style={{ color }}
            >
              {day.weekday} · {shortDate(day.date)} · {day.neighborhood}
            </div>
            <h3 className="mt-1.5 text-2xl font-medium text-paper">
              {day.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-paper-dim">
              {day.blurb}
            </p>
          </div>

          <div className="rounded-xl border border-ink-3 bg-ink-1/40 p-4">
            <div className="flex items-center gap-2">
              <span
                className="flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold text-white"
                style={{ backgroundColor: color }}
              >
                {stopIdx + 1}
              </span>
              <div className="font-mono text-[10px] uppercase tracking-wider text-paper-mute">
                {currentStop.time}
              </div>
            </div>
            <h4 className="mt-2 text-base font-medium text-paper">
              {currentStop.title}
            </h4>
            <p className="mt-1.5 text-sm leading-relaxed text-paper-dim">
              {currentStop.note}
            </p>
          </div>

          {/* Stop list */}
          <ol className="flex flex-col gap-1">
            {day.stops.map((s, i) => {
              const active = i === stopIdx;
              return (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setStopIdx(i);
                      setIsPlaying(false);
                    }}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[12px] transition-colors",
                      active
                        ? "bg-white/5 text-paper"
                        : "text-paper-mute hover:bg-white/5 hover:text-paper-dim",
                    )}
                  >
                    <span
                      className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
                      style={{
                        backgroundColor: active ? color : "transparent",
                        color: active ? "#fff" : color,
                        border: active ? "none" : `1px solid ${color}`,
                      }}
                    >
                      {i + 1}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-wider opacity-70">
                      {s.time.split(" – ")[0]}
                    </span>
                    <span className="truncate">{s.title}</span>
                  </button>
                </li>
              );
            })}
          </ol>

          <div className="mt-auto border-t border-ink-3 pt-3 text-[11px] leading-relaxed text-paper-mute">
            <span className="text-paper">{aliMember.name}</span> ·{" "}
            {aliMember.bio}
          </div>
        </div>
      </div>
    </div>
  );
}
