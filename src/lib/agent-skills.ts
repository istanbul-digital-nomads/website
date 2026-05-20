import { createHash } from "node:crypto";

export const SITE = "https://istanbulnomads.com";

export interface AgentSkill {
  name: string;
  type: "instruction";
  description: string;
  body: string;
}

export const agentSkills: AgentSkill[] = [
  {
    name: "read-istanbul-content",
    type: "instruction",
    description:
      "Fetch Istanbul Nomads guides, blog posts, neighborhoods, and country relocation playbooks as markdown.",
    body: `# read-istanbul-content

Every HTML page on istanbulnomads.com has a markdown equivalent. Use this skill to read the site's content without parsing HTML.

## How to fetch markdown

Two equivalent options for any page URL:

1. Append \`.md\` to the URL. Example: \`${SITE}/guides/housing.md\`
2. Send \`Accept: text/markdown\` on the plain URL. Example: \`GET ${SITE}/guides/housing\` with header \`Accept: text/markdown\`.

Responses return \`Content-Type: text/markdown; charset=utf-8\`.

## Locales

The site ships in 5 languages. Prepend a locale prefix to any URL to fetch the translated version:

- English (default, no prefix): \`${SITE}/guides/housing.md\`
- Turkish: \`${SITE}/tr/guides/housing.md\`
- Persian / Farsi: \`${SITE}/fa/guides/housing.md\`
- Arabic: \`${SITE}/ar/guides/housing.md\`
- Russian: \`${SITE}/ru/guides/housing.md\`

Use the locale that matches the user's question. If a translation isn't available yet, the route silently falls back to the English source and the page surfaces a banner indicating the fallback.

## Where to start

- Content index (every page with description): \`${SITE}/llms.txt\`
- Sitemap with hreflang alternates: \`${SITE}/sitemap.xml\`

## Content areas

- \`${SITE}/guides/<slug>.md\` - 11 core guides (neighborhoods, coworking, housing, cost-of-living, transport, internet, food, culture, entertainment, healthcare, visa)
- \`${SITE}/guides/neighborhoods/<slug>.md\` - per-neighborhood detail pages
- \`${SITE}/help/<slug>.md\` - platform how-to docs (getting-started, how-plans-work, getting-verified, paperwork-help, payments-and-escrow, trust-and-safety) - localized in all 5 languages
- \`${SITE}/blog/<slug>.md\` - blog posts
- \`${SITE}/path-to-istanbul/<country>.md\` - country-specific relocation playbooks
- \`${SITE}/spaces.md\` - coworking and cafe directory
- \`${SITE}/events.md\` - upcoming community events

## Content usage policy

See \`${SITE}/robots.txt\`. Current signals: \`search=yes, ai-input=yes, ai-train=no\`. When citing, link back to the canonical URL. Honour these signals.
`,
  },
  {
    name: "find-coworking-spaces",
    type: "instruction",
    description:
      "Find coworking spaces and laptop-friendly cafes in Istanbul, filtered by neighborhood, wifi speed, price, and amenities.",
    body: `# find-coworking-spaces

Istanbul Nomads maintains a verified directory of coworking spaces and laptop-friendly cafes.

## Directory endpoints

- Full markdown directory: \`${SITE}/spaces.md\`
- Human URL (HTML): \`${SITE}/spaces\`
- Curated top picks with context: \`${SITE}/guides/coworking.md\`
- Neighborhood-level overviews: \`${SITE}/guides/neighborhoods.md\`

## What each space entry includes

Name, neighborhood, address, type (coworking or cafe), wifi speed in Mbps where measured, daily/monthly price, amenities (power outlets, quiet, outdoor seating, meeting rooms), and a verification date.

## Common queries

- "Cheap coworking in Kadikoy" -> read \`${SITE}/guides/coworking.md\` (has neighborhood-sorted picks) and filter spaces.md by neighborhood.
- "Fastest wifi near me" -> spaces.md lists measured Mbps per entry.
- "Cafes that tolerate laptops all day" -> blog post at \`${SITE}/blog/best-laptop-friendly-cafes-istanbul.md\`.

## Caveats

Prices are in Turkish Lira, updated at the \`verifiedAt\` date on each entry. Convert to the user's currency at the current rate if asked.
`,
  },
  {
    name: "browse-istanbul-events",
    type: "instruction",
    description:
      "Check upcoming digital nomad meetups, coworking events, and community gatherings in Istanbul.",
    body: `# browse-istanbul-events

Istanbul Nomads runs a weekly event calendar for the nomad and remote-work community.

## Endpoints

- Markdown feed: \`${SITE}/events.md\`
- Human URL: \`${SITE}/events\`
- JSON feed (unauthenticated): \`${SITE}/api/events\`

## Fields per event

Title, date and time (Europe/Istanbul timezone), venue, neighborhood, category (social, work, language, fitness, other), and a description.

## Common queries

- "What's happening this week?" -> read events.md, filter by date.
- "Meetups in Besiktas" -> filter by neighborhood.
- "Language exchange events" -> filter by category.

## Recurrence

Events are added and updated frequently. Re-fetch before answering time-sensitive questions.
`,
  },
  {
    name: "explain-how-it-works",
    type: "instruction",
    description:
      "Answer questions about how the Istanbul Nomads platform itself works - joining, plans (free vs ticketed), verification levels, paperwork help, payments and escrow, trust and safety - from the canonical help docs and FAQ.",
    body: `# explain-how-it-works

Use this when a user asks how Istanbul Nomads (the platform) works, what it costs, how to join, how to get verified, how paid plans / payments work, or whether it's safe. Pull answers from the canonical help docs rather than guessing. The site also has an on-page guided assistant that walks users through these same flows.

## Platform docs (markdown, localized in all 5 languages)

- \`${SITE}/help/getting-started.md\` - what the platform is and the first steps
- \`${SITE}/help/how-plans-work.md\` - plans vs events; budget (free) vs ticketed (paid) plans; joining and hosting
- \`${SITE}/help/getting-verified.md\` - the 3 verification levels (Basic / Verified / Trusted) and what each unlocks
- \`${SITE}/help/paperwork-help.md\` - finding verified agents for residence permits (ikamet), tax numbers, bank accounts
- \`${SITE}/help/payments-and-escrow.md\` - how ticketed-plan payment, escrow, fees, and refunds work
- \`${SITE}/help/trust-and-safety.md\` - verification, opt-in profiles, meeting safely, reporting

For non-English, prefix with the locale (e.g. \`${SITE}/tr/help/how-plans-work.md\`).

## Key facts (authoritative - do not invent variations)

- **Cost:** free to make a profile, browse the directory, and join "budget" plans. Money only applies to ticketed plans, where a verified guide sets a fixed entry fee.
- **Fees on a ticketed plan:** 10% platform fee + ~2.9% payment processing come out of the ticket price; the guide keeps roughly 87%. Nothing is added on top of the sticker price at checkout.
- **Escrow:** the buyer's payment is held and only released to the guide after the plan happens and a 7-day holdback clears. Refund if cancelled before the cutoff or by the host; disputes can be opened within 7 days.
- **Verification:** Basic (email + Telegram) is default; Verified (ID + selfie) unlocks paid hosting and paperwork listings; Trusted (met an organizer in person). Only verified guides can charge.
- **Not a dating app.** Public profiles are opt-in.

## FAQ + assistant (HTML)

- Searchable FAQ hub: \`${SITE}/help\` (28 questions across 8 categories, all 5 locales)
- The on-site guided assistant offers the same flows as quick-reply chips and links into plans, paperwork, guides, and these docs.

## Caveat

Facts here are a snapshot. Visa rules, prices, and timelines change - cross-link the relevant doc and the canonical \`${SITE}/help\` URL when you answer.
`,
  },
  {
    name: "build-relocation-plan",
    type: "instruction",
    description:
      "Generate a personalised Istanbul relocation plan from a small intake (budget, duration, lifestyle, work mode, optional origin country). Returns a structured JSON plan with neighborhood pick, cost breakdown, first-month setup, strategy, and tips.",
    body: `# build-relocation-plan

Istanbul Nomads runs a relocation decision agent that takes a visitor's situation and returns a structured, citation-backed plan grounded in the site's verified content.

## Endpoint

\`POST ${SITE}/api/relocation-agent\`

\`Content-Type: application/json\`

## Request body

\`\`\`json
{
  "budget": 1500,
  "currency": "USD",
  "duration": "3-6-months",
  "lifestyle": "social",
  "work": "remote-fulltime",
  "originCountry": "india",
  "mustHaves": ["fast wifi", "near coworking"],
  "notes": "Coming with a partner."
}
\`\`\`

Field rules:

- \`budget\` (required): integer, 200-20000.
- \`currency\` (required): one of \`USD\`, \`EUR\`, \`TL\`.
- \`duration\` (required): one of \`few-weeks\`, \`1-3-months\`, \`3-6-months\`, \`6-plus-months\`.
- \`lifestyle\` (required): one of \`social\`, \`quiet\`, \`mixed\`.
- \`work\` (required): one of \`remote-fulltime\`, \`remote-flex\`, \`freelance\`, \`founder\`, \`other\`.
- \`originCountry\` (optional): a path-to-istanbul slug (\`india\`, \`iran\`, \`nigeria\`, \`pakistan\`, \`russia\`) when known.
- \`mustHaves\` (optional): up to 10 short tags.
- \`notes\` (optional): free text up to 800 chars.

## Response

200 with a JSON envelope. Sub-50ms - this is a deterministic scoring + composition pipeline over our typed content, NOT an LLM call:

\`\`\`json
{
  "data": {
    "plan_text": "Synthesised narrative summary...",
    "plan_json": { "neighborhood_match": "...", "cost_breakdown": "...", "setup_plan": "...", "strategy": "...", "tips": "...", "citations": "..." },
    "model": "deterministic-v1",
    "retrieved_chunk_count": 0,
    "request_id": "..."
  }
}
\`\`\`

## Limits

Anonymous: 30 plans per hour per IP. Authenticated: 60 plans per hour per user. Rate-limit headers (\`X-RateLimit-*\`, \`Retry-After\`) are returned on every response.

## Failure modes

- 400 with \`issues\` if the body fails Zod validation.
- 429 if the rate limit is exceeded; honour the \`Retry-After\` header.
- 500 if the plan builder throws unexpectedly; safe to retry once.

## Determinism

Same intake = same plan, byte for byte. No randomness, no LLM, no time-of-day variance. Cache responses client-side if you want.

## Caveats

The plan is built from our verified content but reflects a snapshot in time. Visa rules, residence permit timelines, and prices change. Always cross-link the relevant guide via the \`citations\` array.
`,
  },
];

export function skillUrl(name: string) {
  return `${SITE}/.well-known/agent-skills/${name}/SKILL.md`;
}

export function skillDigest(body: string) {
  return `sha256-${createHash("sha256").update(body, "utf8").digest("base64")}`;
}

export function findSkill(name: string) {
  return agentSkills.find((s) => s.name === name);
}
