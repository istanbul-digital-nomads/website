import { spaces, type NomadSpace } from "./spaces";

export type NeighborhoodSlug =
  | "kadikoy"
  | "moda"
  | "cihangir"
  | "besiktas"
  | "galata"
  | "uskudar"
  | "nisantasi"
  | "levent"
  | "balat"
  | "atasehir";

export type PhotoLicense =
  | "CC-BY"
  | "CC-BY-SA"
  | "CC0"
  | "Public Domain"
  | "Unsplash"
  | "Generated";

export interface PhotoCredit {
  author: string;
  authorHref?: string;
  source: "Wikimedia Commons" | "Unsplash" | "OpenAI";
  sourceHref: string;
  license: PhotoLicense;
  licenseHref?: string;
}

export interface NeighborhoodPhoto {
  src: string;
  alt: string;
  credit: PhotoCredit;
  sourceUrl: string;
  sourceFilename: string;
}

export interface Neighborhood {
  slug: NeighborhoodSlug;
  name: string;
  spaceMatchers: string[];
  side: "Asian" | "European";
  oneLiner: string;
  description: string;
  rentUsd: { low: number; high: number };
  rentTl: { low: number; high: number };
  transport: string;
  bestFor: string[];
  vibe: string;
  noise: "Low" | "Medium" | "High";
  coords: [number, number];
  hero: NeighborhoodPhoto;
  gallery: NeighborhoodPhoto[];
}

const wikiFilePathUrl = (filename: string, width = 1920): string =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(filename)}?width=${width}`;

const wikiFileDescriptionUrl = (filename: string): string =>
  `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(filename.replace(/ /g, "_"))}`;

const wikiCredit = (filename: string, author: string): PhotoCredit => ({
  author,
  source: "Wikimedia Commons",
  sourceHref: wikiFileDescriptionUrl(filename),
  license: "CC-BY-SA",
  licenseHref: "https://creativecommons.org/licenses/by-sa/4.0/",
});

// Unsplash photos: the page slug looks like
// `foo-bar-SHORTID` where SHORTID is ~11 chars at the very end. The CDN
// URL is `images.unsplash.com/photo-<timestamp>-<hash>`. We store both.
const unsplashCdn = (photoId: string, width = 1920): string =>
  `https://images.unsplash.com/${photoId}?w=${width}&q=85&auto=format`;

const unsplashDownload = (photoId: string, width = 2400): string =>
  `https://unsplash.com/photos/${photoId}/download?force=true&w=${width}`;

const unsplashPageUrl = (pageSlug: string): string =>
  `https://unsplash.com/photos/${pageSlug}`;

const unsplashCredit = (
  pageSlug: string,
  author = "Unsplash contributor",
): PhotoCredit => ({
  author,
  source: "Unsplash",
  sourceHref: unsplashPageUrl(pageSlug),
  license: "Unsplash",
  licenseHref: "https://unsplash.com/license",
});

const generatedCredit = (): PhotoCredit => ({
  author: "Istanbul Digital Nomads",
  source: "OpenAI",
  sourceHref: "https://openai.com/",
  license: "Generated",
  licenseHref: "https://openai.com/policies/service-terms/",
});

// Stats below are mirrored in src/content/guides/neighborhoods.mdx.
// Photos are curated from generated originals, Unsplash, and Wikimedia Commons.
// See /credits for full attributions.
export const neighborhoods: Neighborhood[] = [
  {
    slug: "kadikoy",
    name: "Kadikoy",
    spaceMatchers: ["Kadikoy"],
    side: "Asian",
    oneLiner:
      "Walkable Asian-side hub with ferry access and some of the city's best independent cafes.",
    description:
      "The most popular neighborhood for digital nomads. Kadikoy has a walkable center packed with independent cafes, a daily fish market, bookshops, and street food. The ferry to the European side takes 20 minutes and is one of the best commutes in the world.",
    rentUsd: { low: 480, high: 800 },
    rentTl: { low: 15000, high: 25000 },
    transport:
      "Ferry to Eminonu/Karakoy (20 min), metro to Taksim via Marmaray",
    bestFor: ["Steady work routine", "Local neighborhood feel", "Fair rent"],
    vibe: "Local, independent, walkable. Feels like a small city within Istanbul.",
    noise: "Medium",
    coords: [29.025, 40.99],
    hero: {
      src: "/images/neighborhoods/kadikoy/hero-premium-2026.jpg",
      alt: "A rainy Kadikoy ferry pier with a cafe table and commuters by the water",
      credit: generatedCredit(),
      sourceUrl: "https://openai.com/",
      sourceFilename: "generated-kadikoy-hero-premium-2026.jpg",
    },
    gallery: [
      {
        src: "/images/neighborhoods/kadikoy/gallery-01-2026.jpg",
        alt: "A small boat on the water off Kadikoy",
        credit: unsplashCredit(
          "a-person-in-a-boat-3fcG4KJkYQM",
          "Serenay Gulsen",
        ),
        sourceUrl: unsplashDownload("3fcG4KJkYQM"),
        sourceFilename: "unsplash-3fcG4KJkYQM.jpg",
      },
      {
        src: "/images/neighborhoods/kadikoy/gallery-02.jpg",
        alt: "Nostalgic tram on a Kadikoy street",
        credit: unsplashCredit(
          "a-red-and-white-train-traveling-down-a-street-next-to-tall-buildings-Ge3CSfKrDV4",
        ),
        sourceUrl: unsplashCdn("photo-1689410763484-d7fd8c775e25"),
        sourceFilename: "unsplash-Ge3CSfKrDV4.jpg",
      },
    ],
  },
  {
    slug: "moda",
    name: "Moda",
    spaceMatchers: ["Moda"],
    side: "Asian",
    oneLiner:
      "Calm seaside peninsula with creative energy, long evening walks, and a lot of cats.",
    description:
      "A quieter extension of Kadikoy, Moda sits on a peninsula with a seaside promenade. More residential, fewer tourists, excellent for evening walks. Close enough to Kadikoy center to walk (15 min) but feels distinctly calmer.",
    rentUsd: { low: 575, high: 960 },
    rentTl: { low: 18000, high: 30000 },
    transport: "Same as Kadikoy + nostalgic tram along the coast",
    bestFor: ["Quiet evenings", "Seaside walks", "Creative freelancers"],
    vibe: "Seaside, quiet, creative. Lots of cats.",
    noise: "Low",
    coords: [29.026, 40.978],
    hero: {
      src: "/images/neighborhoods/moda/hero-premium-2026.jpg",
      alt: "A calm Moda waterfront table with tea, notebook, and the Istanbul skyline beyond",
      credit: generatedCredit(),
      sourceUrl: "https://openai.com/",
      sourceFilename: "generated-moda-hero-premium-2026.jpg",
    },
    gallery: [
      {
        src: "/images/neighborhoods/moda/gallery-01.jpg",
        alt: "Istanbul cat watching over the water in Moda",
        credit: unsplashCredit(
          "a-cat-sitting-on-a-rock-looking-out-over-the-water-0-NbTd_vnag",
        ),
        sourceUrl: unsplashCdn("photo-1699973776441-c150e4b1798c"),
        sourceFilename: "unsplash-0-NbTd_vnag.jpg",
      },
      {
        src: "/images/neighborhoods/moda/gallery-02.jpg",
        alt: "Walking the Moda seaside promenade",
        credit: unsplashCredit(
          "a-woman-walking-down-a-sidewalk-next-to-a-body-of-water-qPHojBgOpo8",
        ),
        sourceUrl: unsplashCdn("photo-1685432531593-1afc8a152e5f"),
        sourceFilename: "unsplash-qPHojBgOpo8.jpg",
      },
      {
        src: "/images/neighborhoods/moda/gallery-03.jpg",
        alt: "Moda ferry pier (Moda Iskelesi) on the water",
        credit: unsplashCredit(
          "a-pier-with-a-building-on-it-next-to-a-body-of-water-LRkNXKqjsgg",
        ),
        sourceUrl: unsplashCdn("photo-1695920875600-d17340b5d9a5"),
        sourceFilename: "unsplash-LRkNXKqjsgg.jpg",
      },
    ],
  },
  {
    slug: "cihangir",
    name: "Cihangir",
    spaceMatchers: ["Cihangir"],
    side: "European",
    oneLiner:
      "Bohemian hilltop with Bosphorus views, strong cafe culture, and a tight expat community.",
    description:
      "The bohemian heart of Istanbul. Cihangir is a small hilltop neighborhood with steep streets, Bosphorus views from every cafe, and a strong community feel. Popular with artists, freelancers, and foreigners. Higher rents than the Asian side but unbeatable atmosphere.",
    rentUsd: { low: 640, high: 1280 },
    rentTl: { low: 20000, high: 40000 },
    transport:
      "Walk to Taksim (10 min), Kabatas tram/funicular, ferries from Kabatas",
    bestFor: ["Social nomads", "Nightlife access", "Bosphorus views"],
    vibe: "Bohemian, social, hilly. Great views, strong cafe culture.",
    noise: "Medium",
    coords: [28.983, 41.032],
    hero: {
      src: "/images/neighborhoods/cihangir/hero-premium-2026.jpg",
      alt: "A hilly Cihangir cafe street with old buildings and the Bosphorus at the end",
      credit: generatedCredit(),
      sourceUrl: "https://openai.com/",
      sourceFilename: "generated-cihangir-hero-premium-2026.jpg",
    },
    gallery: [
      {
        src: "/images/neighborhoods/cihangir/gallery-01.jpg",
        alt: "Remote worker at a laptop in a Cihangir cafe",
        credit: unsplashCredit(
          "a-man-sitting-in-front-of-a-laptop-computer-exj6iT6MTE8",
        ),
        sourceUrl: unsplashCdn("photo-1653754056000-bcc6c5a402ff"),
        sourceFilename: "unsplash-exj6iT6MTE8.jpg",
      },
      {
        src: "/images/neighborhoods/cihangir/gallery-02.jpg",
        alt: "Sunny Cihangir street with yellow buildings",
        credit: unsplashCredit(
          "people-walk-down-a-sunny-street-with-yellow-buildings-OOWvtB0p4iw",
        ),
        sourceUrl: unsplashCdn("photo-1749025061374-4211520af944"),
        sourceFilename: "unsplash-OOWvtB0p4iw.jpg",
      },
      {
        src: "/images/neighborhoods/cihangir/gallery-03.jpg",
        alt: "Cihangir bakery cafe with a green umbrella",
        credit: unsplashCredit(
          "a-bakery-with-a-green-umbrella-on-a-rainy-day-fghsnRFm3Fk",
        ),
        sourceUrl: unsplashCdn("photo-1737294305452-57c92a4a1cb8"),
        sourceFilename: "unsplash-fghsnRFm3Fk.jpg",
      },
    ],
  },
  {
    slug: "besiktas",
    name: "Besiktas",
    spaceMatchers: ["Besiktas"],
    side: "European",
    oneLiner:
      "Lively waterfront district with a big market, student energy, and ferry access on both sides.",
    description:
      "A lively waterfront neighborhood between Taksim and the Bosphorus Bridge. Besiktas has a big market, university energy (Bosphorus University is nearby), and some of the best street food in the city. More local and gritty than Cihangir.",
    rentUsd: { low: 640, high: 1120 },
    rentTl: { low: 20000, high: 35000 },
    transport:
      "Ferries to Kadikoy and Uskudar, buses to Taksim, close to E-5 highway",
    bestFor: ["European-side energy", "Street food lovers", "Ferry commuters"],
    vibe: "Lively, local, energetic. Market streets and student crowds.",
    noise: "High",
    coords: [29.007, 41.043],
    hero: {
      src: "/images/neighborhoods/besiktas/hero-premium-2026.jpg",
      alt: "A Besiktas waterfront table with tea, simit, a ferry, and market energy",
      credit: generatedCredit(),
      sourceUrl: "https://openai.com/",
      sourceFilename: "generated-besiktas-hero-premium-2026.jpg",
    },
    gallery: [
      {
        src: "/images/neighborhoods/besiktas/gallery-01-2026.jpg",
        alt: "Fresh fish arranged at the Besiktas market",
        credit: wikiCredit(
          "Fish Market Beşiktaş ISTANBUL (15651621734).jpg",
          "Wikimedia contributor",
        ),
        sourceUrl: wikiFilePathUrl(
          "Fish Market Beşiktaş ISTANBUL (15651621734).jpg",
        ),
        sourceFilename: "Fish Market Beşiktaş ISTANBUL (15651621734).jpg",
      },
      {
        src: "/images/neighborhoods/besiktas/gallery-02.jpg",
        alt: "Ferry approaching Besiktas on the Bosphorus",
        credit: unsplashCredit(
          "white-and-red-boat-on-sea-during-daytime-UVgsRero2qg",
        ),
        sourceUrl: unsplashCdn("photo-1593445598539-9a0768b242e6"),
        sourceFilename: "unsplash-UVgsRero2qg.jpg",
      },
      {
        src: "/images/neighborhoods/besiktas/gallery-03.jpg",
        alt: "Looking out over the water from Besiktas waterfront",
        credit: unsplashCredit(
          "a-person-looking-out-over-the-water-Ghu6x9y7jFc",
        ),
        sourceUrl: unsplashCdn("photo-1667652720780-7ffaaacf0375"),
        sourceFilename: "unsplash-Ghu6x9y7jFc.jpg",
      },
    ],
  },
  {
    slug: "galata",
    name: "Karakoy / Galata",
    spaceMatchers: ["Karakoy", "Galata"],
    side: "European",
    oneLiner:
      "Design district between the bridge and the tower. Specialty coffee, galleries, and central access.",
    description:
      "The design and gallery district between the Galata Bridge and Galata Tower. Karakoy has been gentrified over the past decade into a hub of specialty coffee, concept stores, and boutique hotels. Great for short stays, expensive for long ones.",
    rentUsd: { low: 800, high: 1440 },
    rentTl: { low: 25000, high: 45000 },
    transport:
      "Tram to Sultanahmet and Kabatas, walk to Beyoglu, ferries to Asian side",
    bestFor: [
      "Short stays (1-2 weeks)",
      "Central base",
      "Design and galleries",
    ],
    vibe: "Trendy, artsy, touristy. Beautiful architecture, lots of foot traffic.",
    noise: "High",
    coords: [28.977, 41.022],
    hero: {
      src: "/images/neighborhoods/galata/hero-premium-2026.jpg",
      alt: "A Karakoy cafe table looking up a lively street toward Galata Tower",
      credit: generatedCredit(),
      sourceUrl: "https://openai.com/",
      sourceFilename: "generated-galata-hero-premium-2026.jpg",
    },
    gallery: [
      {
        src: "/images/neighborhoods/galata/gallery-01-2026.jpg",
        alt: "Galata Tower surrounded by colorful old buildings",
        credit: unsplashCredit(
          "galata-tower-surrounded-by-colorful-buildings-kGvxFxWNSV4",
          "Dan Cristian",
        ),
        sourceUrl: unsplashDownload("kGvxFxWNSV4"),
        sourceFilename: "unsplash-kGvxFxWNSV4.jpg",
      },
      {
        src: "/images/neighborhoods/galata/gallery-02-2026.jpg",
        alt: "Galata Tower and the Istanbul harbor with ferries below",
        credit: unsplashCredit(
          "galata-tower-overlooks-a-bustling-istanbul-harbor-with-ferry-FD54wInsHR8",
          "Muhammed Zahid Akyol",
        ),
        sourceUrl: unsplashDownload("FD54wInsHR8"),
        sourceFilename: "unsplash-FD54wInsHR8.jpg",
      },
      {
        src: "/images/neighborhoods/galata/gallery-03-2026.jpg",
        alt: "Galata Tower and Istanbul's waterfront under stormy light",
        credit: unsplashCredit(
          "galata-tower-towers-over-istanbuls-waterfront-IrklOUpVbE4",
          "Alexandra",
        ),
        sourceUrl: unsplashDownload("IrklOUpVbE4"),
        sourceFilename: "unsplash-IrklOUpVbE4.jpg",
      },
    ],
  },
  {
    slug: "uskudar",
    name: "Uskudar",
    spaceMatchers: ["Uskudar", "Umraniye"],
    side: "Asian",
    oneLiner:
      "Traditional Bosphorus base with ferry links, quiet streets, and sunset walks by Maiden's Tower.",
    description:
      "Uskudar is the calmer Asian-side answer to Karakoy: ferries, mosques, tea gardens, and long Bosphorus walks without the same tourist pressure. It works well if you want a real local base, quick access to Kadikoy and the European side, and quieter evenings than the nightlife districts.",
    rentUsd: { low: 480, high: 880 },
    rentTl: { low: 15000, high: 27500 },
    transport:
      "Ferries to Eminonu, Besiktas, and Kabatas, Marmaray, metro toward Umraniye",
    bestFor: ["Quiet ferry life", "Local routines", "Bosphorus sunsets"],
    vibe: "Traditional, waterfront, calmer. Strong ferry rhythm and everyday Istanbul texture.",
    noise: "Low",
    coords: [29.015, 41.023],
    hero: {
      src: "/images/neighborhoods/uskudar/hero-2026.jpg",
      alt: "Maiden's Tower at sunset from the Uskudar waterfront",
      credit: unsplashCredit(
        "maidens-tower-at-sunset-with-istanbul-skyline-9v4NTjDU6jc",
        "Md Islam",
      ),
      sourceUrl: unsplashDownload("9v4NTjDU6jc"),
      sourceFilename: "unsplash-9v4NTjDU6jc.jpg",
    },
    gallery: [],
  },
  {
    slug: "nisantasi",
    name: "Nisantasi",
    spaceMatchers: ["Nisantasi"],
    side: "European",
    oneLiner:
      "Polished, central, and cafe-rich. Good for nomads who want comfort, boutiques, gyms, and easy access to Sisli.",
    description:
      "Nisantasi is one of Istanbul's most polished residential districts: leafy side streets, apartment blocks with doormen, boutiques, clinics, gyms, and some of the city's most reliable cafe work sessions. It is not the cheapest base, but it is practical if you want central European-side living without being directly inside the Taksim nightlife flow.",
    rentUsd: { low: 800, high: 1600 },
    rentTl: { low: 25000, high: 50000 },
    transport:
      "Walk to Osmanbey metro, quick taxi or metro access to Taksim, Sisli, and Levent",
    bestFor: ["Comfortable budgets", "Cafe work", "Central errands"],
    vibe: "Polished, residential, upscale. Boutique streets with strong everyday convenience.",
    noise: "Medium",
    coords: [28.988, 41.048],
    hero: {
      src: "/images/neighborhoods/nisantasi/hero-2026.jpg",
      alt: "An ornate stone doorway on a polished Nisantasi street",
      credit: unsplashCredit(
        "a-wooden-door-with-ornate-stone-architecture-r0W3ens3vdI",
        "Gokhan Aytac",
      ),
      sourceUrl: unsplashDownload("r0W3ens3vdI"),
      sourceFilename: "unsplash-r0W3ens3vdI.jpg",
    },
    gallery: [],
  },
  {
    slug: "levent",
    name: "Levent",
    spaceMatchers: ["Levent"],
    side: "European",
    oneLiner:
      "Business-district base with metro access, malls, offices, and the most practical coworking density.",
    description:
      "Levent is not romantic Istanbul, and that is exactly the point. It is the business corridor: towers, malls, gyms, metro stops, and coworking spaces. Choose it if your Istanbul life is work-heavy, you want reliable infrastructure, or you need fast access to meetings around Maslak, Sisli, and the airport-side business spine.",
    rentUsd: { low: 720, high: 1440 },
    rentTl: { low: 22500, high: 45000 },
    transport:
      "M2 metro through Levent and 4. Levent, buses along Buyukdere Avenue, easy taxi access north/south",
    bestFor: ["Full-time remote", "Business access", "Coworking density"],
    vibe: "Corporate, practical, vertical. Less charm, more infrastructure.",
    noise: "Medium",
    coords: [29.011, 41.077],
    hero: {
      src: "/images/neighborhoods/levent/hero-2026.jpg",
      alt: "A modern Levent skyscraper at night with light trails and city energy",
      credit: unsplashCredit(
        "nighttime-skyscraper-with-motion-blurred-city-lights-cz6IVpaqrUA",
        "Ahmet Olcum",
      ),
      sourceUrl: unsplashDownload("cz6IVpaqrUA"),
      sourceFilename: "unsplash-cz6IVpaqrUA.jpg",
    },
    gallery: [],
  },
  {
    slug: "balat",
    name: "Balat",
    spaceMatchers: ["Balat"],
    side: "European",
    oneLiner:
      "Colorful Golden Horn neighborhood with character, cheaper rents, hills, and slower cafe days.",
    description:
      "Balat is beautiful, uneven, and very specific. The colorful houses and antique streets are real, but it is not as frictionless as Kadikoy or Nisantasi: hills, older buildings, fewer polished work options, and more day-tripper foot traffic on famous streets. Pick it for character, budget, and a slower Golden Horn rhythm.",
    rentUsd: { low: 400, high: 800 },
    rentTl: { low: 12500, high: 25000 },
    transport:
      "Buses and tram connections via Fener/Eminonu, quick taxis to Karakoy and Cihangir",
    bestFor: ["Character", "Lower rent", "Slow creative days"],
    vibe: "Historic, colorful, rough-edged. Big personality with practical tradeoffs.",
    noise: "Medium",
    coords: [28.949, 41.029],
    hero: {
      src: "/images/neighborhoods/balat/hero-2026.jpg",
      alt: "Colorful Balat houses on a sloped Istanbul street",
      credit: unsplashCredit(
        "a-row-of-colorful-buildings-Uj24_8Bsfjo",
        "Jillian Amatt",
      ),
      sourceUrl: unsplashDownload("Uj24_8Bsfjo"),
      sourceFilename: "unsplash-Uj24_8Bsfjo.jpg",
    },
    gallery: [],
  },
  {
    slug: "atasehir",
    name: "Atasehir",
    spaceMatchers: ["Atasehir", "Umraniye"],
    side: "Asian",
    oneLiner:
      "Modern Asian-side high-rise district for corporate work, newer apartments, malls, and quieter routines.",
    description:
      "Atasehir is for a different kind of nomad: less ferry romance, more new-build convenience. You get towers, malls, business traffic, modern apartments, and access to Asian-side offices around the finance district. It is useful for longer stays if you want space, elevators, parking, gyms, and a quieter apartment after work.",
    rentUsd: { low: 560, high: 1120 },
    rentTl: { low: 17500, high: 35000 },
    transport:
      "Metro and buses across the Asian side, taxi access to Kadikoy, Umraniye, and the finance district",
    bestFor: ["Newer apartments", "Asian-side business", "Quiet nights"],
    vibe: "Modern, spacious, corporate. Practical but less walkable than Kadikoy.",
    noise: "Low",
    coords: [29.124, 40.992],
    hero: {
      src: "/images/neighborhoods/atasehir/hero-2026.jpg",
      alt: "Modern Atasehir towers and blue sky on the Asian side of Istanbul",
      credit: unsplashCredit(
        "a-very-tall-building-next-to-a-very-tall-building-YNvKCuE4-1M",
        "Olga Bezagotiy",
      ),
      sourceUrl: unsplashDownload("YNvKCuE4-1M"),
      sourceFilename: "unsplash-YNvKCuE4-1M.jpg",
    },
    gallery: [],
  },
];

export function getNeighborhoodBySlug(slug: string): Neighborhood | undefined {
  return neighborhoods.find((n) => n.slug === slug);
}

export function getSpacesInNeighborhood(slug: NeighborhoodSlug): NomadSpace[] {
  const n = getNeighborhoodBySlug(slug);
  if (!n) return [];
  return spaces.filter((s) => n.spaceMatchers.includes(s.neighborhood));
}

export function formatRentRange(n: Neighborhood): string {
  return `$${n.rentUsd.low}-$${n.rentUsd.high}/mo`;
}

export function getAllPhotos(): Array<{
  neighborhood: Neighborhood;
  photo: NeighborhoodPhoto;
  role: "hero" | "gallery";
  index: number;
}> {
  const out: Array<{
    neighborhood: Neighborhood;
    photo: NeighborhoodPhoto;
    role: "hero" | "gallery";
    index: number;
  }> = [];
  for (const n of neighborhoods) {
    out.push({ neighborhood: n, photo: n.hero, role: "hero", index: 0 });
    n.gallery.forEach((p, i) => {
      out.push({ neighborhood: n, photo: p, role: "gallery", index: i + 1 });
    });
  }
  return out;
}
