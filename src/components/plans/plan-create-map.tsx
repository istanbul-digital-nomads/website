"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import Map, {
  Marker,
  Source,
  Layer,
  type MapRef,
  type MapLayerMouseEvent,
} from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { Plus } from "lucide-react";
import { spaces, type NomadSpace } from "@/lib/spaces";
import { useTheme } from "@/components/layout/theme-provider";
import { cn } from "@/lib/utils";

const LIGHT_STYLE =
  "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json";
const DARK_STYLE =
  "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json";

const ISTANBUL_CENTER = { longitude: 29.0, latitude: 41.015 } as const;
const INITIAL_ZOOM = 11.3;

export interface DraftStop {
  /** Stable client-side id for React keys. */
  uid: string;
  space_id: string | null;
  custom_location: string | null;
  neighborhood_slug: string | null;
  lat: number | null;
  lng: number | null;
}

interface Props {
  stops: DraftStop[];
  focusedUid: string | null;
  pickerMode: boolean;
  onPickSpace: (space: NomadSpace) => void;
  onDropCustomPin: (lat: number, lng: number) => void;
  onFocusStop: (uid: string) => void;
  className?: string;
}

function getStopLatLng(stop: DraftStop): { lat: number; lng: number } | null {
  if (stop.lat != null && stop.lng != null) {
    return { lat: stop.lat, lng: stop.lng };
  }
  if (stop.space_id) {
    const sp = spaces.find((s) => s.id === stop.space_id);
    if (sp) return { lat: sp.coordinates[1], lng: sp.coordinates[0] };
  }
  return null;
}

export function PlanCreateMap({
  stops,
  focusedUid,
  pickerMode,
  onPickSpace,
  onDropCustomPin,
  onFocusStop,
  className,
}: Props) {
  const { theme } = useTheme();
  const mapRef = useRef<MapRef>(null);

  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  const stopPositions = useMemo(
    () =>
      stops
        .map((s) => ({ stop: s, pos: getStopLatLng(s) }))
        .filter(
          (x): x is { stop: DraftStop; pos: { lat: number; lng: number } } =>
            x.pos !== null,
        ),
    [stops],
  );

  // Connecting line between stops in order.
  const routeGeo = useMemo(() => {
    if (stopPositions.length < 2) return null;
    return {
      type: "FeatureCollection" as const,
      features: [
        {
          type: "Feature" as const,
          properties: {},
          geometry: {
            type: "LineString" as const,
            coordinates: stopPositions.map((s) => [s.pos.lng, s.pos.lat]),
          },
        },
      ],
    };
  }, [stopPositions]);

  // When stops change, fit the map to include all of them (with padding).
  useEffect(() => {
    const map = mapRef.current?.getMap();
    if (!map || stopPositions.length === 0) return;
    if (stopPositions.length === 1) {
      const p = stopPositions[0]!.pos;
      map.flyTo({ center: [p.lng, p.lat], zoom: 14, duration: 600 });
      return;
    }
    const lngs = stopPositions.map((s) => s.pos.lng);
    const lats = stopPositions.map((s) => s.pos.lat);
    map.fitBounds(
      [
        [Math.min(...lngs), Math.min(...lats)],
        [Math.max(...lngs), Math.max(...lats)],
      ],
      { padding: 80, maxZoom: 14, duration: 600 },
    );
  }, [stopPositions]);

  const handleMapClick = useCallback(
    (e: MapLayerMouseEvent) => {
      if (!pickerMode) return;
      onDropCustomPin(e.lngLat.lat, e.lngLat.lng);
    },
    [pickerMode, onDropCustomPin],
  );

  return (
    <div
      className={cn(
        "absolute inset-0",
        isDark ? "bg-[#1a1d27]" : "bg-[#e8e0d4]",
        className,
      )}
    >
      <Map
        ref={mapRef}
        mapStyle={isDark ? DARK_STYLE : LIGHT_STYLE}
        initialViewState={{ ...ISTANBUL_CENTER, zoom: INITIAL_ZOOM }}
        style={{ width: "100%", height: "100%" }}
        attributionControl={false}
        onClick={handleMapClick}
        cursor={pickerMode ? "crosshair" : "grab"}
      >
        {/* Verified space pins (always visible) */}
        {spaces
          .filter((s) => s.status !== "closed")
          .map((sp) => {
            const alreadyAdded = stops.some((st) => st.space_id === sp.id);
            return (
              <Marker
                key={sp.id}
                longitude={sp.coordinates[0]}
                latitude={sp.coordinates[1]}
                anchor="center"
                onClick={(e) => {
                  e.originalEvent.stopPropagation();
                  if (!pickerMode) return;
                  if (alreadyAdded) return;
                  onPickSpace(sp);
                }}
              >
                <button
                  type="button"
                  aria-label={`${sp.name} (${sp.type})`}
                  aria-disabled={alreadyAdded}
                  tabIndex={pickerMode && !alreadyAdded ? 0 : -1}
                  className={cn(
                    "h-3 w-3 rounded-full ring-2 ring-white/90 transition-transform dark:ring-[#1a1a2e]/80 focus-visible:outline-none focus-visible:ring-terracotta",
                    pickerMode && !alreadyAdded
                      ? "cursor-pointer hover:scale-150"
                      : "cursor-default",
                    alreadyAdded
                      ? "bg-paper-mute opacity-50"
                      : sp.type === "coworking"
                        ? "bg-[#27ae60]"
                        : "bg-[#f39c12]",
                  )}
                />
              </Marker>
            );
          })}

        {/* Selected stops (numbered terracotta pins) */}
        {stopPositions.map(({ stop, pos }, i) => (
          <Marker
            key={stop.uid}
            longitude={pos.lng}
            latitude={pos.lat}
            anchor="bottom"
            onClick={(e) => {
              e.originalEvent.stopPropagation();
              onFocusStop(stop.uid);
            }}
          >
            <button
              type="button"
              onClick={() => onFocusStop(stop.uid)}
              aria-label={`Stop ${i + 1} of ${stopPositions.length}`}
              className={cn(
                "relative -translate-y-1 cursor-pointer transition-transform focus-visible:outline-none",
                focusedUid === stop.uid ? "scale-110" : "hover:scale-105",
              )}
            >
              <span
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border-2 font-mono text-xs font-semibold shadow-lg",
                  focusedUid === stop.uid
                    ? "border-terracotta bg-terracotta text-ink-0 ring-2 ring-terracotta/40 ring-offset-2 ring-offset-ink-0"
                    : "border-paper bg-terracotta text-ink-0",
                )}
              >
                {i + 1}
              </span>
              <span className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-terracotta" />
            </button>
          </Marker>
        ))}

        {/* Dashed connecting line */}
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

      {/* Picker mode banner */}
      {pickerMode && (
        <div
          role="status"
          aria-live="polite"
          className="absolute inset-x-4 top-4 z-10 mx-auto max-w-md rounded-lg border border-terracotta/40 bg-ink-0/90 px-4 py-3 backdrop-blur-md"
        >
          <p className="flex items-center gap-2 text-sm text-paper">
            <Plus className="h-4 w-4 text-terracotta" />
            Tap a space, or tap anywhere on the map to drop a pin
          </p>
        </div>
      )}
    </div>
  );
}
