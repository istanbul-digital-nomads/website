import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Clock3,
  Globe,
  MapPin,
  MoveUpRight,
  Sparkles,
  Users,
  Wifi,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { NeighborhoodCardsSection } from "@/components/sections/neighborhood-cards";
import { NeighborhoodsMapSection } from "@/components/sections/neighborhoods-map-section";
import { guides } from "@/lib/data";
import { socialLinks } from "@/lib/constants";
import { formatEventDate } from "@/lib/utils";
import { getEventsPublic } from "@/lib/supabase/queries";

export const revalidate = 300;
const FAQSection = dynamic(
  () =>
    import("@/components/sections/faq-section").then((m) => ({
      default: m.FAQSection,
    })),
  {
    ssr: true,
    loading: () => <div className="py-16 md:py-24" />,
  },
);

const featuredGuides = guides.slice(0, 4);
const orientationLinks = [
  { label: "Where should I stay?", href: "/guides/neighborhoods" },
  { label: "Best areas for coworking", href: "/guides/coworking" },
  { label: "What does a month cost?", href: "/guides/cost-of-living" },
  { label: "How do I get online fast?", href: "/guides/internet" },
];
const eventMoments: Record<string, string> = {
  "1": "Quiet work session with reliable wifi and plenty of regulars who welcome first-timers.",
  "2": "The easiest event to meet people fast, especially if you just arrived and want social momentum.",
  "3": "Bring real questions about freelancing, residency, and how to stay compliant while living here.",
};
const whatPeopleFind = [
  {
    phase: "Week one",
    title: "A workable routine, fast",
    description:
      "Wifi-tested cafes, a coworking session to drop into, and a neighborhood that fits your pace.",
  },
  {
    phase: "Month one",
    title: "Familiar faces in familiar places",
    description:
      "The weekly rhythm means you keep running into the same people - and that's how real friendships start.",
  },
  {
    phase: "Month three+",
    title: "A city that feels like yours",
    description:
      "You've got a ferry route, a favorite baklava spot, and people who text you when something good is happening.",
  },
];
const heroRouteSteps = [
  {
    time: "09:10",
    title: "Kadikoy pier",
    detail: "Pick a walkable base with breakfast, metro, and ferries nearby.",
    icon: MapPin,
  },
  {
    time: "10:25",
    title: "Karakoy table",
    detail: "Cross with one job to do and a saved list of laptop-safe seats.",
    icon: Wifi,
  },
  {
    time: "18:30",
    title: "Galata evening",
    detail: "Meet the people who know where the city works after dark.",
    icon: Users,
  },
] as const;
const heroDeskNotes = [
  ["Base", "Kadikoy or Moda"],
  ["Crossing", "20 min ferry reset"],
  ["Fallback", "Coworking if cafes fill"],
] as const;

export default async function HomePage() {
  const { data: upcomingEvents } = await getEventsPublic({
    past: false,
    limit: 3,
  });
  const liveEvents = upcomingEvents ?? [];
  const nextEvent = liveEvents[0];
  const heroTrustSignals = nextEvent
    ? [
        `Next coworking ${formatEventDate(nextEvent.date)}`,
        "Free to join",
        "All remote workers welcome",
      ]
    : [
        "Free to join",
        "All remote workers welcome",
        "Weekly coworking sessions",
      ];

  return (
    <div className="overflow-hidden">
      <section className="relative isolate border-b border-black/10 bg-[#fbfaf8] dark:border-white/10 dark:bg-[#14110f]">
        <div className="bg-grid absolute inset-0 opacity-[0.32] dark:opacity-[0.14]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-primary-500/10 to-transparent dark:from-primary-950/20" />

        <Container className="relative py-8 sm:py-12 lg:py-16">
          <div className="mb-8 grid gap-3 border-y border-black/10 py-3 font-mono text-[10px] uppercase tracking-[0.22em] text-neutral-500 sm:grid-cols-[1fr_auto] sm:items-center dark:border-white/10 dark:text-[#94877d]">
            <p className="text-primary-700 dark:text-primary-300">
              Kadikoy 09:10 / Karakoy 10:25 / Galata 18:30
            </p>
            <p>GMT+3 / ferry-first / laptop-ready</p>
          </div>

          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(440px,0.82fr)] lg:items-stretch lg:gap-14">
            {/* Hero text - NO Reveal wrapper to ensure LCP element is immediately visible */}
            <div className="flex flex-col justify-between gap-10 lg:min-h-[590px]">
              <div>
                <div className="mb-6 max-w-xl">
                  <div className="grid grid-cols-[auto_1fr_auto_1fr_auto] items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#6b6257] dark:text-[#94877d]">
                    <span>Asia base</span>
                    <span className="h-px bg-black/10 dark:bg-white/10" />
                    <span>Ferry reset</span>
                    <span className="h-px bg-black/10 dark:bg-white/10" />
                    <span>Evening table</span>
                  </div>
                </div>

                <h1 className="max-w-[11.5ch] text-balance font-display text-[2.86rem] font-extrabold leading-[0.94] text-neutral-950 sm:text-[4.15rem] lg:text-[5.55rem] dark:text-[#f2f3f4]">
                  Build your Istanbul work rhythm in 7 days.
                </h1>
                <p className="mt-5 max-w-2xl text-[1.0625rem] leading-8 text-neutral-700 sm:text-body-xl dark:text-[#b7aaa0]">
                  Choose a base, learn the ferry loop, and save the laptop-safe
                  tables locals trust after sunset.
                </p>

                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <a
                    href={socialLinks.telegram}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      size="lg"
                      className="w-full rounded-lg bg-[#1a1a2e] px-6 text-white shadow-none hover:bg-[#2a2430] dark:bg-[#f2f3f4] dark:text-[#1a1a2e] dark:hover:bg-[#d8d0c8] sm:w-auto"
                    >
                      Join the workweek
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  </a>
                  <Link href="/guides/neighborhoods">
                    <Button
                      variant="secondary"
                      size="lg"
                      className="w-full rounded-lg border border-black/40 bg-transparent px-6 text-neutral-950 hover:bg-white/60 dark:border-white/30 dark:text-[#f2f3f4] dark:hover:bg-white/10 sm:w-auto"
                    >
                      Choose a base
                    </Button>
                  </Link>
                </div>

                <div className="mt-7 overflow-hidden rounded-xl border border-white/10 bg-[#1a1612] lg:hidden">
                  <div className="relative h-36">
                    <Image
                      src="/images/neighborhoods/moda/hero-premium-2026.jpg"
                      alt="A calm Moda waterfront table with tea, notebook, and the Istanbul skyline beyond"
                      fill
                      priority
                      sizes="100vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#14110f] via-[#14110f]/20 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-white/70">
                        Ferry workday
                      </p>
                      <div className="mt-2 grid grid-cols-[1fr_auto_1fr] items-center gap-3 rounded-lg bg-white/90 px-3 py-2 text-[13px] font-semibold text-neutral-950 backdrop-blur-md">
                        <span>Kadikoy</span>
                        <span className="h-px w-12 bg-primary-500/60" />
                        <span className="text-right">Galata</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid gap-2 border-l border-primary-600/50 pl-4 sm:grid-cols-3">
                  {heroTrustSignals.map((signal) => (
                    <p
                      key={signal}
                      className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#6b6257] dark:text-[#94877d]"
                    >
                      {signal}
                    </p>
                  ))}
                </div>
              </div>

              <div className="grid gap-3 border-t border-black/10 pt-5 sm:grid-cols-3 dark:border-white/10">
                {heroDeskNotes.map(([label, value]) => (
                  <p key={label}>
                    <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-neutral-500 dark:text-[#94877d]">
                      {label}
                    </span>
                    <span className="mt-1 block font-display text-lg font-extrabold text-neutral-950 dark:text-[#f2f3f4]">
                      {value}
                    </span>
                  </p>
                ))}
              </div>
            </div>

            <div className="relative hidden overflow-hidden rounded-xl border border-black/10 bg-[#efe6da] shadow-[0_24px_90px_rgba(20,17,15,0.12)] dark:border-white/10 dark:bg-[#1a1612] lg:block">
              <div className="relative h-72 border-b border-black/10 dark:border-white/10">
                <Image
                  src="/images/neighborhoods/moda/hero-premium-2026.jpg"
                  alt="A calm Moda waterfront table with tea, notebook, and the Istanbul skyline beyond"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 520px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a2e]/75 via-[#1a1a2e]/10 to-transparent" />
                <div className="absolute left-4 top-4 rounded-md bg-[#14110f]/80 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.22em] text-white/75 backdrop-blur">
                  Ferry board / first week
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-3 rounded-lg bg-white/90 px-4 py-3 text-sm font-semibold text-neutral-950 backdrop-blur-md dark:bg-[#14110f]/90 dark:text-[#f2f3f4]">
                    <span>Kadikoy</span>
                    <span className="h-px flex-1 bg-primary-500/45" />
                    <span className="text-center">Karakoy</span>
                    <span className="h-px flex-1 bg-primary-500/45" />
                    <span>Galata</span>
                  </div>
                </div>
              </div>

              <div className="p-5 sm:p-6">
                <div className="flex items-center justify-between gap-4 border-b border-black/10 pb-4 dark:border-white/10">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-primary-700 dark:text-primary-300">
                      Nomad field card
                    </p>
                    <h2 className="mt-2 font-display text-2xl font-extrabold text-neutral-950 dark:text-[#f2f3f4]">
                      The ferry workday
                    </h2>
                  </div>
                  <div className="rounded-lg border border-black/10 px-3 py-2 text-right dark:border-white/10">
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500 dark:text-[#94877d]">
                      GMT+3
                    </p>
                    <p className="text-sm font-semibold text-neutral-950 dark:text-[#f2f3f4]">
                      2 continents
                    </p>
                  </div>
                </div>

                <div className="mt-5 space-y-4">
                  {heroRouteSteps.map((step, index) => (
                    <div
                      key={step.title}
                      className="grid grid-cols-[3.75rem_1.5rem_1fr] gap-3"
                    >
                      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-neutral-500 dark:text-[#94877d]">
                        {step.time}
                      </p>
                      <div className="relative flex justify-center">
                        <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full border border-primary-500/40 bg-white dark:bg-[#14110f]">
                          <step.icon className="h-3 w-3 text-primary-600 dark:text-primary-300" />
                        </span>
                        {index < heroRouteSteps.length - 1 && (
                          <span className="absolute top-7 h-9 w-px bg-black/10 dark:bg-white/10" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-display text-lg font-extrabold text-neutral-950 dark:text-[#f2f3f4]">
                          {step.title}
                        </h3>
                        <p className="mt-1 text-sm leading-6 text-[#5d6d7e] dark:text-[#b7aaa0]">
                          {step.detail}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Link
                  href="/guides"
                  className="mt-6 inline-flex items-center gap-2 border-t border-black/10 pt-4 text-sm font-semibold text-primary-700 transition-colors hover:text-primary-900 dark:border-white/10 dark:text-primary-300 dark:hover:text-primary-100"
                >
                  Open the first-month guide
                  <MoveUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-b border-black/10 py-9 dark:border-white/10">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[0.9fr_2fr] lg:items-end">
            <p className="max-w-md text-sm leading-6 text-[#5d6d7e] dark:text-[#b7aaa0]">
              Built for people who want a city that becomes workable quickly,
              not just another place to pass through.
            </p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { value: "Growing", label: "community", icon: Users },
                {
                  value: "Weekly",
                  label: "coworking rhythm",
                  icon: CalendarDays,
                },
                { value: "11", label: "local living guides", icon: Globe },
                { value: "25+", label: "neighborhoods covered", icon: MapPin },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-start gap-3 border-l border-black/10 pl-4 dark:border-white/10"
                >
                  <item.icon className="mt-1 h-5 w-5 text-primary-600 dark:text-primary-400" />
                  <div>
                    <p className="font-display text-2xl font-extrabold text-[#1a1a2e] dark:text-[#f2f3f4]">
                      {item.value}
                    </p>
                    <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-neutral-500 dark:text-[#94877d]">
                      {item.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="py-16 lg:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr]">
            <Reveal className="lg:sticky lg:top-24 lg:self-start">
              <p className="eyebrow">What&apos;s happening</p>
              <h2 className="mt-4 max-w-md font-display text-h1 text-neutral-950 dark:text-[#f2f3f4]">
                This week&apos;s events
              </h2>
              <p className="text-muted mt-5 max-w-md text-body-lg">
                Coworking sessions, meetups, and workshops happening in Istanbul
                this week.
              </p>
            </Reveal>

            <div className="space-y-4">
              {liveEvents.length > 0 ? (
                liveEvents.map((event, index) => (
                  <Reveal
                    key={event.id}
                    delay={index as 0 | 1 | 2}
                    className="group border-t border-black/10 py-6 transition-colors hover:border-primary-500/40 dark:border-white/10 dark:hover:border-primary-400/40"
                  >
                    <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                      <div className="max-w-xl">
                        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary-600 dark:text-primary-400">
                          {event.type}
                        </p>
                        <h3 className="mt-3 font-display text-2xl font-extrabold text-[#1a1a2e] dark:text-[#f2f3f4]">
                          {event.title}
                        </h3>
                        <p className="mt-3 text-sm leading-7 text-[#5d6d7e] dark:text-[#b7aaa0]">
                          {event.description}
                        </p>
                        <p className="mt-4 text-sm font-medium leading-6 text-neutral-950 dark:text-[#f2f3f4]">
                          {eventMoments[event.id]}
                        </p>
                      </div>

                      <div className="min-w-[220px] border-t border-black/10 pt-4 md:border-l md:border-t-0 md:pl-6 md:pt-0 dark:border-white/10">
                        <div className="flex items-center gap-2 text-sm text-[#5d6d7e] dark:text-[#b7aaa0]">
                          <CalendarDays className="h-4 w-4" />
                          {formatEventDate(event.date)}
                        </div>
                        <div className="mt-3 flex items-center gap-2 text-sm text-[#5d6d7e] dark:text-[#b7aaa0]">
                          <MapPin className="h-4 w-4" />
                          {event.location_name}
                        </div>
                        <div className="mt-3 flex items-center gap-2 text-sm text-[#5d6d7e] dark:text-[#b7aaa0]">
                          <Users className="h-4 w-4" />
                          {event.capacity ? `${event.capacity} spots` : "Open"}
                        </div>
                      </div>
                    </div>
                  </Reveal>
                ))
              ) : (
                <Reveal className="border-y border-black/10 py-6 dark:border-white/10">
                  <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary-600 dark:text-primary-400">
                    Dates being scheduled
                  </p>
                  <h3 className="mt-3 font-display text-2xl font-extrabold text-[#1a1a2e] dark:text-[#f2f3f4]">
                    The next coworking dates are coming together.
                  </h3>
                  <p className="mt-3 max-w-xl text-sm leading-7 text-[#5d6d7e] dark:text-[#b7aaa0]">
                    Join the Telegram group for the current informal coworking
                    thread while the public calendar catches up.
                  </p>
                </Reveal>
              )}

              <Reveal delay={3}>
                <Link
                  href="/events"
                  className="group inline-flex items-center gap-2 font-medium text-neutral-950 transition-colors hover:text-primary-600 dark:text-[#f2f3f4] dark:hover:text-primary-400"
                >
                  See all events
                  <MoveUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
              </Reveal>
            </div>
          </div>
        </Container>
      </section>

      <NeighborhoodsMapSection />

      <NeighborhoodCardsSection />

      <section className="border-y border-black/10 py-16 lg:py-20 dark:border-white/10">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[0.82fr_1.18fr]">
            <Reveal className="max-w-xl">
              <p className="eyebrow">City guides</p>
              <h2 className="mt-4 max-w-lg font-display text-h1 text-neutral-950 dark:text-[#f2f3f4]">
                Everything you need for your first month.
              </h2>
              <p className="text-muted mt-5 max-w-md text-body-lg">
                Neighborhoods, coworking, housing, internet, transport, cost of
                living, and more - written by people living here.
              </p>
              <p className="mt-5 max-w-md text-sm leading-7 text-[#5d6d7e] dark:text-[#b7aaa0]">
                Think of them as confidence builders for your first month, not a
                static resource archive.
              </p>
            </Reveal>

            <div className="space-y-4">
              <Reveal delay={1} className="flex flex-wrap gap-3">
                {orientationLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-lg border border-black/10 bg-white/45 px-4 py-2 text-sm text-neutral-700 transition-colors hover:border-primary-500/40 hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-[#b7aaa0] dark:hover:border-primary-400/40 dark:hover:bg-white/10"
                  >
                    {item.label}
                  </Link>
                ))}
              </Reveal>

              {featuredGuides.map((guide, index) => (
                <Reveal
                  key={guide.slug}
                  delay={(index + 1) as 0 | 1 | 2 | 3 | 4}
                >
                  <Link
                    href={`/guides/${guide.slug}`}
                    className="group flex items-start justify-between gap-6 border-t border-black/10 py-5 transition-colors hover:border-primary-500/40 dark:border-white/10 dark:hover:border-primary-400/40"
                  >
                    <div className="flex gap-5">
                      <div className="font-mono text-xs uppercase tracking-[0.3em] text-neutral-400 dark:text-[#5d6d7e]">
                        0{index + 1}
                      </div>
                      <div>
                        <h3 className="font-display text-2xl font-extrabold text-[#1a1a2e] dark:text-[#f2f3f4]">
                          {guide.title}
                        </h3>
                        <p className="mt-2 max-w-xl text-sm leading-7 text-[#5d6d7e] dark:text-[#b7aaa0]">
                          {guide.description}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="mt-1 h-5 w-5 shrink-0 text-neutral-400 transition-transform group-hover:translate-x-1 group-hover:text-primary-600 dark:group-hover:text-primary-400" />
                  </Link>
                </Reveal>
              ))}

              <Reveal delay={4}>
                <div className="border-t border-black/10 pt-6 dark:border-white/10">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="eyebrow">Fast answers</p>
                      <p className="mt-2 text-lg font-medium text-[#1a1a2e] dark:text-[#f2f3f4]">
                        Housing, internet, transport, visa basics, and
                        neighborhood fit.
                      </p>
                    </div>
                    <Link
                      href="/guides"
                      className="inline-flex items-center gap-2 text-sm font-medium text-neutral-950 transition-colors hover:text-primary-600 dark:text-[#f2f3f4] dark:hover:text-primary-400"
                    >
                      Browse all guides
                      <MoveUpRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </Container>
      </section>

      <FAQSection />

      <section className="py-16 lg:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr]">
            <Reveal className="border-y border-black/10 py-8 dark:border-white/10">
              <p className="eyebrow text-primary-700 dark:text-primary-300">
                First month essentials
              </p>
              <h2 className="mt-4 max-w-md font-display text-h1 text-neutral-950 dark:text-[#f2f3f4]">
                Start with the pieces that make remote life easier to operate.
              </h2>
              <p className="mt-5 max-w-md text-base leading-8 text-[#5d6d7e] dark:text-[#b7aaa0]">
                If you just landed, begin with neighborhoods, internet, transit,
                and this week&apos;s meetup. It&apos;s the fastest path from
                arrival mode to a workable local routine.
              </p>

              <div className="mt-8 space-y-4">
                {orientationLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center justify-between border-t border-black/10 pt-4 text-left text-neutral-950 transition-colors hover:text-primary-700 dark:border-white/10 dark:text-[#f2f3f4] dark:hover:text-primary-300"
                  >
                    <span className="text-base font-medium">{item.label}</span>
                    <MoveUpRight className="h-4 w-4 shrink-0" />
                  </Link>
                ))}
              </div>
            </Reveal>

            <div className="grid gap-4 sm:grid-cols-3">
              {whatPeopleFind.map((item, index) => (
                <Reveal key={item.phase} delay={index as 0 | 1 | 2}>
                  <div className="surface-panel flex h-full flex-col justify-between rounded-md p-6 transition-transform duration-300 hover:-translate-y-0.5">
                    <div>
                      <p className="eyebrow">{item.phase}</p>
                      <h3 className="mt-4 font-display text-lg font-extrabold text-[#1a1a2e] dark:text-[#f2f3f4]">
                        {item.title}
                      </h3>
                      <p className="mt-3 text-base leading-8 text-[#526e89] dark:text-[#b7aaa0]">
                        {item.description}
                      </p>
                    </div>
                    <footer className="mt-8 border-t border-black/10 pt-4 dark:border-white/10">
                      <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-neutral-500 dark:text-[#85929e]">
                        {index === 0
                          ? "Arrival"
                          : index === 1
                            ? "Orientation"
                            : "Attachment"}
                      </p>
                    </footer>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="py-16 lg:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr]">
            <Reveal className="border-t border-black/10 pt-8 dark:border-white/10">
              <p className="eyebrow text-primary-700 dark:text-primary-300">
                Why people stay
              </p>
              <h2 className="mt-4 max-w-md font-display text-h1 text-neutral-950 dark:text-[#f2f3f4]">
                Why nomads keep extending their stay.
              </h2>
              <p className="mt-5 max-w-md text-base leading-8 text-[#5d6d7e] dark:text-[#b7aaa0]">
                What changes after you join is simple: your workweeks get
                steadier, the city gets easier to read, and familiar faces start
                showing up in the places you already like to be.
              </p>

              <div className="mt-8 space-y-4">
                {[
                  {
                    icon: Wifi,
                    title: "Reliable workdays",
                    description:
                      "Coworking sessions, cafe picks, and practical setup advice.",
                  },
                  {
                    icon: Clock3,
                    title: "Low-friction onboarding",
                    description:
                      "Helpful answers fast, without having to search five groups.",
                  },
                  {
                    icon: Sparkles,
                    title: "Better local texture",
                    description:
                      "Meet people who know the city and still remember what it feels like to arrive.",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="border-t border-black/10 pt-4 dark:border-white/10"
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                      <h3 className="text-lg font-medium text-neutral-950 dark:text-[#f2f3f4]">
                        {item.title}
                      </h3>
                    </div>
                    <p className="mt-2 text-sm leading-7 text-[#5d6d7e] dark:text-[#b7aaa0]">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal
              delay={1}
              className="surface-panel flex flex-col justify-between rounded-md p-8"
            >
              <div>
                <p className="eyebrow">Local knowledge, shared quickly</p>
                <h3 className="mt-4 max-w-lg font-display text-h2 text-primary-950 dark:text-primary-100">
                  Ask one question and skip hours of guesswork.
                </h3>
                <p className="mt-4 max-w-xl text-base leading-8 text-[#5d6d7e] dark:text-[#b7aaa0]">
                  Where should you base yourself for your first month? Which
                  coworking spots have stable wifi? How do ferries change your
                  commute? The community makes those answers social, current,
                  and local.
                </p>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {[
                  "Neighborhood tradeoffs explained by people living here",
                  "Weekly rituals that make meeting people feel easier",
                  "Practical setup help for workdays, transit, and housing",
                  "A softer landing if you're staying more than a few weeks",
                ].map((item) => (
                  <div
                    key={item}
                    className="surface-subtle rounded-md p-4 text-sm leading-7 text-[#5d6d7e] transition-transform duration-300 hover:-translate-y-0.5 dark:text-[#b7aaa0]"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="pb-16 lg:pb-20">
        <Container>
          <Reveal className="border-y border-black/10 py-10 dark:border-white/10">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <p className="eyebrow text-primary-700 dark:text-primary-300">
                  Get started
                </p>
                <h2 className="mt-4 max-w-3xl font-display text-h1 text-neutral-950 dark:text-[#f2f3f4]">
                  Join us on Telegram.
                </h2>
                <p className="mt-5 max-w-xl text-body-lg text-[#5d6d7e] dark:text-[#b7aaa0]">
                  Introduce yourself and we&apos;ll point you to this
                  week&apos;s meetup, a good workspace, or the right
                  neighborhood to start from.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
                <a
                  href={socialLinks.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-none"
                >
                  <Button
                    size="lg"
                    className="h-12 w-full rounded-lg px-7 text-base font-semibold sm:w-auto"
                  >
                    Join on Telegram
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </a>
                <Link href="/about" className="flex-1 sm:flex-none">
                  <Button
                    variant="secondary"
                    size="lg"
                    className="h-12 w-full rounded-lg px-7 text-base font-medium sm:w-auto"
                  >
                    About the community
                  </Button>
                </Link>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>
    </div>
  );
}
