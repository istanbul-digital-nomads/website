"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import MapGL, { Marker, type MapRef } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { Loader2, MapPin } from "lucide-react";
import { useTheme } from "@/components/layout/theme-provider";
import { cn } from "@/lib/utils";

const LIGHT_STYLE =
  "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json";
const DARK_STYLE =
  "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json";

const ISTANBUL_BOUNDS: [[number, number], [number, number]] = [
  [28.5, 40.8],
  [29.6, 41.3],
];

interface Props {
  lat: number;
  lng: number;
  /** Re-centers the camera when the active candidate changes. */
  recenterKey: string;
  onMove: (lat: number, lng: number) => void;
}

// A single draggable pin. Detection is best-effort, so the user always confirms
// (or places) the exact location here before saving.
export function SpotMap({ lat, lng, recenterKey, onMove }: Props) {
  const { theme } = useTheme();
  const mapRef = useRef<MapRef>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  // Fly to the pin whenever the active candidate changes (not on every drag).
  useEffect(() => {
    const map = mapRef.current?.getMap();
    if (!map || !mapLoaded) return;
    map.flyTo({ center: [lng, lat], zoom: 15, duration: 600 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recenterKey, mapLoaded]);

  const handleDragEnd = useCallback(
    (e: { lngLat: { lat: number; lng: number } }) => {
      onMove(e.lngLat.lat, e.lngLat.lng);
    },
    [onMove],
  );

  return (
    <div
      className={cn(
        "relative h-[280px] w-full overflow-hidden rounded-lg border border-ink-3 sm:h-[340px]",
        isDark ? "bg-[#1a1d27]" : "bg-[#e8e0d4]",
      )}
    >
      <MapGL
        ref={mapRef}
        mapStyle={isDark ? DARK_STYLE : LIGHT_STYLE}
        initialViewState={{ longitude: lng, latitude: lat, zoom: 15 }}
        style={{ width: "100%", height: "100%" }}
        attributionControl={false}
        maxBounds={ISTANBUL_BOUNDS}
        minZoom={9}
        maxZoom={18}
        onLoad={() => setMapLoaded(true)}
        interactive
      >
        <Marker
          longitude={lng}
          latitude={lat}
          anchor="bottom"
          draggable
          onDragEnd={handleDragEnd}
        >
          <span
            className="flex h-9 w-9 -translate-y-1 cursor-grab items-center justify-center rounded-full border-2 border-paper bg-terracotta text-paper shadow-md active:cursor-grabbing"
            style={{ boxShadow: "0 0 0 4px #c0392b55" }}
          >
            <MapPin className="h-5 w-5" aria-hidden />
          </span>
        </Marker>
      </MapGL>

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
