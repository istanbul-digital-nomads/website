import { NextResponse } from "next/server";
import { siteConfig } from "@/lib/constants";

// robots.txt is a raw-text Route Handler (not the typed `robots.ts`
// metadata file) so we keep full control of the emitted directives.
//
// Policy for 2026:
// - Allow search crawlers + AI answer engines that cite sources (so we're
//   included in answer-engine results) - indexing and grounded answers
//   welcome, wholesale training ingestion is not.
// - Block training-only crawlers (GPTBot, CCBot, etc.) entirely.
//
// Our AI content-usage preference (`ai-train=no, search=yes, ai-input=yes`)
// is now broadcast via the `Content-Signal` HTTP response header (see
// next.config.mjs) rather than as a robots.txt directive: robots.txt
// validators - including Lighthouse's SEO audit - flag unknown directives
// as errors. The standard Allow/Disallow rules below still gate crawlers.

const SITE = siteConfig.url;

const DISALLOW = [
  "/api/",
  "/_next/",
  "/dashboard",
  "/settings",
  "/auth",
  "/onboarding",
  "/login",
];

// Allow groups: default + AI answer engines that cite sources.
const ALLOW_AGENTS = [
  "*",
  "PerplexityBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "ClaudeBot",
  "anthropic-ai",
  "Claude-Web",
  "Applebot-Extended",
  "Google-Extended",
];

// Training-only crawlers - fully opted out.
const BLOCK_AGENTS = ["GPTBot", "CCBot", "FacebookBot", "Bytespider"];

function allowGroup(agent: string): string {
  return [
    `User-agent: ${agent}`,
    `Allow: /`,
    ...DISALLOW.map((d) => `Disallow: ${d}`),
  ].join("\n");
}

function blockGroup(agent: string): string {
  return [`User-agent: ${agent}`, `Disallow: /`].join("\n");
}

export function GET() {
  const body = [
    ...ALLOW_AGENTS.map(allowGroup),
    ...BLOCK_AGENTS.map(blockGroup),
    `Sitemap: ${SITE}/sitemap.xml`,
    "",
  ].join("\n\n");

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=86400",
    },
  });
}
