export const siteConfig = {
  name: "Istanbul Nomads",
  shortName: "Istanbul Nomads",
  description:
    "Digital nomad community in Istanbul with weekly coworking, local guides, and a softer landing for people staying longer.",
  url: "https://istanbulnomads.com",
  ogImage: "https://istanbulnomads.com/og.png",
  locale: "en_US",
  creator: "Istanbul Nomads",
} as const;

export const socialLinks = {
  telegram: "https://t.me/istanbul_digital_nomads",
  github: "https://github.com/istanbul-digital-nomads",
  twitter: "https://twitter.com/istanbulnomads",
  instagram: "https://instagram.com/istanbulnomads",
  email: "hello@istanbulnomads.com",
} as const;

// Hybrid nav: 5 workspace-style icon destinations on the left, two rich
// dropdowns on the right. `countKey` opts a flat item into a count pill;
// dropdowns get label + description rows for each child.
export type NavItemKey =
  | "today"
  | "map"
  | "events"
  | "members"
  | "explore"
  | "community";

export type NavChildKey =
  | "cityGuides"
  | "neighborhoods"
  | "pathToIstanbul"
  | "nomadSpaces"
  | "localGuides"
  | "events"
  | "blog"
  | "members"
  | "circles"
  | "plans"
  | "about"
  | "contact";

export type NavCountKey = "events";

export type NavFlatItem = {
  key: NavItemKey;
  href: string;
  countKey?: NavCountKey;
};
export type NavDropdownItem = {
  key: NavItemKey;
  children: { key: NavChildKey; href: string }[];
};
export type NavItem = NavFlatItem | NavDropdownItem;

export const navItems: NavItem[] = [
  { key: "today", href: "/today" },
  { key: "map", href: "/spaces" },
  { key: "events", href: "/events", countKey: "events" },
  { key: "members", href: "/members" },
  {
    key: "explore",
    children: [
      { key: "cityGuides", href: "/guides" },
      { key: "neighborhoods", href: "/guides/neighborhoods" },
      { key: "pathToIstanbul", href: "/path-to-istanbul" },
      { key: "nomadSpaces", href: "/spaces" },
      { key: "localGuides", href: "/local-guides" },
    ],
  },
  {
    key: "community",
    children: [
      { key: "plans", href: "/plans" },
      { key: "circles", href: "/circles" },
      { key: "blog", href: "/blog" },
      { key: "about", href: "/about" },
      { key: "contact", href: "/contact" },
    ],
  },
];

export type FooterLinkKey =
  | "aboutUs"
  | "localGuides"
  | "events"
  | "blog"
  | "contact"
  | "nomadSpaces"
  | "cityGuides"
  | "pathToIstanbul"
  | "neighborhoods"
  | "costOfLiving"
  | "photoCredits"
  | "telegram"
  | "github"
  | "twitter"
  | "instagram"
  | "email"
  | "openapi"
  | "llmsTxt"
  | "members"
  | "circles"
  | "plans";

export const footerNav: Record<
  "community" | "resources" | "connect" | "legal",
  ReadonlyArray<{ key: FooterLinkKey; href: string; external?: boolean }>
> = {
  community: [
    { key: "aboutUs", href: "/about" },
    { key: "plans", href: "/plans" },
    { key: "events", href: "/events" },
    { key: "members", href: "/members" },
    { key: "circles", href: "/circles" },
    { key: "localGuides", href: "/local-guides" },
    { key: "blog", href: "/blog" },
    { key: "contact", href: "/contact" },
  ],
  resources: [
    { key: "nomadSpaces", href: "/spaces" },
    { key: "cityGuides", href: "/guides" },
    { key: "pathToIstanbul", href: "/path-to-istanbul" },
    { key: "neighborhoods", href: "/guides/neighborhoods" },
    { key: "costOfLiving", href: "/guides/cost-of-living" },
    { key: "photoCredits", href: "/credits" },
  ],
  connect: [
    { key: "telegram", href: socialLinks.telegram, external: true },
    { key: "instagram", href: socialLinks.instagram, external: true },
    { key: "github", href: socialLinks.github, external: true },
    { key: "twitter", href: socialLinks.twitter, external: true },
    { key: "email", href: `mailto:${socialLinks.email}`, external: true },
  ],
  legal: [
    { key: "photoCredits", href: "/credits" },
    { key: "openapi", href: "/openapi.json" },
    { key: "llmsTxt", href: "/llms.txt" },
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
  { value: "levent", label: "Levent" },
  { value: "balat", label: "Balat" },
  { value: "atasehir", label: "Atasehir" },
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
