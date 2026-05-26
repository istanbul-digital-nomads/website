# Master Progress - Multi-Agent Buildout

Date: 2026-05-25. Coordinator: 5 parallel agents (2 doc-only in the main worktree, 3 net-new code in isolated worktrees).

This reconciles the five agent runs. Nothing is committed - every change sits in its worktree's working tree for review.

## Scope decisions (locked with the user)

1. Docs + safe net-new code only. NO app-wide design-system refactor this pass.
2. Cited-source-only scores. A score stays `null` and is listed in `unverified_fields` unless a real source backs it.
3. New structured data lands as Supabase migrations (graceful static fallback in the app), not `/data/*.json`.
4. One worktree + branch per code agent.

## Completed

| # | Agent | Output | Location |
|---|-------|--------|----------|
| 1 | Design System Audit | `docs/agents/DesignSystemAudit.md` (doc only) | main worktree |
| 2 | Content Calendar System | `docs/agents/ContentCalendarSystem.md` + additive `scripts/i18n-content.ts` helper | main worktree |
| 3 | Nomad Brands map layer | migration 029, `src/lib/brands.ts`, map brand filter | worktree `agent-ad7fa78f2933996f1` / branch `worktree-agent-ad7fa78f2933996f1` |
| 4 | Neighborhood intelligence | migration 030, `src/lib/districts.ts` | worktree `agent-a3099ed7cc436f56a` / branch `worktree-agent-a3099ed7cc436f56a` |
| 5 | Circles redesign | `docs/agents/CirclesResearch.md`, migration 031, extended `src/lib/circles.ts` | worktree `agent-ad3baae78d3204311` / branch `worktree-agent-ad3baae78d3204311` |

### Agent 1 - Design System Audit (doc only, no source edits)
- Found legacy `primary-*`/`secondary-*`/`accent-*`/`surface-*` ramps still defined as static hex (not CSS vars) at `tailwind.config.ts:14-48`, encoding the retired warm-dusk palette. ~315 usages across 63 files; the primary `Button` is built on them.
- Badge sprawl: 4 components, 3 radii, 2 palettes. Proposed a single tone-table `Badge` with `tone`/`size`/`shape`.
- `DESIGN.md` and `docs/redesign-2026-q2.md` contradict each other on button/card radius.
- 429 raw-hex literals in `className`; proposed an ESLint `no-restricted-syntax` guard modeled on the existing em-dash rule.
- All refactor work catalogued as a DEFERRED P0/P1/P2 checklist - not executed (per decision #1).

### Agent 2 - Content Calendar System
- `ContentCalendarSystem.md`: channel pillars (LinkedIn/Instagram/Blog) mapped to existing `src/content/` collections + the two calendar docs (new vs covered), a dispatch flow reusing existing agents (`blog-author` -> `pnpm i18n:stub` -> `nomad-*-editor` -> `pnpm format` -> publish), monthly grid + weekly pipeline from 2026-05-25, a 6-state status workflow keyed to `pnpm i18n:status`, and a Persian audit-and-improve plan via `nomad-fa-editor`.
- Additive code: `computeCoverage()` helper + `status --json` flag in `scripts/i18n-content.ts` (text path unchanged; verified with a logic test + `prettier --check`).

### Agent 3 - Nomad Brands
- `029_nomad_brands.sql`: `nomad_brands` + `brand_locations`, RLS public-read, indexes on `brand_id`/`neighborhood_slug`.
- `src/lib/brands.ts` (client-safe types + static seed + helpers), `src/lib/brands-server.ts` (graceful DB read -> seed fallback), reusable `brand-marker.tsx` + `brand-filter-bar.tsx`.
- Map: brand filter chips + markers on `istanbul-map.tsx`; plan creation now offers coffee-chain -> branch -> verified space -> custom pin.
- Data: 3 brands (Espressolab, Starbucks, BEX), 5 cited branches. Work-quality scores (`wifi_score`, `atmosphere_score`, `laptop_friendliness`, `power_outlet_score`) all `null` + in `unverified_fields`; only citable fields (coords/address/hours/rating) populated. Verified by spot-check.
- `tsc --noEmit` + `eslint .` clean.

### Agent 4 - Neighborhood intelligence
- `030_istanbul_districts.sql`: `istanbul_districts` + `istanbul_neighborhoods`, RLS public-read.
- `src/lib/districts.ts`: composes with (does not duplicate) the existing 10 rich neighborhoods via `richSlug`; helpers incl. `getDistrictFilterOptions()` and `getDistricts()` graceful DB read.
- Seeded 11 districts / 28 neighborhoods - names + Asian/European side + transport cited; all 5 score dimensions `null` + auto-listed in `unverifiedFields`.
- Wired only the safe additive filter-options piece; risky wiring documented, not forced.
- `pnpm type-check` + `pnpm lint` clean.

### Agent 5 - Circles redesign
- `CirclesResearch.md`: real community-need-justified categories (Professional/Lifestyle/Growth/Social/Relationship), sourced from NomadList/r/digitalnomad/coworking/Discord patterns.
- `031_circles_v2.sql`: additive on top of migration 013 - `circle_categories`, `circles`, `circle_badges`, `circle_activity`, a defaulted `participation_score` on `circle_members`, and a `circle_participation` view. Seeds the 5 categories.
- `src/lib/circles.ts`: `Circle` extended with `category` + optional `badges`; all 6 original circles/slugs/accents still valid; 16 new circles + `getCirclesByCategory`/`getCategoryMeta`. Category-grouped discovery view + reusable `circle-category-section.tsx`; detail/home use a translation-or-fallback resolver.
- `pnpm type-check` + `pnpm lint` clean.

## Architecture decisions

- **Static-source-of-truth + graceful DB fallback** kept consistent across brands/districts/circles, matching `spaces.ts`/`circles.ts`. Migrations are defined but "not applied yet"; the app degrades when tables are absent.
- **Reserved migration numbers** 029/030/031 across the three worktrees - no clash. Linear merge order must be 029 -> 030 -> 031.
- **Cited-source-only** enforced via `sources[]` + `unverified_fields[]` (reusing `SpaceSource`); confirmed by spot-check that work-quality scores are `null`.
- **Composition over duplication**: districts reference the existing rich neighborhoods; circles v2 builds on migration 013 rather than replacing it.
- **Reuse over recreation**: the content system dispatches to the existing `blog-author`/`linkedin-marketer`/`nomad-*-editor` agents; no new content sub-agents were created.

## Pending / not done this pass (by design)

- Design-system refactor (Agent 1 checklist) - DEFERRED, doc only.
- Bulk brand-location collection beyond the 5 cited branches (store-locator scrape with citations).
- Score collection for brand locations and neighborhoods (every quality score currently `null` by the no-fabrication rule).
- Circles matching/recommendation engine, moderation, participation-scoring cron, onboarding integration - designed/stubbed, not implemented.
- Translations for the 16 new circles.
- Risky neighborhood integrations (spaces-directory client filter, map, onboarding's separate 39-district list) - documented, not wired.

## Blockers / environment notes

- **pnpm under Node 20:** the default corepack pnpm shim fails on Node 20.19.3 in this environment; agents ran checks via Node 22. Not a code issue but worth a `.nvmrc`/CI note.
- **`pnpm i18n:stub` emits MDX-illegal HTML comments** (`<!-- -->` instead of `{/* */}`) - flagged by Agent 2 as a separate fix.
- **Migrations are unapplied** - need `supabase db reset`/push in order to take effect; verify they apply cleanly on top of 028 before merge.

## Future improvements

- Execute the Agent 1 token migration (legacy -> cinematic) + unified Badge + ESLint hex guard.
- Admin UI to manage brands/circles now that they're DB-backed.
- Crowd-sourced or agent-sourced (cited) scoring pipeline to fill the `null` quality fields.
- Circles matching engine driven by `circle_activity` + `participation_score`.

## Integration done (2026-05-25)

All five agents' work was integrated onto branch `claude/focused-euler-c78831` and verified.

- Merged the three feature branches in order 029 -> 030 -> 031. One real conflict in `src/types/database.ts` (agents 3 and 4 both appended table types) - resolved by hand to keep all four tables (`nomad_brands`, `brand_locations`, `istanbul_districts`, `istanbul_neighborhoods`).
- Fixed one integration bug: `src/lib/search.ts` called `t()` for every circle without a `.has()` guard, so the 16 new circles threw `MISSING_MESSAGE` at build. Now falls back to the static `circles.ts` fields, matching the pattern the pages already use.

### Verification results
- `pnpm type-check`: clean (exit 0).
- `pnpm lint`: clean (exit 0).
- `pnpm build`: success (exit 0), 631 static pages generated, **0 `MISSING_MESSAGE`** after the search.ts fix.
- Migrations: static structural review only - balanced parens, FKs reference parent tables, RLS + public-read on every table, 031 orders `circle_categories` before `circles` and only alters the existing `circle_members`. **Not applied to a DB** - no local Postgres/Docker/Supabase CLI here, and I won't touch production. Needs `supabase db push` in your environment.
- Browser (dev server on :3030): home `/` 200; `/circles` renders all 22 circles grouped into the 5 categories with the 16 new ones resolving via fallback, no console errors, design language consistent; `/circles/developers` and `/circles/ai-builders` detail pages 200.
- **Map brand filter - mounted, builds, but not exercisable in the automated preview.** `istanbul-map.tsx` was rendered only by `NeighborhoodsMapSection`, which was orphaned at the base commit. I mounted that section on the home page (after the rhythm matcher) so the brand filter is now reachable for real users. In the automated preview browser the section heading and the MapLibre canvas render, but **none** of react-map-gl's children mount - not the brand filter bar, not the brand markers, and not even the *pre-existing* neighborhood markers (0 markers, 0 map controls). Since the same failure hits pre-existing code, this is a MapLibre `load`-event limitation in the headless preview, not a defect in the brand work. CartoDB CDN is reachable (200) and WebGL is present, so it should render in a normal browser. Verified by code + clean build instead: 3 brands + 6 cited branch locations seeded in `src/lib/brands.ts`, `BrandFilterBar` renders a toggle per brand, markers gated on toggle. The plan-create brand picker also lives behind `/plans/new` (auth-gated).

### Toolchain note
Shell default Node is v14 and the corepack pnpm shim is broken on Node 20 here; all checks ran via Node 22 (`nvm use 22.22.2`). Worth a `.nvmrc`/CI pin.

## Remaining for you (on approval)

1. `supabase db push` (or `db reset`) in your env to apply 029/030/031 on top of 028.
2. Confirm the brand-filter map renders in a real browser (it's now mounted on the home page; the automated preview can't exercise MapLibre's children, including pre-existing markers). `pnpm dev` and scroll to "The neighborhoods, mapped."
3. ~~Stale copy~~ DONE - `circlesV2.title`/`metaDescription` no longer say "Six"; updated in all 5 locales.
4. ~~Translations for the 16 new circles~~ DONE - all 22 circles' names/blurbs/descriptions/rhythms translated across en/tr/fa/ar/ru via the `nomad-*-editor` agents; build emits 0 `MISSING_MESSAGE`.
5. ~~Push + PR~~ DONE - merged to `develop` (3.30.0) and opened PR #134 (`develop` -> `main`). Not merged/tagged - that's your review step.

Still open (need your environment):
- `supabase db push` to apply migrations `029`/`030`/`031`.
- Real-browser confirm of the brand-filter map (automated preview can't mount MapLibre children). A `brands.test.ts` suite now locks the data + no-fabrication contract as a substitute check.
- Category headers on `/circles` still render from the static English in `circles.ts` (not wired to messages), so non-English locales show English category labels - a small follow-up if you want them localized.
