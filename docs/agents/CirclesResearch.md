# Circles v2 - Research

What do nomads and remote workers actually want from sub-communities? This doc
maps real observed needs onto the five groups in the brief and proposes a set
of circles. We keep the existing six valid and only add circles that fill a
need we can point to.

## How we know what people want

We don't have to guess from scratch. A few patterns show up everywhere
nomad communities gather:

- **NomadList "groups" and Nomads.com chat** organize people by city and by
  interest (fitness, founders, dating-free social). The recurring threads are
  cowork meetups, fitness/running, founders/indie hackers, and "who's in town
  this week." (nomads.com, nomadlist.com city pages)
- **r/digitalnomad** top recurring threads: loneliness and making friends,
  finding a community in a new city, accountability for solo work, language
  learning, and "is anyone else here right now." (reddit.com/r/digitalnomad -
  recurring weekly threads and the most-upvoted "how do you make friends"
  posts)
- **Coworking community structures** (WeWork-style member channels, indie
  spaces, Hacker Paradise / Remote Year cohorts) tend to split into:
  professional skill tracks, lifestyle/wellness, and social/after-hours.
  (remoteyear.com, hackerparadise.org program structure)
- **Discord community design** for large servers consistently groups channels
  by purpose: build/work, hobby, accountability, and intros/looking-for. Big
  servers add a "new here" funnel because the main channel is overwhelming.
  (Common Discord community-server templates; the same logic as our own
  "Telegram is too many people" framing.)

The throughline: people don't want one giant room. They want a small room for
the **thing they're doing this week** - work, a run, a language exchange - and
a low-pressure door in if they just arrived.

## The five groups, with justified circles

Existing circles are tagged **(existing)**. New ones carry a one-line "why."

### Professional

Skill- and role-based rooms. These are the highest-signal circles because the
need is concrete: feedback, hiring leads, shop talk.

| Circle | Status | Why it earns a spot |
|---|---|---|
| Founders | (existing) | Solo founders / small teams want office hours and a problem-sharing room. Maps to NomadList founders + indie hackers. |
| Developers | new | The single largest professional segment in nomad communities. Code review, stack chat, "anyone done X in Turkey" tax/legal-for-devs questions. |
| Designers | new | Design crit and portfolio feedback are a distinct need from dev shop talk; designers ask for their own room in most mixed communities. |
| Product & PM | new | PMs and ops people don't fit cleanly in dev or design rooms; they want roadmap/discovery/hiring chat. Smaller but real. |
| AI builders | new | Fast-growing, currently scattered across founders and devs. A room for people shipping AI products and comparing tools. Justified by how often this comes up now, not as a buzzword circle. |

### Lifestyle

Body, calm, and hobby rooms. Wellness is one of the top reasons remote workers
join local communities (the gym/run buddy problem in a new city).

| Circle | Status | Why it earns a spot |
|---|---|---|
| Hiking | (existing) | Weekend trips out of the city. |
| Photography | (existing) | Camera walks, doubles as neighborhood discovery. |
| Wine | (existing) | Informal Anatolian-wine tastings. |
| Fitness | new | "Find a gym buddy / training partner in a new city" is one of the most common asks. Lifting, classes, accountability. |
| Running | new | Distinct from general fitness and from hiking - run clubs are a known nomad social format (e.g. weekly social runs). |
| Coffee lovers | new | Istanbul is a cafe city and we already track cowork cafes. A specialty-coffee room is a natural, low-effort daytime social door. |
| Meditation | new | Calm/wellness counterweight to deep-work burnout; recurring request in remote-worker spaces. Keep it small and real. |

### Growth

Rooms organized around getting better at something, with built-in
accountability. These have the highest retention when they have a rhythm.

| Circle | Status | Why it earns a spot |
|---|---|---|
| Accountability | new | The #1 solo-work pain point: nobody to keep you honest. Weekly goals + check-ins. Strong fit for the participation-score idea. |
| Language exchange | new | Turkish practice + members' own languages. Language learning is a top r/digitalnomad thread and a natural local hook. |
| Startup builders | new | Distinct from Founders: this is for people *building toward* a launch (side projects, pre-revenue), not running a company yet. Build-in-public energy. |

### Social

Rooms for doing things together, no skill required.

| Circle | Status | Why it earns a spot |
|---|---|---|
| Coworking | (existing) | Daily "where's the good wifi" thread - the default social-professional room. |
| Sailing | (existing) | Day sails on the Marmara. |
| Weekend explorers | new | Day trips, neighborhoods, markets - the "what's everyone doing Saturday" room. Broad, high-traffic, complements hiking. |
| Food lovers | new | Where to eat, group dinners, market runs. Istanbul food is a built-in draw; a clear social door. |

### Relationship

Low-pressure rooms for arriving and connecting. **Not** a dating feature - the
member rules explicitly say this isn't a dating app, so framing stays platonic.

| Circle | Status | Why it earns a spot |
|---|---|---|
| New in Istanbul | new | Direct answer to "I just arrived, where do I start." The onboarding funnel everyone needs; mirrors Discord "new here" channels. |
| Looking for friends | new | The loneliness thread, made into a room. Explicitly platonic. The most-requested thing in nomad spaces and the hardest to ask for. |
| Travel partners | new | Find people for trips in/around Turkey (Cappadocia, the coast). Pairs with weekend explorers but is trip-scoped. |

## Mapping the existing six

| Existing circle | New category |
|---|---|
| coworking | Social |
| hiking | Lifestyle |
| sailing | Social |
| photography | Lifestyle |
| wine | Lifestyle |
| founders | Professional |

## What we deliberately did not add

- Generic "networking" or "general chat" - that's the main Telegram already.
- "Crypto", "investing", "dating" - either off-brand, against the rules, or no
  observed community need here.
- Per-nationality rooms - the community is intentionally mixed; the rules call
  out "mixed environments." Language exchange covers the practical need without
  splitting people by passport.

## Notes for implementation

- The brief's groups become `circle_categories` (slug + sort order).
- Each circle gets a `category` slug. The existing six keep their slugs exactly.
- New circles get neutral accents from the existing palette where possible; we
  add a couple of accents only where the palette runs out (documented in
  `src/lib/circles.ts`).
- Member counts and any "X people active" copy must come from real
  `circle_members` / `circle_activity` data once the migration is applied.
  Until then the UI shows no fabricated numbers.
