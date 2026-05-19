// Hero fixture data - powers the cinematic homepage map.
// v1 ships with curated fixtures; v2 will pull real members from Supabase
// and real venues from src/lib/spaces.ts. Tracked as a follow-up.

export type HeroCategoryKey =
  | "cafe"
  | "bar"
  | "gaming"
  | "events"
  | "restaurant"
  | "coworking"
  | "gallery";

export type HeroCategory = {
  key: HeroCategoryKey;
  label: string;
  color: string;
};

export const HERO_PALETTE = {
  deepWater: "#06101f",
  water: "#0a1a2f",
  waterHi: "#13294a",
  gold: "#f4b860",
  goldSoft: "#e8a647",
  rose: "#e87a5d",
  cream: "#f6ecd9",
} as const;

export const HERO_CATEGORIES: Record<HeroCategoryKey, HeroCategory> = {
  cafe: { key: "cafe", label: "Cafés", color: "#f4b860" },
  bar: { key: "bar", label: "Bars", color: "#e87a5d" },
  gaming: { key: "gaming", label: "Gaming", color: "#a78bfa" },
  events: { key: "events", label: "Events", color: "#fde68a" },
  restaurant: { key: "restaurant", label: "Restaurants", color: "#fb923c" },
  coworking: { key: "coworking", label: "Coworking", color: "#7dd3fc" },
  gallery: { key: "gallery", label: "Galleries", color: "#86efac" },
};

export type HeroNeighborhood = {
  id: string;
  label: string;
  lat: number;
  lng: number;
};

export const HERO_NEIGHBORHOODS: HeroNeighborhood[] = [
  { id: "beyoglu", label: "Beyoğlu", lat: 41.0339, lng: 28.9784 },
  { id: "karakoy", label: "Karaköy", lat: 41.0254, lng: 28.9763 },
  { id: "sultanahmet", label: "Sultanahmet", lat: 41.0086, lng: 28.9802 },
  { id: "besiktas", label: "Beşiktaş", lat: 41.0428, lng: 29.0068 },
  { id: "ortakoy", label: "Ortaköy", lat: 41.0479, lng: 29.0273 },
  { id: "sisli", label: "Şişli", lat: 41.0608, lng: 28.9875 },
  { id: "kadikoy", label: "Kadıköy", lat: 40.9913, lng: 29.0272 },
  { id: "moda", label: "Moda", lat: 40.9821, lng: 29.0269 },
  { id: "uskudar", label: "Üsküdar", lat: 41.0234, lng: 29.0148 },
];

export type HeroVenue = {
  id: string;
  hood: string;
  name: string;
  cat: HeroCategoryKey;
  lat: number;
  lng: number;
};

export const HERO_VENUES: HeroVenue[] = [
  // Beyoğlu
  {
    id: "v1",
    hood: "beyoglu",
    name: "Kronotrop",
    cat: "cafe",
    lat: 41.0339,
    lng: 28.9787,
  },
  {
    id: "v2",
    hood: "beyoglu",
    name: "Federal Coffee",
    cat: "cafe",
    lat: 41.0319,
    lng: 28.9763,
  },
  {
    id: "v3",
    hood: "beyoglu",
    name: "Workhaus İstiklal",
    cat: "coworking",
    lat: 41.0344,
    lng: 28.9779,
  },
  {
    id: "v4",
    hood: "beyoglu",
    name: "Tünel Pasajı",
    cat: "bar",
    lat: 41.0271,
    lng: 28.975,
  },
  {
    id: "v5",
    hood: "beyoglu",
    name: "Salt Beyoğlu",
    cat: "gallery",
    lat: 41.0314,
    lng: 28.9779,
  },
  // Karaköy
  {
    id: "v6",
    hood: "karakoy",
    name: "Mavra",
    cat: "cafe",
    lat: 41.0247,
    lng: 28.9763,
  },
  {
    id: "v7",
    hood: "karakoy",
    name: "Karaköy Lokantası",
    cat: "restaurant",
    lat: 41.0246,
    lng: 28.9785,
  },
  {
    id: "v8",
    hood: "karakoy",
    name: "İstanbul Modern",
    cat: "gallery",
    lat: 41.0296,
    lng: 28.9836,
  },
  // Beşiktaş
  {
    id: "v9",
    hood: "besiktas",
    name: "Coffee Manifesto",
    cat: "cafe",
    lat: 41.0418,
    lng: 29.0066,
  },
  {
    id: "v10",
    hood: "besiktas",
    name: "Volkswagen Arena",
    cat: "events",
    lat: 41.0775,
    lng: 29.0103,
  },
  {
    id: "v11",
    hood: "besiktas",
    name: "Ferahfeza",
    cat: "bar",
    lat: 41.042,
    lng: 29.008,
  },
  // Ortaköy
  {
    id: "v12",
    hood: "ortakoy",
    name: "House Café",
    cat: "cafe",
    lat: 41.048,
    lng: 29.0265,
  },
  {
    id: "v13",
    hood: "ortakoy",
    name: "Sortie",
    cat: "bar",
    lat: 41.0464,
    lng: 29.0299,
  },
  // Şişli
  {
    id: "v14",
    hood: "sisli",
    name: "Impact Hub",
    cat: "coworking",
    lat: 41.0568,
    lng: 28.9871,
  },
  {
    id: "v15",
    hood: "sisli",
    name: "Zorlu PSM",
    cat: "events",
    lat: 41.0673,
    lng: 29.0149,
  },
  {
    id: "v16",
    hood: "sisli",
    name: "Cuma",
    cat: "cafe",
    lat: 41.0613,
    lng: 28.9882,
  },
  // Sultanahmet
  {
    id: "v17",
    hood: "sultanahmet",
    name: "Hatay Sofrası",
    cat: "restaurant",
    lat: 41.0078,
    lng: 28.9774,
  },
  {
    id: "v18",
    hood: "sultanahmet",
    name: "Türk İslam Müzesi",
    cat: "gallery",
    lat: 41.0094,
    lng: 28.9763,
  },
  {
    id: "v19",
    hood: "sultanahmet",
    name: "Asitane",
    cat: "restaurant",
    lat: 41.0085,
    lng: 28.9695,
  },
  // Kadıköy
  {
    id: "v20",
    hood: "kadikoy",
    name: "Walter's Coffee",
    cat: "cafe",
    lat: 40.9908,
    lng: 29.027,
  },
  {
    id: "v21",
    hood: "kadikoy",
    name: "Arkaoda",
    cat: "bar",
    lat: 40.991,
    lng: 29.0271,
  },
  {
    id: "v22",
    hood: "kadikoy",
    name: "Espor Café",
    cat: "gaming",
    lat: 40.992,
    lng: 29.029,
  },
  {
    id: "v23",
    hood: "kadikoy",
    name: "Kadıköy Sahne",
    cat: "events",
    lat: 40.992,
    lng: 29.025,
  },
  {
    id: "v24",
    hood: "kadikoy",
    name: "Karga Bar",
    cat: "bar",
    lat: 40.9903,
    lng: 29.0269,
  },
  // Moda
  {
    id: "v25",
    hood: "moda",
    name: "Moda Sahil Cafe",
    cat: "cafe",
    lat: 40.9803,
    lng: 29.0244,
  },
  {
    id: "v26",
    hood: "moda",
    name: "Moda Stage",
    cat: "gaming",
    lat: 40.9817,
    lng: 29.0291,
  },
  {
    id: "v27",
    hood: "moda",
    name: "Moda Coworking",
    cat: "coworking",
    lat: 40.9844,
    lng: 29.0288,
  },
  // Üsküdar
  {
    id: "v28",
    hood: "uskudar",
    name: "Nevmekan",
    cat: "cafe",
    lat: 41.0245,
    lng: 29.0143,
  },
  {
    id: "v29",
    hood: "uskudar",
    name: "Çamlıca Hub",
    cat: "coworking",
    lat: 41.0273,
    lng: 29.0214,
  },
];

export type HeroNomad = {
  id: string;
  avatar: string;
  name: string;
  country: string;
  g: [string, string];
  v: string;
};

export const HERO_NOMADS: HeroNomad[] = [
  {
    id: "n1",
    avatar: "/hero/avatars/women-44.jpg",
    name: "Maya Lindqvist",
    country: "🇸🇪",
    g: ["#ff7e5f", "#feb47b"],
    v: "v1",
  },
  {
    id: "n2",
    avatar: "/hero/avatars/women-26.jpg",
    name: "Akari Tanaka",
    country: "🇯🇵",
    g: ["#5a3f8a", "#a78bfa"],
    v: "v22",
  },
  {
    id: "n3",
    avatar: "/hero/avatars/women-68.jpg",
    name: "Sofia Rinaldi",
    country: "🇮🇹",
    g: ["#e87a5d", "#fde68a"],
    v: "v6",
  },
  {
    id: "n4",
    avatar: "/hero/avatars/women-52.jpg",
    name: "Ananya Mehta",
    country: "🇮🇳",
    g: ["#2e5e8a", "#7dd3fc"],
    v: "v3",
  },
  {
    id: "n5",
    avatar: "/hero/avatars/women-12.jpg",
    name: "Lena Kowalski",
    country: "🇵🇱",
    g: ["#f4b860", "#fde68a"],
    v: "v14",
  },
  {
    id: "n6",
    avatar: "/hero/avatars/women-79.jpg",
    name: "Lucia Vidal",
    country: "🇪🇸",
    g: ["#7c2d12", "#fb923c"],
    v: "v7",
  },
  {
    id: "n7",
    avatar: "/hero/avatars/women-63.jpg",
    name: "Aisha Okafor",
    country: "🇳🇬",
    g: ["#a16207", "#fde68a"],
    v: "v20",
  },
  {
    id: "n8",
    avatar: "/hero/avatars/men-41.jpg",
    name: "Felix Brandt",
    country: "🇩🇪",
    g: ["#1e3a8a", "#7dd3fc"],
    v: "v2",
  },
  {
    id: "n9",
    avatar: "/hero/avatars/women-33.jpg",
    name: "Yuki Sato",
    country: "🇯🇵",
    g: ["#86efac", "#bbf7d0"],
    v: "v5",
  },
  {
    id: "n10",
    avatar: "/hero/avatars/women-8.jpg",
    name: "Olivia Bennett",
    country: "🇬🇧",
    g: ["#be185d", "#f9a8d4"],
    v: "v25",
  },
  {
    id: "n11",
    avatar: "/hero/avatars/men-57.jpg",
    name: "Marco Ferreira",
    country: "🇧🇷",
    g: ["#166534", "#86efac"],
    v: "v15",
  },
  {
    id: "n12",
    avatar: "/hero/avatars/women-47.jpg",
    name: "Zara El-Sayed",
    country: "🇪🇬",
    g: ["#7c2d12", "#f4b860"],
    v: "v17",
  },
  {
    id: "n13",
    avatar: "/hero/avatars/women-22.jpg",
    name: "Nora Lindqvist",
    country: "🇩🇰",
    g: ["#075985", "#7dd3fc"],
    v: "v27",
  },
  {
    id: "n14",
    avatar: "/hero/avatars/women-55.jpg",
    name: "Priya Chandra",
    country: "🇮🇳",
    g: ["#831843", "#f9a8d4"],
    v: "v11",
  },
  {
    id: "n15",
    avatar: "/hero/avatars/women-17.jpg",
    name: "Lily O'Connor",
    country: "🇮🇪",
    g: ["#15803d", "#86efac"],
    v: "v9",
  },
  {
    id: "n16",
    avatar: "/hero/avatars/women-85.jpg",
    name: "Elena Petrova",
    country: "🇷🇸",
    g: ["#581c87", "#a78bfa"],
    v: "v18",
  },
  {
    id: "n17",
    avatar: "/hero/avatars/women-41.jpg",
    name: "Rumi Kapoor",
    country: "🇮🇳",
    g: ["#b45309", "#fde68a"],
    v: "v23",
  },
  {
    id: "n18",
    avatar: "/hero/avatars/women-3.jpg",
    name: "Chloe Martin",
    country: "🇫🇷",
    g: ["#9d174d", "#f9a8d4"],
    v: "v12",
  },
  {
    id: "n19",
    avatar: "/hero/avatars/men-19.jpg",
    name: "Diego Alvarez",
    country: "🇲🇽",
    g: ["#9a3412", "#fb923c"],
    v: "v26",
  },
  {
    id: "n20",
    avatar: "/hero/avatars/women-71.jpg",
    name: "Anya Volkov",
    country: "🇷🇺",
    g: ["#1e40af", "#7dd3fc"],
    v: "v4",
  },
  {
    id: "n21",
    avatar: "/hero/avatars/men-72.jpg",
    name: "Hugo van Dijk",
    country: "🇳🇱",
    g: ["#854d0e", "#fde68a"],
    v: "v28",
  },
];

export type HeroTourStop = {
  id: string | null;
  center: [number, number]; // [lng, lat] - MapLibre order
  zoom: number;
};

// Tour stops. Center is offset ~0.03° west of the hood's actual lat/lng so
// the focused area lands in the clear right portion of the artboard (the
// left third is reserved for the headline). The first stop is a wide
// establishing shot of the whole city.
export const HERO_TOUR: HeroTourStop[] = [
  { id: null, center: [29.03, 41.025], zoom: 11.0 },
  { id: "beyoglu", center: [28.951, 41.0339], zoom: 12.8 },
  { id: "kadikoy", center: [28.9985, 40.9913], zoom: 13.0 },
  { id: "karakoy", center: [28.949, 41.0263], zoom: 13.2 },
  { id: "sultanahmet", center: [28.9472, 41.0086], zoom: 12.8 },
  { id: "ortakoy", center: [28.999, 41.0479], zoom: 12.9 },
];

// Minimal line-icon glyphs for each category, drawn in a 20×20 box centered
// on origin. Single-stroke shapes that read at small sizes.
export const HERO_CATEGORY_GLYPHS: Record<HeroCategoryKey, string> = {
  cafe: "M-4-3 H3 V4 a2 2 0 0 1 -2 2 H-2 a2 2 0 0 1 -2 -2 Z M3-1 h2 a1.5 1.5 0 0 1 0 3 H3",
  bar: "M-5-4 H5 L0 2 Z M0 2 V5 M-2 5 H2",
  gaming:
    "M-5-2 a2 2 0 0 1 2-2 H3 a2 2 0 0 1 2 2 V2 a2 2 0 0 1 -2 2 H-3 a-2-2 0 0 1 -2 -2 Z M-3 0 H-1 M-2-1 V1 M2 0 h0.1 M3 1 h0.1",
  events: "M0-5 L1.5-1.5 L5 0 L1.5 1.5 L0 5 L-1.5 1.5 L-5 0 L-1.5-1.5 Z",
  restaurant:
    "M-3-5 V5 M-1-5 V-1 M-5-5 V-1 a2 2 0 0 0 2 2 M3-5 a2 4 0 0 0 0 8 V5",
  coworking: "M-5-4 H5 V2 H-5 Z M-2 4 H2 M0 2 V4",
  gallery: "M-4-4 H4 V4 H-4 Z M-4 1 L-1-2 L2 1 L4-1",
};
