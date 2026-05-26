# Agent 5 - Circles redesign progress

Status of the Circles v2 work. What's wired up, what's documented for later, and
the decisions behind it.

## Checklist

- [x] Research doc grounded in real nomad-community patterns -
  `docs/agents/CirclesResearch.md`
- [x] Migration `031_circles_v2.sql` - additive on top of 013
- [x] `Circle` interface extended additively (`category`, optional `badges`)
- [x] `circleCategories` + helpers (`getCirclesByCategory`,
  `getCirclesGroupedByCategory`, `getCategoryMeta`)
- [x] New circles added (only ones with a justified need)
- [x] Reusable `CircleCategorySection` component
- [x] Category-grouped discovery view on `/circles`
- [x] Detail page + home strip made safe for circles without translations yet
- [ ] Translations for the new circles (en/tr/fa/ar/ru) - documented, not done
- [ ] Participation scoring job - documented, not done
- [ ] Matching / recommendation engine - documented, not done
- [ ] Moderation system - documented, not done
- [ ] Onboarding integration - documented, not done

## What's implemented (in this worktree)

- **`src/lib/circles.ts`** - kept all six original circles and their slugs,
  names, accents. Added `CircleCategory`, `CircleCategoryMeta`,
  `circleCategories`, a `category` field on every circle, optional `badges`,
  and the new circles from the research. Accents reuse the existing
  `CircleAccent` palette (no new theme colors), so the Tailwind class maps on
  the pages stay valid. Helpers group/filter by category.
- **`supabase/migrations/031_circles_v2.sql`** - `circle_categories`,
  `circles`, `circle_badges`, `circle_activity`, a `participation_score`
  column on `circle_members`, and a `circle_participation` view. Public-read
  RLS on catalog tables, member-scoped on activity. Seeds the five groups.
  Idempotent, nullable/defaulted, "not applied yet" header.
- **`src/components/sections/circles/circle-category-section.tsx`** - reusable
  group section (eyebrow + blurb + card grid) in the existing card design.
- **`/circles` page** - now renders circles grouped by category. A `copyFor`
  resolver uses translations for the six and falls back to the static `Circle`
  fields for newer circles, so nothing breaks before translations land.
- **Detail page + home strip** - same translation-or-fallback pattern. The
  home strip stays a six-card teaser (filters to circles that have translated
  copy); the full catalog lives on `/circles`.

## Architecture decisions

- **Static file stays the source of truth.** `src/lib/circles.ts` is canonical;
  migration 031's `circles` table is for runtime data + a future admin and
  never overrides a slug/name/accent. This matches the existing comment in
  the file and keeps the app working with zero DB dependency.
- **Additive over 013, never destructive.** 031 doesn't touch
  `circle_members`' shape - it only adds a defaulted `participation_score`
  column. `circle_activity.member_id` references `members(id)` exactly like
  013's tables. New tables follow 013's style (create-if-not-exists, RLS +
  public-read where public, `idx_*`, header comment, "not applied yet" note).
- **Two-layer participation signal.** `circle_activity` is the raw log;
  `circle_participation` (view) computes counts live; `participation_score`
  (column) is a cache for hot reads, recomputed on a schedule. Nullable/
  defaulted so existing rows are fine.
- **Reused the accent palette.** Adding `CircleAccent` members would mean new
  Tailwind colors + new entries in the `ACCENT_RING`/`ACCENT_TEXT` maps on two
  pages. Cycling the existing six accents keeps the change additive and the
  literal class maps complete.
- **Translation-or-fallback resolver** instead of forcing translation keys for
  every new circle. New circles render from their static English copy until
  translations are added, so the build never breaks on a missing key.

## No fabricated data

No member counts, "X active", or invented stats anywhere. Any participation
copy must read from `circle_members` / `circle_activity` once 031 is applied.

## Follow-ups (documented, not built)

### Translations
Add `names` / `blurbs` / `descriptions` / `rhythms` keys for the new circle
slugs in all five message files. Slugs:
`developers, designers, product, ai-builders, fitness, running, coffee,
meditation, accountability, language-exchange, startup-builders,
weekend-explorers, food-lovers, new-in-istanbul, looking-for-friends,
travel-partners`. Until then the fallback shows the static English copy.

### Participation scoring
- Log to `circle_activity` on posts/RSVPs/attendance/hosting (`kind`).
- Cron rolls `circle_participation` into `circle_members.participation_score`.
- Suggested stub:
  ```ts
  // src/lib/circles-participation.ts (not created yet)
  export interface ParticipationSignal {
    circleSlug: string;
    memberId: string;
    activityCount: number;
    lastActivityAt: string | null;
  }
  export function scoreFromSignal(s: ParticipationSignal): number;
  ```

### Matching / recommendation engine
Recommend circles from a member's profile (`activity_interests`, `hobbies`,
`looking_for`, `professional_role`, `member_type`) mapped to category +
circle slug. Start rules-based, no ML. Surface on onboarding + profile.

### Moderation
`circle_activity` already gives a participation trail. Add a report flow and a
per-circle moderator role (likely a `circle_moderators` table in a later
migration) before opening circles to member-created threads.

### Onboarding integration
After onboarding, suggest 2-3 circles from the matching engine and let the
member opt in (writes `circle_members`). Don't auto-join. Keep it a soft
step, not a gate - the existing "join the thread" model still applies.
