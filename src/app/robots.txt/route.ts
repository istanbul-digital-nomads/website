import { NextResponse } from "next/server";
import { siteConfig } from "@/lib/constants";

// robots.txt is a raw-text Route Handler (not the typed `robots.ts`
// metadata file) so it can emit the `Content-Signal` directive, which
// declares our AI content-usage preferences per crawler group.
// Spec: https://contentsignals.org/ +
// https://datatracker.ietf.org/doc/draft-romm-aipref-contentsignals/
//
// Policy for 2026:
// - Allow search crawlers + AI answer engines that cite sources (so we're
//   included in answer-engine results). Their content signal:
//   `ai-train=no, search=yes, ai-input=yes` - indexing and grounded
//   answers welcome, wholesale training ingestion is not.
// - Block training-only crawlers (GPTBot, CCBot, etc.) entirely, with an
//   all-no content signal for good measure.

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

const ALLOW_SIGNAL = "ai-train=no, search=yes, ai-input=yes";
const BLOCK_SIGNAL = "ai-train=no, search=no, ai-input=no";

function allowGroup(agent: string): string {
  return [
    `User-agent: ${agent}`,
    `Content-Signal: ${ALLOW_SIGNAL}`,
    `Allow: /`,
    ...DISALLOW.map((d) => `Disallow: ${d}`),
  ].join("\n");
}

function blockGroup(agent: string): string {
  return [
    `User-agent: ${agent}`,
    `Content-Signal: ${BLOCK_SIGNAL}`,
    `Disallow: /`,
  ].join("\n");
}

export function GET() {
  const body = [
    ...ALLOW_AGENTS.map(allowGroup),
    ...BLOCK_AGENTS.map(blockGroup),
    `Host: ${SITE}`,
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
