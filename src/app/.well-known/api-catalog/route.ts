import { NextResponse } from "next/server";

const SITE = "https://istanbulnomads.com";

export const dynamic = "force-static";

export async function GET() {
  const linkset = {
    linkset: [
      {
        anchor: `${SITE}/`,
        "service-doc": [
          {
            href: `${SITE}/llms.txt`,
            type: "text/plain",
            title:
              "Content index (llms.txt) - every guide, blog post, and directory on the site",
          },
        ],
        status: [
          {
            href: `${SITE}/sitemap.xml`,
            type: "application/xml",
            title: "XML sitemap",
          },
        ],
        describedby: [
          {
            href: `${SITE}/robots.txt`,
            type: "text/plain",
            title: "robots.txt with Content-Signal directives",
          },
        ],
      },
      {
        anchor: `${SITE}/api/events`,
        "service-doc": [
          {
            href: `${SITE}/guides/entertainment.md`,
            type: "text/markdown",
            title: "What events are on - human overview",
          },
        ],
        related: [
          {
            href: `${SITE}/events.md`,
            type: "text/markdown",
            title: "Markdown feed of upcoming events",
          },
          {
            href: `${SITE}/events`,
            type: "text/html",
            title: "Events calendar (HTML)",
          },
        ],
      },
      {
        anchor: `${SITE}/spaces`,
        related: [
          {
            href: `${SITE}/spaces.md`,
            type: "text/markdown",
            title: "Coworking and cafe directory (markdown)",
          },
          {
            href: `${SITE}/guides/coworking.md`,
            type: "text/markdown",
            title: "Curated coworking picks with context",
          },
        ],
      },
    ],
  };

  return new NextResponse(JSON.stringify(linkset, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/linkset+json",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
