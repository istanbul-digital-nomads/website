"use client";

// Root error boundary. This replaces the entire document when the root
// layout itself throws, so it ships its own <html>/<body> and inline styles
// (the app's CSS and i18n context aren't guaranteed here). Plain English on
// purpose - by the time this renders we can't trust the locale layer.
//
// No Sentry client import: keeping the browser bundle SDK-free protects the
// Lighthouse score. Server, SSR, and route-handler errors are already
// captured via instrumentation.ts; this is the last-resort UI for a hard
// client crash, not a reporting hook.
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface the digest in the console so a support request can quote it;
    // the matching server log (with the stack) is findable by the same id.
    console.error("Root error boundary:", error.digest ?? error.message);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#06101f",
          color: "#f6ecd9",
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif",
          padding: "1.5rem",
        }}
      >
        <div style={{ maxWidth: 460, textAlign: "center" }}>
          <p
            style={{
              fontSize: 11,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "rgba(244,184,96,0.7)",
              margin: "0 0 1rem",
            }}
          >
            Something broke
          </p>
          <h1
            style={{
              fontSize: 28,
              lineHeight: 1.2,
              fontWeight: 400,
              margin: "0 0 0.75rem",
            }}
          >
            That page didn&apos;t load right.
          </h1>
          <p
            style={{
              fontSize: 15,
              lineHeight: 1.6,
              color: "rgba(246,236,217,0.7)",
              margin: "0 0 1.75rem",
            }}
          >
            It&apos;s on us, not you. Try again - and if it keeps happening,
            ping us on Telegram and we&apos;ll sort it out.
          </p>
          <div
            style={{
              display: "flex",
              gap: 12,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <button
              type="button"
              onClick={reset}
              style={{
                border: "none",
                borderRadius: 9999,
                background: "#f4b860",
                color: "#06101f",
                fontSize: 14,
                fontWeight: 600,
                padding: "0.75rem 1.4rem",
                cursor: "pointer",
              }}
            >
              Try again
            </button>
            {/* Plain anchor on purpose: global-error replaces the root layout
                when the app has crashed, so next/link's router context isn't
                available here. */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a
              href="/"
              style={{
                borderRadius: 9999,
                border: "1px solid rgba(246,236,217,0.25)",
                color: "#f6ecd9",
                fontSize: 14,
                padding: "0.75rem 1.4rem",
                textDecoration: "none",
              }}
            >
              Back home
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
