import "server-only";
import { cacheLife } from "next/cache";
import {
  getNeighborhoodBySlug,
  type Neighborhood,
  type NeighborhoodSlug,
} from "@/lib/neighborhoods";
import type { SpaceSource } from "@/lib/spaces";
import { createPublicClient } from "@/lib/supabase/server";

// Istanbul district (ilce) intelligence layer. This composes WITH the rich
// neighborhood profiles in src/lib/neighborhoods.ts rather than duplicating
// them: each DistrictNeighborhood can point at a detailed entry by
// `richSlug`, and the rest of the fields stay lightweight + cited-source
// only. The static seed below is the source of truth; the Supabase tables
// (migration 030) let us override/extend later. Reads degrade gracefully to
// the seed when the tables aren't applied yet.
//
// NO FABRICATION: district names, side (Asian/European), and transport facts
// carry a sources[] entry. Every score is null + listed in unverified_fields
// until a real source backs it - that's expected at launch (see the
// score-collection follow-up in docs/agents/agent4-neighborhoods-progress.md).

export type IstanbulSide = "Asian" | "European";

// Scores are 0-100 (nomad/nightlife/walkability/safety) or 1-5 cost_level,
// but we keep them as `number | null` and never invent a value.
export interface DistrictNeighborhood {
  slug: string;
  name: string;
  description: string | null;
  tags: string[];
  atmosphere: string | null;
  nomadScore: number | null;
  nightlifeScore: number | null;
  costLevel: number | null;
  walkability: number | null;
  safety: number | null;
  transportation: string | null;
  // When set, this area has a full profile in src/lib/neighborhoods.ts.
  richSlug?: NeighborhoodSlug;
  sources: SpaceSource[];
  unverifiedFields: string[];
  lastVerified: string | null; // ISO date YYYY-MM-DD
}

export interface IstanbulDistrict {
  slug: string;
  name: string;
  side: IstanbulSide | null;
  description: string | null;
  sources: SpaceSource[];
  neighborhoods: DistrictNeighborhood[];
}

// Every quantitative score field. A neighborhood seeded with no scores lists
// all of these in unverifiedFields so the UI can be honest about it.
const ALL_SCORE_FIELDS = [
  "nomad_score",
  "nightlife_score",
  "cost_level",
  "walkability",
  "safety",
] as const;

// Shared citations reused across districts (kept here so seed rows stay terse).
const SRC = {
  // Asian vs European side + district roster.
  istanbulWiki: {
    label: "Wikipedia - Districts of Istanbul (side + ilce list)",
    url: "https://en.wikipedia.org/wiki/Districts_of_Istanbul",
  },
  // Metro/Marmaray/ferry network facts.
  metroIstanbul: {
    label: "Metro Istanbul - network map and lines",
    url: "https://www.metro.istanbul/en",
  },
  sehirHatlari: {
    label: "Sehir Hatlari - Istanbul public ferry routes",
    url: "https://www.sehirhatlari.istanbul/en",
  },
} satisfies Record<string, SpaceSource>;

// Helper: build a seed neighborhood, defaulting every score to null and
// auto-populating unverifiedFields for any score we didn't cite.
function seedNeighborhood(
  input: Omit<
    DistrictNeighborhood,
    | "tags"
    | "unverifiedFields"
    | "nomadScore"
    | "nightlifeScore"
    | "costLevel"
    | "walkability"
    | "safety"
  > &
    Partial<
      Pick<
        DistrictNeighborhood,
        | "tags"
        | "nomadScore"
        | "nightlifeScore"
        | "costLevel"
        | "walkability"
        | "safety"
      >
    >,
): DistrictNeighborhood {
  const scores = {
    nomad_score: input.nomadScore ?? null,
    nightlife_score: input.nightlifeScore ?? null,
    cost_level: input.costLevel ?? null,
    walkability: input.walkability ?? null,
    safety: input.safety ?? null,
  };
  const unverified = ALL_SCORE_FIELDS.filter((f) => scores[f] == null);
  return {
    slug: input.slug,
    name: input.name,
    description: input.description,
    tags: input.tags ?? [],
    atmosphere: input.atmosphere,
    nomadScore: scores.nomad_score,
    nightlifeScore: scores.nightlife_score,
    costLevel: scores.cost_level,
    walkability: scores.walkability,
    safety: scores.safety,
    transportation: input.transportation,
    richSlug: input.richSlug,
    sources: input.sources,
    unverifiedFields: unverified,
    lastVerified: input.lastVerified,
  };
}

const VERIFIED = "2026-05-25";

// Major nomad-relevant Istanbul districts. We deliberately cover the
// districts that map to the 10 rich neighborhoods plus a few more that show
// up constantly in nomad housing/coworking searches. We don't try to mirror
// all 39 official ilce here - that flat list already lives in
// src/lib/istanbul-locations.ts for the location picker.
export const istanbulDistricts: IstanbulDistrict[] = [
  {
    slug: "kadikoy",
    name: "Kadikoy",
    side: "Asian",
    description:
      "The Asian-side hub most nomads start with: walkable, ferry-connected, and packed with independent cafes.",
    sources: [SRC.istanbulWiki, SRC.sehirHatlari],
    neighborhoods: [
      seedNeighborhood({
        slug: "kadikoy-center",
        name: "Kadikoy Center",
        richSlug: "kadikoy",
        description:
          "Ferry pier, fish market, and the densest run of laptop cafes on the Asian side.",
        atmosphere: "Local, independent, walkable.",
        tags: ["ferry", "cafes", "walkable"],
        transportation:
          "Ferries to Eminonu/Karakoy (~20 min), Marmaray and metro connections.",
        sources: [SRC.sehirHatlari, SRC.metroIstanbul],
        lastVerified: VERIFIED,
      }),
      seedNeighborhood({
        slug: "moda",
        name: "Moda",
        richSlug: "moda",
        description:
          "A calmer seaside peninsula just south of Kadikoy center, big on evening walks.",
        atmosphere: "Seaside, quiet, creative.",
        tags: ["seaside", "quiet", "residential"],
        transportation:
          "Walk from Kadikoy center plus the nostalgic coast tram.",
        sources: [SRC.sehirHatlari],
        lastVerified: VERIFIED,
      }),
      seedNeighborhood({
        slug: "caddebostan",
        name: "Caddebostan",
        description:
          "Upmarket coastal stretch further east, popular for longer stays and seaside running paths.",
        atmosphere: "Residential, coastal, upscale.",
        tags: ["seaside", "residential"],
        transportation:
          "M4 metro (Caddebostan/Goztepe area) and coastal buses.",
        sources: [SRC.metroIstanbul],
        lastVerified: VERIFIED,
      }),
    ],
  },
  {
    slug: "besiktas",
    name: "Besiktas",
    side: "European",
    description:
      "Lively European waterfront district between Taksim and the Bosphorus, with student energy and ferry links.",
    sources: [SRC.istanbulWiki, SRC.sehirHatlari],
    neighborhoods: [
      seedNeighborhood({
        slug: "besiktas-center",
        name: "Besiktas Center",
        richSlug: "besiktas",
        description:
          "Market streets, street food, and ferry piers to Kadikoy and Uskudar.",
        atmosphere: "Lively, local, energetic.",
        tags: ["ferry", "market", "students"],
        transportation:
          "Ferries to Kadikoy/Uskudar, buses to Taksim, close to the E-5 corridor.",
        sources: [SRC.sehirHatlari],
        lastVerified: VERIFIED,
      }),
      seedNeighborhood({
        slug: "levent",
        name: "Levent",
        richSlug: "levent",
        description:
          "The business spine: towers, malls, and the highest coworking density on the European side.",
        atmosphere: "Corporate, practical, vertical.",
        tags: ["business", "coworking", "metro"],
        transportation: "M2 metro through Levent and 4. Levent.",
        sources: [SRC.metroIstanbul],
        lastVerified: VERIFIED,
      }),
      seedNeighborhood({
        slug: "etiler",
        name: "Etiler",
        description:
          "Upscale residential pocket near Levent with malls and quieter streets.",
        atmosphere: "Upscale, residential.",
        tags: ["residential", "upscale"],
        transportation: "Close to M2 (Levent) plus buses along Nispetiye.",
        sources: [SRC.metroIstanbul],
        lastVerified: VERIFIED,
      }),
      seedNeighborhood({
        slug: "ortakoy",
        name: "Ortakoy",
        description:
          "Bosphorus-front square known for weekend crowds and waterfront cafes under the bridge.",
        atmosphere: "Touristy, waterfront, weekend-busy.",
        tags: ["waterfront", "weekend"],
        transportation: "Buses along the Bosphorus coast road from Besiktas.",
        sources: [SRC.istanbulWiki],
        lastVerified: VERIFIED,
      }),
    ],
  },
  {
    slug: "beyoglu",
    name: "Beyoglu",
    side: "European",
    description:
      "The cultural core of the European side: Istiklal, Galata, Cihangir, and Karakoy all sit inside Beyoglu.",
    sources: [SRC.istanbulWiki],
    neighborhoods: [
      seedNeighborhood({
        slug: "cihangir",
        name: "Cihangir",
        richSlug: "cihangir",
        description:
          "Bohemian hilltop with Bosphorus views, strong cafe culture, and a tight expat scene.",
        atmosphere: "Bohemian, social, hilly.",
        tags: ["cafes", "expat", "nightlife"],
        transportation:
          "Walk to Taksim (~10 min), Kabatas tram/funicular nearby.",
        sources: [SRC.metroIstanbul],
        lastVerified: VERIFIED,
      }),
      seedNeighborhood({
        slug: "karakoy-galata",
        name: "Karakoy / Galata",
        richSlug: "galata",
        description:
          "Design and gallery district between the Galata Bridge and the tower.",
        atmosphere: "Trendy, artsy, touristy.",
        tags: ["design", "central", "coffee"],
        transportation:
          "Tram to Sultanahmet/Kabatas, walk to Beyoglu, ferries to the Asian side.",
        sources: [SRC.metroIstanbul, SRC.sehirHatlari],
        lastVerified: VERIFIED,
      }),
      seedNeighborhood({
        slug: "cukurcuma",
        name: "Cukurcuma",
        description:
          "Antique-shop district downhill from Istiklal, quieter than its Cihangir neighbor.",
        atmosphere: "Artsy, antique-lined, calm.",
        tags: ["antiques", "quiet"],
        transportation: "Walk from Taksim/Istiklal; funicular at Kabatas.",
        sources: [SRC.istanbulWiki],
        lastVerified: VERIFIED,
      }),
    ],
  },
  {
    slug: "sisli",
    name: "Sisli",
    side: "European",
    description:
      "Central European-side district covering Nisantasi and Bomonti, with hospitals, malls, and metro access.",
    sources: [SRC.istanbulWiki, SRC.metroIstanbul],
    neighborhoods: [
      seedNeighborhood({
        slug: "nisantasi",
        name: "Nisantasi",
        richSlug: "nisantasi",
        description:
          "Polished, cafe-rich residential streets with boutiques, gyms, and reliable work spots.",
        atmosphere: "Polished, residential, upscale.",
        tags: ["cafes", "upscale", "central"],
        transportation:
          "Osmanbey metro (M2), quick access to Taksim and Levent.",
        sources: [SRC.metroIstanbul],
        lastVerified: VERIFIED,
      }),
      seedNeighborhood({
        slug: "bomonti",
        name: "Bomonti",
        description:
          "Former brewery district turned nightlife and co-living pocket, well connected by metro.",
        atmosphere: "Up-and-coming, mixed-use.",
        tags: ["nightlife", "metro"],
        transportation: "Bomonti metro (M2) and buses toward Mecidiyekoy.",
        sources: [SRC.metroIstanbul],
        lastVerified: VERIFIED,
      }),
      seedNeighborhood({
        slug: "mecidiyekoy",
        name: "Mecidiyekoy",
        description:
          "Major transit and office interchange, useful as a connected (if noisy) base.",
        atmosphere: "Busy, commercial, transit-heavy.",
        tags: ["business", "metro", "transit"],
        transportation:
          "M2 metro, metrobus interchange, buses across the city.",
        sources: [SRC.metroIstanbul],
        lastVerified: VERIFIED,
      }),
    ],
  },
  {
    slug: "uskudar",
    name: "Uskudar",
    side: "Asian",
    description:
      "Traditional Asian-side Bosphorus district with heavy ferry links and a calmer rhythm than Kadikoy.",
    sources: [SRC.istanbulWiki, SRC.sehirHatlari],
    neighborhoods: [
      seedNeighborhood({
        slug: "uskudar-center",
        name: "Uskudar Center",
        richSlug: "uskudar",
        description:
          "Ferries, mosques, tea gardens, and long Bosphorus walks by Maiden's Tower.",
        atmosphere: "Traditional, waterfront, calmer.",
        tags: ["ferry", "quiet", "waterfront"],
        transportation:
          "Ferries to Eminonu/Besiktas/Kabatas, Marmaray, metro toward Umraniye.",
        sources: [SRC.sehirHatlari, SRC.metroIstanbul],
        lastVerified: VERIFIED,
      }),
      seedNeighborhood({
        slug: "kuzguncuk",
        name: "Kuzguncuk",
        description:
          "Postcard waterfront village with colorful houses, just north of Uskudar center.",
        atmosphere: "Village-like, scenic, quiet.",
        tags: ["waterfront", "quiet", "scenic"],
        transportation: "Coastal buses from Uskudar; short taxi hop.",
        sources: [SRC.istanbulWiki],
        lastVerified: VERIFIED,
      }),
    ],
  },
  {
    slug: "fatih",
    name: "Fatih",
    side: "European",
    description:
      "The historic peninsula plus the Golden Horn shore, including Balat and the old city.",
    sources: [SRC.istanbulWiki],
    neighborhoods: [
      seedNeighborhood({
        slug: "balat",
        name: "Balat",
        richSlug: "balat",
        description:
          "Colorful Golden Horn neighborhood with character, hills, and cheaper rents.",
        atmosphere: "Historic, colorful, rough-edged.",
        tags: ["historic", "budget", "character"],
        transportation:
          "Buses and tram connections via Fener/Eminonu; quick taxis to Karakoy.",
        sources: [SRC.metroIstanbul],
        lastVerified: VERIFIED,
      }),
      seedNeighborhood({
        slug: "fener",
        name: "Fener",
        description:
          "Balat's quieter neighbor on the Golden Horn, with steep streets and old churches.",
        atmosphere: "Historic, steep, quiet.",
        tags: ["historic", "quiet"],
        transportation: "Golden Horn buses and ferries; walk from Balat.",
        sources: [SRC.sehirHatlari],
        lastVerified: VERIFIED,
      }),
    ],
  },
  {
    slug: "sariyer",
    name: "Sariyer",
    side: "European",
    description:
      "Northern European-side district along the upper Bosphorus, including the Maslak business zone.",
    sources: [SRC.istanbulWiki],
    neighborhoods: [
      seedNeighborhood({
        slug: "maslak",
        name: "Maslak",
        description:
          "Northern business district with towers and campuses, north of Levent on the M2 line.",
        atmosphere: "Corporate, modern, car-oriented.",
        tags: ["business", "metro"],
        transportation:
          "M2 metro (Itu-Ayazaga / Sariyer stops) and Buyukdere Avenue.",
        sources: [SRC.metroIstanbul],
        lastVerified: VERIFIED,
      }),
      seedNeighborhood({
        slug: "bebek",
        name: "Bebek",
        description:
          "Affluent Bosphorus waterfront known for its cafe-lined bay (administratively in Besiktas, grouped here for the upper-Bosphorus coast).",
        atmosphere: "Affluent, waterfront, scenic.",
        tags: ["waterfront", "upscale"],
        transportation: "Coastal buses along the Bosphorus from Besiktas.",
        sources: [SRC.istanbulWiki],
        lastVerified: VERIFIED,
      }),
    ],
  },
  {
    slug: "atasehir",
    name: "Atasehir",
    side: "Asian",
    description:
      "Modern Asian-side high-rise district near the finance zone, built for newer apartments and quieter nights.",
    sources: [SRC.istanbulWiki, SRC.metroIstanbul],
    neighborhoods: [
      seedNeighborhood({
        slug: "atasehir-center",
        name: "Atasehir Center",
        richSlug: "atasehir",
        description:
          "Towers, malls, and new-build apartments with elevators, parking, and gyms.",
        atmosphere: "Modern, spacious, corporate.",
        tags: ["business", "modern", "quiet"],
        transportation:
          "Metro and buses across the Asian side; taxi to Kadikoy and the finance district.",
        sources: [SRC.metroIstanbul],
        lastVerified: VERIFIED,
      }),
    ],
  },
  {
    slug: "bakirkoy",
    name: "Bakirkoy",
    side: "European",
    description:
      "Established European-side coastal district near the old airport, with seaside parks and malls.",
    sources: [SRC.istanbulWiki],
    neighborhoods: [
      seedNeighborhood({
        slug: "bakirkoy-center",
        name: "Bakirkoy Center",
        description:
          "Walkable shopping streets and a long Marmara seaside promenade, well linked by Marmaray.",
        atmosphere: "Residential, coastal, established.",
        tags: ["seaside", "residential", "marmaray"],
        transportation: "Marmaray and M1 metro; coastal Marmara walking paths.",
        sources: [SRC.metroIstanbul],
        lastVerified: VERIFIED,
      }),
    ],
  },
  {
    slug: "maltepe",
    name: "Maltepe",
    side: "Asian",
    description:
      "Asian-side coastal district east of Kadikoy with a large reclaimed seaside park and newer housing.",
    sources: [SRC.istanbulWiki],
    neighborhoods: [
      seedNeighborhood({
        slug: "maltepe-center",
        name: "Maltepe Center",
        description:
          "Big coastal park, marina, and metro access make it a quieter, cheaper Asian-side base.",
        atmosphere: "Coastal, residential, spacious.",
        tags: ["seaside", "budget", "metro"],
        transportation: "M4 metro and Marmara coastal buses toward Kadikoy.",
        sources: [SRC.metroIstanbul],
        lastVerified: VERIFIED,
      }),
    ],
  },
];

// ---- Static helpers (no DB) ----

export function getDistrictBySlug(slug: string): IstanbulDistrict | undefined {
  return istanbulDistricts.find((d) => d.slug === slug);
}

export function getNeighborhoodsByDistrict(
  slug: string,
): DistrictNeighborhood[] {
  return getDistrictBySlug(slug)?.neighborhoods ?? [];
}

// Resolve a DistrictNeighborhood to its rich profile in neighborhoods.ts (if
// any). This is the bridge between the lightweight district layer and the
// fully-detailed 10 neighborhoods - callers render the rich card when present
// and fall back to the lightweight fields otherwise.
export function getRichNeighborhood(
  n: DistrictNeighborhood,
): Neighborhood | undefined {
  return n.richSlug ? getNeighborhoodBySlug(n.richSlug) : undefined;
}

// Flat list of all seeded neighborhoods with their parent district attached.
export function getAllDistrictNeighborhoods(): Array<{
  district: IstanbulDistrict;
  neighborhood: DistrictNeighborhood;
}> {
  return istanbulDistricts.flatMap((district) =>
    district.neighborhoods.map((neighborhood) => ({ district, neighborhood })),
  );
}

// District filter options keyed by side - safe to expose anywhere
// neighborhoods are already used as filters (spaces, plans, discover).
export interface DistrictFilterOption {
  slug: string;
  name: string;
  side: IstanbulSide | null;
}

export function getDistrictFilterOptions(): DistrictFilterOption[] {
  return istanbulDistricts
    .map((d) => ({ slug: d.slug, name: d.name, side: d.side }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

// ---- Graceful Supabase read with static fallback ----

type DistrictRow = {
  id: string;
  name: string;
  side: string | null;
  slug: string | null;
};

type NeighborhoodRow = {
  district_id: string | null;
  slug: string | null;
  name: string;
  description: string | null;
  tags: string[] | null;
  atmosphere: string | null;
  nomad_score: number | null;
  nightlife_score: number | null;
  cost_level: number | null;
  walkability: number | null;
  safety: number | null;
  transportation: string | null;
  sources: SpaceSource[] | null;
  unverified_fields: string[] | null;
  last_verified: string | null;
};

function rowToNeighborhood(row: NeighborhoodRow): DistrictNeighborhood {
  // If a seeded neighborhood shares this slug, inherit its richSlug link so
  // the DB layer never has to know about neighborhoods.ts.
  const seeded = row.slug
    ? getAllDistrictNeighborhoods().find(
        (x) => x.neighborhood.slug === row.slug,
      )?.neighborhood
    : undefined;
  return {
    slug: row.slug ?? "",
    name: row.name,
    description: row.description,
    tags: row.tags ?? [],
    atmosphere: row.atmosphere,
    nomadScore: row.nomad_score,
    nightlifeScore: row.nightlife_score,
    costLevel: row.cost_level,
    walkability: row.walkability,
    safety: row.safety,
    transportation: row.transportation,
    richSlug: seeded?.richSlug,
    sources: row.sources ?? [],
    unverifiedFields: row.unverified_fields ?? [],
    lastVerified: row.last_verified,
  };
}

// Reads the live district hierarchy from Supabase, falling back to the static
// seed if the tables aren't applied yet, the query errors, or returns nothing.
// Public reference content, so this uses the cookie-less public client and is
// cache-wrapped like the other reference fetchers (ambient.ts pattern).
export async function getDistricts(): Promise<IstanbulDistrict[]> {
  "use cache";
  cacheLife("hours");

  try {
    const supabase = createPublicClient();
    const [districtsRes, neighborhoodsRes] = await Promise.all([
      supabase
        .from("istanbul_districts")
        .select("id, name, side, slug")
        .order("name"),
      supabase
        .from("istanbul_neighborhoods")
        .select(
          "district_id, slug, name, description, tags, atmosphere, nomad_score, nightlife_score, cost_level, walkability, safety, transportation, sources, unverified_fields, last_verified",
        )
        .order("name"),
    ]);

    const districtRows = districtsRes.data as DistrictRow[] | null;
    if (districtsRes.error || !districtRows || districtRows.length === 0) {
      return istanbulDistricts;
    }

    const neighborhoodRows =
      (neighborhoodsRes.data as NeighborhoodRow[] | null) ?? [];
    const byDistrict = new Map<string, DistrictNeighborhood[]>();
    for (const row of neighborhoodRows) {
      if (!row.district_id) continue;
      const list = byDistrict.get(row.district_id) ?? [];
      list.push(rowToNeighborhood(row));
      byDistrict.set(row.district_id, list);
    }

    return districtRows.map((d) => ({
      slug: d.slug ?? "",
      name: d.name,
      side: (d.side as IstanbulSide | null) ?? null,
      description: null,
      // The rich district blurb + citations live in the seed; merge them in
      // by slug so the DB only owns the structural/override bits.
      sources: getDistrictBySlug(d.slug ?? "")?.sources ?? [],
      neighborhoods: byDistrict.get(d.id) ?? [],
    }));
  } catch {
    return istanbulDistricts;
  }
}
