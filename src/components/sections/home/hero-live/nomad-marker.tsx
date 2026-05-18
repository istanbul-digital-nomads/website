"use client";

import Image from "next/image";
import { Marker } from "react-map-gl/maplibre";
import type { HeroNomad, HeroVenue } from "@/lib/hero-data";

type Props = {
  nomad: HeroNomad;
  venue: HeroVenue;
  index: number;
  // Local x offset within a venue cluster (for stacking multiple nomads
  // at the same venue without overlap).
  clusterOffsetPx: number;
  inFocus: boolean;
};

const DRIFT_CLASSES = ["hero-drift-a", "hero-drift-b", "hero-drift-c", "hero-drift-d"];

export function NomadMarker({ nomad, venue, index, clusterOffsetPx, inFocus }: Props) {
  const driftClass = DRIFT_CLASSES[index % DRIFT_CLASSES.length];
  const size = inFocus ? 44 : 32;
  const ring = inFocus ? 2 : 1;

  return (
    <Marker longitude={venue.lng} latitude={venue.lat} anchor="bottom">
      <div
        className={driftClass}
        style={{
          transform: `translateX(${clusterOffsetPx}px)`,
          opacity: inFocus ? 1 : 0.45,
          transition: "opacity 600ms ease",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            width: size,
            height: size,
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${nomad.g[0]}, ${nomad.g[1]})`,
            boxShadow: `0 0 0 ${ring}px rgba(246, 236, 217, 0.95), 0 4px 14px rgba(6, 16, 31, 0.5)`,
            overflow: "hidden",
            position: "relative",
          }}
          title={`${nomad.name} ${nomad.country}`}
        >
          <Image
            src={nomad.avatar}
            alt={nomad.name}
            fill
            sizes="48px"
            style={{ objectFit: "cover" }}
            unoptimized={false}
          />
        </div>
      </div>
    </Marker>
  );
}
