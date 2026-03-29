# Istanbul Digital Nomads — Website

The official website for the Istanbul Digital Nomads community. A full-stack web application built with **Next.js 14**, **Tailwind CSS**, and **TypeScript**.

> **This is a private repo.** The website source code is maintained by core contributors. If you'd like to contribute, reach out in the [community repo](https://github.com/istanbul-digital-nomads/community).

## Live Site

🌐 Coming soon — `istanbuldigitalnomads.com`

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | [Next.js 14](https://nextjs.org/) (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| UI Components | Headless UI + custom components |
| Icons | Lucide React |
| Content | MDX for guides and blog posts |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth (magic link + OAuth) |
| Hosting | Vercel |
| Analytics | Plausible (privacy-friendly) |

## Features

### Phase 1 — Landing & Content (MVP)
- [ ] Homepage with hero, community stats, and CTA
- [ ] About page with community story and values
- [ ] Resources page pulling from GitHub guides
- [ ] Events page with upcoming/past events
- [ ] Responsive design (mobile-first)
- [ ] SEO optimized with meta tags, OG images
- [ ] Dark/light mode toggle

### Phase 2 — Interactive Features
- [ ] Member directory (opt-in profiles)
- [ ] Event RSVP system
- [ ] Resource submission form
- [ ] Blog with MDX posts
- [ ] Newsletter signup (Telegram + email)
- [ ] Search across guides and resources

### Phase 3 — Community Platform
- [ ] User authentication (magic link + Google/GitHub OAuth)
- [ ] Member dashboard
- [ ] Event creation and management
- [ ] Community forum or discussion board
- [ ] Coworking buddy finder
- [ ] Neighborhood recommendations engine
- [ ] API for community data

## Getting Started

### Prerequisites
- Node.js 18+
- pnpm (recommended) or npm
- Supabase account (for database features)

### Installation

```bash
# Clone the repo
git clone git@github.com:istanbul-digital-nomads/website.git
cd website

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
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=istanbuldigitalnomads.com
```

## Project Structure

```
website/
├── public/              # Static assets (images, fonts, favicons)
├── src/
│   ├── app/             # Next.js App Router pages
│   │   ├── (marketing)/ # Public pages (home, about, resources)
│   │   ├── (platform)/  # Authenticated pages (dashboard, profile)
│   │   ├── api/         # API routes
│   │   └── layout.tsx   # Root layout
│   ├── components/      # Reusable UI components
│   │   ├── ui/          # Base components (Button, Card, Input)
│   │   ├── layout/      # Layout components (Header, Footer, Nav)
│   │   └── sections/    # Page sections (Hero, Features, CTA)
│   ├── lib/             # Utilities, helpers, config
│   │   ├── supabase/    # Supabase client and helpers
│   │   └── utils.ts     # General utilities
│   ├── content/         # MDX content (blog posts, guides)
│   ├── hooks/           # Custom React hooks
│   ├── types/           # TypeScript type definitions
│   └── styles/          # Global styles
├── .env.example         # Environment variable template
├── next.config.mjs      # Next.js configuration
├── tailwind.config.ts   # Tailwind CSS configuration
├── tsconfig.json        # TypeScript configuration
└── package.json         # Dependencies and scripts
```

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm format` | Format code with Prettier |
| `pnpm test` | Run tests |

## Contributing

This is a private repo for core contributors. To get involved:

1. Join the [community Telegram](https://t.me/istanbul_digital_nomads)
2. Check the [community repo](https://github.com/istanbul-digital-nomads/community) for contributing guidelines
3. Express interest in the Telegram group — we'll invite you as a collaborator

### Development Workflow

1. Create a feature branch from `main`
2. Make your changes
3. Open a PR with a clear description
4. Get at least one review
5. Merge to `main` (auto-deploys to Vercel)

## License

This project is private and not open-source. All rights reserved by Istanbul Digital Nomads community organizers.
