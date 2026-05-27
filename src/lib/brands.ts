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
  {
    slug: "mikel",
    name: "Mikel Coffee",
    logo: "/brands/mikel.svg",
    category: "coffee",
    color: "#141414",
    blurb:
      "Greek-born chain that took off in Istanbul. Big airy branches with lots of seating - easy to settle in with a laptop.",
    website: "https://www.mikelcoffee.com",
  },
  {
    slug: "kahve-dunyasi",
    name: "Kahve Dünyası",
    logo: "/brands/kahve-dunyasi.svg",
    category: "coffee",
    color: "#7b1e3a",
    blurb:
      "Turkish staple with big stores and plenty of sockets. You'll find one on almost every main street.",
    website: "https://www.kahvedunyasi.com",
  },
  {
    slug: "caffe-nero",
    name: "Caffè Nero",
    logo: "/brands/caffe-nero.svg",
    category: "coffee",
    color: "#15356b",
    blurb:
      "Reliable wifi and power with comfy seating. A solid fallback when you need a few quiet hours of work.",
    website: "https://www.caffenero.com.tr",
  },
  {
    slug: "gloria-jeans",
    name: "Gloria Jean's",
    logo: "/brands/gloria-jeans.svg",
    category: "coffee",
    color: "#6e2639",
    blurb:
      "Roomy branches in malls and on high streets - good for a longer sit-down session.",
    website: "https://www.gloriajeanscoffees.com.tr",
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
  {
    id: "espressolab-mecidiyekoy-meydan",
    brand_slug: "espressolab",
    name: "Espressolab Mecidiyekoy Meydan",
    coordinates: [28.995569, 41.065897],
    district: "Sisli",
    address:
      "Mecidiyekoy Mah. Buyukdere Cad. No:52A, Mecidiyekoy, Sisli, Istanbul",
    opening_hours: "Closes 1:30am",
    rating: 4.6,
    reviews_count: 9,
    wifi_score: null,
    atmosphere_score: null,
    laptop_friendliness: null,
    power_outlet_score: null,
    sources: [
      {
        label:
          "Yandex Maps - Espressolab Mecidiyekoy Meydan (address, coordinates, hours, rating)",
        url: "https://yandex.com.tr/maps/org/espressolab_mecidiyekoy_meydan/198737888376/",
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
    id: "espressolab-taskisla-harbiye",
    brand_slug: "espressolab",
    name: "Espressolab Taskisla",
    coordinates: [28.989536, 41.042158],
    district: "Sisli",
    address: "Harbiye Mah. Taskisla Cad. No:2, ITU Kampusu, Sisli, Istanbul",
    rating: 4.5,
    reviews_count: 2337,
    wifi_score: null,
    atmosphere_score: null,
    laptop_friendliness: null,
    power_outlet_score: null,
    sources: [
      {
        label:
          "Wanderlog - Espressolab Taskisla (address, coordinates, rating, reviews)",
        url: "https://wanderlog.com/place/details/424154/espressolab-ta%C5%9Fk%C4%B1%C5%9Fla",
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
  {
    id: "espressolab-taksim-istiklal-15",
    brand_slug: "espressolab",
    name: "Espressolab Taksim (Istiklal No:15)",
    coordinates: [28.984173, 41.036114],
    district: "Beyoglu",
    address:
      "Katip Mustafa Celebi Mah. Istiklal Cad. No:15, Taksim, Beyoglu, Istanbul",
    rating: 3.5,
    reviews_count: 172,
    wifi_score: null,
    atmosphere_score: null,
    laptop_friendliness: null,
    power_outlet_score: null,
    sources: [
      {
        label:
          "Tripadvisor - Espressolab Taksim, Istiklal Cad No:15 (address, coordinates, rating, reviews)",
        url: "https://www.tripadvisor.com/Restaurant_Review-g293974-d8539405-Reviews-Espressolab_Taksim-Istanbul.html",
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
  {
    id: "espressolab-itu-ayazaga-maslak",
    brand_slug: "espressolab",
    name: "Espressolab ITU Ayazaga",
    coordinates: [29.023531, 41.10542],
    district: "Sariyer",
    address:
      "Resitpasa Mah. Katar Cad. ITU Ayazaga Merkezi Derslik 2/32/1, Maslak, Sariyer, Istanbul",
    rating: 5.0,
    reviews_count: 2,
    wifi_score: null,
    atmosphere_score: null,
    laptop_friendliness: null,
    power_outlet_score: null,
    sources: [
      {
        label:
          "Tripadvisor - Espressolab ITU Ayazaga, Resitpasa/Maslak (address, coordinates, rating, reviews)",
        url: "https://www.tripadvisor.com/Restaurant_Review-g293974-d17397740-Reviews-EspressoLab-Istanbul.html",
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
  {
    id: "espressolab-bakirkoy-cevizlik",
    brand_slug: "espressolab",
    name: "Espressolab Bakirkoy",
    coordinates: [28.87448, 40.97875],
    district: "Bakirkoy",
    address: "Cevizlik Mah. Fahri Koruturk Cad. No:2 B/1, Bakirkoy, Istanbul",
    wifi_score: null,
    atmosphere_score: null,
    laptop_friendliness: null,
    power_outlet_score: null,
    sources: [
      {
        label:
          "Tripadvisor - Espressolab Bakirkoy, Cevizlik Mah. (address, coordinates)",
        url: "https://www.tripadvisor.com/Restaurant_Review-g293974-d20300772-Reviews-Espressolab-Istanbul.html",
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
  {
    id: "espressolab-maslak-kapital",
    brand_slug: "espressolab",
    name: "Espressolab Maslak Kapital",
    coordinates: [29.017426, 41.108675],
    district: "Sariyer",
    address: "Eski Buyukdere Cad. No:1719, Maslak, Sariyer, Istanbul",
    opening_hours: "Closes 9:30pm",
    rating: 1.7,
    reviews_count: 3,
    wifi_score: null,
    atmosphere_score: null,
    laptop_friendliness: null,
    power_outlet_score: null,
    sources: [
      {
        label:
          "Yandex Maps - Espressolab Maslak Kapital (address, coordinates, hours, rating)",
        url: "https://yandex.com.tr/maps/org/espressolab_maslak_kapital/189708630346/",
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
    id: "espressolab-beylikduzu-makyol",
    brand_slug: "espressolab",
    name: "Espressolab Beylikduzu Makyol",
    coordinates: [28.653976, 41.004958],
    district: "Beylikduzu",
    address: "Baris Mah. Samsun Cad. No:14, Beylikduzu, Istanbul",
    opening_hours: "Closes 1am",
    rating: 4.6,
    reviews_count: 12,
    wifi_score: null,
    atmosphere_score: null,
    laptop_friendliness: null,
    power_outlet_score: null,
    sources: [
      {
        label:
          "Yandex Maps - Espressolab Beylikduzu Makyol (address, coordinates, hours, rating)",
        url: "https://yandex.com.tr/maps/org/espressolab_beylikduzu_makyol/51019730847/",
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
    id: "espressolab-suadiye",
    brand_slug: "espressolab",
    name: "Espressolab Suadiye",
    coordinates: [29.085814, 40.963569],
    district: "Kadikoy",
    address: "Suadiye Mah. Ayse Cavus Cad. No:31, Suadiye, Kadikoy, Istanbul",
    rating: 3.2,
    reviews_count: 7,
    wifi_score: null,
    atmosphere_score: null,
    laptop_friendliness: null,
    power_outlet_score: null,
    sources: [
      {
        label:
          "Yandex Maps - Espressolab Suadiye (address, coordinates, rating)",
        url: "https://yandex.com.tr/maps/org/espressolab_suadiye/194556913520/",
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
  {
    id: "espressolab-atasehir",
    brand_slug: "espressolab",
    name: "Espressolab Atasehir",
    coordinates: [29.126153, 40.989675],
    district: "Atasehir",
    neighborhood_slug: "atasehir",
    address: "Ataturk Mah., Atasehir, Istanbul",
    opening_hours: "Closes 1am",
    rating: 2.4,
    reviews_count: 14,
    wifi_score: null,
    atmosphere_score: null,
    laptop_friendliness: null,
    power_outlet_score: null,
    sources: [
      {
        label:
          "Yandex Maps - Espressolab Atasehir, Ataturk Mah. (address, coordinates, hours, rating)",
        url: "https://yandex.com.tr/maps/org/espressolab/69478879573/",
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
    id: "espressolab-caddebostan",
    brand_slug: "espressolab",
    name: "Espressolab Caddebostan",
    coordinates: [29.066006, 40.963848],
    district: "Kadikoy",
    address:
      "Caddebostan Mah. Operator Cemil Topuzlu Cad. No:145, Caddebostan, Kadikoy, Istanbul",
    opening_hours: "Closes 1am",
    rating: 4.6,
    reviews_count: 19,
    wifi_score: null,
    atmosphere_score: null,
    laptop_friendliness: null,
    power_outlet_score: null,
    sources: [
      {
        label:
          "Yandex Maps - Espressolab Caddebostan (address, coordinates, hours, rating)",
        url: "https://yandex.com.tr/maps/org/espressolab_caddebostan/164619678358/",
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
    id: "espressolab-santralistanbul",
    brand_slug: "espressolab",
    name: "Espressolab Santralistanbul",
    coordinates: [28.945715, 41.066784],
    district: "Eyupsultan",
    address:
      "Emniyettepe Mah. Kazim Karabekir Cad. No:2/20, Santralistanbul, Eyupsultan, Istanbul",
    rating: 4.5,
    reviews_count: 3234,
    wifi_score: null,
    atmosphere_score: null,
    laptop_friendliness: null,
    power_outlet_score: null,
    sources: [
      {
        label:
          "Wanderlog - Espressolab Santralistanbul (address, coordinates, rating, reviews)",
        url: "https://wanderlog.com/place/details/129391/espressolab-santralistanbul",
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
  {
    id: "espressolab-emirgan",
    brand_slug: "espressolab",
    name: "Espressolab Emirgan",
    coordinates: [29.05645, 41.10483],
    district: "Sariyer",
    address:
      "Emirgan Mah. Dogru Muvakkithane Cad. No:4, Emirgan, Sariyer, Istanbul",
    rating: 4.4,
    reviews_count: 11,
    wifi_score: null,
    atmosphere_score: null,
    laptop_friendliness: null,
    power_outlet_score: null,
    sources: [
      {
        label:
          "Tripadvisor - Espressolab Emirgan (address, coordinates, rating, reviews)",
        url: "https://www.tripadvisor.com/Restaurant_Review-g293974-d9844825-Reviews-EspressoLab-Istanbul.html",
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
  {
    id: "espressolab-vadistanbul",
    brand_slug: "espressolab",
    name: "Espressolab Vadistanbul",
    coordinates: [28.99098, 41.10936],
    district: "Sariyer",
    address:
      "Ayazaga Mah. Cendere Cad. No:109/C1, Vadistanbul AVM, Sariyer, Istanbul",
    rating: 3.7,
    reviews_count: 3,
    wifi_score: null,
    atmosphere_score: null,
    laptop_friendliness: null,
    power_outlet_score: null,
    sources: [
      {
        label:
          "Tripadvisor - Espressolab Vadistanbul (address, coordinates, rating, reviews)",
        url: "https://www.tripadvisor.com/Restaurant_Review-g293974-d17811130-Reviews-Espressolab_Vadi_Istanbul-Istanbul.html",
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
  {
    id: "espressolab-roastery-gungoren",
    brand_slug: "espressolab",
    name: "Espressolab Roastery",
    coordinates: [28.95707, 41.00986],
    district: "Gungoren",
    address: "Tozkoparan Mah. General Ali Riza Gurcan Cad., Gungoren, Istanbul",
    opening_hours: "7am-3am daily",
    rating: 5.0,
    reviews_count: 1,
    wifi_score: null,
    atmosphere_score: null,
    laptop_friendliness: null,
    power_outlet_score: null,
    sources: [
      {
        label:
          "Tripadvisor - Espressolab Roastery, Tozkoparan/Gungoren (address, coordinates, hours, rating)",
        url: "https://www.tripadvisor.com/Restaurant_Review-g293974-d25646092-Reviews-Espressolab_Roastery-Istanbul.html",
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
  {
    id: "starbucks-istiklal-sehit-muhtar",
    brand_slug: "starbucks",
    name: "Starbucks Istiklal (No:16/A)",
    coordinates: [28.98279, 41.03585],
    district: "Beyoglu",
    address:
      "Sehit Muhtar Mah. Istiklal Cad. No:16/A, Taksim, Beyoglu, Istanbul",
    rating: 3.3,
    reviews_count: 22,
    wifi_score: null,
    atmosphere_score: null,
    laptop_friendliness: null,
    power_outlet_score: null,
    sources: [
      {
        label:
          "Tripadvisor - Starbucks Istiklal Cad. No:16/A, Beyoglu (address, coordinates, rating, reviews)",
        url: "https://www.tripadvisor.com/Restaurant_Review-g293974-d9720036-Reviews-Starbucks-Istanbul.html",
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
  {
    id: "starbucks-istiklal-tunel",
    brand_slug: "starbucks",
    name: "Starbucks Istiklal (No:469-471)",
    coordinates: [28.97408, 41.02731],
    district: "Beyoglu",
    address: "Sahkulu Mah. Istiklal Cad. No:469-471, Tunel, Beyoglu, Istanbul",
    opening_hours: "7am-11pm (Fri-Sat to 12am)",
    rating: 3.1,
    reviews_count: 14,
    wifi_score: null,
    atmosphere_score: null,
    laptop_friendliness: null,
    power_outlet_score: null,
    sources: [
      {
        label:
          "Tripadvisor - Starbucks Istiklal Cad. No:469-471, Beyoglu (address, coordinates, hours, rating, reviews)",
        url: "https://www.tripadvisor.in/Restaurant_Review-g293974-d10792535-Reviews-Starbucks-Istanbul.html",
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
    id: "starbucks-maslak-sun-plaza",
    brand_slug: "starbucks",
    name: "Starbucks Maslak Sun Plaza",
    coordinates: [29.019278, 41.10991],
    district: "Sariyer",
    address: "Buyukdere Cad., Sun Plaza, Maslak, Sariyer, Istanbul",
    opening_hours: "7am-7pm (Mon-Fri)",
    wifi_score: null,
    atmosphere_score: null,
    laptop_friendliness: null,
    power_outlet_score: null,
    sources: [
      {
        label:
          "Tripadvisor - Starbucks Maslak, Sun Plaza, Buyukdere Cad. (address, coordinates, hours)",
        url: "https://www.tripadvisor.com/Restaurant_Review-g27491329-d27504741-Reviews-Starbucks-Maslak.html",
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
    id: "starbucks-levent-199-plaza",
    brand_slug: "starbucks",
    name: "Starbucks Levent 199 Plaza",
    coordinates: [29.010548, 41.08042],
    district: "Besiktas",
    neighborhood_slug: "levent",
    address:
      "Esentepe Mah. Buyukdere Cad. Levent 199 Plaza No:199, Levent, Istanbul",
    wifi_score: null,
    atmosphere_score: null,
    laptop_friendliness: null,
    power_outlet_score: null,
    sources: [
      {
        label:
          "Tripadvisor - Starbucks Levent 199 Plaza, Buyukdere Cad. (address, coordinates)",
        url: "https://www.tripadvisor.com/Restaurant_Review-g293974-d27516557-Reviews-Starbucks-Istanbul.html",
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
  {
    id: "starbucks-sisli-cumhuriyet",
    brand_slug: "starbucks",
    name: "Starbucks Sisli Cumhuriyet",
    coordinates: [28.986973, 41.04194],
    district: "Sisli",
    address: "Cumhuriyet Cad. No:34D, Sisli, Istanbul",
    opening_hours: "Closes 10pm",
    rating: 3.9,
    reviews_count: 9,
    wifi_score: null,
    atmosphere_score: null,
    laptop_friendliness: null,
    power_outlet_score: null,
    sources: [
      {
        label:
          "Yandex Maps - Starbucks Sisli Cumhuriyet Cad. (address, coordinates, hours, rating)",
        url: "https://yandex.com.tr/maps/org/starbucks/1556392269/",
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
    id: "starbucks-istiklal-narmanli",
    brand_slug: "starbucks",
    name: "Starbucks Istiklal (Narmanli Han)",
    coordinates: [28.974647, 41.029282],
    district: "Beyoglu",
    address:
      "Asmali Mescit Mah. Istiklal Cad. Narmanli Han No:180/3A, Tunel, Beyoglu, Istanbul",
    opening_hours: "Closes 11:45pm",
    rating: 4.2,
    reviews_count: 91,
    wifi_score: null,
    atmosphere_score: null,
    laptop_friendliness: null,
    power_outlet_score: null,
    sources: [
      {
        label:
          "Yandex Maps - Starbucks Coffee Narmanli Han, Istiklal Cad. (address, coordinates, hours, rating)",
        url: "https://yandex.com.tr/maps/org/starbucks_coffee/95093128414/",
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
    id: "starbucks-ortakoy",
    brand_slug: "starbucks",
    name: "Starbucks Ortakoy",
    coordinates: [29.02756, 41.04885],
    district: "Besiktas",
    address:
      "Muallim Naci Cad. Incesu Is Merkezi No:43, Ortakoy, Besiktas, Istanbul",
    rating: 4.1,
    reviews_count: 45,
    wifi_score: null,
    atmosphere_score: null,
    laptop_friendliness: null,
    power_outlet_score: null,
    sources: [
      {
        label:
          "Tripadvisor - Starbucks Coffee Ortakoy (address, coordinates, rating, reviews)",
        url: "https://www.tripadvisor.com/Restaurant_Review-g293974-d5509726-Reviews-Starbucks_Coffee_Ortakoy-Istanbul.html",
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
  {
    id: "starbucks-itu-teknokent-maslak",
    brand_slug: "starbucks",
    name: "Starbucks ITU Teknokent Maslak",
    coordinates: [29.00407, 41.10953],
    district: "Sariyer",
    address: "ITU Teknokent, Ayazaga, Maslak, Sariyer, Istanbul",
    rating: 3.7,
    reviews_count: 26,
    wifi_score: null,
    atmosphere_score: null,
    laptop_friendliness: null,
    power_outlet_score: null,
    sources: [
      {
        label:
          "Tripadvisor - Starbucks Coffee ITU Teknokent Maslak (address, coordinates, rating, reviews)",
        url: "https://www.tripadvisor.com/Restaurant_Review-g293974-d8026814-Reviews-Starbucks_Coffee-Istanbul.html",
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
  {
    id: "starbucks-forum-istanbul",
    brand_slug: "starbucks",
    name: "Starbucks Forum Istanbul",
    coordinates: [28.89584, 41.048416],
    district: "Bayrampasa",
    address:
      "Kocatepe Mah. Pasa Cad. Forum Istanbul No:3-5 D:1011, Bayrampasa, Istanbul",
    opening_hours: "8:30am-11pm daily",
    wifi_score: null,
    atmosphere_score: null,
    laptop_friendliness: null,
    power_outlet_score: null,
    sources: [
      {
        label:
          "Tripadvisor - Starbucks Forum Istanbul, Kocatepe (address, coordinates, hours)",
        url: "https://www.tripadvisor.com/Restaurant_Review-g293974-d27489016-Reviews-Starbucks-Istanbul.html",
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
    id: "starbucks-reserve-kosuyolu",
    brand_slug: "starbucks",
    name: "Starbucks Reserve Kosuyolu",
    coordinates: [29.0404, 41.0094],
    district: "Kadikoy",
    address:
      "Kosuyolu Mah. Muhittin Ustundag Cad. No:75, Kosuyolu, Kadikoy, Istanbul",
    opening_hours: "7am-11:45pm daily",
    rating: 3.9,
    reviews_count: 7,
    wifi_score: null,
    atmosphere_score: null,
    laptop_friendliness: null,
    power_outlet_score: null,
    sources: [
      {
        label:
          "Tripadvisor - Starbucks Reserve Kosuyolu, Kadikoy (address, coordinates, hours, rating)",
        url: "https://www.tripadvisor.com/Restaurant_Review-g293974-d12235183-Reviews-Starbucks_Reserve-Istanbul.html",
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
    id: "starbucks-galleria-atakoy",
    brand_slug: "starbucks",
    name: "Starbucks Galleria Atakoy",
    coordinates: [28.86959, 40.97425],
    district: "Bakirkoy",
    address: "Rauf Orbay Cad. No:6, Galleria, Atakoy, Bakirkoy, Istanbul",
    rating: 4.3,
    reviews_count: 12,
    wifi_score: null,
    atmosphere_score: null,
    laptop_friendliness: null,
    power_outlet_score: null,
    sources: [
      {
        label:
          "Tripadvisor - Starbucks Galleria Atakoy, Rauf Orbay Cad. (address, coordinates, rating, reviews)",
        url: "https://www.tripadvisor.com/Restaurant_Review-g293974-d8863483-Reviews-Starbucks-Istanbul.html",
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
  {
    id: "bex-pendik-kurtkoy",
    brand_slug: "bex-coffee",
    name: "BEX Coffee Kurtkoy",
    coordinates: [29.282994, 40.909691],
    district: "Pendik",
    address: "Ankara Cad. No:402/A, Kurtkoy, Pendik, Istanbul",
    opening_hours: "Closes 1am",
    rating: 4.9,
    reviews_count: 12,
    wifi_score: null,
    atmosphere_score: null,
    laptop_friendliness: null,
    power_outlet_score: null,
    sources: [
      {
        label:
          "Yandex Maps - BEX Coffee Pendik/Kurtkoy, Ankara Cad. (address, coordinates, rating, reviews)",
        url: "https://yandex.com/maps/org/bex_coffee/219091660329/",
      },
      {
        label: "Tripadvisor - BEX Coffee Kurtkoy (address, hours, rating)",
        url: "https://www.tripadvisor.com/Restaurant_Review-g293974-d33374614-Reviews-BEX_Coffee_Kurtkoy-Istanbul.html",
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
    id: "bex-kucukyali",
    brand_slug: "bex-coffee",
    name: "BEX Coffee Kucukyali",
    coordinates: [29.0975936, 40.973471],
    district: "Maltepe",
    address:
      "Cinar Mah. Kadir Has Cad. C05 No:55 B, 34840 Kucukyali, Maltepe, Istanbul",
    opening_hours: "8am-12am daily",
    wifi_score: null,
    atmosphere_score: null,
    laptop_friendliness: null,
    power_outlet_score: null,
    sources: [
      {
        label: "BEX Coffee official store locator (address, hours)",
        url: "https://www.bexcoffee.com/pages/kafelerimiz",
      },
      {
        label: "Google Maps - BEX Coffee Kucukyali (coordinates)",
        url: "https://www.google.com/maps/place/BEX+Coffee/@40.973471,29.0975936,17z",
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
    id: "bex-sancaktepe",
    brand_slug: "bex-coffee",
    name: "BEX Coffee Sancaktepe",
    coordinates: [29.2302881, 40.991444],
    district: "Sancaktepe",
    address:
      "Sinpas Metrolife, Abdurrahmangazi Mah. Ebubekir Cad. No:28 D:56, 34887 Sancaktepe, Istanbul",
    opening_hours: "8am-12am daily",
    wifi_score: null,
    atmosphere_score: null,
    laptop_friendliness: null,
    power_outlet_score: null,
    sources: [
      {
        label: "BEX Coffee official store locator (address, hours)",
        url: "https://www.bexcoffee.com/pages/kafelerimiz",
      },
      {
        label: "Google Maps - BEX Coffee Sancaktepe (coordinates)",
        url: "https://www.google.com/maps/place/BEX+Coffee+-+Sancaktepe/@40.991444,29.2302881,17z",
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
