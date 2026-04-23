import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const SITE = "https://istanbulnomads.com";

const NO_MARKDOWN_PREFIXES = [
  "/dashboard",
  "/settings",
  "/login",
  "/auth",
  "/onboarding",
];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Skip Next internals, API routes, and well-known discovery paths entirely
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/.well-known")
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

  const hasMarkdown = !NO_MARKDOWN_PREFIXES.some((p) => pathname.startsWith(p));

  // Refresh Supabase session if auth cookies exist
  const hasAuthCookie = request.cookies
    .getAll()
    .some((c) => c.name.startsWith("sb-"));

  let response: NextResponse;

  if (!hasAuthCookie) {
    response = NextResponse.next();
  } else {
    response = NextResponse.next({
      request: { headers: request.headers },
    });

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
