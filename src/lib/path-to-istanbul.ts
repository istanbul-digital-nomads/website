// Country registry for Path to Istanbul. Country codes are ISO 3166-1 alpha-2.
// `supported: true` means we have a full MDX relocation guide for that country.

export interface Country {
  code: string; // ISO alpha-2
  name: string;
  flag: string; // emoji
  slug: string; // URL slug
  coordinates: [number, number]; // [lng, lat] for map marker
  supported: boolean;
}

export const COUNTRIES: Country[] = [
  // v1 supported
  {
    code: "IR",
    name: "Iran",
    flag: "🇮🇷",
    slug: "iran",
    coordinates: [53.688, 32.4279],
    supported: true,
  },
  {
    code: "IN",
    name: "India",
    flag: "🇮🇳",
    slug: "india",
    coordinates: [78.9629, 20.5937],
    supported: true,
  },
  {
    code: "RU",
    name: "Russia",
    flag: "🇷🇺",
    slug: "russia",
    coordinates: [105.3188, 61.524],
    supported: true,
  },
  {
    code: "PK",
    name: "Pakistan",
    flag: "🇵🇰",
    slug: "pakistan",
    coordinates: [69.3451, 30.3753],
    supported: true,
  },
  {
    code: "NG",
    name: "Nigeria",
    flag: "🇳🇬",
    slug: "nigeria",
    coordinates: [8.6753, 9.082],
    supported: true,
  },

  // Common origins - not yet supported, listed for map/selector
  { code: "US", name: "United States", flag: "🇺🇸", slug: "united-states", coordinates: [-95.7129, 37.0902], supported: false },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧", slug: "united-kingdom", coordinates: [-3.436, 55.3781], supported: false },
  { code: "DE", name: "Germany", flag: "🇩🇪", slug: "germany", coordinates: [10.4515, 51.1657], supported: false },
  { code: "FR", name: "France", flag: "🇫🇷", slug: "france", coordinates: [2.2137, 46.2276], supported: false },
  { code: "NL", name: "Netherlands", flag: "🇳🇱", slug: "netherlands", coordinates: [5.2913, 52.1326], supported: false },
  { code: "UA", name: "Ukraine", flag: "🇺🇦", slug: "ukraine", coordinates: [31.1656, 48.3794], supported: false },
  { code: "EG", name: "Egypt", flag: "🇪🇬", slug: "egypt", coordinates: [30.8025, 26.8206], supported: false },
  { code: "ID", name: "Indonesia", flag: "🇮🇩", slug: "indonesia", coordinates: [113.9213, -0.7893], supported: false },
  { code: "UZ", name: "Uzbekistan", flag: "🇺🇿", slug: "uzbekistan", coordinates: [64.5853, 41.3775], supported: false },
  { code: "AZ", name: "Azerbaijan", flag: "🇦🇿", slug: "azerbaijan", coordinates: [47.5769, 40.1431], supported: false },
  { code: "KZ", name: "Kazakhstan", flag: "🇰🇿", slug: "kazakhstan", coordinates: [66.9237, 48.0196], supported: false },
  { code: "CA", name: "Canada", flag: "🇨🇦", slug: "canada", coordinates: [-106.3468, 56.1304], supported: false },
  { code: "BR", name: "Brazil", flag: "🇧🇷", slug: "brazil", coordinates: [-51.9253, -14.235], supported: false },
  { code: "ZA", name: "South Africa", flag: "🇿🇦", slug: "south-africa", coordinates: [22.9375, -30.5595], supported: false },
  { code: "AU", name: "Australia", flag: "🇦🇺", slug: "australia", coordinates: [133.7751, -25.2744], supported: false },
  { code: "SY", name: "Syria", flag: "🇸🇾", slug: "syria", coordinates: [38.9968, 34.8021], supported: false },
  { code: "AF", name: "Afghanistan", flag: "🇦🇫", slug: "afghanistan", coordinates: [67.71, 33.9391], supported: false },
  { code: "IQ", name: "Iraq", flag: "🇮🇶", slug: "iraq", coordinates: [43.6793, 33.2232], supported: false },
  { code: "PH", name: "Philippines", flag: "🇵🇭", slug: "philippines", coordinates: [121.774, 12.8797], supported: false },
  { code: "BD", name: "Bangladesh", flag: "🇧🇩", slug: "bangladesh", coordinates: [90.3563, 23.685], supported: false },
];

export function getSupportedCountries(): Country[] {
  return COUNTRIES.filter((c) => c.supported);
}

export function getCountryBySlug(slug: string): Country | null {
  return COUNTRIES.find((c) => c.slug === slug) ?? null;
}

export function getCountryByCode(code: string): Country | null {
  return COUNTRIES.find((c) => c.code === code.toUpperCase()) ?? null;
}
