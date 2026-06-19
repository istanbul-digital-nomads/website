// Pure geo-matching for the spot-matches cron. Kept free of server-only deps
// so it's unit-testable: deciding whether a plan "includes" a saved spot is the
// core of the notification feature and must not drift.

/** Distance in metres between two lat/lng points (haversine). */
export function metersBetween(
  aLat: number,
  aLng: number,
  bLat: number,
  bLng: number,
): number {
  const R = 6_371_000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(bLat - aLat);
  const dLng = toRad(bLng - aLng);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(aLat)) * Math.cos(toRad(bLat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

// How close a plan stop must be to a saved pin to count as "the same place".
export const MATCH_RADIUS_M = 150;

export interface MatchSpot {
  space_id: string | null;
  lat: number | string;
  lng: number | string;
}

export interface MatchStop {
  space_id: string | null;
  lat: number | string | null;
  lng: number | string | null;
}

/**
 * A plan "includes" a saved spot when any of its stops is the same curated
 * space, or sits within MATCH_RADIUS_M of the saved pin. Neighborhood-level
 * matching is deliberately excluded - a spot is a specific place, and pinging
 * for every plan that merely visits the same district would be noise.
 */
export function planIncludesSpot(spot: MatchSpot, stops: MatchStop[]): boolean {
  const sLat = Number(spot.lat);
  const sLng = Number(spot.lng);
  return stops.some((stop) => {
    if (spot.space_id && stop.space_id && spot.space_id === stop.space_id) {
      return true;
    }
    if (stop.lat != null && stop.lng != null) {
      return (
        metersBetween(sLat, sLng, Number(stop.lat), Number(stop.lng)) <=
        MATCH_RADIUS_M
      );
    }
    return false;
  });
}
