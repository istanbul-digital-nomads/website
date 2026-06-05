// Serwist service worker source. Compiled to public/sw.js at build time
// (withSerwistInit in next.config.mjs). Disabled in dev.
//
// Caching posture (auth-safe): we use Serwist's Next-aware `defaultCache`,
// which is NetworkFirst for navigations + RSC (so authenticated pages are
// never served stale while online) and CacheFirst only for hashed static
// assets, images, and fonts. It does not cache /api routes. Offline, the
// precached /offline page is served as the document fallback.
import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { NetworkOnly, Serwist } from "serwist";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

// Authenticated app routes (optionally locale-prefixed). Their HTML/RSC carries
// Supabase session state, so they must never enter any cache - not even as an
// RSC prefetch - or a stale/cross-account view could be served offline.
const AUTHED_ROUTE =
  /^(?:\/(?:tr|fa|ar|ru))?\/(?:dashboard|onboarding|today|paperwork|plans\/new|login)(?:\/|$)/;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [
    // First match wins: force network-only (no storage) for APIs, auth, and
    // authenticated pages, ahead of Serwist's Next defaultCache rules.
    {
      matcher: ({ url, sameOrigin }) =>
        sameOrigin &&
        (url.pathname.startsWith("/api") ||
          url.pathname.startsWith("/auth") ||
          AUTHED_ROUTE.test(url.pathname)),
      handler: new NetworkOnly(),
    },
    ...defaultCache,
  ],
  fallbacks: {
    entries: [
      {
        url: "/offline",
        matcher({ request }) {
          return request.destination === "document";
        },
      },
    ],
  },
});

serwist.addEventListeners();
