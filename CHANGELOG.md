# Changelog

All notable changes to the Istanbul Digital Nomads website will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned
- Design system and base UI components (Button, Card, Input, Badge, Modal)
- Layout components (Header, Footer, MobileNav, ThemeProvider)
- Homepage with hero, stats, featured events, testimonials, CTA
- About page with story, values, team, timeline
- Guides section with MDX-rendered city guides
- Events listing page with filtering
- Contact page with form
- Blog system with MDX
- SEO optimization (meta tags, structured data, sitemap)
- CI/CD pipeline with GitHub Actions

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
| 0.1.0 | 2026-03-29 | Project setup, config files, initial homepage, documentation |

[Unreleased]: https://github.com/istanbul-digital-nomads/website/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/istanbul-digital-nomads/website/releases/tag/v0.1.0
