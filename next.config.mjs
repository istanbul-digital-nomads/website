import createNextIntlPlugin from "next-intl/plugin";
import withSerwistInit from "@serwist/next";

const withNextIntl = createNextIntlPlugin("./src/lib/i18n/request.ts");

// PWA service worker. swSrc compiles to public/sw.js at build time. Disabled in
// dev so it never caches during local work / HMR. Serwist needs the webpack
// build path on Next 16 (the `build` script passes --webpack); dev stays on
// Turbopack. cacheOnNavigation lets visited pages work offline (NetworkFirst,
// so they're never stale while online); reloadOnOnline refreshes when the
// connection returns.
const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  cacheOnNavigation: true,
  reloadOnOnline: true,
  // Precache the offline fallback so it's available even on a never-visited
  // page. Bump the revision when the offline page copy changes.
  additionalPrecacheEntries: [{ url: "/offline", revision: "offline-v1" }],
  disable: process.env.NODE_ENV === "development",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  compress: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  },
  // resvg-js ships per-arch native .node binaries that webpack can't bundle
  // (binary parse error). Mark it server-external so Next.js resolves it at
  // runtime in the Node server instead. Promoted from experimental in Next 15.
  serverExternalPackages: ["@resvg/resvg-js"],
  // The fa/ar OG image renderer reads TTF files off disk via
  // fs.readFileSync(process.cwd() + "public/fonts/og/..."). Next.js's output
  // file tracing doesn't follow runtime path strings, so the fonts wouldn't
  // ship with the serverless function bundle without this explicit include -
  // the OG route would render blank text. Promoted out of experimental in 15.
  outputFileTracingIncludes: {
    "**/opengraph-image*": ["./public/fonts/og/**/*"],
  },
  cacheComponents: true,
  experimental: {
    // Inline critical CSS + defer the rest. Requires `critters` devDep on
    // Next 15.5 (Next 16 swaps to `beasties`). v2.0.1 disabled this because
    // the streaming-metadata bailout was the dominant issue; now that bailout
    // is fixed (v2.0.1 islands) and metadata is in head (v2.0.2), critters
    // can do its job - removes the ~150 ms render-blocking penalty on the
    // main CSS bundle.
    optimizeCss: true,
    optimizePackageImports: [
      "lucide-react",
      "@headlessui/react",
      "sonner",
      "@supabase/supabase-js",
      "react-map-gl",
      "next-intl",
    ],
  },
  async redirects() {
    return [
      // 3.8.2 - /perks pulled from the product. Preserve inbound link
      // equity by 301-ing to home. Drop once we're sure no live links
      // point at /perks.
      { source: "/perks", destination: "/", permanent: true },
      {
        source: "/:locale(tr|fa|ar|ru)/perks",
        destination: "/:locale",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Link",
            value: '<https://istanbulnomads.com/sitemap.xml>; rel="sitemap"',
          },
          // AI content-usage policy, delivered as an HTTP header per the
          // content signals spec (https://contentsignals.org/). This replaces
          // the non-standard `Content-Signal` directive that used to live in
          // robots.txt - robots.txt validators (incl. Lighthouse) flag unknown
          // directives as errors, so the signal moved here while the standard
          // Allow/Disallow rules continue to gate crawlers in robots.txt.
          {
            key: "Content-Signal",
            value: "ai-train=no, search=yes, ai-input=yes",
          },
        ],
      },
      {
        source: "/fonts/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      // /_next/static/:path* is already served with long-lived
      // immutable headers by Next 16 (and Vercel's CDN). Overriding
      // here would only trip the "custom Cache-Control" dev warning.
    ];
  },
};

export default withSerwist(withNextIntl(nextConfig));
