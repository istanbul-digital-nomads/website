import type { Metadata } from "next";
import { IBM_Plex_Mono, Manrope } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { BottomTabBar } from "@/components/layout/bottom-tab-bar";
import "@/styles/globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500"],
  variable: "--font-mono",
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
      <body className={`${manrope.variable} ${ibmPlexMono.variable}`}>
        <ThemeProvider>
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
          richColors
        />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
