"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import MapGL, {
  Marker,
  Popup,
  Source,
  Layer,
  type MapRef,
} from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { Loader2, MapPin, Wallet, X } from "lucide-react";
import { useTheme } from "@/components/layout/theme-provider";
import { spaces } from "@/lib/spaces";
import { cn } from "@/lib/utils";
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

// Vibe emoji map for popup display.
const VIBE_EMOJI: Record<string, string> = {
  focus: "🎯",
  cowork: "💻",
  social: "🤝",
  meal: "🍽️",
  "after-work": "🍻",
  outdoor: "🌿",
  culture: "🎭",
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
  const mapRef = useRef<MapRef>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

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

  const handleLoad = useCallback(() => {
    setMapLoaded(true);
    // Call fitBounds directly here - the mapLoaded state update triggers a
    // re-render but the map is guaranteed ready at this point.
    const map = mapRef.current?.getMap();
    if (!map || positioned.length === 0) return;
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

  // Close popup on map click (outside a marker).
  const handleMapClick = useCallback(() => {
    setSelectedIdx(null);
  }, []);

  if (positioned.length === 0) return null;

  const selected = selectedIdx !== null ? positioned[selectedIdx] : null;

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
        {/* Route line - gated on mapLoaded to avoid GL style race */}
        {mapLoaded && routeGeo && (
          <Source id="plan-route" type="geojson" data={routeGeo}>
            <Layer
              id="plan-route-glow"
              type="line"
              paint={{
                "line-color": "rgba(192,57,43,0.22)",
                "line-width": 10,
                "line-blur": 8,
              }}
            />
            <Layer
              id="plan-route-line"
              type="line"
              paint={{
                "line-color": "#c0392b",
                "line-width": 2.5,
                "line-dasharray": [3, 3],
              }}
            />
          </Source>
        )}

        {/* Stop markers */}
        {positioned.map(({ stop, pos }, i) => (
          <Marker
            key={stop.id}
            longitude={pos.lng}
            latitude={pos.lat}
            anchor="bottom"
            onClick={(e) => {
              e.originalEvent.stopPropagation();
              setSelectedIdx(i === selectedIdx ? null : i);
            }}
          >
            {pos.approximate ? (
              <span
                aria-label={`Stop ${i + 1} (approximate area)`}
                className="relative -translate-y-1 cursor-pointer"
                title={stopName(stop)}
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-terracotta bg-terracotta/15 shadow-md transition-transform hover:scale-110">
                  <MapPin className="h-3.5 w-3.5 text-terracotta" aria-hidden />
                </span>
                <span className="absolute -bottom-0.5 left-1/2 flex h-5 min-w-[18px] -translate-x-1/2 items-center justify-center rounded-full bg-terracotta px-1 font-mono text-[9px] font-semibold text-[#06101f] shadow ring-1 ring-paper/30">
                  {i + 1}
                </span>
              </span>
            ) : (
              <span
                aria-label={`Stop ${i + 1}`}
                className="relative -translate-y-1 cursor-pointer"
                title={stopName(stop)}
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full border border-paper bg-terracotta font-mono text-[10px] font-semibold text-[#06101f] shadow-md transition-transform hover:scale-110">
                  {i + 1}
                </span>
                <span className="absolute -bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rotate-45 bg-terracotta" />
              </span>
            )}
          </Marker>
        ))}

        {/* Click popup */}
        {selected && selectedIdx !== null && (
          <Popup
            longitude={selected.pos.lng}
            latitude={selected.pos.lat}
            anchor="top"
            offset={[0, 12] as [number, number]}
            closeButton={false}
            closeOnClick={false}
            onClose={() => setSelectedIdx(null)}
            className="plan-stop-popup"
          >
            <div
              className="min-w-[160px] max-w-[220px] rounded-lg border border-ink-3 p-3 shadow-xl"
              style={{
                background: isDark ? "#1c2030" : "#ffffff",
                color: isDark ? "#e8dfd4" : "#1a1a1a",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Stop number + name */}
              <div className="mb-1.5 flex items-start gap-2">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-terracotta font-mono text-[9px] font-semibold text-[#06101f]">
                  {selectedIdx + 1}
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
                    {VIBE_EMOJI[selected.stop.vibe] ?? ""} {selected.stop.vibe}
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
