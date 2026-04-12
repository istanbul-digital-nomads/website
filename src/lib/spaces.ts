export interface NomadScores {
  wifi: number;
  power: number;
  comfort: number;
  noise: number;
  value: number;
  vibe: number;
}

export interface NomadSpace {
  id: string;
  name: string;
  type: "cafe" | "coworking";
  neighborhood: string;
  coordinates: [number, number];
  address: string;
  description: string;
  nomad_score: NomadScores;
  wifi_speed?: string;
  price_range?: string;
  hours?: string;
  website?: string;
  amenities?: string[];
  laptop_friendly: boolean;
}

const WEIGHTS: Record<keyof NomadScores, number> = {
  wifi: 0.25,
  power: 0.2,
  comfort: 0.15,
  noise: 0.15,
  value: 0.15,
  vibe: 0.1,
};

export function computeNomadScore(scores: NomadScores): number {
  const total = Object.entries(WEIGHTS).reduce(
    (sum, [key, weight]) => sum + scores[key as keyof NomadScores] * weight,
    0,
  );
  return Math.round(total * 10) / 10;
}

export const SCORE_LABELS: Record<keyof NomadScores, string> = {
  wifi: "Wifi",
  power: "Power",
  comfort: "Comfort",
  noise: "Quiet",
  value: "Value",
  vibe: "Vibe",
};

export const spaces: NomadSpace[] = [
  // --- Coworking Spaces ---
  {
    id: "kolektif-house",
    name: "Kolektif House",
    type: "coworking",
    neighborhood: "Levent",
    coordinates: [29.011, 41.077],
    address: "Levent, Istanbul (also Karakoy, Maslak, Sanayi)",
    description:
      "The most popular coworking chain in Istanbul. Multiple locations, 24/7 access for members, free coffee and tea, library, meditation room, and terrace. Great community events.",
    nomad_score: { wifi: 5, power: 5, comfort: 5, noise: 4, value: 4, vibe: 4 },
    wifi_speed: "100+ Mbps",
    price_range: "490-950 TL/mo (~$16-30)",
    hours: "24/7 for members",
    website: "https://kolektifhouse.co",
    amenities: [
      "free coffee",
      "meeting rooms",
      "meditation room",
      "terrace",
      "event space",
      "library",
    ],
    laptop_friendly: true,
  },
  {
    id: "workinton",
    name: "Workinton",
    type: "coworking",
    neighborhood: "Levent",
    coordinates: [29.013, 41.079],
    address: "Levent, Istanbul (also Sisli, Atasehir, Maslak)",
    description:
      "Professional-focused coworking with ergonomic desks, phone booths, and meeting rooms. Great for people who need a proper office setup without the corporate lease.",
    nomad_score: { wifi: 5, power: 5, comfort: 4, noise: 4, value: 5, vibe: 3 },
    wifi_speed: "100+ Mbps",
    price_range: "450-1,000 TL/mo (~$14-32)",
    hours: "8am-8pm (24/7 premium)",
    website: "https://workinton.com",
    amenities: [
      "ergonomic desks",
      "meeting rooms",
      "phone booths",
      "kitchen",
      "printing",
    ],
    laptop_friendly: true,
  },
  {
    id: "mob-kadikoy",
    name: "MOB Kadikoy",
    type: "coworking",
    neighborhood: "Kadikoy",
    coordinates: [29.027, 40.991],
    address: "Kadikoy, Istanbul (also Beyoglu)",
    description:
      "Creative community-driven coworking. Maker's of Beyoglu started as an art collective and still has that energy. Regular community events, quiet zones, and a cafe downstairs.",
    nomad_score: { wifi: 4, power: 4, comfort: 4, noise: 3, value: 4, vibe: 5 },
    wifi_speed: "50-100 Mbps",
    price_range: "800 TL/mo (~$26)",
    hours: "9am-9pm",
    website: "https://mob.ist",
    amenities: [
      "free coffee",
      "community events",
      "quiet zones",
      "cafe",
      "art space",
    ],
    laptop_friendly: true,
  },
  {
    id: "impact-hub",
    name: "Impact Hub Istanbul",
    type: "coworking",
    neighborhood: "Kagithane",
    coordinates: [28.973, 41.065],
    address: "Kagithane, Istanbul",
    description:
      "Focused on social impact and startups. Affordable entry point with mentoring programs and a strong community of founders. A bit far from the nomad neighborhoods but worth it for the network.",
    nomad_score: { wifi: 3, power: 4, comfort: 3, noise: 4, value: 5, vibe: 3 },
    wifi_speed: "50+ Mbps",
    price_range: "From 200 TL/mo (~$6)",
    hours: "9am-7pm",
    website: "https://istanbul.impacthub.net",
    amenities: ["event space", "mentoring", "startup community", "kitchen"],
    laptop_friendly: true,
  },
  {
    id: "justwork",
    name: "JUSTWork",
    type: "coworking",
    neighborhood: "Kagithane",
    coordinates: [28.971, 41.067],
    address: "Kagithane/Eyup, Istanbul",
    description:
      "Massive 10,000 sqm space with everything you could need - sleeping pods, gym, showers, music studio, game room, garden. It's basically a nomad campus.",
    nomad_score: { wifi: 5, power: 5, comfort: 5, noise: 4, value: 4, vibe: 4 },
    wifi_speed: "100+ Mbps",
    price_range: "From 600 TL/mo (~$19)",
    hours: "24/7",
    website: "https://justwork.com.tr",
    amenities: [
      "sleeping pods",
      "gym",
      "showers",
      "music studio",
      "game room",
      "kitchen",
      "garden",
    ],
    laptop_friendly: true,
  },

  // --- Cafes: Kadikoy / Moda ---
  {
    id: "petra-roasting",
    name: "Petra Roasting Co",
    type: "cafe",
    neighborhood: "Kadikoy",
    coordinates: [29.028, 40.989],
    address: "Kadikoy, Istanbul",
    description:
      "Specialty coffee with excellent wifi and a nomad-friendly atmosphere. Spacious, good lighting, and staff don't mind long stays. One of the best work cafes on the Asian side.",
    nomad_score: { wifi: 5, power: 4, comfort: 4, noise: 3, value: 4, vibe: 5 },
    wifi_speed: "50+ Mbps",
    price_range: "$$",
    hours: "8am-10pm",
    amenities: ["specialty coffee", "spacious", "good lighting"],
    laptop_friendly: true,
  },
  {
    id: "coffee-manifesto",
    name: "Coffee Manifesto",
    type: "cafe",
    neighborhood: "Kadikoy",
    coordinates: [29.026, 40.988],
    address: "Kadikoy, Istanbul",
    description:
      "Solid wifi, multiple outlets, and a chill atmosphere. Gets busy on weekends but weekday mornings are perfect for deep work.",
    nomad_score: { wifi: 4, power: 4, comfort: 3, noise: 3, value: 4, vibe: 4 },
    wifi_speed: "30-50 Mbps",
    price_range: "$$",
    hours: "8am-11pm",
    amenities: ["outdoor seating", "good coffee"],
    laptop_friendly: true,
  },
  {
    id: "walters-coffee",
    name: "Walter's Coffee Roastery",
    type: "cafe",
    neighborhood: "Kadikoy",
    coordinates: [29.024, 40.987],
    address: "Kadikoy, Istanbul",
    description:
      "Breaking Bad themed cafe with decent wifi. More of a vibe spot than a serious work cafe, but the coffee is great and it's a fun change of scenery.",
    nomad_score: { wifi: 3, power: 3, comfort: 3, noise: 2, value: 4, vibe: 5 },
    wifi_speed: "20-40 Mbps",
    price_range: "$$",
    hours: "9am-11pm",
    amenities: ["themed decor", "good coffee", "outdoor seating"],
    laptop_friendly: true,
  },
  {
    id: "montag-coffee",
    name: "Montag Coffee",
    type: "cafe",
    neighborhood: "Moda",
    coordinates: [29.028, 40.979],
    address: "Moda, Istanbul",
    description:
      "Quiet Moda gem with reliable wifi, plenty of outlets, and a calm atmosphere. The neighborhood itself is walkable and beautiful - perfect for a post-work stroll along the coast.",
    nomad_score: { wifi: 4, power: 4, comfort: 4, noise: 4, value: 4, vibe: 4 },
    wifi_speed: "40-60 Mbps",
    price_range: "$$",
    hours: "8am-10pm",
    amenities: ["quiet", "coastal neighborhood", "outlets"],
    laptop_friendly: true,
  },

  // --- Cafes: Cihangir / Beyoglu ---
  {
    id: "federal-coffee",
    name: "Federal Coffee Company",
    type: "cafe",
    neighborhood: "Cihangir",
    coordinates: [28.984, 41.032],
    address: "Cihangir, Istanbul",
    description:
      "The unofficial nomad HQ of the European side. Fast wifi, lots of outlets, great food menu, and a crowd that's 50% laptops on any given day. You'll meet other remote workers here without trying.",
    nomad_score: { wifi: 5, power: 4, comfort: 4, noise: 3, value: 3, vibe: 5 },
    wifi_speed: "50+ Mbps",
    price_range: "$$$",
    hours: "8am-11pm",
    amenities: ["food menu", "nomad crowd", "Bosphorus views nearby"],
    laptop_friendly: true,
  },
  {
    id: "coffee-sapiens",
    name: "Coffee Sapiens",
    type: "cafe",
    neighborhood: "Beyoglu",
    coordinates: [28.978, 41.034],
    address: "Beyoglu, Istanbul",
    description:
      "Specialty roaster with a clean, minimal space. Good for focused work sessions. Not the most outlets but the wifi is solid and the coffee is top-tier.",
    nomad_score: { wifi: 4, power: 3, comfort: 4, noise: 4, value: 3, vibe: 4 },
    wifi_speed: "30-50 Mbps",
    price_range: "$$$",
    hours: "8am-10pm",
    amenities: ["specialty roaster", "minimal design"],
    laptop_friendly: true,
  },
  {
    id: "norm-coffee",
    name: "Norm Coffee",
    type: "cafe",
    neighborhood: "Beyoglu",
    coordinates: [28.976, 41.033],
    address: "Beyoglu, Istanbul",
    description:
      "Multi-level space with different vibes on each floor. The upstairs is quieter for work, downstairs is more social. Decent wifi and the staff are used to nomads camping out.",
    nomad_score: { wifi: 4, power: 3, comfort: 4, noise: 3, value: 4, vibe: 4 },
    wifi_speed: "30-50 Mbps",
    price_range: "$$",
    hours: "8am-11pm",
    amenities: ["multi-level", "quiet upstairs", "good food"],
    laptop_friendly: true,
  },
  {
    id: "espressolab",
    name: "Espressolab",
    type: "cafe",
    neighborhood: "Cihangir",
    coordinates: [28.982, 41.031],
    address: "Cihangir, Istanbul",
    description:
      "Chain cafe but the Cihangir location has a nice terrace. Wifi is okay, power can be hit or miss depending on where you sit. Best for shorter work sessions.",
    nomad_score: { wifi: 3, power: 3, comfort: 3, noise: 3, value: 4, vibe: 3 },
    wifi_speed: "20-40 Mbps",
    price_range: "$$",
    hours: "7am-11pm",
    amenities: ["terrace", "chain reliability"],
    laptop_friendly: true,
  },

  // --- Cafes: Karakoy / Galata ---
  {
    id: "karabatak",
    name: "Karabatak",
    type: "cafe",
    neighborhood: "Karakoy",
    coordinates: [28.975, 41.024],
    address: "Karakoy, Istanbul",
    description:
      "Hidden courtyard cafe that feels like a secret garden. Fast wifi, good food, and a genuinely unique atmosphere. Gets crowded on weekends but weekdays are golden.",
    nomad_score: { wifi: 4, power: 4, comfort: 4, noise: 3, value: 3, vibe: 5 },
    wifi_speed: "40-60 Mbps",
    price_range: "$$$",
    hours: "8am-10pm",
    amenities: ["courtyard", "food menu", "hidden gem"],
    laptop_friendly: true,
  },
  {
    id: "kronotrop",
    name: "Kronotrop",
    type: "cafe",
    neighborhood: "Karakoy",
    coordinates: [28.977, 41.023],
    address: "Karakoy, Istanbul",
    description:
      "Award-winning specialty roaster. Small but well-designed space with reliable wifi. The pour-over is worth the trip alone. Better for 2-3 hour focused sessions than all-day camps.",
    nomad_score: { wifi: 4, power: 3, comfort: 3, noise: 3, value: 3, vibe: 5 },
    wifi_speed: "30-50 Mbps",
    price_range: "$$$",
    hours: "8am-8pm",
    amenities: ["specialty coffee", "pour-over", "small space"],
    laptop_friendly: true,
  },
  {
    id: "moc-karakoy",
    name: "MOC Karakoy",
    type: "cafe",
    neighborhood: "Karakoy",
    coordinates: [28.974, 41.022],
    address: "Karakoy, Istanbul",
    description:
      "Ministry of Coffee - spacious industrial space with good wifi and plenty of seating. Solid all-day work cafe with a food menu that goes beyond just pastries.",
    nomad_score: { wifi: 4, power: 3, comfort: 4, noise: 3, value: 4, vibe: 3 },
    wifi_speed: "30-50 Mbps",
    price_range: "$$",
    hours: "8am-10pm",
    amenities: ["spacious", "industrial design", "food menu"],
    laptop_friendly: true,
  },

  // --- Cafes: Besiktas ---
  {
    id: "kitsune-coffee",
    name: "Kitsune Coffee",
    type: "cafe",
    neighborhood: "Besiktas",
    coordinates: [29.008, 41.044],
    address: "Besiktas, Istanbul",
    description:
      "Japanese-inspired cafe with a calm, focused energy. Good wifi, reasonable prices for the area, and the matcha latte is the best in Istanbul.",
    nomad_score: { wifi: 4, power: 3, comfort: 4, noise: 4, value: 4, vibe: 4 },
    wifi_speed: "30-50 Mbps",
    price_range: "$$",
    hours: "9am-10pm",
    amenities: ["japanese inspired", "matcha", "calm atmosphere"],
    laptop_friendly: true,
  },
  {
    id: "coffeetopia",
    name: "Coffeetopia",
    type: "cafe",
    neighborhood: "Besiktas",
    coordinates: [29.006, 41.043],
    address: "Besiktas, Istanbul",
    description:
      "Reliable chain with consistent wifi and power across all locations. The Besiktas branch is near the ferry terminal - grab a coffee before the commute or settle in for a work session.",
    nomad_score: { wifi: 3, power: 4, comfort: 3, noise: 2, value: 4, vibe: 3 },
    wifi_speed: "20-40 Mbps",
    price_range: "$",
    hours: "7am-11pm",
    amenities: ["near ferry", "chain reliability", "affordable"],
    laptop_friendly: true,
  },
  {
    id: "coffee-department",
    name: "Coffee Department",
    type: "cafe",
    neighborhood: "Kadikoy",
    coordinates: [29.023, 40.99],
    address: "Kadikoy, Istanbul",
    description:
      "Third-wave coffee shop with a dedicated work area upstairs. The staff actively welcome nomads and they've got great power strip setups under the tables.",
    nomad_score: { wifi: 4, power: 5, comfort: 4, noise: 3, value: 4, vibe: 4 },
    wifi_speed: "40-60 Mbps",
    price_range: "$$",
    hours: "8am-10pm",
    amenities: ["work area upstairs", "power strips", "third-wave coffee"],
    laptop_friendly: true,
  },
  {
    id: "cafe-fes",
    name: "Cafe Fes",
    type: "cafe",
    neighborhood: "Cihangir",
    coordinates: [28.985, 41.033],
    address: "Cihangir, Istanbul",
    description:
      "Cihangir institution with outdoor seating overlooking the Bosphorus. Wifi isn't the fastest but the view makes up for it. Best for light work and calls where you want a scenic background.",
    nomad_score: { wifi: 3, power: 2, comfort: 3, noise: 2, value: 3, vibe: 5 },
    wifi_speed: "15-30 Mbps",
    price_range: "$$",
    hours: "8am-midnight",
    amenities: ["Bosphorus view", "outdoor seating", "institution"],
    laptop_friendly: true,
  },
];
