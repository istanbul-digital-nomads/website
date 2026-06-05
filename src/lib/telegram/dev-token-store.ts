// Local-dev fallback for Telegram account-linking tokens when Upstash/KV isn't
// configured. Module-scope map; resets on cold start (fine for local dev only).
//
// Lives in lib (not a route file) so it can be shared between the /link and
// /webhook routes. App Router route files may only export handlers + config,
// so exporting this Map from a route.ts breaks the production (webpack) build's
// route type check.
export const devTokenStore = new Map<
  string,
  { userId: string; expiresAt: number }
>();
