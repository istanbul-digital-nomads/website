import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "@/lib/i18n/routing";

const SITE = "https://istanbulnomads.com";
const CANONICAL_HOST = "istanbulnomads.com";

const NO_MARKDOWN_PREFIXES = [
  "/dashboard",
  "/settings",
  "/login",
  "/auth",
  "/onboarding",
];

const intlMiddleware = createIntlMiddleware(routing);

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Canonical host enforcement. Google indexed three host variants
  // (https://istanbulnomads.com, https://www.istanbulnomads.com,
  // http://www.istanbulnomads.com) which split link equity and confused
  // rankings. Redirect any non-canonical host to https://istanbulnomads.com
  // with a permanent 301 so search engines consolidate the signals.
  // Pass through during local dev (localhost / 127.0.0.1), on Vercel
  // preview deployments (*.vercel.app), and on the dev environment
  // (dev.istanbulnomads.com) so dev and PR previews keep working.
  const host = request.headers.get("host") || "";
  const proto =
    request.headers.get("x-forwarded-proto") ||
    request.nextUrl.protocol.replace(":", "");
  const isLocalHost =
    host.startsWith("localhost") || host.startsWith("127.0.0.1");
  const isVercelPreview = host.endsWith(".vercel.app");
  const isDevHost = host === "dev.istanbulnomads.com";
  if (
    !isLocalHost &&
    !isVercelPreview &&
    !isDevHost &&
    (host !== CANONICAL_HOST || proto !== "https")
  ) {
    const target = new URL(request.nextUrl.toString());
    target.protocol = "https:";
    target.host = CANONICAL_HOST;
    return NextResponse.redirect(target, 301);
  }

  // Skip Next internals, API routes, well-known discovery paths, and the
  // root-level metadata routes (icon / apple-icon / opengraph-image at the
  // app root - not the per-route ones under [locale]). next-intl middleware
  // would otherwise try to apply locale routing to these, which 404s the
  // generated PNGs since they live at the root segment.
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/.well-known") ||
    pathname === "/icon" ||
    pathname === "/apple-icon" ||
    pathname === "/sitemap.xml" ||
    pathname === "/robots.txt" ||
    pathname === "/llms.txt" ||
    pathname === "/openapi.json"
  ) {
    return NextResponse.next();
  }

  // Markdown content negotiation: rewrite .md URLs to the markdown API
  if (pathname.endsWith(".md")) {
    const cleanPath = pathname.replace(/\.md$/, "") || "/";
    const rewritten = request.nextUrl.clone();
    rewritten.pathname = `/api/md${cleanPath === "/" ? "" : cleanPath}`;
    return NextResponse.rewrite(rewritten);
  }

  // Markdown content negotiation: Accept: text/markdown on an HTML URL
  const accept = request.headers.get("accept") || "";
  if (accept.includes("text/markdown") && !pathname.includes(".")) {
    const rewritten = request.nextUrl.clone();
    rewritten.pathname = `/api/md${pathname === "/" ? "" : pathname}`;
    const r = NextResponse.rewrite(rewritten);
    r.headers.set("Vary", "Accept");
    return r;
  }

  // Skip static assets (any path with an extension, besides .md handled above)
  if (pathname.includes(".")) {
    return NextResponse.next();
  }

  // Run next-intl locale routing first. It will rewrite/redirect based on
  // the URL prefix and the default locale's `as-needed` policy.
  let response = intlMiddleware(request);

  const hasMarkdown = !NO_MARKDOWN_PREFIXES.some((p) => pathname.startsWith(p));

  // Refresh Supabase session if auth cookies exist, layering on top of intl's response
  const hasAuthCookie = request.cookies
    .getAll()
    .some((c) => c.name.startsWith("sb-"));

  if (hasAuthCookie) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              request.cookies.set(name, value);
              response.cookies.set(name, value, options);
            });
          },
        },
      },
    );

    await supabase.auth.getUser();
  }

  if (hasMarkdown) {
    const mdPath = pathname === "/" ? "/index.md" : `${pathname}.md`;
    response.headers.append(
      "Link",
      `<${SITE}${mdPath}>; rel="alternate"; type="text/markdown"`,
    );
    response.headers.set("Vary", "Accept");
  }

  return response;
}

export const config = {
  matcher: [
    // Only match page routes, not assets or API
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2)$).*)",
  ],
};
