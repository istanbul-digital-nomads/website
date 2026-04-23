"use client";

import { useEffect } from "react";

const SITE = "https://istanbulnomads.com";

type ToolInput = Record<string, unknown>;

async function fetchMarkdown(path: string): Promise<string> {
  const res = await fetch(path, { headers: { Accept: "text/markdown" } });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${path}`);
  return res.text();
}

const TOOLS = [
  {
    name: "search_istanbul_spaces",
    title: "Search coworking and cafes",
    description:
      "Search verified coworking spaces and laptop-friendly cafes in Istanbul. Returns a markdown directory with names, neighborhoods, wifi speeds, and prices.",
    inputSchema: {
      type: "object",
      properties: {
        neighborhood: {
          type: "string",
          description: "Optional neighborhood filter, e.g. 'Kadikoy'.",
        },
      },
      additionalProperties: false,
    },
    async execute(input: ToolInput) {
      const md = await fetchMarkdown(`${SITE}/spaces.md`);
      const n =
        typeof input?.neighborhood === "string"
          ? input.neighborhood.toLowerCase()
          : null;
      if (!n) return md;
      const filtered = md
        .split(/\n(?=## )/)
        .filter((block, i) => i === 0 || block.toLowerCase().includes(n))
        .join("\n");
      return filtered || md;
    },
  },
  {
    name: "open_istanbul_guide",
    title: "Open a nomad guide",
    description:
      "Fetch the markdown body of an Istanbul nomad guide by slug. Valid slugs include: neighborhoods, coworking, housing, cost-of-living, transport, internet, food, culture, entertainment, healthcare, visa.",
    inputSchema: {
      type: "object",
      properties: {
        slug: { type: "string" },
      },
      required: ["slug"],
      additionalProperties: false,
    },
    async execute(input: ToolInput) {
      const slug = typeof input?.slug === "string" ? input.slug : "";
      if (!slug) throw new Error("slug is required");
      return fetchMarkdown(`${SITE}/guides/${slug}.md`);
    },
  },
  {
    name: "list_upcoming_istanbul_events",
    title: "List upcoming nomad events",
    description:
      "List upcoming Istanbul Digital Nomads community events - meetups, coworking sessions, workshops, social gatherings.",
    inputSchema: {
      type: "object",
      properties: {
        limit: { type: "integer", minimum: 1, maximum: 50, default: 10 },
      },
      additionalProperties: false,
    },
    async execute(input: ToolInput) {
      const limit = typeof input?.limit === "number" ? input.limit : 10;
      const res = await fetch(`${SITE}/api/events?past=false&limit=${limit}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const payload = await res.json();
      return JSON.stringify(payload.data ?? [], null, 2);
    },
  },
  {
    name: "list_istanbul_blog_posts",
    title: "List nomad blog posts",
    description:
      "List Istanbul Digital Nomads blog posts with title, slug, date, and description. Fetch individual posts via /blog/<slug>.md.",
    inputSchema: {
      type: "object",
      properties: {},
      additionalProperties: false,
    },
    async execute() {
      return fetchMarkdown(`${SITE}/llms.txt`);
    },
  },
];

interface ModelContextTool {
  name: string;
  title?: string;
  description: string;
  inputSchema?: object;
  execute: (input: ToolInput) => Promise<unknown>;
}

interface ModelContext {
  registerTool?: (tool: ModelContextTool) => unknown;
  provideContext?: (ctx: { tools: ModelContextTool[] }) => unknown;
}

export function WebMcpRegister() {
  useEffect(() => {
    if (typeof navigator === "undefined") return;
    const mc = (navigator as unknown as { modelContext?: ModelContext })
      .modelContext;
    if (!mc) return;
    try {
      if (typeof mc.registerTool === "function") {
        for (const tool of TOOLS) mc.registerTool(tool);
        return;
      }
      if (typeof mc.provideContext === "function") {
        mc.provideContext({ tools: TOOLS });
      }
    } catch {
      // Agents that don't implement the API surface should not break the page.
    }
  }, []);

  return null;
}
