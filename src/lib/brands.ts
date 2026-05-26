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
  /**
   * Path to the brand's own logo SVG under public/brands/<slug>.svg. Rendered
   * on a white pill/circle in the map markers and filter chips - the real
   * brand mark, not an emoji.
   */
  logo: string;
  category: BrandCategory;
  /** Hex colour (drawn from the brand's logo) used for the marker/chip ring. */
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
    logo: "/brands/espressolab.svg",
    category: "coffee",
    color: "#ae0101",
    blurb:
      "Turkish specialty chain. Big menus, consistent across branches, easy to find on both sides.",
    website: "https://www.espressolab.com",
  },
  {
    slug: "starbucks",
    name: "Starbucks",
    logo: "/brands/starbucks.svg",
    category: "coffee",
    color: "#00704a",
    blurb:
      "The reliable fallback. Plenty of branches, usually has sockets and a familiar setup for a quick session.",
    website: "https://www.starbucks.com.tr",
  },
  {
    slug: "bex-coffee",
    name: "BEX Coffee",
    logo: "/brands/bex-coffee.svg",
    category: "coffee",
    color: "#2b2b2b",
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
  {
    id: "espressolab-bebek",
    brand_slug: "espressolab",
    name: "Espressolab Bebek",
    coordinates: [29.043799, 41.077298],
    district: "Besiktas",
    address: "Bebek Mah. Cevdetpasa Cad. No:22, Bebek, Besiktas, Istanbul",
    opening_hours: "Closes 2am",
    rating: 4.8,
    reviews_count: 73,
    wifi_score: null,
    atmosphere_score: null,
    laptop_friendliness: null,
    power_outlet_score: null,
    sources: [
      {
        label:
          "Yandex Maps - Espressolab Bebek (address, coordinates, hours, rating)",
        url: "https://yandex.com.tr/maps/org/espressolab_bebek/190111638963/",
      },
    ],
    unverified_fields: [
      "wifi_score",
      "atmosphere_score",
      "laptop_friendliness",
      "power_outlet_score",
    ],
    last_verified: "2026-05-26",
  },
  {
    id: "espressolab-nisantasi",
    brand_slug: "espressolab",
    name: "Espressolab Nisantasi",
    coordinates: [28.994742, 41.048626],
    district: "Sisli",
    neighborhood_slug: "nisantasi",
    address: "Husrev Gerede Cad. No:106A, Nisantasi, Sisli, Istanbul",
    opening_hours: "Closes 12am",
    rating: 4.7,
    reviews_count: 53,
    wifi_score: null,
    atmosphere_score: null,
    laptop_friendliness: null,
    power_outlet_score: null,
    sources: [
      {
        label:
          "Yandex Maps - Espressolab Nisantasi (address, coordinates, hours, rating)",
        url: "https://yandex.com.tr/maps/org/espressolab_nisantasi/50162383789/",
      },
    ],
    unverified_fields: [
      "wifi_score",
      "atmosphere_score",
      "laptop_friendliness",
      "power_outlet_score",
    ],
    last_verified: "2026-05-26",
  },
  {
    id: "espressolab-uskudar-altunizade",
    brand_slug: "espressolab",
    name: "Espressolab Uskudar Altunizade",
    coordinates: [29.035769, 41.025159],
    district: "Uskudar",
    neighborhood_slug: "uskudar",
    address: "Cumhuriyet Cad. No:159A, Altunizade, Uskudar, Istanbul",
    opening_hours: "Closes 1am",
    rating: 4.8,
    reviews_count: 27,
    wifi_score: null,
    atmosphere_score: null,
    laptop_friendliness: null,
    power_outlet_score: null,
    sources: [
      {
        label:
          "Yandex Maps - Espressolab Uskudar Altunizade (address, coordinates, hours, rating)",
        url: "https://yandex.com.tr/maps/org/espressolab/172096159717/",
      },
    ],
    unverified_fields: [
      "wifi_score",
      "atmosphere_score",
      "laptop_friendliness",
      "power_outlet_score",
    ],
    last_verified: "2026-05-26",
  },
  {
    id: "espressolab-istiklal",
    brand_slug: "espressolab",
    name: "Espressolab Istiklal",
    coordinates: [28.975366, 41.029295],
    district: "Beyoglu",
    address: "Sahkulu Mah. Istiklal Cad. No:233, Beyoglu, Istanbul",
    opening_hours: "Closes 1:30am",
    rating: 4.5,
    reviews_count: 130,
    wifi_score: null,
    atmosphere_score: null,
    laptop_friendliness: null,
    power_outlet_score: null,
    sources: [
      {
        label:
          "Yandex Maps - Espressolab Istiklal/Tunel (address, coordinates, hours, rating)",
        url: "https://yandex.com.tr/maps/org/espressolab_taksim_tunel/80971034520/",
      },
    ],
    unverified_fields: [
      "wifi_score",
      "atmosphere_score",
      "laptop_friendliness",
      "power_outlet_score",
    ],
    last_verified: "2026-05-26",
  },
  {
    id: "espressolab-karakoy",
    brand_slug: "espressolab",
    name: "Espressolab Karakoy",
    coordinates: [28.976956, 41.022683],
    district: "Beyoglu",
    neighborhood_slug: "galata",
    address:
      "Kemankes Karamustafapasa Mah. Gumruk Sok. No:26A, Karakoy, Beyoglu, Istanbul",
    opening_hours: "Closes 10:30pm",
    rating: 4.7,
    reviews_count: 24,
    wifi_score: null,
    atmosphere_score: null,
    laptop_friendliness: null,
    power_outlet_score: null,
    sources: [
      {
        label:
          "Yandex Maps - Espressolab Karakoy (address, coordinates, hours, rating)",
        url: "https://yandex.com.tr/maps/org/espressolab_karakoy_wings_otel/75139763732/",
      },
    ],
    unverified_fields: [
      "wifi_score",
      "atmosphere_score",
      "laptop_friendliness",
      "power_outlet_score",
    ],
    last_verified: "2026-05-26",
  },
  {
    id: "espressolab-etiler",
    brand_slug: "espressolab",
    name: "Espressolab Etiler",
    coordinates: [29.03561, 41.081028],
    district: "Besiktas",
    address: "Etiler Mah. Nisbetiye Cad. No:108/B, Etiler, Besiktas, Istanbul",
    rating: 4.4,
    reviews_count: 943,
    wifi_score: null,
    atmosphere_score: null,
    laptop_friendliness: null,
    power_outlet_score: null,
    sources: [
      {
        label:
          "Wanderlog - Espressolab Etiler/Nisbetiye (address, coordinates, rating)",
        url: "https://wanderlog.com/place/details/3731771/espressolab",
      },
      {
        label: "Tripadvisor - Espressolab Nispetiye Caddesi No:108/B",
        url: "https://www.tripadvisor.com/Restaurant_Review-g293974-d17792061-Reviews-Espressolab-Istanbul.html",
      },
    ],
    unverified_fields: [
      "opening_hours",
      "wifi_score",
      "atmosphere_score",
      "laptop_friendliness",
      "power_outlet_score",
    ],
    last_verified: "2026-05-26",
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
  {
    id: "starbucks-moda",
    brand_slug: "starbucks",
    name: "Starbucks Moda",
    coordinates: [29.023507, 40.980747],
    district: "Kadikoy",
    neighborhood_slug: "moda",
    address: "Caferaga Mah. Moda Cad. No:188/C, Moda, Kadikoy, Istanbul",
    opening_hours: "7:30am-10pm daily",
    rating: 4.0,
    reviews_count: 6908,
    wifi_score: null,
    atmosphere_score: null,
    laptop_friendliness: null,
    power_outlet_score: null,
    sources: [
      {
        label:
          "Wanderlog - Starbucks Moda Cad. (address, coordinates, hours, rating)",
        url: "https://wanderlog.com/place/details/4813843/starbucks",
      },
    ],
    unverified_fields: [
      "wifi_score",
      "atmosphere_score",
      "laptop_friendliness",
      "power_outlet_score",
    ],
    last_verified: "2026-05-26",
  },
  {
    id: "starbucks-karakoy",
    brand_slug: "starbucks",
    name: "Starbucks Karakoy",
    coordinates: [28.980509, 41.025776],
    district: "Beyoglu",
    neighborhood_slug: "galata",
    address:
      "Kemankes Karamustafa Pasa Mah. Mumhane Cad. No:50, Karakoy, Beyoglu, Istanbul",
    opening_hours: "6:30am-10pm daily",
    rating: 3.9,
    reviews_count: 47,
    wifi_score: null,
    atmosphere_score: null,
    laptop_friendliness: null,
    power_outlet_score: null,
    sources: [
      {
        label:
          "Tripadvisor - Starbucks Karakoy (address, coordinates, hours, rating)",
        url: "https://www.tripadvisor.com/Restaurant_Review-g293974-d6160543-Reviews-Starbucks_Karakoy-Istanbul.html",
      },
    ],
    unverified_fields: [
      "wifi_score",
      "atmosphere_score",
      "laptop_friendliness",
      "power_outlet_score",
    ],
    last_verified: "2026-05-26",
  },
  {
    id: "starbucks-galataport",
    brand_slug: "starbucks",
    name: "Starbucks Galataport",
    coordinates: [28.9848316, 41.0280111],
    district: "Beyoglu",
    neighborhood_slug: "galata",
    address:
      "Kilicali Pasa Mah. Meclis-i Mebusan Cad. No:8, Galataport, Beyoglu, Istanbul",
    opening_hours: "7:30am-11pm daily",
    wifi_score: null,
    atmosphere_score: null,
    laptop_friendliness: null,
    power_outlet_score: null,
    sources: [
      {
        label:
          "Starbucks official store locator - Galataport (address, coordinates)",
        url: "https://www.starbucks.com/store-locator/store/1032480/galataport-meydan-6-meclis-i-mebusan-caddesi-istanbul-34-34425-tr",
      },
      {
        label: "Tikla.com.tr - Starbucks Galataport (coordinates, hours)",
        url: "https://www.tikla.com.tr/starbucks-galataport.html",
      },
    ],
    unverified_fields: [
      "rating",
      "reviews_count",
      "wifi_score",
      "atmosphere_score",
      "laptop_friendliness",
      "power_outlet_score",
    ],
    last_verified: "2026-05-26",
  },
  {
    id: "starbucks-kanyon-levent",
    brand_slug: "starbucks",
    name: "Starbucks Kanyon Levent",
    coordinates: [29.0067, 41.0737],
    district: "Sisli",
    neighborhood_slug: "levent",
    address:
      "Esentepe Mah. Buyukdere Cad. No:185, Kanyon AVM, Levent, Sisli, Istanbul",
    wifi_score: null,
    atmosphere_score: null,
    laptop_friendliness: null,
    power_outlet_score: null,
    sources: [
      {
        label: "Starbucks official store locator - Kanyon Levent (address)",
        url: "https://www.starbucks.com/store-locator/store/5939/kanyon-zemin-kat-buyukdere-cad-levent-kanyon-alisveris-istanbul-34-",
      },
      {
        label: "Latitude.to - Kanyon Shopping Mall coordinates",
        url: "https://latitude.to/satellite-map/tr/turkey/57182/kanyon-shopping-mall",
      },
    ],
    unverified_fields: [
      "opening_hours",
      "rating",
      "reviews_count",
      "wifi_score",
      "atmosphere_score",
      "laptop_friendliness",
      "power_outlet_score",
    ],
    last_verified: "2026-05-26",
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
  {
    id: "bex-uskudar-bosna",
    brand_slug: "bex-coffee",
    name: "BEX Coffee & Chocolate Uskudar",
    coordinates: [29.078483, 41.040736],
    district: "Uskudar",
    neighborhood_slug: "uskudar",
    address: "Bosna Blv. No:104A/A, Bahcelievler, Uskudar, Istanbul",
    opening_hours: "Closes 1:30am",
    rating: 4.3,
    reviews_count: 32,
    wifi_score: null,
    atmosphere_score: null,
    laptop_friendliness: null,
    power_outlet_score: null,
    sources: [
      {
        label:
          "Yandex Maps - BEX Coffee & Chocolate Uskudar (address, coordinates, hours, rating)",
        url: "https://yandex.com.tr/maps/org/bex_coffee_chocolate/113452351188/",
      },
    ],
    unverified_fields: [
      "wifi_score",
      "atmosphere_score",
      "laptop_friendliness",
      "power_outlet_score",
    ],
    last_verified: "2026-05-26",
  },
  {
    id: "bex-sisli-fulya",
    brand_slug: "bex-coffee",
    name: "BEX Coffee Fulya",
    coordinates: [28.993395, 41.064197],
    district: "Sisli",
    address: "Fulya Mah. Aytekin Kotil Cad. No:1/C, Fulya, Sisli, Istanbul",
    opening_hours: "Closes 12am",
    rating: 4.3,
    reviews_count: 6,
    wifi_score: null,
    atmosphere_score: null,
    laptop_friendliness: null,
    power_outlet_score: null,
    sources: [
      {
        label:
          "Yandex Maps - BEX Coffee Fulya/Sisli (address, coordinates, hours, rating)",
        url: "https://yandex.com.tr/maps/org/bex_coffee/83746595891/",
      },
    ],
    unverified_fields: [
      "wifi_score",
      "atmosphere_score",
      "laptop_friendliness",
      "power_outlet_score",
    ],
    last_verified: "2026-05-26",
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
