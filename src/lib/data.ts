export type GuideCategory = "getting-started" | "daily-life" | "living-here";

export interface Guide {
  slug: string;
  title: string;
  description: string;
  icon: string;
  category: GuideCategory;
}

export const guideCategories: Record<
  GuideCategory,
  { label: string; description: string }
> = {
  "getting-started": {
    label: "Getting Started",
    description: "The essentials for your first month",
  },
  "daily-life": {
    label: "Daily Life",
    description: "Staying connected and productive",
  },
  "living-here": {
    label: "Living Here",
    description: "Health, culture, and language",
  },
};

export const guides: Guide[] = [
  {
    slug: "neighborhoods",
    title: "Neighborhoods",
    description:
      "A breakdown of Istanbul's best areas for nomads - vibe, pricing, and transport.",
    icon: "MapPin",
    category: "getting-started",
  },
  {
    slug: "coworking",
    title: "Coworking Spaces",
    description: "Our top picks for coworking spaces and cafes with fast wifi.",
    icon: "Wifi",
    category: "daily-life",
  },
  {
    slug: "housing",
    title: "Housing",
    description:
      "How to find an apartment, what to expect, and fair rent prices.",
    icon: "Home",
    category: "getting-started",
  },
  {
    slug: "cost-of-living",
    title: "Cost of Living",
    description:
      "Monthly budgets for budget, moderate, and comfortable lifestyles.",
    icon: "Banknote",
    category: "getting-started",
  },
  {
    slug: "visa",
    title: "Visa & Residency",
    description:
      "Tourist visa rules, residence permit process, and legal tips.",
    icon: "FileText",
    category: "getting-started",
  },
  {
    slug: "internet",
    title: "Internet & SIM Cards",
    description:
      "Best mobile plans, home internet options, and backup solutions.",
    icon: "Smartphone",
    category: "daily-life",
  },
  {
    slug: "transport",
    title: "Getting Around",
    description:
      "Istanbulkart, ferries, metro, buses, taxis, and dolmus explained.",
    icon: "Train",
    category: "daily-life",
  },
  {
    slug: "food",
    title: "Food & Dining",
    description: "Where to eat, what to try, and how to eat well on a budget.",
    icon: "UtensilsCrossed",
    category: "daily-life",
  },
  {
    slug: "healthcare",
    title: "Healthcare",
    description: "Hospitals, pharmacies, insurance options, and what to know.",
    icon: "Stethoscope",
    category: "living-here",
  },
  {
    slug: "culture",
    title: "Culture & Language",
    description: "Basic Turkish, cultural norms, and tips for fitting in.",
    icon: "Globe",
    category: "living-here",
  },
];
