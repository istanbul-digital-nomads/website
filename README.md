![CI](https://github.com/istanbul-digital-nomads/website/actions/workflows/ci.yml/badge.svg?branch=develop)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue?logo=typescript&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=nextdotjs&logoColor=white)
![License](https://img.shields.io/badge/License-Proprietary-red)

# Istanbul Digital Nomads — Website

The official website and community platform for Istanbul's digital nomad community. A full-stack web application built with **Next.js 14**, **Tailwind CSS**, **TypeScript**, and **Supabase**.

> **This is a private repo.** The website source code is maintained by core contributors. If you'd like to contribute, reach out in the [community repo](https://github.com/istanbul-digital-nomads/community).

## Live Site

🌐 **[istanbulnomads.com](https://istanbulnomads.com)** — launching soon

## What We're Building

Istanbul Nomads is more than a landing page — it's a full community platform. Here's every service the domain will cover:

### Core Services

| Service | Description | Route |
|---------|-------------|-------|
| **Homepage** | Hero, community stats, featured events, social proof, join CTA | `/` |
| **About** | Our story, values, organizer team, community timeline | `/about` |
| **City Guides** | 10 curated guides (neighborhoods, coworking, cafes, visa, housing, internet, transport, cost of living, healthcare, food) | `/guides`, `/guides/[slug]` |
| **Events** | Upcoming meetups, coworking sessions, workshops, past events archive | `/events`, `/events/[id]` |
| **Blog** | Community stories, Istanbul tips, nomad interviews, remote work insights | `/blog`, `/blog/[slug]` |
| **Contact** | Reach us form, Telegram link, email, social links | `/contact` |

### Member Platform (Authenticated)

| Service | Description | Route |
|---------|-------------|-------|
| **Dashboard** | Personal hub — upcoming RSVPs, activity feed, quick actions | `/dashboard` |
| **Member Directory** | Searchable, filterable list of community members (opt-in) | `/members` |
| **Profiles** | Member profiles with bio, skills, neighborhood, links | `/members/[username]` |
| **Event Management** | Create, edit, and manage community events | `/events/create`, `/events/[id]/manage` |
| **Settings** | Account settings, notification preferences, privacy controls | `/settings` |

### Interactive Tools

| Tool | Description | Route |
|------|-------------|-------|
| **Neighborhood Quiz** | "Which Istanbul neighborhood is right for you?" personality-style quiz | `/tools/neighborhood-quiz` |
| **Cost of Living Calculator** | Interactive lifestyle-based calculator with real Istanbul data | `/tools/cost-calculator` |
| **Coworking Buddy Finder** | Match with nomads in the same neighborhood or shared interests | `/tools/buddy-finder` |

### API & Integrations

| Integration | Description |
|-------------|-------------|
| **Public API** | REST endpoints for community stats, events, and guides |
| **Telegram Bot** | Event notifications, new member welcomes, weekly digest |
| **Calendar Sync** | Google Calendar / Apple Calendar export for events |
| **Newsletter** | Weekly email digest via Resend |
| **RSS Feed** | Blog and events feeds for subscribers |

## Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Framework | [Next.js 14](https://nextjs.org/) (App Router) | SSR, ISR, API routes, file routing |
| Language | TypeScript (strict mode) | Type safety, better DX |
| Styling | Tailwind CSS | Utility-first, custom design tokens |
| UI Components | Headless UI + custom system | Accessible, unstyled primitives |
| Icons | Lucide React | Consistent, lightweight |
| Content | MDX | Blog posts and guides with React components |
| Database | Supabase (PostgreSQL) | Generous free tier, RLS, real-time |
| Auth | Supabase Auth | Magic link + Google + GitHub OAuth |
| Storage | Supabase Storage | Avatars, event images |
| Hosting | Vercel | Preview deploys, edge network |
| Analytics | Plausible | Privacy-friendly, lightweight |
| Email | Resend | Transactional + newsletter |
| Error Tracking | Sentry | Runtime error monitoring |
| CI/CD | GitHub Actions | Lint, type check, build on every PR |

## Getting Started

### Prerequisites

- Node.js 18+
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
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=istanbulnomads.com
RESEND_API_KEY=your_resend_api_key
SENTRY_DSN=your_sentry_dsn
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

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm format` | Format code with Prettier |
| `pnpm type-check` | Run TypeScript compiler check |
| `pnpm test` | Run tests |
| `pnpm db:migrate` | Run Supabase migrations |
| `pnpm db:seed` | Seed development database |
| `pnpm db:reset` | Reset and reseed database |

## Branch Strategy

| Branch | Purpose |
|--------|---------|
| `main` | Production — auto-deploys to istanbulnomads.com |
| `develop` | Integration branch — all feature PRs merge here first |
| `feature/*` | Individual features (e.g., `feature/event-rsvp`) |
| `fix/*` | Bug fixes (e.g., `fix/mobile-nav`) |

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
3. Express interest in the Telegram group — we'll invite you as a collaborator

## Related Repos

| Repo | Description |
|------|-------------|
| [community](https://github.com/istanbul-digital-nomads/community) | Guidelines, code of conduct, FAQ |
| [events](https://github.com/istanbul-digital-nomads/events) | Event planning and templates |
| [resources](https://github.com/istanbul-digital-nomads/resources) | Curated Istanbul guides |
| [.github](https://github.com/istanbul-digital-nomads/.github) | Organization profile |

## License

This project is private and not open-source. All rights reserved by Istanbul Digital Nomads community organizers.
