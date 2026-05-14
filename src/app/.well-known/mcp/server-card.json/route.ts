import { NextResponse } from "next/server";

const SITE = "https://istanbulnomads.com";

export async function GET() {
  const card = {
    $schema:
      "https://raw.githubusercontent.com/modelcontextprotocol/modelcontextprotocol/main/schema/draft/server-card.schema.json",
    serverInfo: {
      name: "istanbul-nomads-content",
      version: "0.1.0",
      title: "Istanbul Nomads content server",
    },
    protocolVersion: "2024-11-05",
    transport: {
      type: "http",
      endpoint: `${SITE}/api/mcp`,
    },
    endpoint: `${SITE}/api/mcp`,
    capabilities: {
      tools: {
        listChanged: false,
      },
    },
    instructions:
      "Read-only MCP server exposing Istanbul Nomads content. Tools: list_spaces (filter by neighborhood, type, laptop_friendly), list_guides, get_guide (markdown body by slug), list_blog_posts, get_blog_post, list_events. For per-locale content (en, tr, fa, ar, ru), fetch the markdown URL directly via the locale-prefixed route - e.g. https://istanbulnomads.com/tr/guides/visa.md - or call the relocation plan API at https://istanbulnomads.com/api/relocation-agent for a deterministic, citation-backed Istanbul relocation plan. No authentication required.",
    documentation: `${SITE}/.well-known/agent-skills/index.json`,
  };

  return NextResponse.json(card, {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
