export type BlogCoverSource = "Unsplash" | "Wikimedia Commons";
export type BlogCoverLicense = "Unsplash" | "CC-BY-SA";

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

const unsplashLicense = "https://unsplash.com/license";
const ccBySaLicense = "https://creativecommons.org/licenses/by-sa/4.0/";

export const blogCoverImages: Record<string, BlogCoverImage> = {
  "asian-vs-european-side": {
    src: "/images/blog/asian-vs-european-side.jpg",
    alt: "A ferry passenger looking across the Bosphorus toward the Istanbul skyline",
    credit: {
      author: "alicharmant",
      source: "Unsplash",
      sourceHref:
        "https://unsplash.com/photos/person-on-a-ferry-looking-at-city-skyline-yQRgtOyccbo",
      license: "Unsplash",
      licenseHref: unsplashLicense,
    },
  },
  "best-laptop-friendly-cafes-istanbul": {
    src: "/images/blog/best-laptop-friendly-cafes-istanbul.jpg",
    alt: "A laptop, Turkish coffee, and water set on a quiet cafe table",
    credit: {
      author: "engin akyurt",
      source: "Unsplash",
      sourceHref:
        "https://unsplash.com/photos/a-laptop-and-a-cup-of-coffee-G3Hhl4UlVh0",
      license: "Unsplash",
      licenseHref: unsplashLicense,
    },
  },
  "espressolab-istanbul-remote-work": {
    src: "/images/blog/espressolab-istanbul-remote-work.jpg",
    alt: "A remote worker seated with a laptop in a warm Istanbul cafe",
    credit: {
      author: "Unsplash contributor",
      source: "Unsplash",
      sourceHref:
        "https://unsplash.com/photos/a-man-sitting-in-front-of-a-laptop-computer-exj6iT6MTE8",
      license: "Unsplash",
      licenseHref: unsplashLicense,
    },
  },
  "ferry-commute-guide": {
    src: "/images/blog/ferry-commute-guide.jpg",
    alt: "A ferry crossing the Bosphorus with Istanbul rising behind it",
    credit: {
      author: "Anil Baki Durmus",
      source: "Unsplash",
      sourceHref:
        "https://unsplash.com/photos/a-ferry-travels-across-water-with-a-city-in-the-background-KBOGvFPzLtw",
      license: "Unsplash",
      licenseHref: unsplashLicense,
    },
  },
  "first-week-mistakes": {
    src: "/images/blog/first-week-mistakes.jpg",
    alt: "A pale Istanbul street corner in Kadikoy with tram wires overhead",
    credit: {
      author: "Unsplash contributor",
      source: "Unsplash",
      sourceHref:
        "https://unsplash.com/photos/a-red-and-white-train-traveling-down-a-street-next-to-tall-buildings-Ge3CSfKrDV4",
      license: "Unsplash",
      licenseHref: unsplashLicense,
    },
  },
  "getting-residence-permit": {
    src: "/images/blog/getting-residence-permit.jpg",
    alt: "A passport placed alone on a dark green surface",
    credit: {
      author: "Kelly Sikkema",
      source: "Unsplash",
      sourceHref: "https://unsplash.com/photos/passport-book-RiUZQOfQ8XE",
      license: "Unsplash",
      licenseHref: unsplashLicense,
    },
  },
  "istanbul-vs-lisbon-bali-bangkok": {
    src: "/images/blog/istanbul-vs-lisbon-bali-bangkok.jpg",
    alt: "Galata Tower silhouetted by a deep orange Istanbul sunset",
    credit: {
      author: "Unsplash contributor",
      source: "Unsplash",
      sourceHref:
        "https://unsplash.com/photos/the-sun-is-setting-over-a-large-city-6gWV88dLj3Y",
      license: "Unsplash",
      licenseHref: unsplashLicense,
    },
  },
  "real-cost-of-living-istanbul-2026": {
    src: "/images/blog/real-cost-of-living-istanbul-2026.jpg",
    alt: "Fresh fish arranged at the Besiktas market in Istanbul",
    credit: {
      author: "Wikimedia contributor",
      source: "Wikimedia Commons",
      sourceHref:
        "https://commons.wikimedia.org/wiki/File:Fish_Market_Be%C5%9Fikta%C5%9F_ISTANBUL_(15651621734).jpg",
      license: "CC-BY-SA",
      licenseHref: ccBySaLicense,
    },
  },
  "slowmad-guide-istanbul": {
    src: "/images/blog/slowmad-guide-istanbul.jpg",
    alt: "A glass of Turkish tea on a small table",
    credit: {
      author: "Mr. Pugo",
      source: "Unsplash",
      sourceHref:
        "https://unsplash.com/photos/two-glasses-of-turkish-tea-are-on-a-table-l4UkUw35jns",
      license: "Unsplash",
      licenseHref: unsplashLicense,
    },
  },
  "top-coworking-spots": {
    src: "/images/blog/top-coworking-spots.jpg",
    alt: "A focused remote worker seated at a laptop in a warm cafe interior",
    credit: {
      author: "Unsplash contributor",
      source: "Unsplash",
      sourceHref:
        "https://unsplash.com/photos/a-man-sitting-in-front-of-a-laptop-computer-exj6iT6MTE8",
      license: "Unsplash",
      licenseHref: unsplashLicense,
    },
  },
  "turkey-digital-nomad-visa-guide": {
    src: "/images/blog/turkey-digital-nomad-visa-guide.jpg",
    alt: "A passport placed alone on a dark green surface",
    credit: {
      author: "Kelly Sikkema",
      source: "Unsplash",
      sourceHref: "https://unsplash.com/photos/passport-book-RiUZQOfQ8XE",
      license: "Unsplash",
      licenseHref: unsplashLicense,
    },
  },
};

export function getBlogCoverImage(slug: string): BlogCoverImage | undefined {
  return blogCoverImages[slug];
}
