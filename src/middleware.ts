import { updateSession } from "@/lib/supabase/middleware";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match request paths that need auth session refresh.
     * Excludes:
     * - _next (all Next.js internals including static, image, data, RSC)
     * - api routes (handled separately)
     * - static files (svg, png, jpg, etc.)
     * - favicon.ico
     */
    "/((?!_next|api|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2)$).*)",
  ],
};
