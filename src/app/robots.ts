import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/constants";

/**
 * Policy for 2026:
 * - Allow search crawlers (Google, Bing, Yandex) everywhere except auth/admin.
 * - Allow AI engines that cite their sources (Perplexity, ChatGPT, Claude,
 *   You.com, Google AI Overview / Google-Extended) so we get included in
 *   answer-engine results.
 * - Block the training-only crawlers (GPTBot, CCBot) so our content isn't
 *   ingested wholesale into model weights without attribution.
 *
 * The `*` rule stays as the default allow so any well-behaved crawler not
 * listed here can still index the site.
 */
const COMMON_DISALLOW = [
  "/api/",
  "/_next/",
  "/dashboard",
  "/settings",
  "/auth",
  "/onboarding",
  "/login",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Default - all search engines and well-behaved crawlers.
      {
        userAgent: "*",
        allow: "/",
        disallow: COMMON_DISALLOW,
      },
      // AI answer engines that cite sources - opt-in for visibility.
      {
        userAgent: "PerplexityBot",
        allow: "/",
        disallow: COMMON_DISALLOW,
      },
      {
        userAgent: "ChatGPT-User",
        allow: "/",
        disallow: COMMON_DISALLOW,
      },
      {
        userAgent: "OAI-SearchBot",
        allow: "/",
        disallow: COMMON_DISALLOW,
      },
      {
        userAgent: "ClaudeBot",
        allow: "/",
        disallow: COMMON_DISALLOW,
      },
      {
        userAgent: "anthropic-ai",
        allow: "/",
        disallow: COMMON_DISALLOW,
      },
      {
        userAgent: "Claude-Web",
        allow: "/",
        disallow: COMMON_DISALLOW,
      },
      {
        userAgent: "Applebot-Extended",
        allow: "/",
        disallow: COMMON_DISALLOW,
      },
      {
        userAgent: "Google-Extended",
        allow: "/",
        disallow: COMMON_DISALLOW,
      },
      // Training-only crawlers - opted out (no public answer surface).
      {
        userAgent: "GPTBot",
        disallow: "/",
      },
      {
        userAgent: "CCBot",
        disallow: "/",
      },
      {
        userAgent: "FacebookBot",
        disallow: "/",
      },
      {
        userAgent: "Bytespider",
        disallow: "/",
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
