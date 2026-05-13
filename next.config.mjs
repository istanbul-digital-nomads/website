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
  experimental: {
    // Inline critical CSS in <head>, defer the rest. Requires the `beasties`
    // devDep (the maintained fork of critters). Removes the ~250 ms
    // render-blocking penalty Lighthouse mobile flagged on the main CSS file.
    optimizeCss: true,
    optimizePackageImports: [
      "lucide-react",
      "@headlessui/react",
      "sonner",
      "@supabase/supabase-js",
      "react-map-gl",
      "next-intl",
    ],
    // resvg-js ships per-arch native .node binaries that webpack can't
    // bundle (binary parse error). Mark it server-external so Next.js
    // resolves it at runtime in the Node server instead.
    serverComponentsExternalPackages: ["@resvg/resvg-js"],
    // The fa/ar OG image renderer reads TTF files off disk via
    // fs.readFileSync(process.cwd() + "public/fonts/og/..."). Next.js's
    // output file tracing doesn't follow runtime path strings, so the
    // fonts wouldn't ship with the serverless function bundle without
    // this explicit include - the OG route would render blank text.
    outputFileTracingIncludes: {
      "**/opengraph-image*": ["./public/fonts/og/**/*"],
    },
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
