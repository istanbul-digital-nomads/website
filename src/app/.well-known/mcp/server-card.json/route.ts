import { NextResponse } from "next/server";

const SITE = "https://istanbulnomads.com";

export const dynamic = "force-static";

export async function GET() {
  const card = {
    $schema:
      "https://raw.githubusercontent.com/modelcontextprotocol/modelcontextprotocol/main/schema/draft/server-card.schema.json",
    serverInfo: {
      name: "istanbul-nomads-content",
      version: "0.1.0",
      title: "Istanbul Digital Nomads content server",
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
      "Read-only MCP server exposing Istanbul Digital Nomads content. Tools: list_spaces, list_guides, get_guide, list_blog_posts, get_blog_post, list_events. No authentication required.",
    documentation: `${SITE}/.well-known/agent-skills/index.json`,
  };

  return NextResponse.json(card, {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
