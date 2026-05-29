# Content Calendar System

A multi-language content production system for istanbulnomads.com. This doc ties together what we already have - the blog/LinkedIn calendars, the per-locale MDX content, the i18n tooling, and the specialist agents - into one repeatable pipeline.

It doesn't replace the existing strategy docs. It sits on top of them and says: here's how a piece of content goes from idea to published-in-five-languages, who does each step, and how we tell what's done.

**Scope.** Three channels (LinkedIn, Instagram, Blog), five locales (en/tr/fa/ar/ru). English lives at the root URL, the other four are path-prefixed (`/fa/...`, `/tr/...`). Persian (fa) and Arabic (ar) are RTL.

**The hard rules (from `CLAUDE.md`), restated because they govern every example below:**

- No em dashes. Regular dashes only.
- Casual contractions in user-facing copy: don't, isn't, you'll, we've. Exception: table headers and formal labels.
- Helpful-local-friend voice. No marketing fluff (seamless, leverage, world-class, etc.).
- Never fabricate prices, stats, quotes, or surveys. Every number is sourced, lifted from `src/lib/spaces.ts`, or labeled "check before you go."

---

## 1. Content architecture

We're not starting from zero. There's a real content library and two published calendars already. The job here is to map each channel's pillars onto what exists so it's obvious what's already covered vs what's net-new.

### What exists today

- **Blog:** 16 posts, fully translated across all 5 locales. Source of truth `src/content/blog/en/`. See the slug list in `docs/blog-content-calendar.md` Section 1.
- **Guides:** 11 evergreen guides (`src/content/guides/en/`): cost-of-living, coworking, culture, entertainment, food, healthcare, housing, internet, neighborhoods, transport, visa. All 5 locales.
- **Path-to-Istanbul:** 5 country playbooks (`src/content/path-to-istanbul/en/`): india, iran, nigeria, pakistan, russia. All 5 locales.
- **Verified spaces:** `src/lib/spaces.ts` - 18 open spaces with cited sources. The only place we're allowed to pull cafe/coworking facts from. Only Impact Hub has a verified wifi number (300 Mbps). Never claim a speed for any other space.
- **Calendars:** `docs/blog-content-calendar.md` (B1-B8 briefs, SEO clusters, pairing map) and `docs/linkedin-content-calendar.md` (P1-P14 drafts, format evidence, weekly rhythm).

Run `pnpm i18n:status` for the live coverage matrix. As of this writing every category reads 100% across all 5 locales.

### LinkedIn pillars

The LinkedIn calendar already defines 5 weighted pillars (`docs/linkedin-content-calendar.md` Section 2). The brief asks for a wider pillar set. Here's the mapping - most of the requested pillars fold into the 5 that already drive the calendar.

| Pillar (brief) | Maps to | Source collections / docs | New or covered? |
|---|---|---|---|
| Founder stories | Nomad life stories | `blog/en/slowmad-guide-istanbul`, `path-to-istanbul/*` | Covered (P11 comment-starter) |
| Nomad stories | Nomad life stories | `blog/en/ferry-commute-guide`, `blog/en/getting-residence-permit` | Covered (P5, P9) |
| City insights | Practical how-to | `guides/en/*`, `blog/en/asian-vs-european-side` | Covered (P2, P6, P12) |
| Startup content | Path-to-Istanbul | `path-to-istanbul/en/{iran,russia}` | Covered (P8, P14) |
| Community growth | Community / polls | `src/lib/faq.ts` themes, poll formats | Covered (P2 poll, P11) |
| Lessons learned | Practical how-to | `blog/en/first-week-mistakes`, `blog/en/ikamet-mistakes-istanbul` | Covered (P1, P9) |
| Remote work insights | Space spotlights + how-to | `blog/en/coworking-vs-cafe-istanbul`, `blog/en/top-coworking-spots`, `spaces.ts` | Covered (P4, P7, P13) |

So the brief's 7 LinkedIn pillars don't need a new strategy. They're facets of the existing 5. The honest gap: there's no dedicated "founder story" long-form blog post yet (the slowmad post is thesis, not biography). That's the one net-new LinkedIn-adjacent slot worth a brief in month 2.

### Instagram pillars (net-new channel)

There's no Instagram calendar in the repo yet. This is the one genuinely new channel. Instagram doesn't have its own content collection - it's a distribution surface that repackages blog/guides/spaces content, same as LinkedIn does. So no new `src/content/` folder. Map the pillars to existing source material:

| Pillar (brief) | Source material | Format note | New or covered? |
|---|---|---|---|
| Reels | `blog/en/ferry-commute-guide`, `spaces.ts` (a space walk-through) | 15-30s vertical, one scene per reel | New format, existing content |
| Carousels | `blog/en/first-week-mistakes`, `guides/en/visa` | Reuse the LinkedIn carousel scripts almost 1:1 | New surface, reuse LI carousels |
| Community highlights | Telegram / community quotes (consented only) | UGC reshare, no fabricated quotes | New, needs consent process |
| Guides | `guides/en/*` (any of the 11) | Carousel or single-image with caption | New surface, existing content |
| Lifestyle | `blog/en/slowmad-guide-istanbul`, ferry/neighborhood posts | Single photo + caption | New, existing content |
| Memes | none (no source collection) | Original, must still honor voice rules | Net-new content type |
| UGC | Community submissions | Reshare with credit + consent | New, needs consent process |

Instagram is a month-2+ build. The practical move: every blog carousel we design for LinkedIn (4:5, 1080x1350 per the LI calendar image prompts) is already Instagram-shaped. Ship the carousel once, post both places. The only Instagram-original work is memes and reels, and those still go through `blog-author` for caption voice and the no-fabrication check.

### Blog pillars

The blog calendar (`docs/blog-content-calendar.md`) already organizes everything into 4 SEO clusters. Map the brief's blog pillars onto those clusters:

| Pillar (brief) | SEO cluster (blog calendar Section 6) | Example existing slugs | New or covered? |
|---|---|---|---|
| SEO articles | All four clusters | every blog post is SEO-structured | Covered |
| City guides | Cluster B - Where to live and work | `guides/en/neighborhoods`, `blog/en/asian-vs-european-side` | Covered |
| Productivity | Cluster C - Spaces | `blog/en/coworking-vs-cafe-istanbul` | Covered |
| Coffee spaces | Cluster C - Spaces | `blog/en/best-laptop-friendly-cafes-istanbul`, `blog/en/espressolab-istanbul-remote-work` | Covered |
| Remote work tips | Cluster C + Cluster D (slowmad) | `blog/en/istanbul-remote-work-setup`, `blog/en/slowmad-guide-istanbul` | Covered |
| Local experiences | Cluster B + spotlights | `blog/en/ferry-commute-guide` | Covered (spotlight format established) |

Blog pillars are fully covered by the existing library and the four-cluster SEO structure. Net-new blog work is incremental (one space-spotlight per month, the missing founder-story format), not a re-architecture.

**Bottom line on architecture:** Blog and LinkedIn are mature - the pillars map cleanly onto existing collections and calendars. Instagram is the only channel that needs a new calendar, and even then it mostly repackages content we already produce for the other two.

---

## 2. Multilingual generation flow

One dispatch model, same for every piece. English is always authored first and is the editorial truth. The other locales are native rewrites of that source, not literal translations.

```
                 ┌─────────────────────────────────────────────┐
                 │  1. ENGLISH SOURCE                            │
                 │  blog-author writes src/content/<cat>/en/...  │
                 │  Full MDX, frontmatter, cross-links, sources  │
                 └───────────────────────┬─────────────────────┘
                                         │
                 ┌───────────────────────▼─────────────────────┐
                 │  2. SEED STUBS                                │
                 │  pnpm i18n:stub <locale> <cat> <slug>         │
                 │  copies en/ source into each locale folder    │
                 └───────────────────────┬─────────────────────┘
                                         │
        ┌──────────────┬─────────────────┼─────────────────┬──────────────┐
        ▼              ▼                 ▼                 ▼              ▼
   nomad-fa-editor nomad-tr-editor  nomad-ar-editor   nomad-ru-editor  (en: done)
   PRIMARY         PRIMARY          secondary          secondary
   native rewrite  native rewrite   native rewrite     native rewrite
        │              │                 │                 │
        └──────────────┴────────┬────────┴─────────────────┘
                                ▼
                 ┌─────────────────────────────────────────────┐
                 │  4. pnpm format  (prettier, CI gate)          │
                 │  5. pnpm type-check && pnpm build             │
                 └───────────────────────┬─────────────────────┘
                                         ▼
                 ┌─────────────────────────────────────────────┐
                 │  6. PUBLISH                                   │
                 └─────────────────────────────────────────────┘
```

### Step detail

1. **English source.** Author with the `blog-author` agent (`.claude/agents/blog-author.md`). It writes a complete MDX file under `src/content/<category>/en/<slug>.mdx`, follows the brief's structure (hook, quick answer, body, next step, no conclusion section), cross-links into guides/spaces/blog, and runs its own no-fabrication self-audit. For LinkedIn/Instagram repackaging of an existing post, skip to the `linkedin-marketer` agent instead - it transforms published site content into channel-native formats.

2. **Seed stubs.** `pnpm i18n:stub <locale> [<category>] [<slug>]` (`scripts/i18n-content.ts`). Copies the English source into `src/content/<category>/<locale>/<slug>.mdx` and prepends a TODO marker. It never overwrites an existing file, so re-running only fills gaps. Examples:

   ```
   pnpm i18n:stub fa blog ferry-commute-guide   # one Persian stub
   pnpm i18n:stub tr blog                        # every missing TR blog post
   pnpm i18n:stub ar                             # every missing AR file, all categories
   ```

3. **Route to the locale editor.** Each locale has a native-fluent editor agent. These already exist - do not create new content sub-agents.

   | Locale | Agent | Tier | Direction (RTL?) |
   |---|---|---|---|
   | fa | `nomad-fa-editor` | Primary | RTL |
   | tr | `nomad-tr-editor` | Primary | LTR |
   | ar | `nomad-ar-editor` | Secondary | RTL |
   | ru | `nomad-ru-editor` | Secondary | LTR |

   The editor opens the stub, reads the English source, and **rewrites it natively** - translating title/description/keywords, keeping `author`/`date`/`tags` slugs/`coverImage` untouched (per the frontmatter table in `docs/i18n/content-workflow.md`), preserving every heading, list, table, and cross-link, then removing the TODO marker. It also updates `docs/i18n/<locale>-keywords.md` with any new keywords. The fa editor's full playbook (ZWNJ, Persian punctuation, register) is in `.claude/agents/nomad-fa-editor.md`.

4. **Format.** `pnpm format`. The CI Lint job runs `prettier --check` and fails the PR on any unformatted `.ts`/`.tsx`/`.css`/`.json`. Bulk and hand edits routinely need this pass. Then `pnpm type-check && pnpm build` to confirm the MDX still compiles.

5. **Publish** once the build is green.

### Primary vs secondary

- **Primary: English, Persian, Turkish.** These get the most editorial attention and ship first. Persian especially - see Section 5.
- **Secondary: Arabic, Russian.** Same flow, same agents, same quality bar. They're "secondary" only in sequencing priority, not in standards. Arabic shares Persian's RTL concerns; route any RTL layout flags from `nomad-ar-editor` to the same dev fix queue as fa.

### Two gotchas baked into the tooling

- **Stub TODO comment syntax.** `pnpm i18n:stub` prepends an HTML comment (`<!-- TODO ... -->`). MDX rejects HTML comments with a parse error - `docs/i18n/content-workflow.md` is explicit that body comments must use `{/* ... */}`. The translated files in the repo correctly use `{/* TODO FA verify: ... */}` (e.g. `blog/fa/turkey-digital-nomad-visa-guide.mdx`), so the editors are clearly fixing this by hand. Until the script is fixed, the first thing every editor must do on a fresh stub is delete or convert that HTML comment before running `pnpm build`. (Flagged for a follow-up fix.)
- **`pnpm` toolchain.** On a Node-20 default with the corepack pnpm shim, `pnpm i18n:status` can fail with a syntax error before the script runs. The script itself is fine - it runs clean under Node 22 (`node --experimental-strip-types scripts/i18n-content.ts status`). If `pnpm` throws, that's an environment issue, not the script.

---

## 3. Monthly calendar + weekly pipeline

The existing calendars cover 2026-04-16 to 2026-05-15. This extends the cadence into the next window, **starting 2026-05-25**. It keeps the proven rhythm from `docs/linkedin-content-calendar.md` Section 4 and `docs/blog-content-calendar.md`: blog Tue + Thu 09:00 TRT, LinkedIn Tue/Wed/Fri, so amplification always lands on a URL that's already live.

The difference this window: every blog piece now triggers the full 5-locale pipeline, and Instagram comes online reusing LinkedIn carousels.

### Weekly pipeline (the repeating unit)

| Day | Channel | Action | Owner |
|---|---|---|---|
| Mon | Blog | Brief + outline for the week's Tue/Thu posts; English draft started | blog-author |
| Tue | Blog | English post publishes 09:00 TRT; `pnpm i18n:stub` seeds fa/tr stubs same day | blog-author + tooling |
| Tue | LinkedIn | How-to / practical post 10:00 TRT (anchors a live blog URL) | linkedin-marketer |
| Wed | LinkedIn + IG | Carousel 10:00 TRT; same carousel cross-posts to Instagram | linkedin-marketer |
| Wed | i18n | fa + tr editors rewrite Tuesday's stubs | nomad-fa/tr-editor |
| Thu | Blog | Second English post publishes; stubs seeded | blog-author + tooling |
| Thu | i18n | ar + ru editors pick up the week's stubs (secondary) | nomad-ar/ru-editor |
| Fri | LinkedIn | Country playbook / comparison / comment-starter 14:00 TRT | linkedin-marketer |
| Fri | i18n | `pnpm format` + `pnpm build`; merge translated locales | dev |
| Sat/Sun | - | No posting (weekends are dead per the LI evidence) | - |

### Monthly grid - window starting 2026-05-25

Two new blog briefs this window (C1, C2), plus translation catch-up and the Instagram on-ramp. No Monday posts, matching the existing convention.

```
Week of May 25-31
  Mon May 25  Brief C1 (founder-story format) outline
  Tue May 26  BLOG C1 publish (en) + stub fa/tr   | LI: how-to (city insights)
  Wed May 27  LI carousel + IG cross-post          | fa/tr rewrite C1
  Thu May 28  i18n catch-up (ar/ru on C1)          | LI -
  Fri May 29  LI Friday slot                        | format + build + merge

Week of Jun 1-7
  Tue Jun 2   BLOG C2 (space spotlight) publish (en) + stub | LI: practical
  Wed Jun 3   LI carousel + IG cross-post           | fa/tr rewrite C2
  Thu Jun 4   i18n catch-up (ar/ru on C2)           | LI -
  Fri Jun 5   LI country playbook                    | format + build + merge

Week of Jun 8-14
  Tue Jun 9   (no new blog) republish/refresh sweep | LI: nomad story
  Wed Jun 10  IG-original reel (ferry / a space walk)| audit pass begins (Section 5)
  Thu Jun 11  -                                      | -
  Fri Jun 12  LI comment-starter                     | Persian audit review

Week of Jun 15-21
  Tue Jun 16  BLOG C3 (TBD from gap scan) (en)+stub | LI: practical how-to
  Wed Jun 17  LI carousel + IG cross-post           | fa/tr rewrite C3
  Thu Jun 18  i18n catch-up                          | -
  Fri Jun 19  LI Friday slot                          | format + build + merge
```

Pillar mix target carries over from the LI calendar: roughly 30% practical how-to, 20% space spotlights, 20% nomad stories, 15% path-to-Istanbul, 15% community. Evergreen/timely stays at 70/30.

### Cadence notes

- Two new blog briefs per month is sustainable when every post also fans out to 5 locales. Don't over-commit the English pipeline - the translation tail is where the work compounds.
- Instagram in this window is cross-posts of LinkedIn carousels plus one original reel. The reel still goes through `blog-author` for caption voice.
- The Jun 8-14 week is deliberately light on net-new English so the Persian audit pass (Section 5) gets real room.

---

## 4. Content status workflow

Six states. Each one maps to something you can actually check, and the translation states key directly to `pnpm i18n:status` output.

| State | What it means | How you verify it |
|---|---|---|
| **idea** | A topic exists (in a calendar, a gap scan, or a brief). No file yet. | Listed in a calendar doc; no `en/<slug>.mdx` on disk |
| **drafted** | English MDX exists and passed the blog-author self-audit. | `src/content/<cat>/en/<slug>.mdx` exists; `pnpm i18n:status` shows `✓` under `en` |
| **translating** | Stubs seeded into locale folders, editors not done. | `pnpm i18n:status` shows `✓` under a locale, but the file still carries a TODO marker. Check with `grep -rn "TODO" src/content/<cat>/<locale>/` |
| **editor-audit** | A locale editor has rewritten the file; awaiting native QA review. | TODO markers removed; file reviewed against the agent's checklist (`.claude/agents/nomad-<locale>-editor.md`) |
| **formatted** | `pnpm format` clean, `pnpm type-check && pnpm build` green. | CI Lint job passes; local build succeeds |
| **published** | Live on the site. | Page resolves at `/<locale>/<cat>/<slug>` without the "translation in progress" fallback banner |

### Reading `i18n:status`

`pnpm i18n:status [category]` prints a matrix. `✓` = a per-locale file exists; `.` = missing (page falls back to English with a banner). It tells you presence, not quality - a `✓` can still be a raw stub in the **translating** state, which is why the status check above also greps for TODO markers.

```
[blog] 16 posts
slug                                 en   tr   fa   ar   ru
--------------------------------------------------------------
asian-vs-european-side               ✓    ✓    ✓    ✓    ✓
...
coverage                             100% 100% 100% 100% 100%
```

A row that's `✓` under `en` only = **drafted**. A row that's `✓` across the board with no TODO markers and a green build = **published**. The transition from "file exists" to "actually translated" is the editor-audit gate, which the matrix alone can't see.

**Machine-readable status.** For a dashboard or a CI gate, the script also accepts `pnpm i18n:status [category] --json`, which emits the same coverage data as JSON (`{category, total, rows[], coverage{}}`) instead of the text grid. Useful for wiring a "what's still in `translating`" check into the weekly pipeline without parsing padded columns.

---

## 5. Persian quality-improvement plan

Persian isn't net-new. All 16 blog posts, 11 guides, and 5 playbooks already exist in `src/content/**/fa/` and read well - the ferry post opens with correct ZWNJ (`نمی‌گوید`, `می‌کنی`), Persian punctuation, and TL prices kept intact. So the Persian track is **audit-and-improve**, not translate-from-scratch. The pass below routes entirely through `nomad-fa-editor` (`.claude/agents/nomad-fa-editor.md`) and references the rules in `docs/i18n/content-workflow.md` and `docs/i18n/fa-keywords.md`.

### The audit pass, file by file

For each `src/content/<cat>/fa/<slug>.mdx`, `nomad-fa-editor` runs its standard edit order against the live file (not a fresh stub):

1. **ZWNJ (نیم‌فاصله) sweep.** The single most-violated rule. Search the file for `می` and `نمی` followed by a verb with no `‌` (ZWNJ) and fix every one. Same for plural `ها` after non-joining letters (`کتاب‌ها` not `کتابها`) and compounds (`بی‌نظیر`, `نیم‌فاصله`). This pass alone usually touches every paragraph.
2. **Punctuation.** Replace any lingering Latin punctuation with Persian equivalents: `،` not `,`, `؟` not `?`, `؛` not `;`, `«گیومه»` not straight quotes. (A spot-check of `blog/fa/ferry-commute-guide.mdx` already shows Persian commas in use, so this is verification more than rewrite - but check every file.)
3. **Letter forms.** Persian `ی` not Arabic `ي`; Persian `ک` not Arabic `ك`. Easy to miss in pasted text.
4. **Native flow (avoid translation-feel).** This is the heart of "improve." Read each paragraph and ask: does this sound like a Tehran copy chief wrote it, or like English run through a translator? Rewrite calques. Keep the warm-modern register (تو for blog/personal posts, شما for guides - and stay consistent within a file). Strip Persian marketing fluff (`بی‌نظیر`, `خارق‌العاده`, `می‌باشد` where `است` is natural).
5. **No fabrication.** Persian must carry the same numbers as the English source. Where a fact needs locale-specific verification, the file uses the correct MDX comment form `{/* TODO FA verify: ... */}` (not HTML comments). Two such markers already exist and should stay until verified:
   - `blog/fa/turkey-digital-nomad-visa-guide.mdx:35` - Iran isn't on Turkey's digital-nomad-visa eligibility list; flags that Iranian readers need the alternative path.
   - `blog/fa/getting-residence-permit.mdx:16` - entry-visa / e-visa specifics for Iranian passport holders in 2026 need confirmation with the Turkish consulate.

   Don't resolve these by inventing an answer. Either verify against an authoritative source or leave the marker.
6. **RTL flags.** Where Persian prose contains inline English (URLs, emails, a Latin brand name), wrap in `<bdi>` so it isolates correctly. The editor flags any CSS direction issues (`ml-*`/`mr-*`) for a dev rather than fixing CSS itself.
7. **SEO + keywords.** Confirm the Persian `title` (~55-60 chars), `description` (140-155 chars, value-first not "در این مقاله"), and `keywords` match real Iranian search terms. Append anything new to `docs/i18n/fa-keywords.md`.

### Place-name consistency

`nomad-fa-editor` recommends modern transliterations: Kadıköy → کادیکوی, Üsküdar → اسکودار, Beşiktaş → بشیکتاش. Pick one spelling per place and hold it across all fa files. Audit for drift (e.g. کادیکوی vs قاضی‌کوی) and reconcile against `docs/i18n/fa-keywords.md`.

### Sequencing the pass

Do it during the deliberately-light Jun 8-14 week (Section 3). One agent run per category is the natural unit:

| Batch | Files | Priority |
|---|---|---|
| 1 | `blog/fa/*` (16) | Highest - most traffic, two open TODO markers live here |
| 2 | `guides/fa/*` (11) | High - evergreen, high search intent |
| 3 | `path-to-istanbul/fa/*` (5) | High for the Iranian-diaspora audience specifically |

After each batch: remove resolved TODO markers, run `pnpm format` and `pnpm build`, and report RTL/CSS flags to the dev queue. Don't bundle all three batches into one giant diff - per-category keeps review honest and matches how the editors already work (the only shared file is `docs/i18n/fa-keywords.md`, rarely contended within one locale).

### A note the agent file is missing

`.claude/agents/nomad-fa-editor.md` references `docs/i18n/fa-editor-playbook.md`, which doesn't exist in the repo. Not blocking - the agent's own file plus `docs/i18n/content-workflow.md` carry the full playbook - but worth either creating that file or fixing the dead reference so the agent doesn't waste a read on it.
