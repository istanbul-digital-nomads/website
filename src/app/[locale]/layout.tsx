import type { Metadata } from "next";
import { Suspense } from "react";
import {
  Fraunces,
  Geist,
  Instrument_Serif,
  JetBrains_Mono,
  Noto_Sans_Arabic,
  Space_Grotesk,
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
import { Footer } from "@/components/layout/footer";
import {
  BottomTabBarIsland,
  NavProgressIsland,
  ToasterIsland,
  WebMcpRegisterIsland,
} from "@/components/layout/client-islands";
import { routing } from "@/lib/i18n/routing";
import { bcp47, isRtl, type Locale } from "@/lib/i18n/config";
import { getTimeOfDay } from "@/lib/ambient";
import { getSearchItems } from "@/lib/search";
import { CommandMenu } from "@/components/ui/command-menu";
import "@/styles/globals.css";

// Design System v2 font stack: Geist (UI/body), Fraunces (editorial display
// serif), JetBrains Mono (numbers/metadata). The CSS variable names are kept
// (`--font-sans` / `--font-display` / `--font-mono`) so nothing downstream
// breaks. `display: "optional"` is retained throughout - it prevents the
// post-FCP font swap that Lighthouse mobile latches onto as a new LCP
// candidate (next/font's metric-matched fallback keeps layout stable).
const geist = Geist({
  subsets: ["latin"],
  display: "optional",
  variable: "--font-sans",
  preload: true,
});

const fraunces = Fraunces({
  subsets: ["latin"],
  display: "optional",
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-display",
  preload: true,
});

// Instrument Serif - cinematic italic editorial face used by HeroLive and
// the Members directory. Single weight (400) + italic for callouts and
// editorial headlines. Preload off because it's used on a couple pages.
const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  display: "swap",
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-editorial",
  preload: false,
});

// Space Grotesk - sans companion to Instrument Serif on the hero / Members
// surfaces. Body sans elsewhere stays as Geist. Preload off.
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  variable: "--font-grotesk",
  preload: false,
});

const jetbrainsMono = JetBrains_Mono({
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
      default: "Istanbul Nomads",
      template: "%s | Istanbul Nomads",
    },
    description,
    keywords: [
      "istanbul nomads",
      "digital nomad istanbul",
      "istanbul",
      "remote work",
      "coworking",
      "community",
      "turkey",
      "expat",
    ],
    metadataBase: new URL("https://istanbulnomads.com"),
    openGraph: {
      title: "Istanbul Nomads",
      description,
      url: "https://istanbulnomads.com",
      siteName: "Istanbul Nomads",
      locale: ogLocaleTag,
      alternateLocale: alternateLocales,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Istanbul Nomads",
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

  // Design System v2: time-of-day accent class. `getTimeOfDay` is a
  // `use cache` function (cacheLife "minutes"), so this stays prerenderable
  // and the accent catches up within a few minutes of each tod boundary.
  const tod = await getTimeOfDay();

  // Design System v2 Phase 6: Command-K dataset, prebuilt server-side per
  // locale. All sources are either static (pages/guides/neighborhoods/
  // circles) or `use cache` (events), so this stays prerenderable.
  const searchItems = await getSearchItems(typedLocale);

  return (
    <html
      lang={bcp47[typedLocale]}
      dir={isRtl(typedLocale) ? "rtl" : "ltr"}
      translate="no"
      className={`tod-${tod}`}
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
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("theme");var d=document.documentElement;if(t==="dark"||(t!=="light"&&matchMedia("(prefers-color-scheme:dark)").matches))d.classList.add("dark")}catch(e){}})()`,
          }}
        />
      </head>
      <body
        className={[
          geist.variable,
          fraunces.variable,
          instrumentSerif.variable,
          spaceGrotesk.variable,
          jetbrainsMono.variable,
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
            {/* NavProgress + BottomTabBar read usePathname, which is
                dynamic data on fully-dynamic routes (e.g. /events/[id]).
                Wrapped in Suspense so they don't trip cacheComponents'
                "uncached data outside Suspense" guard. */}
            <Suspense fallback={null}>
              <NavProgressIsland />
            </Suspense>
            {/* Header is mounted by the (marketing) and (app) route-group
                layouts; (home) deliberately omits it so the cinematic hero
                owns the top of the viewport. No is-home shim needed. */}
            <main className="min-h-[calc(100vh-4rem)] pb-16 md:pb-0">
              <Suspense fallback={null}>{children}</Suspense>
            </main>
            <Suspense fallback={null}>
              <Footer locale={typedLocale} />
            </Suspense>
            <Suspense fallback={null}>
              <BottomTabBarIsland />
            </Suspense>
            <CommandMenu items={searchItems} />
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
