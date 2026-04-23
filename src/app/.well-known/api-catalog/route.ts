import { NextResponse } from "next/server";

const SITE = "https://istanbulnomads.com";

export const dynamic = "force-static";

export async function GET() {
  const linkset = {
    linkset: [
      {
        anchor: `${SITE}/api/events`,
        "service-desc": [
          {
            href: `${SITE}/openapi.json`,
            type: "application/openapi+json",
            title: "OpenAPI 3.1 specification for the public events API",
          },
        ],
        "service-doc": [
          {
            href: `${SITE}/events`,
            type: "text/html",
            title: "Events calendar",
          },
          {
            href: `${SITE}/events.md`,
            type: "text/markdown",
            title: "Events calendar (markdown)",
          },
        ],
        status: [
          {
            href: `${SITE}/sitemap.xml`,
            type: "application/xml",
            title: "XML sitemap - confirms the origin is live",
          },
        ],
      },
      {
        anchor: `${SITE}/`,
        "service-desc": [
          {
            href: `${SITE}/openapi.json`,
            type: "application/openapi+json",
            title:
              "OpenAPI 3.1 spec for every publicly documented endpoint on the origin",
          },
        ],
        "service-doc": [
          {
            href: `${SITE}/llms.txt`,
            type: "text/plain",
            title:
              "Content index (llms.txt) - every guide, blog post, and directory on the site",
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
