import { NextResponse } from "next/server";
import { spaces, type NomadSpace } from "@/lib/spaces";
import { guides } from "@/lib/data";
import { getAllBlogPosts, getBlogPost } from "@/lib/blog";
import { getEventsPublic } from "@/lib/supabase/queries";
import { getMarkdownForPath } from "@/lib/markdown";

export const dynamic = "force-dynamic";

const PROTOCOL_VERSION = "2024-11-05";

const SERVER_INFO = {
  name: "istanbul-nomads-content",
  version: "0.1.0",
  title: "Istanbul Digital Nomads content server",
};

const TOOLS = [
  {
    name: "list_spaces",
    description:
      "List verified coworking spaces and laptop-friendly cafes in Istanbul. Optionally filter by neighborhood (e.g. 'Kadikoy', 'Besiktas') or type ('cafe' or 'coworking').",
    inputSchema: {
      type: "object",
      properties: {
        neighborhood: {
          type: "string",
          description: "Case-insensitive neighborhood name to filter by.",
        },
        type: {
          type: "string",
          enum: ["cafe", "coworking"],
          description: "Filter to cafes or coworking spaces only.",
        },
        laptop_friendly: {
          type: "boolean",
          description: "If true, only return spaces marked laptop_friendly.",
        },
      },
      additionalProperties: false,
    },
  },
  {
    name: "list_guides",
    description:
      "List all published Istanbul guides (neighborhoods, visa, housing, cost-of-living, coworking, transport, internet, food, culture, entertainment, healthcare). Returns slugs and one-line descriptions.",
    inputSchema: {
      type: "object",
      properties: {},
      additionalProperties: false,
    },
  },
  {
    name: "get_guide",
    description:
      "Fetch the full markdown body of a single guide by slug (e.g. 'housing', 'coworking', 'cost-of-living').",
    inputSchema: {
      type: "object",
      properties: {
        slug: {
          type: "string",
          description: "Guide slug. See list_guides for available slugs.",
        },
      },
      required: ["slug"],
      additionalProperties: false,
    },
  },
  {
    name: "list_blog_posts",
    description:
      "List Istanbul Digital Nomads blog posts with title, slug, date, and description.",
    inputSchema: {
      type: "object",
      properties: {},
      additionalProperties: false,
    },
  },
  {
    name: "get_blog_post",
    description: "Fetch the full markdown body of a single blog post by slug.",
    inputSchema: {
      type: "object",
      properties: {
        slug: {
          type: "string",
          description:
            "Blog post slug. See list_blog_posts for available slugs.",
        },
      },
      required: ["slug"],
      additionalProperties: false,
    },
  },
  {
    name: "list_events",
    description:
      "List upcoming community events (meetups, coworking sessions, workshops, social). Returns next `limit` events sorted by date ascending.",
    inputSchema: {
      type: "object",
      properties: {
        limit: { type: "integer", minimum: 1, maximum: 50, default: 10 },
        type: {
          type: "string",
          enum: ["meetup", "coworking", "workshop", "social"],
        },
      },
      additionalProperties: false,
    },
  },
];

const textResult = (text: string) => ({
  content: [{ type: "text", text }],
});

async function callTool(name: string, args: Record<string, unknown> = {}) {
  switch (name) {
    case "list_spaces": {
      const n =
        typeof args.neighborhood === "string"
          ? args.neighborhood.toLowerCase()
          : null;
      const t = typeof args.type === "string" ? args.type : null;
      const lf = args.laptop_friendly === true;
      let out: NomadSpace[] = spaces.filter((s) => s.status !== "closed");
      if (n) out = out.filter((s) => s.neighborhood.toLowerCase().includes(n));
      if (t) out = out.filter((s) => s.type === t);
      if (lf) out = out.filter((s) => s.laptop_friendly);
      return textResult(
        JSON.stringify(
          out.map((s) => ({
            id: s.id,
            name: s.name,
            type: s.type,
            neighborhood: s.neighborhood,
            address: s.address,
            laptop_friendly: s.laptop_friendly,
            wifi_speed: s.wifi_speed ?? null,
            price_range: s.price_range ?? null,
            website: s.website ?? null,
            url: `https://istanbulnomads.com/spaces#${s.id}`,
          })),
          null,
          2,
        ),
      );
    }
    case "list_guides": {
      return textResult(
        JSON.stringify(
          guides.map((g) => ({
            slug: g.slug,
            title: g.title,
            description: g.description,
            category: g.category,
            url: `https://istanbulnomads.com/guides/${g.slug}.md`,
          })),
          null,
          2,
        ),
      );
    }
    case "get_guide": {
      const slug = typeof args.slug === "string" ? args.slug : "";
      if (!guides.some((g) => g.slug === slug)) {
        return textResult(`Guide not found: ${slug}`);
      }
      const md = getMarkdownForPath(`/guides/${slug}`);
      return textResult(md?.body ?? `Guide markdown unavailable: ${slug}`);
    }
    case "list_blog_posts": {
      const posts = getAllBlogPosts();
      return textResult(
        JSON.stringify(
          posts.map((p) => ({
            slug: p.slug,
            title: p.title,
            date: p.date,
            description: p.description,
            url: `https://istanbulnomads.com/blog/${p.slug}.md`,
          })),
          null,
          2,
        ),
      );
    }
    case "get_blog_post": {
      const slug = typeof args.slug === "string" ? args.slug : "";
      if (!getBlogPost(slug)) return textResult(`Blog post not found: ${slug}`);
      const md = getMarkdownForPath(`/blog/${slug}`);
      return textResult(md?.body ?? `Blog post markdown unavailable: ${slug}`);
    }
    case "list_events": {
      const limit = typeof args.limit === "number" ? args.limit : 10;
      const type = typeof args.type === "string" ? args.type : undefined;
      const { data, error } = await getEventsPublic({
        past: false,
        limit,
        type,
      });
      if (error) return textResult(`Error fetching events: ${error.message}`);
      return textResult(
        JSON.stringify(
          (data ?? []).map((e) => ({
            id: e.id,
            title: e.title,
            type: e.type,
            date: e.date,
            location_name: e.location_name,
            description: e.description,
            url: `https://istanbulnomads.com/events`,
          })),
          null,
          2,
        ),
      );
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

type JsonRpcRequest = {
  jsonrpc?: string;
  id?: string | number | null;
  method?: string;
  params?: Record<string, unknown>;
};

async function handleRpc(rpc: JsonRpcRequest) {
  const { id = null, method, params = {} } = rpc;
  if (method === "initialize") {
    return {
      jsonrpc: "2.0",
      id,
      result: {
        protocolVersion: PROTOCOL_VERSION,
        capabilities: { tools: {} },
        serverInfo: SERVER_INFO,
      },
    };
  }
  if (method === "tools/list") {
    return { jsonrpc: "2.0", id, result: { tools: TOOLS } };
  }
  if (method === "tools/call") {
    const name = typeof params.name === "string" ? params.name : "";
    const args = (params.arguments as Record<string, unknown>) ?? {};
    try {
      const result = await callTool(name, args);
      return { jsonrpc: "2.0", id, result };
    } catch (e) {
      return {
        jsonrpc: "2.0",
        id,
        result: {
          ...textResult(`Tool error: ${(e as Error).message}`),
          isError: true,
        },
      };
    }
  }
  if (method === "ping") {
    return { jsonrpc: "2.0", id, result: {} };
  }
  if (method === "notifications/initialized") {
    return null;
  }
  return {
    jsonrpc: "2.0",
    id,
    error: { code: -32601, message: `Method not found: ${method}` },
  };
}

export async function POST(request: Request) {
  let body: JsonRpcRequest | JsonRpcRequest[];
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        jsonrpc: "2.0",
        id: null,
        error: { code: -32700, message: "Parse error" },
      },
      { status: 400 },
    );
  }
  if (Array.isArray(body)) {
    const responses = (await Promise.all(body.map(handleRpc))).filter(
      (r) => r !== null,
    );
    return NextResponse.json(responses);
  }
  const resp = await handleRpc(body);
  if (resp === null) return new NextResponse(null, { status: 204 });
  return NextResponse.json(resp);
}

export async function GET() {
  return NextResponse.json({
    name: SERVER_INFO.name,
    version: SERVER_INFO.version,
    protocolVersion: PROTOCOL_VERSION,
    transport: "http+json-rpc",
    documentation:
      "POST JSON-RPC 2.0 requests to this endpoint. See /.well-known/mcp/server-card.json for the server card.",
    methods: ["initialize", "tools/list", "tools/call", "ping"],
  });
}
