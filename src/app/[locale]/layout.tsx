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
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import {
  setRequestLocale,
  getMessages,
  getTranslations,
} from "next-intl/server";
import { isValidLocale } from "@/lib/i18n/config";
import { getCachedMessages } from "@/lib/i18n/cache-translations";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { ConsentProvider } from "@/components/consent/consent-provider";
import { AnalyticsConsentGate } from "@/components/consent/analytics-consent-gate";
import { Footer } from "@/components/layout/footer";
import {
  BottomTabBarIsland,
  NavProgressIsland,
  ToasterIsland,
  WebMcpRegisterIsland,
  CommandMenuIsland,
  AssistantWidgetIsland,
} from "@/components/layout/client-islands";
import { routing } from "@/lib/i18n/routing";
import { bcp47, isRtl, type Locale } from "@/lib/i18n/config";
import { getSearchItems } from "@/lib/search";
import {
  CONSENT_COOKIE,
  CONSENT_DENIED,
  CONSENT_GRANTED,
  EEA_REGIONS,
} from "@/lib/analytics";
import "@/styles/globals.css";
import "slot-text/style.css";

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
  // a font swap shifting LCP candidates. Preload off: the two weights cost
  // ~40 KB in the critical request graph that Lighthouse charges against
  // LCP, and tiny labels rendering one visit in the fallback mono is fine.
  display: "optional",
  weight: ["400", "500"],
  variable: "--font-mono",
  preload: false,
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
    // PWA: static manifest (public/manifest.webmanifest). These fields don't
    // depend on locale - the manifest is single-document and install-time.
    manifest: "/manifest.webmanifest",
    applicationName: "Istanbul Nomads",
    appleWebApp: {
      capable: true,
      title: "Istanbul Nomads",
      statusBarStyle: "default",
    },
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

  // Design System v2 Phase 6: Command-K dataset, prebuilt server-side per
  // locale. All sources are either static (pages/guides/neighborhoods/
  // circles) or `use cache` (events), so this stays prerenderable.
  const searchItems = await getSearchItems(typedLocale);

  return (
    // The tod-* accent class is added by the inline head script, not
    // rendered here: server-rendering it baked one time-of-day bucket into
    // the prerendered (PPR) shell at build time while each request's RSC
    // payload computed a fresh one - the root-level mismatch made React 19
    // throw #418 and regenerate the whole tree on the client, which is
    // also what pushed LCP out by seconds.
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
        {/* Theme + time-of-day accent, both applied pre-paint. tod-* uses
            Istanbul wall-clock (fixed UTC+3, no DST since 2016) computed on
            the client so the prerendered shell stays time-independent. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("theme");var d=document.documentElement;if(t==="dark"||(t!=="light"&&matchMedia("(prefers-color-scheme:dark)").matches))d.classList.add("dark");var h=new Date(Date.now()+10800000).getUTCHours();d.classList.add("tod-"+(h>=5&&h<9?"dawn":h>=9&&h<17?"midday":h>=17&&h<21?"dusk":"night"))}catch(e){}})()`,
          }}
        />
        {/* Google Consent Mode v2 default, region-scoped. Runs synchronously
            before the lazyOnload GTM script so the consent default is in the
            dataLayer first. ad_* stay denied everywhere (no ads on this site).
            For analytics_storage:
              - If the visitor already chose (in_consent cookie), honor that
                choice globally - region is irrelevant once they've decided.
              - Otherwise default by region: denied + wait_for_update in the
                EEA/UK/CH (cookie banner gates analytics there), granted
                everywhere else so non-EEA traffic is measured without a click.
            Google resolves the visitor's region from IP, so this needs no
            server-side geo. The cookie name/values and the EEA list are
            interpolated from @/lib/analytics (build-time constants), so the
            consent contract has one home and the rendered string stays
            byte-identical across requests - still cacheComponents-safe.
            The region override is pushed before the global default; Consent
            Mode applies the most specific (region-matching) default. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=window.gtag||gtag;function def(a,x){var o={ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:a,functionality_storage:'granted',security_storage:'granted'};for(var k in x)o[k]=x[k];gtag('consent','default',o);}var prior='';try{var c=document.cookie;if(/(?:^|;\\s*)${CONSENT_COOKIE}=[^;]*${CONSENT_GRANTED}/.test(c))prior='granted';else if(/(?:^|;\\s*)${CONSENT_COOKIE}=[^;]*${CONSENT_DENIED}/.test(c))prior='denied';}catch(e){}if(prior){def(prior);}else{def('denied',{region:${JSON.stringify(EEA_REGIONS)},wait_for_update:500});def('granted');document.documentElement.classList.add('consent-undecided');}gtag('set','url_passthrough',true);gtag('set','ads_data_redaction',true);})()`,
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
          <ConsentProvider>
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
                {/* Viewport-height fallback: with a null fallback the shell
                    painted the footer just below main's min-height (inside
                    the first viewport), and the streamed page content then
                    pushed it down - the whole page's CLS (~0.08). A full-dvh
                    placeholder keeps the footer below the fold until the
                    page content arrives. */}
                <Suspense fallback={<div className="min-h-[100dvh]" />}>
                  {children}
                </Suspense>
              </main>
              {/* Height-stable fallback: a null fallback let the streamed
                  footer push surrounding layout when it arrived, which was
                  the page's entire CLS (0.078). The placeholder approximates
                  the footer's height so the swap doesn't shift anything. */}
              <Suspense
                fallback={<div aria-hidden className="min-h-[600px]" />}
              >
                <Footer locale={typedLocale} />
              </Suspense>
              <Suspense fallback={null}>
                <BottomTabBarIsland />
              </Suspense>
              <CommandMenuIsland items={searchItems} />
              <AssistantWidgetIsland />
            </ThemeProvider>
            <ToasterIsland />
            <WebMcpRegisterIsland />
            <AnalyticsConsentGate />
            <SpeedInsights />
          </ConsentProvider>
        </NextIntlClientProvider>
        {/* Google Tag Manager (GTM-WVTC6K93). The container loads the GA4
            Google tag (G-CG3LT0ZV2X) and forwards the funnel events from
            src/lib/analytics.ts. Loading is deferred to the first user
            gesture (or a 12s post-load fallback) instead of lazyOnload:
            GTM+GA4 evaluation is a few hundred ms of main-thread work that
            otherwise lands inside the initial trace on throttled mobile.
            Real visitors interact almost immediately, and gtag-style pushes
            made before GTM boots queue in the dataLayer and are replayed,
            so funnel events fired pre-load aren't lost. The tradeoff:
            never-interacting visitors who bounce inside 12s aren't counted.
            The Consent Mode v2 default in <head> runs synchronously before
            this, so GTM boots with the right consent state. */}
        {process.env.NEXT_PUBLIC_GTM_ID && (
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(){var done=false;function load(){if(done)return;done=true;var w=window,d=document,l='dataLayer';w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName('script')[0],j=d.createElement('script');j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id=${process.env.NEXT_PUBLIC_GTM_ID}';f.parentNode.insertBefore(j,f);}var evs=['pointerdown','pointermove','wheel','scroll','keydown','touchstart'];evs.forEach(function(e){addEventListener(e,load,{once:true,passive:true});});function arm(){setTimeout(load,12000);}if(document.readyState==='complete')arm();else addEventListener('load',arm,{once:true});})()`,
            }}
          />
        )}
      </body>
    </html>
  );
}
