# Changelog

All notable changes to the Istanbul Nomads website will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.30.0] - 2026-05-26

### Added

- **Dedicated `/map` page.** The top-nav "Map" link now opens a real map page led by the slogan "All a nomad needs in Istanbul is a map," with the interactive Istanbul map (neighborhoods + coffee-brand layer) as the hero, supporting detail copy, and a "Create a plan" CTA into the plan builder. Translated across en/tr/fa/ar/ru. ("Nomad Spaces" still points to the `/spaces` finder.)
- **Nomad brands layer on the map.** New `nomad_brands` + `brand_locations` Supabase tables (migration `029`), a typed `src/lib/brands.ts` seed (Espressolab, Starbucks, BEX Coffee with 6 cited branch locations - scores stay null until a source backs them, per the spaces.ts convention), and reusable `BrandFilterBar` + `BrandMarker` components. The neighborhood overview map (`istanbul-map.tsx`) now has a coffee-brand filter, and the plan-create map lets you pick a brand branch. `NeighborhoodsMapSection` is now mounted on the home page so the map is reachable.
- **Istanbul district + neighborhood intelligence layer.** New `istanbul_districts` + `istanbul_neighborhoods` Supabase tables (migration `030`) and `src/lib/districts.ts`, composing a district hierarchy on top of the existing 10 rich neighborhoods. Scores (nomad, nightlife, cost, walkability, safety) stay null unless cited.
- **Circles v2.** Expanded from 6 static circles to 22 in a category-grouped system (professional / lifestyle / growth / social / relationship) with `circle_categories`, `circle_badges`, `circle_activity`, and participation scoring (migration `031`, building on the existing `circle_members`/`perks` tables). The `/circles` page now groups circles by category, and all 22 circles are translated across the five locales (en/tr/fa/ar/ru).
- **Multi-agent deliverables under `docs/agents/`** - design-system audit, multi-language content-calendar system, circles research, and a master progress log. Plus a `--json`/coverage helper on `scripts/i18n-content.ts` and a `brands.ts` test suite that enforces the no-fabrication scoring contract.
- **Animated walkthrough on every plan's map.** The plan-detail map (`/plans/[id]`) now plays through a plan stop by stop: a growing route trail, the camera flying to each stop, and play/pause/reset controls. Stop pins show the **activity icon** for their vibe (coffee, fork, tree, music, focus, sunset, people) instead of plain numbers, and a small **transport chip** (walk / ferry / metro / taxi / …) sits on each leg between stops, from the transport mode the plan builder already captures. Works for every member's plan - the one-off static "Ali Sameni week" showcase was retired in favour of this, and Ali's days are now real plans seeded with `scripts/seed-ali-week.ts`.
- **Social sharing for plans (link cards + story images).** Each plan now generates a branded **OpenGraph card** (1200×630, host avatar + title + date + neighborhoods + "N stops · M going") via a colocated `opengraph-image`, with dynamic per-plan `generateMetadata` (`twitter:card=summary_large_image`) so shares on X / Facebook / WhatsApp / Slack / iMessage show a rich preview. Plus a **portrait story image** (1080×1920, `/api/plans/[id]/story`) in the "share a tweet as an image with the link below" style - a centered plan card with the short link printed beneath, sized to the Instagram/TikTok story safe zone. A new share sheet on the plan page offers copy-link, native share, and **Share to Stories** (Web Share API with the image file → pick Instagram on mobile) with a download fallback and live preview. fa/ar fall back to a Latin-safe card (satori can't shape Arabic). `src/lib/og-plan.tsx`, `src/lib/og-plan-story.tsx`, `src/components/sections/plans/plan-share.tsx`.

### Changed

- **Map page upgrade.** The brand + a new neighborhood filter now live _above_ the map instead of as an on-canvas overlay (the map became a controlled component). Each neighborhood's real OSM boundary (ODbL, fetched into `public/data/neighborhood-borders.json` - 15 of 19 have a polygon; informal areas like Galata/Karaköy stay point-only) is drawn on the map and brightened when you toggle it in the filter. Brand branches expanded toward full Istanbul coverage - Espressolab 22, Starbucks 17, BEX 6 - every one cited, never fabricated.
- **Nomad brand markers now use real brand logos instead of an emoji.** Each brand carries its own SVG logo (`public/brands/<slug>.svg` - Espressolab, Starbucks, BEX Coffee) rendered on a white pill/circle with a brand-colour ring, on both the map markers and the filter chips. The schema field `icon` was renamed to `logo` end to end (`brands.ts`, `database.ts`, migration `032` renames the `nomad_brands.icon` column), and Espressolab's accent colour was corrected to its real red.
- **Paperwork is hidden from navigation for now.** A new `PAPERWORK_ENABLED` flag (`src/lib/constants.ts`, currently `false`) filters the Paperwork entry out of the desktop header, mobile menu, and hero nav. The `/paperwork` routes still exist but are unlinked - flip the flag to `true` to bring it back when it's ready.

### Notes

- Migrations `029`/`030`/`031` are defined but not yet applied - the app reads the static TS seeds and degrades gracefully when the tables are absent. Run `supabase db push` to apply.

---

## [3.29.5] - 2026-05-25

### Fixed

- **In-app browsers (Instagram, Facebook, iOS home screen) still showed the old icon.** They probe the root `/apple-touch-icon.png` and `/apple-touch-icon-precomposed.png` directly - ignoring the `<link rel="apple-touch-icon">` tag - and both were returning a 500, so they fell back to a stale cached icon. Added real files at `public/apple-touch-icon.png` and `public/apple-touch-icon-precomposed.png` (the seagull mark), so those root probes now return the new icon. Follows the `/favicon.ico` fix in 3.29.4.

---

## [3.29.4] - 2026-05-25

### Fixed

- **Mobile browsers showed the old logo in the tab/bookmark/home-screen icon.** `/favicon.ico` was returning a 500, so browsers (especially mobile) fell back to a stale cached icon while the new seagull only showed in-page. Added a real multi-resolution `src/app/favicon.ico` (16/32/48) generated from the seagull mark, so `/favicon.ico` now serves a valid icon. The in-app PNG logos, `icon.png`, and `apple-icon.png` were already correct.

---

## [3.29.3] - 2026-05-25

### Performance

- **Member profile pages (`/members/[id]`) load faster and no longer flash a blank screen.** The page used to stream behind an empty `fallback={null}`, so on a cold cache you'd stare at nothing while three DB phases ran back-to-back (member record → activity aggregation → today's plans). Now: a branded skeleton shows immediately, the member record and activity aggregation are fetched in parallel instead of in a waterfall, "today's plans" stream in their own Suspense boundary so they never hold up the main profile, and `getMemberByIdPublic` does a single query instead of two (the redundant pre-migration fallback select is gone).

---

## [3.29.2] - 2026-05-25

### Accessibility

- **Fixed light-theme colour contrast across the homepage (Lighthouse a11y).** On the cream light-theme canvas the bright gold/terracotta/moss accents and the faint muted text didn't meet WCAG AA (4.5:1) for small text. Added contrast-safe text tokens (`terracotta-ink`, `gold-ink`, `moss-ink`) that deepen to rust/amber/green on cream but stay bright on the dark canvas (so dark theme is visually unchanged), darkened `--paper-faint`, and switched every accent button (`bg-gold`/`bg-terracotta`/`bg-ferry-yellow`) from the theme-flipping `text-ink-0`/`text-deep-water` to a fixed deep-ink so the label is always dark on the bright fill. Homepage now passes contrast at 0 failures in light mode.

### SEO

- **robots.txt is now standards-valid (Lighthouse SEO).** It previously emitted a non-standard `Content-Signal` directive per crawler group (13 lines), which robots.txt validators flag as errors. The AI content-usage preference (`ai-train=no, search=yes, ai-input=yes`) now ships as a site-wide `Content-Signal` HTTP response header instead, and the standard `Allow`/`Disallow` rules still gate every crawler (training-only bots like GPTBot/CCBot stay fully blocked). Also dropped the deprecated `Host:` line.

---

## [3.29.1] - 2026-05-25

### Fixed

- **Social share cards (OG images) still showed the old "IN" monogram.** The seagull mark only replaced the on-page logos in 3.29.0; the dynamically rendered Open Graph cards - the previews that show when a link is shared on social, in chats, etc. - still drew the red "IN" square. All OG renderers now embed the seagull badge instead: the generic page card, the member share card, and both their RTL (Arabic/Persian) variants, plus the `/api/og` fallback. Also removed the now-unused legacy `mark.tsx` logo component.

---

## [3.29.0] - 2026-05-25

### Changed

- **New brand mark across the whole site.** Replaced the old wordmark/"IN" monogram with our seagull mascot - a fez-wearing gull in front of the Istanbul skyline (Galata Tower, the Bosphorus bridge, a mosque) on a terracotta disc. The mark is rendered as a clean circular badge so it reads on both the light cream and dark deep-water themes, and it's now used in the header, footer, mobile menu, the homepage hero brand bar, the route loader, and the About page. Same logo in both themes - no more separate light/dark monochrome silhouettes.
- **Favicons and touch icons now use the seagull.** Replaced the code-drawn "IN" `icon.tsx`/`apple-icon.tsx` with static PNGs generated from the new mark, so browser tabs, bookmarks, and home-screen shortcuts show the real logo.
- **README** now leads with the new logo.

---

## [3.28.8] - 2026-05-24

### Changed

- **Route loader progress bar is now a purposeful indeterminate sweep.** It previously scaled a fill in and out in place (grow/shrink), which read as aimless and confused people. It is now a single segment that travels across the track in reading direction (right-to-left under RTL) - clear "working" motion. Reduced-motion users get a calm static bar.
- **Docs:** refreshed PRODUCT.md §14 ("Where things stand") through v3.28.8 - member OG share cards, on-demand link shortener, account page + Telegram notifications, and the mobile-89 / desktop-99 performance pass.

---

## [3.28.7] - 2026-05-23

### Performance

- **Desktop hero map now mounts on first interaction instead of on load.** The MapLibre WebGL init was the last big chunk of main-thread work during desktop page load (keeping Total Blocking Time ~1.7s and Speed Index ~4.9s). It now mounts on the first engagement signal (pointer move/scroll/key/touch), so the page reaches a settled interactive state first and the cinematic map fades in the instant the visitor moves - effectively immediate on desktop. The headline and CTAs render regardless; a fallback still mounts the map for visitors who never interact. Mobile/reduced-motion remain on the static hero.

---

## [3.28.6] - 2026-05-23

### Changed

- **Redesigned the route loading screen to match the brand + design system.** The old loading state used generic neutral/primary skeletons. The new one is grounded in the design tokens: the logo mark gently breathing inside a soft terracotta glow, the Fraunces display wordmark, a slim terracotta-to-moss progress bar, and a mono uppercase label - on the deep-water/cream canvas. Localized in all 5 locales and fully reduced-motion safe.

---

## [3.28.5] - 2026-05-23

### Performance

- **Delayed the desktop hero auto-tour so the page can reach a settled state first.** The cinematic map started its perpetual fly-to tour immediately, so the main thread never went quiet, Time-to-Interactive never settled, and Total Blocking Time ballooned (8-17s in PSI desktop). The map still renders instantly at the first stop (LCP unaffected); the auto-pan now begins ~5.5s after load, once the page is interactive. Big TBT reduction with the cinematic experience intact.

---

## [3.28.4] - 2026-05-23

### Performance

- **Mobile/reduced-motion now get a static hero instead of the WebGL cinematic map.** PageSpeed Insights (mobile) showed the homepage at a ~13.8s Total Blocking Time / 14.3s Speed Index, dominated by the MapLibre WebGL hero running on a throttled mobile CPU. The cinematic map now loads (via `next/dynamic`) and runs only on desktop viewports with motion allowed; mobile and `prefers-reduced-motion` users see the static deep-water hero and never download the ~1 MB maplibre chunk. Desktop experience unchanged.

---

## [3.28.3] - 2026-05-22

### Performance

- **Deferred the ~1 MB map bundle on the plan detail page.** `/plans/[id]` statically imported `PlanDetailMap`, which pulls in maplibre-gl + react-map-gl, putting that whole bundle on the page's critical path even though the map renders below the header (and only when stops have coordinates). It's now loaded via `next/dynamic` (`ssr: false`) so the plan header is interactive without waiting on the map - matching how `/spaces` and the neighborhoods map already load it. No behavior change (the map already rendered client-side only).

---

## [3.28.2] - 2026-05-22

### Performance

- **Deferred the site-wide Cmd-K menu and assistant widget off the initial hydration path.** Both were statically mounted in the root layout, so their JS (cmdk + the assistant flow graph) hydrated on _every_ page, inflating Total Blocking Time (the main driver of sluggish-feeling navigation - prod TBT was ~590ms). They now mount via `next/dynamic` (`ssr: false`) on the first engagement signal (pointer move/down, key, scroll, touch) or when the main thread goes idle, whichever comes first - so they're ready before a user reaches for them but no longer compete with first paint/hydration. Verified the assistant launcher + Cmd-K still work after first interaction.

---

## [3.28.1] - 2026-05-22

### Changed

- **Native-level polish of the Telegram notification + account-page strings** (tr/fa/ar/ru), reviewed by the per-locale editors. Highlights: gender-neutral phrasing for `{actor}` in Russian and Arabic (past-tense verbs assumed a male actor), consistent informal register (Persian/Russian "ты"/تو), warmer less-bureaucratic wording, and ZWNJ/punctuation fixes in Persian. English unchanged; all ICU placeholders and keys preserved.

---

## [3.28.0] - 2026-05-22

### Added

- **Telegram notifications for every social action.** Building on the v3.27.0 account page + toggles, members now get a localized DM (gated by their per-category preference) for:
  - **Plan activity** - someone leaves your plan, or a plan you're in is rescheduled (join & cancel already shipped).
  - **Comments** - someone comments on your plan.
  - **Tickets & payments** - someone buys a ticket on your plan, requests a refund, files a dispute, or your escrow payout is released.
  - **Events & RSVPs** - someone RSVPs (going/maybe) to your event, or an event you're attending is updated.
  - Every message routes through the central `notifyMember` helper (service-role lookup, never notifies the actor about their own action, localized to the recipient's `preferred_locale`), and is best-effort so it never blocks the underlying action.

---

## [3.27.0] - 2026-05-22

### Added

- **Account page with Telegram notifications.** New `/dashboard/account` page where members connect their Telegram account to the bot (deep-link flow, with live "waiting for you to tap Start" polling), see their connection status, and disconnect. Below that, a master "Telegram notifications" switch plus per-category toggles (plan activity, comments, tickets & payments, events & RSVPs, reminders).
- **Central notification helper** (`src/lib/notifications/notify.ts`): one gated, localized path for every Telegram DM. It reads the recipient's preferences + `preferred_locale` via the service-role client, skips if the master switch or that category is off (or the actor is the recipient), and renders the message in the recipient's language.
- **Per-member locale** (`preferred_locale`) captured at onboarding and whenever account settings are saved, so notifications arrive in the member's language.

### Fixed

- **Join/cancel Telegram notifications never actually fired.** They read the recipient's `telegram_subscriptions` row through the auth client, which the own-row-only RLS silently blocked. Routing them through the new service-role helper makes them work, and gates them behind the new toggles.

### Database

- **Migration 028** (`028_notification_prefs.sql`): adds `notify_telegram`, `notify_plan_activity`, `notify_comments`, `notify_tickets`, `notify_events`, `notify_reminders` (all `boolean default true`) and `preferred_locale` (`text default 'en'`) to `members`.
- ⚠️ **Must be applied to prod.** Until applied, the account page loads and Telegram connect/disconnect work, but saving notification toggles will error and notifications won't send.

---

## [3.26.1] - 2026-05-22

### Fixed

- **Short links (`/s/{code}`) returned 404.** The next-intl proxy middleware was applying locale routing to the locale-less short-link path, treating `s` as a locale and 404ing before the redirect route could run. Added `/s/` to the middleware skip list so `/s/{code}` resolves and 308-redirects correctly.

---

## [3.26.0] - 2026-05-21

### Added

- **On-demand link shortener + Share buttons.** Member, plan, paperwork, guide, and blog detail pages now have a "Share" button that creates-or-reuses a short link (`istanbulnomads.com/s/{code}`) and hands it to the native share sheet on mobile or the clipboard on desktop. Sharing the same entity twice returns the same code (deduped via a unique index). Short codes are 7-char base62 from `node:crypto` (no new dependency).
- **`/s/[code]` redirect route** (locale-less, like `/api`): 308-redirects to the canonical entity path; unknown codes fall back to the homepage.
- **`/api/share`**: IP rate-limited, validates the path against a per-kind allowlist (no open-redirect), records the signed-in member as creator when present.
- **Migration 027** (`supabase/migrations/027_short_links.sql`): new `short_links` table with a unique `(kind, entity_id)` index; RLS enabled with no policies (server-only access via the service-role client). All 5 locales get a `share` namespace.

> **Deploy note:** migration 027 must be applied to the production DB for the shortener to work. Until it's applied, the Share button surfaces a graceful error toast and nothing else breaks.

---

## [3.25.0] - 2026-05-21

### Added

- **Member social share cards.** Pasting a `/members/{id}` link into Telegram/WhatsApp/X/etc. now shows a branded 1200x630 card with the member's avatar (or initials disc), name, role chip, verification tier, and location instead of a bare link. Built on the existing dual-renderer OG system - satori for en/tr/ru, resvg-js for fa/ar with **full RTL parity** (mirrored layout, Arabic-shaped role/category/tagline labels). New `og.member` i18n keys in all 5 locales.

### Notes

- WebP/AVIF avatars may not decode in the OG renderers; those cards gracefully fall back to the initials disc. JPG/PNG avatars render normally. (Most browser-exported uploads are JPG/PNG.)

---

## [3.24.0] - 2026-05-21

### Added

- **Avatar upload on the profile editor.** The profile page now shows a circular photo at the top. Clicking it opens a file picker - pick any image (JPG, PNG, WEBP) under 5 MB and it uploads to Supabase Storage (`avatars/{userId}/avatar.{ext}`), updates `members.avatar_url`, and instantly shows the new photo. Camera icon on hover, spinner while uploading, toast on success or error. Falls back to initials if no photo is set. All 5 locales updated.

---

## [3.23.0] - 2026-05-21

### Added

- **Per-stop cost/budget range.** Hosts can now enter an optional "Spend here" TL min/max for each stop when creating or editing a plan. The values are stored in new `cost_min_cents` / `cost_max_cents` columns on `plan_stops` (migration 026). The detail page shows a wallet icon + range on each stop card, and the map popup shows the cost when you tap a pin. All 5 locales updated.
- **Migration 026** (`supabase/migrations/026_stop_cost.sql`): adds `cost_min_cents` and `cost_max_cents` integer columns to `plan_stops` with a `>= 0` check and a max-must-be-gte-min constraint. **Apply to production before deploying this version.**

---

## [3.22.0] - 2026-05-21

### Added

- **Delete button on own comments.** A trash icon appears inline in the comment header for the current user's own messages. Clicking it calls DELETE `/api/plans/[id]/comments/[commentId]` (author-only, no admin bypass) and removes the comment from local state on success.

### Fixed

- **`liraToCents` rejected 0 as invalid.** The `n > 0` guard in `plan-create-flow.tsx` meant a budget of ₺0 was silently dropped. Changed to `n >= 0` so free plans save correctly.
- **Free plans now display as "Free" on the plan detail page.** When both min and max budget are 0 (or max is null), `PlanMoneyChip` now renders a "Free" label with the moss icon instead of showing nothing.
- **Comments showed "-" for the current user's own optimistic messages.** The `author: null` in the optimistic update meant newly sent messages fell back to "-" until the page reloaded. The optimistic entry now sets `author: { id, display_name }` from the current member. Own messages show "You" (terracotta) instead of the member's name.

## [3.21.7] - 2026-05-21

### Fixed

- **Plan detail map popup: dark mode.** MapLibre renders a white `.maplibregl-popup-content` shell around popup children regardless of theme. Added global CSS to strip the shell's background, padding, and box-shadow so the inner React card (already dark/light via inline styles) is the only visible surface. Also hides the tip arrow (the numbered pins make context clear without it).

## [3.21.6] - 2026-05-21

### Fixed

- **Plan detail page load time.** `getCurrentMember()` and `getPlanById()` were sequential awaits - the plan query couldn't start until the auth check finished. Both are now fired with `Promise.all`, saving roughly one Supabase round-trip per page load. Same fix applied to the plan edit page.
- **Prettier formatting** on `plan-detail-map.tsx` and `hero-frame.tsx` was failing CI, which was potentially blocking the Vercel deployment of v3.21.5. Both files now pass `prettier --check`.

## [3.21.5] - 2026-05-21

### Fixed

- **Plan detail map: all pins show, route line draws, and popups work.** Three separate issues were preventing the full map experience:
  1. Missing neighborhood slugs - "karakoy" and 16 other slugs weren't in the `NEIGHBORHOOD_CENTERS` lookup, so stops with those slugs had no position and were dropped from the map. The table is now expanded to 27 slugs covering all commonly generated values.
  2. Route line GL race condition - the `Source`/`Layer` components were rendering before the map style finished loading, triggering a MapLibre error that silently discarded the layer. They're now gated on the `mapLoaded` flag.
  3. No click/popup - click handlers and the `Popup` component weren't wired up. Clicking a marker now opens a popup showing the stop number, name, vibe (with emoji), time range, notes, and an "approximate area" notice for neighborhood-fallback pins. Clicking the map background closes the popup.
     Also added `dedupePositions()` to spread stops that resolve to the exact same coordinate (e.g. two stops both falling back to a neighborhood center) so they're always individually clickable.

## [3.21.4] - 2026-05-21

### Fixed

- **Plan detail map now always shows.** The map was hidden for any plan whose stops only had a `neighborhood_slug` (no exact `lat`/`lng` and no `space_id`). Added a third fallback in `stopLatLng`: if a stop has only a neighborhood slug, resolve it to the hood's center coordinates from a `NEIGHBORHOOD_CENTERS` lookup table (10 Istanbul neighborhoods covered). Approximate pins render as a hollow terracotta ring + `MapPin` icon so users can tell it's a neighborhood-level estimate rather than a pinpoint address. Also fixed the `fitBounds` effect - it now runs on `mapLoaded` too, not just on `positioned` changes, so the camera correctly zooms to all pins once the map style finishes loading.

## [3.21.3] - 2026-05-21

### Fixed

- **Hero "Sign In" CTA persisting for authenticated users.** The hero section has its own nav bar (`HeroFrame`) that was completely separate from the main `AuthButton` - it had a hardcoded `<Link href="/login">` that always rendered regardless of auth state. Replaced it with a new `HeroAuthControl` component (same deferred Supabase check, hero's dark/cream palette) that shows name + dashboard link + sign-out when signed in, and the sign-in pill for guests. Auth state is fetched once in `HeroFrame` and shared to both the control and the primary CTA.
- **Hero primary CTA for signed-in users.** The "Let's connect nomads" button always went to `/onboarding`. Signed-in members now see "See today's board" → `/today` instead (i18n in all 5 locales).

## [3.21.2] - 2026-05-21

### Fixed

- **Auth header sync.** The "Sign In" button was showing for authenticated users because `AuthButton` had a `document.cookie` heuristic to skip loading Supabase for anonymous visitors. With `@supabase/ssr` v0.10, cookies can be HttpOnly or chunked in ways JS can't read, so the heuristic was falsely bailing out. Removed the early-return; the deferred dynamic import (100 ms timer) already prevents blocking the first paint for everyone.
- **Hero section RTL layout.** The headline block was `absolute left-6 / md:left-11` and the gradient mask was hardcoded to darken the left edge - both wrong in Arabic/Persian locales where reading direction is right-to-left. Switched to logical CSS properties (`start-6 / md:start-11`), moved the gradient to a `.hero-text-mask` CSS class with a `[dir=rtl]` override (265 deg instead of 95 deg), and added `rtl:rotate-180` to the CTA arrow icons.
- **Member + plan detail pages: faster first load.** `getMemberActivity` was firing four sequential Supabase round-trips (attendances + three trust-signal counts). The three count queries are now in a single `Promise.all` alongside the attendances query, cutting latency from ~4 serial trips to ~2.

## [3.21.1] - 2026-05-21

### Fixed

- **`/today` now shows the day's plans to everyone.** The board was gated behind auth, so signed-out visitors saw a "Sign in to see today's board" block instead of any plans - the page looked empty. Plans have public-read RLS, so the board is now public read-only (grouped morning/afternoon/evening, filtered to today), with joining/posting still gated. Replaced the full-screen sign-in gate with a slim "browsing as a guest - sign in to join or post" nudge above the board.

## [3.21.0] - 2026-05-21

**UI/UX polish pass.**

### Changed

- **Dialed-down, responsive type scale.** The heading scale in `tailwind.config.ts` was fixed and oversized (`display-lg` 80px, `h1` 56px, `h2` 38px, no mobile scaling). Headings now use `clamp()` so they're confident rather than shouty and scale down on mobile (`display-lg` ~42-52px, `h1` ~32-40px, `h2` ~24-30px, `h3`/`h4` likewise). One change, cascades site-wide.
- **Plan detail page polish**: title right-sized (`display-lg` → fluid `h1`), host card rounded with an **initials avatar fallback** (no more empty circle when a host has no photo), tighter spacing.
- **`/plans` perf**: the page was instantiating a translator per neighborhood (10 redundant awaits) to build the filter list - now one translator, reused.

### Fixed

- **Removed internal roadmap language from user-facing copy.** "Checkout opens in Phase 4" → "Checkout coming soon", "Verification required - unlocks in Phase 3" → "Verification required to charge", and the paperwork-publish disclaimer's "Phase 4" reference - across all 5 locales.

## [3.20.1] - 2026-05-21

### Changed

- **Richer seed plans for this week.** The seeder now generates 12 plans with the full feature surface: multi-stop itineraries (up to 4 stops) with per-leg transport (ferry/metro/walk + prices), budget plans (`budget_per_person_*`) and ticketed plans (`entry_fee_cents`, hosted only by verified guides, with `host_role_at_creation`/`host_badge_at_creation`), spread across the week. Includes the canonical 3-stop nomad plan with a ferry leg between stops.
- Seeder now purges prior seed plans/events globally by `[seed]` title prefix (cleans leftovers from older seeders).

### Removed

- Stale `scripts/seed-today-plans.ts` (superseded by `seed-mock-data.ts`; it set the now-invalid `member_type: "guide"`).

## [3.20.0] - 2026-05-21

**Dynamic paperwork markdown + mock data across every surface.**

### Added

- **`/paperwork.md` is now dynamic.** The markdown pipeline (`getMarkdownForPath`) is async and `/paperwork.md` lists the **live** verified agents and services (grouped by service type, with prices, host, languages, and detail URLs) - not a static overview. AI agents now read the same directory humans see.
- **`scripts/seed-mock-data.ts`** - an idempotent seeder that populates every public surface with realistic mock data: ~10 nomads/remote workers, ~10 local/tour guides, ~10 paperwork agents (with services), ~10 plans (this week), and ~10 trips (events). Seed members use stable `seed-*@istanbulnomads.local` emails; plans/events use a `[seed]` title prefix, so re-running refreshes cleanly. Applied to the database.

### Changed

- The MCP tool handlers (`get_guide`, `get_blog_post`) now `await` the markdown helper.

## [3.19.6] - 2026-05-21

**Complete the AI-doc content coverage.** Audited every public route against what the AI surfaces expose and closed the two gaps.

### Added

- **Circles** markdown twins: `/circles.md` (listing) + `/circles/<slug>.md` (per-circle), locale-aware, plus a Circles section in `llms.txt` and the `read-istanbul-content` skill.
- **Paperwork** markdown twin: `/paperwork.md` - the service-type overview + how-it-works, with a pointer to the live HTML directory and the `paperwork-help` doc. Added to `llms.txt` directories and the skill content map.

### Notes

- Coverage now spans every public content area (guides, neighborhoods, blog, path-to-istanbul, spaces, events, local guides, help docs, **circles**, **paperwork**, about/contact/credits) as markdown + in `llms.txt`. Product features (plans, verification, payments/escrow, paperwork, trust & safety, getting started) are covered by the help docs + the `explain-how-it-works` skill; the events and relocation APIs by their skills. Member/profile pages and the members-only plans board are intentionally excluded from the markdown/agent surfaces (people data + auth-gated live content).

## [3.19.5] - 2026-05-21

### Fixed

- **Content Signals in robots.txt.** robots.txt now emits per-crawler-group `Content-Signal` directives (`ai-train=no, search=yes, ai-input=yes` for the default + answer-engine groups; `ai-train=no, search=no, ai-input=no` for the training-only bots), declaring our AI content-usage preferences per [contentsignals.org](https://contentsignals.org/) / the AIPREF IETF draft. The typed `robots.ts` couldn't emit custom directives, so it's now a raw-text Route Handler. Also removed a stale `public/robots.txt` (which carried a Content-Signal but was being shadowed by the metadata route, so the served robots.txt had no signal). All existing per-crawler allow/deny rules, Host, and Sitemap are preserved.

## [3.19.4] - 2026-05-20

**Public agent guide for AI-readiness.**

### Added

- **`/AGENTS.md`** - a public, agent-facing guide (the agents.md convention, distinct from the repo-internal coding-rules AGENTS.md): what the site is, how to read content as markdown (incl. locale prefixes), every discovery endpoint (llms.txt, Agent Skills, MCP server card + HTTP endpoint, WebMCP, API Catalog, OpenAPI, OAuth metadata), the live skill list (pulled from the source of truth), the programmatic APIs, and the content-usage policy. Allow-listed in `proxy.ts` so the `.md` content-negotiation rewrite doesn't hijack it.
- `/AGENTS.md` is now referenced from `llms.txt` (Agent endpoints) and the `/.well-known/api-catalog` linkset.

### Changed

- api-catalog: corrected the robots.txt description to match what it actually emits (per-crawler AI bot allow/deny rules + content-usage policy) rather than claiming a machine-readable Content-Signal directive it doesn't yet output.

## [3.19.3] - 2026-05-20

### Fixed

- **Locale-aware markdown for AIs.** `getMarkdownForPath` now strips a leading locale prefix and serves the translated content, so `/tr/help/...md`, `/ar/...md`, etc. return the localized doc instead of **404** (locale-prefixed `.md` URLs were broken before - the `read-istanbul-content` agent skill advertised them but they didn't resolve). Threads the locale into the per-locale loaders (guides, help, blog, path-to-istanbul) with graceful English fallback where a translation doesn't exist; canonical URLs in the markdown header now carry the locale prefix. Data-driven listings (neighborhoods, spaces) stay English.

## [3.19.2] - 2026-05-20

**AI-facing surfaces + docs caught up to the help center & assistant.**

### Added

- **Markdown for the help docs**: `getMarkdownForPath` now serves `/help` (listing) and `/help/[slug]` (each platform doc), so the 6 docs are fetchable as `.md` by AI agents/crawlers like every other page.
- **New agent skill `explain-how-it-works`** (auto-exposed via `/.well-known/agent-skills/index.json` + `SKILL.md` + the MCP server card): tells AIs how the platform works - joining, free vs ticketed plans, the 3 verification levels, paperwork, payments/escrow/fees, trust & safety - with the authoritative facts and links to the help docs.
- `llms.txt` now lists the Help center + the 6 platform docs and adds `/paperwork` to the site sections; the `read-istanbul-content` skill's content map includes `/help/<slug>.md`.

### Changed

- **PRODUCT.md** refreshed: § 14 "Where things stand" now reflects what actually shipped (roles, verification, sandbox-ready payments, rich profiles + editor, onboarding rework, dashboard shell, help center, guided assistant) instead of listing them as pending; § 7 adds the `/help` routes + the guided assistant and corrects the stale "not built" status on `/dashboard/{profile,verify,payouts}`.

## [3.19.1] - 2026-05-20

### Fixed

- **Location picker "use my location"** now reports failures accurately. It previously showed "Location access was blocked" for _every_ failure - including when the browser silently refuses geolocation with no prompt. Now it checks for a secure context up front (geolocation only prompts over https/localhost) with a dedicated message, and distinguishes a real permission block (code 1) from "couldn't read your location" (position unavailable / timeout). New `locationPicker.geoInsecure` string across all 5 locales; sharpened `geoDenied` wording (points to browser settings).

## [3.19.0] - 2026-05-20

**Help docs fully localized.** The 6 platform docs are now translated into all 5 locales, so the help center and the guided assistant are locale-aware end to end - a Turkish visitor who taps the chatbot's "How plans work" card lands on a Turkish doc, not English.

### Added

- Turkish, Persian, Arabic, and Russian translations of all 6 platform docs (`src/content/help/{tr,fa,ar,ru}/*.mdx`): getting started, how plans work, getting verified, paperwork help, payments & escrow, trust & safety. Translated by the per-locale editor agents - MDX structure, links, and all facts/numbers (10% + ~2.9% fees, ~87%, 7-day escrow, the three verification levels) preserved verbatim; only prose translated. RTL-safe for ar/fa.

### Notes

- The help hub, FAQ, and assistant UI strings were already localized in 3.17.0/3.18.0; this fills the last gap (the long-form doc bodies that previously fell back to English).

## [3.18.0] - 2026-05-20

**Guided assistant.** A floating chatbot that feels like chatting but runs scripted flows and hands users real links - no LLM, fully deterministic.

### Added

- **`AssistantWidget`** - a launcher bubble (site-wide) that opens a chat-style panel. Bot messages + quick-reply chips advance scripted flows; terminal nodes render link cards that route into real content. Transcript + open state persist in `sessionStorage` across navigation. `role="dialog"`, Esc to close, `prefers-reduced-motion` respected, RTL-aware.
- **`src/lib/assistant/flows.ts`** - the decision-tree as data. Five intents: I'm new to Istanbul, find plans today, paperwork help, how does this work, find a place to work. Options deep-link into real filters (`/plans?range=today&vibe=cowork`, `/paperwork?type=ikamet`, help docs, neighborhood guides, spaces).
- **"Ask the assistant" CTA** on the `/help` hub (opens the widget via a custom event, mirroring Cmd-K).
- `assistant` i18n namespace (launcher, title, 6 node messages, 30 option labels) across all 5 locales.

### Changed

- The onboarding wizard suppresses the launcher while active (its sticky mobile footer would overlap), via `assistant-suppress`/`assistant-unsuppress` events - avoids a pathname hook that would force the static `[id]` page shells dynamic.

## [3.17.0] - 2026-05-20

**Help hub + rich docs + searchable FAQ.** A single `/help` knowledge base that answers both "how does this site work?" and "how do I live in Istanbul?" - groundwork for the guided chatbot landing next.

### Added

- **`/help` hub** - hero + in-memory search across FAQ, platform docs, and city guides; category-grouped FAQ accordion; platform-doc cards; a link out to the city guides. Emits `FAQPage` JSON-LD for search/answer engines.
- **6 platform docs** (`/help/[slug]`) authored as MDX, rendered through the existing guides pipeline: getting started, how plans work, getting verified, paperwork help, payments & escrow, trust & safety. Facts grounded in the code (10% platform + ~2.9% processor fee, ~87% to the guide, 7-day escrow holdback, the three verification levels).
- **Categorized FAQ** - expanded from 10 city-only items to 28 across 8 categories (getting started, plans, verification, paperwork, payments, safety, living in Istanbul, your account), in all 5 locales.
- **`src/lib/help-docs.ts`** (doc catalog + MDX loader), **`src/lib/help-search.ts`** (search dataset), **`HelpExplorer`** component.

### Changed

- `src/lib/faq.ts` rewritten to a categorized model (`category` + `href`); the unused, stale `faq-section.tsx` removed.
- "Help & FAQ" added to the footer Resources column and the Cmd-K search.
- New `helpPage` + `faqCategories` i18n namespaces across en/tr/fa/ar/ru. FAQ + hub strings are fully translated; the long-form platform-doc MDX is English-first and falls back gracefully until translated.

## [3.16.3] - 2026-05-20

**Searchable nationality picker.**

### Added

- **`src/lib/nationalities.ts`** - all 250 world nationalities (demonym + country + flag + ISO-2, sourced from the REST Countries API).
- **`NationalityPicker`** (`src/components/ui/nationality-picker.tsx`) - searchable combobox (by demonym or country name, diacritic-insensitive, with flags) storing the demonym string. i18n across all 5 locales.

### Changed

- The free-text Nationality input in onboarding (About step) and the profile editor is now the searchable `NationalityPicker`.

## [3.16.2] - 2026-05-20

**Connected dashboard shell.** The dashboard area now feels like one product instead of stray pages.

### Added

- **`/dashboard/layout.tsx` + `DashboardNav`** - a persistent, sticky sub-nav (Overview, Profile, and - for hosts/agents - Verification, Payouts) across every dashboard page, with active-tab state and icons. i18n across all 5 locales.

### Changed

- Dashboard overview quick-links now focus on exploring the app (your public profile, plans, share a plan, directory, events, paperwork); profile/verification/payouts moved into the sub-nav.
- Removed the redundant "back to dashboard" link from the profile editor (the nav handles it).

## [3.16.1] - 2026-05-20

**Onboarding stay fields + date-write guard.**

### Added

- The first-run onboarding wizard (interests step) now also collects **move-in / move-out dates** and **favorite spots**, matching the profile editor's Stay section. i18n across all 5 locales.

### Fixed

- Empty date inputs now coerce to `null` before writing (`nullifyEmpty` in the onboarding wizard, matching the profile editor), so clearing an optional date no longer errors against the Postgres `date` columns.

## [3.16.0] - 2026-05-20

**Onboarding + profile refinement.** The nomad signup is shorter and clearer, location is now a real searchable Istanbul picker, skills are finally fillable, and "Complete profile" opens a proper section-by-section editor instead of replaying the signup wizard.

### Schema (migration 025)

- **`members.arrival_status`** (text, nullable) - where a member is in their move: `in_istanbul` | `elsewhere_turkey` | `planning`.

### Added

- **`src/lib/istanbul-locations.ts`** - all 39 Istanbul districts and their 960 neighborhoods (sourced from the public Türkiye API, not hand-authored), plus flat `ISTANBUL_PLACES` for a single searchable list.
- **`LocationPicker`** (`src/components/ui/location-picker.tsx`) - diacritic-insensitive searchable district/neighborhood combobox with a "use my location" button that reverse-geocodes the device position to an Istanbul district. Stores district in `location` (drives directory grouping) and neighborhood in `city_district`.
- **Skills tag input** in onboarding + the profile editor, writing `members.skills` (so the dashboard's skills completeness check is finally fillable).
- **`/dashboard/profile`** - a new section-by-section profile editor (About, Location, Work, Interests, Stay, Contact, Visibility). Each card saves independently. The Stay section also captures move-in/out dates + favorite spots.
- **Reusable `ChipInput`** (`src/components/ui/chip-input.tsx`).
- **`scripts/apply-migration.sh`** - applies a migration file to the prod project via the Management API.

### Changed

- **Onboarding role step trimmed**: only Nomad vs Remote-worker now, plus an arrival-status question. Local guides, tour guides, and paperwork agents sign up through their own forms - the `is_agent` toggle and guide tiles are gone from the nomad flow.
- **Free-text "City / District"** input replaced by the searchable `LocationPicker`.
- **Dashboard quick-links expanded** (share a plan, paperwork, get verified) and "Complete/Edit profile" now opens `/dashboard/profile` instead of the signup wizard.
- New i18n (`locationPicker`, `profileEditor`, onboarding arrival/skills, dashboard links) across all 5 locales.

## [3.15.0] - 2026-05-20

**Onboarding explainer strips.** New diagram-heavy "how it works" sections wire the product together so visitors and members aren't confused about plans, paperwork, or what the badges mean. Shared core content, placed on the pages where the questions actually come up.

### Added

- **`howItWorks` i18n namespace** across all 5 locales (en/tr/fa/ar/ru) - `loop`, `plans`, `paperwork`, `legend`.
- **`TheLoop`** (homepage, N° 02) - the canonical 5-step community cycle (land → find your people → today's plans → meet → repeat) as a connected SVG rail on desktop, vertical timeline on mobile, with a "every morning, again" loop-back caption. RTL-safe arrows.
- **`PlansExplainer`** (`/plans`, N° 08) - budget vs ticketed plan comparison + a 4-node escrow timeline SVG (pay → held → plan happens → guide paid after 7 days) reassuring buyers their money stays safe.
- **`PaperworkExplainer`** (`/paperwork`) - 3-step strip (browse verified agents → pick who fits → reach out directly) with a not-legal-advice disclaimer up front.
- **`BadgeLegend`** (`/members`) - collapsible `<details>` legend rendering live samples of role chips, verification badges, and status pips next to one-line meanings, so the directory is self-documenting.

### Changed

- Added the `.rtl-flip-x` CSS helper to `globals.css` for mirroring directional arrows under RTL locales.

## [3.14.0] - 2026-05-20

**Phase 5: paid-plan marketplace (sandbox-ready).** The full money flow - checkout, escrow, 7-day payout, refunds, disputes, guide payout dashboard - is wired end-to-end against an `isIyzicoConfigured()` guard. No live iyzico keys yet, so every payment call returns a typed "not configured" result and the UI shows a clean "payments aren't live yet" state (never a fake payment UI). Flip real keys via env vars and it goes live. Fee model: guide keeps ~87% (10% platform + ~2.9% processor off the sticker price).

### Schema (migration 024)

- **`plan_tickets`** money ledger - one row per attendee per ticketed plan. Columns: `gross_cents`, `platform_fee_cents`, `processor_fee_cents`, `net_to_host_cents`, `currency`, `status` (`pending`/`held`/`released`/`refunded`/`disputed`/`failed`), `payment_provider`, `conversation_id` (idempotency), `payment_intent_id`, + paid/released/refunded/disputed timestamps & reasons. Unique partial index = one non-failed ticket per attendee per plan. RLS: attendee + host read their own; all writes via service role.
- **`members` payout fields**: `payout_iban`, `payout_name`, `iyzico_submerchant_key`.

### Added

- **`src/lib/payments/fees.ts`** - `computeFeeBreakdown` (integer kuruş math, net = remainder so the parts always reconcile to gross), lira<->cents helpers.
- **`src/lib/payments/iyzico.ts`** - env-gated wrapper: `isIyzicoConfigured`, `createCheckout`, `verifyPayment`, `ensureSubmerchant`, `releaseToSubmerchant`, `refundPayment`. Each is the single integration point to fill once keys + the `iyzipay` SDK land.
- **`src/lib/payments/tickets.ts`** - service-role ledger ops (create pending, mark held/failed/refunded, open dispute, release cleared).
- **`createServiceClient`** added to `src/lib/supabase/server.ts` for money/admin operations that bypass RLS.
- **`POST /api/plans/[id]/checkout`** - creates a pending ticket + iyzico checkout; returns 503 `payments_not_live` until configured.
- **`/api/payments/iyzico-callback`** - verifies the result, flips ticket held/failed, redirects with a status flag.
- **`/api/cron/release-payouts`** - daily cron (3am, wired in vercel.json), releases held tickets past the 7-day holdback.
- **`/api/tickets/[id]/refund`** - attendee refund, 24h-before-plan window.
- **`/api/tickets/[id]/dispute`** - attendee dispute, within 7 days of the plan, freezes payout.
- **`/api/payouts/setup`** - guide IBAN + sub-merchant setup, gated to verified host roles.
- **`/dashboard/payouts`** - guide payout dashboard: pending vs released balance cards, IBAN setup form, ticket history.
- **`TicketCheckoutButton`** on `/plans/[id]` for ticketed plans (non-host, non-attendee) - "Buy ticket · {price}".
- **Payouts link** on `/dashboard` for host roles + agents.
- **i18n** (en/tr/fa/ar/ru): `payouts.*` namespace + `plans.checkout.*`.

### Deploy notes

- Migration 024 applied to production before code deploy.
- **Not live until env vars are set**: `IYZICO_API_KEY`, `IYZICO_SECRET_KEY`, `IYZICO_BASE_URL`. Until then checkout shows "payments aren't live yet" and the payout cron no-ops.
- When keys land: install the `iyzipay` SDK, fill the 6 integration points in `iyzico.ts`, create the platform merchant, and run a sandbox end-to-end before flipping production keys.
- **Out of scope for this cut**: guide subscription tiers (Free/Standard/Pro plan-volume gating) - separate follow-up.

## [3.13.2] - 2026-05-20

**Trust signals - earned badge pills on profiles.** Non-fakeable reliability signals computed from real plan history. Positive-only: members who haven't earned a signal simply don't see that pill (no public shaming, no raw no-show/cancellation counts ever displayed).

### Added

- **`TrustSignals` type** in `src/lib/member-activity.ts`: `hostedCount`, `cancelledHostedCount`, `joinedCount`, `noShowCount`, `lastAttendedDate`. Computed via 3 lightweight `count` queries inside the existing `getMemberActivity` round-trip.
- **`created_at` on `MemberPublic`** + widened profile queries so "Member since" can render.
- **Trust pill cluster** below the stats strip on `/members/[id]`:
  - **"Member since {Mon Year}"** - always shown (anchor pill so a fresh profile isn't bare)
  - **"★ Reliable host"** (terracotta) - hosted >= 3 plans, 0 cancelled
  - **"✓ Shows up on time"** (moss) - joined >= 3 plans, 0 no-shows
  - **"● Active this week"** (ferry-yellow) - attended a plan within the last 7 days
- **i18n** (en/tr/fa/ar/ru) for all four trust labels.

### Design notes

- Signals are **earned-only**. A member with no-shows just doesn't get the "Shows up on time" badge - we never render "2 no-shows" or "cancelled 3 plans". The negative counts are silent gates.
- All thresholds set at >= 3 so the badges mean something but are reachable at small scale.
- `isActiveThisWeek` computed in the async server component (not the leaf) to keep the React Compiler `purity` rule happy about `Date.now()`.

## [3.13.1] - 2026-05-19

**"What's coming up" section.** Sibling to the past-plans timeline - shows the next 6 plans a member is hosting or going to, in chronological order. HOSTING vs GOING chip per row tells you their role in each plan at a glance.

### Added

- **`UpcomingPlan` type** in `src/lib/member-activity.ts` (extends `PastPlan` with `isHost: boolean`).
- **`getMemberActivity`** now returns `upcomingPlans` (last/next 6 by `scheduled_date`) alongside `pastPlans`. Same single Supabase query, split client-side on today's date in Europe/Istanbul.
- **N° 05 "What's coming up"** section on `/members/[id]` - sky-blue tone heading, 6 rows of date / title / role chip (`HOSTING` terracotta / `GOING` moss) / neighborhood. Hidden when empty.
- **i18n** (en/tr/fa/ar/ru) for `profile.upcomingPlans`, `hostingTag`, `goingTag`.

### Changed

- **Section renumbering** on the profile: Past plans bumped to N° 06, Hood passport to N° 07, People met to N° 08, Favorite spots to N° 09. Conditional renders unchanged - empty sections still hide.

### Mock data

4 upcoming demo plans seeded (Ahmet's jazz / Cem's breakfast crawl / Mehdi's ikamet walkthrough / Sibel's Çiya dinner), each cross-attended by the other demo members so the new section renders for every demo profile.

## [3.13.0] - 2026-05-19

**Profile Phase 2: the "fun and good" pass.** Adds a stats strip, past-plans timeline, gamified neighborhood passport, "people you've met" co-attendee grid, favorite-spots chip section, and a stay-window pip. Migrations 021 + 022 + 023 applied to prod.

### Added

- **`members.move_in_date`** + **`planned_move_out_date`** (DATE) - drives the "Here for X more weeks" ferry-yellow pip on profile. Constraint ensures move-out >= move-in when both set.
- **`members.favorite_spots`** TEXT[] (cap 12) - chip list of the member's favorite places in Istanbul.
- **`src/lib/member-activity.ts`** - `getMemberActivity(memberId)` returns `pastPlans` (last 6 + total count), `neighborhoodsVisited`, `coAttendees` (top 8 by shared plan count). Cached with `cacheLife("minutes")` + `cacheTag("member-activity")`.
- **Stats strip** on `/members/[id]` - three-column display of total plans / hoods visited / people met. Only renders when at least one is non-zero.
- **"Here for X more weeks" pip** below the bio when `planned_move_out_date` is set. Switches to "Leaving this week" at <=1 week out.
- **N° 05 Past plans** section - timeline of last 6 attended plans with date / title / neighborhood, each clickable through to `/plans/[id]`.
- **N° 06 Neighborhood passport** - visual chip grid of all 10 Istanbul neighborhoods, with check-marked ferry-yellow chips for ones the member has visited, hollow outline chips for ones they haven't. Gamified without being pushy. Counter shows "{visited} / {total}".
- **N° 07 People they've met** - 2-4 column grid of co-attendee cards (avatar + name + "Met once" / "Met N times"). Aggregated from shared plan attendance.
- **N° 08 Favorite spots** - terracotta-toned chip list.

### Changed

- **`MemberPublicProfile`** + `getMemberByIdPublic` query widened with new columns.
- **`/members/[id]` editorial body** now has 8 numbered sections (N° 01-08) with consistent eyebrow + tone-per-category pattern. Sections hide if empty.

### Migration / deploy notes

- **Migration 021** - schema for new fields.
- **Migration 022** - public read policy on `plan_attendees` for `going`/`confirmed` rows so the profile aggregates work for anonymous visitors. Privacy preserved via the existing `members.is_visible` gate on the join.
- **Migration 023** - public read on `plans` + `plan_stops` for `active`/`expired` plans (cancelled plans stay private). Required for the past-plans + neighborhood-passport aggregation to resolve titles + stops.
- All three applied to production Supabase via Management API before code deploy.
- Mock attendance data seeded for the 4 demo members (Ahmet, Cem, Mehdi, Sibel) so each profile shows real numbers in the stats strip + populated sections.

### i18n (en/tr/fa/ar/ru)

- `profile.pastPlans` / `hoodPassport` / `peopleMet` / `favoriteSpots`
- `profile.statPlans` / `statHoods` / `statPeople`
- `profile.metOnce` / `metPlural` (with `count`)
- `profile.weeksLeft` / `lastWeekHere`

## [3.12.0] - 2026-05-19

**Rich member profiles - nomads.com-style depth, editorial categorization.** Profile pages get a multi-section editorial layout with three new free-text chip categories (Working on / Happy to talk about / Hobbies + interests) plus a current-vibe status pip. Onboarding wizard captures all four fields with a clean chip-input UX. Migration 020 applied to prod.

### Added

- **`members.current_status`** TEXT enum (six values: `deep_work`, `open_to_meet`, `exploring`, `settling_in`, `hosting`, `hibernating`). Drives the vibe pip on profile + directory cards.
- **`members.working_on`** TEXT[] - up to 8 free-text chips ("what you're focused on right now").
- **`members.wants_to_talk_about`** TEXT[] - up to 8 chips ("conversation starters you'd enjoy").
- **`members.hobbies`** TEXT[] - up to 12 chips ("life outside work").
- **`src/lib/member-profile.ts`** - `CURRENT_STATUS_OPTIONS` + `STATUS_TONE` map (per-status background/text/dot color).
- **Partial index** `members_status_open_idx` on the open-to-meet + hosting subset for future "currently open" filters.

### Changed

- **Onboarding wizard step-interests** gained a vibe picker (6 chip tiles) + 3 free-text chip inputs (Working on / Happy to talk about / Hobbies). The new `ChipInput` component handles Enter/comma-to-add, Backspace-to-remove-last, click-chip-to-remove, and respects per-field max counts.
- **`/members/[id]` rebuilt as editorial sections**: hero (avatar + role/verified/agent badges) → editorial body (eyebrow + display name + status pip + bio + plan list) → **N° 02 Working on** (terracotta tone) → **N° 03 Happy to talk about** (ferry-yellow tone) → **N° 04 Hobbies + interests** (moss tone) → skills + languages + website. Each chip section hides itself if the underlying array is empty.
- **`/members` directory cards** show a tiny tone-coded status dot inline with the display name. Members without a status set show nothing - no "Unverified vibe" shaming.
- **`MemberPublic`** + `MemberPublicProfile` now include the new fields; queries widened to fetch them.

### i18n (en/tr/fa/ar/ru)

- `currentStatusOptions` (6 labels) + `currentStatusLabel`/`Hint`
- `workingOnLabel`/`Hint`, `wantsToTalkLabel`/`Hint`, `hobbiesLabel`/`Hint`
- `chipAdd` / `chipRemove` / `chipPlaceholder`
- `profile.workingOn` / `wantsToTalk` / `hobbies` section headers

### Migration / deploy notes

- Migration 020 applied to prod before the code deploy.
- Demo members (Ahmet, Cem, Mehdi, Sibel) seeded with realistic chip data for `/paperwork` + `/members` to look populated.
- No breaking changes - all new fields are nullable; existing members render unchanged until they update.

## [3.11.1] - 2026-05-19

**Phase 3 closeout: verification flow becomes discoverable end-to-end.** 3.11.0 shipped the schema + form + ticketed-mode gate; 3.11.1 wires the badge across every host-facing surface and gives members entry points beyond the `/plans/new` ticketed CTA.

### Added

- **`/dashboard` verification card** for host-role members (and `is_agent` members). Shows current Red/Blue/Gold badge + a CTA to `/dashboard/verify`. Hidden for plain `nomad` / `remote_worker` accounts since the badge doesn't gate anything for them.
- **VerificationBadge on `/plans/[id]` host card** - next to the host's name.
- **VerificationBadge on `/paperwork/[id]` host card** - next to the host's name.
- **Cancel-request button** on the pending-state panel at `/dashboard/verify`. Wired through a new `DELETE /api/verification` handler that narrows to `status='pending'` so already-decided requests can't be reversed.
- **Onboarding nudge** on the final step for host-role + `is_agent` members - a small "Verification unlocks paid plans" panel pointing at `/dashboard/verify` so the flow is discoverable from sign-up.
- **`/paperwork/new` verification gate** - now redirects unverified agents to `/dashboard/verify?next=/paperwork/new` and the `POST /api/paperwork` handler returns 403 if `verification_level` isn't `verified` or `trusted`. Brings paperwork in line with ticketed plans (both are paid-surface actions).

### Changed

- **`getPlanById` + `PlanCardSummary` host shape** now include `verification_level` so plan cards/detail can render the badge.
- **`PaperworkServicePublic` host shape** includes `verification_level`.
- **`PendingState` panel** delegates to a small client component (`<PendingPanel>`) so it can issue the cancel-request fetch + page refresh.

## [3.11.0] - 2026-05-19

**Phase 3: three-tier verification ladder.** Red (basic), Blue (verified), Gold (trusted) badges are real and gate the entry-fee field that Phase 2 plumbed. Phase 3 v1 ships the schema + manual organizer-approval flow (review via Supabase dashboard); a real KYC vendor SDK plugs in later via the `verification_requests.kyc_provider` column. Migration 019 applied to production.

### Schema (migration 019)

- **`members.verification_level`** TEXT NOT NULL DEFAULT `'basic'` CHECK in (`basic`,`verified`,`trusted`). Partial index on the `verified|trusted` subset for hot-path filters.
- **`members.verified_at`** TIMESTAMPTZ, **`members.verified_by`** UUID (organizer who signed off).
- **New `verification_requests`** table - `member_id`, `requested_level` (`verified`|`trusted`), `status` (`pending`|`approved`|`rejected`|`cancelled`), `reason`, `document_ref`, KYC hooks (`kyc_provider`, `kyc_session_id`, `kyc_status`), review trail. Unique partial index enforces one pending request per member.
- **Trigger**: when a request flips to `approved`, member's `verification_level` is automatically bumped + audit columns set.
- **RLS**: members read their own requests, insert their own, and can cancel their own pending request. Approval is org-only via service-role.
- **`plans.host_badge_at_creation` backfill**: existing plans whose creator has been upgraded since posting now reflect the current badge.

### Added

- **`src/lib/verification.ts`** - single source of truth: `VERIFICATION_LEVELS`, `canChargeEntryFees`, `VERIFICATION_TONE` (Red dot / Blue check / Gold star).
- **`<VerificationBadge>`** at `src/components/ui/verification-badge.tsx` - Red hidden by default, Blue + Gold rendered with tone-coded chip + sr-only tooltip text.
- **`/dashboard/verify`** - host-role members apply for the Blue badge. Pending/rejected/trusted states each get a tailored panel.
- **`POST /api/verification`** - rate-limited (5/day per member). Self-service for Blue only; Gold rejected with a Telegram-CTA.
- **`<VerifyForm>`** client component with a free-text reason (20+ chars, max 1000), submits to the API, refreshes the page to reflect new state.
- **Verification badge on `/members/[id]`** - sits alongside `RoleBadge` and (if applicable) the Agent chip.

### Changed

- **`/plans/new` ticketed-mode gate** is now real:
  - Verified+ host-role members → ticketed toggle is enabled (was disabled with "Verification required" copy).
  - Unverified host-role members → see a "Verify to charge" CTA linking to `/dashboard/verify`.
  - Non-host roles → see only the budget mode (no ticketed option exposed).
- **`createPlan` mutation** now snapshots `host_badge_at_creation` from the live `verification_level` (was hardcoded `'basic'`) and server-side gates `is_ticketed=true` to verified+ hosts even if the client tries to bypass.
- **`MemberPublic` + `getMembersPublic` + `getMemberByIdPublic`** include `verification_level`.

### Migration / deploy notes

- Migration 019 applied to production Supabase via Management API before code deploy.
- All existing members default to `basic`; no badges are auto-awarded.
- Approval flow for v1 is manual via Supabase dashboard - flip `verification_requests.status` to `approved` and the trigger bumps the member. Admin UI lands later.

## [3.10.0] - 2026-05-19

**Phase 2 of the product plan: Plans v2 + `/paperwork` surface + agent capability flag.** Plans gain a budget vs entry-fee field split, `culture` vibe lands, and agents move from being a primary role to a capability flag (`is_agent`) so the same account can be both a `nomad` AND offer paperwork services. New `/paperwork` directory + detail + creation surfaces serve agent-hosted services (visa, ikamet, residency permit, bank account, notary, GBT, tax office). All migration plumbing applied to production; payments still gated by Phase 3 verification.

### Schema (migration 018)

- **`members.member_type`** CHECK constraint reduced from 5 to **4 values**: `nomad`, `remote_worker`, `local_guide`, `tour_guide`. `agent` is no longer a primary role.
- **New `members.is_agent`** BOOLEAN NOT NULL DEFAULT FALSE. Capability flag - any role can also be flagged as offering paperwork services. Partial index on `(is_agent)` filtered to visible onboarded members.
- **`plan_stops.vibe`** CHECK extended with `culture` (concerts, gallery walks, neighborhood tours). **No `admin` or `paperwork` value** - paperwork is a separate surface, not a plan-stop type.
- **`plans` money fields** (per-plan, not per-stop): `is_ticketed` BOOLEAN, `entry_fee_cents`, `budget_per_person_min_cents`, `budget_per_person_max_cents`, `currency` (TRY-only for v1). CHECK constraint enforces mutual exclusion - ticketed plans have entry fee, budget plans have the range, never both.
- **`plans` host snapshots**: `host_role_at_creation` (frozen at insert), `host_badge_at_creation` (`basic` until Phase 3). Existing plans backfilled from `members.member_type`.
- **New table `paperwork_services`**: `host_id`, `service_type` enum (visa / ikamet / residency_permit / bank_account / notary / gbt / tax_office / other), `title`, `description`, `languages[]`, `neighborhoods[]`, `price_cents`, `currency` (TRY), `duration_estimate_minutes`, `is_active`. Public-read RLS, host-write RLS, trigger enforces `host_id` belongs to an `is_agent=true` member.

### Added

- **`/paperwork`** directory at `(marketing)/paperwork/page.tsx` - service-type filter chips, grouped grid, per-card host badge. Filter by service type or by host (`?type=visa`, `?host=<id>`).
- **`/paperwork/[id]`** detail page - service description, languages spoken, neighborhoods covered, duration estimate, price, Telegram CTA to the host. Disclaimer at the bottom.
- **`/paperwork/new`** creation page at `(app)/paperwork/new/page.tsx` - gated to `is_agent=true` members. Form covers service type, title, description, comma-separated languages + neighborhoods, price in TL, optional duration.
- **`POST /api/paperwork`** creates a service (rate-limited 10/hr per member, RLS + trigger enforce `is_agent`).
- **"Also offer paperwork services?" toggle** on the onboarding wizard's interests step - wires `is_agent` for any role.
- **"Agent" badge** on `/members/[id]` profiles - linked to `/paperwork?host=<id>`.
- **"Paperwork" filter chip** on `/members` - `?agent=1` toggles the directory to show only `is_agent=true` members.
- **"Paperwork" nav destination** in the workspace navbar (`/paperwork`) - icon: `FileText`.
- **Plan creation money block** in `plan-create-flow.tsx` - budget min/max OR entry fee + currency. Entry-fee mode shown only for `local_guide` + `tour_guide` hosts and currently disabled with a "Verification required - unlocks in Phase 3" tooltip. Other roles only see budget mode.
- **`PlanMoneyChip`** on `/plans/[id]` - shows "Expect 200-400 TL per person" for budget plans or "Entry fee: 350 TL · Checkout opens in Phase 4" for ticketed plans.

### Changed

- **`member-roles.ts`** dropped `agent` from `MEMBER_ROLES`; `HOST_ROLES` is now `[local_guide, tour_guide]` (the gold-star plan hosts); added `AGENT_TONE` for the secondary capability chip.
- **`today/types.ts` host-type collapse** still maps `local_guide` + `tour_guide` to `"guide"`; everyone else → `"nomad"`. Agents on community plans render with their primary role (nomad or local_guide), not as a separate "agent" badge.
- **`PLAN_VIBES`** in `src/lib/plans/vibes.ts` extended with `culture` (icon: `Music`).
- **`planCreateSchema`** in `src/lib/plans/schema.ts` gained money fields with cross-field refines (ticketed needs entry_fee; budget min <= max).
- **`createPlan` mutation** captures `host_role_at_creation` + `host_badge_at_creation` at insert time, server-side gates `is_ticketed=true` to host roles even if the client tries to bypass.

### Migration / deploy notes

- Migration 018 applied to production Supabase via Management API before this release.
- No data loss: previously no member had `member_type='agent'` in prod, so the constraint tightening was a pure schema change.
- Pre-migration deploys remain safe via the existing two-pass `getMemberByIdPublic` (no change needed there).
- The `paperwork_services` table is empty at launch; agents must be onboarded with `is_agent=true` and publish services before `/paperwork` shows entries. The directory's empty state guides new users to Telegram.

## [3.9.0] - 2026-05-19

**Phase 1 of the product plan: member roles + lightweight profile.** Five operational roles land (`nomad`, `remote_worker`, `local_guide`, `tour_guide`, `agent`). New profile-aware sections, role-filtered `/members` directory, conditional onboarding fields for the host roles, full 5-locale i18n coverage. **No verification yet, no payments yet** - this is the foundation. See [docs/product-plan.md](docs/product-plan.md) for what Phase 2-4 build on top.

### Schema (migration 017)

- **`members.member_type` repurposed** from descriptive self-id (`expat`, `digital-nomad`, `traveler`, etc.) to operational role. CHECK constraint enforces one of: `nomad`, `remote_worker`, `local_guide`, `tour_guide`, `agent`. Existing values migrated cleanly: `guide` and `local-internationally-minded` → `local_guide`, everything else descriptive → `nomad`. Nullable allowed for in-flight onboarding rows.
- **New `members.professional_role`** TEXT (≤120 chars). Free-text "what do you do" - only shown on `remote_worker` profiles, but persists across role changes.
- **New `members.tour_guide_license_no`** TEXT (≤60 chars). Cleared automatically by a `BEFORE UPDATE` trigger when `member_type` moves away from `tour_guide`.
- **New `members.xp`** INTEGER NOT NULL DEFAULT 0. Schema only; increments come in Phase 5.
- **New partial index** `members_visible_role_idx` on `member_type` (filtered to `is_visible = true AND onboarding_completed = true`) for the `/members?role=...` filter.

### Added

- **[src/lib/member-roles.ts](src/lib/member-roles.ts)** - single source of truth for the 5 roles. Exports `MEMBER_ROLES`, `isMemberRole` type guard, `HOST_ROLES` + `isHostRole` predicate, and a `ROLE_TONE` tailwind-token map for badges.
- **[src/components/ui/role-badge.tsx](src/components/ui/role-badge.tsx)** - presentational chip used on the profile page; caller passes translated label so the leaf stays cache-safe.
- **Role selector tile grid** in the onboarding wizard's interests step ([src/app/[locale]/(app)/onboarding/steps/step-interests.tsx](<src/app/[locale]/(app)/onboarding/steps/step-interests.tsx>)). 5 tiles with title + description per role.
- **Conditional onboarding fields**: `professional_role` text input shows when `member_type === "remote_worker"`; `tour_guide_license_no` text input shows when `member_type === "tour_guide"`. Both auto-save with the rest of the form on step transitions.
- **Role filter chip strip** on `/members` (URL-driven, server-filtered). 6 chips: All + each role. Links use the locale-aware `Link` so `/tr/members?role=local_guide` works without locale loss.
- **Role-aware profile sections** on `/members/[id]`:
  - `<RoleBadge>` shown below the avatar
  - "Profession" fact prefers `professional_role` for `remote_worker` members, falls back to the legacy `profession` field for everyone else
  - "Tour guide license" fact shown only for `tour_guide` members with a license number

### Changed

- **`getMemberByIdPublic`** uses a two-pass select - core columns first, then a best-effort fetch of `professional_role` + `tour_guide_license_no`. Pre-migration, the second pass throws and we render with what we have so the page doesn't 404.
- **`getMembersPublic`** + `MemberPublic` now include `member_type` for the role filter.
- **`today/types.ts`** `host.type` collapse logic updated: `local_guide` and `tour_guide` map to `"guide"` (the gold "★ Local guide" tag); all other roles map to `"nomad"`.
- **i18n**: `memberTypeOptions` + `memberTypeDescriptions` + `professionalRoleLabel`/`Placeholder` + `tourGuideLicenseLabel`/`Hint` + `memberTypeHint` keys added to `en/tr/fa/ar/ru`. The old descriptive labels (`expat`, `traveler`, etc.) are no longer referenced and will be removed in a follow-up i18n sweep.
- **`profile.tourGuideLicense`** key added to `membersV2.profile` in all 5 locales.
- **`roleFilterAria` + `roleFilterAll`** added to `membersV2` for the directory filter strip.

### Migration / deploy notes

- **Migration 017 must be applied to Supabase before this code goes live**, otherwise the new columns won't exist and onboarding writes will fail. The two-pass `getMemberByIdPublic` keeps the read path safe in either order, but writes need the columns.
- **No data loss** for existing members. The migration normalises old `member_type` values; nobody loses access.
- **Existing onboarded members** with no recognised role (`member_type` stays `nomad` after migration) won't see a role badge until they re-enter onboarding (edit mode) and pick a new role. That's the intended path.
- **The old descriptive `member_type` values** (`expat`, `digital-nomad`, `traveler`, etc.) are gone from the UI but the JSON message keys are retained for one release to avoid a translation churn pass; will be removed in 3.9.1 or later.

## [3.8.2] - 2026-05-19

**Focus the surface: Perks and Nomad+ pulled. Phased product plan added.** Clears the deck for the registration → profile → plan → ticket loop that the next several releases will build. `/perks` 301s to `/`; nav and homepage no longer show the Perks entry or the Membership Tiers (Nomad+) section.

### Removed

- **Workspace navbar** no longer shows `Perks`. Both the global Header and the hero brand bar read from the same `navItems` source of truth in [src/lib/constants.ts](src/lib/constants.ts); the entry is gone and so is the `perks` value from `NavItemKey` + `NavChildKey` + `NavCountKey` types.
- **Homepage scroll** no longer shows the `MembershipTiers` (Nomad+) section. Component file deleted ([src/components/sections/home/membership-tiers.tsx](src/components/sections/home/membership-tiers.tsx) - gone).
- **Footer** no longer links to `/perks`.
- **CommandMenu / search** no longer indexes `/perks`.
- **`(marketing)/perks/` route deleted.** Inbound links 301 to `/` (and locale prefixes to `/:locale`) via new `redirects()` block in [next.config.mjs](next.config.mjs).
- **`getPerksPublic` + `PerkPublic` removed** from [src/lib/supabase/queries.ts](src/lib/supabase/queries.ts) - no remaining callers. The underlying `perks` Supabase table is left intact in case we revisit.
- **`getNavCounts`** now only fetches events; the perks branch is gone.

### Added

- **[docs/product-plan.md](docs/product-plan.md)** - phased build plan from current production state to working ticketed-plan marketplace. 10 phases (Phase 0 = this PR; Phase 1 = role expansion + lightweight profile; Phase 4 = paid plans live in closed beta). Each phase has scope, schema deltas, UI changes, and an explicit "what's NOT in this phase". Out-of-scope list at the bottom captures the deliberate Nomad+, /perks, in-site DMs, multi-city, native-app exclusions.
- **PRODUCT.md §14** points at the product plan as the source of truth for phase ordering and dependencies.

### Changed

- **PRODUCT.md §6 (Monetisation)** reframed - only two revenue streams in scope: ticket fees on paid plans + guide subscriptions. The previous "Revenue stream 3 · Nomad+ (parked)" subsection is gone.
- **PRODUCT.md §13 (Boundaries)** - the "No public Agent presence" + "No Nomad+ launch before brand credit is earned" entries replaced with a single explicit "No consumer-side premium tier and no partner perks vault in scope for the current build" entry that names 3.8.2 as the pull-out point.
- **PRODUCT.md §9 (XP + badges)** - "Recognition + perks credit" reward language replaced with "Recognition + ticket credit" (no /perks page to redeem against any more).

### Migration notes

- No DB migration in 3.8.2. The `perks` table is untouched. Same for `MembershipTiers`-related i18n keys in `src/messages/*.json` - they're orphaned but not deleted, so the translation pipeline doesn't have to flush 5 locales for a strategic decision that may reverse.
- Any external SEO links to `/perks` are preserved via the 301 redirect for the foreseeable future.

## [3.8.1] - 2026-05-19

**PRODUCT.md rewritten with full strategy: monetisation, member roles, verification ladder, XP + badges. Legal-doc drafts landed (T&C, Community Guidelines, Plan Disclaimers).** Docs-only patch. No code changes yet; the new doc is the spec that subsequent migrations and features will implement against.

### Documentation

- **PRODUCT.md** restructured into 15 sections. New sections:
  - **§3 Member roles + verification** - 5 roles (`nomad`, `remote_worker`, `local_guide`, `tour_guide`, `agent`). Agent is a public role like any other (listed in `/members`, eligible for `/local-guides`, plans surface in `/today`); distinguished from `local_guide` by service type, not by visibility. Three-badge verification ladder (Red basic, Blue verified, Gold trusted). Only Blue/Gold can set entry fees on plans.
  - **§5 Product loop** split into Loop A (content hub, pre-arrival) and Loop B (community planner, in-Istanbul). Loop B now includes the payment flow (ticket → 7-day holdback → guide payout).
  - **§6 Monetisation** - three revenue streams documented. Ticket fees (active path to live): **iyzico primary, Stripe Connect fallback, 10% platform + ~2.9% processing = ~13% gross take, 7-day holdback payout**. Guide subscriptions (planned): Free (1 plan/mo) / Standard (5/mo) / Pro (20/mo). Nomad+ parked until brand credit higher.
  - **§9 XP + badges** - vanity + real-world rewards (one-year-in-Istanbul bracelet is the floor reward), no gating. Threshold ladder for "First plan / Regular / Veteran" + editorial picks for "Best nomad of the year / Top host of the year".
- **§8 Data entities** expanded with: `member_type` enum to 5 values; new `verification_level` + `xp` + `professional_role` columns on `members`; new tables `member_badges`, `member_subscriptions`, `plan_tickets`; `plans.is_ticketed` + `host_role_at_creation`/`host_badge_at_creation` snapshots; `plan_stops.vibe` extended with `culture` + `admin`; `plan_stops` gets `budget_per_person_min/max` + `entry_fee_cents`/`currency` split (budget plans vs ticketed plans).
- **§7 Surfaces** - added required-but-not-built rows: `/legal/terms`, `/legal/community-guidelines`, `/legal/plan-disclaimers`, `/legal/privacy`, `/dashboard/payouts`, `/dashboard/subscription`. Each tagged as required before paid-plan launch.
- **§13 Boundaries** - new entries: no ticket take on budget-only plans, no Nomad+ launch before brand credit is earned.
- **§14 Where things stand** - 13-item ordered follow-up list scoped to "required before paid-plan launch" (role expansion, KYC vendor, iyzico marketplace integration, `plan_tickets`, subscription tiers, legal pages, XP schema, neighborhood counts, `vibe='admin'` plumbing).
- **Neighborhood = connective tissue** explicit invariant added to §8: every member has a neighborhood, every plan stop has a neighborhood, every neighborhood page must show live nomad + guide counts.

### Legal drafts (working, not lawyer-reviewed)

Three new docs under [docs/legal/](docs/legal/) - intended to ship as the
content for `/legal/terms`, `/legal/community-guidelines`, and
`/legal/plan-disclaimers` after final review and translation to all 5
locales.

- **[docs/legal/community-guidelines.md](docs/legal/community-guidelines.md)** - the five rules (show up, be honest, verify before trust, Telegram for chat, don't make this place weird), then the full per-category breakdown (honesty, respect, plans, money, safety, verification, content), moderation process (strikes / suspensions / appeals to legal@istanbulnomads.com), report channels (in-platform / email / Telegram / 112 for emergencies), versioning policy. Strict on no-show behavior: 3 strikes in 90 days = 30-day suspension, 6 strikes = permanent.
- **[docs/legal/terms.md](docs/legal/terms.md)** - **LAWYER REVIEW REQUIRED** marker at the top. Plain-English working draft covering: who we are, who these terms cover, eligibility (18+), accounts and roles, three-tier verification, plans + money flow (10% platform + ~2.9% processing on tickets, 7-day payout holdback), refund policy (24h+ before = full refund, no-show forfeits, host cancellation = full refund), disputes, guide subscriptions, content licensing, acceptable use, termination, limitation of liability, indemnification, change-of-terms process, **Turkish law and Istanbul courts as governing jurisdiction**. Includes a publication checklist requiring KVKK / TKHK 6502 / 6563 sayılı Kanun / Distance Selling Regulation review.
- **[docs/legal/plan-disclaimers.md](docs/legal/plan-disclaimers.md)** - per-vibe disclaimer text for `focus`, `cowork`, `social`, `meal`, `after-work` (alcohol + 18+ floor), `outdoor` (risk, weather, health), `culture` (venue tickets often not included), `admin` (not legal advice). Plus a "common to every plan" disclaimer block (real-life meetup disclaimer, 112 emergency line).

## [3.8.0] - 2026-05-19

**Route-group scaffold + components reorg + canonical PRODUCT doc.** The `[locale]` tree is now carved into three Next.js route groups - `(home)`, `(marketing)`, `(app)` - each with its own layout. The homepage naturally has no global Header (the hero brand bar owns the top), marketing and app routes mount `HeaderWithCounts` from their own group layout, and the `is-home` pre-hydration script + `IsHomeMarker` client island + `hero-home-hide` CSS shim are all gone. Components moved from `src/components/{plans,today}/` to `src/components/sections/{plans,today}/` so every page-section component lives under a single roof. New `PRODUCT.md` is now the canonical product reference; README / DESIGN / ROADMAP / ARCHITECTURE updated to point at it.

### Changed

- **Route groups** (`src/app/[locale]/(home|marketing|app)/`) - 1 + 15 + 4 routes redistributed without changing a single URL. `(marketing)/layout.tsx` and `(app)/layout.tsx` each mount `<HeaderWithCounts />`; `(home)` deliberately omits it. The shell `[locale]/layout.tsx` keeps providers, fonts, footer, command menu, and universal islands.
- **Components consolidated** - `src/components/plans/*` → `src/components/sections/plans/*`, `src/components/today/*` → `src/components/sections/today/*`, `newsletter-form.tsx` → `sections/newsletter-form.tsx`, `web-mcp-register.tsx` → `layout/web-mcp-register.tsx`. All import paths rewritten.
- **DESIGN.md** rewritten to match the shipped cinematic palette (deep-water / cream / gold / rose) and the Instrument Serif + Space Grotesk + Fraunces + Geist + JetBrains Mono stack actually loaded in `layout.tsx`.
- **README.md** bumped Next 14 → 16, version pointer → 3.8.0, routes table corrected; points at `PRODUCT.md` for the canonical product spec.
- **ROADMAP.md** + **ARCHITECTURE.md** tagged with historical-document headers pointing at `PRODUCT.md`.

### Removed

- `src/components/layout/is-home-marker.tsx` and the pre-hydration `is-home` script in `[locale]/layout.tsx`. Route groups replace the client-side route detection shim.
- `html.is-home .hero-home-hide { display: none }` block in `globals.css`.

### Added

- **PRODUCT.md** - canonical 12-section product reference (audience, product loop, surfaces, data entities, brand voice, tech stack, boundaries). New entry point for new contributors and AI agents.

## [3.7.0] - 2026-05-18

**Workspace nav + editorial Members and Plans + hero hardening.** Delivery round against the [Members + Profile handoff](docs/plan/design/files/members/CHANGES.md) dated 2026-05-18. The global Header is now a workspace-style nav with five real destinations (Map / Events / Members / Perks) plus Explore + Community dropdowns, gold-tinted active state with `aria-current="page"`, count pills on Events + Perks fed by a cached Supabase query, and a fully harmonized rounded-pill right cluster (⌘K · EN · Sign in). The Members directory and the Plans landing page were reskinned in the cinematic editorial language (deep-water canvas, Instrument Serif headlines with italic-gold accents, Space Grotesk body, moss-green live pips, rounded-full CTAs). The MapLibre hero gained crash guards so client-side navigation in and out of the homepage no longer trips the layout-level error boundary, and switched to CartoCDN raster tiles for resilience in backgrounded tabs.

### Delivered against the Members + Profile handoff (`docs/plan/design/files/members/CHANGES.md`)

| Handoff artboard / asset                                        | Status       | Where it lives                                                                                                                                                                                      |
| --------------------------------------------------------------- | ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `directory-list` (`MembersListPage`)                            | **Done**     | [members-editorial.tsx](src/components/sections/members/members-editorial.tsx) on `/members`                                                                                                        |
| `directory-map` (`MembersMapPage`)                              | Deferred     | needs a Bosphorus SVG + lat/lng-pinned member chips                                                                                                                                                 |
| `profile-editorial` (`ProfileEditorialPage`)                    | Deferred     | `/members/[id]` still uses the previous card profile                                                                                                                                                |
| `profile-quiet` (`ProfileQuietPage`)                            | Deferred     | will be the default for own-profile / `/me`                                                                                                                                                         |
| Plans landing (`today.jsx`-aligned chrome)                      | **Done**     | [hero.tsx](src/components/plans/landing/hero.tsx) + counter + how-it-works + tone-disclaimer                                                                                                        |
| `today.jsx` page at `/today`                                    | Deferred     | route doesn't exist yet; nearest equivalent is `/plans`                                                                                                                                             |
| Global re-skin to deep-water + Instrument Serif + Space Grotesk | **Partial**  | tokens already remapped in 3.6.0; Space Grotesk loaded as `--font-grotesk` (preload off); applied to Hero, Members, Plans surfaces. Other pages still inherit the token shift via Geist + Fraunces. |
| Hero map system (already-shipped)                               | **Hardened** | see "Hero map crash fix" + "raster tiles" + "deferred mount" below                                                                                                                                  |

### Added

- **Workspace navbar** ([src/components/layout/header.tsx](src/components/layout/header.tsx)) - five flat icon destinations (Map → `/spaces`, Events, Members, Perks, with Lucide glyphs) + two restored rich dropdowns (Explore ▾, Community ▾) that show a label + description per item and gain the gold-tint active state when any of their children is current. `aria-current="page"`, keyboard-friendly, click-outside close.
- **Header counts** ([src/lib/nav-counts.ts](src/lib/nav-counts.ts) + [src/components/layout/header-with-counts.tsx](src/components/layout/header-with-counts.tsx)) - server-side `getNavCounts()` composes the already-cached `getEventsPublic` + `getPerksPublic` queries inside a `"use cache"` boundary (cacheLife `"minutes"`); upcoming-7-day events + active perks render as count pills next to the matching destination, hidden at 0, capped at `99+`.
- **`is-home` route flag** - pre-hydration script in [layout.tsx](src/app/[locale]/layout.tsx) sets `html.is-home` based on `location.pathname` so the homepage paints without flicker, plus [is-home-marker.tsx](src/components/layout/is-home-marker.tsx) client island that keeps the flag in sync across client-side navigations. Hides both `AmbientBar` and the global `Header` on `/` via a single CSS rule, replacing the previous client-side gate that caused hydration mismatches.
- **MembersEditorial section** ([src/components/sections/members/members-editorial.tsx](src/components/sections/members/members-editorial.tsx)) - new full-page layout for `/members`: deep-water canvas with subtle gold/rose gradient wash, moss-green live pip with real member count, Instrument Serif headline "The people _here_, by the street they leave the house in." (italic gold accent), counts strip (public / hoods), two-column split with a recently-joined sidebar and a neighborhood-grouped right column, stable hue-per-name avatar fallback for members without photos, CTA block at the bottom. Works on real `MemberPublic` data; "Across Istanbul" bucket catches members without a `location`.
- **Plans editorial reskin** - [hero.tsx](src/components/plans/landing/hero.tsx) + [plans-today-counter.tsx](src/components/plans/plans-today-counter.tsx) + [how-it-works.tsx](src/components/plans/landing/how-it-works.tsx) + [tone-disclaimer.tsx](src/components/plans/landing/tone-disclaimer.tsx) + the authed range header inside [plans/page.tsx](src/app/[locale]/plans/page.tsx). All now share the deep-water canvas, italic-gold serif numerals (01/02/03), rounded-full gold/ghost CTAs, gold-bordered counter card with massive Instrument Serif number.
- **Space Grotesk** loaded via `next/font/google` ([layout.tsx](src/app/[locale]/layout.tsx)) as `--font-grotesk` + Tailwind `font-grotesk` family. Preload off (only used on Members + Plans editorial surfaces).
- **HeroErrorBoundary** ([src/components/sections/home/hero-live/hero-error-boundary.tsx](src/components/sections/home/hero-live/hero-error-boundary.tsx)) - local class-based boundary that catches MapLibre / react-map-gl render errors from rapid mount/unmount races so they don't bubble up to the layout-level `error.tsx`. Auto-recovers on `resetKey` change.
- **i18n keys** - all 5 locales got new `nav.{map,events,members,perks,primaryAria}`, dropdown child rows under `nav.items.{neighborhoods,about,contact}.{label,description}`, and a substantial `membersV2.*` block (`livePip` with plural rules, `headlineA/B/C`, `recentEyebrow`, `recentLede`, `howEyebrow`, `howBody`, `personCount`/`singlePerson`, `elsewhereLabel`, full CTA copy, `publicLabel`, `hoodsLabel`).

### Changed

- **Right cluster harmony** ([auth-button.tsx](src/components/layout/auth-button.tsx), [language-switcher.tsx](src/components/layout/language-switcher.tsx)) - LanguageSwitcher, AuthButton, and the ⌘K search button all use the same `rounded-full border-ink-3/70 bg-ink-1/50` pill style + matching hover. Dropdown panels gained `rounded-xl` corners and a gold-tint selected state.
- **Workspace destinations replace dropdown-only nav** ([src/lib/constants.ts](src/lib/constants.ts)) - `navItems` keeps the dropdown variant for Explore + Community but the primary nav is now flat icon-led: Map / Events / Members / Perks. Mobile menu overlay flattens dropdown children into a single tap layer.
- **Hero map crash fix** ([hero-cinematic.tsx](src/components/sections/home/hero-live/hero-cinematic.tsx)) - all async paths that touch the MapLibre instance (`buildGlyphImage().then`, the resize-retry `setTimeout`s, the `flyTo` effect) now guard on a `mountedRef` and wrap in try/catch; pending timeouts are tracked and cleared on unmount; children gated on a `mapLoaded` flag that also flips when `map.isStyleLoaded()` returns true (so a backgrounded tab doesn't starve the children of style data).
- **Hero raster tiles** - switched from the CartoCDN vector style to an inline raster style (`dark_nolabels` + `dark_only_labels` PNGs) so basemap tiles paint without depending on the WebGL animation loop staying active.
- **Hero deferred mount** ([hero-live.client.tsx](src/components/sections/home/hero-live/hero-live.client.tsx)) - HeroCinematic mounts one tick after the section to let any leftover WebGL state from a previous navigation tear down cleanly; the section also got a `minHeight: 640` fallback so it never collapses to 0 height when `100vh` reports 0 in a transient layout state.
- **In-hero brand bar** ([hero-frame.tsx](src/components/sections/home/hero-live/hero-frame.tsx)) - swapped the invented `iN` gold-gradient monogram for the real `/images/logo-dark.png`; brand wordmark + tagline match the global Header; uses next-intl's `Link` so child route prefetch works under `localePrefix: "as-needed"`; headline block now vertically centered (`top-1/2 -translate-y-1/2`).
- **Hero brand bar nav links** - the in-hero brand bar reuses the global `navItems`; dropdown items resolve to their first child's href so each chip still leads somewhere meaningful.

### Removed

- **`HeaderGate` + `AmbientBarGate` client islands** - replaced by the pre-hydration script + `IsHomeMarker` + CSS `html.is-home .hero-home-hide { display: none }`. No more client-side branch that flipped after hydration.
- **"Join on Telegram" button** from the global Header and the unused `socialLinks` import - made way for the harmonized right cluster.
- **Tagline ("Remote life, local rhythm") from the brand lockup** - workspace nav has no room for it; tagline lives on the in-hero brand bar (homepage) and the footer instead.
- **Theme toggle from the Header** - per the workspace-nav spec; will be folded into a user menu when one exists.
- **Old dropdown labels for top-level routes** - About and Contact moved into the Community dropdown; the standalone About / Contact entries are gone from the global nav.

## [3.6.0] - 2026-05-17

**Cinematic live-map homepage hero.** The editorial photo hero is replaced by a full-bleed MapLibre map of Istanbul that auto-tours through Beyoğlu → Kadıköy → Karaköy → Sultanahmet → Ortaköy on an 11-second loop. Photo nomad avatars and category-coded venue dots stay glued to their geographic coordinates while the camera flies. A floating "Now Live" callout updates with each stop. Site-wide palette migrated to the cinematic deep-water / gold / cream / rose system.

### Added

- **HeroLive section** at [src/components/sections/home/hero-live/](src/components/sections/home/hero-live/) - cinematic MapLibre tour driven by [hero-cinematic.tsx](src/components/sections/home/hero-live/hero-cinematic.tsx) (8s `flyTo` per stop, smoothstep easing, multi-step resize retries to handle hydration races). Venue dots rendered as a single GeoJSON `<Source>` + circle `<Layer>` for performance; 21 nomad avatars rendered as `<Marker>` with per-instance CSS drift animation. Spotlight ring follows the focused hood. Honours `prefers-reduced-motion` (pauses tour, snaps camera).
- **Hero frame chrome** ([hero-frame.tsx](src/components/sections/home/hero-live/hero-frame.tsx)) - in-hero brand bar (iN monogram + nav + Sign in), italic Instrument Serif headline, lede, two CTAs, category legend, coords readout. Left-side gradient mask for headline contrast.
- **Now-Live tour callout** ([tour-callout.tsx](src/components/sections/home/hero-live/tour-callout.tsx)) - floating panel top-right with current stop label, sub-text, and a 6-segment progress strip. Re-keys on stop change for entrance animation.
- **HeaderGate** ([src/components/layout/header-gate.tsx](src/components/layout/header-gate.tsx)) - tiny client island that hides the global `<Header />` on the homepage route so the hero's brand bar is the only top chrome there. Other pages unaffected.
- **Hero fixture data** at [src/lib/hero-data.ts](src/lib/hero-data.ts) - 7 categories, 9 neighborhoods, 29 venues, 21 nomads, 6 tour stops. Ports the design's `IN_*` constants. Real Supabase member wiring tracked as a follow-up.
- **Self-hosted avatars** at [public/hero/avatars/](public/hero/avatars/) - 21 placeholder JPGs (~120 KB total) so we don't depend on an external host or need to allowlist a new domain in `next.config.mjs`.
- **Instrument Serif** loaded via `next/font/google` ([src/app/[locale]/layout.tsx](src/app/[locale]/layout.tsx)) as `--font-editorial`. Preload off (hero-only use).
- **i18n keys** `home.heroLive.*` in all 5 locales (en, tr, fa, ar, ru) covering live pip, headline, lede, CTAs, nav, categories, and the 6 tour stop labels + sub-texts.

### Changed

- **Palette migration site-wide** ([src/styles/globals.css](src/styles/globals.css)) - the `--ink-*`, `--paper`, `--terracotta`, `--ferry-yellow` tokens now resolve to the cinematic palette (deep-water `#06101f`, cream `#f6ecd9`, gold `#f4b860`, rose `#e87a5d`) in both light and dark modes. Token names preserved so existing components shift automatically.
- **Tailwind config** ([tailwind.config.ts](tailwind.config.ts)) - added semantic aliases `bg-deep-water`, `text-cream`, `text-gold`, `text-rose`, and a `font-editorial` family that maps to `--font-editorial`.
- **Homepage** ([src/app/[locale]/page.tsx](src/app/[locale]/page.tsx)) - `<HeroIssue />` swapped for `<HeroLive />`. Rest of the homepage sections unchanged.

### Removed

- `src/components/sections/home/hero-issue.tsx` - editorial photo hero replaced by the live map.
- `docs/plan/design/files/hero/` - design source prototypes (Leaflet-based) no longer needed once ported to MapLibre.

## [3.5.0] - 2026-05-17

**Multi-stop plans + map-first create flow.** A plan is now a _day_ with one or more _stops_ on it (cowork at Kolektif 10-2, beer at Karga at 6), each pinned visually on a map. The create flow is rewritten as a mobile-first full-bleed map with a swipeable bottom sheet - tap a verified space pin or tap anywhere to drop a custom pin, then fill in time / vibe / notes per stop. Member profiles now surface a member's upcoming plans inline. Onboarding wizard gets a mobile-first chrome refresh with a sticky footer, auto-save between steps, and an a11y baseline.

### Added

- **Map-first create flow** at [src/app/[locale]/plans/new/page.tsx](src/app/[locale]/plans/new/page.tsx) - full-bleed [PlanCreateMap](src/components/plans/plan-create-map.tsx) (maplibre + CartoCDN tiles, 19 verified space pins always visible) with a three-snap-height [BottomSheet](src/components/ui/bottom-sheet.tsx) (peek 22vh / half 50vh / full 90vh, touch-draggable on mobile, tap-to-cycle for keyboard). Stops appear as numbered terracotta pins (1, 2, 3) connected by a dashed line. Tap a space pin = picked. Tap anywhere on the map = custom pin (with a typed label + nearest-neighborhood inference). Per-stop editor [PlanStopEditor](src/components/plans/plan-stop-editor.tsx) handles time pickers (native `<input type="time">` for OS-native mobile UX), 6-vibe icon row, notes, and remove. Auto-generates plan title from the first two stop names when blank.
- **Supabase migration 014_plans → 015** ([supabase/migrations/015_plan_stops.sql](supabase/migrations/015_plan_stops.sql)) - new `plan_stops` table with `(plan_id, ordinal, space_id, custom_location, neighborhood_slug, lat, lng, start_time, end_time, vibe, notes)`. RLS scoped via the parent `plans.creator_id`. The per-stop columns are dropped from `plans` (which becomes a clean day-level row: date, title, capacity, expiry). `plans_today_by_neighborhood` view rewritten to count distinct plans per neighborhood across all stops. **Already applied to production Supabase.**
- **Today's plans by this member** on the profile page ([src/components/plans/member-plans-today.tsx](src/components/plans/member-plans-today.tsx)) - up to N upcoming plans hosted by the member, rendered as `PlanCard`s in a 2-col grid. Hidden entirely when the member has no upcoming plans.
- **`getMemberPlansToday`** query in [src/lib/plans/queries.ts](src/lib/plans/queries.ts).
- **A11y baseline** across new components - 44px min tap targets, `aria-pressed` on toggle chips, `aria-label` on map markers (`"${space} (${type})"` / `"Stop N of M"`), focus rings on every interactive element, `role="region"` + `aria-label` on the bottom sheet, `aria-live="polite"` for picker mode hints and form errors, focus-on-step-change in the onboarding wizard, `prefers-reduced-motion` respected on sheet height transitions.

### Changed

- **Onboarding wizard** ([src/app/[locale]/onboarding/onboarding-wizard.tsx](src/app/[locale]/onboarding/onboarding-wizard.tsx)) - chrome rebuilt on the new ink/paper/terracotta design tokens; sticky mobile footer with full-width Next button (48px min height); progress strip uses terracotta fill on completed steps; focus moves to the step heading on transition so screen readers announce it; auto-save partial profile to Supabase between steps so members can bounce mid-flow and resume; `aria-live` error announcement region; step components themselves unchanged (they keep all the existing form logic - a per-step visual refresh is a follow-up).
- **PlanCard** ([src/components/plans/plan-card.tsx](src/components/plans/plan-card.tsx)) - now renders a stop timeline (up to 3 stops visible, "+N more" when over). Vibe icon comes from the first stop. `aria-label` summarises the plan.
- **PlanDetail page** ([src/app/[locale]/plans/[id]/page.tsx](src/app/[locale]/plans/[id]/page.tsx)) - vertical numbered stop list with each stop's vibe, neighborhood, time range, and notes. Header strip simplified now that vibe/time are per-stop.
- **Mutations API** ([src/lib/plans/mutations.ts](src/lib/plans/mutations.ts)) - `createPlan` inserts the plan, then the stops as a batch, rolls back the plan on stops insert failure. New `updatePlanStops` replaces a plan's stops wholesale. `cancelPlan` and `joinPlan` unchanged in behaviour.
- **Expiry calculator** ([src/lib/plans/expiry.ts](src/lib/plans/expiry.ts)) - now takes an array of end_times and uses the latest. Tests updated; 10/10 pass.
- **PATCH /api/plans/[id]** accepts an optional `stops` array; when present, replaces stops via `updatePlanStops` and recomputes `expires_at`. Title/capacity/scheduled_date updates supported independently.
- **Cron `/api/cron/plan-reminders`** queries the earliest stop's `start_time` per plan instead of the (now-removed) plan-level `start_time`.

### Removed

- Plan-level `space_id`, `custom_location`, `neighborhood_slug`, `start_time`, `end_time`, `vibe`, `notes` columns - all moved to `plan_stops`. No production data was lost (no plans had been created on the prior schema).
- The single-stop stacked-form `PlanCreateForm` component - replaced by the map+sheet flow.

## [3.4.0] - 2026-05-16

**Daily Plans** - a deliberately lighter sibling of events for casual same-day "I'll be at X cafe Monday 2pm, drop by" coordination. Members-only feed with a public counter on the landing, Strava-inspired card UI, Telegram bot for notifications while all plan state stays in-app. First Week Planner deprioritised from all UI entry points.

### Added

- **`/plans` landing + members feed** ([src/app/[locale]/plans/](src/app/[locale]/plans/)) - editorial hero ("What are nomads up to in Istanbul today?"), live public counter (`plans running across N neighborhoods`), "How it works" 3-step explainer, "Not a meetup board, just plans" tone disclaimer. Logged-in members get a Today / Tomorrow / This week feed below the fold with neighborhood + vibe filters. Sign-in CTA for anon.
- **`/plans/new`** ([src/app/[locale]/plans/new/page.tsx](src/app/[locale]/plans/new/page.tsx)) - single-page create flow: When (today / tomorrow / date + optional times), Where (pick from `nomadSpaces` or write a custom location), What (title, vibe, notes), Who (optional capacity 2-20).
- **`/plans/[id]`** ([src/app/[locale]/plans/[id]/page.tsx](src/app/[locale]/plans/[id]/page.tsx)) - plan detail with host card, attendee stack, join/leave button, host's Telegram deep-link revealed after joining, in-app comments thread.
- **`/plans/[id]/edit`** - cancel-only for v1 (full edit deferred to v1.1).
- **Supabase migration 014** ([supabase/migrations/014_plans.sql](supabase/migrations/014_plans.sql)) - tables `plans`, `plan_attendees`, `plan_comments`, `telegram_subscriptions`; public views `plans_today_count` + `plans_today_by_neighborhood` granted to `anon`; RLS policies (authed read for plans/attendees/comments, write own, host can delete own plan or its comments); 6 indexes; `updated_at` trigger.
- **`src/lib/plans/`** - `vibes.ts` (focus/cowork/social/meal/after-work/outdoor + lucide icon map), `schema.ts` (zod validators matching DB constraints), `expiry.ts` (Istanbul-TZ-aware lifecycle: end-of-day for day-only plans, end_time + 1h grace for timed plans), `telegram.ts` (Bot API client with no-op fallback when `TELEGRAM_BOT_TOKEN` is unset), `queries.ts` (`getPlansForFeed`, `getPlanById`, `getPlansTodayCount`), `mutations.ts` (`createPlan`, `joinPlan`, `cancelPlan`, ...) with side-effect Telegram notifications.
- **API routes** under [src/app/api/plans/](src/app/api/plans/), [src/app/api/telegram/](src/app/api/telegram/), [src/app/api/cron/](src/app/api/cron/) - rate-limited via existing `@upstash/ratelimit`, cron routes gated by `CRON_SECRET` bearer.
- **Telegram bot integration** - `/start <token>` deep-link captures the user's `chat_id` into `telegram_subscriptions` (token issued via `/api/telegram/link`, stored in Upstash with 10-min TTL). Notifications: host pinged on join, all attendees pinged 1h before start, cancellations broadcast.
- **Vercel Cron** ([vercel.json](vercel.json)) - daily 00:05 Istanbul (`5 21 * * *` UTC) for `/api/cron/expire-plans`. The pre-start reminder route exists but isn't scheduled on Hobby (every-15-min crons require Pro); re-add the entry to `vercel.json` after upgrading.
- **i18n** - new `plans` namespace in all 5 locales (`en`, `tr`, `ar`, `fa`, `ru`) plus a `plans` entry in `nav.items`, `footer.links`, and `commandMenu.pages`. Non-English copy is acceptable for v1 but worth a polish pass from the `nomad-{tr,ar,fa,ru}-editor` agents.
- **9 timezone tests** ([src/lib/plans/expiry.test.ts](src/lib/plans/expiry.test.ts)) covering DST-stable Istanbul (UTC+3 year-round), midnight boundaries, month/year rollover.

### Changed

- **First Week Planner hidden from all UI entry points** - header dropdown ([src/lib/constants.ts](src/lib/constants.ts)), footer resources column, homepage hero ([src/components/sections/home/hero-issue.tsx](src/components/sections/home/hero-issue.tsx)), quiet CTA ([src/components/sections/home/quiet-cta.tsx](src/components/sections/home/quiet-cta.tsx)), three-doors grid ([src/components/sections/home/three-doors.tsx](src/components/sections/home/three-doors.tsx)), neighborhood matcher ([src/components/sections/neighborhood-rhythm-matcher.tsx](src/components/sections/neighborhood-rhythm-matcher.tsx)), spaces page, neighborhood detail, sitemap, llms.txt, command-menu search. All previously planner-pointing CTAs now route to `/plans` (or `/plans?neighborhood=...`). The `/tools/first-week-planner` route still resolves so external links don't 404.
- **Community nav** now leads with "Today's Plans" - it's the new front door for the membership.

## [3.3.0] - 2026-05-14

Design System v2 - "Ambient Tech with Istanbul Soul". An editorial-first, dark-native visual identity (see `docs/plan/design/`). Shipping in phases; this entry grows as phases land.

### Phase 0 - Foundations

- **Font stack swap** ([src/app/[locale]/layout.tsx](src/app/[locale]/layout.tsx)) - Inter -> **Geist** (UI/body), Manrope -> **Fraunces** (editorial display serif, weights 300/400/500 + italic), IBM Plex Mono -> **JetBrains Mono** (numbers/metadata). CSS variable names (`--font-sans` / `--font-display` / `--font-mono`) and the `display: "optional"` LCP optimisation are unchanged. The Persian (Bon Pro) and Arabic (Noto Sans Arabic) RTL fonts and their 82% scaling are untouched.
- **"Ink + paper" design tokens** ([tailwind.config.ts](tailwind.config.ts), [src/styles/globals.css](src/styles/globals.css)) - a 6-step `ink` surface ramp, 4-step `paper` text ramp, and accent set (`terracotta`, `bosphorus`, `ferry-yellow`, `moss` + dim variants). Implemented as CSS custom properties that flip between light and dark, so every redesigned surface is theme-aware. Dark values are canonical (from the design reference); light values are new.
- **Type scale** - `display-2xl/xl/lg`, `h1-h4`, `lede`, `body`, `meta`, `mono` keys with the v2 weights and tracking. Base `h1-h6` reweighted to Fraunces 400. Legacy keys kept for not-yet-redesigned pages.
- **Time-of-day accent** - `<html>` gets a `tod-{dawn|midday|dusk|night}` class from the server (`getTimeOfDay` in [src/lib/ambient.ts](src/lib/ambient.ts), a `use cache` function), driving a `--tod-accent` CSS variable.
- **Motion** - `ease-soft` timing function, `fast/mid/slow` durations, the `ferry-cross` keyframe (the one moving signal, frozen under `prefers-reduced-motion`), and tabular numerals on `.font-mono`.

### Phase 1 - Shared chrome

- **AmbientBar** ([src/components/layout/ambient-bar.tsx](src/components/layout/ambient-bar.tsx)) - a thin monospace strip across the top of every page carrying the city's living signals: Istanbul local time, weather + time-of-day, the next Kadıköy ferry, the USD/TRY rate, and the opted-in member count. Server-rendered; sits above the header in normal flow.
- **`src/lib/ambient.ts`** - the signal fetchers (`getIstanbulTime`, `getWeather` via Open-Meteo, `getFxRate` via Frankfurter, `getFerryStatus` from a static schedule, `getMemberCount` from Supabase). Each is a `use cache` function with a short `cacheLife` and a static fallback - the bar renders on every page and must never block or throw.
- **New atoms** - `SectionEyebrow`, `PhotoSlot` (atmospheric placeholder until real photography), `Tag`, and brand `Mark` SVGs (ferry, Bosphorus wave, logo roundel) under `src/components/ui/`.
- **Header + Footer restyled** to the ink/paper tokens - translucent blurred header with a terracotta active-nav dot and a `⌘K` search affordance (visual only for now), editorial footer with a serif masthead and a mono coordinate block.
- **Token mechanism** - the ink/paper/accent CSS variables are space-separated RGB channels wired as `rgb(var(--token) / <alpha-value>)`, so Tailwind's `/opacity` modifier works on every themed colour.
- **i18n** - new `ambient` namespace added to all five locale message files; translated into Turkish, Persian, Arabic, and Russian.

### Phase 2 - Homepage

- **Homepage rewritten** ([src/app/[locale]/page.tsx](src/app/[locale]/page.tsx)) as eight editorial sections under `src/components/sections/home/`: the issue-style hero (full-bleed photo slot + the moving Bosphorus ferry strip), "three doors" (Planner / Matcher / Telegram), "the shape of a week" with an annotated timeline, the guides shelf, the neighborhood matcher, the upcoming-events strip, the Sunday-letter signup, and the closing CTA.
- **Matcher restyled** - `NeighborhoodRhythmMatcher` (shared with the neighborhoods index) re-skinned to the ink/paper tokens with a `SectionEyebrow` header; all matching logic untouched.
- **Real data, honest placeholders** - the events strip pulls live from Supabase with a calm empty state; the guides shelf and matcher use existing content; image slots are `PhotoSlot` placeholders until real photography. The `MembershipTiers` and `CirclesStrip` sections from the design reference are intentionally **deferred** - they advertise products (Nomad+, Circles) that don't exist yet, and a fake pricing table is a lie, not a placeholder.
- **i18n** - new `homeV2` namespace with all the new editorial copy, translated into Turkish, Persian, Arabic, and Russian.

### Phase 3 - Neighborhoods index + detail

- **Neighborhoods index rewritten** ([src/app/[locale]/guides/neighborhoods/page.tsx](src/app/[locale]/guides/neighborhoods/page.tsx)) as an editorial list - big numbered rows (photo slot + name + blurb + a four-cell data grid), a not-to-scale `BosphorusSchematic` orientation map, the restyled matcher, and the existing long-form guide wrapped in the new chrome.
- **Neighborhood detail rewritten** ([src/app/[locale]/guides/neighborhoods/[neighborhood]/page.tsx](src/app/[locale]/guides/neighborhoods/[neighborhood]/page.tsx)) - a breadcrumb + giant serif name hero with a photo cluster and lede, an "at a glance" data table, a "where to work" section, a "similar neighborhoods" closer, and a CTA. Works for all ten neighborhoods.
- **Real data only** - rent ranges, side, noise, coordinates, and tracked-space counts come straight off `src/lib/neighborhoods.ts` and `src/lib/spaces.ts`; space scores use `computeNomadScore` and stay blank when unverified. Per the brand's no-fabrication rule, the design reference's invented wifi/walkability survey scores were **not** added.
- **Deferred** - the content-heavy editorial sections from the design reference (day-in-the-life timeline, eat/drink/supply, "what to know") need new, hand-written editorial copy per neighborhood that doesn't exist yet. They're a content follow-up, not shipped here - a placeholder with no real content would be a lie.
- **i18n** - new `neighborhoodsV2` namespace, translated into Turkish, Persian, Arabic, and Russian.

### Phase 4 - Events

- **Events index rewritten** ([src/app/[locale]/events/page.tsx](src/app/[locale]/events/page.tsx)) as an editorial board - a serif headline, an upcoming/past tab + type-filter `EventsBoard` over a row-list (the row is the unit, not a card), and the existing surprise-event waitlist. The map-first view and its `events-map`/`events-view`/`events-list` components were removed.
- **Event detail page** ([src/app/[locale]/events/[id]/page.tsx](src/app/[locale]/events/[id]/page.tsx)) - new. Breadcrumb + serif title hero, photo slot, description, and a sticky booking panel. Resolves by `slug` then falls back to the uuid `id`.
- **Ticketing groundwork** - migration `012_event_ticketing.sql` adds optional `slug` / `price_try` / `price_usd` / `kind` / `waitlist_count` columns to `events`. `src/lib/stripe.ts` is an env-gated Stripe stub: `STRIPE_SECRET_KEY` isn't wired up, so paid events fall back to the free Telegram RSVP path with an honest note rather than a dead paywall. **Migration 012 is now applied to production Supabase** (2026-05-15).
- **Caching** - `getEventsPublic` / `getEventByIdPublic` are now `use cache` (cacheLife "minutes", tag "events") so they're callable from uncached server components and `generateMetadata` under cacheComponents. The layout's `usePathname` client islands are now Suspense-wrapped so fully-dynamic routes don't trip the "uncached data outside Suspense" guard.
- **i18n** - new `eventsV2` namespace, translated into Turkish, Persian, Arabic, and Russian.

### Phase 5a - Member surfaces

- **Member directory** ([src/app/[locale]/members/page.tsx](src/app/[locale]/members/page.tsx)) - new. An opt-in grid of `is_visible` members; cards show avatar (real photo or a tinted initial block - no fake faces), name, location, bio, and skill tags.
- **Member profile** ([src/app/[locale]/members/[id]/page.tsx](src/app/[locale]/members/[id]/page.tsx)) - new. Avatar + facts sidebar, bio, skills, languages, website, and a Telegram reach-out CTA. Reach-out goes through Telegram, not on-site DMs.
- **Member dashboard** ([src/app/[locale]/dashboard/page.tsx](src/app/[locale]/dashboard/page.tsx)) - new, auth-gated (redirects to `/login?next=/dashboard` when signed out). A masthead, a real-fields-only profile-completeness panel, and quick links. No fabricated "activity ledger" - just what the `members` row actually contains.
- **Queries** - `getMembersPublic` / `getMemberByIdPublic` added (`use cache`, cookie-less, opt-in fields only); new `MemberPublicProfile` type.
- **i18n** - new `membersV2` namespace, translated into Turkish, Persian, Arabic, and Russian.

### Phase 5b - Circles + perks vault

- **Circles** - six "small rooms inside the big room" (Coworking, Hiking, Sailing, Photography, Wine, Founders). Defined as static editorial data in [src/lib/circles.ts](src/lib/circles.ts) - real, not invented. New `/circles` index ([src/app/[locale]/circles/page.tsx](src/app/[locale]/circles/page.tsx)) and `/circles/[slug]` detail ([src/app/[locale]/circles/[slug]/page.tsx](src/app/[locale]/circles/[slug]/page.tsx)) with `generateStaticParams` over the six slugs. Each card carries the circle's accent colour (terracotta / bosphorus / ferry-yellow / moss / their dim variants). Joining is honest: the circles live inside the main Telegram, not a separate gated thing.
- **Perks vault** ([src/app/[locale]/perks/page.tsx](src/app/[locale]/perks/page.tsx)) - new. Reads from a `perks` table that lands with migration 013 and isn't applied yet, so the page degrades to an honest "vault in progress" state rather than fabricating partner offers.
- **Migration `013_circles_perks.sql`** - adds `circle_members`, `perks`, `perk_claims` tables plus `is_nomad_plus` / `nomad_plus_since` / `last_seen_at` / `open_to_coffee` columns to `members`. RLS: perks public-read, claims and circle memberships member-scoped. Reading code (`getPerksPublic`) is fully guarded against missing tables. **Migration 013 is now applied to production Supabase** (2026-05-15). The `perks` table is empty until partner offers are seeded.
- **i18n** - new `circlesV2` and `perksV2` namespaces, translated into Turkish, Persian, Arabic, and Russian.

### Phase 6 - Command-K menu

- **Global `⌘K` overlay** ([src/components/ui/command-menu.tsx](src/components/ui/command-menu.tsx)) - built on `cmdk` 1.1. Opens on `Cmd/Ctrl+K` from anywhere; the existing `⌘K` button in the header now dispatches an `open-command-menu` window event that the menu listens for, no shared store needed. Selecting a row navigates via `next/navigation`.
- **Search dataset** ([src/lib/search.ts](src/lib/search.ts)) - prebuilt server-side per locale and passed as a serializable list (`SearchItem[]`) into the client component, so per-keystroke filtering is fully in-memory. Sources: thirteen static pages, all guides, neighborhoods, circles, and up to 25 upcoming events from Supabase. Events failure is swallowed - the rest of the index keeps working.
- **i18n** - new `commandMenu` namespace (placeholder, group headings, page labels, ARIA strings), translated into Turkish, Persian, Arabic, and Russian.

### Phase 7 - Photography (asset-blocked, swap path ready)

Real Istanbul photography can't be fabricated, so the `PhotoSlot` placeholders shipped in Phases 1-5 stand. What's done here is the swap path: `PhotoSlot` now optionally accepts `src` + `alt` (and `priority` / `sizes` / `credit` pass-throughs) and renders `next/image` with the same chrome (corner mark + caption strip) when set. Every existing `<PhotoSlot kind="..." />` call site upgrades by adding `src` and `alt` - no refactor, no rewrite. The actual photos are the missing input.

### Phase 8 - Member-area wiring + previously deferred homepage sections

- **Auth callback default** ([src/app/auth/callback/route.ts](src/app/auth/callback/route.ts)) - signing in now lands on `/dashboard` by default. Explicit `?next=` (used by gated routes that redirect through `/login`) still overrides.
- **Onboarding completion redirect** ([src/app/[locale]/onboarding/onboarding-wizard.tsx](src/app/[locale]/onboarding/onboarding-wizard.tsx)) - newly-onboarded members land on `/dashboard` instead of `/`.
- **AuthButton rewired** ([src/components/layout/auth-button.tsx](src/components/layout/auth-button.tsx)) - the name/avatar button now opens `/dashboard` (previously signed the user out); a separate `LogOut` icon sits next to it for sign-out. The "complete profile" nudge stays. Restyled to the ink/paper tokens.
- **Navigation surfaces** ([src/lib/constants.ts](src/lib/constants.ts)) - `Community` dropdown gains Member Directory, Circles, and Perks Vault. Footer's community column picks up the same three. The header `⌘K` button + the dashboard tile route there directly. New nav labels translated to all five locales.
- **Homepage MembershipTiers section** ([src/components/sections/home/membership-tiers.tsx](src/components/sections/home/membership-tiers.tsx)) - the previously deferred "two ways to belong" panel. Free tier shows the real `is_visible` member count; Nomad+ is marked "Coming soon · waitlist open" with price as TBD (no fabricated price - Stripe isn't wired, so the CTA goes to the Telegram waitlist).
- **Homepage CirclesStrip section** ([src/components/sections/home/circles-strip.tsx](src/components/sections/home/circles-strip.tsx)) - the six circles in a strip on the homepage, real data from `src/lib/circles.ts`, each linking to its detail page.
- **i18n** - new `homeV2.membership` and `homeV2.circles` blocks, plus `auth.openDashboard` and three new nav.items / footer.links entries (`members`, `circles`, `perks`), all translated into Turkish, Persian, Arabic, and Russian.
- **Version bumped to 3.3.0** in [package.json](package.json) to match the changelog section.

## [3.2.0] - 2026-05-14

### Changed

- **Brand rename: "Istanbul Digital Nomads" → "Istanbul Nomads"** across every code-level surface. Title template, OpenGraph metadata, Twitter cards, schema.org organization name, OpenAPI spec, MCP server card, OAuth resource name, llms.txt, OG image alt text, and the brand-label fields (`name`, `shortName`) in all five locale message files. The English brand is used consistently across all locales, matching the existing pattern. Aligns the brand with the domain (`istanbulnomads.com`) and with what people actually search - Google Trends shows steady search volume for "istanbul nomads" and near-zero for "istanbul digital nomads".
- **Title template suffix** ([src/app/[locale]/layout.tsx](src/app/[locale]/layout.tsx)) - now `"%s | Istanbul Nomads"` instead of `"%s | Istanbul Digital Nomads"`. Every page title is ~15 characters shorter, leaving more room for keywords before Google's truncation threshold.
- **SEO keywords** ([src/app/[locale]/layout.tsx](src/app/[locale]/layout.tsx)) - added `"istanbul nomads"` and `"digital nomad istanbul"` to the meta keywords array. The former matches the brand and current search trends; the latter captures the long-tail variant.
- **Path-to-Istanbul title templates** - rewrote Russian and Turkish templates ([src/messages/ru.json](src/messages/ru.json), [src/messages/tr.json](src/messages/tr.json)) to use an arrow pattern (`{country} → Стамбул`, `{country} → İstanbul`). The previous Russian template `"Из {country} в Стамбул"` broke grammar (genitive case required after "Из", but country names are stored in nominative). The previous Turkish suffix `"{country}'dan İstanbul'a"` broke vowel-harmony for back-vowel countries (İngiltere needs `'den`, not `'dan`). The arrow pattern is grammatically agnostic and reads cleanly in all 5 locales.

### Not included in this release

Body prose in MDX content files (`/content/`) and narrative paragraphs in message JSON (About story, mission statements) still reference "Istanbul Digital Nomads" mid-sentence. Those need careful sentence-by-sentence review and ship in a follow-up pass.

## [3.1.8] - 2026-05-14

### Changed

- **Canonical host enforcement** ([src/proxy.ts](src/proxy.ts)) - Google had indexed three host variants (`https://istanbulnomads.com`, `https://www.istanbulnomads.com`, `http://www.istanbulnomads.com`), splitting link equity. The proxy now 301-redirects any non-canonical host or non-HTTPS request to `https://istanbulnomads.com` so search engines consolidate ranking signals. Localhost and `*.vercel.app` preview deployments pass through untouched so dev and PR previews keep working.
- **SEO metadata rewrite** for two high-intent surfaces, across all five locales:
  - `guides.internet` title/description - now leads with year, the three carriers compared, concrete tourist-SIM pricing, and coworking wifi speeds instead of a generic summary.
  - `countryPage.meta` title template + fallback description - now front-loads "2026", visa/cost/community specifics, and a credibility line ("written by nomads who've made the move").

## [3.1.0] - [3.1.7] - 2026-05-14

Stabilization pass on the Next.js 16 + Cache Components release (see 3.0.0):

- **3.1.1** - removed a duplicate `<title>`/`<meta description>` in the layout head that React 19 flagged as a hydration mismatch; `generateMetadata` is the single source of truth.
- **3.1.2** - cached the `Footer` (`'use cache'` + `locale` prop) so its `new Date().getFullYear()` copyright stops triggering Next 16's runtime-current-time error.
- **3.1.3 / 3.1.4** - probed and disproved the inline theme script as the React #418 source, then restored it (it prevents dark-mode FOUC).
- **3.1.5** - temporarily enabled `productionBrowserSourceMaps` to trace the minified React #418.
- **3.1.6** - **fixed React #418**: `sonner`'s `Toaster` calls `useState(document.hidden)` at render; the v3.1.0 switch from `dynamic({ssr:false})` to a static import made it SSR-render, where `document` is undefined. Moved `Toaster` back to `dynamic({ssr:false})` inside the `"use client"` `client-islands.tsx` wrapper.
- **3.1.7** - added Instagram ([@istanbulnomads](https://instagram.com/istanbulnomads)) to `socialLinks`, the footer icon row, the footer "Connect" column, and all five locale message files.

## [3.0.0] - 2026-05-14

### Changed (BREAKING - framework upgrade + Cache Components)

- **Next.js 15.5.18 → 16.2.6** (latest stable) with **`cacheComponents: true`** enabled.
- **ESLint 8 → 9** (peer for `eslint-config-next` 16).
- **`@next/bundle-analyzer`, `eslint-config-next`** → 16.

### Cache Components migration

The hard part. Next 16's `cacheComponents` flag makes every route dynamic-by-default unless explicitly marked `'use cache'`, and forbids any `headers()` access inside cached scopes. `next-intl` 4's `getTranslations()` / `getMessages()` read `headers()` under the hood, so a naive upgrade builds and runs but every page is fully dynamic → no edge caching → ~330 ms TTFB per request → mobile Lighthouse drops to 80.

The fix:

- **New `src/lib/i18n/cache-translations.ts`** - cache-safe translation helpers. Imports the five locale message files statically, uses `createTranslator` from `next-intl` directly (not the server APIs). Output is deterministic from `(locale, namespace)` so it's safe inside `'use cache'`.
- **Layout migrated** ([src/app/[locale]/layout.tsx](src/app/[locale]/layout.tsx)) - replaced `await getMessages()` and `await getTranslations()` with the cache-friendly helpers. `NextIntlClientProvider` gets explicit `formats={{}}`, `timeZone="Europe/Istanbul"`, `now={new Date(0)}` props to prevent its internal `headers()` reads. `<Header />`, `<Footer />`, and `{children}` are each wrapped in `<Suspense>` so pages that haven't migrated to `'use cache'` still build cleanly (they stream as dynamic islands under PPR).
- **Home page is `'use cache'`** - `HomePage` (outer, dynamic, calls `setRequestLocale` + `preconnect`) delegates to `HomePageContent` (inner, cached, uses `getCachedTranslations`). Net: the home page's static shell is fully cached, served with ~5 ms TTFB instead of ~330 ms.
- **`IstanbulTodayWidget` + `NeighborhoodCardsSection`** migrated to take `locale` as a prop and use the helper (they were doing `await getLocale()` / `await getTranslations(...)` which broke cache scope).
- **`middleware.ts → proxy.ts`** + removed all `runtime` / `revalidate` / `dynamic` route segment configs (cacheComponents-incompatible).
- **OG image routes**: re-applied the Promise-params fix from v3.0.0 that the rollback dropped. FA OG renders Persian text again (was silently returning EN for all locales without this fix).

### Result on local prod server

- Build classification: every `[locale]/*` route is **◐ Partial Prerender** (was ƒ Dynamic before).
- **TTFB: 5 ms** (was 330 ms uncached on the earlier Next 16 attempt; was ~80 ms cached on Next 15.5).
- Build clean, type-check clean, 91/91 tests pass.

### Open follow-ups

- Other pages (about, blog, guides, spaces, etc) still use the request-context-aware `getTranslations()` and are wrapped in Suspense - they work, but their static shell isn't cached as aggressively as the home page. Migrating them to `getCachedTranslations` is mechanical and lands in a follow-up sprint.
- React-19-strict eslint rules downgraded to warn pending a cleanup pass.

## [2.0.4] - 2026-05-14

### Reverted

- **Rolled back v3.0.0 (Next.js 16) merge.** v3.0.0 introduced Next 16, which makes all routes dynamic-by-default. Without Cache Components opt-in (`'use cache'` + Suspense boundaries on every page), Vercel edge cache was MISS on every request and mobile Lighthouse Performance regressed from 95 to 80 (LCP 2.78 s → 4.29 s, TTFB 80 ms → 330 ms on every request).
- **Cache Components migration is blocked on next-intl 4** - `getTranslations({ locale })` internally reads `headers()` even with an explicit locale argument, which is forbidden inside `'use cache'` scopes (errors with "Route used `headers()` inside use cache"). next-intl's FAQ acknowledges this and points at unstable internal APIs as the workaround. When next-intl ships Cache-Components-compatible APIs, we can retry the Next 16 migration in a focused PR.

### On main after this rollback

- Next 15.5.18, React 19.2.6, next-intl 4.12
- Mobile Lighthouse: 95 / 100 / 100 / 100 (Perf / A11y / BP / SEO)
- Desktop Lighthouse: 99 / 100 / 100 / 100

## [2.0.3] - 2026-05-14

### Changed

- **Switched `next/font` `display: "swap"` → `display: "optional"`** on Manrope (the H1 display font), Inter (body sans), and IBM Plex Mono. `swap` was triggering a paint when the web font arrived 1-3 s in, which Lighthouse mobile latched onto as a new LCP candidate - inflating the home H1's LCP from ~1.4 s to ~3.8 s. With `optional`, the browser keeps the size-adjusted fallback if the font isn't ready in ~100 ms (no late swap → no LCP regression). next/font's auto-generated fallback uses `ascent-override` and `size-adjust` so the layout doesn't shift either way.
- **Re-enabled `experimental.optimizeCss`** (re-added `critters` devDep). The render-blocking penalty on the 18 KB CSS bundle was contributing ~150 ms of FCP/LCP; with the v2.0.1 bailout fix + v2.0.2 head metadata both in place, critters now does its job without conflicting with the streaming flow.

## [2.0.2] - 2026-05-14

### Fixed

- **Render `<title>` and `<meta name="description">` directly in the layout's server `<head>`**, instead of relying solely on `generateMetadata`. React 19's Document Metadata flow on Next 15.5 streams those tags into `<body>` and the browser hoists them at parse time, but Lighthouse audits the response before hoist - so it scored meta-description = 0 on prod even though the tag was in the HTML. Now both Lighthouse and search crawlers see the metadata in head from byte 0. The `generateMetadata` system still runs and emits the same tags later; the browser deduplicates.

## [2.0.1] - 2026-05-14

### Fixed

- **Removed `dynamic({ ssr: false })` from `client-islands.tsx`**. Post-v2.0.0 Lighthouse showed Performance had dropped from 98 to ~86 and SEO from 100 to 92, with `BAILOUT_TO_CLIENT_SIDE_RENDERING` Suspense templates in the SSR HTML. Each `ssr: false` import now produces a bailout marker that delays React 19's Document Metadata flush, so the `<title>` and `<meta name="description">` ended up in body instead of head and Lighthouse couldn't find them. The four islands (BottomTabBar, NavigationProgress, Toaster, WebMcpRegister) are now plain client component imports - they SSR-render to their initial null state (no DOM cost) and hydrate cleanly with no bailout.
- **Disabled `experimental.optimizeCss`**. On Next 15.5 + React 19 it inlines critical CSS _after_ the React 19 metadata flush, undoing the LCP improvement it gave us on Next 14. Removed the `critters` devDep.

## [2.0.0] - 2026-05-14

### Changed (BREAKING - framework upgrade)

- **Next.js 14.2.35 → 15.5.18** and **React 18.3.1 → 19.2.6**. Major upgrade to unlock the Performance ceiling on Next 14 + the React 19 compiler, Document Metadata, and PPR.
- **`next-intl` 3.26.5 → 4.12.0**. Tighter type-checking on `useTranslations` keys; the dynamic-key call in `OptionGroup` (`firstWeekPlanner.tsx`) is cast to a permissive shape - runtime behavior unchanged.
- **`@next/bundle-analyzer`, `eslint-config-next`** bumped to 15.5 to match Next 15.
- **`@types/react`, `@types/react-dom`** bumped to 19.2.

### Codemod + manual fixes

- Ran `@next/codemod next-async-request-api` - 207 files migrated to `params: Promise<...>` / `searchParams: Promise<...>`.
- Next 15 disallows `dynamic({ ssr: false })` from server components. Hoisted the four post-hydration islands (`BottomTabBar`, `NavigationProgress`, `Toaster`, `WebMcpRegister`) into `src/components/layout/client-islands.tsx` so the locale layout stays fully server-rendered.
- `next.config.mjs`: `experimental.serverComponentsExternalPackages` → `serverExternalPackages`; `experimental.outputFileTracingIncludes` → `outputFileTracingIncludes` (both promoted out of `experimental` in Next 15).
- `src/components/ui/mdx-components.tsx`: `JSX.IntrinsicElements` namespace removed in React 19; now `import type { JSX } from "react"`.
- `src/app/[locale]/error.tsx`: replaced `<a href="/">` with `<Link href="/">` (Next 15 lint now blocks intra-site `<a>` tags).
- `src/app/[locale]/tools/first-week-planner/page.tsx`: `searchParams` is now `Promise<...> | undefined`; coalesce to `{}` before iterating.
- Kept `critters` as devDep - Next 15.5 still requires it for `experimental.optimizeCss` even though Next 16 swaps to `beasties` internally.

### Verified locally

- `pnpm build` clean (Next 15.5 / React 19.2 / next-intl 4.12)
- `pnpm type-check` clean
- `pnpm test` 91/91 passing
- Preview: EN home + FA `/guides/coworking` (RTL) + FA `/spaces` all render correctly
- Server weather widget shows real data (14°C, 0.0 mm, 18 km/h)
- OG images: EN (satori path) 131 KB, FA (resvg-js path) 103 KB - both 1200x630 PNG
- Metadata routes: `/icon` 200 PNG, `/robots.txt` 200, `/sitemap.xml` 200, `/llms.txt` 200

### Not in this PR

- **PPR (Partial Prerendering)**. Most routes are already fully static-prerendered (●) so PPR would need explicit dynamic markers to help. Will land in a follow-up sprint with a Suspense boundary pass.
- **Next 15 → 16**. Adds `middleware.ts → proxy.ts` rename + Node.js runtime + Cache Components GA + Turbopack prod builds. Worth its own release once Next 16 stabilizes a bit.

## [1.25.0] - 2026-05-14

### Changed

- **Removed `text-balance` from the home page LCP H1**. Lighthouse mobile attributed 1.4 s of "element render delay" to the H1 paint; CSS `text-balance` triggers a more expensive layout pass to balance line wrapping, which under 4x CPU throttling on a mobile simulation has measurable cost. The H1 already has `max-w-[11.5ch]` so the wrap point is constrained without `text-balance` doing extra work.
- **Enabled `experimental.optimizeCss`** in `next.config.mjs` (added `critters` as a devDep). When it kicks in, Next.js inlines the critical CSS in `<head>` and defers the rest, which Lighthouse mobile flagged as a 250 ms render-blocking penalty on the main CSS bundle.

## [1.24.1] - 2026-05-14

### Fixed

- v1.24.0 dynamic-imported the supabase client but still triggered the import after a 100 ms timer in `AuthButton`, so anonymous visitors (no `sb-*-auth-token` cookie) still downloaded the ~40 KB supabase chunk + ~50 KB gotrue-js auth client even though they had no session. `AuthButton` now checks for a Supabase auth cookie up-front and short-circuits the dynamic import entirely when there isn't one. The Sign In button renders immediately with no loading state. Authenticated visitors still hit the deferred dynamic import as before.

## [1.24.0] - 2026-05-14

### Changed

- Performance pass aimed at mobile LCP + unused-JS reduction (Lighthouse mobile was 82-95 depending on cache state, with ~260 KB of unused JS still shipping on initial paint):
  - **MapLibre is now IntersectionObserver-gated**: the home `NeighborhoodsMapSection` previously called the `dynamic({ssr:false})` `IstanbulMap` directly, which meant the ~280 KB map chunk was fetched as soon as the page hydrated. Replaced with a `LazyMap` wrapper that only renders `<IstanbulMap />` once an `IntersectionObserver` (rootMargin 400px) marks the placeholder as near-viewport. For visitors who don't scroll past the hero, the entire MapLibre + style + worker payload is skipped.
  - **Supabase auth client is now dynamic-imported in `AuthButton`**: `createClient` was a static import, so the ~40 KB supabase chunk shipped with the Header chunk on every page even for anonymous visitors (the vast majority of home-page traffic). The auth check + sign-out flow now `await import("@/lib/supabase/client")` at runtime, so the chunk only loads after the 100 ms post-hydration timer fires, and the supabase code is code-split into its own chunk that visitors who never need auth don't download.

### Performance reference

After this PR, Lighthouse mobile is expected to land around 90-95 reliably (was 82-95 cache-state-dependent). The remaining gap to 100 mobile Performance is the deferred L-effort work: split `Header` + `BottomTabBar` into server shells + tiny client islands, and migrate to Next.js 15's PPR / Cache Components.

## [1.23.2] - 2026-05-14

### Fixed

- Lighthouse Accessibility 96 → 100: post-1.23.1 audit still flagged one element ("TURN THIS INTO WEEK ONE" in `NeighborhoodRhythmMatcher`) using `dark:text-primary-300` (#e74c3c → 4.48 contrast on a near-black bg). Same pattern existed in 25 other files across the codebase, so swept all `dark:text-primary-300` → `dark:text-primary-200` (#f1a9a0). All small-text uppercase eyebrow labels in dark mode now sit well above WCAG AA 4.5:1.

## [1.23.1] - 2026-05-14

### Fixed

- Lighthouse Accessibility (96 → expected 100):
  - **Color contrast**: small `font-mono text-[10px]` labels in the `IstanbulTodayWidget` were under 4.5:1 in dark mode. Mood label moved from `dark:text-primary-300` (#e74c3c, 4.49) to `dark:text-primary-200` (#f1a9a0). `MiniCue` label moved from `dark:text-[#94877d]` (4.15) to `dark:text-[#bdb1a6]`. Both now well above the WCAG AA threshold.
  - **Label-content-name mismatch on LanguageSwitcher button**: visible text is the locale code (e.g. "EN") but `aria-label="Language"` overrode it, so the accessible name didn't include the visible label. Dropped `aria-label`; the button now uses an `sr-only` "Language:" prefix plus the visible locale, producing accessible name "Language: EN" which contains the visible "EN".
  - **Label-content-name mismatch on MapLibre markers** (home `IstanbulMap`): MapLibre defaults `aria-label="Map marker"` on the marker `<div>`, but each marker contains visible neighborhood text ("Galata", "Kadikoy", etc). Added a `useRef<MarkerInstance>` + `useEffect` that overrides the marker DOM's aria-label to the neighborhood name after mount.

- Lighthouse Best Practices (96 → expected 100):
  - **`/icon` returned 404** because the i18n middleware was running locale routing on Next.js's root metadata routes. Added `/icon`, `/apple-icon`, `/sitemap.xml`, `/robots.txt`, `/llms.txt`, `/openapi.json` to the middleware skip-list. The Next.js-generated favicon now serves at 200 (PNG, 1.4 KB).

## [1.23.0] - 2026-05-13

### Changed

- Web Vitals pass on Core Web Vitals (LCP, INP, CLS):
  - **Hero LCP**: deduped the home hero image preload. Mobile `<Image>` keeps `priority` with `sizes="(max-width: 1023px) 100vw, 1px"`; desktop variant loses `priority` and uses `sizes="(min-width: 1024px) 520px, 1px"`. Browser now preloads only the variant that matches the viewport instead of preloading both 100vw mobile and 520px desktop variants for every visitor. Expected mobile LCP improvement: 200-500 ms.
  - **Weather widget server-rendered**: `IstanbulTodayWidget` (home + neighborhoods index) is now an async server component that fetches open-meteo with `next: { revalidate: 600 }`. The animated overlays moved to a small `WeatherScene` client island (`src/components/sections/istanbul-today-weather-scene.tsx`). Eliminates the prior client-side fetch + layout shift between fallback and live data; cuts ~20-30 KB of client JS off the home route.
  - **CartoCDN preconnect scoped to map routes**: removed the global preconnect from `[locale]/layout.tsx`. Home / spaces / events / path-to-istanbul now call `react-dom`'s `preconnect("https://basemaps.cartocdn.com")` from their server components. Blog, guides, neighborhood detail, about, contact and other map-less routes no longer open a TLS handshake to the tile CDN.
  - **NavigationProgress slimmed**: removed the `document.click` capture listener + `setInterval(200ms)` from `src/components/ui/navigation-progress.tsx`. The progress bar now only flashes on `usePathname` change. Saves 15-40 ms INP per tap on mobile.
  - **WebMcpRegister deferred**: tool registration now runs via `requestIdleCallback` (fallback: 1.5 s `setTimeout`) so it doesn't compete with hydration on browsers that expose `navigator.modelContext`.
- Stripped server-only `og` and `emails` namespaces from the `NextIntlClientProvider` payload (~5 KB JSON, ~1.5 KB gzip per page). They were only consumed by `opengraph-image*` route handlers and email render code, never by client components.

### Optimized

- Image sources:
  - `public/images/weather/istanbul-rainy-bosphorus-2026.png`: 2.0 MB → 323 KB (resized 1672 → 1280 wide + palette compression).
  - `public/images/logo-light.png`: 191 KB → 21 KB (resized 530 → 256 wide).
  - `public/images/logo-dark.png`: 214 KB → 20 KB (resized 542 → 256 wide).
  - Total source savings: 2.18 MB. The `next/image` optimizer still serves AVIF/WebP at runtime; the source-size reduction speeds up cold-cache optimizer fetches and shrinks the deploy bundle.

### Performance reference

The audit grading the above is in the parent `vercel-plugin:performance-optimizer` agent run. Top remaining work for a future pass:

- Split `Header` and `BottomTabBar` into server shells + tiny client islands (estimated 70-100 KB gzipped per-route JS cut).
- Audit / remove the no-op `<Reveal>` wrapper used in 9 files.
- Cache Components / PPR migration when Next.js 15+ lands.

## [1.22.0] - 2026-05-13

### Added

- `alternates.languages` hreflang map on every translated page (homepage, blog index + detail, guides index + detail, neighborhoods, spaces, path-to-istanbul index + country, about, contact, events, local-guides, login, onboarding, relocation-agent, credits - 19 pages total). Each page now signals all 5 locale variants + `x-default` so Google can serve the right locale per user. New `alternatesFor()` and `localeUrl()` helpers in `src/lib/seo.ts`.
- `generateMetadata` on the homepage with localized title/description/keywords (`home.seo` namespace in all 5 message files).
- WebSite + SearchAction + Organization + FAQPage JSON-LD on the homepage. SearchAction wires up the Google sitelinks search box; FAQPage emits 10 Q/A entries from existing `faqItems` translations.
- Article + BreadcrumbList JSON-LD on `/guides/[slug]` with `inLanguage`, `datePublished`, `dateModified` from MDX frontmatter.
- AboutPage + Organization JSON-LD on `/about`.
- ItemList JSON-LD on `/spaces`: 18 entries as `LocalBusiness` (coworking) or `CafeOrCoffeeShop` (cafe) with `PostalAddress`, `GeoCoordinates`, `amenityFeature`, `priceRange`, `openingHours` where available.
- `lastUpdated` frontmatter field on blog posts with a visible "Updated {date}" line on detail pages (translated to all 5 locales). Blog `dateModified` JSON-LD now reads from this when set.
- Explicit AI-crawler allowlist in `robots.txt`: PerplexityBot, ChatGPT-User, OAI-SearchBot, ClaudeBot, anthropic-ai, Claude-Web, Applebot-Extended, Google-Extended. Explicit `Disallow: /` for training-only crawlers (GPTBot, CCBot, FacebookBot, Bytespider).
- 10 new tests covering `localeUrl`, `alternatesFor`, and schema helpers (91 total).

### Changed

- `llms.txt` expanded with the 5-locale URL prefix table, agent endpoints (MCP server card, agent-skills), and one-line section descriptions so AI crawlers discover the multilingual content surface.
- `agent-skills/read-istanbul-content` body updated with locale fetch examples.
- Sitemap `lastmod` now reads from MDX `lastUpdated` / `date` frontmatter for guides + path-to-istanbul + blog (was always build-time). Blog priority + changefreq bumped from monthly/0.6 to weekly/0.7.
- MCP server card instructions updated to advertise the locale-aware fetch tools.
- `robots.txt` disallow list extended to cover `/onboarding` and `/login`.
- Bumped package version to `1.22.0`.

## [1.21.1] - 2026-05-13

### Fixed

- Production OG images for `/fa` and `/ar` rendered empty (gradient + IN badge only, no text). The TTFs in `/public/fonts/og/` weren't being bundled into the Vercel serverless function because Next.js's output file tracing follows static imports but doesn't follow runtime path strings (`fs.readFileSync(process.cwd() + "public/fonts/og/...")`). resvg-js silently fell back to no font and rendered text invisibly. Added `experimental.outputFileTracingIncludes` in `next.config.mjs` to ship `/public/fonts/og/**/*` with any `opengraph-image*` route. Local dev was unaffected because `process.cwd()` resolves to the full repo there.

## [1.21.0] - 2026-05-13

### Added

- Translated every blog post (16), city guide (11), and country playbook (5) to Turkish, Farsi, Arabic, and Russian (160 routes total at 100% per-locale coverage); each MDX lives at `src/content/{category}/{locale}/{slug}.mdx`
- Lifted every visible UI string on `/events`, `/onboarding`, `/login`, `/relocation-agent`, `/contact`, `/credits`, `/local-guides`, `/local-guides/join`, the neighborhood guide tree, and the blog tag filter chips into `src/messages/{locale}.json`
- Lifted prose fields from `src/lib/spaces.ts` (18 space descriptions) and `src/lib/neighborhoods.ts` (10 neighborhoods × `description`, `vibe`, `transport`, `bestFor`) into `spacesList.*` and `neighborhoodList.*` namespaces with translations
- Lifted country display names (25 entries) for the relocation form's origin selector, the path-to-istanbul grid, and the world map tooltips into `lookups.countryNames`
- Localized all three transactional email templates (contact form, newsletter welcome, guide application) with full subject + previewText + body i18n; emails now set `<html lang dir>` and right-align headers in RTL clients
- Native Persian and Arabic OpenGraph image rendering via `@resvg/resvg-js` + HarfBuzz, replacing the English fallback that `@vercel/og` (satori) forced us into because it crashes on Arabic-script GSUB lookupType 5 substFormat 3 (vercel/satori#74). Ships Vazirmatn and Noto Sans Arabic TTFs under `/public/fonts/og/`. en/tr/ru continue to use satori; fa/ar use resvg with a hand-tuned RTL layout
- Locale-aware date formatting in `src/lib/utils.ts` - `formatDate`, `formatDateShort`, `formatEventDate` now accept an optional `Locale` and route to the right BCP 47 tag via `Intl.DateTimeFormat`
- Per-locale `og:locale` (en_US / tr_TR / fa_IR / ar_SA / ru_RU) and `og:locale:alternate` on every page via a `generateMetadata({ params })` in the root layout, plus localized `og:description`
- `og` namespace in all five message files with `category`, `title`, `description`, `tagline`, `altText`, and per-route fallback labels for the 11 OG image generators
- `blogTags` namespace localizing all 34 blog tag chip labels while keeping the URL slugs English so `/blog?tag=coworking` works across locales
- `font-size-adjust: 0.52` + 82% root font-size for fa/ar to compensate for Bon Pro / Noto Sans Arabic ascender height
- `next.config.mjs` `serverComponentsExternalPackages: ["@resvg/resvg-js"]` so webpack doesn't try to bundle the native `.node` binary
- New documentation at `docs/i18n/og-rendering.md` explaining the dual-renderer architecture
- `pnpm format` step in the agent translation playbook so future batches don't trigger CI Lint rework

### Changed

- Bumped all 13 OG image routes from Edge to Node runtime so the resvg path can `fs.readFileSync` the Arabic-script TTFs
- Replaced static `transform: scaleX(-1)` rule for RTL icon mirroring with Tailwind's `--tw-scale-x: -1` CSS variable so the mirror composes correctly with hover-translate utilities; added `rtl:group-hover:-translate-x-*` variants at 7 icon sites so hover motion reverses direction in RTL
- Locked bidi-isolated runs of LTR-format strings (rent ranges like `$480-$880/mo`, wifi speeds, hours, space prices) inside `<bdi dir="ltr">` so they stop reversing inside Persian/Arabic paragraphs
- MDX tables now use logical-property utilities (`text-start`, `ms-6`, `ps-6 pe-4`, `border-s-4`) and wrap cell content in `<bdi>` so Latin runs like "20 GB" stay readable while the cell anchors right in RTL
- The hero `<h1>` on Persian/Arabic pages drops its `max-w-[11.5ch]` cap (Arabic-script `ch` is wider than Latin) and tightens line-height
- Reworded the `NeighborhoodStatCard` footnote to drop the `spaces.ts` filename reference so the line stays fully translatable
- Toast helper (`src/lib/toast.ts`) reduced to pure pass-through; the five convenience methods that hard-coded English copy were removed and the one live caller (`contact-form`) now passes translated strings
- Layout's static `metadata` export converted to `generateMetadata({ params })` so each page emits per-locale `og:locale` instead of always announcing `en_US`
- Bumped package version to `1.21.0`

### Fixed

- Chrome's auto-translate was rewriting fa/ar pages into the viewer's preferred language - added `translate="no"` on `<html>` and `<meta name="google" content="notranslate">` so the page stays in the locale the user picked
- Language switcher's "switch to default locale from prefixed URL" code path was a no-op because `router.replace` of next-intl silently dropped same-pathname navigations; replaced with an explicit `window.location.href` + `NEXT_LOCALE` cookie write
- Hover state on directional Lucide icons in RTL used to un-mirror the arrow (Tailwind's hover utility outranked the static `transform: scaleX(-1)` rule) and slide it in the wrong direction; now the mirror persists and the slide goes leftward in RTL
- `formatDate` was hardcoded to `en-US` so a Persian visitor saw "April 2, 2026" instead of "۲ آوریل ۲۰۲۶"
- Country names in the relocation form's origin selector + world map tooltips rendered English ("United States", "Germany", "Iran") on fa/ar/tr/ru pages; lifted to `lookups.countryNames` and translated
- Neighborhood / space / score-label data prose was rendering English on translated pages because the values lived in `.ts` data files; lifted into i18n with deferred fallback to the English string
- Tag chips on `/blog` listing and `/blog/[slug]` detail rendered the raw English slug; localized via a `blogTags` lookup with slug fallback
- Two batches of translated MDX files (FA + AR `turkey-digital-nomad-visa-guide.mdx`) shipped with `<!-- HTML comments -->` which MDX rejects and crashed the route at render time; converted to `{/* MDX comments */}` and documented the rule in the workflow guide

## [1.20.0] - 2026-05-11

### Added

- Added multi-language support with `next-intl` for Turkish (`/tr`), Farsi (`/fa`), Arabic (`/ar`), and Russian (`/ru`). English remains at the root (`/`) so existing URLs and backlinks stay intact
- Added per-locale `<html lang dir>` attributes using BCP 47 codes (`en-US`, `tr-TR`, `fa-IR`, `ar-SA`, `ru-RU`) and RTL direction for Arabic and Farsi
- Added a globe-icon language switcher in the header dropdown with English / Türkçe / فارسی / العربية / Русский
- Added hreflang alternates in `sitemap.xml` and `og:locale` per route for proper search engine attribution, with `x-default` pointing to English
- Added per-locale UI string files at `src/messages/{en,tr,fa,ar,ru}.json` covering header, footer, mobile menu, bottom tab bar, language switcher, and the full homepage
- Added a localized MDX loader at `src/lib/i18n/content.ts` that falls back to English when a translation is missing so locale rollout can be incremental
- Added four native-fluent audit agents under `.claude/agents/` (`nomad-tr-editor`, `nomad-fa-editor`, `nomad-ar-editor`, `nomad-ru-editor`) that audit grammar, vocabulary, brand voice, locale SEO, and AI engine optimization, with a strict no-fabrication rule
- Added per-locale keyword trackers and an i18n playbook at `docs/i18n/`

### Changed

- Moved every user-facing route under `src/app/[locale]/` while keeping API routes, auth callback, sitemap, and metadata files at the app root
- Merged the existing Supabase auth and markdown content-negotiation middleware with `next-intl`'s locale routing so all three responsibilities run in one middleware pass
- Refactored `Header`, `Footer`, `MobileMenuOverlay`, `BottomTabBar`, and the entire homepage to source every visible string from translation keys instead of hardcoded JSX
- Refactored `navItems` and `footerNav` in `src/lib/constants.ts` from `{label, href}` literals to `{key, href}` so labels resolve through `useTranslations`
- Updated `sitemap.ts` to emit per-locale entries with `<xhtml:link rel="alternate" hreflang="...">` blocks
- Bumped package version to `1.20.0`

## [1.19.0] - 2026-05-09

### Added

- Added a same-day work finder upgrade to `/spaces` with modes for best today, calls, quiet focus, rain-safe, open late, budget, and first visit
- Added combinable work-signal filters for calls-friendly, quiet, strong sockets, rain-safe, first visit, open late, and budget-aware spaces
- Added ranked best-match summaries, richer space labels, caution notes, and clearer partial-score language so users can compare cafes and coworking spaces faster
- Added deterministic finder logic and Vitest coverage for signal derivation, combined filters, calls-mode ranking, and amenity search

### Changed

- Redesigned the Nomad Spaces hero around daily work decisions instead of a static directory
- Moved the map into an optional comparison view so mobile users can scan results before opening the map
- Bumped package version to `1.19.0`

## [1.18.0] - 2026-05-04

### Added

- Added the First Week Planner at `/tools/first-week-planner`, a deterministic seven-day Istanbul landing plan based on arrival profile, base neighborhood, work style, social appetite, and budget comfort
- Added shareable planner query params, copy-link support, a scannable itinerary timeline, save-link strip, and week-one avoid notes
- Added planner entry points from the homepage, Neighborhood Rhythm Matcher results, neighborhood detail pages, main navigation, footer navigation, and sitemap
- Added `docs/product-features-2026-roadmap.md` with the UX standards and release sequence for the next product-layer features
- Added Vitest coverage for planner determinism, query parsing, selected neighborhood behavior, paperwork guidance, and link coverage

### Changed

- Bumped package version to `1.18.0`

## [1.17.0] - 2026-05-03

### Added

- Added an interactive neighborhood rhythm matcher to the homepage and neighborhoods guide so visitors can rank Istanbul bases by quiet routine, social energy, budget, ferry life, seaside access, business setup, nightlife, and character
- Added an Istanbul Today widget with live weather, current Istanbul mood, and a generated photoreal Bosphorus rain scene with lightweight animated rain, sun, clouds, or wind for a sharper daily city signal
- Added structured neighborhood badges across homepage cards, the neighborhoods guide, and each neighborhood detail hero so each area has a faster first-read identity
- Added a designed decision-notes section for conditional Istanbul areas and places to avoid as a first base, replacing the raw guide tables with a more useful shortlist

### Changed

- Updated the neighborhoods guide to lead with a stronger decision layer before the long-form MDX content
- Bumped package version to `1.17.0`

## [1.16.0] - 2026-05-03

### Added

- Expanded the neighborhood guide from five to ten Istanbul bases with Uskudar, Nisantasi, Levent, Balat, and Atasehir. Each new neighborhood has rent ranges, transport notes, nomad fit tags, map coordinates, detail pages, markdown endpoints, and relocation-agent scoring profiles
- Added locally optimized, credited Unsplash hero images for the five new neighborhoods and regenerated the neighborhood photo attribution manifest
- Added broader tiered coverage for Yeldegirmeni, Bomonti/Ferikoy, Sisli/Mecidiyekoy, Beyoglu, Etiler, Ortakoy, Arnavutkoy/Bebek, Kagithane, Maslak, Bakirkoy/Atakoy, Florya/Yesilkoy, Fener, Sariyer/Istinye, and lower-fit first-month areas like Sultanahmet, Fatih core, Esenyurt/Beylikduzu, Basaksehir, Bagcilar/Esenler, Pendik/Tuzla, Sile/Kilyos, and the Princes' Islands

### Changed

- Updated homepage neighborhood cards, the interactive map, guide copy, local-guide filters, email copy, and AI-readable markdown text so they describe the broader ten-neighborhood coverage
- Bumped package version to `1.16.0`

## [1.15.2] - 2026-05-02

### Changed

- Replaced the five neighborhood hero/card photos with premium generated editorial originals for Kadikoy, Moda, Cihangir, Besiktas, and Karakoy/Galata. The new set is versioned as `hero-premium-2026.jpg` / `.webp`, uses generated-original credit metadata, and is wired through the neighborhood guide, homepage hero media, mobile neighborhood carousel, and footer background
- Regenerated `public/images/neighborhoods/attributions.json` so the credits page reflects the new generated hero images while preserving the existing gallery photo credits

## [1.15.1] - 2026-05-01

### Changed

- Replaced the remaining 11 stock-sourced blog covers with generated editorial originals so all 14 blog posts now share one Istanbul-specific visual system. The refreshed set covers the Asian vs European side decision, laptop-friendly cafes, EspressoLab, ferry commute, first-week mistakes, residence permit walkthrough, city comparison, cost of living, slowmad living, coworking spots, and Turkey digital nomad visa posts
- Simplified `src/lib/blog-covers.ts` around generated-original metadata for every blog cover, with updated alt text for the new scenes

## [1.15.0] - 2026-04-30

### Added

Three blog posts from the 30-day content calendar (`docs/blog-content-calendar.md`) that were planned but not yet published. Each anchors a LinkedIn post in the Apr 27 - May 5 window.

- **`src/content/blog/coworking-vs-cafe-istanbul.mdx`** (B1, planned for Apr 21). The decision-framing piece anchoring LinkedIn Post 7 (the coworking carousel on Apr 29). Cross-links into `/blog/top-coworking-spots`, `/blog/best-laptop-friendly-cafes-istanbul`, `/guides/coworking`, `/spaces`. ~900 words. Author Ali. Tagged coworking, cafes, productivity, remote-work
- **`src/content/blog/iran-to-istanbul-playbook-companion.mdx`** (B3, planned for Apr 28). Narrative companion to `/path-to-istanbul/iran` - texture rather than facts, anonymized. Anchors LinkedIn Post 8 (May 1 Iran text). Cross-links into the playbook, `/blog/getting-residence-permit`, `/guides/visa`, `/blog/top-coworking-spots`. ~1100 words. Author "The Community". Tagged iran, path-to-istanbul, relocation, founders
- **`src/content/blog/ikamet-mistakes-istanbul.mdx`** (B4, planned for Apr 30). Seven concrete mistakes (uncertified translations, wrong insurance, file-order bounces, Fatih cash window) from a year of helping community members through their applications. Anchors LinkedIn Post 9 (May 5 ikamet carousel). Cross-links into `/blog/getting-residence-permit`, `/guides/visa`, `/blog/turkey-digital-nomad-visa-guide`. ~950 words. Author Dina. Tagged visa, residency, ikamet, bureaucracy
- Generated editorial cover images for the three new posts above, saved as optimized JPG/WebP pairs in `public/images/blog/`. The covers are wired through `src/lib/blog-covers.ts` with generated-original credits and updated alt text. The credits page now describes generated originals alongside Unsplash and Wikimedia Commons sources

### Changed

- Blog count goes from 11 to 14 posts. The Practical how-to and Path-to-Istanbul pillars now have current 2026 narrative coverage to match what the LinkedIn calendar promises

## [1.14.1] - 2026-04-29

### Changed

- Refreshed all five neighborhood hero photos with new Unsplash sources (Kadikoy, Moda, Cihangir, Besiktas, Galata). Each photo now has a named contributor in the credit metadata instead of "Unsplash contributor", a proper `unsplash.com/photos/{slug}/download` source URL, and matching alt text describing what's actually in the frame. Files are versioned with a `-2026.jpg` / `-2026.webp` suffix so old caches expire cleanly. Footer background image and the `neighborhoods.mdx` inline heroes both point at the new files
- Added two new gallery entries (Kadikoy + Galata) backed by Unsplash photos with named photographers
- New `unsplashDownload()` helper in `src/lib/neighborhoods.ts` builds the Unsplash hotlink-friendly download URL alongside the existing `unsplashCdn()` helper
- Homepage hero route strip rewrites the three time-stamped steps to be specific places ("Kadikoy pier" / "Karakoy table" / "Galata evening") with more concrete supporting copy. Top mono-uppercase strip now reads "Kadikoy 09:10 / Karakoy 10:25 / Galata 18:30" + "GMT+3 / ferry-first / laptop-ready" and uses a 2-column grid instead of the previous flex+border row. New `heroDeskNotes` constant for the side desk-card under the hero
- Email subjects rewritten for warmth: contact form "Contact form: {name}" -> "New Istanbul Nomads message from {name}"; newsletter welcome "Welcome to Istanbul Digital Nomads" -> "Your Istanbul work rhythm starts here"; local guide application "Guide application: {name}" -> "Local guide candidate: {name}"
- `NewsletterWelcomeEmail` now takes an `email` prop so the template can personalise the unsubscribe footer. Local-guide application email payload now includes `sample_tip` so the moderator sees the candidate's example tip in the notification

### Fixed

- Replaced em dashes with regular hyphens across `CHANGELOG.md`, `src/lib/emails.tsx`, and miscellaneous content to match the new project writing-style rule (`CLAUDE.md`)

## [1.14.0] - 2026-04-28

Sitewide redesign pass. Plan + diagnosis lives in [`docs/redesign-2026-q2.md`](docs/redesign-2026-q2.md). The diff fans out across 21 files because design tokens propagate; functionally everything reads the same, just less SaaS-marketing and more editorial-warm.

### Changed

- **Footer rewritten.** The 2rem-rounded red gradient block is gone. Replaced with a quiet 4-band layout (newsletter band → 4-column nav grid → icon-only social row → mono-uppercase legal line) on a warm `#f6f1ea` light / `#14110f` dark background. Hairline borders, no shadows, single Telegram CTA in the social row only. Photographic accent at low opacity behind the bands picks up the brand doc's "warm documentary realism" cue
- **Headlines now use Manrope** (display font, weights 600/700/800) via `next/font/google`. Wired to `--font-display` CSS variable and `font-display` Tailwind utility. Inter stays for body. Cost: ~15kb gzipped
- **Type scale formalised in `tailwind.config.ts`.** New tokens: `display-sm/md/lg` (56/64/72px), `h1/h2/h3` (44/36/28px), `body/body-lg/body-xl` (16/17/18px), `eyebrow` (11px mono uppercase)
- **Dark-mode warmed.** `--background` `#0f1117 → #14110f`, `--muted` `#99a3ad → #b7aaa0`, dark border `#2c2f3a → #3c2d24`, surface dark `#1a1d27 → #1a1612`. The brand doc forbade cold blue-gray; now it's warm charcoal site-wide
- **Card primitive simplified.** `rounded-lg → rounded-md` (8px → 6px), `shadow-lg` removed, hover state now `translate-y` + warmer border tint. No more red-shadow glow on card hover
- **Button primary** drops the heavy `shadow-[0_10px_25px]` to a lighter `0_8px_20px` (light) and `shadow-none` (dark). Secondary becomes outline-only with subtle hover bg
- **"Coming to {neighborhood}? Say hi before you land" CTA** on every neighborhood detail page replaced with the same warm-panel + hairline border treatment as the footer; only the Telegram button keeps Turkey Red as a single accent
- **Header touched up:** Telegram CTA more prominent, logo + nav rhythm tightened
- **Newsletter form** cleaned up to match the new aesthetic (slimmer input, less shadow)

### Added

- **`src/lib/blog-covers.ts`** + 11+ image pairs in `public/images/blog/` (`*.jpg` + `.webp`). Every blog post now has a verified Wikimedia Commons / Unsplash cover image with proper credit metadata. Wired into `src/lib/blog.ts`
- **`docs/redesign-2026-q2.md`** committed to the repo as the design rationale + phase plan

### Files touched (21)

```
src/app/layout.tsx                                 - Manrope import + theme-color update
src/app/page.tsx                                   - homepage redesign (482 lines)
src/app/blog/[slug]/page.tsx                       - blog post template
src/app/blog/blog-listing.tsx                      - blog listing
src/app/credits/page.tsx                           - credits page polish
src/app/guides/neighborhoods/[neighborhood]/page.tsx - neighborhood CTA block
src/components/layout/footer.tsx                   - full rewrite
src/components/layout/header.tsx                   - small refinements
src/components/newsletter-form.tsx                 - visual cleanup
src/components/sections/neighborhood-cards.tsx     - token-level updates
src/components/sections/neighborhoods-map-section.tsx - same
src/components/ui/button.tsx                       - variant tweaks
src/components/ui/card.tsx                         - radius / shadow / hover
src/components/ui/istanbul-map.tsx                 - token-level updates
src/components/ui/reveal.tsx                       - token-level updates
src/lib/blog.ts                                    - wires blog-covers
src/lib/constants.ts                               - adds Legal nav group
src/styles/globals.css                             - warm dark tokens, eyebrow uses new size
tailwind.config.ts                                 - display font + type scale + warm surface
docs/redesign-2026-q2.md                           - plan committed
src/lib/blog-covers.ts                             - new
```

## [1.13.1] - 2026-04-27

### Removed

- Migration `011_drop_corpus_chunks.sql` drops `corpus_chunks` table and `match_corpus_chunks(vector,int,text[])` function from the production Supabase. They've been unused since 1.13.0 (deterministic agent). `pgvector` extension stays installed; `relocation_plans` table is kept (auth members still persist there)
- `ANTHROPIC_API_KEY` and `VOYAGE_API_KEY` removed from Vercel project env vars (Production + Preview). The deterministic agent never reads them

## [1.13.0] - 2026-04-27

### Changed

- **Relocation agent is now fully deterministic. No LLM, no Voyage embeddings, no RAG.** Pulled the entire AI pipeline out and replaced it with `src/lib/agent/plan-builder.ts` - a typed scoring function over our existing structured content (5 neighborhoods, 3 cost tiers, 12 setup steps). For 5 neighborhoods and 3 cost tiers, the LLM was rephrasing the same data we already had. End-to-end response is now sub-50ms instead of 30-60s, costs $0/request instead of ~$0.03-0.06, and is fully predictable (same intake = same plan)
- Neighborhood pick is now scored across five axes: budget fit (30%), lifestyle (25%), must-haves (20%), work mode (15%), and duration (10%). Each neighborhood has a hand-tuned profile (social, quiet, ferryAccess, socialScene, nearCoworking, budgetFriendly, central) derived from its prose vibe and bestFor tags
- Cost breakdown picks the matching tier from `cost-tiers.ts` and swaps the rent line for the chosen neighborhood's actual rent range
- Strategy is now rule-based and conditional on intake (residence-permit advice for 6+ month stays, KOSGEB note for founders, Wise tip at every tier, etc)
- Tips are pulled from a curated pool with weights and per-intake conditions (mustHaves, duration, lifestyle, side affinity), then returned top-8
- 21 new vitest cases for `plan-builder.ts` covering scoring sensitivity, cost-tier picks, setup-plan filtering, strategy rules, tip filtering, and citations

### Added

- Result page got a real polish pass:
  - **Intake recap** at the top of the result, echoing the visitor's budget/duration/lifestyle/work/origin so they remember what they asked
  - **Neighborhood Match card** now shows the neighborhood's hero photo on a side-by-side layout with the facts grid, a "Best for" tag row, the reasoning, and a CTA to read the full neighborhood guide
  - **At-a-glance stat strip**: monthly total, tier label, week count, tip count, four equally-weighted tiles
  - **Cost breakdown** is grouped by category (Housing / Food & drink / Transport / Connectivity / Lifestyle), each with its own subtotal, sorted by spend descending. Replaces the previous flat dl
  - **Setup plan** is now a vertical timeline with week markers, connecting line, and check-circle icons for each item, replacing the four-column grid
  - **Sources footer** redesigned: each citation is a clickable pill linking back to the source guide / blog / playbook / neighborhood / spaces page
- Alternate neighborhoods are linked with their rent range visible inline on the chips

### Removed

- `ANTHROPIC_API_KEY` and `VOYAGE_API_KEY` env vars are no longer used. Safe to remove from Vercel and `.env.local`. Documented removal in `.env.example`
- `ai`, `@ai-sdk/anthropic`, and `dotenv` removed from dependencies
- Deleted: `src/lib/agent/relocation-agent.ts`, `prompts.ts`, `prompts.test.ts`, `embeddings.ts`, `retrieve.ts`, `retrieve.test.ts`, `chunker.ts`, `chunker.test.ts`, `scripts/ingest-corpus.ts`. The `corpus_chunks` table in Supabase is no longer read; can be dropped via a future migration
- Removed the rotating-message `LoadingState` panel from the form. With sub-50ms responses there's no need - the button's own spinner is sufficient

### Migration notes

- No database migration required. The `corpus_chunks` table from `010_relocation_agent.sql` is now unused but harmless; clean up later if desired
- Vercel function `maxDuration` for `/api/relocation-agent` reduced from 60s to 10s to match the new latency profile
- Anonymous rate limit raised from 5/hour to 30/hour and authenticated from 20/hour to 60/hour, since requests are no longer expensive

## [1.12.3] - 2026-04-27

### Changed

- `/relocation-agent` form now swaps to a `LoadingState` panel while the agent is running instead of just showing a spinner on the submit button. The panel shows a centred loader, a status message that rotates through eight steps every 5 seconds (mirroring the agent's actual mental model: "looking at your budget", "walking the five neighborhoods we cover", "pulling fresh rents from our cost-of-living guide", etc), a "30-50 second" reassurance line, and skeleton previews of the three result cards underneath. The form stays mounted (not unmounted) so a failure path re-displays it with the user's intake values intact

## [1.12.2] - 2026-04-27

### Fixed

- `/api/relocation-agent` was still hitting Vercel's 60s function cap on cold starts even after the 1.12.1 narrative-to-Haiku split. Two LLM calls back-to-back was the wrong shape. Dropped the narrative `generateText` entirely - the plan summary is now synthesised deterministically from the structured plan JSON via a new `synthesizeNarrative()` helper. Reuses the agent's own `reasoning`, week-1 setup item, and first tip, so the voice stays grounded without a second model round-trip. Cuts end-to-end latency to one Sonnet call (~25-40s) with real margin under the function cap
- `/relocation-agent` form crashed with a JSON parse SyntaxError when the API returned a plain-text gateway error (504 timeout, 502 bad gateway). The submit handler now reads the body as text first, tries `JSON.parse`, and falls through to a friendly toast if the body isn't JSON. The 504 case now shows "The agent took too long. Try again in a minute." instead of throwing

## [1.12.1] - 2026-04-27

### Fixed

- `/api/relocation-agent` was hitting Vercel's 60s function cap on production after `claude-sonnet-4-6` did the structured plan AND the narrative summary. Split the two LLM calls so Sonnet still picks the neighborhood and builds the cost breakdown, but `claude-haiku-4-5` does the narrative rewrite (3-5x faster, plenty for rephrasing JSON the agent already produced). Trims end-to-end latency from ~60s to ~30-40s with comfortable margin under the function cap. Locally cached previews pass; production smoke test now returns 200 on the same intake that was 504'ing

## [1.12.0] - 2026-04-25

### Added

- Relocation decision agent at `/relocation-agent`. Visitors fill a small intake (budget, duration, lifestyle, work mode, optional origin country, must-haves, free-text notes) and get back a structured plan: primary neighbourhood + alternates, cost breakdown in USD and TL with line items pulled from our verified cost-of-living tiers, a 4-week first-month setup checklist sourced from existing guides, strategy and tips sections, and citations back to the chunks the agent actually used
- `POST /api/relocation-agent` route. Anonymous: 5 plans per hour per IP. Authenticated: 20 per hour per user. Rate-limit headers and `Retry-After` returned on every response. `request_id` echoed in JSON, header, and logs for tracing. `maxDuration: 60` so Vercel doesn't cut the LLM call mid-stream. Authenticated calls best-effort persist to `relocation_plans` (failures logged, never block the response)
- Migration `010_relocation_agent.sql`. Two new tables (`corpus_chunks` with a `vector(1024)` column and an ivfflat cosine index, `relocation_plans` with member-scoped RLS) plus a `match_corpus_chunks` SQL function for cosine similarity retrieval. `pgvector` extension enabled for the project
- RAG corpus ingestion at `scripts/ingest-corpus.ts`. Chunks the 11 guides, 11 blog posts, 5 path-to-istanbul playbooks, 5 neighborhoods, every space with `status === "open"` (with `unverified_fields` stripped), the 3 cost tiers, and the 12 setup steps. Splits on H2 boundaries, windows long sections with overlap, and deletes-then-inserts per source so reruns are idempotent. Embeds with Voyage AI (`voyage-3`, 1024 dims) and writes to Supabase via the service role
- Agent runtime modules in `src/lib/agent/`: typed contracts (`types.ts`, with `relocationIntakeSchema` and `relocationPlanSchema` Zod schemas), structured cost tiers (`cost-tiers.ts`), first-month setup steps (`setup-steps.ts`), markdown chunker (`chunker.ts`), Voyage embeddings client (`embeddings.ts`), retrieval (`retrieve.ts` - hybrid structured-always-on + vector top-K with graceful degradation when Voyage or Supabase fails), prompts (`prompts.ts` - frozen system prompt with brand-voice rules), generator (`relocation-agent.ts` - one `generateObject` call against `claude-sonnet-4-6` plus a `generateText` follow-up for the narrative summary)
- New skill `build-relocation-plan` registered in `src/lib/agent-skills.ts`. External agents can discover the endpoint via `/.well-known/agent-skills/build-relocation-plan/SKILL.md` with the same digest pattern as the existing skills
- Vitest coverage for the new modules: chunker (heading splits, MDX leaks, windowing), retrieval (always-on structured block, mocked Voyage/Supabase failure paths, RPC mapping, origin-country playbook attachment), prompts (system prompt snapshot, prompt-template content invariants)

### Changed

- `.env.example` documents the three new server-side env vars (`SUPABASE_SERVICE_ROLE_KEY`, `ANTHROPIC_API_KEY`, `VOYAGE_API_KEY`)
- `src/types/database.ts` extended with the two new tables and the `match_corpus_chunks` function signature so query call sites get correct types
- `.claude/launch.json` dev port bumped from 3000 to 3030 to avoid colliding with another local Nuxt dev server
- Voyage embedding client throttles to free-tier limits by default (16 inputs/batch + 21s gap = under 3 RPM and 10K TPM). Set `VOYAGE_PAID=1` in env once a payment method is added on the Voyage dashboard to switch back to 64 inputs/batch with no delay. Documented in `.env.example`

## [1.11.0] - 2026-04-25

### Added

- Surprise event waitlist on `/events`. Persistent section above the event cards for an unannounced community event - title and date stay hidden until the day, visitors join a waitlist with first name + email. Avatar stack of the latest 10 signups (gradient initials, no stock photos), real-only count - no fake padding ever, "Be the first to join" empty state until the first real signup
- `surprise_event_waitlist` table (migration `009_surprise_event_waitlist.sql`) with public-insert RLS, no auth required. Email is unique-constrained for dedup
- `POST /api/waitlist` (rate-limited 5/min per IP, dedup-safe with the same unified-success pattern as the newsletter route to avoid email enumeration) and `GET /api/waitlist` returning `{ count, recent }` - emails are never exposed, only first names of the latest 10 signups
- `validateWaitlistSignup` helper in `src/lib/validations.ts`
- `getWaitlistSummary` query helper in `src/lib/supabase/queries.ts` using the public Supabase client (cookie-less, ISR-friendly)
- "Complete profile" CTA in the post-signup state - links to `/login` so the visitor can authenticate and be routed into the existing onboarding wizard. Helper copy explains why (priority for limited spots, faster intro into the community)

### Changed

- The waitlist section uses a frosted-glass treatment (`bg-white/40` + `backdrop-blur-2xl` + `ring-1 ring-white/60` + warm gradient blobs underneath) to sit on top of the dark map background without feeling like a hard card. Inputs and sub-cards follow the same pattern

## [1.10.3] - 2026-04-24

### Fixed

- `src/lib/rate-limit.ts` now recognises the env var names Vercel's "KV by Upstash" Marketplace integration actually sets (`UPSTASH_REDIS_REST_KV_REST_API_URL` / `UPSTASH_REDIS_REST_KV_REST_API_TOKEN`), in addition to the plain Upstash names (`UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN`) and the legacy Vercel KV names (`KV_REST_API_URL` / `KV_REST_API_TOKEN`). Without this the code silently fell back to the in-memory limiter in production, because `Redis.fromEnv()` only reads the plain names. The integration dashboard for our store provisions the mangled names, so this was the actual production path and had to be fixed before #28 could deliver the distributed limiter it advertised

### Changed

- Replaced `Redis.fromEnv()` with explicit `new Redis({ url, token })` construction so the credential resolver is fully in our control. First matching pair wins, in order: plain Upstash → KV-by-Upstash → legacy Vercel KV

## [1.10.2] - 2026-04-24

### Added

- Distributed rate-limit backend via `@upstash/ratelimit` + `@upstash/redis`. `src/lib/rate-limit.ts` now auto-selects Upstash when `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` are set, and falls back to the existing in-memory sliding-window limiter otherwise. Upstash path uses one `Ratelimit` instance per `(limit, windowMs)` tuple, reused across callers that share a budget. Emits `X-RateLimit-Backend: upstash|memory` header so we can see which path is live in production
- Graceful degradation on Upstash errors: any thrown error from the SDK (network failure, Redis unreachable) falls through to the in-memory limiter rather than blocking the request. Logs a `console.warn` for observability
- Per-user rate limit on `POST /api/events` (5 drafts per hour, keyed by `user.id`). Applied after the Supabase auth check so the limiter key is always a real user UUID, never an IP
- Per-user rate limit on `POST /api/rsvps` (30 RSVPs per hour, keyed by `user.id`). RSVPs are idempotent via upsert, but the 30/hour cap still meaningfully limits sustained abuse

### Changed

- `rateLimit()` is now async. All call sites in `/api/mcp`, `/api/newsletter`, `/api/contact` updated to `await`

## [1.10.1] - 2026-04-23

### Added

- `src/lib/rate-limit.ts` - in-memory sliding-window rate limiter shared across API routes. Returns `{ allowed, remaining, retryAfterSeconds, resetAt }` and emits `X-RateLimit-Limit` / `X-RateLimit-Remaining` / `X-RateLimit-Reset` / `Retry-After` headers. Documented in-file as a per-instance limiter (Vercel scales horizontally, so it stops casual abuse but isn't a security boundary; follow-up would be Upstash or Vercel KV)
- Rate limiting on `/api/mcp` (60 req/min per IP), `/api/newsletter` (5 req/min per IP), `/api/contact` (3 req/min per IP). All three now return 429 with `Retry-After` when the window is exceeded
- `unstable_cache` wrapper around the `list_events` MCP tool's Supabase call. Tag `events`, 60s revalidation. Caps Supabase events queries at one per minute per (limit, type) combination even if an agent loops `tools/call list_events` hot

### Changed

- `/api/newsletter` now returns a unified success message whether the email is new or already subscribed. Removes the previous "You're already subscribed!" branch, which was an email enumeration oracle (agents could probe for specific addresses). Real validation failures (malformed email) still return 400 because those reflect user typos

### Security

- After publishing OAuth/OIDC discovery in 1.10.0, the authentication path to protected write endpoints became structurally discoverable. This release is the defensive follow-up: rate-limit the endpoints most exposed to automated abuse (unauthenticated email sends + the public MCP server)

## [1.10.0] - 2026-04-23

### Added

- Four more agent-discovery endpoints to close the remaining items in the isitagentready.com "API, Auth, MCP & Skill Discovery" bucket. Target state: 6/6 for that category, overall score 100
- `src/app/api/mcp/route.ts` - real MCP server speaking JSON-RPC 2.0 over HTTP POST. Implements `initialize`, `tools/list`, `tools/call`, `ping`, and `notifications/initialized`. Exposes six read-only tools backed by existing data sources: `list_spaces` (with neighborhood/type/laptop_friendly filters, sourced from `src/lib/spaces.ts`), `list_guides` + `get_guide` (from `src/lib/data.ts` and `getMarkdownForPath`), `list_blog_posts` + `get_blog_post` (from `src/lib/blog.ts`), and `list_events` (from `getEventsPublic` in `src/lib/supabase/queries.ts`). All read-only so no auth required
- `src/app/.well-known/mcp/server-card.json/route.ts` - MCP Server Card pointing at `/api/mcp` with `serverInfo` (name/version/title), `protocolVersion` 2024-11-05, `transport.type` http, and `capabilities.tools`
- `src/app/.well-known/openid-configuration/route.ts` - OIDC discovery document. Issuer points at the real Supabase Auth server for the project (`NEXT_PUBLIC_SUPABASE_URL/auth/v1`); endpoints for authorize, token, userinfo, and jwks match the tokens Supabase actually mints. Honest metadata, not a proxy lie - Supabase is genuinely the OIDC provider for any protected endpoint on this origin
- `src/app/.well-known/oauth-protected-resource/route.ts` - RFC 9728 Protected Resource Metadata declaring istanbulnomads.com as the `resource` with Supabase Auth listed in `authorization_servers`. `scopes_supported` mirrors what Supabase grants; `bearer_methods_supported: ["header"]` matches how our routes read the Authorization header
- `src/components/web-mcp-register.tsx` - client component that calls `navigator.modelContext.registerTool()` on mount with four tools: `search_istanbul_spaces`, `open_istanbul_guide`, `list_upcoming_istanbul_events`, `list_istanbul_blog_posts`. Handles both the `registerTool` and legacy `provideContext` surfaces, no-ops gracefully in browsers that don't implement WebMCP
- `src/app/layout.tsx` mounts `WebMcpRegister` inside `<body>` via `dynamic(..., { ssr: false })` so it only runs client-side

## [1.9.0] - 2026-04-23

### Added

- Agent discovery endpoints under `/.well-known/*` to close the gap on isitagentready.com's "API, Auth, MCP & Skill Discovery" category (previously 0/6). Current scan sat at a total score of 50 because every check in this bucket failed; these two additions target the highest-leverage ones for a content site
- `src/app/.well-known/api-catalog/route.ts` - RFC 9727 `application/linkset+json` catalog. Both linkset entries (`/api/events` and the origin) carry a `service-desc` relation pointing at the OpenAPI spec, a `service-doc` relation pointing at human documentation, and supporting `status` / `describedby` relations. The scanner's SKILL.md specifies `anchor` + `service-desc` + `service-doc` as the mandatory trio; the previous version only had `service-doc` and would have failed validation
- `src/app/openapi.json/route.ts` - OpenAPI 3.1 specification for the public `/api/events` surface (the only documented read-only API). Referenced as `service-desc` from the api-catalog so agents can discover request shapes, query parameters, and the `Event` schema without calling the endpoint first
- `src/app/.well-known/agent-skills/index.json/route.ts` - Agent Skills Discovery RFC v0.2.0 index listing three capabilities the site exposes to agents: read-istanbul-content, find-coworking-spaces, browse-istanbul-events. Each entry carries a `sha256-<base64>` digest of its SKILL.md body, computed at request time from the shared skill module so digests stay in sync with the content
- `src/app/.well-known/agent-skills/[name]/SKILL.md/route.ts` - serves the individual SKILL.md body as `text/markdown`. Uses `generateStaticParams` so each skill is statically generated at build, and returns a plain-text 404 for unknown names
- `src/lib/agent-skills.ts` - single source of truth for skill names, descriptions, and body content. Exports `agentSkills`, `skillUrl`, `skillDigest`, and `findSkill` so the index route and SKILL.md route share one definition

### Changed

- `src/middleware.ts` now early-returns for any `/.well-known/*` path, next to the existing `/_next` and `/api` skips. Required because the SKILL.md route ends in `.md`, which the markdown-negotiation rewrite would otherwise redirect into `/api/md/...` and 404

## [1.8.2] - 2026-04-23

### Added

- `src/content/blog/espressolab-istanbul-remote-work.mdx` - branch-by-branch guide to EspressoLab in Istanbul (Merter Roastery, Taksim Tunel, Besiktas Meydan, Kadikoy, Emirgan) with cross-links into `/spaces`, the laptop-friendly cafes post, and the top coworking spots roundup
- `src/content/blog/real-cost-of-living-istanbul-2026.mdx` - refreshed 2026 moderate-month cost-of-living breakdown (rent by neighborhood, food, transport, coworking, invisible costs like DASK/aidat/IMEI) with cross-links into the housing, food, transport, internet, and cost-of-living guides plus the first-week mistakes post

## [1.8.1] - 2026-04-20

### Added

- `src/components/sections/neighborhoods-map-section.tsx` - new "Where they sit on the map" section between the hero and the neighborhood cards. Lazy-loads `IstanbulMap` via `IntersectionObserver` (400px rootMargin) so the maplibre-gl + react-map-gl chunks only download when the user scrolls near the section
- Restored `src/components/ui/istanbul-map.tsx` (deleted in 1.8.0) so the below-the-fold map section can use it

### Changed

- Homepage now shows the interactive map in its own dedicated section rather than competing with the hero. Keeps the Lighthouse 100 win from 1.8.0 because the map chunks stay off the critical path until scroll

## [1.8.0] - 2026-04-20

### Changed

- Homepage now renders as ISR (`export const revalidate = 300`) instead of dynamic per-request. Unlocks bf-cache, removes the `Cache-Control: no-store` header, and serves the HTML from Vercel's edge cache after the first request. Lighthouse measured this as a large TTFB / bf-cache win
- Homepage's `getEvents` call swapped for a new `getEventsPublic` that uses a cookie-less Supabase client. Required to let ISR actually render statically - `cookies()` from `next/headers` was opting the route into dynamic mode
- Hero map (`IstanbulMap` with `react-map-gl` + `maplibre-gl`) replaced with a static Galata WebP hero image + a "Explore 5 nomad neighborhoods" link. Removes ~269KB of JS from the homepage critical path (of which Lighthouse flagged 154KB as unused), and was the single largest perf regression on the landing page. The interactive maps remain in place on `/spaces` and `/path-to-istanbul` where they're the primary content
- Tightened `sizes="..., 420px"` on neighborhood card photos (was `33vw` which over-delivered on wide desktop viewports). Saves ~85KB of image bytes per Lighthouse

### Added

- `createPublicClient()` in `src/lib/supabase/server.ts` - cookie-less Supabase client for public-read queries that must stay static
- `getEventsPublic()` in `src/lib/supabase/queries.ts`

### Removed

- `src/components/ui/istanbul-map.tsx` - the hero map component, now unused (maps on `/spaces` and `/path-to-istanbul` have their own dedicated components)

## [1.7.1] - 2026-04-19

### Changed

- Google Analytics now loads with `strategy="lazyOnload"` via `next/script` instead of `@next/third-parties/google`'s default `afterInteractive`. Drops the `<link rel="preload" href="gtag/js">` from the HTML head so the analytics script no longer competes with first-paint assets, and defers the ~30KB gtag.js payload until the browser is idle. Should improve TBT and INP on mobile
- Hero-section animated blur blobs (the two `motion-safe:animate-float` decorative circles behind the homepage title) are now hidden on mobile with `hidden lg:block`. Reduces paint + composite cost on low-power devices where they're the largest continuously-animating elements above the fold

### Removed

- `@next/third-parties/google` `GoogleAnalytics` component (replaced with direct `next/script` tags). The wrapper's baked-in eager-preload behavior was the main thing slowing down mobile first paint

## [1.7.0] - 2026-04-19

### Added

- Markdown content negotiation. Every page on the site now has a machine-readable markdown equivalent. Agents can either append `.md` to any URL (e.g. `/guides/visa.md`) or send `Accept: text/markdown` on the regular URL, and they get a clean markdown representation instead of rendered HTML. Unlocks Level 3 (Agent-Readable) on isitagentready.com's scan
- `src/app/api/md/[[...slug]]/route.ts` - catch-all route handler that returns `text/markdown` for any known path
- `src/lib/markdown.ts` - per-route markdown generator. Reads MDX source for guides/blog/path-to-istanbul (9 blog posts, 11 guides, 5 country relocation guides), generates markdown from typed data for neighborhoods (5) and the spaces directory, and serves curated summaries for static pages (home, about, events, contact, credits, local-guides)
- `src/app/llms.txt/route.ts` - site index for LLMs (llmstxt.org convention) listing every guide, neighborhood, blog post, country page, and directory with links to their markdown equivalents
- Per-page `Link: <{path}.md>; rel="alternate"; type="text/markdown"` response header on every HTML response. Skipped on auth/dashboard/settings/login/onboarding paths that have no markdown representation
- `Vary: Accept` response header so Vercel's CDN correctly caches the HTML and markdown variants separately

### Changed

- `src/middleware.ts` extended to handle markdown content negotiation before the existing Supabase session refresh logic. `.md` URLs and `Accept: text/markdown` requests are rewritten to the markdown API; everything else flows through unchanged

## [1.6.1] - 2026-04-19

### Added

- `Content-Signal` directive in `public/robots.txt` (`search=yes, ai-input=yes, ai-train=no`) so AI crawlers know the site opts into search indexing and answer-engine citations but declines model training use. Unlocks Level 2 (Bot-Aware) on isitagentready.com's scan
- Global `Link: <https://istanbulnomads.com/sitemap.xml>; rel="sitemap"` response header via `next.config.mjs` so agents can discover the sitemap from any page without parsing HTML

### Changed

- Replaced the dynamic `src/app/robots.ts` metadata route with a static `public/robots.txt` file. Next.js's `MetadataRoute.Robots` type doesn't accept custom directives like `Content-Signal`, and the content was fully static anyway (no dynamic values)

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

- `src/components/ui/mdx-components.tsx` now renders MDX `img` via `next/image` with optional caption parsing (caption after `|` in alt text). Uses block-styled spans rather than `figure`/`figcaption` to avoid hydration errors from markdown wrapping images in `<p>`

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
- `<ExternalLink>` component (`src/components/ui/external-link.tsx`) for inline TSX external links - auto-applies target="\_blank" + the policy-correct rel based on the domain registry, supports `category` and `rel` overrides
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

| Version | Date       | Summary                                                                                       |
| ------- | ---------- | --------------------------------------------------------------------------------------------- |
| 1.1.0   | 2026-04-13 | Nomad Spaces directory, Local Guides, dropdown nav, performance optimization (90 PageSpeed)   |
| 1.0.0   | 2026-04-12 | Launch-ready - email system, newsletter, dynamic sitemap, honest social proof, error handling |
| 0.2.0   | 2026-03-30 | Full MVP - Supabase, auth, 11 guides, 9 blog posts, events, onboarding, interactive map       |
| 0.1.0   | 2026-03-29 | Project setup, config files, initial homepage, documentation                                  |

[1.15.0]: https://github.com/istanbul-digital-nomads/website/compare/v1.14.1...v1.15.0
[1.14.1]: https://github.com/istanbul-digital-nomads/website/compare/v1.14.0...v1.14.1
[1.1.0]: https://github.com/istanbul-digital-nomads/website/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/istanbul-digital-nomads/website/compare/v0.2.0...v1.0.0
[0.2.0]: https://github.com/istanbul-digital-nomads/website/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/istanbul-digital-nomads/website/releases/tag/v0.1.0
