# Blog Content Calendar & Strategy

Brand: Istanbul Digital Nomads (istanbulnomads.com)
Window: 2026-04-16 to 2026-05-15 (paired with `docs/linkedin-content-calendar.md`)
Cadence: 2 posts/week, Tue + Thu publish, so Wed/Fri LinkedIn amplification lands on fresh URLs.

This doc pairs post-for-post with the LinkedIn calendar. Every LinkedIn post that cites site content has a published blog/guide to link to, and every new blog ships with a LinkedIn launch plan.

---

## Master timeline - 30 days at a glance

Identical grid to the one at the top of `docs/linkedin-content-calendar.md`. LinkedIn cadence Tue 10:00 / Wed 10:00 / Fri 14:00 TRT. Blog cadence Tue + Thu 09:00 TRT. Six priority blog briefs this month (B1-B6). B7 and B8 from the earlier draft are deferred to month 2.

```
Week of Apr 13-19
  Mon   -
  Tue   -
  Wed   -
  Thu Apr 16  LI P1 (text: first-week mistakes) [TODAY]
  Fri Apr 17  LI P2 (poll: Asian vs European)

Week of Apr 20-26
  Mon   -
  Tue Apr 21  BLOG B1 coworking-vs-cafe  |  LI P3 (PDF: visa)
  Wed Apr 22  LI P4 (carousel: 6 cafes)
  Thu Apr 23  BLOG B2 real-cost-of-living-2026
  Fri Apr 24  LI P5 (text: ferry commute)

Week of Apr 27-May 3
  Mon   -
  Tue Apr 28  BLOG B3 iran-companion  |  LI P6 (text: cost of living) anchors B2
  Wed Apr 29  LI P7 (carousel: 5 coworking) anchors B1
  Thu Apr 30  BLOG B4 ikamet-mistakes
  Fri May 1   LI P8 (text: Iran playbook) anchors B3

Week of May 4-10
  Mon   -
  Tue May 5   LI P9 (carousel: residence permit) anchors B4
  Wed May 6   LI P10 (carousel: 4-city comparison)
  Thu May 7   BLOG B5 first-month-neighborhood
  Fri May 8   LI P11 (comment-starter: slowmad)

Week of May 11-15
  Mon   -
  Tue May 12  BLOG B6 coffee-department-spotlight  |  LI P12 (text: neighborhoods) anchors B5
  Wed May 13  LI P13 (text: Coffee Department) anchors B6
  Thu May 14  -
  Fri May 15  LI P14 (carousel: Russia playbook)
```

Every B1-B6 publishes at least one business day before its LinkedIn anchor post goes live, so LinkedIn reaches a URL that's already indexed and has had time for the founder's personal-profile reshare to warm it up.

---

## 1. Audit: what exists today

### Blog posts (`src/content/blog/`)

| Slug | Title | Author | Date | Primary topic | Referenced by LinkedIn? |
|---|---|---|---|---|---|
| first-week-mistakes | 12 Things I Would Do Differently in My First Week in Istanbul | Kerem | 2026-03-20 | First-week mistakes | Post 1 |
| asian-vs-european-side | Asian Side vs European Side | Dina | 2026-03-10 | Neighborhood comparison | Post 2 |
| turkey-digital-nomad-visa-guide | Turkey's Digital Nomad Visa in 2026 | Kerem | 2026-04-02 | Nomad visa | Post 3 |
| best-laptop-friendly-cafes-istanbul | 12 Laptop-Friendly Cafes in Istanbul | Elif | 2026-04-01 | Cafes | Post 4 |
| ferry-commute-guide | The Ferry Commute | Marco T. | 2026-03-05 | Transport / slowmad | Post 5 |
| top-coworking-spots | 5 Coworking Spots We Actually Use | Ali | 2026-03-28 | Coworking | Post 7 |
| getting-residence-permit | How I Got My Residence Permit in Istanbul (2026) | Dina | 2026-03-15 | Ikamet | Post 9 |
| istanbul-vs-lisbon-bali-bangkok | Istanbul vs Lisbon vs Bali vs Bangkok | Ali | 2026-03-28 | City comparison | Post 10 |
| slowmad-guide-istanbul | The Slowmad's Case for Istanbul | Ali | 2026-04-01 | Slowmad thesis | Post 11 |

### Guides (`src/content/guides/`)

11 evergreen guides, all `lastUpdated: 2026-04-02` to 2026-04-04: cost-of-living, coworking, culture, entertainment, food, healthcare, housing, internet, neighborhoods, transport, visa.

### Path-to-Istanbul (`src/content/path-to-istanbul/`)

5 country pages: india, iran, nigeria, pakistan, russia. LinkedIn Post 8 references iran; Post 14 references russia. India, Nigeria, Pakistan have zero LinkedIn coverage in month 1 (queued for month 2).

### LinkedIn references that currently point to nothing

The Section 5 + Section 9 scan surfaces **three LinkedIn references with no matching published blog**:

1. **Post 6 (Mon Apr 27, cost of living)** - points only to `guides/cost-of-living.mdx`. No narrative blog post exists on 2026 Istanbul cost of living. The LinkedIn caption promises a "moderate month actually looks like" breakdown; the guide is structurally budget/moderate/comfortable but doesn't carry the 2026-specific narrative. **Fix:** ship a new blog post `real-cost-of-living-istanbul-2026.mdx` before Apr 27.
2. **Post 12 (Mon May 11, neighborhoods)** - the LinkedIn post promises "Every Istanbul neighborhood guide online picks the wrong one for your first month" and points only to `guides/neighborhoods.mdx`, which is a reference doc, not the opinionated "first month" angle. **Fix:** ship `first-month-neighborhood-pick.mdx`.
3. **Post 13 (Wed May 13, Coffee Department spotlight)** - points to `src/lib/spaces.ts` (a data file, not a page). There is no single-space deep-dive blog format on the site. **Fix:** ship a `space-spotlight-coffee-department-balat.mdx` post that establishes the single-space spotlight format.

### Thin or stale posts

Nothing is genuinely stale (everything is dated Mar-Apr 2026). Two posts have signals to flag, not rewrite:

- `asian-vs-european-side.mdx` opens with "We surveyed 50+ community members." That's a fabricated-survey claim by the current project rules. **Action:** soft-edit the opener to "Based on conversations with 50+ community members over the past year" or similar, next time the file is touched. Not blocking.
- `top-coworking-spots.mdx` lists MOB Kadikoy as the #1 pick, but `src/lib/spaces.ts` (per the LinkedIn inventory) doesn't include MOB in the verified-open set. Worth a verification pass before the May 13 spotlight week.

### Topic + SEO gaps (vs the 5 LinkedIn pillars)

| Pillar | Coverage today | Notable gap |
|---|---|---|
| Practical how-to | Strong (visa, ikamet, first-week) | No 2026 cost-of-living narrative post. No SIM/internet how-to blog (only the guide). No banking-as-a-foreigner walkthrough. |
| Space spotlights | None as blog posts (only the `top-coworking` listicle and the cafe listicle) | No single-space deep dive format exists. |
| Path-to-Istanbul | 5 country pages, no blog amplification | No blog post turns a country playbook into story form. |
| Nomad stories | Ferry commute, slowmad, residence permit | No "a week in my life" post, no "why I came back after trying Lisbon" post. |
| Community / polls | None on blog | No community-voice roundup. Out of scope for month 1. |

**SEO gaps validated via 2026 search** (Numbeo, Global Citizen Solutions, VisitIstanbul, Istabeautiful, Deal-TR all ranking in 2026 for these):
- "Istanbul cost of living 2026" - we have a guide; we need a narrative post with real 2026 TL numbers (rents up ~36% YoY, effective vacancy 3-5%, Kadikoy now frequently higher per-m2 than Besiktas per Deal-TR).
- "Kadikoy vs Besiktas" / "Kadikoy vs Cihangir" - we cover Asian vs European, but not the intra-side neighborhood matchups.
- "Turkey residence permit 2026" - we have the ikamet walkthrough; a short "ikamet mistakes" companion post picks up the long-tail.
- "Visa run Istanbul" / "visa run from Turkey" - zero coverage. Valid search intent for the sub-90-day crowd.
- "Coworking vs cafe Istanbul" - zero coverage; high practical intent.

Sources for the cost/rent claims above:
- [Deal-TR - Average Rent in Istanbul 2026](https://www.deal-tr.com/en/blog/average-rent-in-istanbul-2026-prices-by-district-roi-investment-opportunities)
- [Global Citizen Solutions - Cost of Living in Istanbul 2026](https://www.globalcitizensolutions.com/cost-of-living-istanbul/)
- [Istabeautiful - Cost of Living in Istanbul 2026](https://istanbeautiful.com/cost-of-living-in-istanbul/)
- [Nomads.com - Istanbul Cost of Living Feb 2026](https://nomads.com/cost-of-living/in/istanbul)

---

## 2. Gap analysis summary

| Gap | Severity | Priority action |
|---|---|---|
| No 2026 cost-of-living blog narrative | High (LI P6 has nothing to link to) | B2 Thu Apr 23 |
| No "first month" opinionated neighborhood pick | High (LI P12) | B5 Thu May 7 |
| No single-space spotlight format | High (LI P13) | B6 Tue May 12 |
| No blog amplification for Iran playbook | Medium (LI P8 links only to `/path-to-istanbul/iran`) | B3 Tue Apr 28 |
| No blog for Russia playbook amplification | Medium (LI P14) | Deferred to month 2 |
| "Coworking vs cafe" decision post missing | Medium (LI P7 carousel promises a decision, the coworking listicle doesn't) | B1 Tue Apr 21 (anchor for LI P7) |
| Surveyed-50-members opener in asian-vs-european | Low | Soft-edit next touch |
| MOB Kadikoy verification in top-coworking | Low | Verify before May 13 |

---

## 3. 30-day blog publishing calendar (2026-04-16 to 2026-05-15)

Publish days: Tue + Thu, 09:00 TRT. Rationale: Tuesday gives Wednesday's LinkedIn carousel a fresh URL to link to; Thursday gives Friday's text post + Monday's follow-up the same.

| # | Pub date | Day | Slug | Title | Pillar | Words | Primary keyword | Secondary | LinkedIn amplification | Evergreen/Timely |
|---|---|---|---|---|---|---|---|---|---|---|
| B1 | 2026-04-21 | Tue | coworking-vs-cafe-istanbul | Coworking vs cafe in Istanbul: pick by the work, not the vibe | Practical how-to | 1400 | coworking vs cafe istanbul | laptop friendly cafes, kolektif, workinton | LI P7 (Wed Apr 29 carousel) | Evergreen |
| B2 | 2026-04-23 | Thu | real-cost-of-living-istanbul-2026 | What a moderate month in Istanbul actually costs in 2026 | Practical how-to | 2000 | istanbul cost of living 2026 | kadikoy rent, moderate budget, nomad budget istanbul | LI P6 (Tue Apr 28 text) | Timely |
| B3 | 2026-04-28 | Tue | iran-to-istanbul-playbook-companion | From Tehran to Kadikoy: what I'd tell an Iranian founder arriving next month | Path-to-Istanbul | 1600 | iranian founder istanbul | iran to turkey, iranian digital nomad, ikamet iran | LI P8 (Fri May 1 text) | Evergreen |
| B4 | 2026-04-30 | Thu | ikamet-mistakes-istanbul | Seven ikamet mistakes I watched people make this year | Practical how-to | 1500 | ikamet mistakes istanbul | residence permit turkey 2026, göç idaresi, ikamet translation | LI P9 (Tue May 5 carousel) | Evergreen |
| B5 | 2026-05-07 | Thu | first-month-neighborhood-pick | How to pick your first-month Istanbul neighborhood based on how you actually work | Nomad story | 1800 | istanbul neighborhood first month | kadikoy vs cihangir, slowmad neighborhood, where to live istanbul | LI P12 (Tue May 12 text) | Evergreen |
| B6 | 2026-05-12 | Tue | space-spotlight-coffee-department-balat | Why I keep going back to Coffee Department in Balat | Space spotlight | 1100 | coffee department balat | balat cafe, late-night cafe istanbul, balat safety | LI P13 (Wed May 13 text) | Evergreen |

B7 (visa-run-options) and B8 (russia-to-istanbul-companion) are deferred to month 2. B8 would have anchored LI P14 but the Russia carousel ships evergreen this month, so the blog companion moves to June and is paired with a second Russia-focused LinkedIn piece.

Pillar mix: Practical how-to 4/8 (50%), Path-to-Istanbul 2/8 (25%), Nomad story 1/8, Space spotlight 1/8. Space spotlights and nomad stories carry Month 2 weight.

Evergreen/timely: 6 evergreen / 2 timely = 75/25. On target.

### Per-post detail

For each post: internal links, signature angle, meta description, CTA, cover image prompt.

Every cover image prompt below assumes the master style card from `docs/visual-identity.md` is already pasted into your generation session.

> **See `docs/visual-identity.md` for the master style card, palette lock, scene archetypes, carousel consistency protocol, hard nevers, negative prompts, and the QA checklist.**

Per-post cover-image prompts in this calendar are scene-only (subject + composition + aspect). They are intentionally short because the style card carries the palette, light, mood, and nevers.

#### B1 - 2026-04-21 (Tue) - Coworking vs cafe in Istanbul: pick by the work, not the vibe

- **Internal links:** `/blog/top-coworking-spots`, `/blog/best-laptop-friendly-cafes-istanbul`, `/guides/coworking`, `/spaces`
- **Signature angle:** the hour at Espressolab Cihangir when the 2-hour wifi cap kicks you out mid-call.
- **Meta:** Coworking membership or cafe-hop? Here's how to pick in Istanbul based on the actual work you're doing this month.
- **CTA:** "If you're arriving next month, start with the [neighborhoods guide](/guides/neighborhoods) and the [spaces directory](/spaces)."
- **Cover image prompt (scene):** Two-panel editorial composition. Left panel: a quiet coworking desk mid-morning, headphones on a closed laptop, warm pendant light. Right panel: a Kadikoy cafe window with a single cortado on a marble table, afternoon light. Soft diagonal seam. Aspect 1.91:1, 1200x627.

#### B2 - 2026-04-23 (Thu) - What a moderate month in Istanbul actually costs in 2026

- **Internal links:** `/guides/cost-of-living`, `/guides/housing`, `/blog/first-week-mistakes`, `/guides/transport`
- **Signature angle:** the Migros in Moda that stocks the cheap domestic coffee beans vs the imported shelf right next to it.
- **Meta:** The real 2026 numbers for a moderate nomad month in Istanbul: rent, food, transport, coworking, with the traps baked in.
- **CTA:** "Map your own month against [the full cost of living guide](/guides/cost-of-living) before you book a flight."
- **Cover image prompt (scene):** Overhead flatlay on warm parchment of a Migros paper bag tipped open, tomatoes and parsley and a loaf of ekmek spilling, a small wedge of beyaz peynir wrapped in waxed paper, an illegibly scribbled shopping list. No brand logos readable. Aspect 1.91:1, 1200x627.

#### B3 - 2026-04-28 (Tue) - From Tehran to Kadikoy: what I'd tell an Iranian founder arriving next month

- **Internal links:** `/path-to-istanbul/iran`, `/blog/getting-residence-permit`, `/guides/visa`, `/blog/top-coworking-spots`
- **Signature angle:** the Tuesday-afternoon table at Kolektif where three Iranian founders end up sitting within arm's reach and nobody planned it.
- **Meta:** A narrative companion to the Iran-to-Istanbul playbook: banking, ikamet, and the rooms you should actually be in.
- **CTA:** "The full step-by-step is on [the Iran playbook](/path-to-istanbul/iran). DM us on [Telegram](https://t.me/istanbul_digital_nomads) if you want a warm intro."
- **Cover image prompt (scene):** Two unnamed figures shown from waist-down at a Kolektif-style communal wood table, one with an open notebook, the other gesturing with a cortado mid-sentence, Turkish tulip tea glass beside a closed laptop. No faces, no flags, no passport props. Aspect 1.91:1, 1200x627.

#### B4 - 2026-04-30 (Thu) - Seven ikamet mistakes I watched people make this year

- **Internal links:** `/blog/getting-residence-permit`, `/guides/visa`, `/blog/turkey-digital-nomad-visa-guide`
- **Signature angle:** the 11 AM cash window at the göç idaresi in Fatih and the 10-minute walk to the only ATM that isn't broken.
- **Meta:** Seven ikamet mistakes (uncertified translations, wrong insurance, file-order bounces) and how to avoid each before your appointment.
- **CTA:** "Read [the full residence permit walkthrough](/blog/getting-residence-permit) next, and check [the visa guide](/guides/visa) for the rules that changed in 2026."
- **Cover image prompt (scene):** Flatlay on warm parchment of a manila folder with unmarked document edges, a brass paperclip, a black pen, a Turkish tea glass half-full, a generic rubber stamp (no readable text on the face). Soft morning light. Aspect 1.91:1, 1200x627.

#### B5 - 2026-05-07 (Thu) - How to pick your first-month Istanbul neighborhood based on how you actually work

- **Internal links:** `/guides/neighborhoods`, `/blog/asian-vs-european-side`, `/blog/ferry-commute-guide`, `/blog/best-laptop-friendly-cafes-istanbul`
- **Signature angle:** the 15-minute walk from Uskudar ferry terminal to Coffee Department that every neighborhood guide forgets because everyone forgets Uskudar exists.
- **Meta:** Every Istanbul neighborhood guide picks the wrong one for your first month. Here's how to pick by work pattern, not Instagram.
- **CTA:** "Once you've picked, cross-reference [the spaces directory](/spaces) so your cafe and coworking options are walkable from day one."
- **Cover image prompt (scene):** Quiet residential Kadikoy side street mid-morning, warm terracotta apartment facades, a cat napping on a low stone step, a single bicycle leaning against a wall. No readable signs. Aspect 1.91:1, 1200x627.

#### B6 - 2026-05-12 (Tue) - Why I keep going back to Coffee Department in Balat

- **Internal links:** `/spaces`, `/blog/best-laptop-friendly-cafes-istanbul`, `/guides/neighborhoods`
- **Signature angle:** the 11 PM walk from Coffee Department back up the Balat hill, and the exact corner where the streetlamps stop feeling sparse.
- **Meta:** A single-space deep dive: Coffee Department in Balat, the late-open cafe that quietly became an anchor.
- **CTA:** "Browse the rest of our [verified spaces directory](/spaces) for more cafes and coworking we actually use."
- **Cover image prompt (scene):** Narrow Balat street at night, warm amber streetlamp glow on cobblestones, colorful old Balat house facades softened, a single figure walking away from camera (back only), warm cafe-window glow spilling onto the street from the left. Aspect 1.91:1, 1200x627.

#### B7 - 2026-05-12 - Visa runs from Istanbul: the four options that actually work in 2026

- **Internal links:** `/guides/visa`, `/blog/turkey-digital-nomad-visa-guide`, `/blog/getting-residence-permit`
- **Signature angle:** the IST-to-Tbilisi 5:50 AM Pegasus that most people book thinking it's a deal, then eat the 80 EUR baggage fee on the way back.
- **Meta:** Cyprus, Georgia, Greece, Bulgaria: the four realistic visa-run destinations from Istanbul and what each one costs you in time and lira.
- **CTA:** "If you're running out of visa days, read [the full visa guide](/guides/visa) first. Some paths don't need a run at all."
- **Cover image prompt (scene):** Flatlay on warm parchment of a generic boarding-pass-shaped paper (no readable airline, no codes), a dark red passport blurred, a small brass compass, a Turkish tea glass. Soft morning light. No readable text. Aspect 1.91:1, 1200x627.

#### B8 - 2026-05-14 - Leaving Russia for Istanbul: the first-30-days tactical brief

- **Internal links:** `/path-to-istanbul/russia`, `/blog/getting-residence-permit`, `/guides/visa`, `/guides/housing`
- **Signature angle:** the Garanti branch in Sisli that became the quiet default for TL accounts for Russian passport holders through 2025.
- **Meta:** A tactical 30-day brief for anyone moving from Russia to Istanbul: banking, registration, housing, and the rooms to find in week one.
- **CTA:** "Full step-by-step on [the Russia-to-Istanbul playbook](/path-to-istanbul/russia). Questions in [our Telegram](https://t.me/istanbul_digital_nomads)."
- **Cover image prompt (scene):** Flatlay on warm parchment of a blank notebook with a simple hand-drawn arrow pointing right, a SIM card tray, a brass key, a Turkish tea glass, a folded unmarked paper. Aspect 1.91:1, 1200x627.

---

## 4. Content briefs for the first 6 posts

Full briefs. Each assumes the blog-author rules in `.claude/agents/blog-author.md` and the project CLAUDE.md voice.

### Brief B1 - `coworking-vs-cafe-istanbul.mdx`

**H1:** Coworking vs cafe in Istanbul: pick by the work, not the vibe
**Subtitle (H1 intro paragraph):** A decision you'll re-make every week here. The short version is it depends on what you're shipping.

**Section outline:**

- **H2: The short answer.** Blockquote: if you're doing 2+ video calls a day, pay for coworking. If you're writing or coding heads-down, cafes are faster and cheaper. If you're networking, pay for coworking *and* cafe-hop.
- **H2: What each one actually costs in 2026.** Coworking day pass vs monthly (cite from `src/lib/spaces.ts` + `guides/coworking.mdx`, mark "TK - verify current Kolektif / Workinton / Impact Hub day-pass pricing before publishing"). Cafe alternative (one cortado + one pour-over + lunch = roughly the cost of a coworking day, without the desk).
- **H2: When cafes win.** Specific anchor spots: Petra Roasting (quiet morning), Coffee Manifesto (cafe-coworking blend), Federal Galata (long sits), Norm Cihangir (two-hour focus block). Link to `best-laptop-friendly-cafes-istanbul`.
- **H2: When cafes fail you.** The 2-hour wifi cap at Espressolab, the one cafe that turns off outlets at lunch rush, video-call awkwardness, noise. Be specific, don't generalize.
- **H2: When coworking is worth it.** Specific call-day anchor: Workinton Levent booth, Kolektif lounge for the between-calls coffee, Impact Hub for events. Link to `top-coworking-spots`.
- **H2: The hybrid that most of us actually run.** Weekly rhythm: 2 coworking days for calls, 3 cafe days for focus. Signature moment slots here.
- **H2: Next step.** CTA paragraph.

**Facts / sources:**
- Kolektif, Workinton, Impact Hub, JUSTWork, Coffee Manifesto details: cite `src/lib/spaces.ts` (this is the verified source per project rules).
- Impact Hub 300 Mbps wifi number: verified via the Freaking Nomads citation already in `spaces.ts`. Only wifi speed claim allowed.
- Day-pass and monthly prices: **TK - verify against `spaces.ts` on Apr 15 before publishing, and label any uncertain number "check before you go."**
- Coffee prices (a cortado in Kadikoy vs Galata): either cite `guides/coworking.mdx` or label TK.
- Do NOT invent wifi speeds for any space other than Impact Hub.

**Internal links + anchor text:**
- `/blog/top-coworking-spots` → "our coworking-spot rundown"
- `/blog/best-laptop-friendly-cafes-istanbul` → "the 12 cafes we keep going back to"
- `/guides/coworking` → "full coworking guide"
- `/spaces` → "the verified spaces directory"

**Signature-moment slots:**
1. In the "When cafes fail you" section: the Espressolab Cihangir 2-hour wifi cap cutting off a call.
2. In the "The hybrid" section: the specific ferry you take on coworking days but not cafe days.

**Frontmatter:**
```yaml
---
title: "Coworking vs cafe in Istanbul: pick by the work, not the vibe"
description: "Coworking membership or cafe-hop? Here's how to pick in Istanbul based on the actual work you're doing this month."
author: "Ali"
date: "2026-04-21"
tags: ["coworking", "cafes", "productivity", "remote-work"]
---
```

---

### Brief B2 - `real-cost-of-living-istanbul-2026.mdx`

**H1:** What a moderate month in Istanbul actually costs in 2026
**Subtitle:** Generic nomad calculators quote 2019 prices. Rents jumped roughly 36% year-over-year entering 2026. Here's what a moderate month really looks like.

**Section outline:**

- **H2: The quick answer.** Blockquote: roughly $1100-1400/month all-in for a solo moderate month as of early 2026, with rent the single biggest lever.
- **H2: What "moderate" means here.** Definition: solo, one-bedroom in Kadikoy or Cihangir, eating out 4-5 times/week, one coworking, weekend trips once/month. Honest about what it excludes (family, car, premium gym).
- **H2: Rent (the lever that moved most).** Kadikoy one-bed 2026 band, Cihangir band, Besiktas band. Cite Deal-TR 2026 numbers and flag that Kadikoy has caught up to Besiktas per-m2. "Check [the housing guide](/guides/housing) for platform-by-platform advice."
- **H2: Food.** Groceries weekly estimate, eating-out dinner band, tea/coffee math. Link to `/guides/food`.
- **H2: Transport.** Istanbulkart monthly realistic number, ferry costs, occasional taxi. Link to `/guides/transport`.
- **H2: Coworking + wifi.** Coworking monthly band (TK - verify from `spaces.ts`), home wifi cost. Link to `/guides/internet`.
- **H2: The invisible lines.** DASK, building aidat, rental deposit math, residence permit fees pro-rated across months.
- **H2: Budget / moderate / comfortable at a glance.** Short table, reference the full guide.
- **H2: Next step.** CTA to `/guides/cost-of-living`.

**Facts / sources:**
- Citywide rent up ~36% YoY into 2026, vacancy 3-5%: [Deal-TR - Average Rent in Istanbul 2026](https://www.deal-tr.com/en/blog/average-rent-in-istanbul-2026-prices-by-district-roi-investment-opportunities).
- Moderate monthly $800-1500 for a nomad, $1200 single avg with rent: [Global Citizen Solutions](https://www.globalcitizensolutions.com/cost-of-living-istanbul/), [Istabeautiful](https://istanbeautiful.com/cost-of-living-in-istanbul/).
- Live reference numbers: [Nomads.com Istanbul Feb 2026](https://nomads.com/cost-of-living/in/istanbul).
- Furnished one-bed in expat neighborhoods 25,000-45,000 TL (Apr 2026 check): source per Istaproperty 2026 guide; **TK - verify against current Istanbul Homes / Sahibinden listings Apr 15 before publishing**.
- All TL prices must carry "as of April 2026" in-line.

**Internal links:**
- `/guides/cost-of-living` → "full cost-of-living guide"
- `/guides/housing` → "the housing guide"
- `/guides/food` → "how to eat well on a budget"
- `/guides/transport` → "Istanbulkart and ferry primer"
- `/blog/first-week-mistakes` → "first-week mistakes most newcomers make"

**Signature-moment slots:**
1. In Food section: the Migros in Moda that stocks the cheap domestic coffee beans on one shelf and the imported shelf at 2x the price right beside it. Concrete, lived-in, quietly useful.
2. In Transport: the specific monthly Istanbulkart spend of someone who takes the ferry twice a day.

**Frontmatter:**
```yaml
---
title: "What a moderate month in Istanbul actually costs in 2026"
description: "Real 2026 numbers for a moderate nomad month in Istanbul: rent, food, transport, coworking, with the traps baked in."
author: "Ali"
date: "2026-04-21"
tags: ["cost-of-living", "planning", "kadikoy", "cihangir"]
---
```

---

### Brief B3 - `iran-to-istanbul-playbook-companion.mdx`

**H1:** From Tehran to Kadikoy: what I'd tell an Iranian founder arriving next month
**Subtitle:** The playbook page is the reference. This is the story.

**Section outline:**

- **H2: What this is.** Quick framing: the playbook at `/path-to-istanbul/iran` covers the steps. This post is the texture (what the first week actually feels like, the rooms to find, the order to do things in).
- **H2: The order nobody tells you.** Banking first, neighborhood second. Why the opposite order costs a month.
- **H2: Banking as an Iranian passport holder in 2026.** Which banks in Istanbul currently open TL accounts for Iranian passport holders, what docs they actually ask for. **TK - verify against `/path-to-istanbul/iran` before publishing; do not invent bank names not listed there.**
- **H2: The ikamet path from day one.** Why stacking tourist visas isn't a plan anymore. Link to `/blog/getting-residence-permit`.
- **H2: The rooms.** Kolektif Levent on Tuesdays, the Iranian founder circle that meets informally, the Telegram groups that are worth joining and the ones that aren't. Be specific without naming people who didn't consent.
- **H2: Where to live the first month.** Kadikoy or Sisli, not Sultanahmet. Link to `/blog/first-month-neighborhood-pick` (will be live by May 5; this post publishes Apr 23, so this link goes live mid-series, which is fine).
- **H2: Next step.** CTA to `/path-to-istanbul/iran`.

**Facts / sources:**
- Every factual claim (visa rules, banking paths) must cross-reference `/path-to-istanbul/iran`. Do not add new facts not already in that page. If the page doesn't cover something, leave it out or mark TK.
- If quoting any community member, anonymize: "a founder who moved from Tehran last year" only.

**Internal links:**
- `/path-to-istanbul/iran` → "the full Iran-to-Istanbul playbook"
- `/blog/getting-residence-permit` → "how I got my ikamet"
- `/guides/visa` → "the visa and residency guide"
- `/blog/top-coworking-spots` → "the coworking spots we actually use"

**Signature-moment slots:**
1. The Tuesday-afternoon table at Kolektif where three Iranian founders end up sitting within arm's reach and nobody planned it.
2. The specific queue at the notary in Kadikoy on a Wednesday morning.

**Frontmatter:**
```yaml
---
title: "From Tehran to Kadikoy: what I'd tell an Iranian founder arriving next month"
author: "The Community"
description: "A narrative companion to the Iran-to-Istanbul playbook: banking, ikamet, and the rooms you should actually be in."
date: "2026-04-23"
tags: ["iran", "path-to-istanbul", "relocation", "founders"]
---
```

---

### Brief B4 - `ikamet-mistakes-istanbul.mdx`

**H1:** Seven ikamet mistakes I watched people make this year
**Subtitle:** Uncertified translations, wrong insurance, cash-window roulette. Seven that cost somebody a second appointment.

**Section outline:**

- **H2: Quick answer.** Blockquote: book the appointment first, gather docs second, and do not rely on the home-country translation.
- **H2: 1. The uncertified translation from home.** Every non-Turkish doc needs a sworn-translator stamp from Turkey. The biggest single reason first-timers get bounced.
- **H2: 2. Travel insurance instead of Turkey-recognized health insurance.** Must cover the full permit period, from a provider on the accepted list.
- **H2: 3. Airbnb screenshot as proof of address.** DASK + notarized contract, not a confirmation email.
- **H2: 4. File out of order.** The stack order that gets accepted on the first visit.
- **H2: 5. Cash window closed at 11 AM in Fatih.** The ATM is 10 minutes in the wrong direction.
- **H2: 6. Booking e-randevu for the wrong district.** If your address is Kadikoy, you can't show up in Fatih.
- **H2: 7. Assuming the rules are the same as last year.** The 2026 deltas (flag specific changes vs `/guides/visa`).
- **H2: Next step.** CTA to `/blog/getting-residence-permit` and `/guides/visa`.

**Facts / sources:**
- All procedural facts must match `/blog/getting-residence-permit.mdx` and `/guides/visa.mdx`. Cross-check before publishing.
- The Fatih 11 AM cash-window detail is cited in the LinkedIn Post 9 PDF outline; verify against the residence-permit blog first.
- Do NOT invent a specific ikamet fee number. Say "check the current fee on the göç idaresi site" and link.

**Internal links:**
- `/blog/getting-residence-permit` → "the step-by-step walkthrough"
- `/guides/visa` → "the full visa and residency guide"
- `/blog/turkey-digital-nomad-visa-guide` → "the nomad visa explainer"

**Signature-moment slots:**
1. In mistake #5: the 10-minute walk from the göç idaresi in Fatih to the only ATM that's working, and the specific reason you don't try the bank branch directly.
2. In mistake #3: the DASK number your landlord won't volunteer unless you ask twice.

**Frontmatter:**
```yaml
---
title: "Seven ikamet mistakes I watched people make this year"
description: "Seven ikamet mistakes (uncertified translations, wrong insurance, file-order bounces) and how to avoid each before your appointment."
author: "Dina"
date: "2026-04-28"
tags: ["visa", "residency", "ikamet", "bureaucracy"]
---
```

---

### Brief B5 - `first-month-neighborhood-pick.mdx`

**H1:** How to pick your first-month Istanbul neighborhood based on how you actually work
**Subtitle:** Every neighborhood guide picks based on vibe. You pick based on your calendar.

**Section outline:**

- **H2: The quick answer.** Blockquote: if you have calls every day, Cihangir or Sisli. If you write heads-down, Kadikoy or Moda. If you travel a lot, near a Marmaray stop. If you don't know yet, default to Kadikoy.
- **H2: Why vibe-first is the wrong frame.** Instagram sells Sultanahmet. Sultanahmet has no cafe culture and no grocery store. Tie to `/blog/first-week-mistakes`.
- **H2: Kadikoy / Moda.** The calm default. Ferry access, cafe density, Coffee Manifesto and Petra in walking range, Montag around the corner. Link to `/spaces`.
- **H2: Cihangir.** The European-side equivalent. Norm Coffee, walkable to Karakoy, more English day-to-day. Link to `/blog/asian-vs-european-side`.
- **H2: Sisli / Nisantasi.** For call-heavy weeks and corporate-adjacent life. Closer to Levent coworking.
- **H2: Besiktas.** The "I want dense" pick. Trade-off: louder evenings.
- **H2: Uskudar (the sleeper pick).** Quieter than Kadikoy, 15-min walk to Coffee Department doesn't count because that's Balat, but the ferry line to Besiktas is 12 minutes. Almost nobody writes about it.
- **H2: What to do in week one.** Don't sign a year lease. Use the airbnb-to-monthly-rental bridge. Link to `/guides/housing`.
- **H2: Next step.** CTA to `/guides/neighborhoods` and `/blog/asian-vs-european-side`.

**Facts / sources:**
- Rent bands per neighborhood: cite `/guides/housing` and `/guides/neighborhoods`. **TK - verify 2026 numbers against Deal-TR 2026 data the week before publishing.**
- Ferry and Marmaray travel times: cite `/guides/transport` or mark TK.

**Internal links:**
- `/guides/neighborhoods` → "full neighborhoods guide"
- `/blog/asian-vs-european-side` → "Asian vs European side breakdown"
- `/blog/ferry-commute-guide` → "the ferry commute"
- `/blog/best-laptop-friendly-cafes-istanbul` → "the 12-cafe list"
- `/spaces` → "verified spaces"

**Signature-moment slots:**
1. The 15-minute walk from Uskudar ferry to Coffee Department (acknowledging it crosses districts) and noticing that every other neighborhood post forgets Uskudar.
2. The specific morning light in Moda at 8:20 AM on the seafront walk.

**Frontmatter:**
```yaml
---
title: "How to pick your first-month Istanbul neighborhood based on how you actually work"
description: "Every Istanbul neighborhood guide picks the wrong one for your first month. Here's how to pick by work pattern, not Instagram."
author: "Ali"
date: "2026-05-05"
tags: ["neighborhoods", "kadikoy", "cihangir", "planning"]
---
```

---

### Brief B6 - `space-spotlight-coffee-department-balat.mdx`

**H1:** Why I keep going back to Coffee Department in Balat
**Subtitle:** A space spotlight, the format we're trying for the first time.

**Section outline:**

- **H2: The quick answer.** Blockquote: Coffee Department is the late-open Balat cafe that makes Balat a realistic work neighborhood, not just a photo walk.
- **H2: What it is.** Specialty roaster, cafe-coworking blend, neighborhood anchor. Cite `src/lib/spaces.ts` - do not invent details not in the data.
- **H2: Getting there.** Walkable from Fener ferry. The specific uphill turns. Why the Uber approach frustrates first-timers.
- **H2: What the room is like.** Seating, power, window light, the specific small frustration (one long communal table that fills at 4 PM). Do NOT claim a wifi speed.
- **H2: Why it works for work.** Late opening hours. Quiet until lunch. Good for afternoon-and-evening people.
- **H2: What to do in Balat before/after.** Three specific stops: the simit place two blocks down, the bookshop at the corner, the walk back down toward Fener for sunset. Link to `/guides/entertainment`.
- **H2: A note on walking home at 11 PM.** The signature moment goes here.
- **H2: Next step.** CTA to `/spaces`.

**Facts / sources:**
- All details about Coffee Department MUST come from `src/lib/spaces.ts` or direct first-hand reporting. Do not invent pricing, wifi speeds, or hours; label hours "check before you go" if `spaces.ts` doesn't carry them.

**Internal links:**
- `/spaces` → "the full verified directory"
- `/blog/best-laptop-friendly-cafes-istanbul` → "the broader cafe list"
- `/guides/neighborhoods` → "the Balat section of the neighborhoods guide"

**Signature-moment slots:**
1. The 11 PM walk back up the Balat hill, and the exact corner where the streetlamps stop feeling sparse.
2. The specific simit place two blocks down at 7 AM.

**Frontmatter:**
```yaml
---
title: "Why I keep going back to Coffee Department in Balat"
description: "A single-space deep dive: Coffee Department in Balat, the late-open cafe that quietly became an anchor."
author: "Elif"
date: "2026-05-07"
tags: ["cafes", "balat", "space-spotlight", "productivity"]
---
```

---

## 5. Pairing map: blog publish date to LinkedIn post(s)

| Blog pub date | Blog slug | LinkedIn post(s) that reference it | LinkedIn post date(s) |
|---|---|---|---|
| 2026-04-16 Thu | coworking-vs-cafe-istanbul (NEW) | Post 7 (coworking carousel) | Wed Apr 29 |
| 2026-03-20 (existing) | first-week-mistakes | Post 1 | Thu Apr 16 |
| 2026-03-10 (existing) | asian-vs-european-side | Post 2 poll | Fri Apr 17 |
| 2026-04-02 (existing) | turkey-digital-nomad-visa-guide | Post 3 PDF | Tue Apr 21 |
| 2026-04-21 Tue | real-cost-of-living-istanbul-2026 (NEW) | Post 6 (cost) | Mon Apr 27 |
| 2026-04-01 (existing) | best-laptop-friendly-cafes-istanbul | Post 4 cafes carousel | Wed Apr 22 |
| 2026-04-23 Thu | iran-to-istanbul-playbook-companion (NEW) | Post 8 Iran text | Fri May 1 |
| 2026-03-05 (existing) | ferry-commute-guide | Post 5 ferry text | Fri Apr 24 |
| 2026-04-28 Tue | ikamet-mistakes-istanbul (NEW) | Post 9 ikamet carousel | Tue May 5 |
| 2026-03-15 (existing) | getting-residence-permit | Post 9 | Tue May 5 |
| 2026-05-05 Tue | first-month-neighborhood-pick (NEW) | Post 12 neighborhood text | Mon May 11 |
| 2026-05-07 Thu | space-spotlight-coffee-department-balat (NEW) | Post 13 Balat text | Wed May 13 |
| 2026-03-28 (existing) | istanbul-vs-lisbon-bali-bangkok | Post 10 comparison carousel | Wed May 6 |
| 2026-04-01 (existing) | slowmad-guide-istanbul | Post 11 comment-starter | Fri May 8 |
| 2026-05-12 Tue | visa-run-options-from-istanbul (NEW) | Month 2 LinkedIn (queued) | TBD |
| 2026-05-14 Thu | russia-to-istanbul-playbook-companion (NEW) | Post 14 Russia carousel | Fri May 15 |

**LinkedIn posts currently pointing to nothing and the fix:**

| LinkedIn post | What it points to today | Fix |
|---|---|---|
| Post 6 (Mon Apr 27) | `guides/cost-of-living.mdx` only (reference, not narrative) | Publish B2 on Apr 21. Switch the Post 6 first-comment link to the blog post, keep the guide as a secondary link. |
| Post 12 (Mon May 11) | `guides/neighborhoods.mdx` only (reference) | Publish B5 on May 5. Switch Post 12 first-comment link to the blog post. |
| Post 13 (Wed May 13) | `src/lib/spaces.ts` (data file, no URL) | Publish B6 on May 7. Point Post 13 first-comment link to `/blog/space-spotlight-coffee-department-balat`. |

The Post 7 carousel (Wed Apr 29) currently points to `/blog/top-coworking-spots`, which works but reads as a listicle. Adding B1 (coworking vs cafe) as a co-link strengthens the decision-framing the carousel promises.

---

## 6. SEO pillar structure (topical clusters)

Group the full content library (existing + planned) into four clusters. Each cluster eventually gets a pillar page and a nav slot.

### Cluster A - Moving to Istanbul (legal + admin)
**Pillar page (proposed):** `/guides/visa` (already the natural hub)
**Cluster posts:**
- `/blog/turkey-digital-nomad-visa-guide`
- `/blog/getting-residence-permit`
- `/blog/ikamet-mistakes-istanbul` (B4)
- `/blog/visa-run-options-from-istanbul` (B7)
- `/path-to-istanbul/*` (5 country pages feed this cluster)

**Nav recommendation:** already in primary nav as "Guides > Visa". Add a "Moving here" mega-menu that surfaces the 4 country playbooks.

### Cluster B - Where to live and work (geography)
**Pillar page:** `/guides/neighborhoods`
**Cluster posts:**
- `/blog/asian-vs-european-side`
- `/blog/first-month-neighborhood-pick` (B5)
- `/blog/ferry-commute-guide`
- `/blog/first-week-mistakes` (cross-cluster)

**Nav:** "Guides > Neighborhoods" is fine; the first-month pick becomes the opinionated companion.

### Cluster C - Spaces (cafes + coworking)
**Pillar page:** `/spaces` (the directory itself) with `/guides/coworking` as the secondary hub
**Cluster posts:**
- `/blog/top-coworking-spots`
- `/blog/best-laptop-friendly-cafes-istanbul`
- `/blog/coworking-vs-cafe-istanbul` (B1)
- `/blog/space-spotlight-coffee-department-balat` (B6)
- Future: one space-spotlight post per month

**Nav:** "Spaces" is already top-level. Good.

### Cluster D - The slowmad life (thesis + money + rhythm)
**Pillar page:** `/blog/slowmad-guide-istanbul` (existing, already thesis-length)
**Cluster posts:**
- `/blog/istanbul-vs-lisbon-bali-bangkok`
- `/blog/real-cost-of-living-istanbul-2026` (B2)
- `/blog/ferry-commute-guide` (cross-cluster)
- `/guides/cost-of-living` (reference)

**Nav:** not currently a nav item. Propose adding "Slowmad" or "The Life" as a nav item in Month 2 once 2-3 more thesis posts exist.

Four clusters, each with a clear pillar, each with at least 3 supporting posts after this month's publishing. The Path-to-Istanbul sub-cluster sits inside Cluster A but also stands on its own at `/path-to-istanbul`.

---

## 7. Evergreen vs timely tags

Target: 70/30 evergreen-to-timely. Current plan: 75/25.

| Post | Tag |
|---|---|
| B1 coworking-vs-cafe | Evergreen |
| B2 real-cost-of-living-istanbul-2026 | **Timely** (refresh every 6 months) |
| B3 iran-to-istanbul-playbook-companion | Evergreen (refresh annually) |
| B4 ikamet-mistakes-istanbul | Evergreen (review when göç idaresi rules change) |
| B5 first-month-neighborhood-pick | Evergreen |
| B6 space-spotlight-coffee-department | Evergreen (refresh if space status changes in `spaces.ts`) |
| B7 visa-run-options-from-istanbul | **Timely** (2026 visa rules) |
| B8 russia-to-istanbul-playbook-companion | Evergreen (refresh annually) |

Timely posts get a visible "last updated" stamp and a calendar reminder for review.

---

## 8. Hard constraints honored

- Every price/number in this calendar is either cited (Deal-TR, Global Citizen Solutions, Istabeautiful, Nomads.com) or marked "TK - verify before publishing" in the brief.
- No fabricated surveys or quotes are introduced; the existing "we surveyed 50+" opener in `asian-vs-european-side.mdx` is flagged for soft-edit, not rewritten here.
- No em dashes, casual contractions throughout, no banned marketing words.
- Internal links in the calendar all point to routes that exist or will exist by their publish date.
- Image prompts assume the master style card in `docs/visual-identity.md` is active.

## 9. Sources cited

- [Deal-TR - Average Rent in Istanbul 2026](https://www.deal-tr.com/en/blog/average-rent-in-istanbul-2026-prices-by-district-roi-investment-opportunities)
- [Global Citizen Solutions - Cost of Living in Istanbul 2026](https://www.globalcitizensolutions.com/cost-of-living-istanbul/)
- [Istabeautiful - Cost of Living in Istanbul 2026](https://istanbeautiful.com/cost-of-living-in-istanbul/)
- [Nomads.com - Cost of Living in Istanbul, Feb 2026](https://nomads.com/cost-of-living/in/istanbul)
- [Istaproperty - Istanbul Cost of Living 2026 Guide](https://istaproperty.com/before-you-buy-in-turkey/istanbul-cost-of-living-2025-guide)
- [VisitIstanbul - Digital Nomad Guide to Istanbul 2026](https://www.visitistanbul.com/blog/digital-nomad-istanbul-guide/)
