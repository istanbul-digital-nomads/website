# External Links SEO Audit

**Date:** 2026-04-16
**Scope:** `src/content/**`, `src/components/**`, `src/app/**`, `src/lib/**`
**Type:** Reconnaissance only. No code changes were made.

---

## 1. Executive Summary

We found roughly **170 external links** across the codebase. The breakdown:

- **MDX content (blog + guides + path-to-istanbul):** ~94 outbound links
- **`src/lib/spaces.ts` source arrays:** 67 URLs (currently unused, no consumer renders `space.sources`)
- **`src/lib/spaces.ts` `website` fields:** 7 official-website URLs (rendered via `space-card.tsx`)
- **TSX inline anchors (header, footer, page CTAs, contact, local-guides):** ~20 links, all to own-brand or user-supplied socials

**Good news:** every TSX inline `<a>` already sets `target="_blank" rel="noopener noreferrer"` (verified across `app/`, `components/sections/`, `components/layout/`). The MDX `a` component (`src/components/ui/mdx-components.tsx:49-58`) auto-injects the same on any `http`-prefixed href, so MDX content inherits it.

**Top 5 issues to fix this week:**

1. `src/lib/spaces.ts` declares ~67 source URLs (Tripadvisor, Yelp, Foursquare, Yandex, Wanderlog, RestaurantGuru, etc.) that are never rendered. Either ship a Sources UI (and decide rel policy) or strip them from the type to stop bloating the JS bundle.
2. Heavy reliance on Google Maps search-style links (`maps.google.com/?q=...`) - 36+ instances across guides. These are low-quality and don't deep-link to verified places. Replace with proper Place IDs or an internal Spaces page link.
3. The `Hepsiemlak.com` link in `housing.mdx:32` and `path-to-istanbul/india.mdx:122` (and 3 sibling files) uses anchor text `Hepsiemlak.com` and `Hepsiemlak` interchangeably - duplicate destination, inconsistent anchor text.
4. `hfrfly.com/en` in `transport.mdx:110` (Havaist bus) looks like a typo for `hava.ist` or `hvistanbul.com`. Suspicious URL, please verify.
5. No `<ExternalLink>` component or build-time linter exists; future TSX inline anchors will silently regress the rel/target policy.

---

## 2. Policy Reminder

| Category | Recommended `rel` | Notes |
|---|---|---|
| `authority` (gov, .europa.eu, Wikipedia) | `noopener noreferrer` | Preserve trust signal, no `nofollow` |
| `directory` (Google Maps, OpenStreetMap, Coworker, Workfrom) | `noopener noreferrer` | Same |
| `news-media` (TimeOut, Sprudge, Time) | `noopener noreferrer` | Same |
| `social` - own brand (`/istanbulnomads`, `t.me/istanbul_digital_nomads`) | `noopener noreferrer` | Treat as canonical brand |
| `social` - third-party (user-submitted guide socials) | `noopener noreferrer` | Add `nofollow` only if low quality |
| `tool-utility` (Wise, SafetyWing, Turkcell) | `noopener noreferrer` | Flag for `sponsored` if affiliate added |
| `partner-potential` (SIM, banking, coworking memberships, schools) | `noopener noreferrer` | Same as above, monitor for conversion |
| `low-value` (aggregators, sketchy domains, content farms) | `nofollow noopener noreferrer` or remove | Don't pass equity |

---

## 3. Findings Table

### 3a. MDX content (auto-rel via `mdx-components.tsx:49-58`)

| File | Line | Domain | Anchor text | Category | Current rel | Recommended rel | Action |
|---|---|---|---|---|---|---|---|
| `src/content/guides/food.mdx` | 69-85, 124-125 | `maps.google.com` (x9) | "Map" | directory | `noopener noreferrer` | same | Generic "Map" anchor; consider linking to internal `/spaces` entries when available |
| `src/content/guides/transport.mdx` | 58 | `sehirhatlari.istanbul` | `sehirhatlari.istanbul` | authority (city ferry agency) | `noopener noreferrer` | same | Bare-URL anchor text; could be more descriptive ("Sehir Hatlari ferry schedules") |
| `src/content/guides/transport.mdx` | 80 | `bitaksi.com` | "BiTaksi" | tool-utility | `noopener noreferrer` | same; flag affiliate | Repeated 3x across MDX with same anchor - OK |
| `src/content/guides/transport.mdx` | 86 | `uber.com` | "Uber" | tool-utility | `noopener noreferrer` | same | OK |
| `src/content/guides/transport.mdx` | 110 | `hfrfly.com` | `hfrfly.com/en` | low-value (suspicious) | `noopener noreferrer` | verify or remove | Suspicious domain - Havaist's real site is `hava.ist`. Check before shipping |
| `src/content/guides/coworking.mdx` | 21-91 | `maps.google.com` (x10), `kolektifhouse.co`, `workinton.com`, `mob.ist`, `istanbul.impacthub.net`, `justwork.com.tr` | various | directory + tool-utility | `noopener noreferrer` | same; flag partner-potential | Coworking websites are partner-potential - flag for affiliate |
| `src/content/guides/coworking.mdx` | 111-132 | `maps.google.com` (x12) | "Map" | directory | `noopener noreferrer` | same | Repetitive "Map" anchors |
| `src/content/guides/coworking.mdx` | 136 | `fast.com` | "fast.com" | tool-utility | `noopener noreferrer` | same | OK |
| `src/content/guides/neighborhoods.mdx` | 26-78 | `maps.google.com` (x6) | various | directory | `noopener noreferrer` | same | OK |
| `src/content/guides/neighborhoods.mdx` | 110 | `flatio.com` | "Flatio" | partner-potential | `noopener noreferrer` | same; flag affiliate | Has affiliate program |
| `src/content/guides/neighborhoods.mdx` | 112 | `t.me/istanbul_digital_nomads` | "Telegram group" | social (own brand) | `noopener noreferrer` | same | OK; appears 14+ times across MDX, consistent anchor |
| `src/content/guides/neighborhoods.mdx` | 114-115 | `sahibinden.com`, `hepsiemlak.com` | "Sahibinden.com", "Hepsiemlak.com" | directory | `noopener noreferrer` | same | Duplicate of housing.mdx, inconsistent anchor text |
| `src/content/guides/neighborhoods.mdx` | 116 | `facebook.com/groups/` | "Facebook groups" | low-value (generic search URL) | `noopener noreferrer` | `nofollow noopener noreferrer` | Doesn't deep-link, recommend rewriting or removing |
| `src/content/guides/culture.mdx` | 93 | `duolingo.com` | "Duolingo" | tool-utility | `noopener noreferrer` | same | OK |
| `src/content/guides/culture.mdx` | 94 | `turkishclass101.com` | "TurkishClass101" | tool-utility | `noopener noreferrer` | same; flag affiliate | Has affiliate program |
| `src/content/guides/culture.mdx` | 95 | `languagetransfer.org/turkish` | "Language Transfer" | tool-utility | `noopener noreferrer` | same | OK |
| `src/content/guides/culture.mdx` | 99 | `italki.com` | "Italki" | tool-utility | `noopener noreferrer` | same; flag affiliate | Has affiliate program |
| `src/content/guides/culture.mdx` | 101 | `preply.com` | "Preply" | tool-utility | `noopener noreferrer` | same; flag affiliate | Has affiliate program |
| `src/content/guides/culture.mdx` | 119 | `en.wikipedia.org` | "Kedi" | authority | `noopener noreferrer` | same | OK |
| `src/content/guides/visa.mdx` | 19, 24 | `evisa.gov.tr/en/` | "evisa.gov.tr" | authority (.gov.tr) | `noopener noreferrer` | same | OK; bare-URL anchor text could be improved |
| `src/content/guides/visa.mdx` | 28 | `evisa.gov.tr/en/info/` | "e-Visa eligibility page" | authority | `noopener noreferrer` | same | OK |
| `src/content/guides/visa.mdx` | 49, 53, 74 | `digitalnomads.goturkiye.com` | various | authority | `noopener noreferrer` | same | OK |
| `src/content/guides/visa.mdx` | 90 | `e-ikamet.goc.gov.tr` | bare URL | authority (.gov.tr) | `noopener noreferrer` | same | Repeated 5x in path-to-istanbul + here, consistent |
| `src/content/guides/visa.mdx` | 114 | `safetywing.com`, `worldnomads.com` | "SafetyWing", "World Nomads" | tool-utility / partner-potential | `noopener noreferrer` | same; flag affiliate | Both have affiliate programs - high partner potential |
| `src/content/guides/internet.mdx` | 21 | `turkcell.com.tr`, `vodafone.com.tr`, `turktelekom.com.tr` | bare URLs | tool-utility | `noopener noreferrer` | same | Bare-URL anchor text |
| `src/content/guides/internet.mdx` | 48-61 | `maps.google.com` (x9) | various | directory | `noopener noreferrer` | same | OK |
| `src/content/guides/internet.mdx` | 87 | `airalo.com` | "airalo.com" | tool-utility / partner-potential | `noopener noreferrer` | same; flag affiliate | High partner potential, has affiliate program |
| `src/content/guides/internet.mdx` | 88 | `holafly.com` | "holafly.com" | tool-utility / partner-potential | `noopener noreferrer` | same; flag affiliate | High partner potential, has affiliate program |
| `src/content/guides/internet.mdx` | 118 | `fast.com` | "fast.com" | tool-utility | `noopener noreferrer` | same | Duplicate destination, varied anchor |
| `src/content/guides/healthcare.mdx` | 19-22 | `safetywing.com`, `worldnomads.com`, `iyisigorta.com` | brand names | tool-utility / partner-potential | `noopener noreferrer` | same; flag affiliate | OK |
| `src/content/guides/healthcare.mdx` | 32-36 | `maps.google.com` (x5) | "Find nearest", "Map" | directory | `noopener noreferrer` | same | "Find nearest" is decent anchor, "Map" generic |
| `src/content/guides/housing.mdx` | 23 | `airbnb.com/s/Istanbul` | "Airbnb" | tool-utility / partner-potential | `noopener noreferrer` | same; flag affiliate | OK |
| `src/content/guides/housing.mdx` | 24 | `flatio.com` | "Flatio" | partner-potential | `noopener noreferrer` | same; flag affiliate | Duplicate of neighborhoods.mdx:110 |
| `src/content/guides/housing.mdx` | 25 | `spotahome.com/istanbul` | "Spotahome" | tool-utility / partner-potential | `noopener noreferrer` | same; flag affiliate | OK |
| `src/content/guides/housing.mdx` | 31-33 | `sahibinden.com`, `hepsiemlak.com`, `emlakjet.com` | brand names | directory | `noopener noreferrer` | same | OK |
| `src/content/guides/housing.mdx` | 35 | `t.me/istanbul_digital_nomads` | "Istanbul Digital Nomads" | social (own) | `noopener noreferrer` | same | OK |
| `src/content/guides/housing.mdx` | 108 | `bedas.com.tr` | "BEDAS website" | authority (utility) | `noopener noreferrer` | same | OK |
| `src/content/guides/housing.mdx` | 109 | `igdas.istanbul` | "IGDAS website" | authority (utility) | `noopener noreferrer` | same | OK |
| `src/content/guides/cost-of-living.mdx` | 98 | `bitaksi.com` | "BiTaksi" | tool-utility | `noopener noreferrer` | same | Duplicate destination |
| `src/content/blog/slowmad-guide-istanbul.mdx` | 11 | `atlys.com/blog/...` | "40 million people" | low-value (aggregator/citation) | `noopener noreferrer` | `nofollow noopener noreferrer` | Atlys is a visa aggregator. Low-quality citation source - either find primary research (MBO Partners, Statista) or `nofollow` |
| `src/content/blog/turkey-digital-nomad-visa-guide.mdx` | 66, 70, 145 | `digitalnomads.goturkiye.com`, `t.me/...` | various | authority + own social | `noopener noreferrer` | same | OK |
| `src/content/blog/ferry-commute-guide.mdx` | 68 | `sehirhatlari.istanbul` | bare URL | authority | `noopener noreferrer` | same | Bare URL, improve anchor |
| `src/content/blog/top-coworking-spots.mdx` | 21-61 | `maps.google.com` (x5) | "Find it on the map" | directory | `noopener noreferrer` | same | Consistent anchor, OK |
| `src/content/blog/first-week-mistakes.mdx` | 11, 31, 43, 79, 91 | `t.me/...`, `bitaksi.com`, `fast.com` | various | own-social + tool-utility | `noopener noreferrer` | same | OK |
| `src/content/blog/getting-residence-permit.mdx` | 96 | `t.me/...` | "Telegram group" | own-social | `noopener noreferrer` | same | OK |
| `src/content/blog/asian-vs-european-side.mdx` | 11, 152 | `t.me/...` | "Telegram group", "community" | own-social | `noopener noreferrer` | same | OK |
| `src/content/path-to-istanbul/pakistan.mdx` | 23 | `evisa.gov.tr` | "e-visa system" | authority | `noopener noreferrer` | same | OK |
| `src/content/path-to-istanbul/pakistan.mdx` | 32 | `e-ikamet.goc.gov.tr` | bare URL | authority | `noopener noreferrer` | same | OK |
| `src/content/path-to-istanbul/pakistan.mdx` | 111, 134 | `hepsiemlak.com`, `sahibinden.com`, `t.me/...` | brand names | directory + own-social | `noopener noreferrer` | same | OK |
| `src/content/path-to-istanbul/india.mdx` | 27, 41, 53, 122, 144, 146 | `evisa.gov.tr`, `e-ikamet.goc.gov.tr`, `mea.gov.in`, `hepsiemlak.com`, `sahibinden.com`, `migros.com.tr`, `t.me/...` | various | authority + directory + tool-utility + own-social | `noopener noreferrer` | same | OK |
| `src/content/path-to-istanbul/iran.mdx` | 30, 111, 129, 130 | `e-ikamet.goc.gov.tr`, `hepsiemlak.com`, `sahibinden.com`, `turkishteatime.com`, `t.me/...` | various | mixed | `noopener noreferrer` | same | OK |
| `src/content/path-to-istanbul/russia.mdx` | 30, 113, 133 | `e-ikamet.goc.gov.tr`, `hepsiemlak.com`, `sahibinden.com`, `t.me/...` | various | mixed | `noopener noreferrer` | same | OK |
| `src/content/path-to-istanbul/nigeria.mdx` | 37, 117, 140 | `e-ikamet.goc.gov.tr`, `hepsiemlak.com`, `sahibinden.com`, `t.me/...` | various | mixed | `noopener noreferrer` | same | OK |

### 3b. TSX inline anchors

| File | Line | Domain | Anchor text | Category | Current rel | Recommended rel | Action |
|---|---|---|---|---|---|---|---|
| `src/components/layout/footer.tsx` | 56, 99, 147 | `t.me/...`, `github.com/istanbul-...`, `twitter.com/istanbulnomads` | "Join on Telegram", icon-only, "Telegram"/"GitHub"/"Twitter" | own-social | `noopener noreferrer` | same | OK |
| `src/components/layout/header.tsx` | 178 | `t.me/...` | "Join on Telegram" | own-social | `noopener noreferrer` | same | OK |
| `src/components/layout/mobile-menu-overlay.tsx` | 165, 186 | `t.me/...`, `github.com/...`, `twitter.com/...` | icon + "Join the Telegram group" | own-social | `noopener noreferrer` | same | OK |
| `src/components/sections/cta-banner.tsx` | 19 | `t.me/...` | "Join on Telegram" | own-social | `noopener noreferrer` | same | OK |
| `src/app/page.tsx` | 122, 520 | `t.me/...` | "Join on Telegram" | own-social | `noopener noreferrer` | same | OK |
| `src/app/not-found.tsx` | 41 | `t.me/...` | "Or ask in the Telegram group" | own-social | `noopener noreferrer` | same | OK |
| `src/app/error.tsx` | 29 | `/` (internal) | - | - | - | - | Internal Link, no action |
| `src/app/events/events-view.tsx` | 81 | `t.me/...` | "Join Telegram" | own-social | `noopener noreferrer` | same | OK |
| `src/app/contact/page.tsx` | 82 | `t.me/...`, `github.com/...`, `mailto:` | "Telegram", "GitHub", "Email" | own-social | `noopener noreferrer` | same | OK |
| `src/app/guides/[slug]/page.tsx` | 90 | `t.me/...` | "Telegram group" | own-social | `noopener noreferrer` | same | OK |
| `src/app/path-to-istanbul/[country]/page.tsx` | 190 | `t.me/...` | "Join the Telegram" | own-social | `noopener noreferrer` | same | Note: this uses `next/link` `<Link>` not raw `<a>`; rel still applied correctly |
| `src/app/spaces/space-card.tsx` | 118 | `space.website` (dynamic, e.g. `kolektifhouse.co`) | "Visit website" | partner-potential (coworking) | `noopener noreferrer` | same; flag affiliate | "Visit website" is generic anchor text - consider including space name |
| `src/app/local-guides/guide-card.tsx` | 127, 138, 149, 160 | `guide.social_*` (user-submitted Instagram, LinkedIn, Twitter, website) | icon-only with `aria-label` | social (third-party, user-submitted) | `noopener noreferrer` | `nofollow noopener noreferrer` | User-submitted URLs - add `nofollow` to prevent equity passing to unvetted profiles |

### 3c. `src/lib/spaces.ts` - `website` fields rendered via `space-card.tsx`

| Domain | Space | Category | Action |
|---|---|---|---|
| `kolektifhouse.co` | Kolektif House | partner-potential | Flag for affiliate |
| `workinton.com` | Workinton | partner-potential | Flag for affiliate |
| `istanbul.impacthub.net` | Impact Hub Istanbul | partner-potential | Flag for affiliate |
| `www.just-work.com` | JUSTWork | partner-potential | Flag for affiliate |
| `karabatak.com` | Karabatak | tool-utility (cafe) | Low affiliate potential |
| `www.kronotrop.com.tr` | Kronotrop | tool-utility (cafe) | Low affiliate potential |
| `www.montagcoffee.com` | Montag Coffee | tool-utility (cafe) | Low affiliate potential |

### 3d. `src/lib/spaces.ts` - `sources[]` arrays (NOT currently rendered anywhere)

67 URLs across 7 spaces. Grep for `\.sources` or `space.sources` returns no consumer in `src/`. Categories observed:

- **Directory:** `coworker.com`, `wheree.com`, `yandex.com/maps`, `foursquare.com`, `wanderlog.com`, `discoverkava.com`, `coffeeradar.io`, `specialtycoffeemap.com`, `laptopfriendlycafe.com`, `beanhunter.com`, `restaurantguru.com`
- **News-media:** `sprudge.com`, `timeout.com`, `europeancoffeetrip.com`, `theglobalcircle.com`, `thewaytocoffee.com`, `thecoffeecompass.com`, `fodors.com`
- **Social/review:** `tripadvisor.com` (x9), `yelp.com` (x9), `facebook.com/petraroastingco/`, `facebook.com/cafefes/`
- **Aggregator (low-value):** `freakingnomads.com`

**Decision required:** if you ship a Sources UI on space detail pages, the `tripadvisor` + `yelp` + `freakingnomads` cluster should get `nofollow`. The official-domain sources (`kolektifhouse.co/en/locations/levent` etc.) are fine as `noopener noreferrer`.

### 3e. `src/lib/emails.tsx` - email template links (transactional, not SEO)

| Line | URL | Notes |
|---|---|---|
| 104, 299, 304, 309, 394 | `https://istanbulnomads.com*` | Self-referential, not SEO-impacting |
| 358 | `https://t.me/istanbul_digital_nomads` | Own brand |

Email links don't carry SEO weight (not crawled, no rel needed). No action.

### 3f. `src/app/layout.tsx` - resource hints

| Line | URL | Type |
|---|---|---|
| 94 | `https://basemaps.cartocdn.com` | `preconnect` (perf hint, not a hyperlink) |
| 95 | `https://basemaps.cartocdn.com` | `dns-prefetch` (perf hint) |
| 97-98 | `process.env.NEXT_PUBLIC_SUPABASE_URL` | `preconnect` (perf hint) |

Not user-visible links. No SEO impact, no action.

---

## 4. Issues by Severity

### P0 - Fix now

1. **Verify `hfrfly.com/en` in `src/content/guides/transport.mdx:110`.** Suspicious-looking domain for the Havaist airport bus. Real candidates: `hava.ist` or `havabus.com`. Either fix the URL or remove the link.
2. **Atlys citation in `src/content/blog/slowmad-guide-istanbul.mdx:11`.** A visa-aggregator blog isn't a credible source for "40 million digital nomads." Replace with primary research (MBO Partners 2024 State of Independence, Pieter Levels' nomadlist data, or Statista) or add `nofollow` if kept.
3. **Generic Facebook search URL in `src/content/guides/neighborhoods.mdx:116`.** `facebook.com/groups/` with anchor "Facebook groups" doesn't deep-link to anything. Either name a specific group with a real URL or remove.
4. **`src/lib/spaces.ts` 67 unused source URLs.** Either render them (with rel policy) or strip `sources` from the type to avoid bundle bloat.

### P1 - Fix this week

5. **Bare-URL anchor text** in: `transport.mdx:58` (`sehirhatlari.istanbul`), `transport.mdx:110` (`hfrfly.com/en`), `internet.mdx:21` (3 telco URLs), `internet.mdx:87-88` (`airalo.com`, `holafly.com`), `visa.mdx:19, 24` (`evisa.gov.tr`), `coworking.mdx:28, 45, 61, 76, 91` (5 coworking URLs), `ferry-commute-guide.mdx:68`. Rewrite as descriptive anchors ("Sehir Hatlari ferry schedules", "Turkcell tourist plans", "official Turkish e-Visa portal", etc.).
6. **Generic "Visit website" anchor** in `src/app/spaces/space-card.tsx:125`. Include space name dynamically: `Visit {space.name}`.
7. **Generic "Map" anchor** repeated 36+ times across `food.mdx`, `coworking.mdx`, `internet.mdx`, `healthcare.mdx`. SEO loses signal. Consider varying ("Open in Google Maps", "View on map") or, better, linking to internal `/spaces/{id}` pages once they exist for each.
8. **Flag partner-potential** in JSON / DB:
   - SIM/eSIM: `airalo.com`, `holafly.com`, `turkcell.com.tr`, `vodafone.com.tr`, `turktelekom.com.tr`
   - Insurance: `safetywing.com`, `worldnomads.com`, `iyisigorta.com`
   - Housing: `flatio.com`, `spotahome.com`, `airbnb.com`
   - Coworking: `kolektifhouse.co`, `workinton.com`, `mob.ist`, `istanbul.impacthub.net`, `just-work.com`
   - Transport: `bitaksi.com`, `uber.com`
   - Language: `italki.com`, `preply.com`, `turkishclass101.com`
9. **User-submitted local-guide socials in `src/app/local-guides/guide-card.tsx:127-160`.** Add `nofollow` so we don't pass equity to unvetted Instagram/LinkedIn/Twitter/personal websites.

### P2 - Monitor

10. **Duplicate destinations.** `t.me/istanbul_digital_nomads` linked 18+ times across MDX (consistent anchor variations: "Telegram group", "Telegram", "community", "Istanbul Digital Nomads"). `hepsiemlak.com` and `sahibinden.com` linked 6+ times each across path-to-istanbul + guides. Anchor variation is fine but document the canonical anchor for each in the brand guide.
11. **`Hepsiemlak.com` vs `Hepsiemlak`** anchor inconsistency between `housing.mdx:32` and `path-to-istanbul/india.mdx:122`. Pick one.
12. **Affiliate conversion candidates.** Track in a backlog: SafetyWing, Airalo, Holafly, Italki, Preply, Wise, Spotahome, Flatio - all have affiliate programs we can apply to.

---

## 5. Per-File Action Checklist

### `src/content/guides/transport.mdx`
- [ ] Verify or replace `https://hfrfly.com/en` (line 110)
- [ ] Improve anchor on line 58 from bare URL to "Sehir Hatlari ferry schedules"

### `src/content/guides/neighborhoods.mdx`
- [ ] Remove or replace generic `facebook.com/groups/` link (line 116)
- [ ] Standardize Hepsiemlak anchor text with `housing.mdx`

### `src/content/guides/internet.mdx`
- [ ] Improve anchors for telcos (line 21) and eSIMs (lines 87-88)
- [ ] Mark Airalo, Holafly, all 3 telcos as partner-potential in tracking system

### `src/content/guides/visa.mdx`
- [ ] Improve bare-URL anchors on lines 19, 24
- [ ] Mark SafetyWing, World Nomads as partner-potential

### `src/content/guides/healthcare.mdx`
- [ ] Mark insurance providers as partner-potential

### `src/content/guides/housing.mdx`
- [ ] Mark Airbnb, Flatio, Spotahome as partner-potential

### `src/content/guides/coworking.mdx`
- [ ] Improve bare-URL anchors on lines 28, 45, 61, 76, 91
- [ ] Mark all 5 coworking sites as partner-potential

### `src/content/guides/culture.mdx`
- [ ] Mark Italki, Preply, TurkishClass101 as partner-potential

### `src/content/blog/slowmad-guide-istanbul.mdx`
- [ ] Replace Atlys citation (line 11) with primary research source

### `src/lib/spaces.ts`
- [ ] Decide: render `sources[]` (and add rel policy) or strip from type
- [ ] If rendered, classify each per the policy matrix in section 2

### `src/app/spaces/space-card.tsx`
- [ ] Improve "Visit website" anchor to include space name (line 125)

### `src/app/local-guides/guide-card.tsx`
- [ ] Add `rel="nofollow noopener noreferrer"` to user-submitted social links (lines 127, 138, 149, 160)

---

## 6. Build Recommendations

### 6a. Custom `<ExternalLink>` React component - YES

**Recommendation:** ship it. Drop into `src/components/ui/external-link.tsx`. Centralizes:

- `target="_blank" rel="noopener noreferrer"` defaults
- Optional `category` prop (`"partner" | "affiliate" | "low-value" | "authority"`) that flips between `noopener noreferrer`, `nofollow noopener noreferrer`, and `sponsored noopener noreferrer`
- Future analytics hook (track outbound clicks)

Why now: TSX inline anchors are correct today, but every new ad-hoc `<a href="https://...">` is one developer-rush away from regressing. A shared component prevents drift.

### 6b. MDX plugin for per-link rel overrides - PROBABLY NOT YET

The current MDX content is 99% covered by the auto-rel in `mdx-components.tsx`. The few links that need `nofollow` (Atlys, Facebook search, future low-value cites) are rare enough that a remark/rehype plugin to parse `[text](url "rel:nofollow")` is over-engineered for the current volume. Revisit if low-value citations grow past 10-15.

Cheaper alternative: keep MDX as-is, and when a link genuinely needs `nofollow`, drop to raw HTML inline:
```mdx
<a href="https://example.com" rel="nofollow noopener noreferrer" target="_blank">text</a>
```

### 6c. Build-time external-link checker - YES

**Recommendation: ship a CI script.** Concrete spec:

`scripts/check-external-links.ts`:
1. Grep all `.tsx`, `.mdx`, `.ts` for external `href`/markdown-link patterns.
2. Parse each occurrence and assert:
   - TSX `<a href="https://...">` has both `target="_blank"` and `rel` containing `noopener` and `noreferrer`.
   - No HTTP-only URLs (require https).
   - No anchor text in `["click here", "here", "link", "this"]`.
   - Domain matches the allowlist in `src/lib/external-links.ts` (see 6d) or is logged as "unclassified" with a warning (not failure) for triage.
3. Exit non-zero on policy violations; print file:line:column.
4. Wire into `package.json` as `pnpm lint:links`, run in CI alongside `lint`.

Why: as the site grows past 10 contributors and 100 blog posts, manual rel discipline doesn't scale. A 200-line script catches regressions for free.

### 6d. Domain allowlist (`src/lib/external-links.ts`) - YES, paired with 6c

**Recommendation:** ship a lightweight version. Structure:

```ts
export const EXTERNAL_LINK_POLICY = {
  authority: ["evisa.gov.tr", "e-ikamet.goc.gov.tr", "digitalnomads.goturkiye.com",
              "sehirhatlari.istanbul", "bedas.com.tr", "igdas.istanbul",
              "en.wikipedia.org", "mea.gov.in"],
  directory: ["maps.google.com", "openstreetmap.org", "coworker.com", "yandex.com",
              "foursquare.com", "sahibinden.com", "hepsiemlak.com", "emlakjet.com"],
  newsMedia: ["timeout.com", "sprudge.com", "europeancoffeetrip.com"],
  ownBrand: ["istanbulnomads.com", "t.me/istanbul_digital_nomads",
             "github.com/istanbul-digital-nomads", "twitter.com/istanbulnomads"],
  toolUtility: ["bitaksi.com", "uber.com", "duolingo.com", "fast.com"],
  partnerPotential: ["airalo.com", "holafly.com", "safetywing.com",
                     "worldnomads.com", "italki.com", "preply.com", "flatio.com",
                     "spotahome.com", "airbnb.com", "kolektifhouse.co",
                     "workinton.com", "mob.ist", "istanbul.impacthub.net",
                     "just-work.com", "turkcell.com.tr", "vodafone.com.tr"],
  lowValue: ["atlys.com"],
} as const;
```

The CI script (6c) reads this, classifies each found link, applies the rel policy, and fails if mismatched. Also doubles as documentation for future contributors.

---

## Appendix: How rel is currently set

- **MDX content (auto):** `src/components/ui/mdx-components.tsx:49-58` adds `target="_blank" rel="noopener noreferrer"` whenever `href.startsWith("http")`.
- **TSX inline anchors:** every external `<a>` in `src/app/**` and `src/components/**` was checked manually. All 100% of them set `rel="noopener noreferrer"` and `target="_blank"`. The dynamic ones (`space.website`, `guide.social_*`) inherit it from the parent `<a>` JSX, not the data.
- **Email templates (`src/lib/emails.tsx`):** no rel, but emails aren't crawled so no SEO impact.
- **Resource hints (`src/app/layout.tsx:94-98`):** `<link rel="preconnect|dns-prefetch">` are perf hints, not hyperlinks.
