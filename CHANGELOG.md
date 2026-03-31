# Changelog

All notable changes to the Istanbul Digital Nomads website will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned
- Blog system with MDX content rendering
- Supabase database setup and auth integration
- Event RSVP system
- Member profiles and directory

### Added
- Supabase integration: `@supabase/supabase-js` and `@supabase/ssr` installed with browser client, server client, and middleware session management
- Database schema: members, events, RSVPs, blog_posts tables with UUID PKs, enum types (event_type, rsvp_status), indexes, updated_at triggers, and auto-create member profile on signup trigger
- Row Level Security policies: members (visible/own), events (published/organizer), RSVPs (public/own), blog_posts (published/author)
- Storage buckets: `avatars` and `event-images` with public read and owner-based write policies
- Auth callback route (`/auth/callback`) for OAuth code exchange (Google Auth ready)
- Next.js middleware (`src/middleware.ts`) for Supabase session refresh on every request
- TypeScript database types (`src/types/database.ts`) matching the schema
- SQL migration files in `supabase/migrations/` (001_initial_schema.sql, 002_storage_buckets.sql)
- Vercel environment variables configured: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` on all environments
- `Reveal` component (`src/components/ui/reveal.tsx`) - IntersectionObserver-based scroll reveal with staggered delay support (0-4 steps), threshold 0.16, and one-shot animation
- Route transition system: `template.tsx` with progress bar and fade-up entry animation, `loading.tsx` with branded skeleton matching the editorial layout
- CSS scroll-reveal system: `.reveal`, `.reveal-visible`, `.reveal-delay-{0-4}` classes with `translate3d` + `scale` transforms, 720ms cubic-bezier easing, and mobile-optimized 560ms durations
- CSS `.animate-drift` and `.animate-drift-delayed` keyframe utilities for subtle vertical drift
- CSS `.animate-sweep` and `.animate-marker-pulse` keyframe utilities for hero map-line motion and location-marker pulses
- CSS `.animate-map-route` keyframe utility for animated Bosphorus route strokes in the homepage hero map
- CSS route animations: `.route-shell`, `.route-progress`, `.route-enter`, `.loading-bar` keyframes with mobile-optimized durations
- Design system components: Button (4 variants, 3 sizes, loading state), Card (with header/footer/image slots), Input and Textarea (with labels, errors, helper text), Badge (event type colors), Container, Section, Skeleton
- Mobile-first bottom tab bar (`src/components/layout/bottom-tab-bar.tsx`) - 5 fixed tabs (Home, Guides, Events, Community, Menu) with active dot indicator, glass backdrop, safe-area padding for notch devices, entrance animation. Hidden on desktop.
- Full-screen mobile menu overlay (`src/components/layout/mobile-menu-overlay.tsx`) - replaces old side drawer. Slides up from bottom, large touch targets, segmented theme toggle (Light/Dark/Auto), social links, CTA. Headless UI Dialog for accessibility.
- `useScrollDirection` hook (`src/hooks/use-scroll-direction.ts`) - tracks scroll direction with 5px dead-zone, returns `{ direction, scrolled, atTop }`
- Interactive MapLibre GL map (`src/components/ui/istanbul-map.tsx`) - real vector tile map of Istanbul via OpenFreeMap (free, no API key). 5 animated neighborhood markers with hover tooltips, Bosphorus ferry route lines with glow, bottom overlay panel, custom-styled controls, dark mode support via style switching
- CSS `.tap-highlight` utility for native-app press feedback (active:scale-0.97)
- CSS `@keyframes slide-up-bar` animation for tab bar entrance
- MapLibre canvas warm filter (`.map-canvas-warm`, `.map-canvas-dark`) shifting cold map tiles toward the terracotta brand palette
- Layout: Header with responsive nav and dark mode toggle, Footer with dark CTA card and social icons, ThemeProvider (light/dark/system with localStorage persistence)
- Homepage sections: Hero with gradient background, Stats bar (4 metrics), Featured Events (3 cards), Guide Highlights (4 cards), How It Works (3 steps), Testimonials (3 quotes), CTA Banner
- About page: Story section, Values grid (4 cards), Team section (3 members), Timeline (6 milestones)
- Guides section: Grid page with 10 city guide cards, dynamic `[slug]` pages with static generation
- Events page: Listing with upcoming/past tabs, type filters (meetup/coworking/workshop/social), event cards with badges
- Contact page: Form (name/email/message), Quick links (Telegram/GitHub/Email), FAQ section (5 items)
- Blog placeholder page
- Custom 404 page with navigation links
- Site config and constants (`src/lib/constants.ts`) with nav items, social links, footer nav, event types
- Utility functions: `formatDate()`, `formatDateShort()`, `truncate()` in `src/lib/utils.ts`
- Sample data module (`src/lib/data.ts`) with guides and events
- `next-sitemap` integration with auto-generated sitemap.xml and robots.txt on build
- OG image generation API route (`/api/og`) with dynamic title and description
- Dynamic favicon (`icon.tsx`) and Apple touch icon (`apple-icon.tsx`)
- `.eslintrc.json` with Next.js strict config (fixes CI lint failure)
- Vercel Analytics integration (`@vercel/analytics`) for visitor tracking and page views
- Vercel Speed Insights integration (`@vercel/speed-insights`) for Core Web Vitals monitoring
- `vercel.json` with security headers and cache headers for static assets
- `.vercelignore` to exclude non-essential files from deployments
- `.nvmrc` to pin Node.js 20 for consistent builds across environments
- Vercel environment variable placeholders in `.env.example`

### Changed
- Root layout now includes ThemeProvider, Header, Footer, Analytics, and SpeedInsights
- Switched typography from Inter to Manrope (sans) and IBM Plex Mono (mono) with CSS variable fonts (`--font-sans`, `--font-mono`)
- Homepage wrapped in `Reveal` components for scroll-triggered entrance animations with staggered delays across hero, events, guides, testimonials, and CTA sections
- Section component now wraps children in `Reveal` for automatic scroll animation on all pages
- Homepage hero redesigned into a cleaner single-plane composition with a shorter "Build your Istanbul base, faster" headline, tighter copy, and a stronger Istanbul side-selection visual anchored around Kadikoy / Moda and Galata / Beyoglu
- Hero art direction simplified to remove stacked widget clutter in favor of one editorial visual plane with side cards, Bosphorus rhythm framing, and clearer trust messaging
- Hero comparison panel restructured into a stable top-and-bottom internal layout after live preview review, preventing overlapping cards and copy collisions across desktop breakpoints
- Homepage hero visual shifted from an abstract comparison board to a real Istanbul-inspired map composition with animated routes and labeled districts
- Homepage hero map refined again into a more literal Bosphorus composition with visible shoreline masses, stronger district placement, and clearer European-versus-Asian side reading
- Homepage stats, testimonials, and local-knowledge blocks now use more deliberate stagger and hover polish for smoother page rhythm
- Homepage fully redesigned with editorial layout - hero with trust signal pills, orientation steps (Arrive/Settle/Belong), neighborhood visualization panel, event moment descriptions, guide quick links, testimonials with location context, local knowledge panel, and refined CTA copy
- Header now auto-hides on scroll down and reappears on scroll up (mobile only, via `useScrollDirection` hook). Hamburger menu button removed, replaced by bottom tab bar.
- Header restyled with rounded pill navigation, glowing logo dot, scroll-aware shrink and shadow, updated subtitle ("Remote life, local rhythm"), and smoother transitions including transform for auto-hide
- Header link prefetch enabled for faster navigation
- Root layout includes `<BottomTabBar />` after Footer, main content gets `pb-16 md:pb-0` for tab bar clearance
- Footer copyright section gets extra bottom padding on mobile (`pb-20 md:pb-6`) for tab bar clearance
- Homepage hero SVG map replaced with real interactive MapLibre map widget (dynamically imported with `ssr: false`). Markers have alternating label sides to prevent overlap, tooltips appear above markers.
- Map tiles filtered with CSS sepia/hue-rotate to match Turkey Red brand palette. Warm radial gradient overlay adds terracotta/amber tints.
- Map min-height reduced from 520px to 380px on mobile for less vertical scroll
- Old `mobile-nav.tsx` side drawer deleted, replaced by `mobile-menu-overlay.tsx`
- Global CSS overhauled - warm parchment palette (`#f5efe4` light / `#07111d` dark), Istanbul-inspired radial gradients (terracotta/amber/teal), `.bg-grid`, `.bg-noise`, `.eyebrow`, `.surface-blur`, `.surface-panel` (primary-tinted borders), `.surface-subtle`, `.text-muted` utility classes, scroll-reveal system, drift animations, route transition keyframes, float/pulse-line animations, mobile animation durations, and `prefers-reduced-motion` support (disables all animations including reveal transforms)
- Tailwind color palette updated to terracotta/warm primary (`#e34b32` base), amber accent (`#d49a45`), coral accent (`#ff7b61`), teal accent (`#2f8f7b`), with font family using CSS variables
- Badge colors updated to match warm palette - meetup (primary), coworking (teal), workshop (amber), social (coral)
- Button primary variant shadow updated to warm terracotta tint; secondary variant uses primary-tinted borders
- Card hover effect enhanced with lift transform, primary-tinted border, and warm shadow
- Contact form success state restyled with primary-tinted colors
- Events page tabs and filters restyled with rounded pills and warm color palette
- Footer redesigned with dark CTA card (Telegram join + guide link, feature pills), social icon row, and updated copyright tagline
- Site description and OG/Twitter meta descriptions rewritten with action-oriented copy focused on coworking, guides, and local answers
- `siteConfig.shortName` updated from "Istanbul Nomads" to "Istanbul Digital Nomads" for brand consistency
- Homepage hero headline updated to "Build a real digital life in Istanbul, faster" with ferry-friendly city logic subtitle
- Homepage copy refined - dynamic next-event trust signal, tightened CTA wording, added descriptive context to testimonials and event cards
- OG image, favicon, and Apple icon updated to terracotta gradient matching the warm brand palette
- Added `metadataBase` to root layout metadata for proper OG URL resolution
- Added `poweredByHeader: false` and `compress: true` to `next.config.mjs`
- Added `postbuild` script for sitemap generation
- Pinned `packageManager` field in `package.json` for reproducible installs

### Fixed
- CI lint failure caused by missing `.eslintrc.json` - added Next.js strict config
- CI pnpm version conflict - removed hardcoded `version: 9` from GitHub Actions workflow so it reads from `packageManager` field in `package.json` automatically
- Reveal component not triggering for above-the-fold content - added `getBoundingClientRect` check on mount, lowered threshold to 0.05
- MapLibre map zero-height issue - changed container to `absolute inset-0` positioning so canvas gets real dimensions
- Map marker overlaps (Kadikoy/Moda) - spread coordinates further apart, added alternating `labelSide` property, tooltips now appear above markers

---

## [0.1.0] - 2026-03-29

### Added
- Initial Next.js 14 project with App Router and TypeScript (strict mode)
- Tailwind CSS with custom design tokens (primary blue palette, accent colors, Inter font)
- PostCSS configuration with Tailwind and Autoprefixer
- TypeScript configuration with strict mode, bundler resolution, and `@/*` path alias
- Next.js configuration with Supabase image optimization and package imports
- Global CSS with Tailwind layers, CSS variables for light/dark mode
- Utility function `cn()` for merging Tailwind classes (clsx + tailwind-merge)
- Root layout with Inter font, full SEO metadata (title, description, keywords, OpenGraph, Twitter card)
- Homepage hero component with heading, description, Telegram CTA, and Learn More link
- Environment variable template (`.env.example`) for Supabase, site URL, and Plausible analytics
- `.gitignore` for Node.js, Next.js, environment files, and IDE configs
- `package.json` with Next.js 14, React 18, Headless UI, Lucide React, and dev tooling
- Project documentation: README, ARCHITECTURE, DESIGN, ROADMAP
- Comprehensive design system documentation (colors, typography, spacing, components)
- Technical architecture documentation (route groups, data models, component architecture)

### Changed
- Updated domain from `istanbuldigitalnomads.com` to `istanbulnomads.com` across all files
- Updated README with comprehensive service coverage and branch strategy
- Updated ROADMAP with detailed, implementation-ready task breakdown
- Updated ARCHITECTURE deployment section with new domain

---

## Version History

| Version | Date | Summary |
|---------|------|---------|
| 0.2.0 | 2026-03-30 | Phase 1 MVP - design system, layout, all pages, Vercel setup |
| 0.1.0 | 2026-03-29 | Project setup, config files, initial homepage, documentation |

[Unreleased]: https://github.com/istanbul-digital-nomads/website/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/istanbul-digital-nomads/website/releases/tag/v0.1.0
