import { spaces, type NomadSpace } from "./spaces";

export type NeighborhoodSlug =
  | "kadikoy"
  | "moda"
  | "cihangir"
  | "besiktas"
  | "galata";

export type PhotoLicense =
  | "CC-BY"
  | "CC-BY-SA"
  | "CC0"
  | "Public Domain"
  | "Unsplash";

export interface PhotoCredit {
  author: string;
  authorHref?: string;
  source: "Wikimedia Commons" | "Unsplash";
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

// Stats below are lifted directly from src/content/guides/neighborhoods.mdx.
// Nothing is invented - every number has a source. Photos are curated from
// Wikimedia Commons (CC-BY-SA). See /credits for full attributions.
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
      src: "/images/neighborhoods/kadikoy/hero.jpg",
      alt: "A regular residential street in Kadikoy, Istanbul",
      credit: wikiCredit(
        "A regular street in Kadıköy, İstanbul.jpg",
        "Wikimedia contributor",
      ),
      sourceUrl: wikiFilePathUrl("A regular street in Kadıköy, İstanbul.jpg"),
      sourceFilename: "A regular street in Kadıköy, İstanbul.jpg",
    },
    gallery: [
      {
        src: "/images/neighborhoods/kadikoy/gallery-01.jpg",
        alt: "Bagdat Avenue in Kadikoy",
        credit: wikiCredit(
          "Bağdat St. Kadıköy 6 July 2024 (3).jpg",
          "Wikimedia contributor",
        ),
        sourceUrl: wikiFilePathUrl("Bağdat St. Kadıköy 6 July 2024 (3).jpg"),
        sourceFilename: "Bağdat St. Kadıköy 6 July 2024 (3).jpg",
      },
      {
        src: "/images/neighborhoods/kadikoy/gallery-02.jpg",
        alt: "Tevfikpasa Street in central Kadikoy",
        credit: wikiCredit(
          "Tevfikpaşa St. Kadıköy 6 July 2024 (1).jpg",
          "Wikimedia contributor",
        ),
        sourceUrl: wikiFilePathUrl(
          "Tevfikpaşa St. Kadıköy 6 July 2024 (1).jpg",
        ),
        sourceFilename: "Tevfikpaşa St. Kadıköy 6 July 2024 (1).jpg",
      },
      {
        src: "/images/neighborhoods/kadikoy/gallery-03.jpg",
        alt: "Fuatpasa Street in Kadikoy",
        credit: wikiCredit(
          "Fuatpaşa St. Kadıköy 6 July 2024 (2).jpg",
          "Wikimedia contributor",
        ),
        sourceUrl: wikiFilePathUrl("Fuatpaşa St. Kadıköy 6 July 2024 (2).jpg"),
        sourceFilename: "Fuatpaşa St. Kadıköy 6 July 2024 (2).jpg",
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
      src: "/images/neighborhoods/moda/hero.jpg",
      alt: "Moda seaside coast in Istanbul",
      credit: wikiCredit(
        "Moda sahili - panoramio.jpg",
        "Panoramio contributor",
      ),
      sourceUrl: wikiFilePathUrl("Moda sahili - panoramio.jpg"),
      sourceFilename: "Moda sahili - panoramio.jpg",
    },
    gallery: [
      {
        src: "/images/neighborhoods/moda/gallery-01.jpg",
        alt: "Moda ferry pier (Moda Iskelesi)",
        credit: wikiCredit(
          "Moda İskelesi 2019-08.jpg",
          "Wikimedia contributor",
        ),
        sourceUrl: wikiFilePathUrl("Moda İskelesi 2019-08.jpg"),
        sourceFilename: "Moda İskelesi 2019-08.jpg",
      },
      {
        src: "/images/neighborhoods/moda/gallery-02.jpg",
        alt: "Nostalgic Kadikoy-Moda tram",
        credit: wikiCredit("Istanbul Moda Tram 2.jpg", "Wikimedia contributor"),
        sourceUrl: wikiFilePathUrl("Istanbul Moda Tram 2.jpg"),
        sourceFilename: "Istanbul Moda Tram 2.jpg",
      },
      {
        src: "/images/neighborhoods/moda/gallery-03.jpg",
        alt: "A street in Moda, Istanbul",
        credit: wikiCredit(
          "Istanbul moda - panoramio.jpg",
          "Panoramio contributor",
        ),
        sourceUrl: wikiFilePathUrl("Istanbul moda - panoramio.jpg"),
        sourceFilename: "Istanbul moda - panoramio.jpg",
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
      src: "/images/neighborhoods/cihangir/hero.jpg",
      alt: "Firuzaga Mosque in the Cihangir neighborhood of Istanbul",
      credit: wikiCredit(
        "Istanbul photos by J.Lubbock 2014 201.jpg",
        "J. Lubbock",
      ),
      sourceUrl: wikiFilePathUrl("Istanbul photos by J.Lubbock 2014 201.jpg"),
      sourceFilename: "Istanbul photos by J.Lubbock 2014 201.jpg",
    },
    gallery: [
      {
        src: "/images/neighborhoods/cihangir/gallery-01.jpg",
        alt: "Street view of Firuzaga Mosque area in Cihangir",
        credit: wikiCredit(
          "Istanbul photos by J.Lubbock 2014 202.jpg",
          "J. Lubbock",
        ),
        sourceUrl: wikiFilePathUrl("Istanbul photos by J.Lubbock 2014 202.jpg"),
        sourceFilename: "Istanbul photos by J.Lubbock 2014 202.jpg",
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
      src: "/images/neighborhoods/besiktas/hero.jpg",
      alt: "Besiktas Fish Market",
      credit: wikiCredit(
        "Fish Market Beşiktaş ISTANBUL (15651621734).jpg",
        "Wikimedia contributor",
      ),
      sourceUrl: wikiFilePathUrl(
        "Fish Market Beşiktaş ISTANBUL (15651621734).jpg",
      ),
      sourceFilename: "Fish Market Beşiktaş ISTANBUL (15651621734).jpg",
    },
    gallery: [
      {
        src: "/images/neighborhoods/besiktas/gallery-01.jpg",
        alt: "Istanbul Naval Museum (Deniz Muzesi) in Besiktas",
        credit: wikiCredit(
          "İstanbul Deniz Müzesi, Beşiktaş 2015.jpg",
          "Wikimedia contributor",
        ),
        sourceUrl: wikiFilePathUrl("İstanbul Deniz Müzesi, Beşiktaş 2015.jpg"),
        sourceFilename: "İstanbul Deniz Müzesi, Beşiktaş 2015.jpg",
      },
      {
        src: "/images/neighborhoods/besiktas/gallery-02.jpg",
        alt: "Ihlamur Pavilion gardens in Besiktas",
        credit: wikiCredit(
          "Ihlamur Kasrı, Beşiktaş 2014.jpg",
          "Wikimedia contributor",
        ),
        sourceUrl: wikiFilePathUrl("Ihlamur Kasrı, Beşiktaş 2014.jpg"),
        sourceFilename: "Ihlamur Kasrı, Beşiktaş 2014.jpg",
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
      src: "/images/neighborhoods/galata/hero.jpg",
      alt: "Galata Tower viewed from the Karakoy district below",
      credit: wikiCredit(
        "Galata Tower, from Karaköy..jpg",
        "Wikimedia contributor",
      ),
      sourceUrl: wikiFilePathUrl("Galata Tower, from Karaköy..jpg"),
      sourceFilename: "Galata Tower, from Karaköy..jpg",
    },
    gallery: [
      {
        src: "/images/neighborhoods/galata/gallery-01.jpg",
        alt: "Galata Tower and the Port of Karakoy",
        credit: wikiCredit(
          "Galata Tower - Port of Karaköy, 2006.jpg",
          "Wikimedia contributor",
        ),
        sourceUrl: wikiFilePathUrl("Galata Tower - Port of Karaköy, 2006.jpg"),
        sourceFilename: "Galata Tower - Port of Karaköy, 2006.jpg",
      },
      {
        src: "/images/neighborhoods/galata/gallery-02.jpg",
        alt: "Galata and Karakoy waterfront",
        credit: wikiCredit("Galata karakoy.jpg", "Wikimedia contributor"),
        sourceUrl: wikiFilePathUrl("Galata karakoy.jpg"),
        sourceFilename: "Galata karakoy.jpg",
      },
      {
        src: "/images/neighborhoods/galata/gallery-03.jpg",
        alt: "Galata Bridge and Tower seen together",
        credit: wikiCredit(
          "Istanbul asv2020-02 img46 Galata Bridge and Tower.jpg",
          "A. Savin",
        ),
        sourceUrl: wikiFilePathUrl(
          "Istanbul asv2020-02 img46 Galata Bridge and Tower.jpg",
        ),
        sourceFilename: "Istanbul asv2020-02 img46 Galata Bridge and Tower.jpg",
      },
    ],
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
