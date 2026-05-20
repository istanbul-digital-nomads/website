// FAQ catalog for the /help hub. `id` matches the key under `faqItems.*`
// in src/messages/{locale}.json (each has `question` + `answer`).
// `category` matches the keys under `faqCategories.*` and groups the
// accordion. `href` is where the "Learn more" link points - a help doc,
// a city guide, or an app route.

export const FAQ_CATEGORIES = [
  "getting-started",
  "plans",
  "verification",
  "paperwork",
  "payments",
  "safety",
  "city",
  "account",
] as const;

export type FAQCategory = (typeof FAQ_CATEGORIES)[number];

export interface FAQItemMeta {
  id: string;
  category: FAQCategory;
  href: string;
}

export const faqItems: FAQItemMeta[] = [
  // Getting started
  {
    id: "what-is-this",
    category: "getting-started",
    href: "/help/getting-started",
  },
  {
    id: "is-it-free",
    category: "getting-started",
    href: "/help/payments-and-escrow",
  },
  { id: "how-to-join", category: "getting-started", href: "/onboarding" },
  { id: "who-is-it-for", category: "getting-started", href: "/members" },

  // Plans
  { id: "what-are-plans", category: "plans", href: "/help/how-plans-work" },
  { id: "plans-vs-events", category: "plans", href: "/help/how-plans-work" },
  { id: "how-to-host", category: "plans", href: "/help/how-plans-work" },
  { id: "budget-vs-ticketed", category: "plans", href: "/help/how-plans-work" },

  // Verification
  {
    id: "why-verify",
    category: "verification",
    href: "/help/getting-verified",
  },
  {
    id: "verification-levels",
    category: "verification",
    href: "/help/getting-verified",
  },
  { id: "how-to-verify", category: "verification", href: "/dashboard/verify" },

  // Paperwork
  { id: "what-paperwork", category: "paperwork", href: "/help/paperwork-help" },
  { id: "find-agent", category: "paperwork", href: "/paperwork" },
  { id: "agent-trust", category: "paperwork", href: "/help/paperwork-help" },

  // Payments
  {
    id: "how-payments",
    category: "payments",
    href: "/help/payments-and-escrow",
  },
  { id: "escrow", category: "payments", href: "/help/payments-and-escrow" },
  { id: "refunds", category: "payments", href: "/help/payments-and-escrow" },
  { id: "guide-fees", category: "payments", href: "/help/payments-and-escrow" },

  // Safety
  { id: "is-it-safe", category: "safety", href: "/help/trust-and-safety" },
  { id: "not-dating", category: "safety", href: "/help/trust-and-safety" },
  { id: "report", category: "safety", href: "/help/trust-and-safety" },

  // Living in Istanbul (links to city guides)
  { id: "neighborhoods", category: "city", href: "/guides/neighborhoods" },
  { id: "cost-of-living", category: "city", href: "/guides/cost-of-living" },
  { id: "visa", category: "city", href: "/guides/visa" },
  { id: "internet", category: "city", href: "/guides/internet" },
  { id: "transport", category: "city", href: "/guides/transport" },

  // Account
  { id: "edit-profile", category: "account", href: "/dashboard/profile" },
  { id: "visibility", category: "account", href: "/dashboard/profile" },
];
