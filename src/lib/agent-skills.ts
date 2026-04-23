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
      "Fetch Istanbul Digital Nomads guides, blog posts, neighborhoods, and country relocation playbooks as markdown.",
    body: `# read-istanbul-content

Every HTML page on istanbulnomads.com has a markdown equivalent. Use this skill to read the site's content without parsing HTML.

## How to fetch markdown

Two equivalent options for any page URL:

1. Append \`.md\` to the URL. Example: \`${SITE}/guides/housing.md\`
2. Send \`Accept: text/markdown\` on the plain URL. Example: \`GET ${SITE}/guides/housing\` with header \`Accept: text/markdown\`.

Responses return \`Content-Type: text/markdown; charset=utf-8\`.

## Where to start

- Content index (every page with description): \`${SITE}/llms.txt\`
- Sitemap (all URLs, XML): \`${SITE}/sitemap.xml\`

## Content areas

- \`${SITE}/guides/<slug>.md\` - 11 core guides (neighborhoods, coworking, housing, cost-of-living, transport, internet, food, culture, entertainment, healthcare, visa)
- \`${SITE}/guides/neighborhoods/<slug>.md\` - per-neighborhood detail pages
- \`${SITE}/blog/<slug>.md\` - blog posts
- \`${SITE}/path-to-istanbul/<country>.md\` - country-specific relocation playbooks
- \`${SITE}/spaces.md\` - coworking and cafe directory
- \`${SITE}/events.md\` - upcoming community events

## Content usage policy

See \`${SITE}/robots.txt\`. Current signals: \`search=yes, ai-input=yes, ai-train=no\`. Honour these.
`,
  },
  {
    name: "find-coworking-spaces",
    type: "instruction",
    description:
      "Find coworking spaces and laptop-friendly cafes in Istanbul, filtered by neighborhood, wifi speed, price, and amenities.",
    body: `# find-coworking-spaces

Istanbul Digital Nomads maintains a verified directory of coworking spaces and laptop-friendly cafes.

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

Istanbul Digital Nomads runs a weekly event calendar for the nomad and remote-work community.

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
