import type { Metadata } from "next";
import { routing } from "@/lib/i18n/routing";

// Offline fallback served by the service worker when a document navigation
// fails (no connection). Kept fully static - no data/cookies/headers reads -
// so it prerenders cleanly under cacheComponents and can be precached. Copy is
// English on purpose: when truly offline we can't reliably resolve the locale,
// and one cached document is more robust than five.
export const metadata: Metadata = {
  title: "Offline",
  robots: { index: false, follow: false },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default function OfflinePage() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-5 px-6 text-center">
      <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-paper-faint">
        No connection
      </span>
      <h1 className="font-display text-4xl text-paper md:text-5xl">
        You&apos;re offline
      </h1>
      <p className="max-w-sm text-[15px] leading-relaxed text-paper-mute">
        Looks like the connection dropped. Check your network - we&apos;ll be
        right here when you&apos;re back.
      </p>
    </div>
  );
}
