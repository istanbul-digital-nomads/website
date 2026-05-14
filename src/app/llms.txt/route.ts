import { NextResponse } from "next/server";
import { getAllBlogPosts } from "@/lib/blog";
import { guides } from "@/lib/data";
import { neighborhoods } from "@/lib/neighborhoods";
import { getSupportedCountries } from "@/lib/path-to-istanbul";

const SITE = "https://istanbulnomads.com";

export async function GET() {
  const blogPosts = getAllBlogPosts();
  const countries = getSupportedCountries();

  const body = `# Istanbul Nomads

> The community hub for digital nomads living and working in Istanbul. Verified coworking spaces, neighborhood guides, visa and residency info, a weekly event calendar, and country-specific relocation playbooks. Content is available in English (default), Turkish (\`/tr\`), Persian (\`/fa\`), Arabic (\`/ar\`), and Russian (\`/ru\`).

Every HTML page on this site has a markdown equivalent. Append \`.md\` to any page URL, or send \`Accept: text/markdown\`. For non-English content, prefix the URL with the locale code (e.g. \`${SITE}/tr/guides/visa.md\`).

## Site sections

- Home: ${SITE}/
- City guides (11 evergreen topics): ${SITE}/guides
- Neighborhoods (10 walkthroughs): ${SITE}/guides/neighborhoods
- Blog (long-form posts, regularly updated): ${SITE}/blog
- Path to Istanbul (country-specific relocation playbooks): ${SITE}/path-to-istanbul
- Nomad Spaces (verified coworking + cafe directory): ${SITE}/spaces
- Events (weekly community calendar): ${SITE}/events
- First Week Planner (interactive 7-day plan): ${SITE}/tools/first-week-planner
- Local Guides (vetted human guides directory): ${SITE}/local-guides
- About: ${SITE}/about
- Contact: ${SITE}/contact

## Available locales

- English: ${SITE}/ (canonical)
- Turkish: ${SITE}/tr/
- Persian: ${SITE}/fa/
- Arabic: ${SITE}/ar/
- Russian: ${SITE}/ru/

All routes resolve in every locale. Hreflang alternates are emitted on every page.

## Core guides

${guides.map((g) => `- [${g.title}](${SITE}/guides/${g.slug}.md): ${g.description}`).join("\n")}

## Neighborhoods

${neighborhoods.map((n) => `- [${n.name}](${SITE}/guides/neighborhoods/${n.slug}.md): ${n.oneLiner}`).join("\n")}

## Blog posts

${blogPosts.map((p) => `- [${p.title}](${SITE}/blog/${p.slug}.md): ${p.description}`).join("\n")}

## Path to Istanbul (country relocation guides)

${countries.map((c) => `- [${c.flag} ${c.name} to Istanbul](${SITE}/path-to-istanbul/${c.slug}.md)`).join("\n")}

## Directories

- [Coworking and cafes](${SITE}/spaces.md)
- [Events calendar](${SITE}/events.md)
- [Local guides](${SITE}/local-guides.md)

## Agent endpoints

- Agent Skills index: ${SITE}/.well-known/agent-skills/index.json
- MCP server card: ${SITE}/.well-known/mcp/server-card.json
- MCP endpoint (HTTP): ${SITE}/api/mcp
- Relocation Agent API (deterministic, no LLM): ${SITE}/api/relocation-agent
- OpenAPI spec: ${SITE}/openapi.json

## Policy

- Content signals: \`search=yes, ai-input=yes, ai-train=no\` (see ${SITE}/robots.txt)
- Citation requested when content is paraphrased or quoted
- Sitemap: ${SITE}/sitemap.xml
`;

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
