# Product Plan - Phased Build to Paid Plans

> The execution plan from the current production state to a working
> ticketed-plan marketplace with verified guides. **Companion to**
> [PRODUCT.md](../PRODUCT.md) - PRODUCT.md is the strategy doc, this is
> the build order. Last revised: 2026-05-19.

---

## Operating principles

- **Site is on production.** Every phase ships behind a feature flag or
  via additive change. No phase breaks the live homepage, the existing
  `/today` / `/plans` board, or current navigation. Rollback is one
  toggle.
- **Ship narrow, ship often.** A phase that takes more than 7 calendar
  days is too big - cut scope or split.
- **No new abstractions on speculation.** Each phase adds the smallest
  schema + UI that proves the next phase has a foundation.
- **Closed beta before public launch of paid plans.** Phase 4 (paid plans)
  goes live for a hand-picked cohort of 5-10 verified guides before
  anyone else sees a "pay" button.

---

## Phase 0 · Focus the surface (this PR · 3.8.2)

**Done.** Pulled Perks + Nomad+ to clear the deck.

- Removed `Perks` from workspace navbar (header + hero brand bar).
- Removed `MembershipTiers` (Nomad+ pricing) component from homepage scroll.
- Deleted `/perks` route, kept the underlying Supabase table intact.
- Added 301 redirect `/perks` → `/` (and locale variants) in
  `next.config.mjs`.
- Removed `getPerksPublic` from `src/lib/supabase/queries.ts` and the
  perks branch of `nav-counts.ts`.
- PRODUCT.md §6 reframed - paid-plan tickets + guide subscriptions are
  the only two streams; Nomad+ + partner perks vault explicitly out of
  scope.

---

## Phase 1 · Member roles + lightweight profile (shipped in 3.9.0 ✓)

**Goal:** every signed-in user has a real role + a profile that reflects
it. No verification yet, no payment yet. Pure foundation.

### Schema (one migration)

- `members.member_type` enum extended to `nomad | remote_worker | local_guide | tour_guide | agent` (currently `nomad | guide`).
- `members.professional_role` TEXT, nullable. Free-text "what do you do" for `remote_worker` profile copy.
- `members.tour_guide_license_no` TEXT, nullable. Only used when `member_type='tour_guide'`.
- `members.xp` INTEGER NOT NULL DEFAULT 0. (Schema only; nothing increments it yet.)
- Backfill: every existing `member_type='guide'` row stays as `local_guide`.

### Onboarding wizard (`/onboarding`)

- New step: **role selection** between `nomad`, `remote_worker`,
  `local_guide`, `tour_guide`, `agent`. Pick one. Explain in one sentence
  what each means.
- If `remote_worker` selected: ask "what do you do" (`professional_role`).
- If `tour_guide` selected: ask for license number + show a note that
  Blue-badge verification is required to host paid tours (Phase 3 will
  enforce; Phase 1 just collects the input).
- `local_guide` + `agent`: collect specializations + neighborhoods (reuse
  existing `local_guides` table). No verification gate yet.

### Profile views (`/members/[id]`)

- Role badge shown on every profile (color-coded text label, no
  verification badge yet - that's Phase 3).
- `remote_worker` profiles get a `professional_role` line below the name.
- `local_guide` + `tour_guide` profiles get a "What I host" section
  (placeholder until they create plans).
- `agent` profiles are listed in `/members` like any other role, with a
  small `Admin services` label. Per the user's call, agents are public.

### `/members` directory

- Add role filter chips: `All · Nomads · Remote workers · Local guides · Tour guides · Agents`.
- Hood-grouping stays. Role filter combines with hood filter.

### What's NOT in Phase 1

- No verification ladder (Red/Blue/Gold) - that's Phase 3.
- No payments - that's Phase 4.
- No XP increments - schema lands but nothing earns yet.
- No badges - that's Phase 5.

### Verification gate

- Profile reads work without sign-in (public pages).
- Wizard role change after onboarding is allowed via dashboard until first
  plan is hosted; after that, role change requires organizer approval.

---

## Phase 2 · Plans v2 + paperwork surface (shipped in 3.10.0 ✓)

**Scope expanded vs original plan**: paperwork was supposed to be a
`vibe='admin'` value on plans. Re-scoped during Phase 2 discussion:
paperwork is its own surface (`/paperwork`) with its own table
(`paperwork_services`), agents are a capability flag (`is_agent`)
not a primary role.

**Original Phase 2 description below for context:**

**Goal:** the plan creation flow understands the two plan classes (budget
vs ticketed) and the two new vibes (`culture`, `admin`). Wires plumbing
without enabling ticket purchase yet.

### Schema

- `plan_stops.vibe` enum extended with `culture` and `admin`.
- `plan_stops.budget_per_person_min` INTEGER, nullable.
- `plan_stops.budget_per_person_max` INTEGER, nullable.
- `plan_stops.entry_fee_cents` INTEGER, nullable. (No paid checkout yet -
  this is captured but not chargeable.)
- `plan_stops.currency` TEXT, nullable.
- `plans.is_ticketed` BOOLEAN NOT NULL DEFAULT FALSE.
- `plans.host_role_at_creation` TEXT (snapshot, denormalised).
- `plans.host_badge_at_creation` TEXT (snapshot, denormalised; will be
  `red` for everyone until Phase 3 ships).

### `/plans/new` UI

- Vibe picker gains `culture` + `admin` chips.
- Per-stop money block has two modes:
  - **Budget mode** (default, available to every role): two number
    inputs "min / max" with currency.
  - **Ticketed mode** (only shown to `local_guide` / `tour_guide` /
    `agent`): single number input "entry fee" + currency. **Disabled
    with a "Verification required to charge" badge** until Phase 3
    actually issues the Blue badge.
- Help text per vibe reads from the matching `docs/legal/plan-disclaimers.md`
  section.

### `/plans/[id]` UI

- Budget plans display: "Expect to spend 200-400 TL per person".
- Ticketed plans display: "Entry fee: 350 TL" with a **"Coming soon"
  disabled checkout button** until Phase 4.

### What's NOT in Phase 2

- No real money flow.
- No KYC.
- Entry-fee field is captured but no checkout button works.

---

## Phase 4 · Rich member profiles (shipped in 3.12.0 ✓ - inserted ahead of paid-plans)

User-requested: nomads.com-style profile depth with categorized UI.
Four new fields: `current_status`, `working_on[]`, `wants_to_talk_about[]`,
`hobbies[]`. Editorial multi-section `/members/[id]` rebuild. Onboarding
wizard captures all four via a new ChipInput. Status dot on directory
cards. 5-locale i18n. Phase 4 (paid plans / iyzico) moves to Phase 5.

---

## Phase 3 · Verification ladder + Blue/Gold badges (shipped in 3.11.0 ✓)

**Scope note vs original plan**: Phase 3 v1 ships the schema + manual
organizer-approval flow (review via Supabase dashboard). A real KYC
vendor SDK (Sumsub / Persona / Onfido) plugs into the
`verification_requests.kyc_provider` + `kyc_session_id` columns in a
follow-up. Self-service stays at Blue; Gold is in-person via Telegram.

**Original Phase 3 description below for context:**

**Goal:** Red / Blue / Gold badges are real, visible everywhere, and
gate the entry-fee field that Phase 2 plumbed.

### Schema

- `members.verification_level` enum `basic | verified | trusted`
  NOT NULL DEFAULT `basic`.
- `members.verified_at` TIMESTAMPTZ, nullable.
- `members.verified_by` UUID, nullable (organizer who signed off, for
  Gold).
- `guide_applications` already exists; extend with `kyc_provider_session_id`,
  `kyc_status`, `kyc_decision_at`.

### KYC vendor integration

- **Pick:** Sumsub vs Persona vs Onfido. Decision criteria: Turkish ID
  support, Iranian passport support (sanctions-aware), reasonable per-check
  cost, webhook quality. Decision goes into PRODUCT.md §12 before this
  phase starts.
- Vendor SDK loaded only on `/onboarding` "verify identity" step (lazy
  chunk).
- Webhook handler at `/api/kyc/webhook` updates `members.verification_level`
  + `guide_applications.kyc_status`.

### Onboarding additions

- After role selection, if role is `local_guide` / `tour_guide` / `agent`:
  optional "Verify now or later" prompt. If "now", launches KYC vendor
  iframe.
- For `tour_guide`: license-number capture + manual organizer review step
  (no automated tour-guide-license verification API exists for Turkey).

### Visual badges

- Red dot · Blue check · Gold star, shown on:
  - `/members` cards
  - `/members/[id]` profile header
  - `/today` plan cards next to host name
  - `/plans/[id]` host section
  - Comment threads on plans
- Tooltip on each badge explains what it means.

### Gating

- Entry-fee field on `/plans/new` enabled iff `verification_level IN ('verified', 'trusted')` AND role IN (`local_guide`, `tour_guide`, `agent`).
- Red-only members posting in those roles see "Verify your account to
  charge for plans" inline.

### What's NOT in Phase 3

- No payment processor connected yet. Entry-fee field works but checkout
  button still says "Coming soon".
- No subscription tiers - free 1-plan-per-month quota lives in Phase 4.

---

## Phase 4 · Paid plans live (~7-10 days, closed beta)

**Goal:** ticketed plans actually take money. iyzico marketplace
integration, escrow, 7-day payout holdback, refund flow, dispute handling.

### Schema

- `plan_tickets` table: `(plan_id, attendee_id, gross_cents, platform_fee_cents, processor_fee_cents, net_to_host_cents, currency, status enum(held|released|refunded|disputed), payment_intent_id, paid_at, released_at, refunded_at, refunded_reason)`.
- `member_subscriptions` table: `(member_id, tier enum(free|standard|pro), period_start, period_end, plans_used_this_period, payment_provider, external_subscription_id, status)`.
- RLS: attendees can read their own tickets, hosts can read tickets for
  their own plans, no cross-read.

### iyzico integration

- iyzico marketplace / sub-merchant onboarding flow inside `/dashboard/payouts`. Guide submits Turkish IBAN + tax info, iyzico does its own KYC layer on top of our Blue badge.
- Stripe Connect fallback flow at the same dashboard surface for
  non-Turkish-resident hosts.
- Webhook handler at `/api/payments/webhook` for: payment captured, payout
  released, refund processed, dispute opened.

### Checkout flow

- `/plans/[id]` "Join" button on ticketed plans → checkout modal → iyzico
  Pay With Card iframe → confirmation.
- Attendee receipt email (Resend, all 5 locales).
- Host email when attendee joins.
- 24h-before-start refund: button on attendee's `/dashboard` ticket row.

### Payout flow

- 7-day holdback after plan's `scheduled_date + plan duration`. Cron job
  at `/api/payouts/release` runs daily, releases tickets that cleared the
  window without dispute.
- Host sees pending vs released balance on `/dashboard/payouts`.

### Subscription tiers

- `/dashboard/subscription` shows current tier + plans-used-this-period /
  quota.
- Upgrade flow via iyzico recurring (or Stripe if iyzico recurring is
  insufficient).
- Quota check on `/plans/new` submission when `is_ticketed=true`: if
  host's `member_subscriptions.plans_used_this_period >= tier_quota`,
  block submission with upgrade CTA.

### Dispute handling

- Attendee files dispute on `/dashboard/tickets/[id]` within 7 days of plan
  end.
- Dispute pauses release of that ticket's funds.
- Organizer reviews in a Supabase admin view (no separate admin UI in
  Phase 4 - we'll build that in Phase 6 if volume warrants).

### Closed beta gating

- Feature flag `PAID_PLANS_ENABLED` per-member (column on `members`).
- Beta cohort: 5-10 hand-picked Blue-badge guides + their attendees only.
- Public toggle flips after 2 weeks of clean operation (no major bugs, no
  fund loss, no failed payouts).

### What's NOT in Phase 4

- No automated payout schedule for non-Turkish hosts (manual via
  organizer for first month).
- No multi-currency on a single plan (host picks TRY OR USD, not both).

---

## Phase 5 · XP + badges (~3-4 days)

**Goal:** engagement layer. Vanity badges + the one-year-in-Istanbul
bracelet reward. No feature gating from XP.

### Schema

- `member_badges` table: `(member_id, badge_slug, earned_at, threshold_value)`.
- Badge definitions in static TS (not DB):
  - `first_plan` (1 plan posted or attended)
  - `regular` (5)
  - `veteran` (15)
  - `one_year_istanbul` (365 days since first plan attended)
  - `best_nomad_year` (editorial pick + community vote, manually
    awarded)
  - `top_host_year` (calendar-year highest-rated guide, manually awarded)

### XP rules

- Action → XP table starts in TS (`src/lib/xp.ts`); values are TBD until
  a balance pass after Phase 4 ships.
- XP awarded on plan-attendance confirmation (host marks attendee as
  attended) and plan-creation, not on RSVP (prevents farming).

### UI

- Badge chips on `/members/[id]` profile.
- Subtle XP counter on `/dashboard`.
- "Next badge: X plans to go" hint.
- Telegram bot post for badge unlocks (optional, Phase 5.5).

### One-year bracelet reward

- Manual fulfillment for v1: organizer pulls list of `one_year_istanbul`
  earners monthly, mails bracelets.
- Address-capture form gated behind `member_badges` check.

---

## Phase 6 · Legal pages live + KVKK compliance (~3-5 days)

**Goal:** the three drafted legal docs become real pages on the site,
in all 5 locales, lawyer-reviewed.

### Routes

- `/legal/terms` (rendered from `docs/legal/terms.md` after lawyer review).
- `/legal/community-guidelines`.
- `/legal/plan-disclaimers`.
- `/legal/privacy` (still to be drafted; KVKK + GDPR).

### Required before Phase 4 (paid plans) launches publicly

- Turkish lawyer review of T&C against:
  - KVKK (Turkish data law)
  - TKHK 6502 (consumer protection)
  - 6563 (e-commerce law)
  - Distance Selling Regulation
- Translation to all 5 locales (en/tr/fa/ar/ru).
- Sworn Turkish translation if KVKK review requires.
- Privacy policy drafted + reviewed.

### Implementation

- New `(marketing)/legal/` route group with shared `<LegalLayout>` (typography ramp suited to long-form prose).
- MDX files under `src/content/legal/<locale>/<slug>.mdx`.
- "I agree" checkbox on onboarding wizard final step links to terms + community guidelines (modal opens, member can read inline).
- Footer gains a "Legal" column with all 4 routes.

---

## Phase 7 · Neighborhood = connective tissue counts (~2 days)

**Goal:** the explicit PRODUCT.md §8 invariant becomes real.

- Every `/guides/neighborhoods/[slug]` page shows live "{n} nomads here ·
  {m} local guides hosting this month" line.
- Counts come from a single `getNeighborhoodCounts(slug)` query
  (`"use cache"`, hour-level cacheLife).
- Hover/click on the count → filtered `/members?neighborhood=slug`.
- Homepage hero callout reads real neighborhood counts (replaces the
  fixture "21 nomads online right now").

---

## Phase 8 · Real Supabase members on the hero map (~2 days)

**Goal:** replace the fixture avatars in `src/lib/hero-data.ts` with real
members.

- Server query of public Blue+ members who opted into hero featuring
  (new `members.is_featured_on_hero` boolean).
- Avatars from `members.avatar_url` (already Supabase Storage).
- Tour stops still curated (6 neighborhoods).
- Boundary: if fewer than 6 opted-in members per featured neighborhood,
  fall back to fixture avatars for missing slots.

---

## Phase 9 · Composer + ⌘N modal (~2 days)

**Goal:** `/plans/new` becomes available without a route change.

- ⌘N anywhere on the site opens a modal composer.
- Inline draft saving (localStorage) so partial composes survive
  navigation.
- Same fields as `/plans/new`, just modal.

---

## Phase 10 · Polish + admin tools (variable)

- Dispute management admin UI (if volume warrants - Phase 4 used
  Supabase admin view).
- Strike-tracking UI on member profiles (for organizers only).
- Newsletter automation hooks for new badges, milestone members.
- Public dashboard for community stats (members per hood, plans per
  week, badge counts).

---

## Phase ordering rationale

| Order | Reason |
|---|---|
| 0 → 1 | Strip surface, then add foundation. Don't add new schema while old surface is still in nav. |
| 1 → 2 | Plans v2 needs role-based field visibility. Role schema must land first. |
| 2 → 3 | Verification gates the entry-fee field that Phase 2 plumbs. Plumbing first, gate second - lets us test the field without KYC dependency. |
| 3 → 4 | Payment depends on Blue badge. KYC must work before any money moves. |
| 4 → 5 | XP + badges are nice-to-have. Money is must-have. |
| 4 → 6 (parallel from a date perspective) | Legal pages MUST land before public paid-plan launch, but their drafting and review run in parallel with Phase 4 build. The 6 listed after 5 is editorial - they're parallel tracks. |
| 5 → 7 → 8 → 9 → 10 | Pure polish, can be reordered or partly skipped per priority. |

---

## Out-of-scope (explicit)

These are deliberately NOT in any phase:

- **Nomad+** (consumer-side premium tier).
- **`/perks`** (partner offers vault).
- **In-site DMs** (Telegram remains the messaging layer).
- **Likes / follows / algorithm feed** (the board stays chronological).
- **Multi-city** ("Lisbon Nomads", etc.) - the brand is Istanbul.
- **Native mobile apps** - the responsive web is the surface.

If any of the above comes back into scope, it gets its own RFC and an
explicit decision to override the current phase plan.

---

## When this document changes

Each phase's "Done" criteria gets checked off in PRODUCT.md §14 ("Where
things stand") as it ships. This doc gets edited only when:

- A phase's scope changes materially.
- A new phase gets inserted.
- Phase ordering shifts.

Don't let this doc rot. If you're starting work on a phase and the
description here doesn't match what you're building, fix the doc first.
