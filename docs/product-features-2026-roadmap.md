# Product Features Roadmap - 2026

> Status: **Active roadmap**
> Owner: aliwesome
> Current release baseline: `v1.18.0`
> Related docs: [`docs/redesign-2026-q2.md`](redesign-2026-q2.md), [`docs/visual-identity.md`](visual-identity.md)

## Why this exists

Istanbul Nomads should feel less like a static city guide and more like a practical arrival companion. The site already has strong content, neighborhood coverage, events, spaces, and relocation paths. The next product layer should help a newcomer answer the daily questions that decide whether Istanbul feels workable:

- Where should I stay?
- What should I do this week?
- Can I afford this month?
- Where can I work today?
- Who should I meet first?
- What paperwork or local habit will surprise me?

The goal is not to add gimmicks. The goal is to make the site feel alive, useful, and Istanbul-specific every time someone opens it.

---

## Current shipped baseline

### Shipped in `v1.17.0`

- **Istanbul Today** - live weather, current city mood, nomad-specific day planning, and a generated photoreal Bosphorus weather image.
- **Neighborhood Rhythm Matcher** - visitors choose daily-routine signals and get ranked Istanbul neighborhoods.
- **Neighborhood badges** - faster first-read identity across homepage cards, guide cards, and neighborhood detail heroes.
- **Decision notes** - structured "consider if" and "avoid as first base" guidance for areas that do not need full neighborhood pages.

### Shipped in `v1.18.0`

- **First Week Planner** - shareable seven-day arrival plans based on base neighborhood, work style, social appetite, budget comfort, and arrival profile.
- **Planner entry points** - homepage, Neighborhood Rhythm Matcher, neighborhood detail pages, navigation, footer, and sitemap now point into the tool.

These three roadmap items are now considered complete for phase one:

1. Istanbul Today
2. Neighborhood Rhythm Matcher
3. First Week Planner

---

## Product principles

1. **Make it useful before it is clever.** Every feature should answer a real arrival or daily-life question.
2. **Keep Istanbul in the foreground.** Ferries, neighborhoods, weather, bureaucracy, cafe habits, and language friction should shape the interface.
3. **Prefer decision tools over generic content blocks.** The user should be able to narrow options, save context, or leave with a concrete next step.
4. **Do not build fake dashboards.** Interactive tools should use real local data where possible and transparent assumptions where not.
5. **Design for the first month.** The highest-value user is someone arriving soon or deciding whether Istanbul can work for them.
6. **Keep pages editorial, not SaaS-heavy.** Strong photos, practical text, restrained UI, and no generic marketing bloat.
7. **Each feature ships as a release slice.** No mega PR with ten half-finished tools.

---

## Roadmap overview

| Priority | Feature                           | Status  | Main route                    | Release target | Why it matters                                        |
| -------- | --------------------------------- | ------- | ----------------------------- | -------------- | ----------------------------------------------------- |
| 1        | Istanbul Today                    | Shipped | `/`, `/guides/neighborhoods`  | `v1.17.0`      | Makes the site feel current and city-aware            |
| 2        | Neighborhood Rhythm Matcher       | Shipped | `/`, `/guides/neighborhoods`  | `v1.17.0`      | Converts neighborhood content into a decision tool    |
| 3        | First Week Planner                | Shipped | `/tools/first-week-planner`   | `v1.18.0`      | Helps new arrivals get unstuck fast                   |
| 4        | Cost of Living Calculator         | Planned | `/tools/cost-calculator`      | `v1.19.0`      | High SEO value and high practical value               |
| 5        | Cafe and Coworking Finder Upgrade | Planned | `/spaces`                     | `v1.20.0`      | Turns spaces into a daily-use tool                    |
| 6        | Event Discovery Upgrade           | Planned | `/events`                     | `v1.21.0`      | Converts visitors into community members              |
| 7        | Local Guide Matching              | Planned | `/local-guides`               | `v1.22.0`      | Creates a real service layer                          |
| 8        | Path to Istanbul Enhancements     | Planned | `/path-to-istanbul/[country]` | `v1.23.0`      | Makes relocation paths more actionable                |
| 9        | Nomad Buddy Finder                | Planned | `/tools/buddy-finder`         | `v1.24.0`      | Helps users build social momentum                     |
| 10       | Personal Dashboard                | Later   | `/dashboard`                  | `v1.25.0+`     | Ties saved decisions, events, and onboarding together |

---

## Recommended release order

### Why this order

The next release should deepen the practical newcomer journey before adding heavier account features. A user should be able to go from "I am arriving soon" to "I know where to stay, what to do this week, what it may cost, where to work, and what event to attend."

### Suggested sequence

1. **Cost of Living Calculator** - strong search demand, shareable, and useful for planning before arrival.
2. **Cafe and Coworking Finder Upgrade** - makes the site useful multiple times per week.
3. **Event Discovery Upgrade** - turns planning into community participation.
4. **Local Guide Matching** - adds a service layer once the arrival path is clearer.
5. **Path to Istanbul Enhancements** - deepen country-specific relocation confidence.
6. **Nomad Buddy Finder** - useful once more member/profile infrastructure exists.
7. **Personal Dashboard** - should come after saved tools and auth patterns are stable.

---

## Feature 1: Istanbul Today

### Status

Shipped in `v1.17.0`.

### Current scope

- Live weather from Open-Meteo.
- Mood labels like "Rainy Istanbul" and "Soft gray city".
- Nomad-specific advice tied to weather.
- Generated photoreal Bosphorus rain scene.
- Lightweight animated overlays for rain, sun, clouds, and wind.
- Displayed on homepage and neighborhoods guide.

### Future improvements

- Add weather-aware links to spaces, events, and neighborhood routes.
- Add "rain-safe work spots" once spaces have richer metadata.
- Add time-of-day mood variations, such as morning ferry, afternoon cafe, and evening meetup.

### Acceptance criteria for future work

- Weather state updates without layout shift.
- Image remains readable behind text on mobile and desktop.
- All generated imagery is credited on `/credits`.

---

## Feature 2: Neighborhood Rhythm Matcher

### Status

Shipped in `v1.17.0`.

### Current scope

- Signals for quiet routine, social momentum, budget awareness, ferry-first living, seaside walks, business mode, nightlife access, and historic character.
- Ranks the full neighborhood set.
- Used on homepage and neighborhoods guide.
- Uses the local neighborhood data model rather than generic copy.

### Future improvements

- Add shareable result URLs.
- Add "compare top 3" mode.
- Add links from results into First Week Planner.
- Add "I am arriving with partner/family" signal.

### Acceptance criteria for future work

- Ranking logic remains explainable.
- Result cards link to the right guide pages.
- No hidden or fake score claims.

---

## Feature 3: First Week Planner

### Goal

Give a newcomer a realistic seven-day landing plan for Istanbul based on neighborhood, work style, weather, budget comfort, and social appetite.

Shipped in `v1.18.0`.

### Target user

- Arriving in Istanbul in the next 30 days.
- Staying at least two weeks.
- Unsure where to stay, work, meet people, and handle errands.

### Primary route

`/tools/first-week-planner`

### Entry points

- Homepage CTA after Istanbul Today.
- Neighborhood Rhythm Matcher result cards.
- Neighborhood detail pages.
- Events page.
- Blog posts about first-week mistakes, cafes, and residence permits.

### Core workflow

1. User chooses arrival profile:
   - First time in Istanbul
   - Returning nomad
   - Moving from another Turkish city
   - Relocation with paperwork focus
2. User chooses base neighborhood or "help me choose".
3. User chooses work style:
   - Cafe worker
   - Coworking worker
   - Home-office first
   - Calls-heavy schedule
4. User chooses social appetite:
   - Quiet first week
   - Meet people quickly
   - One event is enough
5. User chooses budget comfort:
   - Keep it lean
   - Balanced
   - Comfort-first
6. Planner generates a seven-day schedule.

### Example output structure

| Day   | Theme                   | Examples                                                       |
| ----- | ----------------------- | -------------------------------------------------------------- |
| Day 1 | Arrival reset           | SIM, Istanbulkart, short neighborhood walk, easy dinner        |
| Day 2 | Work setup              | Test cafe or coworking, backup WiFi, grocery basics            |
| Day 3 | Transport confidence    | Ferry or metro route, one cross-city loop                      |
| Day 4 | Community touchpoint    | Low-pressure event, Telegram intro, coworking session          |
| Day 5 | Admin buffer            | Residence permit prep, document scan, banking or address notes |
| Day 6 | Neighborhood comparison | Visit one alternate base                                       |
| Day 7 | Routine lock-in         | Pick regular work spot, repeat route, plan week two            |

### Data dependencies

- Neighborhood records from `src/lib/neighborhoods.ts`.
- Spaces data from existing public queries or static data.
- Events data from Supabase.
- Weather mood from Istanbul Today logic.
- Guide links from `src/lib/data`.

### UI sections

- Planner intro with real Istanbul arrival image.
- Input panel with segmented controls, toggles, and neighborhood selector.
- Generated plan timeline.
- "Save these links" strip.
- "What to avoid this week" notes.
- CTA to Telegram or events.

### Design notes

- Should feel like an itinerary board, not a marketing landing page.
- Use a compact, scannable timeline.
- Avoid giant cards for every day on desktop. Prefer a vertical itinerary with clear rhythm.
- On mobile, one day per panel is fine.

### MVP scope

- Client-side planner.
- No auth required.
- No persistent saves.
- Result can be copied or shared through query params.
- Uses static recommendations derived from existing site data.

### Later scope

- Save to dashboard.
- Export to calendar.
- Add reminders.
- Add localized versions for Farsi, Russian, and Turkish.

### Acceptance criteria

- Planner produces a complete seven-day result for all input combinations.
- Every output item links to a relevant page or clear next action.
- Mobile result is readable without horizontal scrolling.
- No fake real-time claims.
- Works without login.

---

## Feature 4: Cost of Living Calculator

### Goal

Help users estimate a realistic monthly Istanbul budget based on lifestyle, neighborhood, housing choice, coworking habits, transport, food, gym, SIM, and admin buffer.

### Target route

`/tools/cost-calculator`

### Inputs

- Stay duration.
- Neighborhood or side.
- Housing type:
  - Shared room
  - Studio
  - One bedroom
  - Comfortable apartment
- Food style:
  - Mostly home cooking
  - Mixed
  - Mostly eating out
- Work setup:
  - Home only
  - Cafe rotation
  - Coworking part time
  - Coworking full time
- Transport:
  - Mostly walk/ferry/metro
  - Frequent taxis
- Lifestyle:
  - Lean
  - Balanced
  - Comfort

### Outputs

- Estimated monthly range.
- Category breakdown.
- Neighborhood-specific rent note.
- "Where this estimate can break" warning.
- Link to cost of living guide.

### Data model needs

- Cost assumptions per category.
- Rent ranges already exist in neighborhood data.
- Updated 2026 assumptions should be documented in code.

### Acceptance criteria

- Assumptions are visible.
- Results use ranges, not false precision.
- Calculator links into neighborhoods and guide content.
- No financial advice framing.

---

## Feature 5: Cafe and Coworking Finder Upgrade

### Goal

Make `/spaces` useful as a same-day work decision tool.

### New filters

- Neighborhood.
- Calls-friendly.
- Quiet.
- Strong sockets.
- Rain-safe.
- Good for first visit.
- Open late.
- Coworking vs cafe.
- Budget level.

### Useful labels

- "Good for calls"
- "Laptop-safe"
- "Bring headphones"
- "Best before lunch"
- "Rain-safe"
- "Social enough"

### UI improvements

- Dense list view for comparison.
- Map remains useful but should not dominate mobile.
- Quick "today mode" filters from Istanbul Today weather.

### Acceptance criteria

- Filters combine predictably.
- Cards do not become too large on mobile.
- Empty states suggest next-best filters.

---

## Feature 6: Event Discovery Upgrade

### Goal

Make events easier for first-timers to understand and attend.

### New features

- Calendar view.
- Event type filters.
- "Good first event" label.
- "Work session", "social", "admin help", "founders", and "weekend" tags.
- Recurring event display.
- RSVP nudge and Telegram fallback.

### Event card improvements

- Show who it is best for.
- Show expected vibe.
- Show neighborhood and transit clue.
- Show "arrive alone friendly" where true.

### Acceptance criteria

- First-time visitor can identify one low-pressure event within 30 seconds.
- Events remain readable on mobile.
- Past events archive still works.

---

## Feature 7: Local Guide Matching

### Goal

Help newcomers find the right local guide or helper based on need, neighborhood, language, and budget.

### Inputs

- Need:
  - Neighborhood scouting
  - Apartment search
  - Residence permit prep
  - City orientation
  - Business setup
  - Language help
- Preferred language.
- Neighborhood or side.
- Budget level.
- Urgency.

### Outputs

- Recommended guide cards.
- Why this guide matches.
- Contact CTA.
- What to prepare before contacting.

### Design notes

- Should feel trustworthy and service-oriented.
- Avoid marketplace clutter.
- Guide cards should prioritize credibility, language, and fit.

### Acceptance criteria

- Matching rules are transparent.
- No guide appears to guarantee legal or immigration outcomes.
- Contact flow is clear and low-friction.

---

## Feature 8: Path to Istanbul Enhancements

### Goal

Make country-specific relocation pages more actionable.

### Improvements

- Arrival timeline.
- Document checklist.
- Common mistakes.
- Estimated admin difficulty.
- Community story excerpts.
- Links into first-week planner and local guides.

### Country pages

Current routes:

- `/path-to-istanbul/iran`
- `/path-to-istanbul/india`
- `/path-to-istanbul/russia`
- `/path-to-istanbul/pakistan`
- `/path-to-istanbul/nigeria`

### Acceptance criteria

- Each country page has a clear "before arrival" and "after arrival" sequence.
- Avoids legal certainty where rules may change.
- Cites or dates assumptions where needed.

---

## Feature 9: Nomad Buddy Finder

### Goal

Help users find low-pressure social matches based on neighborhood, arrival month, work style, and interests.

### Likely requirement

This probably needs auth and privacy settings, so it should not be built before member profile foundations are stable.

### Inputs

- Neighborhood.
- Arrival month.
- Work style.
- Interests.
- Language preferences.
- Meetup comfort.

### Outputs

- Suggested buddy matches.
- Shared context.
- Safe contact route.

### Privacy rules

- Opt-in only.
- No exact location.
- No public contact info by default.
- Clear profile visibility settings.

### Acceptance criteria

- No one is discoverable unless opted in.
- Matching can be disabled.
- User controls what fields are visible.

---

## Feature 10: Personal Dashboard

### Goal

Tie the product together for logged-in users.

### Dashboard modules

- Saved neighborhoods.
- Saved first-week plan.
- Upcoming RSVPs.
- Weather and today suggestion.
- Checklist progress.
- Suggested events.
- Saved spaces.

### Dependencies

- Auth.
- Saved objects.
- Event RSVP model.
- Profile settings.
- Privacy rules.

### Why later

The dashboard should aggregate useful product actions. It should not ship before the site has enough saved tools to make it valuable.

### Acceptance criteria

- Dashboard has at least three genuinely useful saved modules.
- Empty state guides users into tools.
- No fake activity feed.

---

## Data and architecture notes

### Reuse first

Prefer existing data sources:

- `src/lib/neighborhoods.ts`
- `src/lib/neighborhood-decision.ts`
- Existing guide and blog metadata.
- Supabase event queries.
- Existing spaces data.

### Add new data only when needed

Likely new files:

- `src/lib/first-week-planner.ts`
- `src/lib/cost-calculator.ts`
- `src/lib/space-signals.ts`
- `src/lib/event-signals.ts`

### Query param sharing

For tools that do not require auth, prefer shareable query params before persistence:

- First Week Planner result profile.
- Cost calculator assumptions.
- Rhythm matcher selected signals.

### Auth-gated features

Keep these for later:

- Buddy Finder.
- Personal Dashboard.
- Saved plans.
- Saved spaces.
- Private profile data.

---

## Visual and UX standards

These standards apply to every roadmap feature. They are meant to keep the site feeling practical, editorial, and Istanbul-specific instead of turning into a generic SaaS tool wall.

### UX north star

Every product feature should help the visitor finish this sentence:

> "Now I know what to do next in Istanbul."

If a screen is beautiful but does not create a clearer next step, it is not done.

### Page structure

- Start with the usable tool or decision surface, not a marketing hero.
- Keep the first viewport focused on the user's current task.
- Make the route title literal and useful, such as "First Week Planner" or "Cost of Living Calculator".
- Show supporting context only after the user can act.
- Use one primary action per section.
- Keep page sections full-width or open-layout by default.
- Use cards for repeated items, result rows, modals, and framed tools only.
- Do not put cards inside cards.
- Avoid decorative statistics unless they directly help the current decision.

### Layout standards

- Use a restrained max width for reading surfaces: around `max-w-3xl`.
- Use wider layouts only when comparing multiple options or showing maps, timelines, or tables.
- Prefer two-column desktop layouts for input/result tools:
  - Left side: controls or assumptions.
  - Right side: result, timeline, or recommendation.
- On mobile, collapse into one column with the result immediately after inputs.
- Keep controls close to the result they affect.
- Reserve large hero typography for real landing moments, not tool panels.
- Keep labels small, precise, and consistent.
- Do not use viewport-based font scaling.
- Do not rely on negative letter spacing.

### Visual identity

- Use warm documentary realism for major image moments.
- Use generated photoreal originals when no copyright-friendly real image fits the feature.
- Credit every generated or sourced image on `/credits`.
- Keep the Istanbul signal visible: ferries, neighborhoods, weather, cafes, transit, paperwork, or real local routines.
- Avoid generic remote-work imagery such as anonymous laptops, abstract gradients, and empty glass offices.
- Use Turkey Red as an accent, not a large background block.
- Keep dark mode warm charcoal, not cold blue-gray.
- Prefer borders and subtle contrast over heavy shadows.
- Keep large surface radius modest: usually `rounded-md` or `rounded-lg`.

### Tool controls

Use familiar controls for the type of choice:

| Choice type          | Preferred control                  |
| -------------------- | ---------------------------------- |
| One of several modes | Segmented control                  |
| Multiple signals     | Toggle buttons or checkboxes       |
| Numeric amount       | Slider plus visible value          |
| Budget or intensity  | 3-step segmented control           |
| Neighborhood         | Searchable select or card selector |
| Date or duration     | Date picker or stepper             |
| Optional setting     | Checkbox or switch                 |

Control standards:

- Selected state must be obvious without relying on color alone.
- Controls must have labels that explain the tradeoff.
- Avoid long instructional text inside the UI.
- Use icons only when they clarify meaning.
- Use lucide icons when an existing icon fits.
- Do not invent icon-only controls without a visible label or tooltip.

### Results and recommendations

- Every recommendation needs a short "why this fits" explanation.
- Use ranges instead of false precision when estimating costs, times, or scores.
- Avoid fake certainty in legal, financial, housing, and immigration contexts.
- Show assumptions near the result, not hidden in footnotes.
- Use ranked lists only when the ranking logic is explainable.
- Provide a next action for every result:
  - Read a guide.
  - Open a neighborhood page.
  - View spaces.
  - Check events.
  - Join Telegram.
  - Contact a local guide.
- Results should be copyable or shareable when the tool is public.

### Mobile standards

- Mobile is the primary verification target for every feature.
- No horizontal scrolling unless the surface is a deliberate carousel.
- Buttons and selected controls should be at least 44px tall.
- Result cards should not be taller than the viewport unless the content is a timeline day or detailed itinerary.
- Avoid fixed bottom CTAs when the site bottom nav is visible.
- Keep important text above the fold after input where possible.
- Do not let image overlays make headline or result text unreadable.
- Test at a narrow mobile width around 390px.

### Accessibility

- All controls must work with keyboard navigation.
- Focus states must be visible.
- Inputs need accessible names.
- Result groups should use semantic headings.
- Motion must respect `prefers-reduced-motion`.
- Do not use animation as the only way to communicate state.
- Color contrast must hold in light and dark modes.
- Error and empty states must be written in plain language.

### Performance standards

- Keep tools client-side when they can be deterministic and public.
- Avoid adding a large dependency for simple scoring or filtering.
- Use existing local data before creating new API calls.
- Generated images should be optimized through `next/image` or stored in an efficient format when practical.
- Avoid autoplay video unless there is a strong reason and a poster fallback.
- Do not block first render on optional third-party data.
- Use deterministic fallback states for weather, costs, events, and other live data.

### Content standards

- Copy should sound like a local friend who knows the city, not a travel agency.
- Avoid generic phrases like "discover hidden gems" unless the content is truly specific.
- Use concrete local references: ferry, metro, cafe tables, neighborhoods, rent ranges, paperwork, and weather.
- Keep warnings useful and calm.
- Do not overpromise legal, housing, financial, or visa outcomes.
- If data can change, include "updated" context or assumptions.

### Empty and error states

Every feature must define:

- Empty state before user input.
- No-result state after filters.
- Live-data failure state.
- Partial-data state.
- Loading state.

Standards:

- Empty states should offer one useful next action.
- No-result states should suggest which filters to relax.
- Live-data failures should keep the tool usable with fallback assumptions.
- Never blame the user.

### Feature-specific UX expectations

| Feature              | UX bar                                                                                   |
| -------------------- | ---------------------------------------------------------------------------------------- |
| First Week Planner   | A newcomer can generate a useful seven-day plan in under 90 seconds                      |
| Cost Calculator      | A visitor can understand the monthly range and assumptions without reading a guide first |
| Spaces Upgrade       | A user can find a workable place for today's conditions in under 60 seconds              |
| Events Upgrade       | A first-timer can identify one low-pressure event in under 30 seconds                    |
| Local Guide Matching | A visitor understands why a guide matches and what to prepare before contact             |
| Path Enhancements    | Country-specific pages show before-arrival and after-arrival steps clearly               |
| Buddy Finder         | Privacy and opt-in status are obvious before any matching happens                        |
| Dashboard            | Empty states guide users into tools instead of showing a blank app shell                 |

### Visual QA checklist

Before each feature release:

- Check desktop and mobile in the browser.
- Check light and dark mode.
- Check long labels and long result text.
- Check empty state, loading state, no-result state, and fallback state.
- Check that text does not overlap controls, images, or cards.
- Check that the first viewport communicates the task clearly.
- Check generated or sourced images render sharply and are credited.
- Check that the page still feels like Istanbul Nomads, not a generic product template.

### Definition of done

A feature is not complete until:

- The core workflow works without login unless the feature explicitly requires auth.
- The result explains itself.
- The user has a clear next action.
- Mobile layout has been visually checked.
- Accessibility basics are covered.
- Data assumptions are documented.
- Changelog and README are updated when the release changes the public product surface.
- Credits are updated when new generated or sourced imagery is added.

---

## Release template for each feature

Each feature release should include:

1. Product spec update in this doc.
2. Implementation.
3. Visual browser check on mobile and desktop.
4. Tests or focused assertions where logic exists.
5. Changelog entry.
6. README release summary update.
7. Credits update if new generated or sourced imagery is added.
8. PR body with screenshots and verification.

---

## Suggested next release: `v1.19.0`

### Title

Cost of Living Calculator

### Proposed scope

- New `/tools/cost-calculator` route.
- Inputs for neighborhood, housing style, food rhythm, workspace habits, transport, SIM, gym, and admin buffer.
- Monthly estimate with lean, balanced, and comfort ranges.
- Clear assumptions and links to cost-of-living, housing, spaces, and neighborhood guides.
- Shareable query params.
- Homepage, First Week Planner, and guide entry points.

### Out of scope

- Login.
- Saved budgets.
- Calendar export.
- Automated reminders.
- AI-generated personalized free text.

### Why this should be next

Budget confidence is one of the strongest pre-arrival questions. This also gives the First Week Planner a natural next step and creates a better bridge into housing, spaces, and neighborhood comparison.

---

## Open questions

1. Should the First Week Planner live under `/tools/first-week-planner` or be a prominent `/first-week` route?
2. Should planner outputs be generic enough for all arrivals or have country-specific variants for Iran, India, Russia, Pakistan, and Nigeria?
3. Should the Cost of Living Calculator ship before or after the spaces upgrade?
4. Should Local Guide Matching be public-only at first, or should it require lightweight lead capture?
5. Which features should require login, and which should remain public?
