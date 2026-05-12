// IDs match keys under `faqItems.*` in src/messages/{locale}.json.
// `guideSlug` is the route segment under /guides/[slug] to link to, and also
// the key under `guides.*` in the messages file (whose `title` is used as
// the "Read the X guide" anchor text).
export interface FAQItemMeta {
  id: string;
  guideSlug: string;
}

export const faqItems: FAQItemMeta[] = [
  { id: "neighborhoods", guideSlug: "neighborhoods" },
  { id: "cost-of-living", guideSlug: "cost-of-living" },
  { id: "visa", guideSlug: "visa" },
  { id: "internet", guideSlug: "internet" },
  { id: "coworking", guideSlug: "coworking" },
  { id: "housing", guideSlug: "housing" },
  { id: "safety", guideSlug: "neighborhoods" },
  { id: "transport", guideSlug: "transport" },
  { id: "culture", guideSlug: "culture" },
  { id: "healthcare", guideSlug: "healthcare" },
];
