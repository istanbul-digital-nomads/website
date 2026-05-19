# Istanbul Nomads - Product

> The canonical source of truth for what this product **is**, who it's for, how
> the loop works, what we charge for, and which surfaces serve which job. If
> something in another doc disagrees with this one, this one wins until
> updated.
>
> Companion docs (more granular, sometimes older):
> [README](README.md) (dev setup) ·
> [DESIGN](DESIGN.md) (visual system) ·
> [CHANGELOG](CHANGELOG.md) (release history) ·
> [CLAUDE](CLAUDE.md) (writing-style + git rules) ·
> [docs/](docs/) (per-feature working notes)

---

## 1 · One-liner

**Istanbul Nomads is two products on one domain.** A **content hub** that
helps people decide whether and how to land in Istanbul, and a **place-based
community planner** that helps verified members already here meet each other
in real life, day by day.

Made in Kadıköy. Disguised as a guide site, runs as a daily community board
with a real-money plan marketplace underneath.

---

## 2 · Audience cohorts

| Cohort | What they're doing | What the site does for them |
|---|---|---|
| **Pre-arrival** (next 30 days) | Picking a neighborhood, sorting visas, costing it out | `/guides`, `/guides/neighborhoods`, `/path-to-istanbul`, `/spaces`, `/relocation-agent` |
| **First week here** | Wifi, SIM, ferry, where to work today | `/today`, `/tools/first-week-planner`, `/spaces`, `/events` |
| **Settled for 1-6 months** | Finding people, joining a thing tonight, hosting | `/today`, `/plans`, `/members`, `/circles`, `/events`, `/perks` |
| **Long-term remote-workers** | Professional network, recurring routine, hosting cowork plans | `/today`, `/plans`, `/members`, dedicated remote-worker CTAs |
| **Locals who host** | Walks, dinners, hiking, concert nights, paid experiences | `/local-guides`, `/plans/new` as a verified guide |

We're not targeting tourists, retirees, week-long vacationers, or aggregator
traffic. The one-to-six-month nomad and the longer-term remote-worker are the
central archetypes; every feature gets judged against "would this help that
person tomorrow morning?"

---

## 3 · Member roles + verification

Every signed-in user has a `member_type` and a `verification_level`. Roles
shape **what they can do**; verification badges shape **what other members
see**.

### Roles (5 total)

| Role | Public on site? | Can host paid plans? | Profile angle |
|---|---|---|---|
| `nomad` | Yes | No (budget-only plans) | Traveling, here for 1-6 months |
| `remote_worker` | Yes | No (budget-only plans) | Settled longer-term, professional-network framing, gets dedicated marketing surfaces and CTAs |
| `local_guide` | Yes | Yes (ticketed plans, subscription-gated volume) | Knows the city, hosts hobby + experience plans |
| `tour_guide` | Yes | Yes (ticketed plans, subscription-gated volume) | Licensed Turkish tour guide; same plumbing as `local_guide` with a credential field |
| `agent` | **No (hidden role)** | Yes (admin-vibe plans only) | Visa, govt-office, ikamet specialist. Doesn't appear in `/members`, nav, or homepage hero. Surfaces only inside the authed `/today` board to members who filter for `vibe='admin'`. |

`nomad` and `remote_worker` share the same database schema, RLS rules, and
plan-creation rights. They differ only in **profile copy, CTA surfaces, and
marketing campaigns** (a remote-worker doesn't want to be branded as "on a
gap year"; a nomad doesn't want to be branded as "settling down").

### Verification ladder (three badges)

| Badge | Color | Who gets it | Requirements | Time to activation |
|---|---|---|---|---|
| Basic | 🔴 **Red** | All `nomad` + `remote_worker` defaults | Email + Telegram handle + completed onboarding | Minutes |
| Verified | 🔵 **Blue** | `local_guide` + `tour_guide` who want to host paid plans | ID document (passport / ikamet) upload + selfie match | ~24h human review |
| Trusted | 🟡 **Gold** | Top-tier verified guides | In-person meet with an organizer in Kadıköy + reference check | Days |

**Hard rules:**

- Only **Blue or Gold** verified members can set an `entry_fee` on a plan.
- `nomad` + `remote_worker` plans must use the `budget` field (free-text
  cost estimate per attendee, no money flow through the platform).
- A Red-badge member can be downgraded to "Suspended" by an organizer at
  any time for violating community guidelines; this is a one-click action.

### Why this matters

The cheapest way to ship a community is to let anyone post anything. That's
exactly the failure mode of Meetup, Eventbrite, and most Telegram groups.
Verification is friction on purpose. The Red badge keeps spam out; the Blue
badge means a guide is real before they touch real money; the Gold badge
means an organizer has personally met them.

---

## 4 · The problem we solve

Existing options fail in different ways:

- **Aggregator nomad sites** (Nomad List, reddit threads) - generic, dated,
  not on the ground in Istanbul, no local accountability.
- **Tourism guides** - written for a 4-day visit, useless for someone setting
  up a phone plan.
- **Generic coworking apps** - don't know that Kadıköy and Cihangir are not
  the same problem.
- **Discord / Telegram** - works for hanging out, doesn't survive search;
  every newcomer asks the same five questions in week one.
- **Meetup / Eventbrite** - too heavy a commitment for "I'll be at Karga at 6,
  drop by"; no verification floor, no marketplace for paid local hosts.
- **Airbnb Experiences / Withlocals** - 20-40% take rates, generic global
  product, no place-anchored neighborhood logic, doesn't surface free
  community plans alongside paid ones.

What we do that nobody else does:

1. **Map-first, place-anchored.** Plans, members, spaces, events all hang off
   real Istanbul coordinates. The homepage hero is the city, alive.
2. **Daily board, not a calendar.** `/today` is the page members actually
   come back to - what's on tonight, who's hosting, where's the open seat.
3. **Plans-not-meetups vocabulary.** "I'll be at Karga at 6" is a plan you
   can drop into. RSVP is optional, cap is honest, host is real.
4. **Verified-host marketplace.** Local guides and tour guides can monetize
   what they already know. Nomads can join paid experiences (hike, concert,
   visa-office walk-through) with platform-held escrow and a real refund
   policy.
5. **Real ground truth.** Every space has a verified-on date and source
   links. No fabricated wifi speeds. No invented prices.
6. **Made in Kadıköy.** First-person voice. Guides written by people who
   live here, not contractors.

---

## 5 · The product loop

Two loops share the front door. Most product surfaces serve one or the
other; a few (the homepage, /spaces) serve both.

### Loop A · Content hub (pre-arrival, decision-making)

```
   Anonymous visitor lands on hero or SEO content
                      │
                      ▼
   Reads /guides, /guides/neighborhoods,
   /path-to-istanbul, runs /relocation-agent
                      │
                      ▼
   Decides Istanbul is the move
                      │
                      ▼
   Newsletter signup OR sign in to community
                      │
                      ▼
   Lands physically · enters Loop B
```

Loop A's job: **be the most trustworthy "should I move to Istanbul as a
nomad?" answer on the internet.** It pays for itself in two ways: (1) it's
the top-of-funnel for Loop B sign-ups, (2) future Nomad+ tier will unlock
deeper relocation tooling.

### Loop B · Community planner (in-Istanbul, daily engagement)

```
              Member signs in
                    │
                    ▼
            /today (the board)
       morning · afternoon · evening
                    │
       ┌────────────┼────────────┐
       ▼            ▼            ▼
  Join a plan  Post a plan  Browse members
       │            │            │
       │            │   (filter by neighborhood,
       │            │    vibe, host type)
       │            │
       ▼            ▼
   Pay ticket    Verified?
   (if paid)        │
       │       Yes ─┴─ No → can only post budget plan
       │
       ▼
  Real meetup in Istanbul
       │
       ▼
  Plan ends · 7-day holdback
       │
       ▼
  Guide payout · attendee XP · badges advance
       │
       ▼
  Tomorrow morning → open /today again
```

If a screen doesn't sit somewhere on one of these loops, it's content
(`/guides`, `/blog`, `/path-to-istanbul`) or chrome (`/about`, `/contact`,
`/legal/*`). All three categories have a place, but only the loops should
compete for hero attention.

---

## 6 · Monetisation

We have one revenue stream today and one coming. Nomad+ stays parked until
brand credit is higher.

### Revenue stream 1 · Guide plan ticket fees (active path to live)

- **Who pays:** the attendee, at the moment they join a paid plan.
- **Who collects:** the platform. Money sits in our escrow account until
  payout.
- **Take rate:** **10% platform fee + ~2.9% iyzico processing = ~13% gross
  off the entry fee.** Guide keeps ~87%.
- **Payout policy:** **7-day holdback** after plan completion. Released once
  no dispute is filed and host has confirmed attendance.
- **Refund policy:** TBD - draft for the T&C is a 24h-before-start full
  refund, no-show forfeits, host-cancellation triggers full refund + a
  reliability hit.

### Revenue stream 2 · Guide subscriptions (planned)

Verified `local_guide` and `tour_guide` members get a free monthly quota.
Above that, they need a paid tier.

| Tier | Plans per month | Price | Notes |
|---|---|---|---|
| Free | 1 paid plan / month | 0 | Money-back guaranteed payout still applies |
| Standard | 5 paid plans / month | TBD | Target ~$15-25/mo equivalent |
| Pro | 20 paid plans / month | TBD | Target ~$40-60/mo equivalent |

Free guides still pay the 13% take on each ticket. Paid tiers may eventually
get a take-rate discount (loyalty mechanic, post-launch decision).

Budget-only plans (`nomad` + `remote_worker` hosted) **do not count** toward
the monthly quota - they're free to post, no money moves, no take.

### Revenue stream 3 · Nomad+ (parked)

Member-paid premium tier for nomads themselves. Will unlock things like deep
relocation tooling, members-only events, perks vault. **Will not ship until
brand credit + member base justify charging the audience side.** No date.

### Payment infrastructure

| Layer | Choice | Why |
|---|---|---|
| Primary processor | **iyzico** | Turkish-native, marketplace/sub-merchant support, accepts international cards (USD/EUR) from nomads, pays out TRY to Turkish IBANs for guides. Owned by PayPal. |
| Fallback processor | Stripe Connect | For non-Turkish-resident guides where iyzico KYC bounces. Restricted Turkish payout support today but workable. |
| KYC / ID verification | TBD - shortlist: Sumsub, Persona, Onfido | Drives Blue-badge issuance. Needed before guide can collect first ticket. |
| Escrow account | iyzico sub-merchant model | Funds held under platform until payout window clears. |

### What we deliberately don't monetize

- No paid placements in the `/spaces` directory. Scores are scored, not bid.
- No sponsored plans, no boosted hosts. The `/today` board is chronological
  on purpose.
- No data sale, no ad network.
- No ticket take on budget-only plans (`nomad` / `remote_worker` hosted) -
  the budget field is informational and the money never touches us.

---

## 7 · Surfaces (every route, by job)

### A · Engagement loop (Loop B)

| Route | Source | What it does |
|---|---|---|
| `/` | [page.tsx](src/app/[locale]/(home)/page.tsx) → [HeroLive](src/components/sections/home/hero-live/) | Full-bleed cinematic MapLibre hero auto-touring 6 neighborhoods. Lives as a recruiter for the loop. |
| `/today` | `(app)/today/page.tsx` → [components/sections/today/](src/components/sections/today/) | The board. Real plans for today grouped morning/afternoon/evening, gold "★ Local guide" tag where the host is a Blue/Gold-badge guide. Members-only. |
| `/plans` | `(app)/plans/page.tsx` | Marketing landing for the plans concept + an authed feed (today/tomorrow/week with neighborhood + vibe + host-type filters). |
| `/plans/new` | `(app)/plans/new/page.tsx` | Map-first plan creation. Drop pins on verified spaces or anywhere, fill in time + vibe + notes + budget OR entry-fee per stop. Entry-fee field is **hidden for non-Blue/Gold roles**. |
| `/plans/[id]` | `(app)/plans/[id]/page.tsx` | Plan detail with stop timeline, join/leave, comments, ticket purchase for paid plans, host badge color, full disclaimers. |
| `/members` | `(marketing)/members/page.tsx` → [members-editorial.tsx](src/components/sections/members/members-editorial.tsx) | Editorial directory grouped by neighborhood. Agents are **never listed here**. Opt-in only. |
| `/members/[id]` | `(marketing)/members/[id]/page.tsx` | Public profile: bio, skills, location, Telegram handle, upcoming plans, badges earned. Role-specific layout (remote-worker profile differs from nomad in tone + sections). |
| `/onboarding` | `(app)/onboarding/page.tsx` | Sticky-footer wizard: display name, neighborhood, role (`nomad` / `remote_worker` only - guide role applied via separate review), profile preferences. Saves between steps. |
| `/login` | `(marketing)/login/page.tsx` | Supabase auth (magic link + OAuth). |
| `/dashboard` | `(app)/dashboard/page.tsx` | Member home: your plans, RSVPs, profile completion nudge, XP + badge progress, payout balance (if guide), subscription state (if guide). |

### B · Place + content (Loop A)

| Route | Source | What it does |
|---|---|---|
| `/spaces` | `(marketing)/spaces/page.tsx` | Verified coworking + cafés with nomad-scored wifi/power/comfort/noise/value/vibe, map view, "work mode" filter. **The Map nav target.** Serves both loops - inbound traffic uses it cold, members use it to pick where to host. |
| `/guides` | `(marketing)/guides/page.tsx` | Indexed guides: housing, transport, cost of living, SIM, banking. |
| `/guides/neighborhoods` + `/guides/neighborhoods/[slug]` | `(marketing)/guides/neighborhoods/` | 10 full neighborhoods with rent ranges, transport, vibe, hero photo + gallery, **member count + local-guide count per neighborhood** (the connective tissue). |
| `/path-to-istanbul` + `/path-to-istanbul/[country]` | `(marketing)/path-to-istanbul/` | Country-by-country relocation playbooks (Iran, India, Russia, Pakistan, Nigeria). |
| `/relocation-agent` | `(marketing)/relocation-agent/page.tsx` | AI move planner: intake form → Claude-generated personal plan with neighborhood scores, budget, timeline. |
| `/blog` + `/blog/[slug]` | `(marketing)/blog/` | MDX, by-people-who-live-here. Long-form. |
| `/events` + `/events/[id]` | `(marketing)/events/` | Scheduled coworking sessions, meetups, workshops. RSVPs in Supabase. |
| `/local-guides` + `/local-guides/join` | `(marketing)/local-guides/` | Verified local hosts (walks, dinners, ferry trips, hikes) + application form for new ones. **Application triggers the Blue-badge KYC flow.** |

### C · Community side surfaces

| Route | Source | What it does |
|---|---|---|
| `/circles` | `(marketing)/circles/page.tsx` | Sub-communities (smaller rooms inside the community). |
| `/perks` | `(marketing)/perks/page.tsx` | Partner offers vault. Free for members today; will become a Nomad+ benefit later. |
| `/tools/first-week-planner` | `(marketing)/tools/first-week-planner/` | Seven-day arrival builder, shareable output. |

### D · Legal + utility (gaps to close)

| Route | Source | What it does | Status |
|---|---|---|---|
| `/about` | `(marketing)/about/` | Our story, values, organizer team. | Live |
| `/contact` | `(marketing)/contact/` | Contact form (Resend), Telegram, GitHub, email links. | Live |
| `/credits` | `(marketing)/credits/` | Photo attribution. | Live |
| `/legal/terms` | not built | Terms of Service - covers ticket purchases, refunds, payouts, dispute resolution, guide obligations. Must be lawyer-reviewed. | **Required, not built** |
| `/legal/community-guidelines` | not built | Strict, explicit rules: behavior at plans, no-shows, alcohol, harassment, safety, what gets you Red-flagged or removed. | **Required, not built** |
| `/legal/plan-disclaimers` | not built | Per-vibe disclaimer text shown on every plan card (hiking = trail risk, outdoor = weather, after-work = alcohol, admin = no legal advice, etc.). | **Required, not built** |
| `/legal/privacy` | not built | GDPR + KVKK (Turkish data law) coverage. | **Required, not built** |
| `/dashboard/payouts` | not built | Guide payout history, pending balance, KYC status, bank details. | **Required for guide launch** |
| `/dashboard/subscription` | not built | Guide subscription tier, plan-quota usage, billing portal. | **Required for guide launch** |

### What we deliberately don't have

- **No in-site DMs.** Outbound contact is **Telegram only**. Members provide
  their handle on profile creation. Reasons: keeps moderation surface small,
  matches where the community already talks, removes a notification surface
  we don't want to own.
- **No likes, no follows, no algorithm feed.** The board is chronological
  and short on purpose; we don't want engagement-bait.
- **No public Agent surface.** Agents exist in the DB and post plans tagged
  `vibe='admin'`. They never show up in `/members`, the hero, the global
  nav, or aggregate counts on neighborhood pages.

---

## 8 · Core data entities

All in Supabase ([src/types/database.ts](src/types/database.ts)). RLS-protected,
service-role only on seed/admin scripts.

| Table | Purpose | Notable columns |
|---|---|---|
| `members` | Community profiles, opt-in visible | `display_name`, `bio`, `avatar_url`, `location`, `skills[]`, `telegram_handle`, `member_type` (`nomad` \| `remote_worker` \| `local_guide` \| `tour_guide` \| `agent`), `professional_role` (free text - for `remote_worker` framing), `verification_level` (`basic` \| `verified` \| `trusted`), `is_visible` (`agent` is forced `false`), `onboarding_completed`, `xp` (int, default 0), `tour_guide_license_no` (nullable, `tour_guide` only) |
| `member_badges` | Earned badges | `(member_id, badge_slug)`, `earned_at`, `threshold_value` (e.g. 5 plans hosted) |
| `member_subscriptions` | Guide subscription state | `member_id`, `tier` (`free` \| `standard` \| `pro`), `period_start`, `period_end`, `plans_used_this_period`, `payment_provider` (`iyzico` \| `stripe`), `external_subscription_id` |
| `plans` | Daily plans hosted by members | `creator_id`, `title`, `capacity`, `scheduled_date`, `expires_at`, `status`, `is_ticketed` (bool), `host_role_at_creation` (snapshot - so a downgraded guide's old plans still display correctly), `host_badge_at_creation` |
| `plan_stops` | One-or-more stops per plan | `ordinal`, `start_time`, `end_time`, `vibe` (`focus`\|`cowork`\|`social`\|`meal`\|`after-work`\|`outdoor`\|`culture`\|`admin`), `neighborhood_slug`, `space_id` \| `custom_location`, `transport_mode`, `transport_price_min/max`, `budget_per_person_min/max` (for budget plans), `entry_fee_cents` + `currency` (for ticketed plans, only set when host is Blue/Gold) |
| `plan_attendees` | Who's joining a plan | `(plan_id, member_id)`, `status` (`requested`\|`confirmed`\|`waitlisted`\|`cancelled`\|`no_show`) |
| `plan_tickets` | Money flow for ticketed plans | `(plan_id, attendee_id)`, `gross_cents`, `platform_fee_cents`, `processor_fee_cents`, `net_to_host_cents`, `currency`, `status` (`held`\|`released`\|`refunded`\|`disputed`), `payment_intent_id` (iyzico/stripe), `paid_at`, `released_at` |
| `plan_comments` | Plan-thread discussion | |
| `events` | Scheduled meetups, coworking sessions | `name`, `date`, `type`, `capacity`, `is_published` |
| `rsvps` | Event attendance | `(event_id, member_id)`, `status` |
| `local_guides` | Verified hosts (extension of `members` where `member_type` ∈ {`local_guide`, `tour_guide`}) | `specializations[]`, `neighborhoods[]`, `languages[]`, `years_in_istanbul` |
| `guide_applications` | Pending guide intake | `member_id`, `submitted_at`, `kyc_status`, `reviewer_id`, `decision`, `decision_at` |
| `perks` | Partner offers | `brand`, `kind`, `offer`, `is_active` |
| `blog_posts` | MDX-backed long-form | |
| `newsletter_subscribers` | Sunday Letter list | |
| `relocation_plans` | AI-generated plans | `intake` JSON, `plan` JSON, `model` (Claude version) |
| `corpus_chunks` | RAG embeddings for `/relocation-agent` | `source_type`, `embedding` (vector), `metadata` |
| `telegram_subscriptions` | Telegram webhook link | |

**Static fixtures** (TypeScript, not Supabase, because they change slowly):

- [src/lib/spaces.ts](src/lib/spaces.ts) - `NomadSpace[]` of ~21 verified
  coworking + cafés. Per-record `nomad_score` (wifi 25% + power 20% +
  comfort 15% + noise 15% + value 15% + vibe 10%), `last_verified` date,
  `sources[]` with citation URLs. **Rule: every score has a source or it
  stays null.**
- [src/lib/neighborhoods.ts](src/lib/neighborhoods.ts) - 10 full neighborhoods
  (Kadıköy, Moda, Cihangir, Beşiktaş, Galata, Üsküdar, Nişantaşı, Levent,
  Balat, Ataşehir) + decision notes for 25+ more.
- [src/lib/hero-data.ts](src/lib/hero-data.ts) - fixtures for the cinematic
  homepage hero only (21 nomad avatars, 29 venue dots, 6 tour stops).
  v1 ships from these; real members + venues are a tracked follow-up.

### Neighborhood = connective tissue

The neighborhood entity is the join that makes the product feel local:

- Every `member` has a `location` field that resolves to a neighborhood slug.
- Every `plan_stop` has a `neighborhood_slug`.
- Every `/guides/neighborhoods/[slug]` page **must show** live counts:
  "{n} nomads here · {m} local guides hosting this month".
- Every neighborhood page links to the active members + active plans pinned
  in that neighborhood.

If a feature would weaken the neighborhood-as-join behavior (e.g. a global
feed that ignores location), it doesn't ship.

---

## 9 · XP + badges

The whole point is **engagement and pride, not gating.** XP doesn't unlock
features. Badges are vanity + real-world rewards.

### How XP is earned

| Action | XP | Notes |
|---|---|---|
| Complete onboarding | TBD | One-time |
| Verify profile (Blue badge) | TBD | One-time |
| Attend a plan | TBD | Per-plan, after host confirms attendance |
| Host a plan (any type) | TBD | Per-plan |
| Host a paid plan that fills | TBD | Bonus for filling capacity |
| Leave a thoughtful plan comment | TBD | Heuristic: length + recipient response |
| Write a blog post (member-contributor) | TBD | Editorial-curated |
| Refer a new member who completes onboarding | TBD | One-time per referral |

XP values intentionally left TBD until balance is tested with a closed beta.
Schema is `members.xp INTEGER NOT NULL DEFAULT 0`.

### Badges (visible on profile, on plan cards next to host name)

| Badge | Threshold | Reward |
|---|---|---|
| First plan | 1 plan posted or attended | None - milestone marker |
| Regular | 5 plans posted or attended | Profile flair |
| Veteran | 15 plans posted or attended | Profile flair + ticket priority on capped plans |
| One year in Istanbul | 365 days since first plan attended | **Physical bracelet** mailed to user |
| Best nomad of the year | Editorial pick + community vote | Recognition + perks credit |
| Top host of the year | Highest-rated guide, calendar year | Recognition + perks credit |

The bracelets / "best of year" track is the carrot that makes XP feel real
without becoming a loyalty-program grind. We will not ship XP without at
least one tangible reward defined (the one-year bracelet is the floor).

---

## 10 · Internationalisation

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

**Legal copy** (T&C, community guidelines, privacy, plan disclaimers) must
be available in all 5 locales before launching the paid-plan flow. Sworn
translation may be required for the Turkish version depending on KVKK
review.

---

## 11 · Brand voice

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

- Direct and specific. "Get a Turkcell SIM for 250 TL" - not "Consider
  obtaining mobile connectivity."
- Warm but not cutesy. "Welcome" - not "Hey there!"
- Practical first, personality second.
- **No marketing fluff.** Banned: "seamless", "innovative", "cutting-edge",
  "world-class", "leverage", "utilize", "facilitate", "comprehensive solution".
- **No overused filler.** Avoid repeating: "real", "fast", "amazing",
  "incredible", "unique".
- Always answer "what does this do for me?" - not "what are we."

**Structure.**

- Open guides with the answer, not background.
- Tables for comparisons and pricing.
- Real prices in **both** TL and USD.
- Cross-link to other guides and blog posts.
- End actionable sections with a concrete next step.

**Writing-style hard rules (org-wide).**

- **No em dashes.** Use a regular dash `-`. Enforced by eslint.

---

## 12 · Tech stack

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
| **Payments (primary)** | **iyzico** | Turkish-native, marketplace/sub-merchant, TRY payouts, accepts international cards |
| **Payments (fallback)** | Stripe Connect | Non-Turkish-resident guides |
| **KYC / ID verification** | TBD - shortlist: Sumsub, Persona, Onfido | Drives Blue-badge issuance |

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
- Route groups under [src/app/[locale]/](src/app/[locale]/): `(home)`,
  `(marketing)`, `(app)` carve concerns without changing URLs. The
  homepage owns its own brand bar; marketing + app mount the global Header.
- Shared UI atoms (Avatar, AvatarStack, Eyebrow, Chip, LivePip) live under
  [src/components/ui/](src/components/ui/).

---

## 13 · Boundaries (things we won't do)

- **No fabricated data.** If we don't have a verified wifi speed, the field
  is null and rendered as "-". This is enforced by the `nomad-space-scorer`
  agent and the `no-fake-data` brand rule.
- **No AI-generated faces on the homepage hero (post-launch).** v1 ships
  placeholder avatars (the prototype's `randomuser.me` set, self-hosted
  under `public/hero/avatars/`); real members replace them before any
  public launch announcement.
- **No tourism aesthetics.** No stock blue-grey palettes, no anonymous
  "people pointing at a map", no carousels of skylines from Shutterstock.
- **No in-site DMs.** Telegram is the messaging layer.
- **No social-style engagement metrics** on plans (no likes, no follows).
- **No paid placements** in the spaces directory. Scores are scored, not
  bid.
- **No ticket take on budget-only plans.** The 13% only applies to plans a
  Blue/Gold guide explicitly priced.
- **No public Agent presence.** Agents stay invisible to the public site.
  They can host plans and earn money, but they are not part of the brand
  surface or aggregate counts.
- **No Nomad+ launch before brand credit is earned.** Charging the audience
  side requires having an audience that loves us. We're not there yet.

---

## 14 · Where things stand (May 2026)

Shipped and live:

- Cinematic live-map homepage hero (auto-tour through 6 neighborhoods)
- Workspace navbar (Today · Map · Events · Members · Perks + Explore ▾ +
  Community ▾) consistent across hero brand bar and global Header
- Members editorial directory (`/members`) with real data, grouped by hood
- Plans editorial landing (`/plans`) and Today board (`/today`) with mock
  seed data for development; real plans flow through `/plans/new`
- All 5 locales kept in sync per release
- Route-group scaffold landed in 3.8.0; `(home)` / `(marketing)` / `(app)`

Tracked follow-ups required before paid-plan launch:

1. **Member role expansion to 5 values** (`nomad`, `remote_worker`,
   `local_guide`, `tour_guide`, `agent`). Schema migration + onboarding
   wizard role-select + role-specific profile views.
2. **Verification ladder** (`verification_level` enum + KYC vendor
   integration + Blue-badge review workflow + Gold-badge in-person tracker).
3. **iyzico marketplace integration** (escrow account, sub-merchant model,
   payout flow, 7-day holdback, refund flow, dispute handling).
4. **`plan_tickets` table + paid-plan UI** (entry-fee field gated by role,
   checkout flow, attendee receipts, host payout dashboard).
5. **Guide subscription tiers** (Free / Standard / Pro, plan-quota
   tracking, billing portal).
6. **Legal pages**: `/legal/terms`, `/legal/community-guidelines`,
   `/legal/privacy`, `/legal/plan-disclaimers` - lawyer-reviewed,
   translated to all 5 locales, KVKK-compliant.
7. **XP + badges schema** with the one-year-bracelet reward defined as the
   floor.
8. **Neighborhood connective-tissue counts** on `/guides/neighborhoods/[slug]`
   ("{n} nomads here · {m} local guides hosting this month").
9. **Agent hidden surface**: `vibe='admin'` value, role-gated entry-fee
   field, exclusion from `/members` + hero + nav.
10. **Profile-editorial layout** for `/members/[id]` (magazine cover + pull
    quote + stats) - designed, not built.
11. **Plans map view** at `/today?view=map` and `/plans?view=map`.
12. **Composer + ⌘N modal** for plan creation (currently a link to
    `/plans/new`).
13. **Real Supabase members on the hero map** (currently fixture data).

Tracked but no commitment date:

- **Nomad+** premium tier (parked until brand credit is higher).
- **Take-rate discount** for Pro-tier subscribers (post-launch loyalty
  mechanic).
- **Sworn Turkish translation** of legal copy if KVKK review requires it.

---

## 15 · How to use this doc

- **Building something new?** Find which loop step it touches in section 5.
  If it doesn't touch a loop, it's content or chrome - different bar.
- **Adding a page?** Add it to the right table in section 7.
- **Changing the schema?** Update section 8.
- **Adding a member role?** Update section 3 + section 8 + the onboarding
  wizard.
- **Touching money?** Update section 6 and add a row to section 8's
  `plan_tickets` or `member_subscriptions` columns.
- **Adding a locale?** Update section 10 + [docs/i18n/README.md](docs/i18n/README.md).
- **Writing copy?** Section 11 is the brand-voice gate. Stricter version
  lives in [CLAUDE.md](CLAUDE.md).
- **Disagreeing with this doc?** Open a PR that updates it. The doc is
  versioned with the code.
