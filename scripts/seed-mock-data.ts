/**
 * Seed comprehensive mock data so every public surface has something to
 * render in development: ~10 nomads, ~10 local/tour guides, ~10 paperwork
 * agents (with services), ~10 plans (this week), and ~10 trips (events).
 *
 * Idempotent. Seed members use stable `seed-*@istanbulnomads.local`
 * emails; seed plans/events use the `[seed]` title prefix. Re-running
 * purges prior seed plans/events/services and upserts members.
 *
 * Run: pnpm tsx --env-file=.env.local scripts/seed-mock-data.ts
 */

import { createClient } from "@supabase/supabase-js";

const SEED_PREFIX = "[seed]";
const SEED_EMAIL = (slug: string) => `seed-${slug}@istanbulnomads.local`;

type MemberType = "nomad" | "remote_worker" | "local_guide" | "tour_guide";
type Verification = "basic" | "verified" | "trusted";
type ArrivalStatus = "in_istanbul" | "elsewhere_turkey" | "planning";
type CurrentStatus =
  | "deep_work"
  | "open_to_meet"
  | "exploring"
  | "settling_in"
  | "hosting"
  | "hibernating";

interface SeedMember {
  slug: string;
  display_name: string;
  member_type: MemberType;
  is_agent?: boolean;
  verification_level?: Verification;
  location: string; // district (drives directory grouping)
  city_district?: string; // neighborhood
  nationality?: string; // demonym
  arrival_status?: ArrivalStatus;
  current_status?: CurrentStatus;
  profession?: string;
  bio: string;
  skills?: string[];
  languages?: string[];
  working_on?: string[];
  wants_to_talk_about?: string[];
  hobbies?: string[];
  telegram_handle?: string;
}

// ─── Nomads + remote workers (10) ──────────────────────────────────────
const NOMADS: SeedMember[] = [
  { slug: "nomad-lena", display_name: "Lena Vogt", member_type: "nomad", location: "Kadıköy", city_district: "Moda", nationality: "German", arrival_status: "in_istanbul", current_status: "open_to_meet", profession: "Product designer", bio: "Designing from Moda cafes for the winter. Always up for a cowork or a ferry.", skills: ["Product design", "Figma", "Design systems"], languages: ["English", "German"], working_on: ["A design-token plugin"], wants_to_talk_about: ["Type", "Bosphorus swimming"], hobbies: ["Pottery", "Sea swimming"], telegram_handle: "lenavogt" },
  { slug: "nomad-diego", display_name: "Diego Marín", member_type: "remote_worker", location: "Beyoğlu", city_district: "Cihangir", nationality: "Spanish", arrival_status: "in_istanbul", current_status: "deep_work", profession: "Backend engineer", bio: "Rails dev, here a year. Cihangir local. Knows the quiet cafes.", skills: ["Ruby", "Rails", "Postgres"], languages: ["English", "Spanish", "Turkish"], working_on: ["A payments side project"], wants_to_talk_about: ["Databases", "Turkish coffee"], hobbies: ["Climbing", "Vinyl"], telegram_handle: "diegomarin" },
  { slug: "nomad-aiko", display_name: "Aiko Tanaka", member_type: "nomad", location: "Beşiktaş", city_district: "Bebek", nationality: "Japanese", arrival_status: "elsewhere_turkey", current_status: "exploring", profession: "Illustrator", bio: "Illustrator and slow traveler. Sketching the ferries.", skills: ["Illustration", "Procreate"], languages: ["English", "Japanese"], working_on: ["A picture book about Istanbul cats"], wants_to_talk_about: ["Drawing", "Cats"], hobbies: ["Sketching", "Swimming"], telegram_handle: "aikodraws" },
  { slug: "nomad-sam", display_name: "Sam Okafor", member_type: "remote_worker", location: "Şişli", city_district: "Nişantaşı", nationality: "Nigerian", arrival_status: "in_istanbul", current_status: "settling_in", profession: "Data scientist", bio: "ML engineer, just landed. Looking for a regular cowork crew.", skills: ["Python", "ML", "SQL"], languages: ["English"], working_on: ["A recsys at work"], wants_to_talk_about: ["LLMs", "Football"], hobbies: ["Running", "Chess"], telegram_handle: "samokafor" },
  { slug: "nomad-marta", display_name: "Marta Nowak", member_type: "nomad", location: "Kadıköy", city_district: "Yeldeğirmeni", nationality: "Polish", arrival_status: "in_istanbul", current_status: "open_to_meet", profession: "Copywriter", bio: "Words for hire. Yeldeğirmeni murals are my office walls.", skills: ["Copywriting", "Brand voice"], languages: ["English", "Polish"], working_on: ["A newsletter"], wants_to_talk_about: ["Writing", "Street art"], hobbies: ["Photography", "Cycling"], telegram_handle: "martawrites" },
  { slug: "nomad-tom", display_name: "Tom Becker", member_type: "remote_worker", location: "Beyoğlu", city_district: "Galata", nationality: "Austrian", arrival_status: "planning", current_status: "hibernating", profession: "DevOps engineer", bio: "Coming in spring. Scoping neighborhoods now. Kubernetes by day.", skills: ["Kubernetes", "Terraform", "Go"], languages: ["English", "German"], working_on: ["Migrating infra"], wants_to_talk_about: ["Infra", "Coffee gear"], hobbies: ["Bouldering"], telegram_handle: "tombecker" },
  { slug: "nomad-priya", display_name: "Priya Nair", member_type: "remote_worker", location: "Üsküdar", city_district: "Kuzguncuk", nationality: "Indian", arrival_status: "in_istanbul", current_status: "open_to_meet", profession: "Frontend engineer", bio: "React dev on the Asian side. Kuzguncuk is criminally pretty.", skills: ["React", "TypeScript", "CSS"], languages: ["English", "Hindi"], working_on: ["A component library"], wants_to_talk_about: ["Frontend", "Filter coffee"], hobbies: ["Baking", "Yoga"], telegram_handle: "priyanair" },
  { slug: "nomad-ben", display_name: "Ben Carter", member_type: "nomad", location: "Kadıköy", city_district: "Caferağa", nationality: "British", arrival_status: "in_istanbul", current_status: "exploring", profession: "Founder", bio: "Bootstrapping a tiny SaaS from Caferağa. Coffee-fueled.", skills: ["Product", "Growth", "No-code"], languages: ["English"], working_on: ["An indie SaaS"], wants_to_talk_about: ["Startups", "Pricing"], hobbies: ["Surfing", "Cooking"], telegram_handle: "bencarter" },
  { slug: "nomad-yuki", display_name: "Yuki Sato", member_type: "remote_worker", location: "Sarıyer", city_district: "Tarabya", nationality: "Japanese", arrival_status: "elsewhere_turkey", current_status: "deep_work", profession: "Game developer", bio: "Unity dev, quiet weeks by the upper Bosphorus.", skills: ["Unity", "C#", "Shaders"], languages: ["English", "Japanese"], working_on: ["A cozy indie game"], wants_to_talk_about: ["Game design", "Ramen"], hobbies: ["Fishing", "Pixel art"], telegram_handle: "yukimakes" },
  { slug: "nomad-clara", display_name: "Clara Rossi", member_type: "nomad", location: "Beyoğlu", city_district: "Çukurcuma", nationality: "Italian", arrival_status: "in_istanbul", current_status: "open_to_meet", profession: "UX researcher", bio: "Antique-shop wanderer in Çukurcuma. Research by day.", skills: ["UX research", "Interviewing"], languages: ["English", "Italian"], working_on: ["A research repo"], wants_to_talk_about: ["Research ops", "Vintage finds"], hobbies: ["Thrifting", "Tango"], telegram_handle: "clararossi" },
];

// ─── Local + tour guides (10) ──────────────────────────────────────────
const GUIDES: SeedMember[] = [
  { slug: "guide-cem", display_name: "Cem Kaya", member_type: "local_guide", verification_level: "trusted", location: "Karaköy", city_district: "Karaköy", nationality: "Turkish", current_status: "hosting", bio: "Born-and-raised İstanbullu. Coffee crawls, breakfast routes, ferry stories.", skills: ["Coffee", "Breakfast spots", "History"], languages: ["Turkish", "English"], telegram_handle: "cemkaya" },
  { slug: "guide-sibel", display_name: "Sibel Öztürk", member_type: "local_guide", verification_level: "verified", location: "Kadıköy", city_district: "Moda", nationality: "Turkish", current_status: "hosting", bio: "Market guide. Çiya regular. Knows which vendor has the best pickles.", skills: ["Markets", "Food", "Cooking"], languages: ["Turkish", "English"], telegram_handle: "sibelozturk" },
  { slug: "guide-ahmet", display_name: "Ahmet Şahin", member_type: "tour_guide", verification_level: "verified", location: "Beyoğlu", city_district: "Asmalımescit", nationality: "Turkish", current_status: "hosting", profession: "Licensed tour guide", bio: "Licensed guide. Jazz nights, reserved tables, ferry back at 23:50.", skills: ["Nightlife", "Music", "History"], languages: ["Turkish", "English", "German"], telegram_handle: "ahmetsahin" },
  { slug: "guide-elif", display_name: "Elif Demir", member_type: "tour_guide", verification_level: "trusted", location: "Fatih", city_district: "Balat", nationality: "Turkish", current_status: "hosting", profession: "Licensed tour guide", bio: "Old-city walks done right. Balat colors, Fener, the Greek Orthodox quarter.", skills: ["History", "Photography walks", "Architecture"], languages: ["Turkish", "English", "French"], telegram_handle: "elifdemir" },
  { slug: "guide-mert", display_name: "Mert Aydın", member_type: "local_guide", verification_level: "verified", location: "Beşiktaş", city_district: "Ortaköy", nationality: "Turkish", current_status: "open_to_meet", bio: "Bosphorus runner and ferry nerd. Sunset routes a specialty.", skills: ["Running routes", "Ferries", "Sunsets"], languages: ["Turkish", "English"], telegram_handle: "mertaydin" },
  { slug: "guide-zeynep", display_name: "Zeynep Çelik", member_type: "local_guide", verification_level: "verified", location: "Kadıköy", city_district: "Yeldeğirmeni", nationality: "Turkish", current_status: "hosting", bio: "Street-art and third-wave-coffee tours on the Asian side.", skills: ["Street art", "Coffee", "Design"], languages: ["Turkish", "English"], telegram_handle: "zeynepcelik" },
  { slug: "guide-deniz", display_name: "Deniz Yıldız", member_type: "tour_guide", verification_level: "verified", location: "Sarıyer", city_district: "Rumeli Hisarı", nationality: "Turkish", current_status: "open_to_meet", profession: "Licensed tour guide", bio: "Upper-Bosphorus villages, fortress walks, fish-sandwich stops.", skills: ["Hiking", "History", "Seafood"], languages: ["Turkish", "English", "Russian"], telegram_handle: "denizyildiz" },
  { slug: "guide-burak", display_name: "Burak Arslan", member_type: "local_guide", verification_level: "verified", location: "Üsküdar", city_district: "Kuzguncuk", nationality: "Turkish", current_status: "hosting", bio: "Asian-side mahalle walks. Tea gardens, wooden houses, slow afternoons.", skills: ["Neighborhood walks", "Tea culture"], languages: ["Turkish", "English"], telegram_handle: "burakarslan" },
  { slug: "guide-aylin", display_name: "Aylin Korkmaz", member_type: "tour_guide", verification_level: "trusted", location: "Fatih", city_district: "Süleymaniye", nationality: "Turkish", current_status: "hosting", profession: "Licensed tour guide", bio: "Ottoman mosques and hidden courtyards, with the crowds dodged.", skills: ["History", "Architecture", "Crowd-free routes"], languages: ["Turkish", "English", "Arabic"], telegram_handle: "aylinkorkmaz" },
  { slug: "guide-can", display_name: "Can Polat", member_type: "local_guide", verification_level: "verified", location: "Beyoğlu", city_district: "Cihangir", nationality: "Turkish", current_status: "open_to_meet", bio: "Cihangir antique crawl + meyhane dinners. Knows the cats by name.", skills: ["Meyhane", "Antiques", "Cats"], languages: ["Turkish", "English"], telegram_handle: "canpolat" },
];

// ─── Paperwork agents (10) + their services ────────────────────────────
type ServiceType = "visa" | "ikamet" | "residency_permit" | "bank_account" | "notary" | "gbt" | "tax_office" | "other";
interface SeedAgent extends SeedMember {
  services: Array<{
    service_type: ServiceType;
    title: string;
    description: string;
    price_lira: number;
    duration_minutes?: number;
  }>;
}

const AGENTS: SeedAgent[] = [
  { slug: "agent-ozge", display_name: "Özge Yılmaz", member_type: "remote_worker", is_agent: true, verification_level: "verified", location: "Şişli", city_district: "Mecidiyeköy", nationality: "Turkish", current_status: "open_to_meet", profession: "Relocation consultant", bio: "Residence-permit specialist. 8 years helping nomads through ikamet.", languages: ["Turkish", "English"], telegram_handle: "ozgeyilmaz",
    services: [
      { service_type: "ikamet", title: "Short-term residence permit (ikamet) - full support", description: "Application prep, appointment booking, document checklist, and accompaniment to the migration office.", price_lira: 4500, duration_minutes: 120 },
      { service_type: "residency_permit", title: "Residence permit renewal", description: "Renewal paperwork and follow-up for existing permit holders.", price_lira: 2800 },
    ] },
  { slug: "agent-emre", display_name: "Emre Doğan", member_type: "nomad", is_agent: true, verification_level: "verified", location: "Kadıköy", city_district: "Caferağa", nationality: "Turkish", current_status: "open_to_meet", profession: "Tax advisor", bio: "Tax number + bank account combos for new arrivals. Fast turnaround.", languages: ["Turkish", "English"], telegram_handle: "emredogan",
    services: [
      { service_type: "tax_office", title: "Tax number (vergi numarası) same-day", description: "Get your Turkish tax number, usually within a day. Required for most other paperwork.", price_lira: 900, duration_minutes: 90 },
      { service_type: "bank_account", title: "Bank account opening assistance", description: "Pick a nomad-friendly bank, prep documents, and translate at the branch.", price_lira: 1800, duration_minutes: 120 },
    ] },
  { slug: "agent-leyla", display_name: "Leyla Acar", member_type: "remote_worker", is_agent: true, verification_level: "verified", location: "Beşiktaş", city_district: "Levent", nationality: "Turkish", current_status: "open_to_meet", profession: "Immigration consultant", bio: "Visa and ikamet for tricky cases. Patient with the edge cases.", languages: ["Turkish", "English", "Arabic"], telegram_handle: "leylaacar",
    services: [
      { service_type: "visa", title: "Visa situation review + plan", description: "A clear written assessment of your visa options and timeline for staying legally.", price_lira: 1500, duration_minutes: 60 },
      { service_type: "ikamet", title: "First-time ikamet for complex cases", description: "For freelancers, families, and anyone whose situation isn't textbook.", price_lira: 5200 },
    ] },
  { slug: "agent-kerem", display_name: "Kerem Şen", member_type: "nomad", is_agent: true, verification_level: "verified", location: "Beyoğlu", city_district: "Galata", nationality: "Turkish", current_status: "open_to_meet", profession: "Notary liaison", bio: "Notary and sworn translations. I sit with you through the whole noter visit.", languages: ["Turkish", "English"], telegram_handle: "keremsen",
    services: [
      { service_type: "notary", title: "Notary (noter) appointment + translation", description: "Sworn translation and notarization of your documents, with on-site help.", price_lira: 1200, duration_minutes: 90 },
      { service_type: "other", title: "Address registration (adres kaydı)", description: "Register your Istanbul address at the muhtar - needed for ikamet.", price_lira: 700 },
    ] },
  { slug: "agent-nil", display_name: "Nil Eren", member_type: "remote_worker", is_agent: true, verification_level: "verified", location: "Kadıköy", city_district: "Moda", nationality: "Turkish", current_status: "open_to_meet", profession: "Relocation consultant", bio: "GBT queries and document chasing. I find the form you didn't know existed.", languages: ["Turkish", "English"], telegram_handle: "nileren",
    services: [
      { service_type: "gbt", title: "GBT / foreigner record query", description: "Pull and explain your foreigner record so you know exactly where you stand.", price_lira: 600, duration_minutes: 45 },
    ] },
  { slug: "agent-tarik", display_name: "Tarık Bozkurt", member_type: "nomad", is_agent: true, verification_level: "verified", location: "Şişli", city_district: "Nişantaşı", nationality: "Turkish", current_status: "open_to_meet", profession: "Banking liaison", bio: "Bank accounts for the hard-no cases. I know which branches say yes.", languages: ["Turkish", "English"], telegram_handle: "tarikbozkurt",
    services: [
      { service_type: "bank_account", title: "Bank account - difficult cases", description: "When other banks refused: I match you to a branch that opens accounts for nomads.", price_lira: 2200, duration_minutes: 120 },
    ] },
  { slug: "agent-derya", display_name: "Derya Kaya", member_type: "remote_worker", is_agent: true, verification_level: "verified", location: "Üsküdar", city_district: "Acıbadem", nationality: "Turkish", current_status: "open_to_meet", profession: "Immigration consultant", bio: "Family ikamet and dependent permits. Calm with the bureaucracy.", languages: ["Turkish", "English"], telegram_handle: "deryakaya",
    services: [
      { service_type: "ikamet", title: "Family residence permit", description: "Ikamet for couples and families, including dependent applications.", price_lira: 6000 },
    ] },
  { slug: "agent-onur", display_name: "Onur Aksoy", member_type: "nomad", is_agent: true, verification_level: "verified", location: "Beyoğlu", city_district: "Cihangir", nationality: "Turkish", current_status: "open_to_meet", profession: "Tax advisor", bio: "Freelancer tax setup - vergi number, invoicing, the lot.", languages: ["Turkish", "English"], telegram_handle: "onuraksoy",
    services: [
      { service_type: "tax_office", title: "Freelancer tax registration", description: "Set up to invoice clients legally from Turkey, with an accountant intro.", price_lira: 2500 },
    ] },
  { slug: "agent-buse", display_name: "Buse Çetin", member_type: "remote_worker", is_agent: true, verification_level: "verified", location: "Bakırköy", city_district: "Ataköy", nationality: "Turkish", current_status: "open_to_meet", profession: "Relocation consultant", bio: "End-to-end first-week setup. One contact for all of it.", languages: ["Turkish", "English", "Russian"], telegram_handle: "busecetin",
    services: [
      { service_type: "other", title: "First-week bundle (tax no. + bank + SIM)", description: "Everything you need in week one, done together over two appointments.", price_lira: 3800, duration_minutes: 240 },
    ] },
  { slug: "agent-hakan", display_name: "Hakan Yavuz", member_type: "nomad", is_agent: true, verification_level: "verified", location: "Ataşehir", city_district: "Barbaros", nationality: "Turkish", current_status: "open_to_meet", profession: "Immigration consultant", bio: "Asian-side ikamet specialist. Knows the Ataşehir office rhythms.", languages: ["Turkish", "English"], telegram_handle: "hakanyavuz",
    services: [
      { service_type: "residency_permit", title: "Asian-side ikamet support", description: "Full residence-permit support routed through the less-crowded Asian-side offices.", price_lira: 4300 },
    ] },
];

// ─── Trips (events, 10) ─────────────────────────────────────────────────
type EventType = "meetup" | "coworking" | "workshop" | "social";
interface SeedTrip {
  title: string;
  description: string;
  type: EventType;
  guideSlug: string; // organizer (a guide)
  location_name: string;
  daysFromNow: number;
  capacity: number;
  price_try?: number;
}
const TRIPS: SeedTrip[] = [
  { title: "Princes' Islands day trip - Heybeliada", description: "Ferry to Heybeliada, a car-free island loop on foot, lunch by the water, ferry back at golden hour.", type: "social", guideSlug: "guide-deniz", location_name: "Kadıköy ferry terminal", daysFromNow: 3, capacity: 12, price_try: 600 },
  { title: "Belgrad Forest hike + breakfast", description: "Easy 8km forest trail north of the city, then a long Turkish breakfast. Saturday regular.", type: "social", guideSlug: "guide-mert", location_name: "Bahçeköy entrance", daysFromNow: 5, capacity: 15, price_try: 400 },
  { title: "Balat & Fener photo walk", description: "Colorful houses, steep lanes, the old Greek quarter. Bring a camera; pace is slow.", type: "social", guideSlug: "guide-elif", location_name: "Fener pier", daysFromNow: 2, capacity: 10, price_try: 350 },
  { title: "Bosphorus sunset ferry + meyhane dinner", description: "Public ferry up the strait at sunset, then a communal meyhane table in Cihangir.", type: "social", guideSlug: "guide-can", location_name: "Beşiktaş iskele", daysFromNow: 4, capacity: 14, price_try: 750 },
  { title: "Kadıköy market + Çiya lunch", description: "Tuesday market walk with tastings, then lunch at Çiya with a quick chef intro.", type: "social", guideSlug: "guide-sibel", location_name: "Kadıköy Salı pazarı", daysFromNow: 6, capacity: 8, price_try: 550 },
  { title: "Old-city crowd-free mosque walk", description: "Süleymaniye and hidden courtyards, timed to dodge the tour buses.", type: "social", guideSlug: "guide-aylin", location_name: "Süleymaniye Mosque gate", daysFromNow: 7, capacity: 12, price_try: 500 },
  { title: "Karaköy coffee crawl", description: "Four roasters, two origins each, across Karaköy and Tophane. Caffeine warning.", type: "social", guideSlug: "guide-cem", location_name: "Karaköy iskele", daysFromNow: 1, capacity: 8, price_try: 450 },
  { title: "Yeldeğirmeni street-art tour", description: "The murals, the design studios, the best flat white on the Asian side.", type: "social", guideSlug: "guide-zeynep", location_name: "Yeldeğirmeni, Kadıköy", daysFromNow: 8, capacity: 10, price_try: 300 },
  { title: "Kuzguncuk tea-garden afternoon", description: "Wooden houses, a synagogue, a church and a mosque on one street, tea by the water.", type: "social", guideSlug: "guide-burak", location_name: "Kuzguncuk vapur iskelesi", daysFromNow: 9, capacity: 12, price_try: 250 },
  { title: "Rumeli Hisarı fortress + fish sandwich", description: "Fortress walk on the upper Bosphorus, ending with the city's best balık ekmek.", type: "social", guideSlug: "guide-deniz", location_name: "Rumeli Hisarı", daysFromNow: 10, capacity: 14, price_try: 500 },
];

// ─── Plans (10), hosted across members, this week ──────────────────────
type Vibe = "focus" | "cowork" | "social" | "meal" | "after-work" | "outdoor" | "culture";
interface SeedPlanStop { start_time: string; end_time: string; vibe: Vibe; neighborhood_slug: string; custom_location: string; notes: string; }
interface SeedPlan { title: string; hostSlug: string; capacity: number; daysFromNow: number; stops: SeedPlanStop[]; }
const PLANS: SeedPlan[] = [
  { title: `${SEED_PREFIX} Morning cowork at Kronotrop`, hostSlug: "nomad-diego", capacity: 6, daysFromNow: 0, stops: [{ start_time: "09:30", end_time: "12:30", vibe: "cowork", neighborhood_slug: "cihangir", custom_location: "Kronotrop, Cihangir", notes: "Quiet til noon. Outlets along the back wall." }] },
  { title: `${SEED_PREFIX} Moda sahil sunset walk`, hostSlug: "nomad-lena", capacity: 8, daysFromNow: 0, stops: [{ start_time: "18:30", end_time: "19:30", vibe: "outdoor", neighborhood_slug: "moda", custom_location: "Moda Pier", notes: "Easy loop, tea after if people are up for it." }] },
  { title: `${SEED_PREFIX} Deep-work morning, Karabatak`, hostSlug: "nomad-ben", capacity: 4, daysFromNow: 1, stops: [{ start_time: "10:00", end_time: "13:00", vibe: "focus", neighborhood_slug: "karakoy", custom_location: "Karabatak, Karaköy", notes: "Heads-down. We chat at the break only." }] },
  { title: `${SEED_PREFIX} Lunch + cowork, Coffee Department`, hostSlug: "nomad-priya", capacity: 6, daysFromNow: 1, stops: [{ start_time: "12:30", end_time: "16:00", vibe: "cowork", neighborhood_slug: "cihangir", custom_location: "Coffee Department", notes: "Lunch first, then cowork downstairs." }] },
  { title: `${SEED_PREFIX} Climbing then beers`, hostSlug: "nomad-diego", capacity: 6, daysFromNow: 2, stops: [{ start_time: "19:00", end_time: "21:00", vibe: "after-work", neighborhood_slug: "kadikoy", custom_location: "BoulderClub Kadıköy", notes: "All levels. Beers after for whoever's keen." }] },
  { title: `${SEED_PREFIX} Çukurcuma antique wander`, hostSlug: "nomad-clara", capacity: 5, daysFromNow: 2, stops: [{ start_time: "15:00", end_time: "17:00", vibe: "culture", neighborhood_slug: "cihangir", custom_location: "Çukurcuma antique shops", notes: "Slow browse, no pressure to buy. Coffee at the end." }] },
  { title: `${SEED_PREFIX} Bebek to Rumeli walk`, hostSlug: "guide-mert", capacity: 10, daysFromNow: 3, stops: [{ start_time: "10:00", end_time: "12:00", vibe: "outdoor", neighborhood_slug: "besiktas", custom_location: "Bebek sahil", notes: "Flat coastal walk, ~5km, fish sandwich at the end." }] },
  { title: `${SEED_PREFIX} Pide night in Caferağa`, hostSlug: "nomad-marta", capacity: 5, daysFromNow: 3, stops: [{ start_time: "19:30", end_time: "21:00", vibe: "meal", neighborhood_slug: "kadikoy", custom_location: "Borsam Taşfırın", notes: "Family-style pide, ~₺180 each." }] },
  { title: `${SEED_PREFIX} Quiet cowork, Nişantaşı`, hostSlug: "nomad-sam", capacity: 4, daysFromNow: 4, stops: [{ start_time: "10:00", end_time: "13:00", vibe: "focus", neighborhood_slug: "nisantasi", custom_location: "Cup of Joy, Nişantaşı", notes: "Calls fine in the back room." }] },
  { title: `${SEED_PREFIX} Saturday social, Moda tea garden`, hostSlug: "nomad-lena", capacity: 12, daysFromNow: 5, stops: [{ start_time: "16:00", end_time: "18:00", vibe: "social", neighborhood_slug: "moda", custom_location: "Moda Çay Bahçesi", notes: "Just turn up. Tea, backgammon, sea view." }] },
];

function dateFromNow(days: number): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Istanbul" }).format(
    new Date(Date.now() + days * 86400000),
  );
}
function isoFromNow(days: number, hour = 11): string {
  const d = dateFromNow(days);
  return new Date(`${d}T${String(hour).padStart(2, "0")}:00:00+03:00`).toISOString();
}
function expiresAt(date: string, lastEnd: string): string {
  const [hh, mm] = lastEnd.split(":").map(Number);
  const local = new Date(`${date}T${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}:00+03:00`);
  local.setHours(local.getHours() + 2);
  return local.toISOString();
}
function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);
}

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.");
    process.exit(1);
  }
  const sb = createClient(url, key, { auth: { persistSession: false } });
  const db = sb as any;

  const { data: usersList } = await sb.auth.admin.listUsers({ page: 1, perPage: 1000 });
  const byEmail = new Map((usersList?.users ?? []).map((u) => [u.email?.toLowerCase() ?? "", u.id]));

  // Provision an auth user + members row for each seed member.
  const idBySlug = new Map<string, string>();
  const allMembers: SeedMember[] = [...NOMADS, ...GUIDES, ...AGENTS];
  for (const m of allMembers) {
    const email = SEED_EMAIL(m.slug);
    let id = byEmail.get(email.toLowerCase());
    if (!id) {
      const { data: created, error } = await sb.auth.admin.createUser({
        email,
        email_confirm: true,
        user_metadata: { full_name: m.display_name },
      });
      if (error || !created?.user) {
        console.error(`  ✗ auth user ${m.display_name}:`, error?.message);
        continue;
      }
      id = created.user.id;
    }
    idBySlug.set(m.slug, id);
    const { error: mErr } = await db.from("members").upsert(
      {
        id,
        email,
        display_name: m.display_name,
        is_visible: true,
        onboarding_completed: true,
        member_type: m.member_type,
        is_agent: m.is_agent ?? false,
        verification_level: m.verification_level ?? "basic",
        location: m.location,
        city_district: m.city_district ?? null,
        nationality: m.nationality ?? null,
        arrival_status: m.arrival_status ?? null,
        current_status: m.current_status ?? null,
        profession: m.profession ?? null,
        bio: m.bio,
        skills: m.skills ?? null,
        languages: m.languages ?? null,
        working_on: m.working_on ?? null,
        wants_to_talk_about: m.wants_to_talk_about ?? null,
        hobbies: m.hobbies ?? null,
        telegram_handle: m.telegram_handle ?? null,
      },
      { onConflict: "id" },
    );
    if (mErr) console.error(`  ✗ member ${m.display_name}:`, mErr.message);
  }
  console.log(`✓ Upserted ${idBySlug.size} members`);

  // Paperwork services - purge prior seed agents' services, then insert.
  const agentIds = AGENTS.map((a) => idBySlug.get(a.slug)).filter(Boolean) as string[];
  if (agentIds.length) {
    await db.from("paperwork_services").delete().in("host_id", agentIds);
  }
  let svcCount = 0;
  for (const a of AGENTS) {
    const hostId = idBySlug.get(a.slug);
    if (!hostId) continue;
    for (const s of a.services) {
      const { error } = await db.from("paperwork_services").insert({
        host_id: hostId,
        service_type: s.service_type,
        title: s.title,
        description: s.description,
        languages: a.languages ?? ["Turkish", "English"],
        neighborhoods: a.city_district ? [a.city_district] : [],
        price_cents: s.price_lira * 100,
        currency: "TRY",
        duration_estimate_minutes: s.duration_minutes ?? null,
        is_active: true,
      });
      if (error) console.error(`  ✗ service "${s.title}":`, error.message);
      else svcCount++;
    }
  }
  console.log(`✓ Inserted ${svcCount} paperwork services`);

  // Plans - purge prior seed plans by these hosts, then insert + stops.
  const planHostIds = Array.from(idBySlug.values());
  const { data: priorPlans } = await db
    .from("plans")
    .select("id")
    .in("creator_id", planHostIds)
    .like("title", `${SEED_PREFIX}%`);
  const priorIds = (priorPlans ?? []).map((p: { id: string }) => p.id);
  if (priorIds.length) {
    await db.from("plan_attendees").delete().in("plan_id", priorIds);
    await db.from("plan_stops").delete().in("plan_id", priorIds);
    await db.from("plans").delete().in("id", priorIds);
  }
  let planCount = 0;
  for (const p of PLANS) {
    const creatorId = idBySlug.get(p.hostSlug);
    if (!creatorId) continue;
    const date = dateFromNow(p.daysFromNow);
    const last = p.stops[p.stops.length - 1];
    const { data: row, error } = await db
      .from("plans")
      .insert({
        creator_id: creatorId,
        scheduled_date: date,
        title: p.title,
        capacity: p.capacity,
        language: "en",
        expires_at: expiresAt(date, last.end_time),
      })
      .select("id")
      .single();
    if (error || !row) {
      console.error(`  ✗ plan "${p.title}":`, error?.message);
      continue;
    }
    const stops = p.stops.map((s, i) => ({
      plan_id: row.id,
      ordinal: i + 1,
      vibe: s.vibe,
      neighborhood_slug: s.neighborhood_slug,
      custom_location: s.custom_location,
      start_time: s.start_time,
      end_time: s.end_time,
      notes: s.notes,
    }));
    const { error: sErr } = await db.from("plan_stops").insert(stops);
    if (sErr) console.error(`  ✗ stops for "${p.title}":`, sErr.message);
    else planCount++;
  }
  console.log(`✓ Inserted ${planCount} plans`);

  // Trips (events) - purge prior seed events, then insert.
  const organizerIds = GUIDES.map((g) => idBySlug.get(g.slug)).filter(Boolean) as string[];
  const { data: priorEv } = await db
    .from("events")
    .select("id")
    .in("organizer_id", organizerIds)
    .like("title", `${SEED_PREFIX}%`);
  const priorEvIds = (priorEv ?? []).map((e: { id: string }) => e.id);
  if (priorEvIds.length) await db.from("events").delete().in("id", priorEvIds);
  let tripCount = 0;
  for (const t of TRIPS) {
    const organizerId = idBySlug.get(t.guideSlug);
    if (!organizerId) continue;
    const { error } = await db.from("events").insert({
      title: `${SEED_PREFIX} ${t.title}`,
      description: t.description,
      type: t.type,
      kind: "trip",
      date: isoFromNow(t.daysFromNow, 10),
      location_name: t.location_name,
      capacity: t.capacity,
      organizer_id: organizerId,
      is_published: true,
      slug: `seed-${slugify(t.title)}`,
      price_try: t.price_try ?? null,
    });
    if (error) console.error(`  ✗ trip "${t.title}":`, error.message);
    else tripCount++;
  }
  console.log(`✓ Inserted ${tripCount} trips (events)`);
  console.log("Done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
