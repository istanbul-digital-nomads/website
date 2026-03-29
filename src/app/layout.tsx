import type { Metadata } from "next";
import { IBM_Plex_Mono, Manrope } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
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
    "A community for remote workers, freelancers, and digital nomads living in or visiting Istanbul. Meetups, resources, and connections.",
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
      "A community for remote workers, freelancers, and digital nomads in Istanbul.",
    url: "https://istanbulnomads.com",
    siteName: "Istanbul Digital Nomads",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Istanbul Digital Nomads",
    description:
      "A community for remote workers, freelancers, and digital nomads in Istanbul.",
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
          <main className="min-h-[calc(100vh-4rem)]">{children}</main>
          <Footer />
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
