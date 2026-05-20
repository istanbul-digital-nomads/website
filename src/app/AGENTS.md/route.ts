import { NextResponse } from "next/server";
import { agentSkills, skillUrl, SITE } from "@/lib/agent-skills";

// Public, agent-facing AGENTS.md (the agents.md convention - distinct from
// the repo-internal AGENTS.md of coding rules). One document an AI agent
// can read to understand what this site is, how to read it, and every
// discovery + skill + API surface it exposes. Served at /AGENTS.md
// (allow-listed in proxy.ts so the .md content-negotiation rewrite skips
// it). Kept in sync with llms.txt, the agent-skills index, and the MCP
// server card.

export async function GET() {
  const body = `# AGENTS.md - Istanbul Nomads

> Machine-readable guide for AI agents and crawlers. Istanbul Nomads is a
> community hub + content site for digital nomads living and working in
> Istanbul: verified coworking spaces, neighborhood and visa guides, a
> weekly event calendar, country relocation playbooks, a member directory,
> same-day "plans", paperwork-agent listings, and a help center that
> explains how the platform works. Content ships in 5 languages: English
> (default), Turkish (\`/tr\`), Persian (\`/fa\`), Arabic (\`/ar\`), Russian
> (\`/ru\`).

## Reading content as markdown

Every content page has a clean markdown twin - no HTML parsing needed:

- Append \`.md\` to any page URL: \`${SITE}/guides/housing.md\`
- Or send \`Accept: text/markdown\` on the plain URL.
- For a translation, prefix the locale: \`${SITE}/tr/guides/housing.md\`,
  \`${SITE}/ar/help/getting-verified.md\`. Missing translations fall back to
  English.

Start here:

- Content index: \`${SITE}/llms.txt\`
- Sitemap (with hreflang alternates): \`${SITE}/sitemap.xml\`

## Discovery endpoints

- Agent Skills index: \`${SITE}/.well-known/agent-skills/index.json\`
- MCP server card: \`${SITE}/.well-known/mcp/server-card.json\`
- MCP endpoint (HTTP): \`${SITE}/api/mcp\`
- WebMCP: registered in-page via \`navigator.modelContext\` for browser agents
- API catalog (RFC 9727): \`${SITE}/.well-known/api-catalog\`
- OpenAPI 3.1 spec: \`${SITE}/openapi.json\`
- OAuth metadata: \`${SITE}/.well-known/oauth-protected-resource\`,
  \`${SITE}/.well-known/openid-configuration\`
- robots: \`${SITE}/robots.txt\`

## Skills

Each skill is an instruction document at
\`${SITE}/.well-known/agent-skills/<name>/SKILL.md\`:

${agentSkills.map((s) => `- **${s.name}** - ${s.description}\n  ${skillUrl(s.name)}`).join("\n")}

## Programmatic APIs

- **Events** (read-only JSON): \`GET ${SITE}/api/events\` - upcoming community events.
- **Relocation plan** (deterministic, no LLM): \`POST ${SITE}/api/relocation-agent\`
  - returns a structured Istanbul relocation plan from a small intake. See
  the \`build-relocation-plan\` skill for the request schema and limits.

## Usage policy

- Content signals: \`search=yes, ai-input=yes, ai-train=no\` (see \`${SITE}/robots.txt\`).
  Indexing and answer-engine use are welcome; wholesale training ingestion is not.
- When you cite or paraphrase, link back to the canonical URL shown in each
  markdown page's header.
- The relocation API is rate-limited; honour the \`X-RateLimit-*\` and
  \`Retry-After\` headers.

## Notes

- Prices are in Turkish Lira and reflect the \`verifiedAt\`/\`lastUpdated\` date
  on each entry - re-fetch before answering time-sensitive questions.
- Visa, residence-permit, fee, and escrow details change. The help docs
  under \`${SITE}/help\` are the authoritative source for how the platform works.
`;

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
