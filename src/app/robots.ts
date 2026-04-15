import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/dashboard/",
          "/settings/",
          "/login",
          "/auth/",
          "/onboarding",
        ],
      },
    ],
    sitemap: "https://istanbulnomads.com/sitemap.xml",
    host: "https://istanbulnomads.com",
  };
}
