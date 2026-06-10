import { createHmac, timingSafeEqual } from "crypto";

// Signed unsubscribe tokens. The welcome email embeds `?email=...&token=...`
// where token = HMAC(email). Without the secret a third party can't forge a
// link to unsubscribe someone else (the raw-email link the email used before
// was an open enumeration/abuse vector). Server-only - never import in a
// client component.
//
// Secret resolution: a dedicated NEWSLETTER_UNSUB_SECRET if set, else the
// service-role key (always present server-side), so this works with no new
// env var. Rotating either invalidates outstanding links, which is fine -
// a recipient can re-request from any newsletter footer.
function secret(): string {
  return (
    process.env.NEWSLETTER_UNSUB_SECRET ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    // Last-resort dev fallback so local builds don't throw; never hit in prod
    // where the service-role key is always set.
    "insecure-dev-only-secret"
  );
}

export function signUnsubscribe(email: string): string {
  return createHmac("sha256", secret())
    .update(email.trim().toLowerCase())
    .digest("hex")
    .slice(0, 32);
}

export function verifyUnsubscribe(email: string, token: string): boolean {
  if (!email || !token) return false;
  const expected = signUnsubscribe(email);
  if (token.length !== expected.length) return false;
  // Constant-time compare so a timing side-channel can't be used to forge.
  return timingSafeEqual(Buffer.from(token), Buffer.from(expected));
}
