# Agent 4 - Istanbul District/Neighborhood Intelligence

A district -> neighborhood hierarchy that sits on top of the 10 rich
neighborhood profiles already in `src/lib/neighborhoods.ts`. It doesn't
duplicate them - it references them by slug and stays cited-source-only.

## What shipped (this worktree, uncommitted)

- `supabase/migrations/030_istanbul_districts.sql` - `istanbul_districts` +
  `istanbul_neighborhoods` tables, RLS public-read, indexes on `district_id`
  and `slug`. Not applied yet; reads degrade to the static seed.
- `src/lib/districts.ts` - typed `IstanbulDistrict` + `DistrictNeighborhood`
  interfaces (scores `number | null`, reuse `SpaceSource`), the static seed,
  helpers, and a graceful Supabase read.
- `src/types/database.ts` - `Row/Insert/Update` types for both new tables.

## Implementation checklist

- [x] Migration `030` (verified no other migration uses `030`).
- [x] `IstanbulDistrict` / `DistrictNeighborhood` interfaces, scores nullable.
- [x] Static seed: 11 districts, 28 neighborhoods.
- [x] Reference the rich 10 by `richSlug` instead of re-describing them.
- [x] Helpers: `getDistrictBySlug`, `getNeighborhoodsByDistrict`,
      `getRichNeighborhood` (the bridge to `neighborhoods.ts`),
      `getAllDistrictNeighborhoods`, `getDistrictFilterOptions`.
- [x] `getDistricts()` - Supabase read with static fallback (ambient.ts
      pattern: `createPublicClient` + `use cache`, try/catch to seed).
- [x] Database table types added so the read layer type-checks.
- [x] `pnpm type-check` clean, `pnpm lint` clean.
- [ ] Collect + cite real scores (see follow-up below) - intentionally null.

## Architecture decisions

### How it composes with `neighborhoods.ts`

- `neighborhoods.ts` keeps owning the 10 deep profiles (rent ranges, photos
  with credits, vibe, transport prose). It's untouched.
- The district layer is intentionally lightweight. Each
  `DistrictNeighborhood` can set `richSlug` (a `NeighborhoodSlug`). When set,
  `getRichNeighborhood()` resolves the full profile so UIs render the rich
  card; when absent (e.g. Maslak, Bebek, Caddebostan) the lightweight
  cited fields are used. One source of truth per concern, no duplication.

### Two `IstanbulDistrict` types - on purpose

`src/lib/istanbul-locations.ts` already exports an `IstanbulDistrict` (the
flat 39-ilce + 960-mahalle list from turkiyeapi.dev, powering the location
picker). Ours is a different shape for a different job (curated nomad
intelligence, ~11 districts). They live in separate modules and are never
imported together, so the name reuse is safe. If they ever need to coexist
in one file, alias on import.

### DB as override, seed as truth

The static seed is the launch source of truth. The tables let us
override/extend without a redeploy later. `getDistricts()` returns the seed
whenever the tables are absent, error, or empty. When DB rows exist, district
blurbs + citations are still merged from the seed by slug (the DB only owns
structure + score overrides), and `rowToNeighborhood` re-attaches `richSlug`
from the seed by slug so the DB never needs to know about `neighborhoods.ts`.

### No fabrication

District `name`, `side` (Asian/European), and `transportation` carry a
`sources[]` entry. Every quantitative score (`nomad_score`,
`nightlife_score`, `cost_level`, `walkability`, `safety`) is `null` and listed
in `unverifiedFields` - `seedNeighborhood()` auto-fills that list from whatever
wasn't provided, so a row can never claim a score it can't back.

## Districts + neighborhoods seeded

Side is cited (Wikipedia districts list); transport is cited
(Metro Istanbul / Sehir Hatlari). All scores null at launch.

| District | Side | Neighborhoods (rich link in bold) |
| --- | --- | --- |
| Kadikoy | Asian | **Kadikoy Center**, **Moda**, Caddebostan |
| Besiktas | European | **Besiktas Center**, **Levent**, Etiler, Ortakoy |
| Beyoglu | European | **Cihangir**, **Karakoy / Galata**, Cukurcuma |
| Sisli | European | **Nisantasi**, Bomonti, Mecidiyekoy |
| Uskudar | Asian | **Uskudar Center**, Kuzguncuk |
| Fatih | European | **Balat**, Fener |
| Sariyer | European | Maslak, Bebek |
| Atasehir | Asian | **Atasehir Center** |
| Bakirkoy | European | Bakirkoy Center |
| Maltepe | Asian | Maltepe Center |

- Rich-linked (full profile via `richSlug`): all 10 from `neighborhoods.ts`.
- Lightweight-but-cited (no scores yet): Caddebostan, Etiler, Ortakoy,
  Cukurcuma, Bomonti, Mecidiyekoy, Kuzguncuk, Fener, Maslak, Bebek,
  Bakirkoy Center, Maltepe Center.

Note: Bebek is administratively in Besiktas; it's grouped under Sariyer here
for the upper-Bosphorus coast and that caveat is in its description.

## Cited sources

- Districts of Istanbul (Asian vs European side, ilce roster):
  https://en.wikipedia.org/wiki/Districts_of_Istanbul
- Metro Istanbul (metro / Marmaray lines):
  https://www.metro.istanbul/en
- Sehir Hatlari (public ferry routes):
  https://www.sehirhatlari.istanbul/en

## Integration points

### Wired (safe + additive)

- `getDistrictFilterOptions()` exposes districts (slug, name, side) as ready
  filter options anywhere neighborhoods are already filtered, sorted by name.
- Database types added so any consumer of `getDistricts()` type-checks.

### Documented, NOT wired (risky - left for a follow-up)

- **Spaces directory filter** (`src/app/[locale]/(marketing)/spaces/
  spaces-directory.tsx`): it's a client component with its own filter state
  machine (`spaces-finder.ts`, `getSpaceNeighborhoods`). Adding a district
  facet means threading new state + i18n keys through that machinery - a
  refactor, not an additive change. `getDistrictFilterOptions()` is ready
  when someone takes it on.
- **City guides / neighborhoods map** (`neighborhoods-map-section.tsx`,
  `istanbul-map.tsx`): could render district groupings, but the map is keyed
  to the 10 rich `coords`. Adding lightweight pins needs design input.
- **Onboarding / profile preferences** (`location-picker.tsx`): already uses
  the flat 39-district list from `istanbul-locations.ts`. Reconcile before
  introducing a second district concept to avoid two pickers.
- **Plan creation / recommendations / discover**: candidates for a
  district-level filter once the spaces facet pattern lands.

## Score-collection follow-up (open)

Every score ships `null` by design. To turn them on:

1. Pick one dimension at a time (start with `cost_level` from rent data, then
   `walkability`).
2. For each neighborhood, find an authoritative source (rent indices, transit
   data, municipal stats), add it to that neighborhood's `sources[]`, set the
   score, and drop the field from `unverifiedFields`.
3. Prefer editing the static seed in `districts.ts`; use the DB tables only
   for overrides that shouldn't wait on a deploy.
4. Keep the rule: no score without a citation.
