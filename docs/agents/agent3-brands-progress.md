# Agent 3 - Nomad Brands map layer

A "Nomad Brands" layer that plots Istanbul branches of recognisable chains
(coffee first) on the maps, with a toggle filter and plan-creation support.

## What's done

- **Migration `029_nomad_brands.sql`** - `nomad_brands` (chain catalogue) and
  `brand_locations` (individual branches). RLS on, public-read select policies,
  `idx_brand_locations_brand` + `idx_brand_locations_neighborhood`. Follows the
  `013_circles_perks.sql` style (header comment, nullable/defaulted columns,
  "not applied yet" note). Confirmed 029 isn't used by any other migration.
- **`src/lib/brands.ts`** - `NomadBrand` + `BrandLocation` types (reuses
  `SpaceSource` from `./spaces`, scores `number | null`), the static `brands`
  and `brandLocations` seed, and helpers `getBrandBySlug`,
  `getLocationsByBrand`, `getLocationsByNeighborhood`. Client-safe (no
  `server-only`), so map components can import the seed directly.
- **`src/lib/brands-server.ts`** - `getBrandsData()` reads both tables via the
  public Supabase client and falls back to the static seed when the tables are
  absent/empty or any query throws. Mirrors how `ambient.ts` /
  `member-activity.ts` degrade. `server-only`.
- **`src/types/database.ts` + `src/types/models.ts`** - generated-style Row/
  Insert/Update for both tables, plus `NomadBrandRow` / `BrandLocationRow`.
- **Reusable components**
  - `src/components/ui/brand-marker.tsx` - `BrandMarker`, a brand-tinted pin
    with the brand icon, matching the existing space/neighborhood marker look.
  - `src/components/ui/brand-filter-bar.tsx` - `BrandFilterBar`, a row of
    toggle chips (one per brand) driving which markers render.
- **Map integration**
  - `src/components/ui/istanbul-map.tsx` - brand filter chips (top), brand
    markers for toggled-on brands, and a branch popup card. Brands default off
    so the neighborhood overview stays the focus. Accepts optional `brands` /
    `brandLocations` props (defaults to the static seed).
  - `src/components/sections/plans/plan-create-map.tsx` +
    `plan-create-flow.tsx` - in picker mode the host can pick a coffee chain ->
    a specific branch (added as a custom stop with name + coords pre-filled),
    a verified space, or a custom map pin. New `onPickBrandBranch` callback and
    `makeStopFromBranch` helper.

## Seed coverage (cited-source-only)

3 brands, 5 verified branches. Every branch cites coordinates/address and most
cite a Google rating; all four work-quality scores (wifi, atmosphere, laptop,
power) are deliberately `null` and listed in `unverified_fields` because no
citable source scores them - matching the spaces.ts convention.

| Brand | Branches seeded | Fully verified* | Partial (hours/score gaps) |
| --- | --- | --- | --- |
| Espressolab | 2 | 1 (Cihangir) | 1 (Kadikoy - hours) |
| Starbucks | 2 | 1 (Bebek) | 1 (Kadikoy Reserve - hours) |
| BEX Coffee | 1 | 0 | 1 (Kadikoy - hours) |

\* "Fully verified" = name, coordinates, district, address, hours, and rating
all cited. None have on-the-ground work-quality scores yet (by design).

### Sources used

- Espressolab Cihangir - Wanderlog, Restaurant Guru
- Espressolab Kadikoy - Restaurant Guru
- Starbucks Bebek - Tripadvisor
- Starbucks Reserve Kadikoy - Foursquare
- BEX Coffee Kadikoy - BEX official locations page

## Pending / follow-ups

- **Bulk branch collection.** Espressolab/Starbucks/BEX each have dozens of
  Istanbul branches. The seed is intentionally a small verified subset. Next
  step: pull the official store-locator data per brand, map each to a
  `neighborhood_slug`, and load into `brand_locations`. The schema and the
  graceful `getBrandsData()` fallback already support this with no code change.
- **Work-quality scoring.** Have the nomad-space-scorer agent visit branches
  and fill `wifi_score` / `atmosphere_score` / `laptop_friendliness` /
  `power_outlet_score`, removing them from `unverified_fields` as each gets a
  citable source.
- **More brand categories.** `BrandCategory` already allows `cowork` / `gym` /
  `food`; add rows to `brands` to extend - no schema change needed.
- **Wire `getBrandsData()` into the page** that renders `IstanbulMap` so the
  map prefers DB data when migration 029 is applied (currently the map uses the
  static seed by default).

## Architecture decisions

- **Client-safe seed, server-only DB read.** Split so map client components can
  import the static seed without pulling in `server-only`, while the DB read
  (and its Supabase dependency) stays server-side.
- **Brand branch = custom stop.** A branch isn't a verified `NomadSpace`, so it
  becomes a `custom_location` stop with name + coords pre-filled rather than a
  new stop kind - keeps the plan data model unchanged.
- **Scalable over hardcoded.** Adding a brand is one row in `brands` + its
  branches; the filter bar, markers, and popups are all data-driven.
- **Verification honesty.** Reuses the spaces.ts rule: unscored fields stay
  `null` and are listed in `unverified_fields`, surfaced as "Work scores aren't
  checked here yet" in the popup.
