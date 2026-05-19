# Istanbul Nomads — Product

> The canonical source of truth for what this product **is**, who it's for, how
> the loop works, and which surfaces serve which job. If something in another
> doc disagrees with this one, this one wins until updated.
>
> Companion docs (more granular, sometimes older):
> [README](README.md) (dev setup) ·
> [DESIGN](DESIGN.md) (visual system) ·
> [CHANGELOG](CHANGELOG.md) (release history) ·
> [CLAUDE](CLAUDE.md) (writing-style + git rules) ·
> [docs/](docs/) (per-feature working notes)

---

## 1 · One-liner

**Istanbul Nomads is a place-based community platform for people working
remotely from Istanbul for the one-to-six-month version of their stay.**

Made in Kadıköy. Disguised as a guide site, runs as a daily community board.

---

## 2 · Audience

| Cohort | What they're doing | What the site does for them |
|---|---|---|
| **Pre-arrival** (next 30 days) | Picking a neighborhood, sorting visas, costing it out | `/guides`, `/guides/neighborhoods`, `/path-to-istanbul`, `/spaces`, `/relocation-agent` |
| **First week here** | Wifi, SIM, ferry, where to work today | `/today`, `/tools/first-week-planner`, `/spaces`, `/events` |
| **Settled for 1-6 months** | Finding people, joining a thing tonight, hosting | `/today`, `/plans`, `/members`, `/circles`, `/events`, `/perks` |
| **Locals who help** | Hosting walks, dinners, breakfasts | `/local-guides`, `/plans/new` as a guide |

We're not targeting tourists, retirees, week-long vacationers, or aggregator
traffic. The one-to-six-month nomad is the central archetype; every feature
gets judged against "would this help that person tomorrow morning?"

---

## 3 · The problem we solve

Existing options fail in different ways:

- **Aggregator nomad sites** ("Nomad List", reddit threads) — generic, dated,
  not on the ground in Istanbul, no local accountability
- **Tourism guides** — written for a 4-day visit, useless for someone setting
  up a phone plan
- **Generic coworking apps** — don't know that Kadıköy and Cihangir are not
  the same problem
- **Discord / Telegram** — works for hanging out, doesn't survive search;
  every newcomer asks the same five questions in week one
- **Meetup / Eventbrite** — too heavy a commitment for "I'll be at Karga at
  6, drop by"

What we do that nobody else does:

1. **Map-first, place-anchored.** Plans, members, spaces, events all hang off
   real Istanbul coordinates. The homepage hero is the city, alive.
2. **Daily board, not a calendar.** `/today` is the page members actually
   come back to — what's on tonight, who's hosting, where's the open seat.
3. **Plans-not-meetups vocabulary.** "I'll be at Karga at 6" is a plan you
   can drop into. RSVP is optional, cap is honest, host is real.
4. **Real ground truth.** Every space has a verified-on date and source
   links. No fabricated wifi speeds. No invented prices.
5. **Made in Kadıköy.** First-person voice. The guides are written by people
   who live here, not contractors.

---

## 4 · The product loop

This is the single most important diagram. Every feature either *feeds* the
loop or earns its keep some other way.

```
                  ┌──────────────────────┐
                  │   Anonymous visitor   │
                  │   lands on hero       │
                  └──────────┬───────────┘
                             │  reads "21 nomads online right now"
                             │  sees live map of Istanbul
                             ▼
                  ┌──────────────────────┐
                  │   Sign in / Apply    │  ← single CTA
                  └──────────┬───────────┘
                             │
                             ▼
                  ┌──────────────────────┐
                  │   /today (the board)  │  ← the page members return to
                  │   morning · afternoon │     every morning
                  │   · evening           │
                  └──────────┬───────────┘
                             │
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
         Join a plan   Post a plan     Browse members
              │              │              │
              └──────┬───────┴──────────────┘
                     │
                     ▼
              ┌──────────────┐
              │ Real meetup  │  ← the actual product
              │ in Istanbul  │
              └──────┬───────┘
                     │
                     ▼
                Tomorrow morning ──→ open /today again
```

If a screen doesn't sit somewhere on that loop, it's content (`/guides`,
`/blog`, `/path-to-istanbul`) or chrome (`/about`, `/contact`). Both have a
place, but neither should compete visually with the loop.

---

## 5 · Surfaces (every route, by job)

### A · Engagement loop

| Route | Source | What it does |
|---|---|---|
| `/` | [page.tsx](src/app/[locale]/page.tsx) → [HeroLive](src/components/sections/home/hero-live/) | Full-bleed cinematic MapLibre hero auto-touring 6 neighborhoods. Lives as a recruiter for the loop. |
| `/today` | [page.tsx](src/app/[locale]/today/page.tsx) → [components/today/](src/components/today/) | The board. Real plans for today grouped morning/afternoon/evening, gold "★ Local guide" tag where the host is a verified guide. Members-only. |
| `/plans` | [page.tsx](src/app/[locale]/plans/page.tsx) | Marketing landing for the plans concept + an authed feed (today/tomorrow/week with neighborhood + vibe filters). |
| `/plans/new` | [page.tsx](src/app/[locale]/plans/new/page.tsx) | Map-first plan creation. Drop pins on verified spaces or anywhere, fill in time + vibe + notes per stop. |
| `/plans/[id]` | [page.tsx](src/app/[locale]/plans/[id]/page.tsx) | Plan detail with stop timeline, join/leave, comments. |
| `/members` | [page.tsx](src/app/[locale]/members/page.tsx) → [members-editorial.tsx](src/components/sections/members/members-editorial.tsx) | Editorial directory grouped by neighborhood, recently-joined sidebar, real avatars. Opt-in only. |
| `/members/[id]` | [page.tsx](src/app/[locale]/members/[id]/page.tsx) | Public profile: bio, skills, location, Telegram handle, upcoming plans. |
| `/onboarding` | [page.tsx](src/app/[locale]/onboarding/page.tsx) | Sticky-footer wizard: display name, neighborhood, profile preferences. Saves between steps. |
| `/login` | [page.tsx](src/app/[locale]/login/page.tsx) | Supabase auth (magic link + OAuth). |
| `/dashboard` | [page.tsx](src/app/[locale]/dashboard/page.tsx) | Member home: your plans, RSVPs, profile completion nudge. |

### B · Place + content (what brings people in cold)

| Route | Source | What it does |
|---|---|---|
| `/spaces` | [page.tsx](src/app/[locale]/spaces/page.tsx) | Verified coworking + cafés with nomad-scored wifi/power/comfort/noise/value/vibe, map view, "work mode" filter. **The Map nav target.** |
| `/guides` | [page.tsx](src/app/[locale]/guides/page.tsx) | Indexed guides: housing, transport, cost of living, SIM, banking. |
| `/guides/neighborhoods` + `/guides/neighborhoods/[slug]` | 10 full neighborhoods with rent ranges, transport, vibe, hero photo + gallery. |
| `/path-to-istanbul` + `/path-to-istanbul/[country]` | [page.tsx](src/app/[locale]/path-to-istanbul/page.tsx) | Country-by-country relocation playbooks (Iran, India, Russia, Pakistan, Nigeria). |
| `/relocation-agent` | [page.tsx](src/app/[locale]/relocation-agent/page.tsx) | AI move planner: intake form → Claude-generated personal plan with neighborhood scores, budget, timeline. |
| `/blog` + `/blog/[slug]` | MDX, by-people-who-live-here. Long-form. |
| `/events` + `/events/[id]` | Scheduled coworking sessions, meetups, workshops. RSVPs in Supabase. |
| `/local-guides` + `/local-guides/join` | Verified local hosts (walks, dinners, ferry trips) + application form for new ones. |

### C · Community side surfaces

| Route | Source | What it does |
|---|---|---|
| `/circles` | [page.tsx](src/app/[locale]/circles/page.tsx) | Sub-communities (smaller rooms inside the community). |
| `/perks` | [page.tsx](src/app/[locale]/perks/page.tsx) | Partner offers vault (Nomad+ benefit, opt-in). |
| `/tools/first-week-planner` | Seven-day arrival builder, shareable output. |

### D · About / utility

| Route | Source | What it does |
|---|---|---|
| `/about` | Our story, values, organizer team. |
| `/contact` | Contact form (Resend), Telegram, GitHub, email links. |
| `/credits` | Photo attribution. |

### What we deliberately don't have

- **No in-site DMs.** Outbound contact is **Telegram only**. Members provide
  their handle on profile creation. Reasons: keeps moderation surface small,
  matches where the community already talks, removes a notification surface
  we don't want to own.
- **No likes, no follows, no algorithm feed.** The board is chronological
  and short on purpose; we don't want engagement-bait.
- **No paid guide marketplace mechanics yet** (no Stripe, no escrow). Guides
  exist as host members; the fee + cancellation language is shown on plan
  cards but transactions happen via Telegram + cash for now.

---

## 6 · Core data entities

All in Supabase ([src/types/database.ts](src/types/database.ts)). RLS-protected,
service-role only on seed/admin scripts.

| Table | Purpose | Notable columns |
|---|---|---|
| `members` | Community profiles, opt-in visible | `display_name`, `bio`, `avatar_url`, `location`, `skills[]`, `telegram_handle`, `member_type` ("nomad" \| "guide"), `is_visible`, `onboarding_completed` |
| `plans` | Daily plans hosted by members | `creator_id`, `title`, `capacity`, `scheduled_date`, `expires_at`, `status` |
| `plan_stops` | One-or-more stops per plan | `ordinal`, `start_time`, `end_time`, `vibe` ("focus"\|"cowork"\|"social"\|"meal"\|"after-work"\|"outdoor"), `neighborhood_slug`, `space_id` \| `custom_location`, `transport_mode`, `transport_price_min/max` |
| `plan_attendees` | Who's joining a plan | `(plan_id, member_id)`, `status` |
| `plan_comments` | Plan-thread discussion | |
| `events` | Scheduled meetups, coworking sessions | `name`, `date`, `type`, `capacity`, `is_published` |
| `rsvps` | Event attendance | `(event_id, member_id)`, `status` |
| `local_guides` | Verified hosts | `specializations[]`, `neighborhoods[]`, `languages[]`, `years_in_istanbul` |
| `guide_applications` | Pending guide intake | |
| `perks` | Partner offers | `brand`, `kind`, `offer`, `is_active` |
| `blog_posts` | MDX-backed long-form | |
| `newsletter_subscribers` | Sunday Letter list | |
| `relocation_plans` | AI-generated plans | `intake` JSON, `plan` JSON, `model` (Claude version) |
| `corpus_chunks` | RAG embeddings for `/relocation-agent` | `source_type`, `embedding` (vector), `metadata` |
| `telegram_subscriptions` | Telegram webhook link | |

**Static fixtures** (TypeScript, not Supabase, because they change slowly):

- [src/lib/spaces.ts](src/lib/spaces.ts) — `NomadSpace[]` of ~21 verified
  coworking + cafés. Per-record `nomad_score` (wifi 25% + power 20% +
  comfort 15% + noise 15% + value 15% + vibe 10%), `last_verified` date,
  `sources[]` with citation URLs. **Rule: every score has a source or it
  stays null.**
- [src/lib/neighborhoods.ts](src/lib/neighborhoods.ts) — 10 full neighborhoods
  (Kadıköy, Moda, Cihangir, Beşiktaş, Galata, Üsküdar, Nişantaşı, Levent,
  Balat, Ataşehir) + decision notes for 25+ more.
- [src/lib/hero-data.ts](src/lib/hero-data.ts) — fixtures for the cinematic
  homepage hero only (21 nomad avatars, 29 venue dots, 6 tour stops).
  v1 ships from these; real members + venues are a tracked follow-up.

---

## 7 · Internationalisation

5 locales, sync coverage. ([src/lib/i18n/config.ts](src/lib/i18n/config.ts),
[src/messages/](src/messages/))

| Locale | Path | BCP 47 | Direction | Audience |
|---|---|---|---|---|
| English | `/` (default, no prefix) | `en-US` | LTR | Default international |
| Turkish | `/tr` | `tr-TR` | LTR | Local + diaspora |
| Persian | `/fa` | `fa-IR` | **RTL** | Iranian audience |
| Arabic | `/ar` | `ar-SA` | **RTL** | Arabic-speaking nomads |
| Russian | `/ru` | `ru-RU` | LTR | Russian-speaking nomads |

Per-locale content folders under `src/content/<type>/<locale>/`. Missing
locale → fall through to English with `translated: false` flag (rendered as
a "this guide is in English" notice). Four native-fluent audit agents
(@nomad-tr-editor, @nomad-fa-editor, @nomad-ar-editor, @nomad-ru-editor)
review per-locale grammar, voice, and SEO.

---

## 8 · Brand voice

Verbatim from [CLAUDE.md](CLAUDE.md) (the project's binding writing rules).
Anyone writing UI copy, MDX, or marketing must read CLAUDE.md first; this is
a summary, not a substitute.

**Contractions, always.** "don't" not "do not", "isn't" not "is not", "it's"
not "it is", "you'll" not "you will". (Exception: table headers stay formal.)

**Voice.** A helpful local friend who's been in Istanbul a while. Not a
corporate guide, not a travel blog, not a government website.

- "You" when giving advice: "You'll want a Turkcell SIM"
- "We" when speaking as the community: "We recommend Kadıköy"
- "I" only in blog stories with a personal angle

**Tone rules.**

- Direct and specific. "Get a Turkcell SIM for 250 TL" — not "Consider
  obtaining mobile connectivity."
- Warm but not cutesy. "Welcome" — not "Hey there!"
- Practical first, personality second.
- **No marketing fluff.** Banned: "seamless", "innovative", "cutting-edge",
  "world-class", "leverage", "utilize", "facilitate", "comprehensive solution".
- **No overused filler.** Avoid repeating: "real", "fast", "amazing",
  "incredible", "unique".
- Always answer "what does this do for me?" — not "what are we."

**Structure.**

- Open guides with the answer, not background.
- Tables for comparisons and pricing.
- Real prices in **both** TL and USD.
- Cross-link to other guides and blog posts.
- End actionable sections with a concrete next step.

**Writing-style hard rules (org-wide).**

- **No em dashes.** Use a regular dash `-`.

---

## 9 · Tech stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js 16** (App Router, React 19) | Server components, Cache Components, RSC streaming |
| Hosting | Vercel | Built-in for the stack |
| Database + auth | Supabase | Postgres + RLS + magic-link auth + storage |
| Styling | Tailwind 3 + CSS tokens | `--ink-*` / `--paper-*` / `--terracotta` / `--ferry-yellow` cascade in dark/light |
| Maps | **MapLibre** via `react-map-gl/maplibre` | CartoCDN raster tiles (dark-matter), no API key |
| Type display | Fraunces (legacy display), **Instrument Serif** (editorial), **Space Grotesk** (Members + Today surfaces), Geist (sans), JetBrains Mono (eyebrows) | See [DESIGN.md](DESIGN.md) |
| Content | MDX via `next-mdx-remote` | Guides, blog, country playbooks |
| AI | Anthropic Claude + Supabase vector for `/relocation-agent` | RAG over corpus chunks |
| Email | Resend + React Email | Newsletter, contact form, plan reminders |
| Analytics | Vercel Analytics + Speed Insights | |

i18n: `next-intl` v4 with `localePrefix: "as-needed"`.

Codepath highlights worth knowing:

- The cinematic hero lives in [src/components/sections/home/hero-live/](src/components/sections/home/hero-live/).
  It has crash-guards because MapLibre + React 19 races during fast navigation
  (see [hero-error-boundary.tsx](src/components/sections/home/hero-live/hero-error-boundary.tsx)).
- The workspace nav (5 destinations + Explore/Community dropdowns) is a
  single source of truth in [src/lib/constants.ts](src/lib/constants.ts);
  both the global [Header](src/components/layout/header.tsx) and the
  [hero brand bar](src/components/sections/home/hero-live/hero-frame.tsx)
  read from it.
- Shared UI atoms (Avatar, AvatarStack, Eyebrow, Chip, LivePip) live under
  [src/components/ui/](src/components/ui/).

---

## 10 · Boundaries (things we won't do)

- **No fabricated data.** If we don't have a verified wifi speed, the field
  is null and rendered as "—". This is enforced by the `nomad-space-scorer`
  agent and the `no-fake-data` brand rule.
- **No AI-generated faces on the homepage hero (post-launch).** v1 ships
  placeholder avatars (the prototype's `randomuser.me` set, self-hosted
  under `public/hero/avatars/`); real members replace them before any
  public launch announcement.
- **No tourism aesthetics.** No stock blue-grey palettes, no anonymous
  "people pointing at a map", no carousels of skylines from Shutterstock.
  See [docs/visual-identity.md](docs/visual-identity.md).
- **No in-site DMs.** Telegram is the messaging layer.
- **No social-style engagement metrics** on plans (no likes, no follows).
- **No paid placements** in the spaces directory. Scores are scored, not
  bid.

---

## 11 · Where things stand (May 2026)

Shipped and live:

- Cinematic live-map homepage hero (auto-tour through 6 neighborhoods)
- Workspace navbar (Today · Map · Events · Members · Perks + Explore ▾ +
  Community ▾) consistent across hero brand bar and global Header
- Members editorial directory (`/members`) with real data, grouped by hood
- Plans editorial landing (`/plans`) and Today board (`/today`) with mock
  seed data for development; real plans flow through `/plans/new`
- All 5 locales kept in sync per release
- Workspace chrome cleaned up (no AmbientBar, no hero category legend, no
  hero coords)

Tracked follow-ups (no commitment date — file an issue if you need one):

- **Profile editorial layout** — `/members/[id]` still uses the previous
  card profile; the editorial treatment (magazine cover + pull quote + stats)
  is designed but not built
- **Plans map view** at `/today?view=map` and `/plans?view=map`
- **Composer + ⌘N modal** for plan creation (currently a link to `/plans/new`)
- **Real Supabase members on the hero map** (currently fixture data)
- **Guide-side product mechanics** (fees, languages, cancellation policy)
  beyond what the `member_type=guide` flag carries today

---

## 12 · How to use this doc

- **Building something new?** Find which loop step it touches in section 4.
  If it doesn't touch any, it's content or chrome — different bar.
- **Adding a page?** Add it to the right table in section 5.
- **Changing the schema?** Update section 6.
- **Adding a locale?** Update section 7 + [docs/i18n/README.md](docs/i18n/README.md).
- **Writing copy?** Section 8 is the brand-voice gate. Stricter version
  lives in [CLAUDE.md](CLAUDE.md).
- **Disagreeing with this doc?** Open a PR that updates it. The doc is
  versioned with the code.
