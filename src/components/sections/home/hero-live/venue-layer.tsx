"use client";

import { useMemo } from "react";
import { Layer, Source } from "react-map-gl/maplibre";
import { HERO_CATEGORIES, type HeroVenue } from "@/lib/hero-data";

type Props = {
  venues: HeroVenue[];
  focusedHood: string | null;
};

// Renders all 29 venue dots as a single GeoJSON source: a soft glow circle,
// a solid color dot, and a symbol layer carrying the category line-icon.
// The icon images are registered on the map by HeroCinematic on map load.
export function VenueLayer({ venues, focusedHood }: Props) {
  const data = useMemo(
    () => ({
      type: "FeatureCollection" as const,
      features: venues.map((v) => ({
        type: "Feature" as const,
        id: v.id,
        properties: {
          color: HERO_CATEGORIES[v.cat].color,
          glyph: `hero-glyph-${v.cat}`,
          inFocus: focusedHood === null || v.hood === focusedHood ? 1 : 0,
        },
        geometry: { type: "Point" as const, coordinates: [v.lng, v.lat] },
      })),
    }),
    [venues, focusedHood],
  );

  return (
    <Source id="hero-venues" type="geojson" data={data}>
      <Layer
        id="hero-venues-glow"
        type="circle"
        paint={{
          "circle-radius": [
            "interpolate",
            ["linear"],
            ["zoom"],
            10,
            14,
            13,
            26,
            15,
            36,
          ],
          "circle-color": ["get", "color"],
          "circle-opacity": ["case", ["==", ["get", "inFocus"], 1], 0.22, 0.05],
          "circle-blur": 1.2,
        }}
      />
      <Layer
        id="hero-venues-dots"
        type="circle"
        paint={{
          "circle-radius": [
            "interpolate",
            ["linear"],
            ["zoom"],
            10,
            7,
            13,
            13,
            15,
            18,
          ],
          "circle-color": ["get", "color"],
          "circle-stroke-color": "#06101f",
          "circle-stroke-width": 2,
          "circle-opacity": ["case", ["==", ["get", "inFocus"], 1], 1, 0.32],
          "circle-opacity-transition": { duration: 600 },
        }}
      />
      <Layer
        id="hero-venues-glyph"
        type="symbol"
        layout={{
          "icon-image": ["get", "glyph"],
          "icon-allow-overlap": true,
          "icon-ignore-placement": true,
          "icon-size": [
            "interpolate",
            ["linear"],
            ["zoom"],
            10,
            0.55,
            13,
            0.85,
            15,
            1.1,
          ],
        }}
        paint={{
          "icon-opacity": ["case", ["==", ["get", "inFocus"], 1], 1, 0.32],
        }}
      />
    </Source>
  );
}
