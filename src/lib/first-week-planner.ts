import { neighborhoods, type NeighborhoodSlug } from "@/lib/neighborhoods";

export type ArrivalProfile =
  | "first-time"
  | "returning"
  | "turkey-transfer"
  | "paperwork";

export type WorkStyle = "cafe" | "coworking" | "home" | "calls";

export type SocialAppetite = "quiet" | "fast" | "one-event";

export type BudgetComfort = "lean" | "balanced" | "comfort";

export interface PlannerInput {
  arrivalProfile: ArrivalProfile;
  neighborhood: NeighborhoodSlug | "help";
  workStyle: WorkStyle;
  socialAppetite: SocialAppetite;
  budgetComfort: BudgetComfort;
}

export interface PlannerOption<T extends string> {
  value: T;
  label: string;
  description: string;
}

export interface PlanLink {
  label: string;
  href: string;
}

export interface PlanDay {
  day: number;
  title: string;
  theme: string;
  morning: string;
  workBlock: string;
  evening: string;
  why: string;
  links: PlanLink[];
}

export interface FirstWeekPlan {
  input: PlannerInput;
  baseNeighborhood: (typeof neighborhoods)[number];
  summary: string;
  starterTip: string;
  days: PlanDay[];
  saveLinks: PlanLink[];
  avoid: string[];
}

export const defaultPlannerInput: PlannerInput = {
  arrivalProfile: "first-time",
  neighborhood: "help",
  workStyle: "cafe",
  socialAppetite: "one-event",
  budgetComfort: "balanced",
};

export const arrivalProfileOptions: PlannerOption<ArrivalProfile>[] = [
  {
    value: "first-time",
    label: "First time",
    description: "You need the city to become usable quickly.",
  },
  {
    value: "returning",
    label: "Returning",
    description: "You know the basics and want a cleaner routine.",
  },
  {
    value: "turkey-transfer",
    label: "Already in Turkey",
    description: "You mostly need a local Istanbul reset.",
  },
  {
    value: "paperwork",
    label: "Paperwork focus",
    description: "Admin, documents, and calm backup time matter most.",
  },
];

export const workStyleOptions: PlannerOption<WorkStyle>[] = [
  {
    value: "cafe",
    label: "Cafe worker",
    description: "You want laptop-safe tables and neighborhood rhythm.",
  },
  {
    value: "coworking",
    label: "Coworking",
    description: "You prefer stable desks, calls, and other workers nearby.",
  },
  {
    value: "home",
    label: "Home first",
    description: "You want fewer moves and a quieter setup week.",
  },
  {
    value: "calls",
    label: "Calls-heavy",
    description: "You need backup WiFi, call rooms, and low-risk work blocks.",
  },
];

export const socialAppetiteOptions: PlannerOption<SocialAppetite>[] = [
  {
    value: "quiet",
    label: "Quiet first week",
    description: "One calm plan, less social pressure.",
  },
  {
    value: "fast",
    label: "Meet people fast",
    description: "Use events and coworking to build momentum.",
  },
  {
    value: "one-event",
    label: "One event is enough",
    description: "A low-pressure touchpoint without overbooking.",
  },
];

export const budgetComfortOptions: PlannerOption<BudgetComfort>[] = [
  {
    value: "lean",
    label: "Keep it lean",
    description: "Save money while avoiding false economies.",
  },
  {
    value: "balanced",
    label: "Balanced",
    description: "Spend where comfort prevents chaos.",
  },
  {
    value: "comfort",
    label: "Comfort-first",
    description: "Pay for fewer frictions and stronger backup plans.",
  },
];

const neighborhoodForProfile: Record<ArrivalProfile, NeighborhoodSlug> = {
  "first-time": "kadikoy",
  returning: "moda",
  "turkey-transfer": "uskudar",
  paperwork: "kadikoy",
};

const workSetup = {
  cafe: {
    title: "Cafe test",
    firstBlock:
      "Test one laptop-friendly cafe for 90 minutes, then save a backup within a 12-minute walk.",
    secondBlock:
      "Repeat the best cafe at a different hour so you know when it gets loud.",
    guide: { label: "Coworking guide", href: "/guides/coworking" },
  },
  coworking: {
    title: "Coworking test",
    firstBlock:
      "Book a coworking trial or day pass and use it for your deepest work block.",
    secondBlock:
      "Use a second work block to compare commute, noise, and call setup.",
    guide: { label: "Nomad Spaces", href: "/spaces" },
  },
  home: {
    title: "Home setup",
    firstBlock:
      "Run a home WiFi test, check your desk ergonomics, then save one outside backup.",
    secondBlock:
      "Work from home in the morning and leave the afternoon for errands or scouting.",
    guide: { label: "Internet guide", href: "/guides/internet" },
  },
  calls: {
    title: "Call-safe setup",
    firstBlock:
      "Find one call-safe option before you need it: coworking, hotel lobby, or quiet cafe corner.",
    secondBlock:
      "Protect your calls with a backup SIM, headphones, and a second work location.",
    guide: { label: "Internet guide", href: "/guides/internet" },
  },
} satisfies Record<
  WorkStyle,
  {
    title: string;
    firstBlock: string;
    secondBlock: string;
    guide: PlanLink;
  }
>;

export function buildFirstWeekPlan(input: PlannerInput): FirstWeekPlan {
  const baseSlug =
    input.neighborhood === "help"
      ? neighborhoodForProfile[input.arrivalProfile]
      : input.neighborhood;
  const baseNeighborhood =
    neighborhoods.find((item) => item.slug === baseSlug) ?? neighborhoods[0];
  const work = workSetup[input.workStyle];
  const social = socialCopy(input.socialAppetite);
  const budget = budgetCopy(input.budgetComfort);
  const paperwork = input.arrivalProfile === "paperwork";

  const days: PlanDay[] = [
    {
      day: 1,
      title: "Land gently",
      theme: "Arrival reset",
      morning:
        "Keep the first route simple: airport transfer, check-in, water, and a short walk around your block.",
      workBlock:
        "Do only light admin unless something is urgent. Save your energy for orientation.",
      evening: `Eat close to home in ${baseNeighborhood.name} and mark the nearest market, pharmacy, ATM, and transit stop.`,
      why: "Most first-week mistakes start with doing too much before the neighborhood feels legible.",
      links: [
        {
          label: `${baseNeighborhood.name} guide`,
          href: neighborhoodHref(baseSlug),
        },
        { label: "Transport guide", href: "/guides/transport" },
      ],
    },
    {
      day: 2,
      title: work.title,
      theme: "Work setup",
      morning: `${budget.firstMove} Set up Istanbulkart, SIM backup, and one grocery routine before work.`,
      workBlock: work.firstBlock,
      evening:
        "Take one familiar route home instead of exploring too far. The win is repeatability.",
      why: "The second day should prove you can work here without improvising every hour.",
      links: [work.guide, { label: "Nomad Spaces", href: "/spaces" }],
    },
    {
      day: 3,
      title: "Learn the crossing",
      theme: "Transport confidence",
      morning: `Use ${baseNeighborhood.transport.toLowerCase()} as your main lesson for the day.`,
      workBlock:
        "Work near your base first, then move only after the core work is finished.",
      evening:
        "Do one ferry, metro, or tram loop with no big plan attached. The route itself is the lesson.",
      why: "Istanbul gets easier once one cross-city route feels normal.",
      links: [
        { label: "Transport guide", href: "/guides/transport" },
        { label: "Neighborhoods", href: "/guides/neighborhoods" },
      ],
    },
    {
      day: 4,
      title: social.title,
      theme: "Community touchpoint",
      morning:
        "Keep the morning quiet and protect one focused work block before social plans.",
      workBlock: work.secondBlock,
      evening: social.evening,
      why: social.why,
      links: [
        { label: "Events", href: "/events" },
        { label: "Telegram", href: "https://t.me/istanbul_digital_nomads" },
      ],
    },
    {
      day: 5,
      title: paperwork ? "Admin day" : "Errand buffer",
      theme: "Admin and life setup",
      morning: paperwork
        ? "Put documents, scans, address details, appointment notes, and insurance questions in one folder."
        : "Use the morning for laundry, groceries, banking questions, pharmacy needs, or apartment fixes.",
      workBlock:
        "Choose the most predictable work location today. No experimentation while admin is open.",
      evening:
        "Reward the boring work with a short neighborhood dinner rather than a long cross-city plan.",
      why: paperwork
        ? "Residence and document work needs margin. Do not stack it with a heavy social day."
        : "A boring buffer day prevents week-one friction from spilling into week two.",
      links: [
        { label: "Visa guide", href: "/guides/visa" },
        { label: "Housing guide", href: "/guides/housing" },
      ],
    },
    {
      day: 6,
      title: "Compare one alternate",
      theme: "Neighborhood scouting",
      morning: `Start in ${baseNeighborhood.name}, then visit one alternate neighborhood for a direct comparison.`,
      workBlock:
        "Do a short laptop test in the alternate area, even if you already like your current base.",
      evening:
        "Write down what felt easier: commute, food, noise, prices, social energy, or water access.",
      why: "A single comparison makes your first base feel chosen, not accidental.",
      links: [
        { label: "Neighborhood matcher", href: "/guides/neighborhoods" },
        { label: "Cost of living", href: "/guides/cost-of-living" },
      ],
    },
    {
      day: 7,
      title: "Lock week two",
      theme: "Routine planning",
      morning:
        "Pick your default work block, default grocery run, default transit route, and one backup cafe or coworking spot.",
      workBlock:
        "Use the setup exactly as planned. If it works once, it can become your week-two routine.",
      evening: `${social.weekTwo} ${budget.weekTwo}`,
      why: "The point of week one is not to see everything. It is to make week two calmer.",
      links: [
        { label: "First-week mistakes", href: "/blog/first-week-mistakes" },
        {
          label: `${baseNeighborhood.name} guide`,
          href: neighborhoodHref(baseSlug),
        },
      ],
    },
  ];

  return {
    input,
    baseNeighborhood,
    summary: buildSummary(input, baseNeighborhood.name),
    starterTip: starterTip(input, baseNeighborhood.name),
    days,
    saveLinks: [
      {
        label: `${baseNeighborhood.name} guide`,
        href: neighborhoodHref(baseSlug),
      },
      { label: "Nomad Spaces", href: "/spaces" },
      { label: "Events", href: "/events" },
      { label: "Visa guide", href: "/guides/visa" },
      { label: "Cost of living", href: "/guides/cost-of-living" },
    ],
    avoid: avoidList(input),
  };
}

export function encodePlannerInput(input: PlannerInput): string {
  const params = new URLSearchParams();
  params.set("profile", input.arrivalProfile);
  params.set("base", input.neighborhood);
  params.set("work", input.workStyle);
  params.set("social", input.socialAppetite);
  params.set("budget", input.budgetComfort);
  return params.toString();
}

export function parsePlannerInput(params: URLSearchParams): PlannerInput {
  return {
    arrivalProfile: parseOption(
      params.get("profile"),
      arrivalProfileOptions,
      defaultPlannerInput.arrivalProfile,
    ),
    neighborhood: parseNeighborhood(params.get("base")),
    workStyle: parseOption(
      params.get("work"),
      workStyleOptions,
      defaultPlannerInput.workStyle,
    ),
    socialAppetite: parseOption(
      params.get("social"),
      socialAppetiteOptions,
      defaultPlannerInput.socialAppetite,
    ),
    budgetComfort: parseOption(
      params.get("budget"),
      budgetComfortOptions,
      defaultPlannerInput.budgetComfort,
    ),
  };
}

function parseOption<T extends string>(
  value: string | null,
  options: PlannerOption<T>[],
  fallback: T,
): T {
  return options.some((option) => option.value === value)
    ? (value as T)
    : fallback;
}

function parseNeighborhood(value: string | null): PlannerInput["neighborhood"] {
  if (value === "help") return "help";
  return neighborhoods.some((item) => item.slug === value)
    ? (value as NeighborhoodSlug)
    : defaultPlannerInput.neighborhood;
}

function neighborhoodHref(slug: NeighborhoodSlug) {
  return `/guides/neighborhoods/${slug}`;
}

function socialCopy(social: SocialAppetite) {
  if (social === "fast") {
    return {
      title: "Meet people fast",
      evening:
        "Pick one event or coworking session and arrive early enough to say you are new.",
      weekTwo:
        "Choose one recurring community touchpoint for next week before the week ends.",
      why: "Social momentum is easiest before the city turns into a private routine.",
    };
  }
  if (social === "quiet") {
    return {
      title: "Low-pressure contact",
      evening:
        "Join the Telegram group or save one event, but keep the evening calm and optional.",
      weekTwo: "Choose one social plan for next week, not five maybes.",
      why: "Quiet arrivals still need one human thread, but not a packed calendar.",
    };
  }
  return {
    title: "One good event",
    evening:
      "Choose one low-pressure event, coworking session, or meetup and let that be enough.",
    weekTwo:
      "Keep one community plan on the calendar so you do not drift into isolation.",
    why: "One real touchpoint beats a week of vague intentions.",
  };
}

function budgetCopy(budget: BudgetComfort) {
  if (budget === "lean") {
    return {
      firstMove:
        "Keep early spending boring: transit card, groceries, SIM, and one reliable work drink.",
      weekTwo:
        "Track your first full grocery, transit, and workday costs before upgrading comfort.",
    };
  }
  if (budget === "comfort") {
    return {
      firstMove:
        "Spend on friction reducers first: stable transfer, better SIM backup, and a proven workspace.",
      weekTwo:
        "Keep comfort spending attached to fewer mistakes, not just nicer surroundings.",
    };
  }
  return {
    firstMove:
      "Spend where it prevents chaos: transport setup, SIM backup, and one dependable work spot.",
    weekTwo:
      "Use your first week to find the comfort-cost balance you can repeat.",
  };
}

function buildSummary(input: PlannerInput, neighborhoodName: string) {
  const base =
    input.neighborhood === "help"
      ? `${neighborhoodName} is the recommended first base for this profile`
      : `${neighborhoodName} is your chosen base`;
  const work = workSetup[input.workStyle].title.toLowerCase();
  return `${base}. The plan keeps ${work} practical, gives you one transport loop, and leaves enough buffer for errands, social momentum, and week-two routine building.`;
}

function starterTip(input: PlannerInput, neighborhoodName: string) {
  if (input.arrivalProfile === "paperwork") {
    return `Base yourself in ${neighborhoodName}, keep mornings for document work, and do not stack admin with long cross-city plans.`;
  }
  if (input.socialAppetite === "fast") {
    return `Use ${neighborhoodName} as your anchor, then choose one early event so the city starts with people, not only logistics.`;
  }
  if (input.workStyle === "calls") {
    return `Before the first important call, save two call-safe locations near ${neighborhoodName}.`;
  }
  return `Let ${neighborhoodName} become boring in the best way: one work spot, one transit route, one grocery routine.`;
}

function avoidList(input: PlannerInput) {
  const items = [
    "Do not book your whole month before testing the street, noise, and commute.",
    "Do not judge Istanbul from one tourist district or one rainy commute.",
    "Do not leave SIM backup and transit setup until the first urgent workday.",
  ];

  if (input.budgetComfort === "lean") {
    items.push(
      "Do not save money by choosing a base that forces taxis every day.",
    );
  }
  if (input.arrivalProfile === "paperwork") {
    items.push(
      "Do not rely on screenshots or half-translated documents for admin tasks.",
    );
  }
  if (input.socialAppetite === "fast") {
    items.push(
      "Do not overbook every evening. One useful event beats four tired ones.",
    );
  }

  return items.slice(0, 4);
}
