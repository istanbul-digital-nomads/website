import {
  Bike,
  Bus,
  Car,
  Footprints,
  Ship,
  TrainFront,
  Users,
  type LucideIcon,
} from "lucide-react";

export const TRANSPORT_MODES = [
  "ferry",
  "metro",
  "tram",
  "bus",
  "minibus",
  "taxi",
  "shared_uber",
  "walk",
  "bike",
] as const;

export type TransportMode = (typeof TRANSPORT_MODES)[number];

export const TRANSPORT_ICONS: Record<TransportMode, LucideIcon> = {
  ferry: Ship,
  metro: TrainFront,
  tram: TrainFront,
  bus: Bus,
  minibus: Bus,
  taxi: Car,
  shared_uber: Users,
  walk: Footprints,
  bike: Bike,
};

export function isTransportMode(value: unknown): value is TransportMode {
  return (
    typeof value === "string" &&
    (TRANSPORT_MODES as readonly string[]).includes(value)
  );
}
