export interface FAQItem {
  question: string;
  answer: string;
  guideSlug: string;
  guideTitle: string;
}

export const faqItems: FAQItem[] = [
  {
    question: "Which neighborhood should I start in?",
    answer:
      "Kadikoy on the Asian side is the most popular with nomads - walkable, affordable, and packed with cafes. Cihangir on the European side is the go-to for a social, bohemian vibe with Bosphorus views.",
    guideSlug: "neighborhoods",
    guideTitle: "Neighborhoods",
  },
  {
    question: "How much does a month in Istanbul cost?",
    answer:
      "A comfortable nomad lifestyle runs $1,200-$1,500/month including a furnished apartment in Kadikoy, eating out a few times a week, coworking, and transport. Budget-conscious nomads can manage on $750-$1,000.",
    guideSlug: "cost-of-living",
    guideTitle: "Cost of Living",
  },
  {
    question: "Do I need a visa to work remotely?",
    answer:
      "For stays under 90 days, a tourist e-visa ($50-60, instant online) is all you need. For longer stays, Turkey has a digital nomad visa (12 months, requires $3,000/month income) or a standard residence permit.",
    guideSlug: "visa",
    guideTitle: "Visa & Residency",
  },
  {
    question: "How do I get a SIM card?",
    answer:
      "Buy a Turkcell tourist SIM at any company-owned store for about 250 TL (~$8) with 20 GB data. Bring your passport. City stores are cheaper than airport counters.",
    guideSlug: "internet",
    guideTitle: "Internet & SIM Cards",
  },
  {
    question: "Where can I work with good wifi?",
    answer:
      "Kolektif House has 100+ Mbps wifi and costs 490 TL/month (~$16). For cafes, Kadikoy and Cihangir have the highest density of laptop-friendly spots with reliable connections.",
    guideSlug: "coworking",
    guideTitle: "Coworking Spaces",
  },
  {
    question: "How do I find an apartment?",
    answer:
      "Start with Airbnb or Flatio for your first month while you explore. For longer stays, Sahibinden.com has the best local prices. Always visit in person before paying.",
    guideSlug: "housing",
    guideTitle: "Housing",
  },
  {
    question: "Is Istanbul safe?",
    answer:
      "Yes. Istanbul is very safe for its size. The nomad-popular neighborhoods (Kadikoy, Cihangir, Besiktas, Karakoy) are all safe day and night. Use BiTaksi for taxis and standard big-city precautions.",
    guideSlug: "neighborhoods",
    guideTitle: "Neighborhoods",
  },
  {
    question: "How do I get from the airport?",
    answer:
      "The Havaist bus is the best value (150 TL, runs to Taksim and Kadikoy). A taxi costs 600-800 TL. The new M11 metro line also connects the airport to the city.",
    guideSlug: "transport",
    guideTitle: "Getting Around",
  },
  {
    question: "Do I need to speak Turkish?",
    answer:
      "Not in nomad-friendly areas - English is widely understood in cafes, coworking spaces, and tourist areas. But learning 20 basic phrases will transform how locals treat you.",
    guideSlug: "culture",
    guideTitle: "Culture & Language",
  },
  {
    question: "How do I see a doctor?",
    answer:
      "Private hospitals (Acibadem, Memorial) have English-speaking staff and accept international insurance. A doctor visit costs 500-1,500 TL (~$16-48) without insurance - much cheaper than Western countries.",
    guideSlug: "healthcare",
    guideTitle: "Healthcare",
  },
];
