export interface Guide {
  slug: string;
  title: string;
  description: string;
  icon: string;
}

export const guides: Guide[] = [
  {
    slug: "neighborhoods",
    title: "Neighborhoods",
    description: "A breakdown of Istanbul's best areas for nomads - vibe, pricing, and transport.",
    icon: "MapPin",
  },
  {
    slug: "coworking",
    title: "Coworking Spaces",
    description: "Our top picks for coworking spaces and cafes with fast wifi.",
    icon: "Wifi",
  },
  {
    slug: "housing",
    title: "Housing",
    description: "How to find an apartment, what to expect, and fair rent prices.",
    icon: "Home",
  },
  {
    slug: "cost-of-living",
    title: "Cost of Living",
    description: "Monthly budgets for budget, moderate, and comfortable lifestyles.",
    icon: "Banknote",
  },
  {
    slug: "visa",
    title: "Visa & Residency",
    description: "Tourist visa rules, residence permit process, and legal tips.",
    icon: "FileText",
  },
  {
    slug: "internet",
    title: "Internet & SIM Cards",
    description: "Best mobile plans, home internet options, and backup solutions.",
    icon: "Smartphone",
  },
  {
    slug: "transport",
    title: "Getting Around",
    description: "Istanbulkart, ferries, metro, buses, taxis, and dolmus explained.",
    icon: "Train",
  },
  {
    slug: "food",
    title: "Food & Dining",
    description: "Where to eat, what to try, and how to eat well on a budget.",
    icon: "UtensilsCrossed",
  },
  {
    slug: "healthcare",
    title: "Healthcare",
    description: "Hospitals, pharmacies, insurance options, and what to know.",
    icon: "Stethoscope",
  },
  {
    slug: "culture",
    title: "Culture & Language",
    description: "Basic Turkish, cultural norms, and tips for fitting in.",
    icon: "Globe",
  },
];
