import { NextResponse } from "next/server";
import { getAllBlogPosts } from "@/lib/blog";
import { guides } from "@/lib/data";
import { neighborhoods } from "@/lib/neighborhoods";
import { getSupportedCountries } from "@/lib/path-to-istanbul";

const SITE = "https://istanbulnomads.com";

export async function GET() {
  const blogPosts = getAllBlogPosts();
  const countries = getSupportedCountries();

  const body = `# Istanbul Digital Nomads

> The community hub for digital nomads living and working in Istanbul. Verified coworking spaces, neighborhood guides, visa and residency info, a weekly event calendar, and country-specific relocation playbooks.

Every HTML page on this site has a markdown equivalent. Append \`.md\` to any page URL, or send \`Accept: text/markdown\`.

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

## Policy

- Content signals: \`search=yes, ai-input=yes, ai-train=no\` (see ${SITE}/robots.txt)
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
