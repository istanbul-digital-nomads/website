import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/lib/i18n/request.ts");

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
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
