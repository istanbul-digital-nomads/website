# Changelog

All notable changes to the Istanbul Digital Nomads website will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.6.0] - 2026-04-19

### Added
- `src/lib/neighborhoods.ts` - canonical data model for the 5 canonical neighborhoods (Kadikoy, Moda, Cihangir, Besiktas, Karakoy/Galata) with verified stats (rent range, side, transport, noise, vibe, best-for tags) lifted directly from `src/content/guides/neighborhoods.mdx`. No fabricated numbers. Coworking and cafe counts are derived live from `src/lib/spaces.ts` at render time.
- 17 curated neighborhood photos under `public/images/neighborhoods/<slug>/` (hero 1600x1000 + gallery 1200x800, JPEG + WebP siblings) sourced from Wikimedia Commons under CC-BY-SA, with full per-photo attribution in `public/images/neighborhoods/attributions.json`
- `scripts/fetch-neighborhood-photos.ts` - idempotent ingestion script using sharp. Reads the manifest in `src/lib/neighborhoods.ts`, downloads each source via the Wikimedia `Special:FilePath` redirect, resizes, optimizes, and writes the attribution manifest
- `sharp@^0.34.5` added as devDependency for the ingestion script
- `src/components/sections/neighborhood-cards.tsx` - new homepage section "Where people land", 5 photo cards with side badge, rent range, one-liner, tracked-space count, and detail-page link
- `src/app/guides/neighborhoods/page.tsx` - takes over `/guides/neighborhoods` from the dynamic `[slug]` catch-all. Renders the 5-card overview grid at the top, then the existing MDX below (now with inline hero photos under each neighborhood subsection)
- `src/app/guides/neighborhoods/[neighborhood]/page.tsx` - per-neighborhood detail pages with full-bleed hero, verified stat card, gallery grid, "Coworking and cafes here" block pulling live from `spaces.ts`, Telegram CTA, and cross-links to the other neighborhoods. Full metadata + OG image per page
- `src/app/credits/page.tsx` - photo attribution page reading `attributions.json`, grouped by neighborhood, linked from the footer under Resources
- `src/components/ui/neighborhood-photo.tsx` and `src/components/ui/neighborhood-stat-card.tsx` - shared primitives
- Inline hero photo under each neighborhood heading in `src/content/guides/neighborhoods.mdx`
- 5 new routes registered in `src/app/sitemap.ts` (`/credits` + `/guides/neighborhoods/{slug}` x5)

### Changed
- `src/components/ui/mdx-components.tsx` now renders MDX `img` via `next/image` with optional caption parsing (caption after ` | ` in alt text). Uses block-styled spans rather than `figure`/`figcaption` to avoid hydration errors from markdown wrapping images in `<p>`

## [1.5.8] - 2026-04-16

### Changed
- Header logo enlarged from 36px to 44px with a subtle brand-red drop shadow so it reads clearly on both light and dark backgrounds
- About page now opens with a full-width logo hero section (200px logo with glow ring, brand name as h1, tagline) before the "Our Story" copy

## [1.5.7] - 2026-04-16

### Added
- New brand logo (`public/images/logo-light.png` + `logo-dark.png`) integrated into header, footer, and mobile menu with automatic light/dark mode switching via `next/image`

### Fixed
- Removed `Host:` directive from `robots.ts` - it's a Yandex-only extension that Google explicitly ignores (was causing "Rule ignored by Googlebot" warning in Search Console)

## [1.5.6] - 2026-04-16

### Added
- `src/lib/external-links.ts` - single source of truth for external-link policy: domain registry (64 known domains across 7 categories) + `recommendedRel()` helper that maps category to the correct rel attribute (authority/directory/news/own-social/third-party/tool/partner -> noopener noreferrer; sponsored -> sponsored noopener; ugc -> ugc noopener; low-value -> nofollow noopener)
- `<ExternalLink>` component (`src/components/ui/external-link.tsx`) for inline TSX external links - auto-applies target="_blank" + the policy-correct rel based on the domain registry, supports `category` and `rel` overrides
- `scripts/check-external-links.ts` + `pnpm check-links` script - scans MDX/TSX for external URLs, validates each against the registry, fails CI on unknown domains or non-descriptive anchor text. Skips preconnect/dns-prefetch hints and code comments.
- New CI job "External Links Policy" wired into `.github/workflows/ci.yml`
- Sources block on the expanded space card - renders `space.sources` with verification date, fixes the dead-data issue where 67 source URLs in `spaces.ts` were declared but never displayed (E-E-A-T win)
- `docs/external-links-audit.md` - full audit of all ~170 external links across the codebase, with severity-tagged findings and per-file action checklist

### Fixed
- Broken `hfrfly.com` link in `transport.mdx` (P0) - was a typo for `hava.ist` (Havaist airport bus)
- Sketchy citation in `slowmad-guide-istanbul.mdx` (P0) - removed the unverified "40 million digital nomads" stat sourced from atlys.com (a visa aggregator, not a primary research source); rewrote the lede without a fabricated number

### Changed
- `tsx@^4.19.2` added as devDependency for running TypeScript scripts in CI

## [1.5.5] - 2026-04-16

### Added
- `docs/visual-identity.md` - single source of truth for AI-generated imagery: palette lock (pulled from real Tailwind tokens), master style cards for Nano Banana / Midjourney v7 / Flux, 8 reusable scene archetypes, carousel consistency protocol, typography direction (Manrope + IBM Plex Mono), QA checklist, negative prompt snippets
- `docs/linkedin-content-calendar.md` - evidence-backed 30-day LinkedIn content calendar (Apr 16 - May 15 2026), 14 dated posts across 5 pillars, first 10 paste-ready drafts with image prompts, zero-follower launch tactics, 2026 algorithm research with cited sources, creators-to-engage list
- `docs/blog-content-calendar.md` - paired 30-day blog publishing calendar, 6 priority briefs (B1-B6) with full outlines, SEO pillar clusters, pairing map to LinkedIn posts, gap analysis against existing content

## [1.5.4] - 2026-04-15

### Added
- `blog-author` Claude Code subagent (`.claude/agents/blog-author.md`) - writes as a digital nomad living in Istanbul, strict brand voice (no em dashes, casual contractions, no marketing fluff), no fabricated evidence (no fake surveys or quotes), heavy cross-linking into guides/spaces/blog, one signature "lived here" moment per piece
- `linkedin-marketer` Claude Code subagent (`.claude/agents/linkedin-marketer.md`) - senior social-media manager persona for istanbulnomads.com, writes LinkedIn-native content (single posts, carousels, document PDFs, newsletters, polls, comment starters, outreach DMs), transforms existing site content into LinkedIn formats, follows 2026 algorithm best practices (hook mechanics, line-break formatting, native text over external links, 3-5 hashtag cap), refuses fabrication and engagement bait

## [1.5.3] - 2026-04-15

### Fixed
- `robots.txt` had a duplicate `User-agent: *` block so the intended `/api/`, `/dashboard/`, `/settings/` disallows were being ignored by Google (crawlers only read the first matching group). Replaced the static `public/robots.txt` (stale `next-sitemap` artifact) with a native Next.js `src/app/robots.ts`, merged the rules into one block, and added `/login`, `/auth/`, `/onboarding` to the disallow list. Dropped the useless Yandex-specific `Host` directive.

## [1.5.2] - 2026-04-15

### Added
- Google Analytics 4 via `@next/third-parties/google` - gated behind `NEXT_PUBLIC_GA_ID` env var so it stays off in local dev unless explicitly set. Tracks page views, sessions, geography, referrers, real-time users.

## [1.5.1] - 2026-04-15

### Fixed
- Spaces directory was showing "Unverified" on almost every card because `computeNomadScore` required wifi to be present (it's almost always null - real Mbps numbers are rare in reviews). Loosened the gate: any 3+ sourced dimensions produce a renormalized score; the badge reads "Partial Score" when not all 6 dimensions are filled. 15 of 18 spaces now display a real score.

## [1.5.0] - 2026-04-15

### Added
- `nomad-space-scorer` Claude Code subagent (`.claude/agents/nomad-space-scorer.md`) - strict no-invention rubric with cited sources of truth (Google Maps, official site, Workfrom, Coworker.com, recent Google reviews), 1-5 anchored scoring across wifi/power/comfort/noise/value/vibe, and verification metadata
- `NomadSpace` schema extended with `status`, `last_verified`, `sources`, `unverified_fields` so verified data is distinguishable from seed data
- "Unverified" pill rendered in `NomadScoreBadge` and map popup when scores aren't yet evidence-backed

### Changed
- `NomadScores` dimensions are now `number | null`; `computeNomadScore` returns `null` when wifi or power are missing and renormalizes weights over the present dimensions
- Every space in the directory re-verified against real sources (2 rounds): existence confirmed, addresses corrected (6 had wrong neighborhoods), all unsourced wifi-speed claims and TL prices removed, ~50 of 108 score slots backed by cited reviews
- Score-sort puts unscored spaces at the bottom

### Removed
- Two phantom entries (`mob-kadikoy`, `kitsune-coffee`) - no Google Maps, official site, or directory listing exists for either

## [1.4.3] - 2026-04-15

### Changed
- About page Milestones: replaced flat list with an animated vertical timeline (gradient connector, Lucide icon nodes, staggered scroll-reveal, dashed "Coming up" card)
- Smoother slower pulse on the upcoming Q2 milestone (custom 3.2s ease-in-out keyframe instead of the harsh 1s `animate-ping`)
- Path to Istanbul: replaced the empty `FeaturedGuides` slot with a "Popular paths" country grid fallback so the section is never visually empty before guides are seeded

## [1.4.2] - 2026-04-14

### Changed
- About page: replaced fabricated 2023-2025 history with the true 2026 timeline (decided Feb, idea Mar, website Apr, first meetup planned Q2)
- Updated "Our Story" copy to reflect the project's actual one-person 2026 origin
- Marked upcoming Q2 meetup with a hollow timeline dot
- Updated Ali's bio to match the true 2026 arrival

## [1.4.1] - 2026-04-14

### Changed
- Smoother OG card background gradient (linear-gradient layers instead of blurred circle that rasterized pixelated)
- OG social cards now cover every top-level route (home, about, contact, events, blog, guides, spaces, local-guides, local-guides/join) with unique copy per page

## [1.4.0] - 2026-04-14

### Added
- Dynamic OpenGraph social cards for blog posts, city guides, Path to Istanbul landing, and country pages (Claude Code Docs-style dark canvas with brand wordmark, category label, title, and description)

## [1.3.1] - 2026-04-14

### Changed
- Path to Istanbul map: click feedback with loading overlay and pulse animation so users know navigation is starting
- Prefetch supported country routes so clicks feel instant (no more 1-2s wait)
- Uber-style dashed great-circle route lines from each supported country to Istanbul
- Turkey filled in brand red to anchor the destination visually
- Constant ping animation on supported country markers to draw attention
- SEO description block on `/path-to-istanbul` covering why country-specific guides matter, what each guide covers, and who they're for

## [1.3.0] - 2026-04-14

### Added

#### Path to Istanbul
- Country-specific relocation guides with interactive world map (`/path-to-istanbul`)
- Per-country playbooks for Iran, India, Russia, Pakistan, and Nigeria (`/path-to-istanbul/[country]`)
- MapLibre world map with destination marker on Istanbul, highlighted supported countries, and "coming soon" markers for 20 other origins
- Three-section structure per country: visa/residence/documents, flights/arrival/money, housing/healthcare/community
- Sticky TOC with scrollspy on desktop, collapsible sections on mobile
- JSON-LD HowTo structured data for each country page
- Static generation via `generateStaticParams` for all supported countries
- Search + SEO-crawlable grid fallback alongside the map
- "Guides from [Country]" section with three-tier fallback: origin match → language match → recruit CTA

#### Local Guides integration
- `origin_countries` field added to `local_guides` and `guide_applications` (GIN-indexed text[])
- "Where did you move from?" multi-select in the guide application form
- Flag badges on guide cards linking to the matching country page

### Changed
- Mobile-first polish on Path to Istanbul pages: tightened hero spacing, stacked flag above title on small screens, smaller map markers to reduce overlap, always-visible "See the path" hint on touch devices
- Added `/path-to-istanbul` and country subpages to sitemap
- Added Path to Istanbul entry to the Explore nav dropdown and footer resources

## [1.2.0] - 2026-04-13

### Changed

#### Brand palette migration
- New primary color: Pomegranate Red (#C0392B) replacing terracotta (#e34b32)
- New secondary color: Navy (#2C3E50) replacing warm brown tones
- Light mode: clean #fafafa backgrounds with #1a1a2e foreground
- Dark mode: deep navy #0f1117 backgrounds with #f2f3f4 foreground
- Updated all hardcoded hex values across 30+ files
- Typography changed from Manrope to Inter
- Accent colors: warm (#f39c12), coral (#e74c3c), green (#27ae60)

#### Reveal animation rewrite
- Rewrote scroll-reveal to be CSS-first and production-safe
- Content is visible by default - JS only hides below-fold elements for animation
- Fixes invisible sections when JS fails to hydrate or intersection observers don't fire
- Renamed `.reveal` to `.reveal-hidden` for progressive enhancement

### Fixed
- Blog tag filter now reads `?tag=` from URL and pre-selects the matching tag
- Clicking a tag updates the URL to `/blog?tag=X` so filtered views are shareable
- Guide card photos now use `next/image` instead of `<img>` for automatic optimization
- Fixed stale route-progress gradient colors
- Fixed remaining old rgba color values in onboarding steps

## [1.1.0] - 2026-04-13

### Added

#### Nomad Spaces
- Interactive cafe and coworking directory (`/spaces`) with MapLibre map
- Nomad Score rating system - weighted average of wifi (25%), power (20%), comfort (15%), noise (15%), value (15%), vibe (10%)
- 21 pre-populated spaces (5 coworking + 16 cafes) with coordinates, descriptions, and scores
- Search, type filter, neighborhood filter, and sort functionality
- Color-coded map markers (green = coworking, warm = cafe) with popups
- Expandable space cards with score breakdown bars and amenity tags

#### Local Guides
- Local Guides directory page (`/local-guides`) with filtering by specialization, neighborhood, and search
- Guide application form (`/local-guides/join`) with 5-section vetting process
- Supabase tables for `local_guides` and `guide_applications` with RLS policies
- Email notification to admin on new applications via Resend

#### Dropdown navigation
- Restructured top nav from flat links to dropdown menus (Explore, Community)
- NavItem union type pattern supporting both direct links and dropdown groups
- Click-outside dismiss, chevron animation, glassmorphism dropdown panels
- Mobile menu updated to render dropdowns as section headers with flat links

### Changed

#### Performance optimization (PageSpeed 75 -> 90)
- Added `preconnect` and `dns-prefetch` for CartoCDN and Supabase CDN
- Inline theme script in `<head>` to prevent flash of unstyled content (FOUC)
- Dynamic imports for BottomTabBar, NavigationProgress, Toaster, and FAQSection
- Added `optimizePackageImports` for headlessui, sonner, supabase, react-map-gl
- Throttled scroll handler with `requestAnimationFrame` instead of every-pixel events
- Reduced `backdrop-blur-xl` to `backdrop-blur-md` on header and tab bar
- Moved body gradients to `::before` pseudo-element for deferred paint
- Removed excessive `will-change` declarations to save GPU memory
- Gated `word-rise` and float animations behind `prefers-reduced-motion`
- Faster map flyTo animation (2000ms to 800ms) and shorter marker delays
- Added `theme-color` meta tags, image format optimization (AVIF/WebP), cache headers
- Deferred Supabase auth check with `setTimeout` to avoid blocking render
- Added loading placeholder for IstanbulMap dynamic import to prevent CLS
- CLS reduced to 0, Best Practices and SEO both at 100

#### Loading skeleton
- Redesigned mobile loading skeleton with proper contrast in both light and dark modes
- Uses `neutral-200`/`neutral-700` instead of low-opacity black/white
- Proportional widths that fit mobile screens (75%, 50%, 85%, 65%)
- Removed oversized desktop-oriented layout, single column on mobile

### Fixed
- Emails not sending - installed `@react-email/render`, switched from `react:` to `html:` prop (Resend v6 breaking change)
- Mobile menu padding - duplicate `pt-` classes, used `max()` for safe-area-inset
- CI build crash - lazy-init Resend with `getResend()` to avoid crash when API key missing
- Loading skeleton invisible in dark mode on mobile

---

## [1.0.0] - 2026-04-12

### Added

#### Email system
- Resend integration for transactional emails (`resend` package)
- Branded HTML email templates (`src/lib/emails.tsx`) with warm brand palette, card layout, and footer links
- Contact form now sends formatted HTML emails to `hello@istanbulnomads.com` with reply-to set to sender
- Newsletter signup API endpoint (`/api/newsletter`) with email validation, deduplication, and welcome email
- Newsletter welcome email with links to top 3 starter guides and Telegram CTA
- Newsletter form component (`src/components/newsletter-form.tsx`) with footer variant styling
- Newsletter signup added to the footer gradient panel on every page
- `newsletter_subscribers` table type definition in database schema
- `RESEND_API_KEY` environment variable in `.env.example`

#### Error handling
- Branded error boundary (`src/app/error.tsx`) with "Try again" and "Go home" buttons, matching the 404 page style

#### SEO and sitemap
- Dynamic Next.js sitemap (`src/app/sitemap.ts`) that auto-generates from guides and blog posts data
- Proper URL priorities: homepage (1.0), guides listing (0.9), about/blog/events (0.8), individual guides (0.7), blog posts (0.6), contact (0.5)
- Sitemap auto-updates when new content is added - no build step needed

#### Onboarding improvements
- Refactored onboarding wizard with cleaner step validation and error handling
- Improved step components with better UX patterns and field-level error clearing
- Input component now supports `helperText` prop for additional field context

#### Content
- 3 new blog articles with deep cross-linking to guides
- Entertainment & Leisure guide completing all 11 city guides
- Image generation rules documentation

### Changed
- Contact form API now uses branded HTML email template instead of plain text
- `robots.txt` updated from `localhost:3000` to `istanbulnomads.com` for production
- Replaced placeholder testimonials with honest "What people find" section showing community value at week one / month one / month three+ stages
- Changed "500+ active members" stat to "Growing community" (homepage and CTA banner)
- Hero alignment and spacing cleaned up for better visual balance
- Full codebase polish pass - dark mode warm palette, gradient panels, typography consistency
- Page transitions added with View Transitions API and navigation progress bar
- Dark mode overhauled - replaced all cold neutral grays with warm brown palette
- Gradient panels now use rich terracotta-to-maroon instead of muddy fade
- Dark black panels replaced with warm terracotta gradients
- Onboarding wizard now has birthday/age toggle option
- Brand voice rules added to CLAUDE.md for consistent tone across all content
- Casual contractions standardized across all user-facing content
- Toast notification system updated with additional helper methods

### Removed
- Static `next-sitemap` postbuild step and config (`next-sitemap.config.js`)
- Old static sitemap files (`public/sitemap.xml`, `public/sitemap-0.xml`) - replaced by dynamic generation
- Placeholder testimonials with fictional names

### Fixed
- `robots.txt` and sitemap pointing to `localhost:3000` instead of production domain
- Contact form silently discarding messages (Resend integration was pending)
- CTA banner still showing "500+" placeholder count

---

## [0.2.0] - 2026-03-30

### Added
- Supabase integration: `@supabase/supabase-js` and `@supabase/ssr` installed with browser client, server client, and middleware session management
- Database schema: members, events, RSVPs, blog_posts tables with UUID PKs, enum types (event_type, rsvp_status), indexes, updated_at triggers, and auto-create member profile on signup trigger
- Row Level Security policies: members (visible/own), events (published/organizer), RSVPs (public/own), blog_posts (published/author)
- Storage buckets: `avatars` and `event-images` with public read and owner-based write policies
- Auth callback route (`/auth/callback`) for OAuth code exchange (Google Auth ready)
- Login page with Google Sign-In button and auth links in nav
- Next.js middleware (`src/middleware.ts`) for Supabase session refresh on every request
- TypeScript database types (`src/types/database.ts`) matching the schema
- SQL migration files in `supabase/migrations/`
- Structured REST API: events, members, RSVPs, blog, contact endpoints
- Typed API contracts with central models layer and validation
- Interactive MapLibre GL map with neighborhood markers and Bosphorus ferry routes
- Events page with integrated map header, pins, selection, and smart empty state
- Multi-step onboarding wizard (5 steps: About, Contact, Interests, Guidelines, Final)
- MDX guide system with all 11 city guides (Neighborhoods, Coworking, Housing, Cost of Living, Visa, Internet, Transport, Food, Healthcare, Entertainment, Culture)
- Guide search and filter functionality
- MDX blog system with search, tag filters, and 9 launch posts
- Homepage FAQ section
- `Reveal` component with IntersectionObserver-based scroll animations
- Page transitions with View Transitions API and navigation progress bar
- Mobile-first bottom tab bar with auto-hide header
- Sonner toast notification system with brand styling
- Design system components: Button, Card, Input, Textarea, Badge, Container, Section, Skeleton
- `next-sitemap` integration with auto-generated sitemap and robots.txt
- OG image generation API route (`/api/og`)
- Vercel Analytics and Speed Insights integration
- `vercel.json` with security headers and cache headers
- Test suite with Vitest and Testing Library
- CI/CD workflows for build, lint, format, and type checking

### Changed
- Homepage fully redesigned with editorial layout, hero map, trust signals, event moments, guide highlights, and refined CTA
- Typography switched from Inter to Manrope (sans) and IBM Plex Mono (mono)
- Color palette updated to warm terracotta primary, amber/coral/teal accents
- Dark mode with warm parchment palette
- Footer redesigned with dark CTA card, social icons, and feature pills
- Header with auto-hide on scroll, rounded pill nav, glowing logo dot
- All content rewritten with warm, practical community voice

### Fixed
- Client-side navigation broken by `useScrollDirection` infinite render loop
- Supabase middleware corrupting Next.js RSC flight responses
- MapLibre map zero-height and marker overlap issues
- CI lint and pnpm version conflicts

### Removed
- `src/middleware.ts` - broke client navigation
- `src/app/template.tsx` - broke client navigation
- 6 unused homepage section components replaced by inline editorial layout

---

## [0.1.0] - 2026-03-29

### Added
- Initial Next.js 14 project with App Router and TypeScript (strict mode)
- Tailwind CSS with custom design tokens
- Root layout with full SEO metadata
- Homepage hero component with Telegram CTA
- Environment variable template
- Project documentation: README, ARCHITECTURE, DESIGN, ROADMAP

### Changed
- Updated domain from `istanbuldigitalnomads.com` to `istanbulnomads.com`

---

## Version History

| Version | Date | Summary |
|---------|------|---------|
| 1.1.0 | 2026-04-13 | Nomad Spaces directory, Local Guides, dropdown nav, performance optimization (90 PageSpeed) |
| 1.0.0 | 2026-04-12 | Launch-ready - email system, newsletter, dynamic sitemap, honest social proof, error handling |
| 0.2.0 | 2026-03-30 | Full MVP - Supabase, auth, 11 guides, 9 blog posts, events, onboarding, interactive map |
| 0.1.0 | 2026-03-29 | Project setup, config files, initial homepage, documentation |

[1.1.0]: https://github.com/istanbul-digital-nomads/website/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/istanbul-digital-nomads/website/compare/v0.2.0...v1.0.0
[0.2.0]: https://github.com/istanbul-digital-nomads/website/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/istanbul-digital-nomads/website/releases/tag/v0.1.0
