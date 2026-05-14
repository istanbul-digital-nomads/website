import type { Metadata } from "next";
import { Suspense } from "react";
import {
  IBM_Plex_Mono,
  Inter,
  Manrope,
  Noto_Sans_Arabic,
} from "next/font/google";
import localFont from "next/font/local";
import Script from "next/script";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import {
  setRequestLocale,
  getMessages,
  getTranslations,
} from "next-intl/server";
import { isValidLocale } from "@/lib/i18n/config";
import { getCachedMessages } from "@/lib/i18n/cache-translations";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import {
  BottomTabBarIsland,
  NavProgressIsland,
  ToasterIsland,
  WebMcpRegisterIsland,
} from "@/components/layout/client-islands";
import { routing } from "@/lib/i18n/routing";
import { bcp47, isRtl, type Locale } from "@/lib/i18n/config";
import "@/styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  // Same reasoning as Manrope below: `optional` prevents the post-FCP font
  // swap that Lighthouse mobile latched onto as a new LCP candidate.
  display: "optional",
  variable: "--font-sans",
  preload: true,
});

const manrope = Manrope({
  subsets: ["latin"],
  // `optional` gives the browser ~100 ms to download the font; if it isn't
  // ready, the fallback is used permanently. `swap` was triggering a paint
  // when Manrope arrived 1-3 s in, which Lighthouse mobile latched onto as
  // the LCP event for the H1 - inflating LCP from ~1.4 s to ~3.8 s. The
  // next/font fallback uses ascent-override + size-adjust to match Manrope's
  // metrics, so the layout doesn't shift either way.
  display: "optional",
  weight: ["600", "700", "800"],
  variable: "--font-display",
  preload: true,
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  // Mono font is only used for small eyebrows / labels - `optional` avoids
  // a font swap shifting LCP candidates.
  display: "optional",
  weight: ["400", "500"],
  variable: "--font-mono",
  preload: true,
});

// Persian-optimized "Bon (Pro)" - self-hosted from /public/fonts/bon/.
// Only attached to the <body> when locale === "fa", so the font files
// are not downloaded for other locales.
const bon = localFont({
  src: [
    {
      path: "../../../public/fonts/bon/bon-Thin.woff2",
      weight: "100",
      style: "normal",
    },
    {
      path: "../../../public/fonts/bon/bon-Extralight.woff2",
      weight: "200",
      style: "normal",
    },
    {
      path: "../../../public/fonts/bon/bon-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../../public/fonts/bon/bon-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../../public/fonts/bon/bon-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../../public/fonts/bon/bon-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../../public/fonts/bon/bon-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../../public/fonts/bon/bon-Extrabold.woff2",
      weight: "800",
      style: "normal",
    },
    {
      path: "../../../public/fonts/bon/bon-Black.woff2",
      weight: "900",
      style: "normal",
    },
  ],
  display: "swap",
  variable: "--font-fa",
  preload: false,
});

// MSA Arabic font. Same conditional-attach approach as Vazirmatn.
const notoSansArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  variable: "--font-ar",
  preload: false,
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// Open Graph wants underscore-separated BCP 47 tags (en_US not en-US).
const ogLocaleFor = (locale: Locale): string => bcp47[locale].replace("-", "_");

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : "en";
  const t = await getTranslations({ locale, namespace: "site" });
  const description = t("description");
  const ogLocaleTag = ogLocaleFor(locale);
  const alternateLocales = routing.locales
    .filter((l): l is Locale => l !== locale)
    .map(ogLocaleFor);
  return {
    title: {
      default: "Istanbul Digital Nomads",
      template: "%s | Istanbul Digital Nomads",
    },
    description,
    keywords: [
      "digital nomad",
      "istanbul",
      "remote work",
      "coworking",
      "community",
      "turkey",
      "expat",
    ],
    metadataBase: new URL("https://istanbulnomads.com"),
    openGraph: {
      title: "Istanbul Digital Nomads",
      description,
      url: "https://istanbulnomads.com",
      siteName: "Istanbul Digital Nomads",
      locale: ogLocaleTag,
      alternateLocale: alternateLocales,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Istanbul Digital Nomads",
      description,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) {
    notFound();
  }
  setRequestLocale(locale);
  const typedLocale = locale as Locale;
  // Static, cache-safe message + translator. `getMessages()` and
  // `getTranslations()` from next-intl/server read headers() under the hood,
  // which Next 16's cacheComponents forbids in any path leading to a cached
  // page. The cache-friendly helpers read the message JSON directly.
  const messages = getCachedMessages(typedLocale);

  // Strip server-only namespaces from the client provider payload. `og` is
  // only read by opengraph-image route handlers and `emails` by the React
  // Email render path - neither ships to the browser via this provider, so
  // there's no reason to include them in the SSR'd __NEXT_DATA__.
  const clientMessages = Object.fromEntries(
    Object.entries(messages).filter(
      ([key]) => key !== "og" && key !== "emails",
    ),
  ) as typeof messages;

  return (
    <html
      lang={bcp47[typedLocale]}
      dir={isRtl(typedLocale) ? "rtl" : "ltr"}
      translate="no"
      suppressHydrationWarning
    >
      <head>
        {/* Next 16 streams generateMetadata output into <head> directly
            (different from Next 15's React 19 body-streaming flow), so the
            manual title/description fallback we needed on Next 15 (v2.0.2)
            now creates duplicates that React 19 flags as hydration mismatch.
            Removed - rely on generateMetadata instead. */}
        <meta name="google" content="notranslate" />
        <link
          rel="preconnect"
          href={process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""}
        />
        <meta
          name="theme-color"
          content="#fafafa"
          media="(prefers-color-scheme: light)"
        />
        <meta
          name="theme-color"
          content="#14110f"
          media="(prefers-color-scheme: dark)"
        />
        {/* Theme init: ThemeProvider applies the dark class after hydration.
            Inline theme-on-html script was the source of React #418 hydration
            mismatch under Next 16 + React 19 + cacheComponents - suppressHydration
            no longer covers className mutation pre-hydration in this mode. */}
      </head>
      <body
        className={[
          inter.variable,
          manrope.variable,
          ibmPlexMono.variable,
          typedLocale === "fa" ? bon.variable : "",
          typedLocale === "ar" ? notoSansArabic.variable : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {/* Explicit `formats`, `timeZone`, and `now` props - if omitted,
            NextIntlClientProviderServer reads them from request config via
            headers(), which Next 16's cacheComponents forbids. Passing fixed
            defaults makes the provider cache-safe. `now` is set to the Unix
            epoch because we use `Intl.DateTimeFormat` directly (via the
            helpers in `src/lib/utils.ts`) and never rely on the provider's
            relative-time formatter. */}
        <NextIntlClientProvider
          locale={typedLocale}
          messages={clientMessages}
          formats={{}}
          timeZone="Europe/Istanbul"
          now={new Date(0)}
        >
          <ThemeProvider>
            <NavProgressIsland />
            <Suspense fallback={null}>
              <Header />
            </Suspense>
            <main className="min-h-[calc(100vh-4rem)] pb-16 md:pb-0">
              <Suspense fallback={null}>{children}</Suspense>
            </main>
            <Suspense fallback={null}>
              <Footer locale={typedLocale} />
            </Suspense>
            <BottomTabBarIsland />
          </ThemeProvider>
          <ToasterIsland />
          <WebMcpRegisterIsland />
          <Analytics />
          <SpeedInsights />
        </NextIntlClientProvider>
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
              strategy="lazyOnload"
            />
            <Script id="ga-init" strategy="lazyOnload">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${process.env.NEXT_PUBLIC_GA_ID}');`}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
