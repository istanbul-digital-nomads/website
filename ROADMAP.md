# Roadmap

A phased plan for building the Istanbul Digital Nomads website from MVP to full community platform.

## Phase 1 — MVP: Landing & Content Site

**Goal:** Get a beautiful, fast, SEO-optimized site live that attracts new members and serves as the community's home on the web.

**Timeline:** 2–3 weeks

### Pages
- [ ] **Homepage** — Hero with tagline, community stats (members, events, guides), featured events, quick links, join CTA
- [ ] **About** — Community story, values, team/organizers, how it started
- [ ] **Resources** — Grid of guide cards linking to detailed guides (pulled from GitHub resources repo or local MDX)
- [ ] **Events** — List of upcoming and past events with date, location, and type badges
- [ ] **Contact** — Simple form or links to Telegram, GitHub, email

### Features
- [ ] Responsive mobile-first layout
- [ ] Dark/light mode with system preference detection
- [ ] SEO meta tags, Open Graph images, sitemap.xml, robots.txt
- [ ] Plausible analytics integration
- [ ] Fast loading (target: 95+ Lighthouse score)
- [ ] Accessible (WCAG 2.1 AA)

### Technical Setup
- [ ] Next.js 14 project with App Router
- [ ] Tailwind CSS with custom design tokens
- [ ] TypeScript strict mode
- [ ] ESLint + Prettier configuration
- [ ] Vercel deployment pipeline
- [ ] GitHub Actions for CI (lint, type check, build)

---

## Phase 2 — Interactive Features

**Goal:** Add dynamic content and interactivity that gives members a reason to visit the site regularly.

**Timeline:** 3–4 weeks after Phase 1

### Features
- [ ] **Blog** — MDX-powered blog with tags, author info, and reading time
- [ ] **Event RSVP** — "I'm going" / "Maybe" buttons on event pages (requires auth)
- [ ] **Resource submission** — Form for community members to suggest new resources or updates
- [ ] **Newsletter signup** — Email collection with integration (Resend or similar)
- [ ] **Search** — Full-text search across guides, events, and blog posts
- [ ] **Event filtering** — Filter by type (meetup, coworking, workshop, social), date, neighborhood
- [ ] **Guide pages** — Individual pages for each Istanbul guide with table of contents and last-updated dates

### Technical
- [ ] Supabase setup (database, auth)
- [ ] API routes for events and RSVPs
- [ ] MDX pipeline for blog content
- [ ] Image optimization pipeline
- [ ] Error tracking (Sentry)

---

## Phase 3 — Community Platform

**Goal:** Transform the site into a living platform where members interact, connect, and organize.

**Timeline:** 4–6 weeks after Phase 2

### Features
- [ ] **User auth** — Magic link + Google + GitHub login
- [ ] **Member profiles** — Name, bio, skills, current neighborhood, links
- [ ] **Member directory** — Searchable, filterable list of community members (opt-in)
- [ ] **Dashboard** — Personal dashboard showing upcoming events, recent activity
- [ ] **Event creation** — Authenticated members can propose and manage events
- [ ] **Coworking buddy finder** — Match with nomads in the same neighborhood or with shared interests
- [ ] **Discussion threads** — Lightweight forum or Q&A on resource pages

### Technical
- [ ] Supabase Auth with RLS policies
- [ ] Real-time features (live RSVP counts, online members)
- [ ] File uploads (avatars, event images) via Supabase Storage
- [ ] Webhook integrations (Telegram bot notifications for new events)
- [ ] Rate limiting and abuse prevention
- [ ] Admin panel for moderators

---

## Phase 4 — Scale & Polish

**Goal:** Optimize, add quality-of-life features, and prepare for growth.

**Timeline:** Ongoing

### Features
- [ ] **Multi-language support** — English + Turkish
- [ ] **PWA** — Installable on mobile, offline guide access
- [ ] **Neighborhood recommendation quiz** — "Which Istanbul neighborhood is right for you?"
- [ ] **Cost of living calculator** — Interactive tool based on lifestyle choices
- [ ] **Community API** — Public API for community stats and events
- [ ] **Integrations** — Telegram bot, Slack webhook, calendar sync (Google/Apple)
- [ ] **Gamification** — Badges for event attendance, contributions, and helping newcomers

### Technical
- [ ] Performance monitoring and optimization
- [ ] A/B testing framework
- [ ] Automated backups
- [ ] Load testing
- [ ] Documentation site for API

---

## Milestones

| Milestone | Target | Status |
|-----------|--------|--------|
| Project setup & repo | Week 1 | 🟡 In progress |
| Design system & components | Week 2 | ⬜ Not started |
| MVP pages live | Week 3 | ⬜ Not started |
| Custom domain | Week 4 | ⬜ Not started |
| Blog & RSVP | Week 6 | ⬜ Not started |
| Auth & profiles | Week 9 | ⬜ Not started |
| Member directory | Week 10 | ⬜ Not started |
| Coworking buddy finder | Week 12 | ⬜ Not started |
| Multi-language | Week 14 | ⬜ Not started |
| PWA & mobile | Week 16 | ⬜ Not started |

## How to Contribute

Pick any unchecked item above, create a branch, and open a PR. For larger features, open an issue first to discuss the approach.
