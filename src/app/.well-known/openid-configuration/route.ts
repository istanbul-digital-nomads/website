import { NextResponse } from "next/server";

export const dynamic = "force-static";

// Supabase Auth is the OIDC provider for any protected endpoint on istanbulnomads.com.
// This document tells agents where to send users for authentication and where to fetch
// the signing keys that verify bearer tokens. Issuer and endpoints MUST match the
// tokens Supabase actually mints - we serve the metadata at our origin as a discovery
// hint, but all traffic is against the Supabase project URL.
const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://supabase.co";
const ISSUER = `${SUPABASE_URL}/auth/v1`;

export async function GET() {
  const metadata = {
    issuer: ISSUER,
    authorization_endpoint: `${ISSUER}/authorize`,
    token_endpoint: `${ISSUER}/token`,
    userinfo_endpoint: `${ISSUER}/user`,
    jwks_uri: `${ISSUER}/.well-known/jwks.json`,
    grant_types_supported: ["authorization_code", "refresh_token", "password"],
    response_types_supported: ["code", "token"],
    response_modes_supported: ["query", "fragment"],
    subject_types_supported: ["public"],
    id_token_signing_alg_values_supported: ["RS256", "ES256"],
    token_endpoint_auth_methods_supported: [
      "client_secret_basic",
      "client_secret_post",
      "none",
    ],
    scopes_supported: ["openid", "email", "profile"],
    code_challenge_methods_supported: ["S256"],
  };

  return NextResponse.json(metadata, {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
