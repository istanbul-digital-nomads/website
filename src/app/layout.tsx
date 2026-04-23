import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { IBM_Plex_Mono, Inter } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
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

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500"],
  variable: "--font-mono",
  preload: true,
});

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
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
          content="#0f1117"
          media="(prefers-color-scheme: dark)"
        />
        {/* Inline critical theme script to prevent FOUC */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("theme");var d=document.documentElement;if(t==="dark"||(t!=="light"&&matchMedia("(prefers-color-scheme:dark)").matches))d.classList.add("dark")}catch(e){}})()`,
          }}
        />
      </head>
      <body className={`${inter.variable} ${ibmPlexMono.variable}`}>
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
