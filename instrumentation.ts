// Next.js instrumentation hook. Loads the Sentry SDK only on the server and
// edge runtimes - deliberately NO instrumentation-client.ts, so the browser
// bundle stays free of the ~35 KB Sentry SDK and the homepage Lighthouse
// score is unaffected. Server Components, route handlers, middleware, and
// SSR errors are all captured via onRequestError below; client-side crashes
// fall through to app/global-error.tsx.
import * as Sentry from "@sentry/nextjs";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  }
  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}

export const onRequestError = Sentry.captureRequestError;
