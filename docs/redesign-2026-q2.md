# Redesign Plan — Q2 2026

> Status: **Draft, awaiting approval**
> Owner: aliwesome
> Target releases: v1.14.0 → v1.14.1 → v1.15.0
> Visual reference: [`docs/visual-identity.md`](visual-identity.md) is the source of truth for brand palette and voice. This plan applies that doc, doesn't replace it.

## Why we're doing this

The site has accreted SaaS-marketing patterns that contradict our own visual-identity doc. The footer is the worst offender (a giant red gradient block that reads as a second hero), but the same tension shows up in dark mode (cold blue-gray instead of warm charcoal), card shadows, and the absence of Manrope for headlines despite it being spec'd in the brand guide.

This is a quality bar pass, not a brand reinvention. Same colors, same voice, same content. Different visual rhythm.

---

## Current-state diagnosis

Read with [`src/components/layout/footer.tsx`](../src/components/layout/footer.tsx), [`tailwind.config.ts`](../tailwind.config.ts), [`src/styles/globals.css`](../src/styles/globals.css) open.

### The footer (top priority)

Three things are fighting:

1. **The gradient block is a second hero.** A 2rem-rounded `linear-gradient(135deg, #c0392b → #922b21 → #641e16)` panel takes the visual weight of an entire CTA section — at the bottom of every page. By the time someone scrolls there, they don't need another pitch.
2. **Asymmetric 1.15:0.85 split** + four h-14 white buttons + 3 chip pills + newsletter input + tagline + about button = the footer is doing five jobs at once. The right column gets the leftover real estate so it ends up cramped.
3. **It contradicts the brand doc.** [`docs/visual-identity.md`](visual-identity.md) explicitly says *"Forbidden: pastel gradients, SaaS purple"* and *"warm documentary photo realism, lived-in not staged."* The current footer is exactly the SaaS marketing aesthetic that doc rules out.

### Wider site

| Issue | Where | Why it matters |
|---|---|---|
| Dark-mode background `#0f1117` | `src/styles/globals.css` | Cold blue-gray. Brand doc explicitly forbids it. |
| Headlines use Inter (sans) | Globals + components | Brand doc spec'd Manrope 800 for headlines. Never wired up. |
| Heavy `shadow-lg` on cards | UI primitives | Modern editorial sites use lines, not shadows. |
| Body type at 14px in many places | Component defaults | Body should be 16-17px for editorial reading. |
| Big corner radii (24-32px) on hero panels | Various | Reads 2020 SaaS. Drop to 12-16px on big surfaces. |
| Card hover state is shadow-grow | Card primitive | Should be a small translate-y, not glow. |

---

## Design principles

Anchored to [`docs/visual-identity.md`](visual-identity.md) plus three additions from how modern editorial / community sites (Are.na, Read Tonic, The Browser, Linear's content surfaces) are landing right now.

1. **Editorial over SaaS.** Type does the work. Headlines are large and Manrope-bold. Eyebrows stay mono-uppercase. Body uses Inter at 16-17px with generous line-height.
2. **Restraint with the brand red.** Turkey Red is for accents — eyebrows, link hovers, single-line dividers, the occasional small badge. **No more big red blocks.** Hero photos and warm photographic textures replace gradients.
3. **Lines over shadows.** 1px borders at 8-12% opacity replace drop shadows on cards.
4. **Warmer dark mode.** Replace `#0f1117` (cold blue) with `#181410` or `#1a1612` (warm charcoal) per the brand doc's "no cold blue-gray" rule.
5. **Smaller corner radii on big surfaces.** 12-16px on cards. 8px on buttons. The 32px+ radii read dated.
6. **One CTA per surface.** The footer gets one ask, not two. The header gets one CTA, not two.

---

## Phase plan

Three PRs, not six, to avoid review fatigue.

### v1.14.0 — Foundation: footer + tokens + dark-mode warming

Single coherent release. The redesign reads as one moment, not three incremental tweaks.

#### Footer rewrite

New architecture, **5 horizontal bands, full-width, no gradient block**:

```
┌─────────────────────────────────────────────────────────────────┐
│  Newsletter band — "Get the Sunday letter"  [email]   [→]      │ ← 1 input, 1 button, mono eyebrow above
├─────────────────────────────────────────────────────────────────┤
│  Logo  │  Community │ Resources │ Connect │ Legal               │ ← 4-column nav grid
│ ─────── │            │           │         │                     │
│ tagline │  list      │  list     │  list   │  list               │
├─────────────────────────────────────────────────────────────────┤
│  ◐ Telegram  ◑ GitHub  ⌗ X/Twitter  ✉ Mail                      │ ← icon-only social row, restrained
├─────────────────────────────────────────────────────────────────┤
│  © 2026 Istanbul Digital Nomads · Made in Kadikoy · v1.13.1     │ ← subtle, mono, single line
└─────────────────────────────────────────────────────────────────┘
```

Concrete moves:

- **Kill the gradient red block entirely.** Replace with a hairline-bordered 4-column link grid + brand block on the left.
- **Newsletter goes above the link grid as its own thin band.** Full-width, calm, not screaming.
- **Telegram CTA moves to the header.** It's a primary action, doesn't belong at page-end.
- **Photographic accent**: a single low-opacity Wikimedia Commons photo (Kadikoy rooftops or ferry from the existing neighborhoods gallery) bleeds across the footer's background at ~8% opacity. Picks up the brand doc's "warm documentary realism" cue.
- **Typography**: section heads in mono uppercase eyebrow, links in Inter 14px regular, brand tagline in Inter 13px italic.
- **Mobile**: bands stack; nav grid becomes 2-col, then 1-col on narrow phones.
- **Files touched**: `src/components/layout/footer.tsx` (rewrite), `src/lib/constants.ts` (verify nav structure, maybe add a "Legal" group), `public/images/footer-accent.jpg` (new — pick from Wikimedia per brand doc rules).

#### Type system

- **Add Manrope** alongside Inter via `next/font/google` in `src/app/layout.tsx`. Expose as `--font-display`. Bundle ~15kb. Use weights 600, 700, 800.
- **Define a real type scale in `tailwind.config.ts`**:
  - Display: 56/64/72px (`text-display-sm/md/lg`)
  - Heading: 28/36/44px (`text-h1/h2/h3`)
  - Body: 16/17/18px (current default is 14px in many places — too small for editorial reading)
  - Eyebrow: 11/12px mono uppercase, already exists as `.eyebrow` utility
- **Apply Manrope to h1-h6** via base layer in `globals.css` so all guides + blog posts inherit it without component changes.
- **Files touched**: `src/app/layout.tsx`, `tailwind.config.ts`, `src/styles/globals.css`.

#### Dark-mode warming

- Replace dark-mode body bg `#0f1117` with `#14110f` (warm charcoal) — single CSS variable change.
- Replace dark card backgrounds (`rgba(44,62,80,0.08)`) with `rgba(60,40,30,0.6)` (warm tinted).
- Update `<meta name="theme-color">` for dark scheme accordingly.
- Add a tiny 2-3% noise SVG to the body background — subtle photographic feel, ~600 bytes inline.
- **Files touched**: `src/styles/globals.css`, `src/app/layout.tsx` (the meta tag).

#### Acceptance criteria for v1.14.0

- [ ] Footer renders without the gradient block
- [ ] Footer is exactly 4 visible bands (newsletter / nav / social / legal) on desktop, stacks cleanly on mobile
- [ ] All h1-h6 use Manrope (visible diff against any current page)
- [ ] Dark-mode body bg is warm charcoal, not cold blue (eyeball check)
- [ ] No regressions on `/relocation-agent` (the polish from v1.13.0 still reads correctly)
- [ ] All 70 existing tests still pass
- [ ] Lighthouse score on `/` doesn't regress more than 2 points (Manrope adds weight)

---

### v1.14.1 — Header + components (smaller PR, applies the new tokens)

#### Header refinements

- Move "Join on Telegram" CTA from footer up here (it belongs as a primary action).
- Reduce header height to a single 64px → 56px on-scroll wobble. Currently overcomplicated.
- Replace logo dropshadow with sharper mark on warmer background.
- Tighten nav link spacing (currently slack on desktop).

#### Card + component polish

- Drop card border-radius from `rounded-lg` (8px) on big cards to `rounded-md` (6px); keep buttons at 8px.
- Replace `shadow-lg` with `border border-black/8` + `dark:border-white/10` on cards.
- Hover state on cards: subtle 2px translate-y, not shadow grow.
- `Button` `secondary` variant: outline only, no fill.

#### Files touched

`src/components/layout/header.tsx`, `src/components/ui/card.tsx`, `src/components/ui/button.tsx`.

#### Acceptance criteria for v1.14.1

- [ ] Telegram CTA visible in header on desktop, gone from footer
- [ ] Card hover is translate-y, no shadow grow
- [ ] Button secondary variant is outline-only
- [ ] No regressions on /relocation-agent or /events (high-density card pages)

---

### v1.15.0 — Page-by-page sweep

After 1.14.x lands, do quick sweeps on:

- **Home** — apply new type scale, simplify hero, restrain the gradients
- **Guides hub + neighborhood pages** — they should look most editorial
- **Blog** — proper article typography (already mostly there)
- **Spaces** — list view tightening, reduce card density
- **Events** — calendar visual hierarchy
- **`/relocation-agent`** — already polished in v1.13.0; small token-level tweaks only

Single PR with screenshots per page in the description.

---

## Decisions locked in

The 5 design questions I raised in the proposal, now settled:

| Question | Decision | Rationale |
|---|---|---|
| Telegram CTA location | **Header** | Primary action, more discoverable. Footer gets quieter social icons row. |
| Newsletter placement | **Footer band only** (not site-wide / sticky) | Substack-style sticky bar is more aggressive than this brand wants right now. Can revisit later. |
| Photographic accent in footer | **Yes, ~8% opacity** | Direct application of brand doc's "warm documentary realism" guidance. |
| Manrope vs Inter for headlines | **Add Manrope, keep Inter for body** | Brand doc spec'd it. ~15kb cost is fine for the editorial weight gap. |
| Scope of v1.14.0 | **All of footer + type system + dark-mode warming in one PR** | Reads as one moment. Three small PRs would feel disjointed. |

---

## Out of scope for this redesign

To keep the work bounded:

- **Logo / wordmark redesign** — keep current marks. They're fine.
- **Color palette additions or changes** — Turkey Red, Slate, Amber, Green are locked.
- **Photography commissioning** — use existing Wikimedia Commons + Unsplash assets per `docs/visual-identity.md`. No new shoots.
- **Component library overhaul** — no swap to shadcn/ui. Keep the homegrown components.
- **Accessibility audit** — separate work track. Don't introduce regressions, but a full WCAG pass is its own project.
- **Mobile bottom-tab-bar redesign** — leave as is. Re-evaluate after v1.15.0.

---

## Risks and mitigations

| Risk | Likelihood | Mitigation |
|---|---|---|
| Adding Manrope blows up Lighthouse score | Low | `next/font/google` self-hosts and preloads. Verify before merge. Cap at 3 weights. |
| Dark-mode color change reveals hardcoded `#0f1117` references in components | Medium | Grep for the literal before merge, replace with the CSS variable. |
| Footer rewrite breaks `lib/constants.ts` `footerNav` consumers | Low | The structure stays the same shape; only the rendering changes. |
| Photographic accent feels heavy on a long results page | Medium | Cap opacity at 8%. A/B with `null` accent on staging before deciding. |
| `/relocation-agent` cards look weird with new card defaults | Medium | Test that page specifically before merging. Adjust card radius locally if needed. |

---

## Rollout

1. **Plan approval** — this doc → 1 reviewer signoff (you).
2. **v1.14.0 PR** — branch off develop. Foundation work in one cohesive PR. ~1 day of focused implementation.
3. **Visual review on Vercel preview** — eyeball the footer on home, blog, guides, relocation-agent. Fix anything that breaks.
4. **Merge → tag v1.14.0 → deploy.**
5. **v1.14.1 PR** — branches off updated main. Header + components. ~3 hours.
6. **v1.15.0 PR** — page-by-page sweep with screenshots. ~half a day.

Total estimate: ~2-3 days of focused work spread over a week, depending on review cadence.

---

## Open questions for the reviewer

Nothing blocking. Two non-blocking questions to flag:

1. **Footer photo choice.** I'd default to `public/images/neighborhoods/kadikoy/hero.jpg` (the ferry shot) at 8% opacity. Open to a different neighborhood's hero, or even rotating per page (each page picks the most relevant neighborhood). Latter is cuter but more work.
2. **Manrope weight ceiling.** I want 600 / 700 / 800. Brand doc only spec'd 800. Adding 600/700 gives flexibility for h2/h3 vs hero h1. ~5kb extra each. Acceptable?

If neither is a strong opinion, I'll go with the defaults (Kadikoy ferry, 600/700/800).
