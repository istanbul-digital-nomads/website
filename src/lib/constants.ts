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

export type NavItem =
  | { label: string; href: string }
  | {
      label: string;
      children: { label: string; href: string; description: string }[];
    };

export const navItems: NavItem[] = [
  { label: "About", href: "/about" },
  {
    label: "Explore",
    children: [
      {
        label: "City Guides",
        href: "/guides",
        description: "Neighborhoods, housing, visa, and more",
      },
      {
        label: "Path to Istanbul",
        href: "/path-to-istanbul",
        description: "Country-by-country relocation playbooks",
      },
      {
        label: "Nomad Spaces",
        href: "/spaces",
        description: "Wifi-tested cafes and coworking spots",
      },
      {
        label: "Local Guides",
        href: "/local-guides",
        description: "People who help you settle in",
      },
    ],
  },
  {
    label: "Community",
    children: [
      {
        label: "Events",
        href: "/events",
        description: "Coworking sessions, meetups, and workshops",
      },
      {
        label: "Blog",
        href: "/blog",
        description: "Stories and tips from the community",
      },
    ],
  },
  { label: "Contact", href: "/contact" },
];

export const footerNav = {
  community: [
    { label: "About Us", href: "/about" },
    { label: "Local Guides", href: "/local-guides" },
    { label: "Events", href: "/events" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ],
  resources: [
    { label: "Nomad Spaces", href: "/spaces" },
    { label: "City Guides", href: "/guides" },
    { label: "Path to Istanbul", href: "/path-to-istanbul" },
    { label: "Neighborhoods", href: "/guides/neighborhoods" },
    { label: "Cost of Living", href: "/guides/cost-of-living" },
  ],
  connect: [
    { label: "Telegram", href: socialLinks.telegram, external: true },
    { label: "GitHub", href: socialLinks.github, external: true },
    { label: "Twitter", href: socialLinks.twitter, external: true },
    { label: "Email", href: `mailto:${socialLinks.email}`, external: true },
  ],
} as const;

export const guideSpecializations = [
  { value: "neighborhoods", label: "Neighborhoods" },
  { value: "visa-legal", label: "Visa & Legal" },
  { value: "housing", label: "Housing" },
  { value: "food-dining", label: "Food & Dining" },
  { value: "coworking", label: "Coworking" },
  { value: "nightlife", label: "Nightlife" },
  { value: "culture", label: "Culture" },
  { value: "healthcare", label: "Healthcare" },
  { value: "transport", label: "Transport" },
  { value: "tech-freelancing", label: "Tech & Freelancing" },
] as const;

export const istanbulNeighborhoods = [
  { value: "kadikoy", label: "Kadikoy" },
  { value: "besiktas", label: "Besiktas" },
  { value: "cihangir", label: "Cihangir" },
  { value: "moda", label: "Moda" },
  { value: "uskudar", label: "Uskudar" },
  { value: "beyoglu", label: "Beyoglu" },
  { value: "nisantasi", label: "Nisantasi" },
  { value: "karakoy", label: "Karakoy" },
  { value: "galata", label: "Galata" },
  { value: "sisli", label: "Sisli" },
] as const;

export const commonLanguages = [
  "English",
  "Turkish",
  "German",
  "French",
  "Spanish",
  "Arabic",
  "Russian",
  "Portuguese",
  "Italian",
  "Dutch",
  "Japanese",
  "Korean",
] as const;

export const eventTypes = {
  meetup: { label: "Meetup", color: "blue" },
  coworking: { label: "Coworking", color: "green" },
  workshop: { label: "Workshop", color: "purple" },
  social: { label: "Social", color: "amber" },
} as const;

export type { EventType } from "@/types/models";
