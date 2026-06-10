// Sentry server-side init. No-ops when SENTRY_DSN is unset (e.g. local dev,
// previews without the secret), so it's safe to ship before the DSN is wired.
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  // Low trace sampling - we want errors, not a full performance bill.
  tracesSampleRate: 0.1,
  // Don't spam the console in dev; only emit when something's actually wrong.
  enabled: !!process.env.SENTRY_DSN,
  environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV,
});
