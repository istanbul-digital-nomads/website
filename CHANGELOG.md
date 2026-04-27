# Changelog

All notable changes to the Istanbul Digital Nomads website will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
src/app/layout.tsx                                 — Manrope import + theme-color update
src/app/page.tsx                                   — homepage redesign (482 lines)
src/app/blog/[slug]/page.tsx                       — blog post template
src/app/blog/blog-listing.tsx                      — blog listing
src/app/credits/page.tsx                           — credits page polish
src/app/guides/neighborhoods/[neighborhood]/page.tsx — neighborhood CTA block
src/components/layout/footer.tsx                   — full rewrite
src/components/layout/header.tsx                   — small refinements
src/components/newsletter-form.tsx                 — visual cleanup
src/components/sections/neighborhood-cards.tsx     — token-level updates
src/components/sections/neighborhoods-map-section.tsx — same
src/components/ui/button.tsx                       — variant tweaks
src/components/ui/card.tsx                         — radius / shadow / hover
src/components/ui/istanbul-map.tsx                 — token-level updates
src/components/ui/reveal.tsx                       — token-level updates
src/lib/blog.ts                                    — wires blog-covers
src/lib/constants.ts                               — adds Legal nav group
src/styles/globals.css                             — warm dark tokens, eyebrow uses new size
tailwind.config.ts                                 — display font + type scale + warm surface
docs/redesign-2026-q2.md                           — plan committed
src/lib/blog-covers.ts                             — new
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
- `src/components/ui/mdx-components.tsx` now renders MDX `img` via `next/image` with optional caption parsing (caption after ` | ` in alt text). Uses block-styled spans rather than `figure`/`figcaption` to avoid hydration errors from markdown wrapping images in `<p>`

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
- `<ExternalLink>` component (`src/components/ui/external-link.tsx`) for inline TSX external links - auto-applies target="_blank" + the policy-correct rel based on the domain registry, supports `category` and `rel` overrides
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

| Version | Date | Summary |
|---------|------|---------|
| 1.1.0 | 2026-04-13 | Nomad Spaces directory, Local Guides, dropdown nav, performance optimization (90 PageSpeed) |
| 1.0.0 | 2026-04-12 | Launch-ready - email system, newsletter, dynamic sitemap, honest social proof, error handling |
| 0.2.0 | 2026-03-30 | Full MVP - Supabase, auth, 11 guides, 9 blog posts, events, onboarding, interactive map |
| 0.1.0 | 2026-03-29 | Project setup, config files, initial homepage, documentation |

[1.1.0]: https://github.com/istanbul-digital-nomads/website/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/istanbul-digital-nomads/website/compare/v0.2.0...v1.0.0
[0.2.0]: https://github.com/istanbul-digital-nomads/website/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/istanbul-digital-nomads/website/releases/tag/v0.1.0
