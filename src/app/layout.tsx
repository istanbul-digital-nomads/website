import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

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
  openGraph: {
    title: "Istanbul Digital Nomads",
    description:
      "A community for remote workers, freelancers, and digital nomads in Istanbul.",
    url: "https://istanbuldigitalnomads.com",
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
      <body className={inter.className}>{children}</body>
    </html>
  );
}
