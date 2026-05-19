# Design System

The visual identity for the Istanbul Nomads website. Editorial · cinematic ·
warm. Reads like a magazine that happens to be a community platform.

> Product context for these choices lives in [PRODUCT.md](PRODUCT.md).
> Brand voice and writing rules live in [CLAUDE.md](CLAUDE.md). Image rules
> live in [docs/visual-identity.md](docs/visual-identity.md).

---

## Design Principles

1. **Editorial over template.** Italic serif accents, hairline rules,
   numbered eyebrows. The site looks like an issue, not a SaaS dashboard.
2. **Place-first.** The city is the picture. Map textures, hood names,
   coords (where they actually mean something) all anchor copy to Istanbul.
3. **One accent at a time.** Gold is the live/active colour. Rose is the
   secondary accent. Moss-green only for "alive" / "online". Never all
   three competing in the same eyeshot.
4. **Quiet chrome, loud content.** Nav and footer go grey-mute; headlines
   and the live pip get the typography budget.
5. **Honest data.** Empty states say "no plans yet" or render `—`. We
   don't pad with fake counts.

---

## Color Palette

Backed by CSS custom properties in
[src/styles/globals.css](src/styles/globals.css). Stored as space-separated
RGB channels so Tailwind's `/<alpha-value>` modifier works
(`bg-deep-water/50`, `text-gold/70`, etc.). Token names are stable; flipping
between dark and light modes swaps the values, not the references.

### Cinematic palette (canonical)

| Token | Hex (dark mode) | Hex (light mode) | Role |
|---|---|---|---|
| `--ink-0` / `bg-deep-water` | `#06101f` | `#f6ecd9` | Canvas |
| `--ink-1` | `#0a1a2f` | `#f0e4cd` | Surface |
| `--ink-2` | `#13294a` | `#ffffff` | Raised surface |
| `--ink-3` | `#1e385c` | `#decdb2` | Border |
| `--paper` / `text-cream` | `#f6ecd9` | `#06101f` | Primary text |
| `--paper-dim` | `#d9cfba` | `#12213b` | Secondary text |
| `--paper-mute` | `#a89e8a` | `#3c4e69` | Muted text |
| `--paper-faint` | `#70685a` | `#708098` | Faint text |
| `--ferry-yellow` / `text-gold` / `bg-gold` | `#f4b860` | `#f4b860` | **Live · active · primary CTA** |
| `--terracotta` / `text-rose` / `bg-rose` | `#e87a5d` | `#e87a5d` | Secondary accent, focused-hood ring |
| `--moss` / `text-moss` | `#86efac` | `#86efac` | "Live" / "online" / "open seat" only |

### Semantic aliases (use these in JSX)

Wired in [tailwind.config.ts](tailwind.config.ts). Always prefer the alias
over a raw hex — that way the dark/light swap stays automatic.

```html
<div class="bg-deep-water text-cream">
  <h1 class="font-editorial">
    Welcome <em class="italic text-gold">back</em>
  </h1>
  <button class="bg-gold text-deep-water">Sign in</button>
  <span class="text-rose">Live</span>
</div>
```

### What's gone

The old `primary` blue ramp (`#3b82f6` → `#1e3a8a`), the warm-dusk
terracotta `#c0392b`, and the slate `bosphorus` `#526e89` were replaced in
the v3.6.0 palette migration. The token *names* `terracotta` and
`bosphorus` still exist (so old components don't break), but they now
resolve to the cinematic palette values above. Treat the legacy names as
deprecated; new code should use `gold` / `rose` / `deep-water` / `cream`.

---

## Typography

Backed by `next/font/google` in
[src/app/[locale]/layout.tsx](src/app/[locale]/layout.tsx). All families are
loaded with `display: "optional"` (or `"swap"` for the editorial faces) so
LCP never regresses from a font swap.

| Family | CSS var | Tailwind class | When to use |
|---|---|---|---|
| **Instrument Serif** | `--font-editorial` | `font-editorial` | Headlines, italic-gold accents, "Now Live" callouts. Single weight 400 + italic. |
| **Space Grotesk** | `--font-grotesk` | `font-grotesk` | Body sans on Members + Today + Plans editorial surfaces. Weights 400/500/600/700. |
| **Fraunces** | `--font-display` | `font-display` | Legacy display serif (homepage Three Doors, About, Footer headlines). Weights 300/400/500. |
| **Geist** | `--font-sans` | `font-sans` | Default body sans on all non-editorial surfaces. |
| **JetBrains Mono** | `--font-mono` | `font-mono` | Eyebrows ("N° 01"), kbd hints (⌘K), tabular numbers, coords. |
| **Bon (Pro)** | `--font-fa` | (auto via `lang^="fa"`) | Persian-optimised display, self-hosted. |
| **Noto Sans Arabic** | `--font-ar` | (auto via `lang^="ar"`) | Arabic display. |

### Why the editorial-vs-default split

- The **hero**, the **Members directory** (`/members`), the **Today board**
  (`/today`), and the **Plans landing** (`/plans`) lean on the editorial
  pair (Instrument Serif + Space Grotesk) because they're the engagement
  surfaces and the magazine cover feeling matters.
- Every other page uses Fraunces + Geist — same product, more utility.

Don't change a page's font stack without good reason; flipping between the
two register reads as inconsistency.

### Type scale

Lives in `theme.extend.fontSize` in
[tailwind.config.ts](tailwind.config.ts). Highlights:

| Token | Size | Used on |
|---|---|---|
| `text-display-2xl` | 9.25rem / 300 | Hero pages where the page IS the headline |
| `text-display-xl` | 6.75rem / 300 | "Today's plans" page hero |
| `text-display-lg` | 5rem / 300 | Section heroes |
| `text-h1` | 3.5rem / 400 | Page titles |
| `text-h2` | 2.375rem / 400 | Section heads |
| `text-h3` | 1.75rem / 400 | Card titles |
| `text-h4` | 1.375rem / 500 | Sub-section |
| `text-lede` | 1.1875rem | Lede paragraphs |
| `text-body` | 1rem | Body |
| `text-meta` | 0.8125rem | Meta info |
| `text-eyebrow` | 0.6875rem / 500 / `0.35em` tracking | Numbered eyebrows ("N° 04 · MEMBERS") |

Italic-gold accent rule: when an Instrument Serif headline has a
two-or-three-word noun phrase that ties the sentence together (e.g. "What
are nomads *up to* in Istanbul today?"), wrap the noun phrase in
`<em class="italic text-gold">`. This is the brand's signature.

---

## Spacing & Radii

| Token | Value | Use |
|---|---|---|
| Section vertical padding (md+) | `py-20` to `py-28` | Page sections |
| Card padding | `p-5` to `p-8` | Plan cards, member rows, perks |
| Container max-width | 1320–1360px | Header, footer, page sections |
| Container inline padding | `clamp(16px, 2.5vw, 32px)` | Page edges |
| Rounded utility | `rounded-md` (6px), `rounded-lg` (8px), `rounded-xl` (12px), `rounded-2xl` (16px), `rounded-full` (pills) | Match radius to scale: nav chips `rounded-md`, cards `rounded-2xl`, all buttons + pills `rounded-full` |
| Hairline | `0.5px solid rgba(246, 236, 217, 0.10)` | Dividers between editorial blocks. |

No drop shadows on dark surfaces — use hairline borders + backdrop blur
instead. Drop shadows are reserved for dropdown panels and modals.

---

## Shared UI atoms

Live in [src/components/ui/](src/components/ui/). Use these — don't redo them.

| Atom | File | What it does |
|---|---|---|
| `Avatar` / `AvatarStack` | [avatar.tsx](src/components/ui/avatar.tsx) | Gradient-backed circle with optional photo + live dot. Stable hue-per-name fallback. |
| `Eyebrow` | [eyebrow.tsx](src/components/ui/eyebrow.tsx) | Hairline + uppercase label + optional kicker. Used on every editorial surface. |
| `Chip` | [chip.tsx](src/components/ui/chip.tsx) | Pill-shape filter chip. `active` flips to colored variant. |
| `LivePip` | [live-pip.tsx](src/components/ui/live-pip.tsx) | "● 13 plans on the board · live" pip — pulses subtly via CSS keyframes. |
| `Container` | [container.tsx](src/components/ui/container.tsx) | Page-edge container. |
| `SectionEyebrow` | [section-eyebrow.tsx](src/components/ui/section-eyebrow.tsx) | Numbered section eyebrow ("N° 04 · MEMBERS"). |

---

## Nav system

Two surfaces share a single source of truth in
[src/lib/constants.ts](src/lib/constants.ts) (`navItems` array). Both
render the same items in the same order with the same hrefs:

- **Global Header** [src/components/layout/header.tsx](src/components/layout/header.tsx)
  — sticky, on every non-home route.
- **Hero brand bar** [src/components/sections/home/hero-live/hero-frame.tsx](src/components/sections/home/hero-live/hero-frame.tsx)
  — on `/` only, overlaid on the cinematic map.

Items: **Today · Map · Events · Members · Perks** (flat icon destinations)
+ **Explore ▾ · Community ▾** (rich dropdowns with label + description per
child).

Active state: gold-tint background + gold-coloured icon in the global
Header; glowing gold dot under the label on the hero brand bar.
`aria-current="page"` on the active link. Count pills on Events + Perks
(hidden at 0, capped at 99+) are server-fetched via `getNavCounts()`.

The hero brand bar drops the ⌘K search pill (the hero already has its own
primary CTAs) but otherwise matches the Header's content + interaction.

---

## Accessibility

- All interactive elements have a visible focus ring
  (`focus-visible:ring-2 focus-visible:ring-gold focus-visible:outline-none`).
- `prefers-reduced-motion: reduce` pauses the hero camera tour, the live
  pip blink, and the nomad-avatar drift animations.
- All text on `bg-deep-water` clears WCAG AA at minimum.
- RTL (Arabic, Persian) is supported via `dir="rtl"` on `<html>` +
  logical-property utilities (`ps-*`, `pe-*`, `me-*`) where layout direction
  matters. Lucide icons that are directional (`arrow-right`, etc.) get
  flipped via a safelisted CSS rule in
  [globals.css](src/styles/globals.css).

---

## Image rules (summary)

Full visual identity bible: [docs/visual-identity.md](docs/visual-identity.md).
Short version:

- One accent colour per frame (gold or rose, not both)
- Golden-hour light only — no cold blue-grey
- No baked text on images (the typography is the text)
- Anonymous humans, lived-in interiors
- Real Istanbul, not stock skyline

---

## What changed and when

- **v3.6.0** (2026-05-17) — palette migrated site-wide from warm-dusk
  (terracotta + bosphorus + ferry-yellow) to cinematic deep-water + cream
  + gold + rose. Token names stayed stable so existing components shifted
  automatically.
- **v3.7.0** (2026-05-18) — Instrument Serif (editorial display) and
  Space Grotesk (Members + Today body) joined the font stack. Workspace
  nav replaced the previous About/Explore/Community/Contact mix. AmbientBar
  removed, hero category legend + coords removed, ⌘K Search pill kept on
  Header only.

See [CHANGELOG.md](CHANGELOG.md) for the full per-release detail.
