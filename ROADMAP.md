# Roadmap

A detailed, implementation-ready plan for building istanbulnomads.com from MVP to full community platform. Each task is scoped small enough to be a single PR.

## Phase 1 - Foundation & Landing Site (MVP)

**Goal:** Ship a beautiful, fast, SEO-optimized site that attracts new members and serves as the community's home on the web.

**Timeline:** 2–3 weeks | **Priority:** Critical

### 1.1 Project Foundation

- [ ] Set up pnpm workspace and install all dependencies
- [ ] Configure ESLint with Next.js + TypeScript + Prettier rules
- [ ] Set up path aliases (`@/components`, `@/lib`, etc.)
- [ ] Create `src/lib/constants.ts` with site config (name, description, URLs, social links, nav items)
- [ ] Create `src/lib/utils.ts` with `cn()` helper (already done), `formatDate()`, `truncate()`
- [x] Set up Vercel Analytics and Speed Insights in root layout
- [ ] Set up Plausible analytics script in root layout
- [ ] Configure `next-sitemap` for automatic sitemap.xml and robots.txt
- [ ] Create favicon set and app icons in `/public`
- [ ] Set up Open Graph image generation (default + per-page)

### 1.2 Design System & Base Components

- [ ] **Button** - Primary, secondary, ghost, danger variants + sm/md/lg sizes + loading state
- [ ] **Card** - Base card with hover shadow, optional image header, footer slot
- [ ] **Input** - Text, email, textarea variants with label, error state, helper text
- [ ] **Badge** - Event type badges (meetup=blue, coworking=green, workshop=purple, social=amber)
- [ ] **Container** - Max-width wrapper with responsive padding
- [ ] **Section** - Vertical section wrapper with consistent spacing
- [ ] **Modal** - Headless UI dialog with overlay, close button, size variants
- [ ] **Dropdown** - Headless UI menu with hover/click trigger
- [ ] **Skeleton** - Loading skeleton for cards, text, avatars
- [ ] **Toast** - Success/error notification toast component

### 1.3 Layout Components

- [ ] **Header** - Logo, desktop nav, mobile hamburger menu, dark mode toggle, CTA button
- [ ] **Footer** - Logo, nav columns (Community, Resources, Connect), social icons, copyright
- [ ] **MobileNav** - Slide-over navigation for small screens
- [ ] **ThemeProvider** - Dark/light mode with system preference detection + localStorage persistence
- [ ] **Breadcrumbs** - Auto-generated from route segments
- [ ] **ScrollToTop** - Subtle button on long pages

### 1.4 Homepage (`/`)

- [ ] **Hero section** - Large heading "Your community in Istanbul", subtext, "Join on Telegram" primary CTA + "Explore guides" secondary CTA, hero image/illustration
- [ ] **Stats bar** - Community member count, events hosted, guides published, neighborhoods covered (animated counters on scroll)
- [ ] **Featured events** - 3 upcoming event cards with date, type badge, location, RSVP count
- [ ] **Guide highlights** - 4 most popular guides as cards with icons
- [ ] **How it works** - 3-step visual: Join Telegram → Come to a meetup → Become part of the community
- [ ] **Testimonials** - 3 quotes from community members with name, photo, role
- [ ] **CTA banner** - "Ready to join?" full-width section with Telegram link
- [ ] **Newsletter signup** - Email input + "Subscribe" in footer area

### 1.5 About Page (`/about`)

- [ ] **Story section** - How the community started, why Istanbul, the mission
- [ ] **Values grid** - 4 cards: Inclusive, Helpful, Authentic, Fun
- [ ] **Team section** - Organizer cards with photo, name, role, links
- [ ] **Timeline** - Community milestones (founded, first event, 100 members, website launch)
- [ ] **Join CTA** - Telegram link and contributing info

### 1.6 Guides Section (`/guides`)

- [ ] **Guides grid page** - Card for each of the 10 guides with icon, title, description, "Read guide" link
- [ ] **Individual guide pages** (`/guides/[slug]`) - MDX rendered with table of contents, last updated date, related guides sidebar
- [ ] **Guide MDX components** - Custom components for tips, warnings, price tables, neighborhood ratings
- [ ] Import/sync content from GitHub resources repo into MDX files
- [ ] Add structured data (FAQ schema) for SEO on guide pages

### 1.7 Events Page (`/events`)

- [ ] **Events listing page** - Tabs for "Upcoming" and "Past" events
- [ ] **EventCard** component - Date, title, type badge, location, organizer, RSVP count
- [ ] **Event filters** - Filter by type (meetup, coworking, workshop, social), date range
- [ ] **Event detail page** (`/events/[id]`) - Full description, map embed, organizer info, RSVP button (Phase 2), related events
- [ ] **Empty state** - Friendly message when no upcoming events + link to propose one

### 1.8 Contact Page (`/contact`)

- [ ] **Contact form** - Name, email, message fields with Resend integration
- [ ] **Quick links** - Telegram, GitHub, email cards
- [ ] **FAQ accordion** - Top 5 questions from community FAQ

### 1.9 SEO & Performance

- [ ] Meta tags on every page (title, description, OG image, Twitter card)
- [ ] Structured data (Organization, Event, Article schemas)
- [ ] sitemap.xml auto-generation
- [ ] robots.txt configuration
- [ ] Lighthouse audit - target 95+ on all metrics
- [ ] WCAG 2.1 AA accessibility pass
- [ ] Canonical URLs on all pages

### 1.10 CI/CD & Deployment

- [x] GitHub Actions workflow: lint -> type-check -> build on every PR
- [x] Vercel project configuration (`vercel.json` with security headers, cache rules, clean URLs)
- [x] Vercel Analytics and Speed Insights integration
- [x] Node.js version pinned via `.nvmrc`
- [x] `.vercelignore` for optimized deploy uploads
- [x] Security hardening (`poweredByHeader: false`, security headers)
- [ ] Vercel project setup with environment variables in dashboard
- [ ] Preview deployments on PRs to `develop`
- [ ] Production deploy on merge to `main`
- [ ] Custom domain setup (istanbulnomads.com -> Vercel)

---

## Phase 2 - Content & Interactivity

**Goal:** Add dynamic content and engagement features that give members a reason to visit regularly.

**Timeline:** 3–4 weeks after Phase 1 | **Priority:** High

### 2.1 Blog System

- [ ] **Blog listing page** (`/blog`) - Post cards with cover image, title, excerpt, author, date, tags, reading time
- [ ] **Blog post page** (`/blog/[slug]`) - MDX rendered with cover image, author bio, share buttons, related posts
- [ ] **Blog MDX components** - Code blocks with syntax highlighting, callouts, embedded tweets, image galleries
- [ ] **Tag filtering** - Filter posts by tag (istanbul, remote-work, events, guides, interviews)
- [ ] **Author pages** - Posts by a specific author
- [ ] **RSS feed** (`/feed.xml`) - Auto-generated from blog posts
- [ ] Write 3 launch blog posts: "Welcome to Istanbul Nomads", "Top 5 Coworking Spaces", "Getting Your Residence Permit"

### 2.2 Supabase Setup

- [ ] Create Supabase project
- [ ] Write SQL migrations for: members, events, rsvps, blog_posts tables
- [ ] Set up Row Level Security (RLS) policies
- [ ] Create seed data for development
- [ ] Set up Supabase client (browser + server) with TypeScript types auto-generated
- [ ] Configure Supabase Auth providers (email magic link, Google, GitHub)

### 2.3 Event RSVP System

- [ ] **RSVP button** - "Going" / "Maybe" / "Can't make it" on event detail pages
- [ ] **RSVP count** - Live attendee count on event cards
- [ ] **Attendee list** - Show who's going (with opt-in visibility)
- [ ] **API routes** - `POST /api/rsvp`, `DELETE /api/rsvp`, `GET /api/events/[id]/rsvps`
- [ ] **Auth gate** - Prompt login before RSVP

2.4 Newsletter System

- [ ] Resend integration for transactional emails
- [ ] Newsletter signup API route
- [ ] Double opt-in confirmation email
- [ ] Welcome email template
- [ ] Unsubscribe handling
- [ ] Weekly digest template (upcoming events, new blog posts, new guides)

### 2.5 Search

- [ ] **Search page** (`/search`) - Full-text search across guides, events, and blog posts
- [ ] **Search bar** - In header with Cmd+K shortcut
- [ ] **Search API** - Supabase full-text search with ranking
- [ ] **Search results** - Grouped by type (guides, events, blog) with highlighted matches

### 2.6 Error Tracking & Monitoring

- [ ] Sentry integration for runtime error tracking
- [ ] Custom error boundary with friendly error page
- [ ] 404 page with search and popular links
- [ ] API error logging and alerting

---

## Phase 3 - Community Platform

**Goal:** Transform the site into a living platform where members interact, connect, and organize.

**Timeline:** 4–6 weeks after Phase 2 | **Priority:** Medium

### 3.1 Authentication

- [ ] Login page with magic link + Google + GitHub buttons
- [ ] Auth callback handling
- [ ] Session management with Supabase middleware
- [ ] Protected route middleware for (platform) routes
- [ ] Onboarding flow after first login (set display name, neighborhood, bio)

### 3.2 Member Profiles

- [ ] **Profile page** (`/members/[username]`) - Avatar, bio, skills, neighborhood, links, events attended, blog posts
- [ ] **Edit profile** - Form with avatar upload, all fields editable
- [ ] **Profile visibility** - Toggle to appear in member directory
- [ ] **Avatar upload** - Supabase Storage with image resizing

### 3.3 Member Directory

- [ ] **Directory page** (`/members`) - Grid of member cards with avatar, name, skills, neighborhood
- [ ] **Filters** - By neighborhood, skills, "online now" status
- [ ] **Search** - Search by name, skills, bio text
- [ ] **Pagination** - Cursor-based pagination for large member lists

### 3.4 Event Management

- [ ] **Create event** (`/events/create`) - Form with title, description, type, date/time, location, capacity, cover image
- [ ] **Edit event** (`/events/[id]/manage`) - Edit all fields, view RSVPs, cancel event
- [ ] **Event moderation** - Admin approval for new events before publishing
- [ ] **Recurring events** - Support for weekly/monthly recurring events

### 3.5 Dashboard

- [ ] **Personal dashboard** (`/dashboard`) - Welcome message, upcoming RSVPs, recent blog posts, community activity
- [ ] **Quick actions** - "Create event", "Edit profile", "Browse members"
- [ ] **Activity feed** - New events, new members, new blog posts

### 3.6 Discussion & Comments

- [ ] **Comments on blog posts** - Threaded comments with auth
- [ ] **Comments on events** - Pre-event questions and post-event discussion
- [ ] **Moderation tools** - Report, hide, delete comments (admin only)

### 3.7 Telegram Integration

- [ ] Webhook for new event notifications → Telegram group
- [ ] Webhook for new member welcome messages
- [ ] Weekly digest bot post (upcoming events, new guides)

---

## Phase 4 - Interactive Tools & Growth

**Goal:** Add unique tools that make Istanbul Nomads the go-to resource for nomads, and prepare for scale.

**Timeline:** Ongoing after Phase 3 | **Priority:** Nice to have

### 4.1 Neighborhood Quiz

- [ ] **Quiz page** (`/tools/neighborhood-quiz`) - 8–10 lifestyle questions (budget, vibe, transport, nightlife, etc.)
- [ ] **Results page** - Top 3 neighborhood recommendations with guide links
- [ ] **Shareable results** - OG image with results for social sharing
- [ ] **Data-driven** - Scoring matrix based on real neighborhood data

### 4.2 Cost of Living Calculator

- [ ] **Calculator page** (`/tools/cost-calculator`) - Interactive sliders for rent, food, transport, coworking, social
- [ ] **Results breakdown** - Monthly total with comparison to other nomad cities
- [ ] **Lifestyle presets** - Budget, moderate, comfortable
- [ ] **Data source** - Real prices updated quarterly

### 4.3 Coworking Buddy Finder

- [ ] **Buddy finder page** (`/tools/buddy-finder`) - Set your neighborhood, preferred times, interests
- [ ] **Match list** - Members near you with shared interests
- [ ] **Connect button** - Send a "let's cowork" message (via Telegram deeplink)

### 4.4 Internationalization

- [ ] i18n setup with `next-intl`
- [ ] English (default) + Turkish translations
- [ ] Language switcher in header
- [ ] Translated guide content for Turkish audience

### 4.5 PWA & Mobile

- [ ] Web app manifest
- [ ] Service worker for offline guide access
- [ ] Push notifications for event reminders
- [ ] App-like navigation on mobile

### 4.6 Public API

- [ ] REST API documentation page (`/api/docs`)
- [ ] Public endpoints: community stats, upcoming events, guides list
- [ ] API key authentication for third-party integrations
- [ ] Rate limiting (100 requests/minute)

### 4.7 Gamification

- [ ] **Badges** - "First Meetup", "5 Events", "Guide Contributor", "Buddy Finder"
- [ ] **Streak tracking** - Weekly event attendance streaks
- [ ] **Leaderboard** - Most active members (opt-in)

---

## Implementation Order

For anyone picking up tasks, here's the recommended order to build features. Each item maps to a section above.

```
1.1  Project Foundation
1.2  Design System & Base Components
1.3  Layout Components
1.4  Homepage
1.5  About Page
1.6  Guides Section
1.7  Events Page
1.8  Contact Page
1.9  SEO & Performance
1.10 CI/CD & Deployment
 ── LAUNCH MVP ──
2.2  Supabase Setup
2.1  Blog System
2.3  Event RSVP System
2.4  Newsletter System
2.5  Search
2.6  Error Tracking
 ── LAUNCH V2 ──
3.1  Authentication
3.2  Member Profiles
3.3  Member Directory
3.5  Dashboard
3.4  Event Management
3.6  Discussion & Comments
3.7  Telegram Integration
 ── LAUNCH V3 ──
4.1  Neighborhood Quiz
4.2  Cost of Living Calculator
4.3  Coworking Buddy Finder
4.4  Internationalization
4.5  PWA & Mobile
4.6  Public API
4.7  Gamification
```

## Milestones

| Milestone | Target | Status |
|-----------|--------|--------|
| Project setup & repo structure | Week 1 | ✅ Done |
| Domain purchased (istanbulnomads.com) | Week 1 | ✅ Done |
| Design system & base components | Week 2 | ⬜ Not started |
| Homepage & layout live | Week 3 | ⬜ Not started |
| All MVP pages complete | Week 4 | ⬜ Not started |
| Custom domain + production deploy | Week 4 | ⬜ Not started |
| Blog system live | Week 6 | ⬜ Not started |
| Event RSVP working | Week 7 | ⬜ Not started |
| Search & newsletter | Week 8 | ⬜ Not started |
| Auth & member profiles | Week 10 | ⬜ Not started |
| Member directory | Week 11 | ⬜ Not started |
| Event management | Week 12 | ⬜ Not started |
| Interactive tools | Week 15 | ⬜ Not started |
| i18n (EN + TR) | Week 17 | ⬜ Not started |
| PWA & mobile | Week 18 | ⬜ Not started |

## How to Contribute

1. Pick any unchecked item above
2. Create a branch from `develop`: `git checkout -b feature/your-feature`
3. Implement the feature with tests
4. Open a PR targeting `develop` with a clear description
5. For larger features, open an issue first to discuss the approach
