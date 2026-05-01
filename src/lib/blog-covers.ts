export type BlogCoverSource = "OpenAI";
export type BlogCoverLicense = "Generated";

export interface BlogCoverImage {
  src: string;
  alt: string;
  credit: {
    author: string;
    source: BlogCoverSource;
    sourceHref: string;
    license: BlogCoverLicense;
    licenseHref: string;
  };
}

const generatedCredit = {
  author: "Istanbul Digital Nomads",
  source: "OpenAI",
  sourceHref: "https://openai.com/",
  license: "Generated",
  licenseHref: "https://openai.com/policies/service-terms/",
} satisfies BlogCoverImage["credit"];

export const blogCoverImages: Record<string, BlogCoverImage> = {
  "asian-vs-european-side": {
    src: "/images/blog/asian-vs-european-side-2026.jpg",
    alt: "A ferry table with tea and a laptop bag looking across the Bosphorus between Istanbul's two sides",
    credit: generatedCredit,
  },
  "best-laptop-friendly-cafes-istanbul": {
    src: "/images/blog/best-laptop-friendly-cafes-istanbul-2026.jpg",
    alt: "A laptop, notebook, coffee, and Turkish tea set on a quiet Istanbul cafe table",
    credit: generatedCredit,
  },
  "coworking-vs-cafe-istanbul": {
    src: "/images/blog/coworking-vs-cafe-istanbul-2026.jpg",
    alt: "A laptop, coffee, and notebook on an Istanbul cafe table beside a coworking desk",
    credit: generatedCredit,
  },
  "espressolab-istanbul-remote-work": {
    src: "/images/blog/espressolab-istanbul-remote-work-2026.jpg",
    alt: "A spacious Istanbul roastery workspace with laptops, coffee, and long shared tables",
    credit: generatedCredit,
  },
  "ferry-commute-guide": {
    src: "/images/blog/ferry-commute-guide-2026.jpg",
    alt: "A ferry tea glass and work bag on a Bosphorus ferry table with Istanbul beyond",
    credit: generatedCredit,
  },
  "first-week-mistakes": {
    src: "/images/blog/first-week-mistakes-2026.jpg",
    alt: "A first-week Istanbul setup table with tea, keys, a transit card, notebook, and map",
    credit: generatedCredit,
  },
  "getting-residence-permit": {
    src: "/images/blog/getting-residence-permit-2026.jpg",
    alt: "A residence permit preparation desk with a blue folder, photos, tea, and appointment papers",
    credit: generatedCredit,
  },
  "ikamet-mistakes-istanbul": {
    src: "/images/blog/ikamet-mistakes-istanbul-2026.jpg",
    alt: "An organized ikamet document folder with numbered tabs, tea, photos, and a stamp",
    credit: generatedCredit,
  },
  "iran-to-istanbul-playbook-companion": {
    src: "/images/blog/iran-to-istanbul-playbook-companion-2026.jpg",
    alt: "A suitcase, laptop, notebook, and Turkish tea by an Istanbul ferry waterfront",
    credit: generatedCredit,
  },
  "istanbul-vs-lisbon-bali-bangkok": {
    src: "/images/blog/istanbul-vs-lisbon-bali-bangkok-2026.jpg",
    alt: "A travel comparison desk with four city tokens arranged around a notebook and tea",
    credit: generatedCredit,
  },
  "real-cost-of-living-istanbul-2026": {
    src: "/images/blog/real-cost-of-living-istanbul-2026-2026.jpg",
    alt: "A practical Istanbul monthly budget table with produce, coins, notebook, tea, and keys",
    credit: generatedCredit,
  },
  "slowmad-guide-istanbul": {
    src: "/images/blog/slowmad-guide-istanbul-2026.jpg",
    alt: "A settled Istanbul apartment workspace with laptop, tea, houseplant, and Bosphorus view",
    credit: generatedCredit,
  },
  "top-coworking-spots": {
    src: "/images/blog/top-coworking-spots-2026.jpg",
    alt: "A bright Istanbul coworking table with laptops, coffee, plants, and call booths behind it",
    credit: generatedCredit,
  },
  "turkey-digital-nomad-visa-guide": {
    src: "/images/blog/turkey-digital-nomad-visa-guide-2026.jpg",
    alt: "A digital nomad visa preparation desk with laptop, tea, passport-like booklet, and checklist",
    credit: generatedCredit,
  },
};

export function getBlogCoverImage(slug: string): BlogCoverImage | undefined {
  return blogCoverImages[slug];
}
