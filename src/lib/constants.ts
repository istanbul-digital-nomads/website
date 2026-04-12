export const siteConfig = {
  name: "Istanbul Digital Nomads",
  shortName: "Istanbul Digital Nomads",
  description:
    "Digital nomad community in Istanbul with weekly coworking, local guides, and a softer landing for people staying longer.",
  url: "https://istanbulnomads.com",
  ogImage: "https://istanbulnomads.com/og.png",
  locale: "en_US",
  creator: "Istanbul Digital Nomads",
} as const;

export const socialLinks = {
  telegram: "https://t.me/istanbul_digital_nomads",
  github: "https://github.com/istanbul-digital-nomads",
  twitter: "https://twitter.com/istanbulnomads",
  email: "hello@istanbulnomads.com",
} as const;

export const navItems = [
  { label: "About", href: "/about" },
  { label: "Guides", href: "/guides" },
  { label: "Events", href: "/events" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
] as const;

export const footerNav = {
  community: [
    { label: "About Us", href: "/about" },
    { label: "Events", href: "/events" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ],
  resources: [
    { label: "City Guides", href: "/guides" },
    { label: "Neighborhoods", href: "/guides/neighborhoods" },
    { label: "Coworking", href: "/guides/coworking" },
    { label: "Cost of Living", href: "/guides/cost-of-living" },
  ],
  connect: [
    { label: "Telegram", href: socialLinks.telegram, external: true },
    { label: "GitHub", href: socialLinks.github, external: true },
    { label: "Twitter", href: socialLinks.twitter, external: true },
    { label: "Email", href: `mailto:${socialLinks.email}`, external: true },
  ],
} as const;

export const eventTypes = {
  meetup: { label: "Meetup", color: "blue" },
  coworking: { label: "Coworking", color: "green" },
  workshop: { label: "Workshop", color: "purple" },
  social: { label: "Social", color: "amber" },
} as const;

export type { EventType } from "@/types/models";
