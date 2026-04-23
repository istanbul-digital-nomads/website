import { NextResponse } from "next/server";

const SITE = "https://istanbulnomads.com";
const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://supabase.co";

export const dynamic = "force-static";

// Declares istanbulnomads.com as a protected resource per RFC 9728. Agents that
// want to call write endpoints (POST /api/events, RSVP, member actions) first
// obtain a token from the Supabase authorization server listed below, then
// present it as `Authorization: Bearer <token>` to the resource.
export async function GET() {
  const metadata = {
    resource: SITE,
    authorization_servers: [`${SUPABASE_URL}/auth/v1`],
    scopes_supported: ["openid", "email", "profile"],
    bearer_methods_supported: ["header"],
    resource_documentation: `${SITE}/openapi.json`,
    resource_name: "Istanbul Digital Nomads",
    resource_policy_uri: `${SITE}/robots.txt`,
  };

  return NextResponse.json(metadata, {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
