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

// Unsplash photos: the page slug looks like
// `foo-bar-SHORTID` where SHORTID is ~11 chars at the very end. The CDN
// URL is `images.unsplash.com/photo-<timestamp>-<hash>`. We store both.
const unsplashCdn = (photoId: string, width = 1920): string =>
  `https://images.unsplash.com/${photoId}?w=${width}&q=85&auto=format`;

const unsplashPageUrl = (pageSlug: string): string =>
  `https://unsplash.com/photos/${pageSlug}`;

const unsplashCredit = (pageSlug: string): PhotoCredit => ({
  author: "Unsplash contributor",
  source: "Unsplash",
  sourceHref: unsplashPageUrl(pageSlug),
  license: "Unsplash",
  licenseHref: "https://unsplash.com/license",
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
      alt: "Kadikoy ferry crossing the Bosphorus at sunset",
      credit: unsplashCredit("white-ship-on-sea-during-sunset-TLN3Id1tuGU"),
      sourceUrl: unsplashCdn("photo-1607153084771-2c9e1562f64c"),
      sourceFilename: "unsplash-TLN3Id1tuGU.jpg",
    },
    gallery: [
      {
        src: "/images/neighborhoods/kadikoy/gallery-01.jpg",
        alt: "Istanbul street cat lounging on a car in Kadikoy",
        credit: unsplashCredit("a-cat-sitting-on-top-of-a-car-yLLPlmcKRe0"),
        sourceUrl: unsplashCdn("photo-1663874824464-92b274717d2b"),
        sourceFilename: "unsplash-yLLPlmcKRe0.jpg",
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
      src: "/images/neighborhoods/cihangir/hero.jpg",
      alt: "Steep narrow Cihangir street with an angled old building",
      credit: unsplashCredit(
        "old-buildings-angled-corner-in-a-narrow-street-hw-6oSwz-Ic",
      ),
      sourceUrl: unsplashCdn("photo-1751220593645-7644cd559b67"),
      sourceFilename: "unsplash-hw-6oSwz-Ic.jpg",
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
        alt: "Orange street cat in Besiktas",
        credit: unsplashCredit(
          "an-orange-and-white-cat-sitting-on-top-of-a-table-PSVzt4pAOPs",
        ),
        sourceUrl: unsplashCdn("photo-1588933179927-bd91b38a6be1"),
        sourceFilename: "unsplash-PSVzt4pAOPs.jpg",
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
      src: "/images/neighborhoods/galata/hero.jpg",
      alt: "Galata Tower standing tall in the Istanbul sky",
      credit: unsplashCredit(
        "the-galata-tower-stands-tall-in-the-cloudy-sky-KB1tO3RPZN8",
      ),
      sourceUrl: unsplashCdn("photo-1746708221016-e36a3c8f7c03"),
      sourceFilename: "unsplash-KB1tO3RPZN8.jpg",
    },
    gallery: [
      {
        src: "/images/neighborhoods/galata/gallery-01.jpg",
        alt: "People walking on the Karakoy pier",
        credit: unsplashCredit("people-walking-on-pier-IFFxkQFi0Qs"),
        sourceUrl: unsplashCdn("photo-1551029814-dadbffdf7b2c"),
        sourceFilename: "unsplash-IFFxkQFi0Qs.jpg",
      },
      {
        src: "/images/neighborhoods/galata/gallery-02.jpg",
        alt: "Street food cart in the Karakoy district",
        credit: unsplashCredit("people-standing-beside-food-cart-jXJBEDuoEN8"),
        sourceUrl: unsplashCdn("photo-1577900576414-f353b502c496"),
        sourceFilename: "unsplash-jXJBEDuoEN8.jpg",
      },
      {
        src: "/images/neighborhoods/galata/gallery-03.jpg",
        alt: "Sunset over Istanbul viewed from the Galata district",
        credit: unsplashCredit(
          "the-sun-is-setting-over-a-large-city-6gWV88dLj3Y",
        ),
        sourceUrl: unsplashCdn("photo-1727080440760-c70e153ef4e2"),
        sourceFilename: "unsplash-6gWV88dLj3Y.jpg",
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
