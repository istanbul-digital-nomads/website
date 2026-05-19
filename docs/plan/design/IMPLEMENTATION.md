# Implementation Plan

How to migrate the existing istanbulnomads.com codebase (Next.js 14 App Router + Tailwind + Supabase) to the v2 design system. Designed to ship in phases without blocking each other.

> **Stack confirmed:** Next.js 14 (App Router), Tailwind CSS, Supabase, MDX for content, Inter currently as primary font. See `ARCHITECTURE.md` in this repo.

---

## Phase 0 - Foundations (one PR, no visible changes yet)

Patches to ship before any page is touched. After this PR, everything still looks the same but the new tokens are available.

### `tailwind.config.ts` - extend the brand

```ts
// Replace the existing `theme.extend` with:
theme: {
  extend: {
    colors: {
      // Keep the existing primary/secondary/accent definitions.
      primary: { /* unchanged */ },
      secondary: { /* unchanged */ },
      accent: { /* unchanged */ },

      // ADD:
      ink: {
        0: "#0d0a08",
        1: "#1a1612", // matches existing surface-dark
        2: "#221d18",
        3: "#2c2620",
        4: "#3a322a",
        5: "#4d433a",
      },
      paper: {
        DEFAULT: "#f4ead7",
        dim:   "#d9cfba",
        mute:  "#a39c8b",
        faint: "#6f6a5e",
      },
    },
    fontFamily: {
      sans:    ["var(--font-sans)",    "system-ui", "sans-serif"],
      display: ["var(--font-display)", "Georgia",   "serif"],
      mono:    ["var(--font-mono)",    "monospace"],
      rtl:     ["var(--font-rtl)",     "system-ui"],
    },
    fontSize: {
      // Keep existing display-* / h* keys but REWEIGHT to 300:
      "display-2xl": ["9.25rem", { lineHeight: "0.9",  letterSpacing: "-0.045em", fontWeight: "300" }],
      "display-xl":  ["6.75rem", { lineHeight: "0.92", letterSpacing: "-0.04em",  fontWeight: "300" }],
      "display-lg":  ["5rem",    { lineHeight: "0.95", letterSpacing: "-0.035em", fontWeight: "300" }],
      h1:    ["3.5rem",   { lineHeight: "1",    letterSpacing: "-0.03em",  fontWeight: "400" }],
      h2:    ["2.375rem", { lineHeight: "1.05", letterSpacing: "-0.025em", fontWeight: "400" }],
      h3:    ["1.75rem",  { lineHeight: "1.1",  letterSpacing: "-0.02em",  fontWeight: "400" }],
      h4:    ["1.375rem", { lineHeight: "1.15", letterSpacing: "-0.015em", fontWeight: "500" }],
      lede:  ["1.1875rem",{ lineHeight: "1.45" }],
      body:  ["1rem",     { lineHeight: "1.55" }],
      meta:  ["0.8125rem",{ lineHeight: "1.5" }],
      mono:  ["0.6875rem",{ lineHeight: "1.5", letterSpacing: "0.06em" }],
      eyebrow: [/* keep existing */],
    },
    transitionTimingFunction: {
      soft: "cubic-bezier(0.2, 0.7, 0.3, 1)",
    },
  },
},
```

### `src/app/layout.tsx` - load new fonts

```tsx
import { Fraunces, Geist, JetBrains_Mono, Vazirmatn } from "next/font/google";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["300", "400", "500"],
  display: "swap",
});
const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600"],
  display: "swap",
});
const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
  display: "swap",
});
const vazir = Vazirmatn({
  subsets: ["arabic"],
  variable: "--font-rtl",
  weight: ["300", "400", "500"],
  display: "swap",
});

export default function RootLayout({ children, params }: {...}) {
  // Compute time-of-day server-side (Istanbul = UTC+3)
  const tod = getTimeOfDay();   // 'dawn' | 'midday' | 'dusk' | 'night'

  return (
    <html
      lang={params.lang ?? "en"}
      dir={["fa","ar"].includes(params.lang) ? "rtl" : "ltr"}
      className={`${fraunces.variable} ${geist.variable} ${mono.variable} ${vazir.variable} tod-${tod}`}
    >
      <body className="bg-ink-1 text-paper font-sans antialiased">
        <AmbientBar />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
```

Inter stays loaded for now (don't delete yet - other pages still reference it). It can be removed after Phase 4.

### `src/app/globals.css` - add base + tod system

```css
/* Time-of-day accent system. <html> gets one of these classes from the server. */
.tod-dawn   { --tod-accent: theme('colors.accent.warm'); }
.tod-midday { --tod-accent: theme('colors.paper.DEFAULT'); }
.tod-dusk   { --tod-accent: theme('colors.primary.500'); }
.tod-night  { --tod-accent: theme('colors.secondary.400'); }

/* Tabular numerals for monospace numbers everywhere */
.font-mono { font-variant-numeric: tabular-nums; }

/* Eyebrow */
.eyebrow { @apply font-mono uppercase tracking-wider text-paper-mute; }

/* The one moving signal: a ferry crossing the Bosphorus header */
@keyframes ferry-cross {
  0%   { transform: translateX(0);     opacity: 0; }
  10%  { opacity: 1; }
  90%  { opacity: 1; }
  100% { transform: translateX(640px); opacity: 0; }
}
.ferry-cross { animation: ferry-cross 24s linear infinite; }

/* No em dashes (lint rule will catch the rest) */
```

### Add an ESLint rule to ban em dashes

```js
// eslint.config.mjs
{
  rules: {
    "no-restricted-syntax": [
      "error",
      {
        selector: "Literal[value=/—/]",
        message: "No em dashes. Use a regular dash (-) or rephrase. See CLAUDE.md."
      }
    ],
  }
}
```

This will fail builds that contain em dashes in any string literal. Optional but valuable.

---

## Phase 1 - Shared chrome (one PR)

Build the components that every page uses. After this, the new chrome appears across the whole site even if the page bodies haven't been touched yet.

### New files to create

```
src/components/layout/AmbientBar.tsx
src/components/layout/SectionEyebrow.tsx
src/components/layout/PhotoSlot.tsx
src/components/ui/Mark.tsx          // ferry SVG, small atoms
src/lib/ambient.ts                  // getIstanbulTime, getWeather, etc.
```

### `src/lib/ambient.ts`

```ts
import "server-only";
import { unstable_cache } from "next/cache";

export const getIstanbulTime = unstable_cache(
  async () => {
    const now = new Date();
    // Istanbul is UTC+3, no DST
    const ist = new Date(now.getTime() + (3 - now.getTimezoneOffset()/-60) * 3600 * 1000);
    return ist.toTimeString().slice(0,5);
  },
  ["istanbul-time"],
  { revalidate: 30 }
);

export const getTimeOfDay = () => {
  const h = new Date(Date.now() + 3*3600*1000).getUTCHours();
  if (h >= 5  && h < 9)  return "dawn";
  if (h >= 9  && h < 17) return "midday";
  if (h >= 17 && h < 21) return "dusk";
  return "night";
};

export const getWeather = unstable_cache(
  async () => {
    // Open-Meteo - no API key, generous free tier
    const r = await fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=41.0082&longitude=28.9784&current=temperature_2m,weather_code,wind_speed_10m&timezone=Europe%2FIstanbul"
    );
    const d = await r.json();
    return {
      temp: Math.round(d.current.temperature_2m),
      label: weatherLabel(d.current.weather_code), // 'clear' | 'rain' | 'cloud' | ...
      wind: Math.round(d.current.wind_speed_10m),
    };
  },
  ["istanbul-weather"],
  { revalidate: 600 }
);

export const getFxRate = unstable_cache(
  async () => {
    // exchangerate.host - free
    const r = await fetch("https://api.exchangerate.host/latest?base=USD&symbols=TRY,EUR");
    const d = await r.json();
    return { usdTry: d.rates.TRY.toFixed(2), eurTry: d.rates.TRY / d.rates.EUR };
  },
  ["fx-rate"],
  { revalidate: 3600 }
);

export const getFerryStatus = unstable_cache(
  async () => {
    // Static schedule for v1; scrape sehirhatlari.istanbul later
    const now = new Date();
    const minutes = now.getHours() * 60 + now.getMinutes();
    const departures = [7*60+15, 7*60+35, /* ...static list... */];
    const next = departures.find(t => t > minutes);
    return {
      route: "Kadikoy → Karakoy",
      next: next ? `${Math.floor(next/60)}:${String(next%60).padStart(2,"0")}` : "first 07:15",
      running: now.getHours() >= 6 && now.getHours() < 23,
    };
  },
  ["ferry-status"],
  { revalidate: 60 }
);

export const getOnlineMembers = unstable_cache(
  async () => {
    // Supabase RPC: count members with last_seen_at > now - 5 min
    const { count } = await supabase
      .from("members")
      .select("*", { count: "exact", head: true })
      .gt("last_seen_at", new Date(Date.now() - 5*60*1000).toISOString());
    return count ?? 0;
  },
  ["online-members"],
  { revalidate: 60 }
);
```

### `src/components/layout/AmbientBar.tsx`

```tsx
import { getIstanbulTime, getWeather, getFerryStatus, getFxRate, getOnlineMembers, getTimeOfDay } from "@/lib/ambient";

export async function AmbientBar() {
  const [time, weather, ferry, fx, online] = await Promise.all([
    getIstanbulTime(),
    getWeather(),
    getFerryStatus(),
    getFxRate(),
    getOnlineMembers(),
  ]);
  const tod = getTimeOfDay();
  return (
    <div className="grid grid-cols-[auto_auto_auto_auto_auto_1fr_auto] items-stretch border-b border-ink-3 bg-ink-0 font-mono text-[11px] uppercase tracking-wider text-paper-mute">
      <Cell className="border-r border-ink-3">
        <Dot className="bg-accent-green shadow-[0_0_8px_#27ae60]" />
        <span className="text-paper">LIVE FROM KADIKOY</span>
      </Cell>
      <Cell className="border-r border-ink-3">
        <span className="text-paper tabular-nums">{time}</span>
        <span className="text-paper-faint">UTC+3</span>
      </Cell>
      <Cell className="border-r border-ink-3">
        <span className="text-paper tabular-nums">{weather.temp}°</span>
        <Dot style={{background:"var(--tod-accent)", boxShadow:"0 0 8px var(--tod-accent)"}} />
        <span style={{color:"var(--tod-accent)"}}>{tod}</span>
      </Cell>
      <Cell className="border-r border-ink-3">
        <span className="text-paper-faint">FERRY</span>
        <span className="text-paper">{ferry.route}</span>
        <span className="text-accent-warm">↗ {ferry.next}</span>
      </Cell>
      <Cell className="border-r border-ink-3">
        <span className="text-paper-faint">1 USD</span>
        <span className="text-paper tabular-nums">₺{fx.usdTry}</span>
      </Cell>
      <div />
      <Cell className="border-l border-ink-3">
        <Dot className="bg-accent-green" />
        <span className="text-paper tabular-nums">{online} online</span>
      </Cell>
    </div>
  );
}

const Cell = ({ children, className = "" }: any) => (
  <div className={`flex items-center gap-2.5 px-4 py-2.5 ${className}`}>{children}</div>
);
const Dot = ({ className = "", style = {} }: any) => (
  <span className={`inline-block w-1.5 h-1.5 rounded-full ${className}`} style={style} />
);
```

---

## Phase 2 - Homepage (one PR)

The marquee surface. After this, screenshots of the homepage are postable on X.

### Files

```
src/app/(marketing)/page.tsx                      # rewrite
src/components/sections/HeroIssue.tsx             # new
src/components/sections/ThreeDoors.tsx            # new
src/components/sections/WeekShape.tsx             # new
src/components/sections/MatcherDemo.tsx           # new (uses real signals)
src/components/sections/EventsStrip.tsx           # new
src/components/sections/MembershipTiers.tsx      # new (Free + Nomad+)
src/components/sections/CirclesStrip.tsx         # new (6 circles)
src/components/sections/SundayLetterPreview.tsx   # new
src/components/sections/QuietCta.tsx              # new
src/components/marks/BosphorusFerry.tsx           # the moving ferry SVG
```

Pattern: every section is `<section className="px-14 pt-32">` with a `<SectionEyebrow num="N° 02" label="..." />` opener. Reference the design canvas in this project for the exact layouts.

### Hero photo

Until real photography arrives, hero uses a `<PhotoSlot kind="dawn" />`. Replace with `next/image` referencing `public/images/homepage/hero-{1,2,3,4}.jpg` (rotated weekly via `getISOWeek() % 4`).

---

## Phase 3 - Neighborhoods + Kadikoy detail (one PR)

### Files

```
src/app/(marketing)/guides/neighborhoods/page.tsx               # rewrite (editorial list)
src/app/(marketing)/guides/neighborhoods/[slug]/page.tsx        # rewrite (editorial detail)
src/components/sections/NeighborhoodMap.tsx                     # custom Bosphorus schematic
src/components/sections/NeighborhoodRow.tsx                     # row-as-unit pattern
src/components/sections/HoodAtAGlance.tsx                       # 8-cell data block
src/components/sections/DayInTheLife.tsx                        # annotated timeline
src/components/sections/CafesByPurpose.tsx                      # café cards by what they're for
src/components/sections/EatDrinkSupply.tsx                      # 3-col editorial
```

### Content migration

The existing 10 neighborhoods (Kadikoy, Moda, Cihangir, Besiktas, Karakoy/Galata, Uskudar, Nisantasi, Levent, Balat, Atasehir) keep their MDX content. The page wraps it in the new layout components. No content rewriting required in this phase.

### Data model

Each neighborhood guide needs structured frontmatter:

```yaml
---
name: Kadikoy
side: Asia          # 'Asia' | 'Europe'
rentUsd: [480, 800] # [min, max] USD median 1BR
wifiScore: 97
walkScore: 94
membersHere: 38
vibe: Lived-in
tags: [ferry-first, walkable, long-stay, loud]
coords: [40.9925, 29.0282]
heroPhoto: /images/neighborhoods/kadikoy/hero.jpg
publishedAt: 2024-02-15
updatedAt: 2026-05-09
---
```

---

## Phase 4 - Events (one PR)

### Files

```
src/app/(marketing)/events/page.tsx              # rewrite (populated case)
src/app/(marketing)/events/[slug]/page.tsx       # new (event detail)
src/components/sections/EventListRow.tsx          # row pattern
src/components/sections/EventDetailHero.tsx
src/components/sections/EventBookingPanel.tsx     # sticky right column
src/components/sections/EventAttendees.tsx
src/components/sections/CustomBosphorusMap.tsx    # reusable from Phase 3
```

### Database

Already in `events` table per ARCHITECTURE.md. Add columns:

```sql
alter table events add column price_try integer;          -- null = free
alter table events add column price_usd integer;
alter table events add column capacity_max integer;
alter table events add column waitlist_count integer default 0;
alter table events add column kind text;                  -- 'dinner' | 'cowork' | 'walk' | 'drinks' | 'outdoor' | 'talk' | 'class'
alter table events add column circle_slug text references circles(slug);
```

RSVP flow stays through Telegram for free events. Paid events route through Stripe Checkout, capturing the seat in Supabase.

---

## Phase 5 - Membership surfaces (two PRs)

### PR A: Dashboard + Directory + Profile

```
src/app/(platform)/dashboard/page.tsx           # new
src/app/(marketing)/members/page.tsx            # new (public, opt-in)
src/app/(marketing)/members/[handle]/page.tsx   # new (public, opt-in)
src/components/sections/DashboardMasthead.tsx
src/components/sections/YourWeek.tsx
src/components/sections/PerksOnDashboard.tsx
src/components/sections/ActivityLedger.tsx
src/components/sections/MemberGrid.tsx
src/components/sections/MemberProfileHero.tsx
src/components/sections/MemberEndorsements.tsx
```

### PR B: Perks vault + Circles

```
src/app/(platform)/perks/page.tsx               # new (gated by Nomad+)
src/app/(marketing)/circles/page.tsx            # new (6 circle landings)
src/app/(marketing)/circles/[slug]/page.tsx     # new (e.g. coworking)
src/components/sections/PerksFilterBar.tsx
src/components/sections/PerkCard.tsx
src/components/sections/PerkFeatured.tsx
src/components/sections/CircleLiveStatus.tsx
src/components/sections/CircleLaptopMap.tsx
src/components/sections/CircleDiscussion.tsx
```

### Database additions

```sql
-- circles
create table circles (
  slug text primary key,
  name text not null,
  blurb text,
  accent text,                       -- 'primary' | 'secondary' | 'warm' | 'green'
  member_count integer default 0,
  created_at timestamptz default now()
);

-- circle membership (many-to-many)
create table circle_members (
  circle_slug text references circles(slug),
  member_id uuid references members(id),
  joined_at timestamptz default now(),
  primary key (circle_slug, member_id)
);

-- perks
create table perks (
  id uuid primary key default gen_random_uuid(),
  brand text not null,
  kind text not null,                -- 'coffee' | 'cowork' | 'food' | 'travel' | etc.
  offer text not null,
  cap text,
  city text,
  expires_at date,
  value_try integer,
  value_usd integer,
  story text,
  photo_url text,
  partner_id uuid,
  claimed_count integer default 0,
  is_active boolean default true,
  is_nomad_plus_only boolean default true
);

-- perk claims (one row per claim)
create table perk_claims (
  id uuid primary key default gen_random_uuid(),
  perk_id uuid references perks(id),
  member_id uuid references members(id),
  claimed_at timestamptz default now()
);

-- members - add columns
alter table members
  add column is_nomad_plus boolean default false,
  add column nomad_plus_since timestamptz,
  add column last_seen_at timestamptz,
  add column open_to_coffee boolean default false;
```

---

## Phase 6 - Command-K + polish (one PR)

```
src/components/ui/CommandMenu.tsx        # cmdk-based global search overlay
src/lib/search.ts                         # Supabase full-text across members, events, perks, guides
```

### Stack

```bash
pnpm add cmdk
```

### Pattern

```tsx
"use client";
import { Command } from "cmdk";

export function CommandMenu() {
  const [open, setOpen] = useState(false);
  useHotkeys("mod+k", () => setOpen(o => !o));

  return (
    <Command.Dialog open={open} onOpenChange={setOpen}>
      <Command.Input placeholder="kadikoy ferry..." />
      <Command.List>
        <Command.Group heading="Pages">
          <Command.Item onSelect={() => router.push("/guides/neighborhoods/kadikoy")}>
            Kadikoy · Neighborhood
          </Command.Item>
        </Command.Group>
        <Command.Group heading="Events">{/* ... */}</Command.Group>
        <Command.Group heading="Members">{/* ... */}</Command.Group>
      </Command.List>
    </Command.Dialog>
  );
}
```

Mount in root layout so it's available on every route.

---

## Phase 7 - Real photography rollout

Photography is the single biggest lift from "well-designed product" to "ships from a desk in Yeldegirmeni."

### What's needed

- **Homepage hero rotation**: 4 photos, 16:9, full-bleed. Different time-of-day each. ~3840×2160 source.
- **Neighborhood leads**: 10 photos (one per neighborhood), 16:10. Coast + street + a small detail.
- **Café details for Kadikoy**: 12-14 photos for the cafés-by-purpose grid.
- **Event covers**: real photos from previous events. The Sunset sail event needs a Marmara-at-sunset shot.
- **Member portraits**: opt-in, 4:5 portrait. Use Aram P. (member-photographer) for consistency.

### Treatment

- Slight film grain via CSS noise SVG overlay at 4-6% opacity (already in tokens)
- Mono caption inside the photo bottom-left: place, date, photographer credit

### Until photos exist

Photo slots ship as atmospheric placeholders with mono captions describing intent. This is intentional - a placeholder is honest, a stock photo is a lie.

---

## Migration checklist

- [ ] Phase 0 - tokens + fonts + ESLint em-dash rule (no visible change)
- [ ] Phase 1 - AmbientBar live across all pages
- [ ] Phase 2 - homepage v2 ships
- [ ] Phase 3 - neighborhood index + Kadikoy detail
- [ ] Phase 4 - events index + event detail page
- [ ] Phase 5a - dashboard + directory + profile
- [ ] Phase 5b - perks vault + circles
- [ ] Phase 6 - Command-K menu
- [ ] Phase 7 - real photography (ongoing)

### Risk notes

- **Server-side data fetches in AmbientBar**: every page renders with these 5 fetches. Cache them aggressively (`revalidate: 30-600s`). If a partner API goes down, fall back to static defaults - never block the page.
- **Em-dash lint rule**: will flag existing MDX content. Run a one-time script: `find src/content -name "*.mdx" -exec sed -i '' 's/—/-/g' {} \;` before enabling the rule.
- **Fraunces is ~110KB woff2**. Subset to Latin only (already in the snippet). Skip Vazirmatn on non-RTL pages with the `subsets: ["arabic"]` filter only loading for FA/AR routes via dynamic font loading if needed.
- **The moving ferry**: CSS keyframe is 24s linear. If users have `prefers-reduced-motion`, pause via `@media (prefers-reduced-motion: reduce) { .ferry-cross { animation: none; opacity: 0.4; } }`.
- **Time-of-day on cached pages**: ISR-cached pages won't see the tod change until revalidation. Either render the tod class client-side after hydration, or set ISR revalidate to 5-15 minutes so the class catches up.

---

## What I'd ship first

If you want one visible win this week: **Phase 0 + Phase 1**. The AmbientBar appearing across every page (with no other changes) communicates the entire identity shift in a single header strip. Screenshots of just that bar are postable.

After that: **Phase 2 (homepage)** is the marquee surface.

Then: **Phase 5b (perks + circles)** because they're entirely new and don't require migrating existing content.

Phases 3, 4, 5a can come in any order based on what's most painful in the current site.
