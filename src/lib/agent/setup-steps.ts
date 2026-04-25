// First-month setup checklist. Each step links back to a guide or blog post
// on the site. The agent uses these as the always-on setup context so it
// never fabricates a checklist item
//
// Sources are cited per-step so the agent's citations array stays grounded.
// If you change a step, update the source slug to match the guide that
// actually documents it

import type { SetupStep } from "./types";

const baseUrl = "https://istanbulnomads.com";

export const setupSteps: SetupStep[] = [
  {
    week: 1,
    title: "Buy an Istanbulkart and load it",
    why: "You can't use cash on buses. Skip the airport - get one at any Migros or metro kiosk for around 70 TL.",
    source_slug: "transport",
    source_url: `${baseUrl}/guides/transport`,
  },
  {
    week: 1,
    title: "Get a Turkcell SIM in a city store",
    why: "Tourist SIMs at the airport are 2-3x the price. Walk into any Turkcell store with your passport - 250 TL gets you 20 GB.",
    source_slug: "internet",
    source_url: `${baseUrl}/guides/internet`,
  },
  {
    week: 1,
    title: "Visit two or three neighborhoods before signing anything",
    why: "Booking an Airbnb for a month sight-unseen is the most common first-week mistake. Walk Kadikoy, Cihangir, and Besiktas before you commit.",
    source_slug: "first-week-mistakes",
    source_url: `${baseUrl}/blog/first-week-mistakes`,
  },
  {
    week: 1,
    title: "Convert your Istanbulkart to personalised",
    why: "Personalised cards are 2-3x cheaper per ride and unlock the 500 TL monthly pass. Bring your passport to a customer service centre.",
    source_slug: "transport",
    source_url: `${baseUrl}/guides/transport`,
  },
  {
    week: 2,
    title: "Pick a base neighborhood and book mid-term",
    why: "Move from the first Airbnb into a Flatio or Spotahome listing for 1-3 months. You'll pay 20-35% less than short-stay rates.",
    source_slug: "housing",
    source_url: `${baseUrl}/guides/housing`,
  },
  {
    week: 2,
    title: "Test two or three coworking spaces or laptop-friendly cafes",
    why: "WiFi quality varies block by block. Try a few from our verified spaces directory before locking in a routine.",
    source_slug: "coworking",
    source_url: `${baseUrl}/guides/coworking`,
  },
  {
    week: 2,
    title: "Open a Wise account if you don't have one",
    why: "Turkish bank ATMs charge 3-5% on conversions. Wise gives you the real exchange rate and a free TL balance.",
    source_slug: "cost-of-living",
    source_url: `${baseUrl}/guides/cost-of-living`,
  },
  {
    week: 3,
    title: "Decide on a longer-term housing plan",
    why: "If you're staying more than three months, switch from Flatio to Sahibinden or Facebook groups. Unfurnished apartments are 20-35% cheaper than furnished.",
    source_slug: "housing",
    source_url: `${baseUrl}/guides/housing`,
  },
  {
    week: 3,
    title: "Start the residence permit paperwork if staying past 90 days",
    why: "The short-term residence permit takes 4-8 weeks to process. Apply before your e-visa expires to avoid leaving the country.",
    source_slug: "visa",
    source_url: `${baseUrl}/guides/visa`,
  },
  {
    week: 3,
    title: "Find your ferry, your simit guy, your weekly pazar",
    why: "Slow living wins here. Pick one ferry route, one local lokanta, and one street market - it stops feeling like a trip and starts feeling like a life.",
    source_slug: "slowmad-guide-istanbul",
    source_url: `${baseUrl}/blog/slowmad-guide-istanbul`,
  },
  {
    week: 4,
    title: "Show up to a community event",
    why: "Two months in, most nomads regret not socialising sooner. RSVP to one meetup or coworking day on /events to short-circuit the lonely phase.",
    source_slug: "events",
    source_url: `${baseUrl}/events`,
  },
  {
    week: 4,
    title: "Plan a weekend out of the city",
    why: "Princes' Islands, Bursa, or Cappadocia are easy reachable from Istanbul. A change of scene resets your work routine and you'll come back appreciating the city more.",
    source_slug: "entertainment",
    source_url: `${baseUrl}/guides/entertainment`,
  },
];
