import { type EventType } from "./constants";

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

export interface Event {
  id: string;
  title: string;
  type: EventType;
  date: string;
  endDate?: string;
  location: string;
  description: string;
  attendees: number;
  capacity?: number;
  isPast: boolean;
}

export const events: Event[] = [
  {
    id: "1",
    title: "Weekly Coworking - Kadikoy",
    type: "coworking",
    date: "2026-04-02T10:00:00",
    endDate: "2026-04-02T17:00:00",
    location: "MOB Kadikoy",
    description: "Our regular Wednesday coworking session at MOB Kadikoy. Bring your laptop, grab a coffee, and work alongside other nomads. Good wifi, power outlets, and great company.",
    attendees: 12,
    capacity: 20,
    isPast: false,
  },
  {
    id: "2",
    title: "Nomad Meetup - Rooftop Social",
    type: "social",
    date: "2026-04-05T18:00:00",
    location: "Beyoglu Rooftop Bar",
    description: "Monthly social gathering on a Beyoglu rooftop. Meet new arrivals, catch up with regulars, and enjoy the Bosphorus view. Drinks at your own expense.",
    attendees: 35,
    isPast: false,
  },
  {
    id: "3",
    title: "Workshop: Turkish Tax for Freelancers",
    type: "workshop",
    date: "2026-04-12T14:00:00",
    endDate: "2026-04-12T16:00:00",
    location: "Online (Zoom)",
    description: "A local tax accountant walks us through the basics of Turkish tax obligations for freelancers and remote workers. Q&A included.",
    attendees: 24,
    capacity: 50,
    isPast: false,
  },
  {
    id: "4",
    title: "Kadikoy Walking Tour",
    type: "meetup",
    date: "2026-03-15T11:00:00",
    location: "Kadikoy Ferry Terminal",
    description: "Explore the Asian side's best neighborhood with a local guide. Markets, street art, cafes, and hidden gems.",
    attendees: 18,
    isPast: true,
  },
  {
    id: "5",
    title: "Coworking Marathon - Cihangir",
    type: "coworking",
    date: "2026-03-10T09:00:00",
    endDate: "2026-03-10T18:00:00",
    location: "Setup Cihangir",
    description: "Full-day coworking session in Cihangir. Lunch break as a group at a local spot.",
    attendees: 15,
    capacity: 25,
    isPast: true,
  },
];
