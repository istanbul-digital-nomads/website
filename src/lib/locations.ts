// Istanbul venue/neighborhood coordinate mapping
// Used to place events on the map without a geocoding API

const ISTANBUL_VENUES: Record<string, [number, number]> = {
  "mob kadikoy": [29.025, 40.99],
  kadikoy: [29.025, 40.99],
  "kadikoy ferry": [29.024, 40.992],
  beyoglu: [28.977, 41.034],
  "beyoglu rooftop": [28.978, 41.035],
  cihangir: [28.983, 41.032],
  "setup cihangir": [28.984, 41.031],
  galata: [28.974, 41.026],
  "galata tower": [28.974, 41.026],
  besiktas: [29.007, 41.043],
  moda: [29.026, 40.978],
  uskudar: [29.015, 41.023],
  taksim: [28.985, 41.037],
  nisantasi: [28.988, 41.048],
  karakoy: [28.977, 41.022],
  sultanahmet: [28.978, 41.006],
  balat: [28.949, 41.029],
  eminonu: [28.975, 41.017],
  sisli: [28.987, 41.06],
  levent: [29.011, 41.077],
  bakirkoy: [28.877, 40.98],
};

const ISTANBUL_DEFAULT: [number, number] = [29.0, 41.015];

export function getEventCoordinates(
  locationName: string,
): [number, number] | null {
  const name = locationName.toLowerCase().trim();

  // Skip online/virtual events
  if (
    name.includes("online") ||
    name.includes("zoom") ||
    name.includes("virtual")
  ) {
    return null;
  }

  // Exact match first
  if (ISTANBUL_VENUES[name]) {
    return ISTANBUL_VENUES[name];
  }

  // Fuzzy match - check if any venue key is contained in the location name
  for (const [key, coords] of Object.entries(ISTANBUL_VENUES)) {
    if (name.includes(key) || key.includes(name)) {
      return coords;
    }
  }

  // Also check location_address if provided
  return ISTANBUL_DEFAULT;
}

// Event type colors matching the badge system
export const EVENT_TYPE_COLORS: Record<string, string> = {
  meetup: "#c0392b",
  coworking: "#27ae60",
  workshop: "#f39c12",
  social: "#e74c3c",
};
