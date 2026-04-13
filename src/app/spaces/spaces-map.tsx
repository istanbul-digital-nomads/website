"use client";

import { useState, useCallback } from "react";
import Map, { Marker, NavigationControl, Popup } from "react-map-gl/maplibre";
import { useTheme } from "@/components/layout/theme-provider";
import { computeNomadScore, type NomadSpace } from "@/lib/spaces";
import { cn } from "@/lib/utils";
import "maplibre-gl/dist/maplibre-gl.css";

const LIGHT_STYLE =
  "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json";
const DARK_STYLE =
  "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json";

const TYPE_COLORS = {
  coworking: "#27ae60",
  cafe: "#f39c12",
};

function SpaceMarker({
  space,
  isSelected,
  onClick,
}: {
  space: NomadSpace;
  isSelected: boolean;
  onClick: () => void;
}) {
  const color = TYPE_COLORS[space.type];

  return (
    <Marker
      longitude={space.coordinates[0]}
      latitude={space.coordinates[1]}
      anchor="center"
      onClick={(e) => {
        e.originalEvent.stopPropagation();
        onClick();
      }}
    >
      <div className="relative cursor-pointer">
        {isSelected && (
          <span
            className="absolute inset-0 animate-ping rounded-full opacity-40"
            style={{
              backgroundColor: color,
              animationDuration: "1.5s",
            }}
          />
        )}
        <div
          className={cn(
            "rounded-full shadow-lg ring-2 ring-white/90 transition-transform dark:ring-[#1a1a2e]/80",
            isSelected ? "h-5 w-5 scale-125" : "h-3.5 w-3.5",
          )}
          style={{ backgroundColor: color }}
        />
      </div>
    </Marker>
  );
}

export function SpacesMap({
  spaces,
  selectedId,
  onSelect,
}: {
  spaces: NomadSpace[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  const selectedSpace = spaces.find((s) => s.id === selectedId);

  const handleLoad = useCallback(() => {
    setMounted(true);
  }, []);

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[2rem] border shadow-[0_20px_60px_rgba(15,23,42,0.1)] transition-opacity duration-700",
        isDark
          ? "map-canvas-dark border-primary-900/40 bg-[#1a1d27]"
          : "map-canvas-warm border-primary-200/60 bg-[#e8e0d4]",
        mounted ? "opacity-100" : "opacity-0",
      )}
      style={{ height: 420 }}
    >
      <Map
        initialViewState={{
          longitude: 29.0,
          latitude: 41.015,
          zoom: 12,
        }}
        mapStyle={isDark ? DARK_STYLE : LIGHT_STYLE}
        scrollZoom={false}
        attributionControl={false}
        onLoad={handleLoad}
        onClick={() => onSelect(null)}
      >
        <NavigationControl position="top-right" showCompass={false} />

        {spaces.map((space) => (
          <SpaceMarker
            key={space.id}
            space={space}
            isSelected={selectedId === space.id}
            onClick={() => onSelect(selectedId === space.id ? null : space.id)}
          />
        ))}

        {selectedSpace && (
          <Popup
            longitude={selectedSpace.coordinates[0]}
            latitude={selectedSpace.coordinates[1]}
            anchor="bottom"
            offset={16}
            closeOnClick={false}
            onClose={() => onSelect(null)}
            className="spaces-popup"
          >
            <div className="px-1 py-0.5">
              <div className="flex items-center gap-2">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{
                    backgroundColor: TYPE_COLORS[selectedSpace.type],
                  }}
                />
                <span className="text-sm font-semibold text-neutral-900">
                  {selectedSpace.name}
                </span>
              </div>
              <div className="mt-0.5 flex items-center gap-2 text-xs text-neutral-500">
                <span>
                  {selectedSpace.type === "coworking" ? "Coworking" : "Cafe"}
                </span>
                <span>-</span>
                <span className="font-medium text-[#27ae60]">
                  {computeNomadScore(selectedSpace.nomad_score).toFixed(1)}{" "}
                  score
                </span>
              </div>
            </div>
          </Popup>
        )}
      </Map>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 flex gap-3 rounded-xl border border-black/10 bg-white/90 px-3 py-2 backdrop-blur-sm dark:border-white/10 dark:bg-[#1a1a2e]/90">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#27ae60]" />
          <span className="text-[10px] font-medium text-neutral-600 dark:text-[#99a3ad]">
            Coworking
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#f39c12]" />
          <span className="text-[10px] font-medium text-neutral-600 dark:text-[#99a3ad]">
            Cafe
          </span>
        </div>
      </div>
    </div>
  );
}
