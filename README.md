<p align="center">
  <img src="public/images/logo-light.png" alt="Istanbul Nomads" width="120" height="120" />
</p>

<p align="center">
  <img src="https://github.com/istanbul-digital-nomads/website/actions/workflows/ci.yml/badge.svg?branch=develop" alt="CI" />
  <img src="https://img.shields.io/badge/TypeScript-strict-blue?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Next.js-16-black?logo=nextdotjs&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/License-Proprietary-red" alt="License" />
</p>

# Istanbul Nomads - Website

The official website and community platform for Istanbul's digital nomad community. A full-stack web application built with **Next.js 16** (App Router, React 19), **Tailwind CSS**, **TypeScript**, **Supabase**, and **MapLibre**.

> **This is a private repo.** The website source code is maintained by core contributors. If you'd like to contribute, reach out in the [community repo](https://github.com/istanbul-digital-nomads/community).

> 📘 **Looking for the product story, the user loop, and what every route does?** Read **[PRODUCT.md](PRODUCT.md)** first. It's the canonical source of truth for what this product *is*; the README below covers how to run and develop it.

## Live Site

🌐 **[istanbulnomads.com](https://istanbulnomads.com)** - launching soon

## What We're Building

Istanbul Nomads is a place-based community platform for people working remotely from Istanbul for the one-to-six-month version of their stay. Made in Kadıköy. The full product story, audience, and the engagement loop live in [PRODUCT.md](PRODUCT.md).

### Current Release

- **Version:** `3.8.1` (see [CHANGELOG.md](CHANGELOG.md))
- **Cinematic live-map homepage hero:** full-bleed MapLibre map auto-touring 6 Istanbul neighborhoods (Beyoğlu → Kadıköy → Karaköy → Sultanahmet → Ortaköy), with nomad photo avatars glued to lat/lng and a floating "Now Live" callout
- **Today board** at `/today`: editorial daily plans grouped morning/afternoon/evening, with gold "★ Local guide" tag for guide-hosted plans
- **Members editorial directory** at `/members`: deep-water canvas, neighborhood-grouped, recently-joined sidebar, real Supabase data
- **Workspace navbar:** five real product destinations (Today · Map · Events · Members · Perks) + rich Explore ▾ / Community ▾ dropdowns, gold-tinted active state, count pills on Events + Perks fed by a cached Supabase query, consistent across the hero brand bar and the global Header
- **Multi-language support:** English (root), Turkish (`/tr`), Farsi (`/fa`), Arabic (`/ar`), and Russian (`/ru`) with proper hreflang, locale-aware sitemap, RTL for Arabic and Farsi
- **Neighborhood coverage:** 10 full Istanbul neighborhood guides with photos, rent ranges, transport notes
- **Plans:** multi-stop daily plans (`/plans`, `/plans/new`, `/plans/[id]`) with map-first creation, swipeable bottom sheet on mobile, Telegram-only outbound contact
- **Nomad Spaces finder** at `/spaces`: nomad-scored cafés + coworking with same-day work modes and combinable filters
- **Relocation agent** at `/relocation-agent`: Claude-powered intake → personal plan with neighborhood scores
- **Editorial typography:** Instrument Serif for headlines (italic-gold accents), Space Grotesk for Members + Today body, deep-water + gold/rose palette

### Routes — what each one actually does

Full per-route description, the user loop, and which surfaces are auth-required live in [PRODUCT.md](PRODUCT.md). Quick reference:

| Route | Auth | Purpose |
|---|---|---|
| `/` | public | Cinematic live-map hero + the homepage scroll (Three Doors, Week Shape, Guides Shelf, Rhythm Matcher, Events Strip, Memberships, Circles, Sunday Letter, Quiet CTA) |
| `/today` | **members** | The daily plans board grouped morning/afternoon/evening |
| `/plans` | public landing, **members** for feed | Marketing landing + authed today/tomorrow/week feed |
| `/plans/new` | **members** | Map-first plan creation flow |
| `/plans/[id]` | public | Plan detail with stops + join/leave + comments |
| `/members` | public | Editorial directory, neighborhood-grouped |
| `/members/[id]` | public | Public member profile |
| `/spaces` | public | Verified coworking + cafés with nomad-score and map (the "Map" nav target) |
| `/events` + `/events/[id]` | public | Scheduled meetups + RSVPs |
| `/guides` + `/guides/[slug]` | public | Indexed guides (housing, transport, SIM, banking, etc.) |
| `/guides/neighborhoods` + `/guides/neighborhoods/[slug]` | public | 10 full neighborhood pages |
| `/path-to-istanbul` + `/path-to-istanbul/[country]` | public | Relocation playbooks (Iran, India, Russia, Pakistan, Nigeria) |
| `/relocation-agent` | public | AI move planner (Claude + RAG) |
| `/local-guides` + `/local-guides/join` | public | Verified hosts directory + application |
| `/perks` | public listing, member-gated offers | Partner offers vault |
| `/circles` | public | Sub-community rooms |
| `/blog` + `/blog/[slug]` | public | MDX long-form |
| `/about`, `/contact`, `/credits` | public | Story, contact form, photo attribution |
| `/onboarding` | **after sign-up** | Profile setup wizard |
| `/login` | public | Supabase auth (magic link + OAuth) |
| `/dashboard` | **members** | Member home: your plans, RSVPs, profile completion |
| `/tools/first-week-planner` | public | Seven-day arrival itinerary builder |

### API & Integrations

| Integration       | Description                                             |
| ----------------- | ------------------------------------------------------- |
| **Public API**    | REST endpoints for community stats, events, and guides  |
| **Telegram Bot**  | Event notifications, new member welcomes, weekly digest |
| **Calendar Sync** | Google Calendar / Apple Calendar export for events      |
| **Newsletter**    | Weekly email digest via Resend                          |
| **RSS Feed**      | Blog and events feeds for subscribers                   |

## Tech Stack

| Layer          | Technology                                     | Why                                                                                |
| -------------- | ---------------------------------------------- | ---------------------------------------------------------------------------------- |
| Framework      | [Next.js 14](https://nextjs.org/) (App Router) | SSR, ISR, API routes, file routing                                                 |
| Language       | TypeScript (strict mode)                       | Type safety, better DX                                                             |
| Styling        | Tailwind CSS                                   | Utility-first, custom design tokens                                                |
| UI Components  | Headless UI + custom system                    | Accessible, unstyled primitives                                                    |
| Icons          | Lucide React                                   | Consistent, lightweight                                                            |
| Content        | MDX + remark-gfm                               | Blog posts and guides with React components, tables, and responsive content blocks |
| Database       | Supabase (PostgreSQL)                          | Generous free tier, RLS, real-time                                                 |
| Auth           | Supabase Auth                                  | Magic link + Google + GitHub OAuth                                                 |
| Storage        | Supabase Storage                               | Avatars, event images                                                              |
| Hosting        | Vercel                                         | Preview deploys, edge network                                                      |
| Analytics      | GA4 via Google Tag Manager + Vercel Analytics  | Consent-gated funnel + visitor tracking                                            |
| Performance    | Vercel Speed Insights                          | Core Web Vitals monitoring                                                         |
| Email          | Resend                                         | Transactional + newsletter                                                         |
| Error Tracking | Sentry (server-side)                           | Server / SSR / route-handler errors via instrumentation onRequestError; no client SDK |
| CI/CD          | GitHub Actions                                 | Lint, type check, build on every PR                                                |
| i18n           | next-intl                                      | Server-rendered translations, RTL support, locale-aware routing and metadata       |

## Internationalization

The site ships in five languages. English is the default and lives at the root (`/`); the other four sit under language-only prefixes:

| Locale  | URL prefix | BCP 47 | Direction |
| ------- | ---------- | ------ | --------- |
| English | `/`        | en-US  | LTR       |
| Turkish | `/tr`      | tr-TR  | LTR       |
| Farsi   | `/fa`      | fa-IR  | RTL       |
| Arabic  | `/ar`      | ar-SA  | RTL       |
| Russian | `/ru`      | ru-RU  | LTR       |

- UI strings live in `src/messages/{locale}.json` and are loaded server-side by `next-intl`, so translated content adds near-zero client JS.
- Routing is configured in `src/lib/i18n/routing.ts` with `localePrefix: "as-needed"` - English keeps its existing URLs so backlinks stay intact.
- Per-locale MDX content goes under `src/content/{category}/{locale}/{slug}.mdx` (e.g., `src/content/blog/tr/...`). All 16 blog posts, 11 city guides, and 5 country playbooks are translated to every locale (100% coverage). When a localized file is missing, the loader at `src/lib/i18n/content.ts` falls back to the English version.
- `sitemap.xml` emits hreflang alternates with `x-default` pointing to English. `og:locale` and `og:locale:alternate` are emitted per request; `<html lang dir>` is set per locale.
- Transactional emails (contact, newsletter, guide application) accept a `locale` from the form and render with localized subject + body and `<html lang dir>` for RTL clients.
- Dates render via `Intl.DateTimeFormat` with the active locale's BCP 47 tag (Persian visitors see "۲ آوریل ۲۰۲۶", not "April 2, 2026").
- Chrome's auto-translate is suppressed via `<meta name="google" content="notranslate">` and `translate="no"` on `<html>` so the page stays in the locale the user picked.
- RTL polish: directional Lucide icons mirror via Tailwind's `--tw-scale-x` variable (composes with hover-translate utilities), hover-translate variants reverse direction in RTL, LTR runs (rent ranges, wifi speeds, hours) are bidi-isolated in `<bdi dir="ltr">`, MDX tables use logical-property utilities and cell-level `<bdi>` for mixed-direction content.
- OpenGraph image rendering uses two pipelines: `@vercel/og` (satori) for en/tr/ru on Edge runtime, and `@resvg/resvg-js` (HarfBuzz) for fa/ar on Node runtime because satori can't shape Arabic-script glyphs (vercel/satori#74). The brand layout is replicated in both; see `docs/i18n/og-rendering.md`.
- Four native-fluent audit agents under `.claude/agents/` (`nomad-tr-editor`, `nomad-fa-editor`, `nomad-ar-editor`, `nomad-ru-editor`) audit each locale for grammar, vocabulary, brand voice, locale SEO, and AI engine optimization with a strict no-fabrication rule. See `docs/i18n/` for the per-locale keyword trackers and playbooks.

## Getting Started

### Prerequisites

- Node.js 20+ (pinned via `.nvmrc`)
- pnpm (recommended) or npm
- Supabase account (for database features)
- Git

### Installation

```bash
# Clone the repo
git clone git@github.com:istanbul-digital-nomads/website.git
cd website

# Switch to develop branch
git checkout develop

# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env.local

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the site.

### Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_GTM_ID=your_gtm_container_id
RESEND_API_KEY=your_resend_api_key
SENTRY_DSN=your_sentry_dsn
VERCEL_URL=                    # Auto-populated on Vercel
VERCEL_ENV=                    # Auto-populated on Vercel
```

## Project Structure

```
website/
├── public/                    # Static assets
│   ├── images/                # Hero images, OG images
│   ├── icons/                 # Favicons, app icons
│   └── fonts/                 # Self-hosted fonts (if any)
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── (marketing)/       # Public pages
│   │   │   ├── page.tsx       # Homepage
│   │   │   ├── about/
│   │   │   ├── guides/
│   │   │   │   ├── page.tsx   # Guides grid
│   │   │   │   └── [slug]/    # Individual guide
│   │   │   ├── events/
│   │   │   │   ├── page.tsx   # Events listing
│   │   │   │   └── [id]/      # Event detail
│   │   │   ├── blog/
│   │   │   │   ├── page.tsx   # Blog listing
│   │   │   │   └── [slug]/    # Blog post
│   │   │   ├── contact/
│   │   │   └── tools/
│   │   │       ├── neighborhood-quiz/
│   │   │       ├── cost-calculator/
│   │   │       └── buddy-finder/
│   │   ├── (platform)/        # Authenticated pages
│   │   │   ├── dashboard/
│   │   │   ├── members/
│   │   │   │   ├── page.tsx   # Member directory
│   │   │   │   └── [username]/
│   │   │   ├── events/
│   │   │   │   ├── create/
│   │   │   │   └── [id]/manage/
│   │   │   └── settings/
│   │   ├── auth/              # Auth pages (login, callback)
│   │   ├── api/               # API routes
│   │   │   ├── events/
│   │   │   ├── members/
│   │   │   ├── rsvp/
│   │   │   ├── newsletter/
│   │   │   └── webhooks/
│   │   ├── layout.tsx         # Root layout
│   │   ├── not-found.tsx      # 404 page
│   │   └── error.tsx          # Error boundary
│   ├── components/
│   │   ├── ui/                # Base: Button, Card, Input, Badge, Modal, etc.
│   │   ├── layout/            # Header, Footer, Nav, Sidebar, Container
│   │   ├── sections/          # Hero, Features, CTA, Testimonials
│   │   ├── events/            # EventCard, EventList, EventForm, RSVPButton
│   │   ├── guides/            # GuideCard, GuideGrid, TableOfContents
│   │   ├── blog/              # PostCard, PostList, AuthorBio
│   │   ├── members/           # MemberCard, MemberGrid, ProfileForm
│   │   └── tools/             # QuizStep, Calculator, BuddyCard
│   ├── lib/
│   │   ├── supabase/          # Client, server client, middleware helpers
│   │   ├── utils.ts           # cn(), formatDate, etc.
│   │   ├── constants.ts       # Site config, nav links, social links
│   │   └── validations.ts     # Zod schemas for forms and API
│   ├── content/               # MDX files
│   │   ├── blog/              # Blog posts
│   │   └── guides/            # City guides (synced from resources repo)
│   ├── hooks/                 # useAuth, useEvents, useDebounce, etc.
│   ├── types/                 # TypeScript interfaces and types
│   └── styles/
│       └── globals.css        # Tailwind imports, CSS variables
├── supabase/
│   ├── migrations/            # SQL migrations
│   └── seed.sql               # Development seed data
├── .github/
│   └── workflows/
│       ├── ci.yml             # Lint + type check + build
│       └── preview.yml        # Deploy preview on PR
├── .env.example
├── .nvmrc                     # Node.js version pin
├── .vercelignore              # Files excluded from Vercel deploys
├── vercel.json                # Vercel config (headers, caching)
├── ARCHITECTURE.md
├── CHANGELOG.md
├── DESIGN.md
├── ROADMAP.md
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## Scripts

| Command           | Description                   |
| ----------------- | ----------------------------- |
| `pnpm dev`        | Start development server      |
| `pnpm build`      | Build for production          |
| `pnpm start`      | Start production server       |
| `pnpm lint`       | Run ESLint                    |
| `pnpm format`     | Format code with Prettier     |
| `pnpm type-check` | Run TypeScript compiler check |
| `pnpm test`       | Run tests                     |
| `pnpm db:migrate` | Run Supabase migrations       |
| `pnpm db:seed`    | Seed development database     |
| `pnpm db:reset`   | Reset and reseed database     |

## Branch Strategy

| Branch      | Purpose                                               |
| ----------- | ----------------------------------------------------- |
| `main`      | Production - auto-deploys to istanbulnomads.com       |
| `develop`   | Integration branch - all feature PRs merge here first |
| `feature/*` | Individual features (e.g., `feature/event-rsvp`)      |
| `fix/*`     | Bug fixes (e.g., `fix/mobile-nav`)                    |

### Development Workflow

1. Pull latest from `develop`
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make changes, commit with clear messages
4. Push and open a PR targeting `develop`
5. Get at least one review
6. Merge to `develop` (auto-deploys to preview)
7. When `develop` is stable, merge to `main` (auto-deploys to production)

## Contributing

This is a private repo for core contributors. To get involved:

1. Join the [community Telegram](https://t.me/istanbul_digital_nomads)
2. Check the [community repo](https://github.com/istanbul-digital-nomads/community) for contributing guidelines
3. Express interest in the Telegram group - we'll invite you as a collaborator

## Related Repos

| Repo                                                              | Description                      |
| ----------------------------------------------------------------- | -------------------------------- |
| [community](https://github.com/istanbul-digital-nomads/community) | Guidelines, code of conduct, FAQ |
| [events](https://github.com/istanbul-digital-nomads/events)       | Event planning and templates     |
| [resources](https://github.com/istanbul-digital-nomads/resources) | Curated Istanbul guides          |
| [.github](https://github.com/istanbul-digital-nomads/.github)     | Organization profile             |

## License

This project is private and not open-source. All rights reserved by Istanbul Digital Nomads community organizers.
