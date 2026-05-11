import type { Metadata } from "next";
import dynamic from "next/dynamic";
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
import { setRequestLocale, getMessages } from "next-intl/server";
import { isValidLocale } from "@/lib/i18n/config";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { routing } from "@/lib/i18n/routing";
import { bcp47, isRtl, type Locale } from "@/lib/i18n/config";
import "@/styles/globals.css";

const BottomTabBar = dynamic(
  () =>
    import("@/components/layout/bottom-tab-bar").then((m) => ({
      default: m.BottomTabBar,
    })),
  { ssr: false },
);

const NavigationProgress = dynamic(
  () =>
    import("@/components/ui/navigation-progress").then((m) => ({
      default: m.NavigationProgress,
    })),
  { ssr: false },
);

const Toaster = dynamic(
  () => import("sonner").then((m) => ({ default: m.Toaster })),
  { ssr: false },
);

const WebMcpRegister = dynamic(
  () =>
    import("@/components/web-mcp-register").then((m) => ({
      default: m.WebMcpRegister,
    })),
  { ssr: false },
);

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
  preload: true,
});

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  weight: ["600", "700", "800"],
  variable: "--font-display",
  preload: true,
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  display: "swap",
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

export const metadata: Metadata = {
  title: {
    default: "Istanbul Digital Nomads",
    template: "%s | Istanbul Digital Nomads",
  },
  description:
    "Digital nomad community in Istanbul - weekly coworking, practical city guides, and newcomer-friendly meetups.",
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
    description:
      "Digital nomad community in Istanbul - weekly coworking, practical city guides, and newcomer-friendly meetups.",
    url: "https://istanbulnomads.com",
    siteName: "Istanbul Digital Nomads",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Istanbul Digital Nomads",
    description:
      "Digital nomad community in Istanbul - weekly coworking, practical city guides, and newcomer-friendly meetups.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

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
  const messages = await getMessages();
  const typedLocale = locale as Locale;

  return (
    <html
      lang={bcp47[typedLocale]}
      dir={isRtl(typedLocale) ? "rtl" : "ltr"}
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://basemaps.cartocdn.com" />
        <link rel="dns-prefetch" href="https://basemaps.cartocdn.com" />
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
          inter.variable,
          manrope.variable,
          ibmPlexMono.variable,
          typedLocale === "fa" ? bon.variable : "",
          typedLocale === "ar" ? notoSansArabic.variable : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <NextIntlClientProvider locale={typedLocale} messages={messages}>
          <ThemeProvider>
            <NavigationProgress />
            <Header />
            <main className="min-h-[calc(100vh-4rem)] pb-16 md:pb-0">
              {children}
            </main>
            <Footer />
            <BottomTabBar />
          </ThemeProvider>
          <Toaster
            position="top-center"
            toastOptions={{
              className: "toast-brand",
              duration: 4000,
            }}
            gap={8}
            visibleToasts={3}
          />
          <WebMcpRegister />
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
