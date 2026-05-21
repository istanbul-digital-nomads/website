import { NextResponse } from "next/server";
import { SITE_URL } from "@/lib/seo";
import { resolveShortLink } from "@/lib/short-links";

// GET /s/{code} -> 308 redirect to the canonical entity path. Sits outside
// the [locale] segment (like /api and sitemap.xml) so the short URL itself
// stays locale-less; it resolves to the unprefixed default-locale path.
// Unknown codes fall back to the homepage.
export async function GET(
  _request: Request,
  ctx: { params: Promise<{ code: string }> },
) {
  const { code } = await ctx.params;
  const path = code ? await resolveShortLink(code) : null;
  const target = path && path.startsWith("/") ? path : "/";
  return NextResponse.redirect(new URL(target, SITE_URL), 308);
}
