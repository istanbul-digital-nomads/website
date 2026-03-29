# Architecture

This document describes the technical architecture and key design decisions for the Istanbul Digital Nomads website.

## Overview

The site is a full-stack Next.js application that serves two purposes:

1. **Marketing site** — Public pages that showcase the community, resources, and events to attract new members
2. **Community platform** — Authenticated features for members to interact, RSVP to events, and manage profiles

## Tech Decisions

### Next.js 14 (App Router)

We use Next.js with the App Router for several reasons:
- Server components reduce client-side JavaScript
- Built-in API routes eliminate the need for a separate backend
- File-based routing keeps the project organized
- Excellent SEO with server-side rendering
- Incremental Static Regeneration (ISR) for content pages
- Vercel deployment is seamless

### Tailwind CSS

- Utility-first approach keeps styles consistent
- No CSS-in-JS runtime overhead
- Easy to maintain a design system with custom config
- Great developer experience with VS Code IntelliSense

### Supabase

- PostgreSQL database with a generous free tier
- Built-in auth with magic links and OAuth providers
- Row Level Security (RLS) for data protection
- Real-time subscriptions for live features
- Storage for user uploads (avatars, event images)

### MDX for Content

- Blog posts and guides are written in MDX
- Allows React components inside markdown
- Content lives in the repo (version controlled)
- Can be migrated to a CMS later if needed

## Route Groups

```
src/app/
├── (marketing)/          # Public routes (no auth required)
│   ├── page.tsx          # Homepage
│   ├── about/
│   ├── events/
│   ├── resources/
│   ├── blog/
│   └── contact/
├── (platform)/           # Authenticated routes
│   ├── dashboard/
│   ├── profile/
│   ├── events/manage/
│   └── settings/
├── api/                  # API endpoints
│   ├── events/
│   ├── members/
│   └── webhooks/
└── layout.tsx            # Root layout (shared across all routes)
```

## Data Model

### Members
```
members
├── id (uuid, PK)
├── email (text, unique)
├── display_name (text)
├── bio (text, nullable)
├── avatar_url (text, nullable)
├── location (text, nullable)        # Current neighborhood
├── skills (text[], nullable)        # e.g., ["design", "python", "marketing"]
├── website (text, nullable)
├── telegram_handle (text, nullable)
├── is_visible (boolean, default true) # Opt-in to member directory
├── created_at (timestamptz)
└── updated_at (timestamptz)
```

### Events
```
events
├── id (uuid, PK)
├── title (text)
├── description (text)
├── type (enum: meetup, coworking, workshop, social)
├── date (timestamptz)
├── end_date (timestamptz, nullable)
├── location_name (text)
├── location_address (text, nullable)
├── location_url (text, nullable)     # Google Maps link
├── capacity (integer, nullable)
├── organizer_id (uuid, FK → members)
├── image_url (text, nullable)
├── is_published (boolean, default false)
├── created_at (timestamptz)
└── updated_at (timestamptz)
```

### RSVPs
```
rsvps
├── id (uuid, PK)
├── event_id (uuid, FK → events)
├── member_id (uuid, FK → members)
├── status (enum: going, maybe, not_going)
├── created_at (timestamptz)
└── UNIQUE(event_id, member_id)
```

### Blog Posts
```
blog_posts
├── id (uuid, PK)
├── slug (text, unique)
├── title (text)
├── excerpt (text)
├── content (text)                    # MDX content
├── author_id (uuid, FK → members)
├── cover_image_url (text, nullable)
├── tags (text[])
├── is_published (boolean, default false)
├── published_at (timestamptz, nullable)
├── created_at (timestamptz)
└── updated_at (timestamptz)
```

## Component Architecture

### Design System

We use a layered component architecture:

**Base components** (`src/components/ui/`) — Unstyled, accessible primitives
- Button, Input, Card, Badge, Modal, Dropdown
- Built on Headless UI for accessibility
- Styled with Tailwind variants

**Layout components** (`src/components/layout/`) — Structural elements
- Header (with responsive nav)
- Footer
- Sidebar
- Container
- Section wrapper

**Section components** (`src/components/sections/`) — Page-level blocks
- Hero section
- Features grid
- Event cards
- Resource cards
- CTA banner
- Testimonials

### State Management

- **Server state**: React Server Components + Supabase queries
- **Client state**: React hooks (useState, useReducer) for UI state
- **Form state**: React Hook Form for form handling
- **URL state**: Next.js searchParams for filters and pagination

No global state library needed. Keep it simple.

## Performance Strategy

- Server Components by default (less client JS)
- Dynamic imports for heavy components
- Image optimization with next/image
- ISR for content pages (revalidate every hour)
- Edge middleware for redirects and geo-detection
- Plausible analytics (lightweight, no cookies)

## Security

- Supabase RLS policies on all tables
- Server-side validation for all API inputs
- CSRF protection via Next.js
- Rate limiting on API routes
- Content Security Policy headers
- No sensitive data in client bundles

## Deployment

- **Platform**: Vercel
- **Branch deploys**: Every PR gets a preview URL
- **Production**: Auto-deploy on merge to `main`
- **Environment variables**: Managed in Vercel dashboard
- **Domain**: `istanbuldigitalnomads.com` (pending setup)
