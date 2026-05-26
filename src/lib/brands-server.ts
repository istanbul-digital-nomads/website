import "server-only";
import { createPublicClient } from "@/lib/supabase/server";
import {
  brands,
  brandLocations,
  getBrandBySlug,
  type BrandCategory,
  type BrandLocation,
  type NomadBrand,
} from "./brands";
import type { SpaceSource } from "./spaces";

// DB read with graceful fallback to the static seed.
//
// Mirrors how circles/spaces degrade: if the brand tables aren't applied yet
// (migration 029) or are empty, we return the static seed so the map always
// has data. Any DB error is swallowed - this powers a public map layer that
// must never block render. Server-only (uses the public Supabase client).

export interface BrandsData {
  brands: NomadBrand[];
  locations: BrandLocation[];
}

export async function getBrandsData(): Promise<BrandsData> {
  try {
    const supabase = createPublicClient() as unknown as {
      from: (t: string) => any;
    };

    const [{ data: brandRows }, { data: locationRows }] = await Promise.all([
      supabase.from("nomad_brands").select("*"),
      supabase.from("brand_locations").select("*"),
    ]);

    if (!brandRows?.length || !locationRows?.length) {
      return { brands, locations: brandLocations };
    }

    const mappedBrands: NomadBrand[] = (
      brandRows as Array<Record<string, unknown>>
    ).map((row) => {
      const seed = getBrandBySlug(String(row.slug));
      return {
        slug: String(row.slug),
        name: String(row.name),
        icon: (row.icon as string) ?? seed?.icon ?? "☕",
        category: (row.category as BrandCategory) ?? seed?.category ?? "coffee",
        color: (row.color as string) ?? seed?.color ?? "#c0392b",
        blurb: seed?.blurb ?? "",
        website: seed?.website,
      };
    });

    const bySlug = new Map(mappedBrands.map((b) => [b.slug, b]));
    const dbBrandSlugById = new Map<string, string>();
    for (const row of brandRows as Array<Record<string, unknown>>) {
      dbBrandSlugById.set(String(row.id), String(row.slug));
    }

    const mappedLocations: BrandLocation[] = (
      locationRows as Array<Record<string, unknown>>
    )
      .map((row) => {
        const brandSlug = dbBrandSlugById.get(String(row.brand_id)) ?? "";
        return {
          id: String(row.id),
          brand_slug: brandSlug,
          name: String(row.name ?? bySlug.get(brandSlug)?.name ?? "Branch"),
          coordinates: [Number(row.lng), Number(row.lat)] as [number, number],
          district: String(row.district ?? ""),
          neighborhood_slug: (row.neighborhood_slug as string) ?? undefined,
          address: (row.address as string) ?? undefined,
          opening_hours: (row.opening_hours as string) ?? undefined,
          rating: (row.rating as number) ?? null,
          reviews_count: (row.reviews_count as number) ?? null,
          wifi_score: (row.wifi_score as number) ?? null,
          atmosphere_score: (row.atmosphere_score as number) ?? null,
          laptop_friendliness: (row.laptop_friendliness as number) ?? null,
          power_outlet_score: (row.power_outlet_score as number) ?? null,
          images: (row.images as string[]) ?? [],
          sources: (row.sources as SpaceSource[]) ?? [],
          unverified_fields: (row.unverified_fields as string[]) ?? [],
          last_verified: (row.last_verified as string) ?? undefined,
        };
      })
      .filter((l) => l.brand_slug !== "");

    return { brands: mappedBrands, locations: mappedLocations };
  } catch {
    // Tables absent or DB unreachable - degrade to the static seed.
    return { brands, locations: brandLocations };
  }
}
