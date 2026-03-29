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
- Design system components: Button (4 variants, 3 sizes, loading state), Card (with header/footer/image slots), Input and Textarea (with labels, errors, helper text), Badge (event type colors), Container, Section, Skeleton
- Layout: Header with responsive nav and dark mode toggle, Footer with 4-column nav and social icons, MobileNav slide-over panel, ThemeProvider (light/dark/system with localStorage persistence)
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
- Homepage fully redesigned with editorial layout - hero with animated grid/noise background, neighborhood visualization panel, inline stats, event cards, guide cards, testimonials, and CTA sections
- Header restyled with rounded pill navigation, glowing logo dot, mono subtitle, and frosted glass background
- Global CSS overhauled - warm parchment palette (`#f5efe4` light / `#07111d` dark), subtle radial gradient backgrounds, `.bg-grid`, `.bg-noise`, `.eyebrow`, `.surface-blur`, `.text-muted` utility classes, and float/pulse-line keyframe animations
- Added `metadataBase` to root layout metadata for proper OG URL resolution
- Added `poweredByHeader: false` and `compress: true` to `next.config.mjs`
- Added `postbuild` script for sitemap generation
- Pinned `packageManager` field in `package.json` for reproducible installs

### Fixed
- CI lint failure caused by missing `.eslintrc.json` - added Next.js strict config
- CI pnpm version conflict - removed hardcoded `version: 9` from GitHub Actions workflow so it reads from `packageManager` field in `package.json` automatically

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
