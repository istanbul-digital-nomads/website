# IN — Members + Profile · Implementation Handoff

> Brief: what changed in this round, which files to pull into the production
> codebase, and how they wire up. Companion to `DESIGN_SYSTEM.md` and
> `IMPLEMENTATION.md`.

---

## 1 · What changed

### A. New screens (4 artboards)
Two alternates each for **Members directory** and **Public profile**, layered next to the existing baselines in section `04 · Membership` of the design canvas.

| ID                  | Asset                                              | When to use                                                              |
| ------------------- | -------------------------------------------------- | ------------------------------------------------------------------------ |
| `directory-list`    | `MembersListPage`                                  | Dense, neighborhood-grouped directory. Default for `/members`.           |
| `directory-map`     | `MembersMapPage`                                   | Map-anchored directory. Toggle on `/members?view=map`.                   |
| `profile-editorial` | `ProfileEditorialPage`                             | Magazine-feel public profile. Default for `/m/[slug]`.                   |
| `profile-quiet`     | `ProfileQuietPage`                                 | Utility profile. Toggle on `/m/[slug]?view=quiet` or used for own profile. |

### B. Global re-skin — hero language adopted site-wide
The hero map's visual system (deep-water navy + gold/rose, Instrument Serif + Space Grotesk) is now the **default** for every page. This was done by remapping `tokens.css` design tokens and updating shared chrome in `shared.jsx`; no component below the surface needed editing.

**Before → after, at the token level:**

| Token              | Before (warm dusk)       | After (hero deep-water) |
| ------------------ | ------------------------ | ----------------------- |
| `--ink-1` (canvas) | `#1a1612` warm brown     | `#06101f` deep water    |
| `--paper`          | `#f4ead7` ferry-cream    | `#f6ecd9` cream (same)  |
| `--terracotta`     | `#c0392b` hagia red      | `#f4b860` gold          |
| `--bosphorus`      | `#526e89` slate-blue     | `#e87a5d` rose          |
| `--serif`          | Fraunces                 | Instrument Serif        |
| `--sans` / `--mono`| Geist / JetBrains Mono   | Space Grotesk           |
| Radii              | 2–4 px (squared)         | 8–18 px (rounder)       |

`NavBar` now renders the hero's gold→rose `iN` monogram + pill Sign-in. `Footer` gains an italic gold accent in the tagline and gold-tinted hairlines. `PhotoSlot` gradients are re-tinted to gold/rose.

---

## 2 · Files to import — production codebase

All files are plain function components. The runtime in this project uses Babel-standalone for convenience; in production they are normal React. The only thing to change is:

```diff
- window.MembersListPage = MembersListPage;
+ export { MembersListPage };
```

### Required (must import)

| File                       | Exports                                                            | Notes |
| -------------------------- | ------------------------------------------------------------------ | ----- |
| `tokens.css`               | CSS custom properties + `@font-face` imports + `.in-*` utilities   | Load once globally (e.g. `app/globals.css`). All other components depend on it. |
| `shared.jsx`               | `NavBar`, `Footer`, `PhotoSlot`, `SectionEyebrow`, `AmbientBar`, `CommandK` | Site chrome used by every page. |
| `members-variants.jsx`     | `MembersListPage`, `MembersMapPage`, `ProfileEditorialPage`, `ProfileQuietPage` | The 4 new artboards. **Self-styled** — does not depend on `tokens.css` for color (uses an inline `HERO` constant), so it works even before you load tokens. |
| `members.jsx`              | `MembersPage`, `ProfilePage` (the originals)                       | Keep if you want the card-grid baseline; remove if you're going straight to variant B/C. |

### Recommended (for the rest of the site)

| File                  | Page                          |
| --------------------- | ----------------------------- |
| `homepage-v2.jsx`     | `/` — homepage                |
| `neighborhoods.jsx`   | `/neighborhoods`              |
| `kadikoy.jsx`         | `/n/[slug]` — hood detail     |
| `events.jsx`          | `/events`                     |
| `event-detail.jsx`    | `/events/[slug]`              |
| `dashboard.jsx`       | `/me` — member dashboard      |
| `perks.jsx`           | `/perks`                      |
| `today.jsx`           | `/today`                      |
| `planner.jsx`         | `/planner`                    |
| `circle.jsx`          | `/circles/[slug]`             |
| `signup-forms.jsx`    | `/join`, `/guides/apply`      |
| `how-it-works.jsx`    | `/about`                      |

### Hero map (already in the codebase, keep as-is)

| File                       | Notes |
| -------------------------- | ----- |
| `hero-frame.jsx`           | Chrome — brand, headline, CTA, legend. |
| `hero-cinematic.jsx`       | Camera tour. Uses `useEffect` with intervals — wrap in `"use client"` for Next. |
| `istanbul-real-map.jsx`    | Leaflet wrapper. **Client-only** — touches `window`. |
| `istanbul-map.jsx`         | Stylized SVG fallback. |
| `map-data.jsx`             | `IN_PALETTE`, `IN_CATEGORIES`, `IN_NEIGHBORHOODS`, `IN_VENUES`, `IN_NOMADS` fixtures. Replace with API later. |

### Do NOT import (canvas-only tooling)

| File                       | Why skip |
| -------------------------- | -------- |
| `design-canvas.jsx`        | Pan/zoom canvas used to review artboards side-by-side. No production value. |
| `tweaks-panel.jsx`         | In-design tweak controls only. |
| `tokens.jsx`               | A page that *renders* tokens for review. `tokens.css` is the source of truth. |
| `today-atoms.jsx`          | Atom-reference for the `today` page; the atoms are already inlined where used. |
| `Istanbul Nomads - Site Redesign.html` | The design-review shell; replace with your app's routing. |
| `Istanbul Nomads Hero.html` | Standalone hero demo; the components inside are reusable. |
| All `*.md` files (incl. this one) | Documentation only. |

---

## 3 · Minimal Next.js wiring

```tsx
// app/layout.tsx
import './globals.css'; // = tokens.css

export const metadata = { title: 'Istanbul Nomads' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="in-artboard tod-dusk">{children}</body>
    </html>
  );
}
```

```tsx
// app/members/page.tsx
import { MembersListPage } from '@/components/members-variants';
export default function Page() { return <MembersListPage />; }
```

```tsx
// app/m/[slug]/page.tsx
import { ProfileEditorialPage } from '@/components/members-variants';
export default function Page() { return <ProfileEditorialPage />; }
```

---

## 4 · Data the components expect (replace mocks)

Each component currently reads from an inline fixture. Wire these to your API:

### `members-variants.jsx` — `_membersFull`
```ts
type Member = {
  name: string;
  role: string;             // "Writer · ex-Wired"
  hood: string;             // "Kadıköy"
  since: string;            // "Aug 2025"
  mo: string;               // "9mo" — human-readable tenure
  langs: string[];          // ["EN","TR","FR"]
  from: string;             // "London"
  open: boolean;            // open to coffee this month
  reply: string;            // "~2h" | "—"
  tags: string[];           // 3 self-picked tags
  hue: string;              // CSS color for avatar gradient
  slug?: string;            // for /m/[slug]
  telegram?: string;        // "@maya-k"
};
```

### Profile pages — additional fields
```ts
type ProfileExtra = {
  bio: string;              // serif lede
  body: string;             // long-form
  pullQuote?: { text: string; source: string };
  endorsements: { quote: string; from: string; sub: string }[];
  hosting: { date: string; time: string; title: string; venue: string; capacity: string }[];
  writing: { title: string; blurb: string; date: string; readTime: string }[];
  stats: { fieldNotes: number; eventsHosted: number; languages: number; replyTime: string };
};
```

---

## 5 · Backend endpoints (suggested)

```
GET  /api/members?hood=&tag=&open=1&q=&sort=          → Member[] + pagination
GET  /api/members/:slug                                → Member & ProfileExtra
POST /api/me/profile                                   → update own profile
POST /api/me/open-to-coffee                            → toggle availability

GET  /api/hoods                                        → IN_NEIGHBORHOODS
GET  /api/venues?hood=&cat=                            → IN_VENUES
GET  /api/nomads/live                                  → IN_NOMADS (or WS feed)

GET  /api/events?from=&to=&hood=                       → Event[]
GET  /api/events/:slug                                 → Event & detail
```

No in-site DMs — outbound contact is **Telegram only**. Members provide their handle on profile creation.

---

## 6 · What to do next

1. **Copy the 4 required files** into `components/`.
2. **Load `tokens.css` once globally** + add the two Google Font links to your `<head>`.
3. **Pick directory + profile variant** for `/members` and `/m/[slug]` (recommendation: `list` + `editorial`).
4. **Wire `_membersFull` to your API** — every other variant reads from the same fixture, so one swap covers all three directory views.
5. Migrate the remaining pages from the table above as you build out the rest of the site.

---

## 7 · Component inventory

What's actually inside each file, what's reusable, and what to extract first.

### `shared.jsx` — site chrome (6 exports)

| Component        | Props                                | Use for                                                                 |
| ---------------- | ------------------------------------ | ----------------------------------------------------------------------- |
| `NavBar`         | `active`, `lang`                     | Top nav on every page. Gold→rose `iN` monogram, sticky, blur background. |
| `Footer`         | —                                    | Site footer with tagline, link columns, coords/timestamp.                |
| `PhotoSlot`      | `kind`, `label`, `corner`, `style`   | Placeholder for photography. `kind`: `dawn` / `dusk` / `bosphorus` / `interior` / `street` / `mono`. Replace with `<img>` when you have real photos. |
| `SectionEyebrow` | `num`, `label`, `kicker`             | The gold "N° 04 · Members ·" tag above every section.                    |
| `AmbientBar`     | `tod` (dawn/midday/dusk/night)       | The thin live-stats bar (time, weather, ferry, FX, online count).        |
| `CommandK`       | `style`                              | Floating ⌘K search palette. Static demo render — wire to your search.    |

### `members-variants.jsx` — 14 components, 4 are pages

**Page components (export these):**

| Component              | Route                | Notes                                              |
| ---------------------- | -------------------- | -------------------------------------------------- |
| `MembersListPage`      | `/members`           | Dense list, neighborhood-grouped, "open" left rail. |
| `MembersMapPage`       | `/members?view=map`  | SVG-stylized Bosphorus with member pins.            |
| `ProfileEditorialPage` | `/m/[slug]`          | Magazine layout: full-bleed cover, drop cap, pull quote. |
| `ProfileQuietPage`     | `/m/[slug]?view=quiet` or `/me` | Utility profile, structured fields, stats strip. |

**Atom components (private, used by the pages above):**

| Component       | Props                                | Purpose                                                       |
| --------------- | ------------------------------------ | ------------------------------------------------------------- |
| `HeroArtboard`  | `width`, `height`, `label`, `children` | Page shell — deep-water bg, radial-gradient texture.        |
| `HeroBrand`     | —                                    | The `iN` monogram + wordmark.                                 |
| `HeroNav`       | `active`                             | Top nav, identical pattern to `NavBar` in `shared.jsx`.       |
| `HeroLivePip`   | `label`                              | Pill with blinking green dot. Use anywhere live = true.       |
| `HeroEyebrow`   | `label`, `kicker`                    | Gold uppercase eyebrow with hairline.                         |
| `HeroChip`      | `children`, `on`                     | Filter chip / toggle. `on={true}` = gold border + tint.       |
| `HeroTag`       | `children`                           | Small pill tag — for keywords, languages, skills.             |
| `HeroPrimary`   | `children`, `style`                  | Gold-on-navy primary button (pill).                           |
| `HeroGhost`     | `children`, `style`                  | Outlined ghost button (pill).                                 |
| `HeroAvatar`    | `size`, `hue`, `online`              | Gradient avatar with optional green "online" dot.             |
| `HeroCoords`    | —                                    | Lat/lng + locality footer detail.                             |
| `HeroFooter`    | —                                    | Page footer (echoes `shared.jsx`'s `Footer` in hero language). |

> **Recommendation:** When porting, **merge `Hero*` atoms into `shared.jsx`** (or split out a `chrome/` folder) so the rest of the site can use them too. Right now they're duplicated inline in `members-variants.jsx` to keep the file self-contained.

**Constants (also exported):**

| Constant         | Type                                     | Purpose                                                  |
| ---------------- | ---------------------------------------- | -------------------------------------------------------- |
| `HERO`           | `{ deepWater, water, gold, rose, … }`    | The full palette. Move to a `theme.ts` for production.   |
| `SERIF`, `SANS`  | string                                   | Font stacks. Move to your global CSS / Tailwind config.  |
| `_membersFull`   | `Member[]`                               | Fixture data — replace with API. Shape doc'd in §4 above. |
| `HOOD_POS`       | `Record<hood, { x, y, side }>`           | Neighborhood pin coords for the SVG map. Tune visually or replace with real lat/lng via Leaflet. |

### `members.jsx` — original baseline (optional)

| Component       | Notes                                                            |
| --------------- | ---------------------------------------------------------------- |
| `MembersPage`   | Card-grid directory (Variant A). Keep only if you want to A/B test against the list variant. |
| `ProfilePage`   | Split-hero profile (Variant A). Keep only as fallback.           |

### `hero-frame.jsx` + `hero-cinematic.jsx` + `istanbul-real-map.jsx` + `map-data.jsx`

The full hero map system. Already shipped — no changes this round.

| Component         | File                       | Purpose                                       |
| ----------------- | -------------------------- | --------------------------------------------- |
| `HeroFrame`       | `hero-frame.jsx`           | Chrome wrapping the map: brand, headline, CTA, legend. |
| `HeroCinematic`   | `hero-cinematic.jsx`       | The slow camera tour through neighborhoods.   |
| `IstanbulRealMap` | `istanbul-real-map.jsx`    | Leaflet wrapper. Client-only (`"use client"`). |
| `IstanbulMap`     | `istanbul-map.jsx`         | Stylized SVG fallback if you skip Leaflet.    |
| `MapMarker`       | `istanbul-real-map.jsx`    | Imperative lat/lng → screen positioner. Used by venue dots and nomad avatars. |

### Other page components (one per file)

| File                  | Default export        | What it is                              |
| --------------------- | --------------------- | --------------------------------------- |
| `homepage-v2.jsx`     | `HomePageV2`          | Homepage — full marketing scroll.       |
| `neighborhoods.jsx`   | `NeighborhoodsPage`   | Index of all neighborhoods.             |
| `kadikoy.jsx`         | `KadikoyPage`         | A single neighborhood detail (template).|
| `events.jsx`          | `EventsPage`          | Season calendar + brand partners.       |
| `event-detail.jsx`    | `EventDetailPage`     | Single event detail.                    |
| `dashboard.jsx`       | `DashboardPage`       | Logged-in member dashboard.             |
| `perks.jsx`           | `PerksPage`           | Perks vault — 41 partner offers.        |
| `today.jsx`           | `TodayPage`           | Today's plans, nomads + local guides.   |
| `planner.jsx`         | `PlannerPage`         | First Week Planner output.              |
| `circle.jsx`          | `CirclePage`          | Sub-community landing.                  |
| `signup-forms.jsx`    | `NomadSignup`, `GuideSignup` | Two onboarding flows.            |
| `how-it-works.jsx`    | `HowItWorksPage`      | About / how it works.                   |

---

## 8 · Recommended component folder structure

```
components/
  chrome/
    NavBar.tsx              ← shared.jsx · NavBar
    Footer.tsx              ← shared.jsx · Footer
    AmbientBar.tsx          ← shared.jsx · AmbientBar
    CommandK.tsx            ← shared.jsx · CommandK
    PhotoSlot.tsx           ← shared.jsx · PhotoSlot
    SectionEyebrow.tsx      ← shared.jsx · SectionEyebrow

  ui/                       ← extract from members-variants.jsx
    Brand.tsx               ← HeroBrand
    Avatar.tsx              ← HeroAvatar
    Button.tsx              ← HeroPrimary, HeroGhost
    Chip.tsx                ← HeroChip
    Tag.tsx                 ← HeroTag
    Eyebrow.tsx             ← HeroEyebrow
    LivePip.tsx             ← HeroLivePip
    Coords.tsx              ← HeroCoords

  members/
    MembersList.tsx         ← MembersListPage
    MembersMap.tsx          ← MembersMapPage
    ProfileEditorial.tsx    ← ProfileEditorialPage
    ProfileQuiet.tsx        ← ProfileQuietPage

  hero/
    HeroFrame.tsx
    HeroCinematic.tsx
    IstanbulRealMap.tsx
    MapMarker.tsx

  pages/                    ← one per remaining file
    Homepage.tsx
    Neighborhoods.tsx
    Kadikoy.tsx
    Events.tsx
    EventDetail.tsx
    Dashboard.tsx
    Perks.tsx
    Today.tsx
    Planner.tsx
    Circle.tsx
    NomadSignup.tsx
    GuideSignup.tsx
    HowItWorks.tsx

theme/
  tokens.css                ← drop into globals.css
  palette.ts                ← extracted HERO constant as TS
  fonts.ts                  ← SERIF, SANS as TS
```

---

## 9 · "Today's plans" page — `today.jsx`

The Today page **is already implemented** at `today.jsx`, wired into the canvas at section `02 · Tools` as the artboard **"Today's plans · nomads + local guides"**.

### Files involved

| File              | Exports                                | Purpose                                                                  |
| ----------------- | -------------------------------------- | ------------------------------------------------------------------------ |
| `today.jsx`       | `TodayPage`                            | The page itself — header, stats strip, plan board, side rail, footer.    |
| `today-atoms.jsx` | `PlanCard`, `SectionHead`, `AvatarIN`  | Reusable atoms the page composes. **Required** — `today.jsx` won't render without it. |

### Route

```tsx
// app/today/page.tsx
import { TodayPage } from '@/components/today';
export default function Page() { return <TodayPage />; }
```

### What it does

A peer board of today's plans, two kinds:

- **Nomad plans** — peer meetups posted by community members. Free. Budget shown up front (₺ amounts). Co-work, walks, dinners, ferry crossings, errands.
- **Guide plans** — paid little trips run by verified local guides. Capped seats, refund up to 12h before. Food walks, boat trips, jazz nights.

Plans are grouped into **Morning / Afternoon / Evening** sections. Each `PlanCard` shows host avatar, time, title, stops, duration, attendees, seat count, budget breakdown, and (when expanded) the full agenda. Three cards default to expanded; the rest collapsed.

The side rail has:
- **"You're hosting"** card — the user's own active plan (Maya's 10:30 Walter's window-seat plan in the fixture)
- **Composer** — one-line input to post a new plan (tags + ⌘N shortcut)
- **Featured local guides** — 4 verified guides with today's offering + price

### Data shape

Each plan is a flat object — to wire to an API, match this shape:

```ts
type Plan = {
  type: 'nomad' | 'guide';
  time: string;           // "08:00"
  tone: string;           // CSS color token for accent
  kindLabel: string;      // "walk" | "ferry trip" | "co-work" | "dinner" …
  title: string;
  host: string;
  hostInitials: string;
  duration: string;       // "2h" | "45min" | "4h"
  stops: number;
  agenda: {
    time: string;
    title: string;
    place: string;
    note: string;
    cost: number | 'free';
  }[];
  filled: number;
  seats?: number;
  kind?: 'private';       // hides seat count
  mine?: boolean;         // renders with terracotta border in side rail
  attendees: {
    initials: string;
    tone: string;
    name: string;
    role: 'HOST' | 'JOINED';
    joinedAt?: string;
  }[];

  // Nomad plans only
  budget?: {
    total: number;
    usd?: number | null;
    sub: string;
    lines?: [string, string][];
  };
  hostStats?: string;     // "12" plans hosted

  // Guide plans only
  fee?: number;
  usd?: number;
  feeSub?: string;        // "4 stops · 4 hours"
  feeLines?: [string, string][];
  includes?: string[];
  languages?: string[];
  guideStats?: string;    // "★ 4.9 · 47 TRIPS · VERIFIED MARCH 2025"
  description?: string;
};
```

### Backend endpoints (suggested)

```
GET  /api/plans?date=&hood=&type=&kind=&q=             → Plan[] grouped by Morning/Afternoon/Evening
GET  /api/plans/:id                                     → Plan & full agenda
POST /api/plans                                         → create (nomad) plan
POST /api/plans/:id/join                                → join (claim a seat)
POST /api/plans/:id/leave                               → release a seat
GET  /api/guides/today                                  → side-rail featured guides
```

### Visual harmonization status

⚠️ The page **still uses the legacy color names** (`var(--ferry-yellow)`, `var(--terracotta-dim)`, `var(--bosphorus)`, `var(--moss)`) but since `tokens.css` was remapped to the hero palette in §1, those names now resolve to the new colors — so it renders in the deep-water + gold/rose system automatically. No code changes needed to the page itself.

If you find any visual artifact (a stale red here, a brown there), it's a hardcoded hex value rather than a token reference; tell me where you see it and I'll fix that specific spot.

---

_Last updated: 18 May 2026_
