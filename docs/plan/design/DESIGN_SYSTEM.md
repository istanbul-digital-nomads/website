# Design System v2

The visual identity for istanbulnomads.com - editorial-product hybrid with ambient signals, real Istanbul soul, and operational confidence on product surfaces.

> "Ambient Tech with Istanbul Soul" - a publication that ships product, not a product that runs a blog.

This document supersedes the old `DESIGN.md`. Source of truth lives here.

---

## 1. Principles

1. **Editorial first, product second.** Display serifs, asymmetric grids, real photography. The site reads like Issue N° 48 of a publication, not a landing-page template.
2. **Ambient over decorative.** Live data (time, weather, ferry, FX, members online) is woven into the chrome. No decorative blobs, mesh gradients, or bouncing elements.
3. **Operational where it matters.** Monospace numbers, command palette, terminal-style ledgers on product surfaces (dashboard, perks, planner output).
4. **Made in Kadikoy.** The voice is local. "Walter's at 10:30" beats "discover the magic of Istanbul" every time.
5. **Dark-mode native.** Light mode exists, but the default is warm dark - a Kadikoy evening, not a SaaS landing page.

---

## 2. Color

### Brand primitives (real, from `tailwind.config.ts`)

| Token             | Hex       | Tailwind                | Use                                           |
| ----------------- | --------- | ----------------------- | --------------------------------------------- |
| `primary`         | `#c0392b` | `primary-500`           | Buttons, links, primary CTAs                  |
| `primary-hover`   | `#a93226` | `primary-600`           | Hover / pressed                               |
| `primary-bright`  | `#e74c3c` | `primary-300`           | Highlights only (badges, dots)                |
| `secondary`       | `#2c3e50` | `secondary-500`         | Secondary surfaces, info badges               |
| `secondary-light` | `#526e89` | `secondary-400`         | Text on dark, secondary accents               |
| `accent-warm`     | `#f39c12` | `accent-warm`           | Tertiary highlights, time-of-day dawn         |
| `accent-coral`    | `#e74c3c` | `accent-coral`          | Coral, same as primary-bright                 |
| `accent-green`    | `#27ae60` | `accent-green`          | Success, "open to coffee", live indicators    |

### Ink + paper scale (extend Tailwind)

Add these to `tailwind.config.ts`:

```ts
ink: {
  0: "#0d0a08",   // void
  1: "#1a1612",   // canvas (the existing surface-dark)
  2: "#221d18",   // surface
  3: "#2c2620",   // raised
  4: "#3a322a",   // hairline / border
  5: "#4d433a",   // muted border
},
paper: {
  DEFAULT: "#f4ead7", // primary text on dark
  dim:   "#d9cfba",
  mute:  "#a39c8b",
  faint: "#6f6a5e",
},
```

Use `text-paper`, `text-paper-mute`, `bg-ink-1`, `border-ink-3` etc.

### Time-of-day accent

The page's accent dot shifts with Istanbul's actual local time:

| Time-of-day  | Hours       | Accent dot         |
| ------------ | ----------- | ------------------ |
| Dawn         | 05:00-09:00 | `#f39c12` (amber)  |
| Midday       | 09:00-17:00 | `#f4ead7` (paper)  |
| Dusk         | 17:00-21:00 | `#c0392b` (red)    |
| Night        | 21:00-05:00 | `#526e89` (blue)   |

Implement as a CSS class added to `<body>` from a server component that knows the time:

```css
.tod-dawn   { --tod-accent: theme('colors.accent.warm'); }
.tod-midday { --tod-accent: theme('colors.paper.DEFAULT'); }
.tod-dusk   { --tod-accent: theme('colors.primary.500'); }
.tod-night  { --tod-accent: theme('colors.secondary.400'); }
```

Then `bg-[var(--tod-accent)]` for the live indicator dots throughout.

---

## 3. Type

### Font stack

| Role     | Family            | Weights      | Use                                           |
| -------- | ----------------- | ------------ | --------------------------------------------- |
| Display  | **Fraunces**      | 300, 400, 500 | Hero headlines, section titles, pull-quotes  |
| Sans     | **Geist**         | 400, 500, 600 | UI, body, navigation                         |
| Mono     | **JetBrains Mono**| 400, 500     | Eyebrows, numbers, timestamps, code, data    |
| RTL      | **Vazirmatn**     | 300, 400, 500 | Persian (FA) + Arabic (AR) content           |

Load via `next/font/google` in `src/app/layout.tsx`:

```ts
import { Fraunces, Geist, JetBrains_Mono, Vazirmatn } from "next/font/google";

const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-display", weight: ["300","400","500"] });
const geist    = Geist({    subsets: ["latin"], variable: "--font-sans",    weight: ["400","500","600"] });
const mono     = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", weight: ["400","500"] });
const vazir    = Vazirmatn({ subsets: ["arabic"], variable: "--font-rtl",  weight: ["300","400","500"] });

<html className={`${fraunces.variable} ${geist.variable} ${mono.variable} ${vazir.variable}`}>
```

Update `tailwind.config.ts`:

```ts
fontFamily: {
  sans:    ["var(--font-sans)", "system-ui", "sans-serif"],
  display: ["var(--font-display)", "Georgia", "serif"],
  mono:    ["var(--font-mono)", "monospace"],
  rtl:     ["var(--font-rtl)", "system-ui"],
},
```

### Type scale

| Tailwind class      | Px / line-height | Use                              |
| ------------------- | ---------------- | -------------------------------- |
| `text-display-2xl`  | 148 / 0.9        | Homepage hero                    |
| `text-display-xl`   | 108 / 0.92       | Section openers                  |
| `text-display-lg`   | 80 / 0.95        | Strong H2                        |
| `text-h1`           | 56 / 1.0         | Page titles                      |
| `text-h2`           | 38 / 1.05        | Section headings                 |
| `text-h3`           | 28 / 1.1         | Card titles                      |
| `text-h4`           | 22 / 1.15        | Subsection                       |
| `text-lede`         | 19 / 1.45        | Lead paragraph (serif, italic ok)|
| `text-body`         | 16 / 1.55        | Body                             |
| `text-meta`         | 13 / 1.5         | Captions, secondary              |
| `text-mono`         | 11 / 1.5, 0.06em | Eyebrows, status, timestamps     |

Add to `tailwind.config.ts`:

```ts
fontSize: {
  "display-2xl": ["9.25rem", { lineHeight: "0.9",  letterSpacing: "-0.045em", fontWeight: "300" }],
  "display-xl":  ["6.75rem", { lineHeight: "0.92", letterSpacing: "-0.04em",  fontWeight: "300" }],
  "display-lg":  ["5rem",    { lineHeight: "0.95", letterSpacing: "-0.035em", fontWeight: "300" }],
  h1:    ["3.5rem", { lineHeight: "1",    letterSpacing: "-0.03em",  fontWeight: "400" }],
  h2:    ["2.375rem", { lineHeight: "1.05", letterSpacing: "-0.025em", fontWeight: "400" }],
  h3:    ["1.75rem", { lineHeight: "1.1",  letterSpacing: "-0.02em",  fontWeight: "400" }],
  h4:    ["1.375rem",{ lineHeight: "1.15", letterSpacing: "-0.015em", fontWeight: "500" }],
  lede:  ["1.1875rem", { lineHeight: "1.45" }],
  body:  ["1rem", { lineHeight: "1.55" }],
  meta:  ["0.8125rem", { lineHeight: "1.5" }],
  mono:  ["0.6875rem", { lineHeight: "1.5", letterSpacing: "0.06em" }],
},
```

### Type rules

- Display headlines: `font-display font-light` (300 weight) with italic Fraunces for editorial accents
- Body: `font-sans`
- Numbers, timestamps, status: `font-mono uppercase tracking-wider tabular-nums`
- Mix Latin and Vazirmatn directly in the same paragraph for multilingual moments - no need to wrap each in different containers
- `text-wrap: pretty` on display headlines (Tailwind 3.4+)

---

## 4. Spacing + Radius + Motion

### Spacing (default Tailwind, opinionated stops)

- `gap-2 gap-3 gap-4` for tight UI clusters
- `gap-6 gap-8` for card groups
- `gap-12 gap-16 gap-24` between editorial sections
- Section vertical rhythm: `py-32` desktop, `py-16` mobile

### Radius (restrained)

- **`rounded-none`** (default for most things - tables, cards, photo slots)
- `rounded-sm` (2px) - small chips and inputs
- `rounded-full` - tags only, avatars
- **Never** `rounded-xl` or larger on functional UI - that's SaaS-template territory

### Motion

- Easing: `cubic-bezier(0.2, 0.7, 0.3, 1)` (add to Tailwind as `ease-soft`)
- Durations: `duration-150` hover, `duration-300` open/close, `duration-500` fade-ins
- One animated signal per page max (the ferry crossing the Bosphorus header)
- No parallax, no scroll-triggered cascades, no bouncing

---

## 5. Components

### AmbientBar (new, top of every page)

Renders the living signals: time, weather, ferry status, FX, members online. Server-rendered with revalidation every 60s.

```tsx
// src/components/layout/AmbientBar.tsx
export async function AmbientBar() {
  const [time, weather, ferry, fx, online] = await Promise.all([
    getIstanbulTime(),
    getWeather(),       // OpenWeather or Open-Meteo
    getFerryStatus(),   // sehirhatlari.istanbul scrape OR static schedule
    getFxRate(),        // exchangerate.host
    getOnlineMembers(), // Supabase RPC
  ]);
  return (
    <div className="grid grid-cols-[auto_auto_auto_auto_auto_1fr_auto] items-stretch border-b border-ink-3 bg-ink-0 font-mono text-[11px] uppercase tracking-wider text-paper-mute">
      <Cell><Dot color="green" /> LIVE FROM KADIKOY</Cell>
      <Cell><span className="text-paper tabular-nums">{time}</span> UTC+3</Cell>
      <Cell>{weather.temp}° <Dot color="var(--tod-accent)" /> {weather.label}</Cell>
      <Cell>FERRY <span className="text-paper">{ferry.route}</span> <span className="text-accent-warm">↗ {ferry.next}</span></Cell>
      <Cell>1 USD <span className="text-paper tabular-nums">₺{fx.usdTry}</span></Cell>
      <div />
      <Cell><Dot color="green" /> {online} online</Cell>
    </div>
  );
}
```

Total height: 38px. Sticks to top above the main nav.

### NavBar

Logo on the left (existing logo in `public/images/logo-*.png` stays). Center nav: Guides · Neighborhoods · Planner · Events · Members · Perks · Circles. Right: search button with ⌘K affordance, language switcher (EN · TR · FA · AR · RU), Telegram button, Sign-in.

### Command-K menu (new)

Global search overlay triggered by `⌘K` / `Ctrl-K`. Searches pages, members, events, perks, guides. See `CommandK.tsx` reference in `homepage-v2.jsx`.

Stack: `cmdk` package (Vercel's) + Supabase full-text search across `members`, `events`, `guides`.

### Button variants

```tsx
// Primary - bg primary-500
className="bg-primary-500 text-ink-0 hover:bg-primary-600 px-7 py-4 font-medium text-sm transition-colors duration-150 rounded-none"

// Paper (high-contrast secondary)
className="bg-paper text-ink-0 hover:bg-paper-dim px-7 py-4 font-medium text-sm"

// Outline (tertiary)
className="border border-ink-4 text-paper hover:border-paper-mute px-7 py-4 text-sm"

// Pill (filter chips)
className="border border-ink-4 text-paper-mute hover:text-paper hover:border-paper-mute px-4 py-2 rounded-full text-xs"
```

### Tag

```tsx
<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-ink-4 font-mono uppercase tracking-wide text-[10.5px] text-paper-mute">
  Ferry-first
</span>
```

### Card

Replace the rounded-lg cards in the existing repo with **rectangular** dark cards:

```tsx
<div className="bg-ink-2 border border-ink-3 p-8">
  ...
</div>
```

No hover shadow on dark surfaces. Hover state is a subtle border color shift: `hover:border-paper-mute/30`.

### Photo slot (atmospheric placeholder until real photo)

```tsx
<figure className="relative overflow-hidden bg-ink-2 border border-ink-4 [background:repeating-linear-gradient(90deg,rgba(244,234,215,0.04)_0_1px,transparent_1px_14px),repeating-linear-gradient(0deg,rgba(244,234,215,0.03)_0_1px,transparent_1px_14px),linear-gradient(135deg,#1a3550,#221d18)]">
  <span className="absolute top-3 left-3 font-mono text-[10px] uppercase text-paper-dim">{corner}</span>
  <figcaption className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-ink-0/85 to-transparent flex justify-between font-mono text-[10px] uppercase text-paper-dim">
    <span>{caption}</span><span>↳ photo slot</span>
  </figcaption>
</figure>
```

When real photo arrives, swap the gradient `[background:...]` for a `next/image` fill.

### Section eyebrow

```tsx
<div className="flex items-center gap-3.5 mb-12">
  <span className="font-mono text-[11px] text-primary-500">N° 02</span>
  <span className="inline-block h-px w-7 bg-primary-500" />
  <span className="font-mono text-[11px] uppercase tracking-wider text-paper-mute">{label}</span>
  {kicker && <span className="font-mono text-[11px] text-paper-faint">· {kicker}</span>}
</div>
```

### Data row (events, members, perks lists)

Always wider than a card. Use `grid` with named columns - the row is the unit, not the card.

```tsx
<a className="grid grid-cols-[auto_auto_auto_1fr_auto_auto_auto] gap-8 items-center px-7 py-5 border-b border-ink-3 hover:bg-ink-2 transition-colors">
  ...
</a>
```

---

## 6. Photo treatment

Real Istanbul photography only. No stock laptops-on-beaches, no bokeh coffee shots.

| Slot              | Aspect      | Sample subjects                                  |
| ----------------- | ----------- | ------------------------------------------------ |
| Homepage hero     | 16:9, full  | Kadikoy pier dawn, ferry departure               |
| Neighborhood lead | 16:10       | Coastline, a street, a market                    |
| Café detail       | 4:3         | Window seat, espresso machine, tulip-glass tea   |
| Event cover       | 16:9        | Last-event photo (not stock)                     |
| Member avatar     | 1:1, crop   | Real portrait, not corporate headshot            |

**Treatment:**
- Subtle film-grain overlay at 4-6% opacity (CSS noise SVG)
- Mono caption inside the photo at the bottom-left: place, date, photographer credit
- Corner mark top-left: section number or category, mono caps
- Never apply Instagram-style color filters

**Rotation:** the homepage hero cycles weekly through 4 photos. Members can submit.

---

## 7. Voice (from `CLAUDE.md`)

### Hard rules

- **No em dashes.** Ever. Use regular dashes or rephrase.
- **Contractions everywhere** in body copy. "Don't" not "do not."
- **Real prices** in both TL and USD (`₺28,500 ≈ $830 / month`).
- **Active voice.** "Buy an Istanbulkart" not "An Istanbulkart should be purchased."
- **Direct.** "Get a Turkcell SIM for 250 TL" not "Consider obtaining mobile connectivity."

### Banned words

- Marketing fluff: seamless, innovative, cutting-edge, world-class, leverage, utilize, facilitate, comprehensive, vibrant, curated, elevate, unlock
- Overused filler: real, fast, amazing, incredible, unique (avoid repeating; one use per page is fine)

### Voice markers we own

- "Made in Kadikoy"
- "ferry-first"
- "laptop-ready"
- "Asia base. Ferry reset. Evening table."
- Issue numbering ("Issue N° 48"), section numbering ("N° 02"), monospace data captions

---

## 8. Icons + iconography

Continue Lucide React. Stroke 1.5.

Avoid using **emoji as section icons** (the brand rule). For section markers, use:
- A short monospace label (`N° 03`)
- A horizontal rule (`<span className="h-px w-7 bg-primary-500" />`)
- A live dot for status

Custom marks acceptable:
- A small hand-drawn Bosphorus ink wave (SVG, in `public/marks/`)
- A pressed-stamp graphic for the Sunday letter masthead
- A simple ferry SVG for the moving Bosphorus header on the homepage

---

## 9. RTL / multilingual

- Persian (FA) and Arabic (AR) routes set `dir="rtl"` on `<html>` and use `font-rtl` (Vazirmatn)
- Lucide arrow icons get mirrored via a CSS rule on `.lucide-arrow-right` etc. (already in the codebase)
- Time, dates, FX numbers stay LTR even in RTL contexts (Western Arabic numerals, ferry times always `HH:MM` left-to-right)
- Test with `/fa` and `/ar` routes

---

## 10. Page surfaces (existing + new)

| Surface                  | Route                  | Status                                |
| ------------------------ | ---------------------- | ------------------------------------- |
| Homepage                 | `/`                    | Redesigned (Ambient + 3 doors)        |
| Guides index             | `/guides`              | Keep, restyle                         |
| Neighborhoods index      | `/guides/neighborhoods`| Redesigned (editorial list + map)     |
| Neighborhood detail      | `/guides/neighborhoods/[slug]` | Redesigned (Kadikoy as canonical) |
| First Week Planner       | `/tools/first-week-planner` | Output redesigned                |
| Events index             | `/events`              | Redesigned (populated case)           |
| Event detail (new)       | `/events/[slug]`       | New, with RSVP / ticketing            |
| Member dashboard (new)   | `/dashboard`           | New, behind auth                      |
| Member directory (new)   | `/members`             | New, opt-in public                    |
| Member profile (new)     | `/members/[handle]`    | New, opt-in public                    |
| Perks vault (new)        | `/perks`               | New, gated by Nomad+                  |
| Circle landing (new)     | `/circles/[slug]`      | New, six circles                      |
| Sunday letter archive    | `/letter`              | Keep, restyle                         |
| Nomad Spaces directory   | `/spaces`              | Keep (the verified coworking surface) |
| Path to Istanbul         | `/path-to-istanbul`    | Keep, restyle                         |

See `IMPLEMENTATION.md` for the migration order.

---

## 11. What survives, what retires

**Survives:**
- Brand voice ("Made in Kadikoy," "ferry-first," "Asia base / Ferry reset / Evening table")
- Multilingual + hreflang structure
- `llms.txt` + OpenAPI surface (must remain crawlable)
- Telegram as the primary community CTA
- The Sunday letter cadence
- The Matcher signal language (Quiet routine, Social momentum, Ferry-first, etc.)
- The Week 1 / Month 1 / Month 3+ progression metaphor

**Retires:**
- Stats-with-icons triplet blocks ("Reliable workdays / Low-friction onboarding / Better local texture")
- Card-grid neighborhood layout (replaced by editorial list)
- Common-questions FAQ stack on the homepage (moved into individual guide pages)
- Generic dark-mode landing-page gradients
- Emoji as section icons
- Stock photography of any kind
