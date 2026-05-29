# Design System Audit

> Status: **Findings only - nothing in this doc has been executed.** This is a read-only audit. Every refactor below is DEFERRED.
> Scope: `DESIGN.md`, `src/styles/globals.css`, `tailwind.config.ts`, and the 33 primitives in `src/components/ui/`.

The system is genuinely three layers deep and mostly coherent at the token-definition level, but it's mid-migration and it shows. The cinematic `ink-*` / `gold` / `rose` palette (v3.6.0) lives side-by-side with the old `primary-*` / `secondary-*` ramps that were supposed to be retired - and the old ramps still resolve to the *pre-migration* warm-dusk hexes (`#c0392b`, `#526e89`), not to the cinematic values, so a component using `bg-primary-600` paints a different colour than one using `bg-rose`. On top of that there are four overlapping badge components with three different radii, drop shadows hardcoded on surfaces where `DESIGN.md` says "lines, not shadows", and 429 raw hex literals sprinkled through `className` strings. None of this is broken, but it quietly erodes the "flipping dark/light swaps values, not references" promise the design doc makes. This audit pins each issue to a file and line and proposes a bounded path back to one source of truth.

---

## Token inventory

What's defined where, and which layer is canonical.

| Layer | File | What it holds | Canonical? |
|---|---|---|---|
| Editorial principles | `DESIGN.md` | Colour semantics, type scale, spacing/radius rules, "lines over shadows" | Yes - the written intent |
| Raw CSS vars (light) | `src/styles/globals.css:6-43` (`:root`) | `--ink-0..5`, `--paper*`, `--terracotta*`, `--ferry-yellow`, `--moss`, `--bosphorus`, `-ink` contrast-safe text variants | Yes - the value source |
| Raw CSS vars (dark) | `src/styles/globals.css:45-75` (`.dark`) | Same token names, dark values | Yes |
| Tailwind bindings | `tailwind.config.ts:53-93` | `ink`, `paper`, `terracotta`, `bosphorus`, `ferry-yellow`, `moss`, `deep-water`, `cream`, `gold`, `rose` via `rgb(var(--token) / <alpha-value>)` | Yes - the JSX-facing aliases |
| Legacy ramps | `tailwind.config.ts:14-48` | `primary-50..950`, `secondary-50..900`, `accent-{warm,coral,green}`, `surface-{light,dark}` - all **static hex, not CSS vars** | No - deprecated, but still resolving |
| Type scale | `tailwind.config.ts:101-147` | `display-*`, `h1..h4`, `lede/body/meta`, `eyebrow` + legacy `display-sm/md`, `body-lg/xl` | Yes (with legacy keys) |
| Tone tables | `src/lib/member-roles.ts:46-58`, `src/lib/verification.ts:28-46` | Per-role / per-level `bg`/`text`/`ring` class strings (cinematic tokens) | Yes - badge colour source |

Key inventory finding: the legacy `primary-*`/`secondary-*`/`accent-*`/`surface-*` ramps at `tailwind.config.ts:14-48` are **static hex literals**, so they do NOT flip with theme and they encode the pre-v3.6.0 warm-dusk palette (`primary-500: #c0392b`, `secondary-400: #526e89`). `DESIGN.md:67-74` ("What's gone") claims these were replaced - but only the `terracotta`/`bosphorus` *aliases* were repointed at CSS vars. The numeric ramps were never removed and never re-bound, so they're live, theme-blind, and off-palette.

---

## Inconsistencies

### 1. Token drift: legacy ramps coexist with (and contradict) the cinematic palette

**Evidence**

- `tailwind.config.ts:14-48` - `primary`, `secondary`, `accent`, `surface` defined as static hex (`primary-500: "#c0392b"`, `secondary-400: "#526e89"`). These are the warm-dusk colours `DESIGN.md:67-74` says were retired in v3.6.0.
- `src/components/ui/button.tsx:16-22` - the primary primitive button is built entirely on legacy tokens: `bg-primary-600`, `hover:bg-primary-700`, `focus-visible:ring-primary-500`, `dark:bg-primary-500`. Per `DESIGN.md:48`, the primary CTA colour is gold (`bg-gold text-deep-water`), not red.
- `src/components/ui/card.tsx:12,14` - hover/focus states use `hover:border-primary-300/70`, `dark:hover:border-primary-500/35`.
- `src/components/ui/location-picker.tsx:235,253` - `focus:border-primary-400`, `hover:bg-primary-50`.
- Spread: **315 legacy-token occurrences across 63 files** (`rg 'primary-[0-9]|secondary-[0-9]|accent-(warm|coral|green)|surface-(light|dark)' src/`). Heaviest offenders: `spaces-directory.tsx` (23), `tools/first-week-planner/first-week-planner.tsx` (20), `relocation-agent/relocation-agent-result.tsx` (18).

**Why it's a problem.** Two components on the same page can both look "branded" but paint different colours - `bg-primary-600` is `#a93226` (static red), `bg-rose` is `rgb(var(--terracotta))` (`#e87a5d`, theme-aware). The legacy ramps don't flip for light/dark, so anything built on them breaks the doc's core promise (`DESIGN.md:34`: "flipping between dark and light modes swaps the values, not the references"). It also means the brand's "one accent at a time, gold is primary" rule (`DESIGN.md:18-20`, `:48`) is silently violated by the single most-used primitive (the button).

### 2. Badge sprawl: four components, three radii, three APIs

| Component | File | Radius | Sizing API | Colour source | Tokens |
|---|---|---|---|---|---|
| `Badge` | `src/components/ui/badge.tsx:28` | `rounded-sm` | none (fixed `px-2 py-0.5 text-xs`) | inline `variantStyles` keyed on `EventType` | legacy + raw rgb |
| `RoleBadge` | `src/components/ui/role-badge.tsx:26-31` | `rounded-full` | `size: "sm"\|"md"` | `ROLE_TONE` table | cinematic (`bg-ink-2`, `text-ferry-yellow`) |
| `FlagBadge` | `src/components/ui/flag-badge.tsx:29` | `rounded-full` | none (fixed `px-2.5 py-0.5 text-xs`) | inline | legacy (`bg-primary-50`, `text-primary-700`, `ring-primary-200`) |
| `VerificationBadge` | `src/components/ui/verification-badge.tsx:40-44` | `rounded-full` | `size: "sm"\|"md"` | `VERIFICATION_TONE` table | cinematic + raw `sky-*` |

**Evidence of duplication**

- All four are `inline-flex items-center` pills, differing only in radius, padding scale, and where colour comes from.
- `Badge` is the odd one out on radius (`rounded-sm`, `src/components/ui/badge.tsx:28`) vs the other three `rounded-full`.
- `RoleBadge` (`role-badge.tsx:28`) and `VerificationBadge` (`verification-badge.tsx:43`) implement the *same* `size` switch with *different* values: role sm = `px-2 py-0.5 text-[10px]`, verification sm = `px-1.5 py-0.5 text-[10px]`.
- `FlagBadge` and `Badge` both hardcode their tone inline instead of reading a tone table like the other two.
- `Badge` and `FlagBadge` are built on legacy `primary-*` tokens (`badge.tsx:15`, `flag-badge.tsx:29`); `RoleBadge`/`VerificationBadge` are on cinematic tokens. So the four badges don't even share a palette.

**Why it's a problem.** Four primitives doing one job means four places to fix a radius change, four colour systems to keep in sync, and an inconsistent visual result (a square `Badge` next to round role/flag/verification chips on the same member card). It's exactly the "redo them" anti-pattern `DESIGN.md:150` warns against.

### 3. Shadow strategy: hardcoded shadows contradict "lines over shadows"

`DESIGN.md:143-144` and `docs/redesign-2026-q2.md:34,47` are explicit: no drop shadows on dark surfaces, use hairline borders + backdrop blur; shadows are "reserved for dropdown panels and modals."

**Evidence (in-spec - dropdowns/modals, fine)**

- `src/components/layout/header.tsx:301`, `src/components/layout/language-switcher.tsx:101`, `src/components/ui/command-menu.tsx:78`, `src/components/ui/bottom-sheet.tsx:116` - all `shadow-[0_..._rgba(0,0,0,...)]` on overlays. Allowed.

**Evidence (out-of-spec - shadows on non-overlay surfaces)**

- `src/components/ui/button.tsx:16` - `shadow-[0_8px_20px_rgba(192,57,43,0.14)]` baked into the primary button (a base control, not an overlay). The shadow colour is also the retired warm-dusk red.
- `src/components/ui/card.tsx:14` - `hover:shadow-[0_18px_48px_rgba(20,17,15,0.08)]` and `focus-within:shadow-[...]` on cards. `docs/redesign-2026-q2.md:134` explicitly says card hover should be "subtle 2px translate-y, not shadow grow" - the card does both (`hover:-translate-y-0.5` AND `hover:shadow-[...]`).
- `src/components/ui/neighborhood-stat-card.tsx:76` - `shadow-[0_18px_48px_rgba(20,17,15,0.06)]` on a resting (non-hover) card surface.
- `src/components/ui/location-picker.tsx:268,307` - `shadow-lg` on the suggestion dropdown (this one's a panel, so borderline OK, but it's `shadow-lg` not the arbitrary panel shadow the header/command-menu use - inconsistent).
- `src/components/ui/nationality-picker.tsx` - also `shadow-lg` (same dropdown pattern, third spelling of "panel shadow").

**Why it's a problem.** Three different conventions for "panel shadow" (`shadow-lg`, `shadow-[0_20px_48px...]`, `shadow-[0_24px_80px...]`) plus resting/hover shadows on cards and buttons that the redesign doc explicitly rejected. The intent ("lines over shadows") isn't encoded anywhere a developer is forced to follow it.

### 4. Radius drift

`DESIGN.md:140` documents the rule precisely: **nav chips `rounded-md`, cards `rounded-2xl`, all buttons + pills `rounded-full`.**

**Evidence of mismatches**

- **Buttons:** `DESIGN.md:140` says buttons = `rounded-full`. `src/components/ui/button.tsx:48` uses `rounded-lg`. (And `docs/redesign-2026-q2.md:132` says "keep buttons at 8px" = `rounded-lg`. So the two design docs disagree with each other - the spec itself is drifted.)
- **Cards:** `DESIGN.md:140` says cards = `rounded-2xl` (16px). `src/components/ui/card.tsx:12` uses `rounded-md` (6px). `docs/redesign-2026-q2.md:132` says drop big cards to `rounded-md`. Again the docs contradict; the component followed the redesign doc, not `DESIGN.md`.
- **Badges:** `Badge` is `rounded-sm` (`badge.tsx:28`) while every other pill in the system is `rounded-full`.
- **Repo-wide radius spread** (`rg -o 'rounded-...'`): `rounded-full` 212, `rounded-md` 136, `rounded-xl` 101, `rounded-2xl` 26, `rounded-lg` 13, `rounded-sm` 9, `rounded-[2rem]` 3, `rounded-3xl` 2. The presence of `rounded-[2rem]` (`spaces-map.tsx:90` and 2 others) and `rounded-3xl` directly violates `DESIGN.md:140`'s scale and `redesign-2026-q2.md:36` ("32px+ radii read dated").

**Why it's a problem.** `DESIGN.md` and `docs/redesign-2026-q2.md` give *contradictory* radius rules (buttons full vs 8px; cards 2xl vs md). Components picked one or the other inconsistently, so there's no single answer to "what radius is a card?" The arbitrary `rounded-[2rem]` values are off any scale entirely.

### 5. Spacing: no documented scale, ad-hoc padding everywhere

**Evidence**

- `DESIGN.md:132-141` documents spacing only as *ranges* ("card padding `p-5` to `p-8`", "section padding `py-20` to `py-28`") - not a token scale. `tailwind.config.ts` defines **no `spacing` extension** (only `maxWidth.prose`), so everything falls back to Tailwind defaults plus arbitrary values.
- Card padding is inconsistent vs the documented `p-5`-`p-8` range: `card.tsx:12` hardcodes `p-6`, but `neighborhood-stat-card.tsx:76` uses `p-6`, `surprise-event-waitlist.tsx:121` uses `p-6 ... sm:p-10` (outside the range).
- Badge padding is fully ad-hoc across the four components (`px-2 py-0.5`, `px-2.5 py-0.5`, `px-1.5 py-0.5`, `px-2.5 py-1`) with no shared scale - see issue #2.

**Why it's a problem.** "Card padding p-5 to p-8" isn't a rule, it's a range, so reviewers can't catch a `p-10` card. There's no spacing token a developer can reach for, so they reach for arbitrary values.

---

## Proposed standardization (DEFERRED - not executed)

### (a) Single unified Badge API

Collapse the four components into one `Badge` primitive backed by tone tables. Sketch:

```tsx
// src/components/ui/badge.tsx (proposed)
type BadgeTone = "neutral" | "gold" | "rose" | "moss" | "sky";
type BadgeSize = "sm" | "md";

interface BadgeProps {
  tone?: BadgeTone;        // colour, from a single TONE map (cinematic tokens)
  size?: BadgeSize;        // sm | md - one shared padding scale
  shape?: "pill" | "tag";  // pill = rounded-full (default), tag = rounded-md
  mono?: boolean;          // font-mono uppercase tracking (role/verification look)
  icon?: ReactNode;        // leading glyph (flag emoji, ✓, ★, ●)
  children: ReactNode;
}
```

- One `TONE: Record<BadgeTone, {bg; text; ring}>` map (cinematic tokens only) replaces the three scattered colour sources (`badge.tsx` inline, `ROLE_TONE`, `VERIFICATION_TONE`, `flag-badge.tsx` inline).
- `RoleBadge`/`VerificationBadge`/`FlagBadge` become thin wrappers that map their domain enum to `tone`/`icon` and render `<Badge>` - or are deleted and callers use `<Badge>` directly.
- One radius (`rounded-full` for pills, `rounded-md` only when `shape="tag"`), one `size` scale shared by all. Kills the `rounded-sm` outlier and the divergent sm-padding values.

### (b) Legacy -> cinematic token migration map

Every legacy class maps to a theme-aware cinematic alias. (`primary-*` was warm-dusk red; per `DESIGN.md:18-20` red is no longer a brand colour, so primary maps to `gold`/`rose` by role, not by hue.)

| Legacy token | Cinematic replacement | Notes |
|---|---|---|
| `bg-primary-600` / `bg-primary-500` (CTA fill) | `bg-gold text-deep-water` | Primary CTA is gold per `DESIGN.md:48` |
| `text-primary-700` / `text-primary-800` | `text-gold-ink` (on cream) / `text-gold` (on deep-water) | Use `-ink` variant on light surfaces for WCAG (`globals.css:35-37`) |
| `border-primary-300` / `ring-primary-*` | `border-gold/40` / `focus-visible:ring-gold` | Matches `DESIGN.md:191` focus-ring rule |
| `bg-primary-50` / `bg-primary-100` (tint) | `bg-gold/10` / `bg-rose/10` | Pick gold vs rose by role |
| `secondary-*` (slate) | `ink-2` / `ink-3` / `paper-mute` | Map by use: surface->`ink-2`, border->`ink-3`, muted text->`paper-mute` |
| `accent.coral` (`#e74c3c`) | `rose` | |
| `accent.warm` (`#f39c12`) | `gold` | |
| `accent.green` (`#27ae60`) | `moss` / `moss-ink` | `-ink` on light surfaces |
| `surface.light` (`#ffffff`) | `ink-2` (light mode = white) | Already what `--ink-2` resolves to |
| `surface.dark` (`#1a1612`) | `ink-1` | Replaces the `#1a1612` hex literal (12 occurrences) |

After migration, the four legacy ramp objects at `tailwind.config.ts:14-48` get deleted.

### (c) Proposed ESLint guard: no raw hex in `className`

There's already a precedent: `eslint.config.mjs:49-61` uses `no-restricted-syntax` with a `Literal` selector to ban em dashes. Add a sibling rule (scoped to `src/**/*.{ts,tsx}`) that flags six-digit hex inside JSX class strings:

```js
{
  selector: "JSXAttribute[name.name='className'] Literal[value=/#[0-9a-fA-F]{6}/]",
  message: "No raw hex in className. Use a palette token (gold, rose, ink-*, paper*) - see DESIGN.md and tailwind.config.ts.",
},
{
  selector: "JSXAttribute[name.name='className'] TemplateElement[value.cooked=/#[0-9a-fA-F]{6}/]",
  message: "No raw hex in className. Use a palette token - see DESIGN.md.",
},
```

This catches the **429 raw-hex `className` occurrences** found today (`#1a1612` x12, `#5d6d7e` x43, `#99a3ad` x51, `#06101f` x31, etc.). Roll out as `warn` first, fix the backlog, then flip to `error`. The same selector approach can later guard against `primary-`/`secondary-` ramp usage once issue (b) is migrated.

### (d) Shadow + radius standardization rules

**Shadow.** Encode "lines over shadows" as named utilities in `globals.css` so there's one spelling each:

- `.shadow-panel` - the dropdown/modal shadow (replaces the three ad-hoc `shadow-[0_20px_48px...]` / `shadow-[0_24px_80px...]` / `shadow-lg` spellings on header, command-menu, language-switcher, pickers).
- No shadows on cards or buttons. Card hover = `hover:-translate-y-0.5` + `hover:border-*` only (drop `hover:shadow-[...]` at `card.tsx:14`). Remove the baked button shadow at `button.tsx:16`.
- An ESLint `shadow-[` guard (same `no-restricted-syntax` pattern) outside the allow-listed overlay components.

**Radius.** First **reconcile the two design docs** - `DESIGN.md:140` and `docs/redesign-2026-q2.md:132` disagree on buttons (full vs 8px) and cards (2xl vs md). Pick one and update both docs. Then encode the agreed scale as a comment block in `tailwind.config.ts` and a lint allow-list:

- Permit only `rounded-{md,lg,xl,2xl,full}`. Ban `rounded-[2rem]`, `rounded-3xl`, `rounded-sm` (the badge outlier) via lint.
- nav chips `rounded-md`, cards one agreed value, buttons + all pills `rounded-full`, badges -> the unified `Badge` shape prop.

---

## Prioritized refactor checklist - DEFERRED (nothing below has been executed)

### P0 - correctness / brand integrity

- [ ] Reconcile `DESIGN.md` vs `docs/redesign-2026-q2.md` on button + card radius (they currently contradict). Pick one truth.
- [ ] Migrate `src/components/ui/button.tsx` off `primary-*` to `gold` (primary CTA), per migration map (b). Removes the off-palette red from the most-used primitive.
- [ ] Add the raw-hex ESLint guard (c) at `warn`. Surfaces the 429-occurrence backlog without breaking CI.

### P1 - consolidation

- [ ] Build the unified `Badge` API (a); convert `RoleBadge`/`VerificationBadge`/`FlagBadge` to wrappers or call sites. Fixes radius + palette + sizing divergence (issue #2, #4).
- [ ] Migrate `src/components/ui/card.tsx`, `location-picker.tsx`, `neighborhood-stat-card.tsx` off `primary-*` (map b).
- [ ] Add `.shadow-panel` utility; strip card/button shadows (d). Card hover -> translate-y only.
- [ ] Sweep the top-volume legacy-token files (`spaces-directory.tsx` 23, `first-week-planner.tsx` 20, `relocation-agent-result.tsx` 18) using map (b).

### P2 - cleanup / hardening

- [ ] Delete the `primary`/`secondary`/`accent`/`surface` ramps from `tailwind.config.ts:14-48` once usage hits zero.
- [ ] Burn down the 429 raw-hex `className` literals; flip the hex ESLint rule to `error`.
- [ ] Add the `rounded-[...]` / `rounded-3xl` / `rounded-sm` lint guard; remove `rounded-[2rem]` from `spaces-map.tsx:90` and the two other arbitrary-radius spots.
- [ ] Document a real spacing scale (or at least tighten `DESIGN.md:132-141` ranges into rules a reviewer can enforce).
- [ ] Adopt `text-gold-ink`/`text-terracotta-ink`/`text-moss-ink` on light-surface text (only 12 adoptions today vs 21 raw `text-gold` uses) to hold WCAG AA per `globals.css:30-37`.
