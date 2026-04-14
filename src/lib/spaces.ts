export interface NomadScores {
  wifi: number | null;
  power: number | null;
  comfort: number | null;
  noise: number | null;
  value: number | null;
  vibe: number | null;
}

export interface SpaceSource {
  label: string;
  url: string;
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
  // Verification metadata - populated/maintained by the nomad-space-scorer agent.
  status?: "open" | "closed" | "unverified";
  last_verified?: string; // ISO date, YYYY-MM-DD
  sources?: SpaceSource[];
  unverified_fields?: string[];
}

const WEIGHTS: Record<keyof NomadScores, number> = {
  wifi: 0.25,
  power: 0.2,
  comfort: 0.15,
  noise: 0.15,
  value: 0.15,
  vibe: 0.1,
};

// Returns null only when fewer than 3 dimensions are scored. Otherwise
// renormalizes over the present dimensions so a partially scored space
// surfaces honestly. We don't gate on wifi specifically because confirmed
// Mbps numbers are rare in the wild (Google reviews don't mention them).
const MIN_DIMENSIONS = 3;
export function computeNomadScore(scores: NomadScores): number | null {
  let total = 0;
  let weightSum = 0;
  let count = 0;
  for (const [key, weight] of Object.entries(WEIGHTS)) {
    const v = scores[key as keyof NomadScores];
    if (v == null) continue;
    total += v * weight;
    weightSum += weight;
    count += 1;
  }
  if (count < MIN_DIMENSIONS || weightSum === 0) return null;
  return Math.round((total / weightSum) * 10) / 10;
}

// True when the score was computed from a partial set of dimensions.
export function isPartialScore(scores: NomadScores): boolean {
  return Object.values(scores).some((v) => v == null);
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
    address:
      "Esentepe Mah. Talatpasa Cad. No:5 (Harman Sok. Girisi), Sisli, Istanbul (also Moda, Karakoy, Maslak, Sanayi)",
    description:
      "One of Istanbul's larger coworking chains, with multiple locations. 24/7 access for members, free coffee and tea, meditation room, library, and terrace event spaces. Converted embroidery factory design.",
    nomad_score: {
      wifi: null,
      power: null,
      comfort: 4,
      noise: null,
      value: 2,
      vibe: 4,
    },
    price_range: "Quote on request",
    hours: "24/7 access for members",
    website: "https://kolektifhouse.co",
    amenities: [
      "free coffee",
      "meeting rooms",
      "meditation room",
      "terrace",
      "event space",
      "library",
      "phone booths",
      "standing desks",
    ],
    laptop_friendly: true,
    status: "open",
    last_verified: "2026-04-15",
    sources: [
      {
        label: "Kolektif House - Levent location",
        url: "https://kolektifhouse.co/en/locations/levent",
      },
      {
        label: "Coworker.com - Kolektif House Levent",
        url: "https://www.coworker.com/turkey/istanbul/kolektif-house-levent",
      },
      {
        label: "Wheree - Kolektif House Levent (price-vs-Europe reviews)",
        url: "https://kolektif-house-levent.wheree.com/",
      },
    ],
    unverified_fields: [
      "wifi_speed",
      "nomad_score.wifi",
      "nomad_score.power",
      "nomad_score.noise",
      "price_range",
    ],
  },
  {
    id: "workinton",
    name: "Workinton",
    type: "coworking",
    neighborhood: "Levent",
    coordinates: [29.013, 41.079],
    address:
      "Multiple Istanbul locations (Levent 199 Plaza, Macka, Ulus, Kadikoy, Kozyatagi, Maslak, Galata, Atasehir, Umraniye, Sapphire)",
    description:
      "Professional-focused coworking chain with 20+ Turkey locations. Ergonomic desks, phone booths, meeting rooms, lockers, printing. Member access works across branches.",
    nomad_score: {
      wifi: null,
      power: null,
      comfort: 4,
      noise: null,
      value: null,
      vibe: null,
    },
    price_range: "Quote on request",
    hours: "24/7 for members (per official site)",
    website: "https://workinton.com",
    amenities: [
      "ergonomic desks",
      "meeting rooms",
      "phone booths",
      "kitchen",
      "printing",
      "lockers",
      "lounge",
    ],
    laptop_friendly: true,
    status: "open",
    last_verified: "2026-04-15",
    sources: [
      {
        label: "Workinton coworking page",
        url: "https://workinton.com/en/coworking/",
      },
      {
        label: "Workinton Levent 199",
        url: "https://www.workinton.com/en/istanbul-levent-199/",
      },
      {
        label: "Workinton locations",
        url: "https://www.workinton.com/en/locations/",
      },
    ],
    unverified_fields: [
      "wifi_speed",
      "nomad_score.wifi",
      "nomad_score.power",
      "nomad_score.noise",
      "nomad_score.value",
      "nomad_score.vibe",
      "price_range",
    ],
  },
  {
    id: "impact-hub",
    name: "Impact Hub Istanbul",
    type: "coworking",
    neighborhood: "Kagithane",
    coordinates: [28.973, 41.065],
    address:
      "Yesilce Mah. Emirsah Sok. No:21 (4. Levent), Kagithane, Istanbul 34418",
    description:
      "Part of the global Impact Hub network (60+ countries). Community of social-impact founders, plug-and-work micro offices, reading corners, two meeting rooms, and a sky-deck. Near 4. Levent metro.",
    nomad_score: {
      wifi: 5,
      power: 4,
      comfort: 4,
      noise: 4,
      value: null,
      vibe: 4,
    },
    wifi_speed: "Up to 300 Mbps (per Coworker.com listing)",
    hours: "Mon-Fri 8am-10pm, Sat 9am-5pm (per Coworker.com)",
    website: "https://istanbul.impacthub.net",
    amenities: [
      "high-speed wifi",
      "standing desks",
      "printing",
      "24-hour access",
      "phone booths",
      "kitchen",
      "outdoor terrace",
      "free coffee",
      "event space",
    ],
    laptop_friendly: true,
    status: "open",
    last_verified: "2026-04-15",
    sources: [
      {
        label: "Impact Hub Istanbul homepage",
        url: "https://istanbul.impacthub.net/en/homepage/",
      },
      {
        label: "Coworker.com - Impact Hub Istanbul",
        url: "https://www.coworker.com/turkey/istanbul/impact-hub-istanbul",
      },
      {
        label: "Freaking Nomads - Impact Hub Istanbul (300 Mbps wifi cited)",
        url: "https://freakingnomads.com/workspace/impact-hub-istanbul",
      },
    ],
    unverified_fields: ["price_range", "nomad_score.value"],
  },
  {
    id: "justwork",
    name: "JUSTWork Office Campus",
    type: "coworking",
    neighborhood: "Umraniye",
    coordinates: [29.12, 41.016],
    address:
      "FSM Mah. Balkan Cad. JUSTWork Ofis Kampus No:62A, 34770 Umraniye, Istanbul (at Meydan Istanbul mall)",
    description:
      "10,000 sqm office campus modeled on Silicon Valley campuses. Sleeping pods, gym, showers, music studio, game room, broadcast studio, outdoor garden workspace, up to 20 themed meeting rooms. 24/7 access for members.",
    nomad_score: {
      wifi: null,
      power: 5,
      comfort: 5,
      noise: null,
      value: null,
      vibe: 4,
    },
    hours: "24/7 for members",
    website: "https://www.just-work.com",
    amenities: [
      "sleeping pods",
      "gym",
      "showers",
      "music studio",
      "game room",
      "kitchen",
      "garden",
      "broadcast studio",
      "meditation classes",
      "EV charging",
      "parking",
      "unlimited coffee/tea",
    ],
    laptop_friendly: true,
    status: "open",
    last_verified: "2026-04-15",
    sources: [
      { label: "JUSTWork official site", url: "https://www.just-work.com/" },
      {
        label: "JUSTWork about page",
        url: "https://www.just-work.com/about",
      },
      {
        label: "Yandex Maps - JUSTWork Office Campus",
        url: "https://yandex.com/maps/org/justwork_office_campus/127199350127/",
      },
    ],
    unverified_fields: [
      "wifi_speed",
      "price_range",
      "nomad_score.wifi",
      "nomad_score.noise",
      "nomad_score.value",
    ],
  },

  // --- Cafes: Kadikoy / Moda ---
  {
    id: "petra-roasting",
    name: "Petra Roasting Co",
    type: "cafe",
    neighborhood: "Kadikoy",
    coordinates: [29.028, 40.989],
    address:
      "Kadikoy, Istanbul (also Gayrettepe, Akmerkez Etiler, Kanyon Levent)",
    description:
      "Istanbul-based specialty coffee roaster. The Kadikoy branch is frequently cited in laptop-cafe roundups, and staff are generally fine with longer stays. Can get noisy at peak hours per reviewer notes.",
    nomad_score: {
      wifi: null,
      power: null,
      comfort: 4,
      noise: 2,
      value: null,
      vibe: 4,
    },
    price_range: "$$",
    amenities: ["specialty coffee", "in-house roasted beans"],
    laptop_friendly: true,
    status: "open",
    last_verified: "2026-04-15",
    sources: [
      {
        label: "Coffee Radar - Petra Roasting Co",
        url: "https://coffeeradar.io/coffee-shop/petra-roasting-co/",
      },
      {
        label: "The Global Circle - Istanbul laptop cafes",
        url: "https://www.theglobalcircle.com/best-laptop-friendly-work-cafes-tea-shops-in-istanbul",
      },
      {
        label: "Petra Roasting Facebook",
        url: "https://www.facebook.com/petraroastingco/",
      },
      {
        label: "Tripadvisor - Petra Roasting Co (loud music reviews)",
        url: "https://www.tripadvisor.com/Restaurant_Review-g293974-d14133671-Reviews-Petra_Roasting_Co-Istanbul.html",
      },
    ],
    unverified_fields: [
      "wifi_speed",
      "hours",
      "nomad_score.wifi",
      "nomad_score.power",
      "nomad_score.value",
    ],
  },
  {
    id: "coffee-manifesto",
    name: "Coffee Manifesto",
    type: "cafe",
    neighborhood: "Kadikoy",
    coordinates: [29.026, 40.988],
    address:
      "Cafergaga Mah., Guneslibahce Sok. No:40/A, 34710 Kadikoy, Istanbul",
    description:
      "Well-known Kadikoy specialty coffee shop. Barista Koray Erdogdu on staff. Reviewers flag charging sockets at tables and say the space works for laptop sessions. Also has a Yeldegirmeni branch.",
    nomad_score: {
      wifi: null,
      power: 4,
      comfort: 3,
      noise: null,
      value: null,
      vibe: 4,
    },
    price_range: "$$",
    hours: "Mon-Thu 8am-10pm, Fri-Sat 8am-11pm, Sun 8am-10pm",
    amenities: [
      "outdoor seating",
      "charging sockets",
      "specialty coffee",
      "pet-friendly",
    ],
    laptop_friendly: true,
    status: "open",
    last_verified: "2026-04-15",
    sources: [
      {
        label: "Yelp - Coffee Manifesto",
        url: "https://www.yelp.com/biz/coffee-manifesto-istanbul",
      },
      {
        label: "Laptop Friendly Cafe - Coffee Manifesto",
        url: "https://laptopfriendlycafe.com/cafes/istanbul/coffee-manifesto",
      },
      {
        label: "Specialty Coffee Map - Coffee Manifesto Yeldegirmeni",
        url: "https://specialtycoffeemap.com/coffeeshop/coffee-manifesto-yeldegirmeni_Z2SmpCs",
      },
      {
        label: "Restaurant Guru - Coffee Manifesto",
        url: "https://restaurantguru.com/Coffee-Manifesto-Istanbul-4",
      },
    ],
    unverified_fields: [
      "wifi_speed",
      "nomad_score.wifi",
      "nomad_score.noise",
      "nomad_score.value",
    ],
  },
  {
    id: "walters-coffee",
    name: "Walter's Coffee Roastery",
    type: "cafe",
    neighborhood: "Kadikoy",
    coordinates: [29.024, 40.987],
    address:
      "Caferaga Mah. Badem Alti Sok. No:21/B, Moda, Kadikoy, Istanbul 34710",
    description:
      "Breaking Bad themed cafe and in-house roastery in Moda, open since 2015. A vibe destination more than a serious work spot, but at least one reviewer calls it fine for remote work. Themed decor, hazmat suits on display.",
    nomad_score: {
      wifi: null,
      power: null,
      comfort: 3,
      noise: 2,
      value: null,
      vibe: 5,
    },
    price_range: "$$",
    hours: "10am-11pm daily",
    amenities: ["themed decor", "specialty coffee", "in-house roastery"],
    laptop_friendly: true,
    status: "open",
    last_verified: "2026-04-15",
    sources: [
      {
        label: "Tripadvisor - Walter's Coffee Roastery",
        url: "https://www.tripadvisor.com/Restaurant_Review-g293974-d8458553-Reviews-Walter_s_Coffee_Roastery-Istanbul.html",
      },
      {
        label: "Yandex Maps - Walter Coffee Roastery",
        url: "https://yandex.com/maps/org/walter_coffee_roastery/237754201723/",
      },
    ],
    unverified_fields: [
      "wifi_speed",
      "nomad_score.wifi",
      "nomad_score.power",
      "nomad_score.value",
    ],
  },
  {
    id: "montag-coffee",
    name: "Montag Coffee Roasters",
    type: "cafe",
    neighborhood: "Moda",
    coordinates: [29.028, 40.979],
    address:
      "Caferaga Mah., Muvakkithane Cad., Kadikoy, Istanbul (Moda branch; also Kadikoy harbor and Bomonti)",
    description:
      "Berlin-style specialty roaster with multiple Kadikoy/Moda locations. Calm ambiance, balcony seating, friendly baristas. Not the biggest space, so peak-hour seating can be tight.",
    nomad_score: {
      wifi: null,
      power: 4,
      comfort: 3,
      noise: 4,
      value: null,
      vibe: 4,
    },
    price_range: "$$",
    hours:
      "10am-10pm (per European Coffee Trip listing for the Kadikoy branch)",
    amenities: ["specialty coffee", "in-house roaster", "balcony seating"],
    laptop_friendly: true,
    status: "open",
    last_verified: "2026-04-15",
    sources: [
      { label: "Montag Coffee official", url: "https://www.montagcoffee.com/" },
      {
        label: "European Coffee Trip - Montag Kadikoy",
        url: "https://europeancoffeetrip.com/cafe/montagcoffeemadikoy-istanb/",
      },
      {
        label: "Yandex Maps - Montag Coffee Moda",
        url: "https://yandex.com/maps/org/montag_coffee_roasters_moda/197053296015/",
      },
      {
        label: "Yelp - Montag Coffee Roasters",
        url: "https://www.yelp.com/biz/montag-coffee-roasters-istanbul-7",
      },
    ],
    unverified_fields: ["wifi_speed", "nomad_score.wifi", "nomad_score.value"],
  },

  // --- Cafes: Cihangir / Beyoglu ---
  {
    id: "federal-coffee",
    name: "Federal Coffee Company (Galata)",
    type: "cafe",
    neighborhood: "Galata",
    coordinates: [28.975, 41.026],
    address:
      "Sahkulu, Kucuk Hendek Cd. No:7, 34421 Beyoglu/Istanbul (Galata branch; chain also has Cihangir and Levent locations)",
    description:
      "Pioneer of specialty coffee in Turkey, multiple Istanbul branches. Galata location is frequently cited as one of the best nomad cafes on the European side - lots of seating, plentiful power plugs per third-party reviews. Free wifi, speed varies.",
    nomad_score: {
      wifi: null,
      power: 4,
      comfort: 4,
      noise: 3,
      value: null,
      vibe: 5,
    },
    price_range: "$$$",
    hours: "8am-11pm daily",
    amenities: ["food menu", "outdoor seating", "cocktails", "nomad-friendly"],
    laptop_friendly: true,
    status: "open",
    last_verified: "2026-04-15",
    sources: [
      {
        label: "Laptop Friendly Cafe - Federal Galata",
        url: "https://laptopfriendlycafe.com/cafes/istanbul/federal-galata",
      },
      {
        label: "Specialty Coffee Map - Federal Galata",
        url: "https://specialtycoffeemap.com/coffeeshop/federal-galata_Sg0Sb7t",
      },
      {
        label: "Yelp - Federal Coffee Company",
        url: "https://www.yelp.com/biz/federal-coffee-company-istanbul",
      },
    ],
    unverified_fields: ["wifi_speed", "nomad_score.wifi", "nomad_score.value"],
  },
  {
    id: "coffee-sapiens",
    name: "Coffee Sapiens",
    type: "cafe",
    neighborhood: "Karakoy",
    coordinates: [28.978, 41.025],
    address:
      "Kilic Ali Pasa Mescidi Sok., Kemankes Karamustafa Pasa, Beyoglu/Karakoy, Istanbul (also Kanyon, Caddebostan; roastery in Haskoy)",
    description:
      "Independent specialty roaster since 2014, known for Rwanda filter coffees and flat whites. Multiple brewing methods (Aeropress, Chemex, cold brew, siphon). The Karakoy branch sits on a vine-shaded street of cafes.",
    nomad_score: {
      wifi: null,
      power: null,
      comfort: 2,
      noise: null,
      value: 2,
      vibe: 4,
    },
    price_range: "$$$",
    amenities: ["specialty roaster", "multiple brewing methods"],
    laptop_friendly: true,
    status: "open",
    last_verified: "2026-04-15",
    sources: [
      {
        label: "Coffee Sapiens addresses",
        url: "https://www.coffeesapiens.com/pages/addresses",
      },
      {
        label: "Specialty Coffee Map - Coffee Sapiens",
        url: "https://specialtycoffeemap.com/coffeeshop/coffee-sapiens_ZpAJBrC",
      },
      {
        label: "Time Out Istanbul - Coffee Sapiens",
        url: "https://www.timeout.com/istanbul/restaurants/coffee-sapiens",
      },
      {
        label: "Tripadvisor - Coffee Sapiens (seating + price reviews)",
        url: "https://www.tripadvisor.com/Restaurant_Review-g293974-d7045355-Reviews-Coffee_Sapiens-Istanbul.html",
      },
    ],
    unverified_fields: [
      "wifi_speed",
      "hours",
      "nomad_score.wifi",
      "nomad_score.power",
      "nomad_score.noise",
    ],
  },
  {
    id: "norm-coffee",
    name: "Norm Coffee",
    type: "cafe",
    neighborhood: "Cihangir",
    coordinates: [28.984, 41.031],
    address: "Cihangir Mah., Gunesli Sok. No:39/A, 34433 Beyoglu, Istanbul",
    description:
      "Multi-roaster specialty cafe in Cihangir, using beans from Probador Colectiva, Petra, Kronotrop, and Four Letter Word. Custom-made Slayer espresso machine (only one in Istanbul), V60 and filter. Minimalist interior, homemade Basque cheesecake and tartines.",
    nomad_score: {
      wifi: null,
      power: null,
      comfort: 3,
      noise: 4,
      value: null,
      vibe: 4,
    },
    price_range: "$$",
    hours: "Mon-Fri 8am-8pm, Sat-Sun 10am-8pm",
    amenities: [
      "specialty coffee",
      "multi-roaster",
      "pastries",
      "minimal interior",
    ],
    laptop_friendly: true,
    status: "open",
    last_verified: "2026-04-15",
    sources: [
      {
        label: "Tripadvisor - Norm Coffee",
        url: "https://www.tripadvisor.com/Restaurant_Review-g293974-d8020388-Reviews-Norm_Coffee-Istanbul.html",
      },
      {
        label: "Yelp - Norm Coffee",
        url: "https://www.yelp.com/biz/norm-coffee-istanbul",
      },
      {
        label: "Beanhunter - Norm Coffee",
        url: "https://www.beanhunter.com/istanbul/norm-coffee-beyoglu",
      },
      {
        label: "Time Out Istanbul - Norm Coffee",
        url: "https://www.timeout.com/istanbul/restaurants/norm-coffee",
      },
    ],
    unverified_fields: [
      "wifi_speed",
      "nomad_score.wifi",
      "nomad_score.power",
      "nomad_score.value",
    ],
  },
  {
    id: "espressolab",
    name: "Espressolab Cihangir",
    type: "cafe",
    neighborhood: "Cihangir",
    coordinates: [28.982, 41.031],
    address: "Siraselviler Cad. 115-A/1, 34425 Beyoglu/Cihangir, Istanbul",
    description:
      "Two-level branch of the Turkish specialty chain, with a balcony overlooking the street. Free wifi capped at 2 hours (noted by visitor guides), so not ideal for all-day camps. Large menu, consistent across the chain.",
    nomad_score: {
      wifi: null,
      power: 4,
      comfort: 3,
      noise: null,
      value: 4,
      vibe: 3,
    },
    price_range: "$$",
    hours: "7am-2am daily (per Wanderlog/Restaurant Guru)",
    amenities: ["balcony", "chain reliability", "free wifi (time-limited)"],
    laptop_friendly: true,
    status: "open",
    last_verified: "2026-04-15",
    sources: [
      {
        label: "Foursquare - Espressolab Cihangir",
        url: "https://foursquare.com/v/espressolab-cihangir/60ab08ac19c4275b1b5bda39",
      },
      {
        label: "Wanderlog - Espressolab Cihangir",
        url: "https://wanderlog.com/place/details/1357575/espressolab-cihangir",
      },
      {
        label: "Restaurant Guru - Espressolab Cihangir",
        url: "https://restaurantguru.com/Espressolab-Istanbul-49",
      },
    ],
    unverified_fields: ["wifi_speed", "nomad_score.wifi", "nomad_score.noise"],
  },

  // --- Cafes: Karakoy / Galata ---
  {
    id: "karabatak",
    name: "Karabatak",
    type: "cafe",
    neighborhood: "Karakoy",
    coordinates: [28.975, 41.024],
    address: "Kara Ali Kaptan Sok. No:7, 34425 Karakoy, Beyoglu, Istanbul",
    description:
      "Converted from an abandoned metal workshop in 2011. Two-storey cafe with separate quiet, group, and regular sections plus 40-seat outdoor area. Backstreet Karakoy vibe, near Galata Bridge. Great for atmosphere, less obviously a work-all-day spot.",
    nomad_score: {
      wifi: null,
      power: null,
      comfort: 4,
      noise: 3,
      value: 2,
      vibe: 5,
    },
    price_range: "$$$",
    website: "https://karabatak.com",
    amenities: [
      "courtyard",
      "quiet section",
      "group section",
      "outdoor seating",
    ],
    laptop_friendly: true,
    status: "open",
    last_verified: "2026-04-15",
    sources: [
      {
        label: "Karabatak official - about page",
        url: "https://karabatak.com/en/about-us/",
      },
      {
        label: "Karabatak Karakoy page",
        url: "https://karabatak.com/en/cormorant-karakoy/",
      },
      {
        label: "Tripadvisor - Karabatak Cafe",
        url: "https://www.tripadvisor.com/Restaurant_Review-g293974-d3591045-Reviews-Karabatak_Cafe-Istanbul.html",
      },
      {
        label: "Yelp - Karabatak (review consensus on price)",
        url: "https://www.yelp.com/biz/karabatak-istanbul",
      },
    ],
    unverified_fields: [
      "wifi_speed",
      "hours",
      "nomad_score.wifi",
      "nomad_score.power",
    ],
  },
  {
    id: "kronotrop",
    name: "Kronotrop",
    type: "cafe",
    neighborhood: "Karakoy",
    coordinates: [28.977, 41.023],
    address:
      "Karakoy branch in Istanbul (flagship Cihangir at Firuzaga Cami Sok. No:2/B, Beyoglu)",
    description:
      "Widely credited as Turkey's first third-wave specialty coffee shop (opened 2012). Beans roasted in-house on a Loring S15. La Marzocco Strada EP, Hario V60, Aeropress. Small, well-designed space with low couches - better for a focused 2-3 hour session than all-day camp.",
    nomad_score: {
      wifi: null,
      power: null,
      comfort: 3,
      noise: 4,
      value: null,
      vibe: 5,
    },
    price_range: "$$$",
    website: "https://www.kronotrop.com.tr",
    amenities: [
      "specialty coffee",
      "in-house roaster",
      "pour-over",
      "plant milks",
    ],
    laptop_friendly: true,
    status: "open",
    last_verified: "2026-04-15",
    sources: [
      {
        label: "Kronotrop Karakoy page",
        url: "https://www.kronotrop.com.tr/en/where-are-we/karakoy",
      },
      {
        label: "Sprudge - Kronotrop profile",
        url: "https://sprudge.com/kronotrop-modern-coffee-bar-istanbul-57571.html",
      },
      {
        label: "Yelp - Kronotrop",
        url: "https://www.yelp.com/biz/kronotrop-istanbul",
      },
      {
        label: "Wanderlog - Kronotrop Karakoy reviews",
        url: "https://wanderlog.com/place/details/2344695/kronotrop-karak%C3%B6y",
      },
    ],
    unverified_fields: [
      "hours",
      "wifi_speed",
      "nomad_score.wifi",
      "nomad_score.power",
      "nomad_score.value",
    ],
  },
  {
    id: "moc-nisantasi",
    name: "MOC - Ministry of Coffee",
    type: "cafe",
    neighborhood: "Nisantasi",
    coordinates: [28.997, 41.049],
    address:
      "Sakayik Sok., Tesvikiye/Nisantasi, Sisli, Istanbul (previously listed as Karakoy - corrected)",
    description:
      "Australian-style specialty roaster founded by Sam Cevikoz. Roasts 12-origin beans in-house. Menu includes breakfasts and light meals (including Vegemite toast). Known for 24-28 hour cold brew. Hidden on a Nisantasi back street.",
    nomad_score: {
      wifi: null,
      power: 4,
      comfort: 4,
      noise: null,
      value: null,
      vibe: 4,
    },
    price_range: "$$",
    amenities: [
      "specialty coffee",
      "in-house roastery",
      "food menu",
      "ample workstations",
      "two floors",
    ],
    laptop_friendly: true,
    status: "open",
    last_verified: "2026-04-15",
    sources: [
      {
        label: "Tripadvisor - M.O.C. Ministry of Coffee",
        url: "https://www.tripadvisor.com/Restaurant_Review-g293974-d7076657-Reviews-M_O_C_Ministry_of_Coffee-Istanbul.html",
      },
      {
        label: "Yelp - Ministry of Coffee",
        url: "https://www.yelp.com/biz/ministry-of-coffee-istanbul-3",
      },
      {
        label: "Time Out Istanbul - MOC Ministry of Coffee",
        url: "https://www.timeout.com/istanbul/restaurants/moc-istanbul-ministry-of-coffee",
      },
      {
        label: "Wanderlog - MOC Nisantasi (workstations + wifi reviews)",
        url: "https://wanderlog.com/place/details/1507899/moc-ni%C5%9Fanta%C5%9F%C4%B1",
      },
    ],
    unverified_fields: [
      "hours",
      "wifi_speed",
      "nomad_score.wifi",
      "nomad_score.noise",
      "nomad_score.value",
    ],
  },

  // --- Cafes: Besiktas ---
  {
    id: "coffeetopia",
    name: "Coffeetopia Besiktas",
    type: "cafe",
    neighborhood: "Besiktas",
    coordinates: [29.006, 41.043],
    address:
      "Besiktas, Istanbul (Coffeetopia chain also has Eminonu and other branches)",
    description:
      "Specialty coffee chain founded by Serif Basaran (World Barista Championship judge, AST trainer). The Besiktas branch is one of multiple city locations. Note: the 'near ferry terminal' claim matches the Eminonu branch, not Besiktas specifically - address needs on-the-ground verification.",
    nomad_score: {
      wifi: null,
      power: 4,
      comfort: null,
      noise: null,
      value: null,
      vibe: null,
    },
    price_range: "$",
    amenities: ["specialty coffee", "chain", "outlets for working"],
    laptop_friendly: true,
    status: "open",
    last_verified: "2026-04-15",
    sources: [
      {
        label: "Kava - Coffeetopia Besiktas",
        url: "https://discoverkava.com/location/coffeetopia-besiktas/",
      },
      {
        label: "Tripadvisor - Coffeetopia Eminonu",
        url: "https://www.tripadvisor.com/Restaurant_Review-g293974-d6800605-Reviews-Coffeetopia_Eminonu-Istanbul.html",
      },
      {
        label: "Yelp - Coffeetopia (electrical outlets noted)",
        url: "https://www.yelp.com/biz/coffeetopia-istanbul",
      },
    ],
    unverified_fields: [
      "address",
      "hours",
      "wifi_speed",
      "nomad_score.wifi",
      "nomad_score.comfort",
      "nomad_score.noise",
      "nomad_score.value",
      "nomad_score.vibe",
    ],
  },
  {
    id: "coffee-department",
    name: "Coffee Department",
    type: "cafe",
    neighborhood: "Balat",
    coordinates: [28.948, 41.032],
    address:
      "Balat, Fatih, Istanbul (near the western bank of the Golden Horn - previously listed as Kadikoy, corrected)",
    description:
      "Third-wave specialty coffee shop with an in-house Probat Probatino roaster. Bright, minimal interior with large windows. Staff hand out bean cards explaining taste notes and farm origin. Usually 5 filter options from farms worldwide.",
    nomad_score: {
      wifi: null,
      power: null,
      comfort: 4,
      noise: 5,
      value: null,
      vibe: 4,
    },
    price_range: "$$",
    amenities: ["in-house roaster", "filter flights", "bright interior"],
    laptop_friendly: true,
    status: "open",
    last_verified: "2026-04-15",
    sources: [
      {
        label: "The Way to Coffee - Best Specialty Coffee Shops Istanbul",
        url: "https://www.thewaytocoffee.com/istanbul/",
      },
      {
        label: "European Coffee Trip - Istanbul guide",
        url: "https://europeancoffeetrip.com/istanbul/",
      },
      {
        label: "The Coffee Compass - Coffee Department review",
        url: "https://www.thecoffeecompass.com/cafe-review-coffee-department-in-istanbul/",
      },
    ],
    unverified_fields: [
      "hours",
      "wifi_speed",
      "nomad_score.wifi",
      "nomad_score.power",
      "nomad_score.value",
    ],
  },
  {
    id: "cafe-fes",
    name: "Fes Cafe",
    type: "cafe",
    neighborhood: "Nuruosmaniye",
    coordinates: [28.972, 41.01],
    address:
      "Alibaba Turbe Sok. No:25-27, Nuruosmaniye, Eminonu, Istanbul (second branch inside Grand Bazaar at Haliciler Cad. No:62) - previously listed as Cihangir, corrected",
    description:
      "Long-running cafe near the Grand Bazaar serving sandwiches, salads, fresh lemonade, and homemade desserts. Tripadvisor rating 4.4/5. Note: the previous 'Bosphorus view from Cihangir' description didn't match any of the actual Fes Cafe locations.",
    nomad_score: {
      wifi: null,
      power: null,
      comfort: 3,
      noise: null,
      value: null,
      vibe: 4,
    },
    price_range: "$$",
    amenities: ["outdoor seating", "lemonade", "homemade desserts"],
    laptop_friendly: true,
    status: "open",
    last_verified: "2026-04-15",
    sources: [
      {
        label: "Tripadvisor - Fes Cafe",
        url: "https://www.tripadvisor.com/Restaurant_Review-g293974-d1749878-Reviews-Fes_Cafe-Istanbul.html",
      },
      {
        label: "Fodor's - Fes Cafe",
        url: "https://www.fodors.com/world/europe/turkey/istanbul/restaurants/reviews/fes-cafe-423662",
      },
      {
        label: "Fes Cafe Facebook",
        url: "https://www.facebook.com/cafefes/",
      },
    ],
    unverified_fields: [
      "hours",
      "wifi_speed",
      "nomad_score.wifi",
      "nomad_score.power",
      "nomad_score.noise",
      "nomad_score.value",
    ],
  },
];
