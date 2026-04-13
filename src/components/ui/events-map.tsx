"use client";

import { useCallback, useRef, useState } from "react";
import Map, { Marker, NavigationControl } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { Calendar, MapPin, Users, X, Maximize2, Minimize2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils";
import { useTheme } from "@/components/layout/theme-provider";
import { getEventCoordinates, EVENT_TYPE_COLORS } from "@/lib/locations";
import { eventTypes } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Event } from "@/types/models";

const MAP_STYLE_LIGHT =
  "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json";
const MAP_STYLE_DARK =
  "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json";
const ISTANBUL_CENTER = { longitude: 29.0, latitude: 41.015 };

interface EventsMapProps {
  events: Event[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  expanded: boolean;
  onToggleExpand: () => void;
}

function EventPin({
  event,
  selected,
  onClick,
}: {
  event: Event;
  selected: boolean;
  onClick: () => void;
}) {
  const coords = getEventCoordinates(event.location_name);
  if (!coords) return null;

  const color = EVENT_TYPE_COLORS[event.type] || "#c0392b";

  return (
    <Marker longitude={coords[0]} latitude={coords[1]} anchor="center">
      <button
        onClick={onClick}
        className={cn(
          "map-marker group relative cursor-pointer transition-all duration-200",
          selected && "z-20 scale-125",
        )}
      >
        {selected && (
          <span
            className="absolute inset-0 animate-ping rounded-full opacity-40"
            style={{ backgroundColor: color, animationDuration: "1.5s" }}
          />
        )}
        <span
          className={cn(
            "relative block rounded-full shadow-lg ring-2 transition-all",
            selected
              ? "h-5 w-5 ring-white dark:ring-[#1a1a2e]"
              : "h-3.5 w-3.5 ring-white/80 dark:ring-[#1a1a2e]/80",
          )}
          style={{ backgroundColor: color }}
        />
        <span
          className={cn(
            "absolute left-6 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.2em] shadow-md transition-all",
            selected
              ? "scale-105 bg-[#1a1a2e] text-white opacity-100 dark:bg-[#f2f3f4] dark:text-[#1a1a2e]"
              : "opacity-0 group-hover:opacity-100",
            "bg-white/95 text-[#1a1a2e] dark:bg-[#1a1a2e]/95 dark:text-[#f2f3f4]",
          )}
        >
          {event.title.length > 25
            ? event.title.slice(0, 25) + "..."
            : event.title}
        </span>
      </button>
    </Marker>
  );
}

function EventDetailPanel({
  event,
  onClose,
}: {
  event: Event;
  onClose: () => void;
}) {
  return (
    <div className="absolute bottom-4 right-4 top-4 z-30 w-80 overflow-hidden rounded-2xl border border-[#e5e8eb]/40 bg-white/92 shadow-xl backdrop-blur-xl sm:w-96 dark:border-[#2c2f3a] dark:bg-[#1a1a2e]/95">
      <div className="flex h-full flex-col">
        <div className="flex items-start justify-between border-b border-black/5 p-5 dark:border-white/10">
          <div>
            <Badge variant={event.type}>{eventTypes[event.type].label}</Badge>
            <h3 className="mt-2 text-xl font-semibold text-[#1a1a2e] dark:text-[#f2f3f4]">
              {event.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-full border border-black/10 p-1.5 text-[#5d6d7e] hover:bg-black/5 dark:border-white/10 dark:text-[#99a3ad] dark:hover:bg-white/10"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          <div className="space-y-3 text-sm text-[#5d6d7e] dark:text-[#99a3ad]">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 shrink-0" />
              {formatDate(event.date)}
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 shrink-0" />
              {event.location_name}
              {event.location_address && (
                <span className="text-xs">- {event.location_address}</span>
              )}
            </div>
            {event.capacity && (
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 shrink-0" />
                {event.capacity} spots
              </div>
            )}
          </div>

          <p className="mt-4 text-sm leading-7 text-[#526e89] dark:text-[#99a3ad]">
            {event.description}
          </p>
        </div>

        <div className="border-t border-black/5 p-5 dark:border-white/10">
          <Button className="w-full rounded-xl" size="lg">
            RSVP to this event
          </Button>
        </div>
      </div>
    </div>
  );
}

function MiniEventBar({
  event,
  onExpand,
}: {
  event: Event;
  onExpand: () => void;
}) {
  return (
    <div className="absolute inset-x-4 bottom-4 z-20 flex items-center justify-between rounded-2xl border border-[#e5e8eb]/40 bg-white/92 px-5 py-3 shadow-lg backdrop-blur-xl dark:border-[#2c2f3a] dark:bg-[#1a1a2e]/95">
      <div className="flex items-center gap-3">
        <Badge variant={event.type}>{eventTypes[event.type].label}</Badge>
        <span className="text-sm font-medium text-[#1a1a2e] dark:text-[#f2f3f4]">
          {event.title}
        </span>
      </div>
      <button
        onClick={onExpand}
        className="rounded-lg border border-black/10 px-3 py-1.5 text-xs font-medium text-[#5d6d7e] hover:bg-black/5 dark:border-white/10 dark:text-[#99a3ad] dark:hover:bg-white/10"
      >
        View details
      </button>
    </div>
  );
}

export function EventsMap({
  events,
  selectedId,
  onSelect,
  expanded,
  onToggleExpand,
}: EventsMapProps) {
  const { theme } = useTheme();
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef<any>(null);

  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  const selectedEvent = events.find((e) => e.id === selectedId) ?? null;

  const onLoad = useCallback(() => {
    setMapLoaded(true);
  }, []);

  const mappableEvents = events.filter(
    (e) => getEventCoordinates(e.location_name) !== null,
  );

  return (
    <div
      className={cn(
        "relative overflow-hidden transition-all duration-500",
        expanded
          ? "h-[80vh] min-h-[560px] rounded-none"
          : "h-[320px] rounded-none sm:h-[400px]",
      )}
    >
      <div
        className={cn(
          "absolute inset-0 bg-[#d5dce3] transition-opacity duration-500 dark:bg-[#1a1d27]",
          mapLoaded ? "opacity-0" : "opacity-100",
        )}
      />
      <div
        className={cn(
          "absolute inset-0",
          isDark ? "map-canvas-dark" : "map-canvas-warm",
        )}
      >
        <Map
          ref={mapRef}
          mapStyle={isDark ? MAP_STYLE_DARK : MAP_STYLE_LIGHT}
          initialViewState={{ ...ISTANBUL_CENTER, zoom: 12 }}
          style={{ width: "100%", height: "100%" }}
          scrollZoom={false}
          attributionControl={false}
          onLoad={onLoad}
        >
          <NavigationControl position="top-right" showCompass={false} />

          {mappableEvents.map((event) => (
            <EventPin
              key={event.id}
              event={event}
              selected={selectedId === event.id}
              onClick={() =>
                onSelect(selectedId === event.id ? null : event.id)
              }
            />
          ))}
        </Map>
      </div>

      {/* Expand/Collapse toggle */}
      <button
        onClick={onToggleExpand}
        className="absolute left-4 top-4 z-20 flex items-center gap-1.5 rounded-xl border border-black/10 bg-white/90 px-3 py-2 text-xs font-medium text-[#5d6d7e] shadow-sm backdrop-blur-sm transition-colors hover:bg-white dark:border-white/10 dark:bg-[#1a1a2e]/90 dark:text-[#99a3ad] dark:hover:bg-[#1a1a2e]"
      >
        {expanded ? (
          <>
            <Minimize2 className="h-3.5 w-3.5" />
            Collapse
          </>
        ) : (
          <>
            <Maximize2 className="h-3.5 w-3.5" />
            Expand map
          </>
        )}
      </button>

      {/* Detail panel - expanded view */}
      {selectedEvent && expanded && (
        <EventDetailPanel
          event={selectedEvent}
          onClose={() => onSelect(null)}
        />
      )}

      {/* Mini bar - collapsed view */}
      {selectedEvent && !expanded && (
        <MiniEventBar event={selectedEvent} onExpand={onToggleExpand} />
      )}
    </div>
  );
}
