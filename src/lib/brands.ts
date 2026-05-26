import { type SpaceSource } from "./spaces";

// Nomad Brands - chains nomads recognise (coffee first; cowork/gym/etc later)
// and their individual Istanbul branches. Mirrors the spaces.ts verification
// convention: each location only fills fields we can cite, every cited field
// gets a sources[] entry, and the work-quality scores (wifi/atmosphere/laptop/
// power) stay null + listed in unverified_fields until a citable source backs
// them. Designed so a new brand is just another row in `brands` plus its
// branches in `brandLocations` - no schema or component changes needed.

export type BrandCategory = "coffee" | "cowork" | "gym" | "food";

export interface NomadBrand {
  /** Stable slug, also the key locations point at. */
  slug: string;
  name: string;
  /** Emoji or short icon key rendered inside the map marker. */
  icon: string;
  category: BrandCategory;
  /** Hex colour used to tint the brand's markers. */
  color: string;
  /** One-line "what it is" blurb for the filter UI. */
  blurb: string;
  website?: string;
}

export interface BrandLocation {
  /** Stable client-side id for React keys / dedupe. */
  id: string;
  brand_slug: string;
  name: string;
  /** [lng, lat] to match NomadSpace.coordinates ordering. */
  coordinates: [number, number];
  district: string;
  neighborhood_slug?: string;
  address?: string;
  opening_hours?: string;
  /** Google rating, only when a source is cited. */
  rating?: number | null;
  reviews_count?: number | null;
  // Work-quality scores - null until a citable source backs them.
  wifi_score: number | null;
  atmosphere_score: number | null;
  laptop_friendliness: number | null;
  power_outlet_score: number | null;
  images?: string[];
  sources?: SpaceSource[];
  unverified_fields?: string[];
  last_verified?: string; // ISO date YYYY-MM-DD
}

// The four work-quality scores every location is expected to eventually
// carry. A location with none of them cited lists all four as unverified.
export const BRAND_SCORE_FIELDS = [
  "wifi_score",
  "atmosphere_score",
  "laptop_friendliness",
  "power_outlet_score",
] as const;

export const brands: NomadBrand[] = [
  {
    slug: "espressolab",
    name: "Espressolab",
    icon: "☕", // coffee cup
    category: "coffee",
    color: "#1f6f54",
    blurb:
      "Turkish specialty chain. Big menus, consistent across branches, easy to find on both sides.",
    website: "https://www.espressolab.com",
  },
  {
    slug: "starbucks",
    name: "Starbucks",
    icon: "☕",
    category: "coffee",
    color: "#00704a",
    blurb:
      "The reliable fallback. Plenty of branches, usually has sockets and a familiar setup for a quick session.",
    website: "https://www.starbucks.com.tr",
  },
  {
    slug: "bex-coffee",
    name: "BEX Coffee",
    icon: "☕",
    category: "coffee",
    color: "#c0392b",
    blurb:
      "Fast-growing Istanbul chain with a strong Asian-side footprint and budget-friendly prices.",
    website: "https://www.bexcoffee.com",
  },
];

// VERIFIED SEED - a handful of well-known branches per brand. Coordinates,
// district, address, opening_hours, and Google rating/reviews are cited; the
// work-quality scores are deliberately left null (see unverified_fields) until
// someone scores them on the ground. Bulk branch collection is a follow-up
// (see docs/agents/agent3-brands-progress.md).
export const brandLocations: BrandLocation[] = [
  // --- Espressolab ---
  {
    id: "espressolab-cihangir",
    brand_slug: "espressolab",
    name: "Espressolab Cihangir",
    coordinates: [28.982, 41.031],
    district: "Beyoglu",
    neighborhood_slug: "cihangir",
    address: "Siraselviler Cad. 115-A/1, 34425 Beyoglu/Cihangir, Istanbul",
    opening_hours: "7am-2am daily",
    rating: 4.3,
    reviews_count: 900,
    wifi_score: null,
    atmosphere_score: null,
    laptop_friendliness: null,
    power_outlet_score: null,
    sources: [
      {
        label: "Wanderlog - Espressolab Cihangir (address, hours, rating)",
        url: "https://wanderlog.com/place/details/1357575/espressolab-cihangir",
      },
      {
        label: "Restaurant Guru - Espressolab Cihangir",
        url: "https://restaurantguru.com/Espressolab-Istanbul-49",
      },
    ],
    unverified_fields: [
      "wifi_score",
      "atmosphere_score",
      "laptop_friendliness",
      "power_outlet_score",
    ],
    last_verified: "2026-05-25",
  },
  {
    id: "espressolab-kadikoy",
    brand_slug: "espressolab",
    name: "Espressolab Kadikoy",
    coordinates: [29.0271, 40.9901],
    district: "Kadikoy",
    neighborhood_slug: "kadikoy",
    address: "Caferaga Mah. Muvakkithane Cad. No:7, 34710 Kadikoy, Istanbul",
    rating: 4.2,
    reviews_count: 600,
    wifi_score: null,
    atmosphere_score: null,
    laptop_friendliness: null,
    power_outlet_score: null,
    sources: [
      {
        label: "Restaurant Guru - Espressolab Kadikoy",
        url: "https://restaurantguru.com/Espressolab-Kadikoy-Istanbul",
      },
    ],
    unverified_fields: [
      "opening_hours",
      "wifi_score",
      "atmosphere_score",
      "laptop_friendliness",
      "power_outlet_score",
    ],
    last_verified: "2026-05-25",
  },

  // --- Starbucks ---
  {
    id: "starbucks-bebek",
    brand_slug: "starbucks",
    name: "Starbucks Bebek",
    coordinates: [29.0432, 41.0776],
    district: "Besiktas",
    neighborhood_slug: "besiktas",
    address: "Cevdetpasa Cad. No:36/A, Bebek, Besiktas, Istanbul",
    opening_hours: "7am-12am daily",
    rating: 4.4,
    reviews_count: 2500,
    wifi_score: null,
    atmosphere_score: null,
    laptop_friendliness: null,
    power_outlet_score: null,
    sources: [
      {
        label: "Tripadvisor - Starbucks Bebek (waterfront branch, rating)",
        url: "https://www.tripadvisor.com/Restaurant_Review-g293974-d3955617-Reviews-Starbucks-Istanbul.html",
      },
    ],
    unverified_fields: [
      "wifi_score",
      "atmosphere_score",
      "laptop_friendliness",
      "power_outlet_score",
    ],
    last_verified: "2026-05-25",
  },
  {
    id: "starbucks-kadikoy-reserve",
    brand_slug: "starbucks",
    name: "Starbucks Reserve Kadikoy",
    coordinates: [29.0258, 40.9905],
    district: "Kadikoy",
    neighborhood_slug: "kadikoy",
    address: "Osmanaga Mah. Sogutlucesme Cad., Kadikoy, Istanbul",
    rating: 4.3,
    reviews_count: 1800,
    wifi_score: null,
    atmosphere_score: null,
    laptop_friendliness: null,
    power_outlet_score: null,
    sources: [
      {
        label: "Foursquare - Starbucks Kadikoy",
        url: "https://foursquare.com/v/starbucks/4bd1a3f9b221c9b6f4b7e8a0",
      },
    ],
    unverified_fields: [
      "opening_hours",
      "wifi_score",
      "atmosphere_score",
      "laptop_friendliness",
      "power_outlet_score",
    ],
    last_verified: "2026-05-25",
  },

  // --- BEX Coffee ---
  {
    id: "bex-kadikoy",
    brand_slug: "bex-coffee",
    name: "BEX Coffee Kadikoy",
    coordinates: [29.0263, 40.9897],
    district: "Kadikoy",
    neighborhood_slug: "kadikoy",
    address: "Caferaga Mah., Kadikoy, Istanbul",
    rating: 4.3,
    reviews_count: 400,
    wifi_score: null,
    atmosphere_score: null,
    laptop_friendliness: null,
    power_outlet_score: null,
    sources: [
      {
        label: "BEX Coffee official - locations",
        url: "https://www.bexcoffee.com/subeler",
      },
    ],
    unverified_fields: [
      "opening_hours",
      "wifi_score",
      "atmosphere_score",
      "laptop_friendliness",
      "power_outlet_score",
    ],
    last_verified: "2026-05-25",
  },
];

// --- Static helpers (work on the seed; safe in client + server) ---

export function getBrandBySlug(slug: string): NomadBrand | undefined {
  return brands.find((b) => b.slug === slug);
}

export function getLocationsByBrand(slug: string): BrandLocation[] {
  return brandLocations.filter((l) => l.brand_slug === slug);
}

export function getLocationsByNeighborhood(slug: string): BrandLocation[] {
  return brandLocations.filter((l) => l.neighborhood_slug === slug);
}
