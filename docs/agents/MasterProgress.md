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

## Integration / merge checklist (next, on approval)

1. Review each worktree diff.
2. Apply migrations in order (029 -> 030 -> 031) against a fresh DB to confirm they stack cleanly on 028.
3. Run the full app (`pnpm dev`) and verify the map brand filter + plan-create branch selection in the browser.
4. One PR per domain branch, or squash into one integration branch - per your preference.
