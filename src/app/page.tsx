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
      <section className="relative isolate border-b border-black/5 dark:border-white/10">
        <div className="bg-grid absolute inset-0 opacity-40 dark:opacity-20" />
        <div className="absolute left-[-8%] top-20 hidden h-72 w-72 rounded-full bg-primary-400/15 blur-3xl motion-safe:animate-float lg:block dark:bg-primary-500/20" />
        <div className="absolute right-[-6%] top-10 hidden h-80 w-80 rounded-full bg-accent-warm/15 blur-3xl motion-safe:animate-float-slow lg:block dark:bg-accent-coral/20" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-[var(--background)]" />

        <Container className="relative py-8 sm:py-12 lg:min-h-[calc(100svh-7rem)] lg:py-8">
          <div className="mb-10 flex flex-wrap items-center justify-end gap-4">
            <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-neutral-500 dark:text-[#85929e]">
              GMT+3 - ferry-friendly - walkable workdays
            </div>
          </div>

          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.7fr)_minmax(560px,1fr)] lg:items-start lg:gap-12">
            {/* Hero text - NO Reveal wrapper to ensure LCP element is immediately visible */}
            <div className="max-w-[30rem] pt-2 lg:pt-0">
              <h1 className="mt-5 max-w-[8.7ch] text-balance text-[3rem] font-semibold leading-[0.92] text-neutral-950 sm:text-[3.7rem] lg:text-[4rem] dark:text-[#f2f3f4]">
                Find your rhythm in Istanbul.
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-neutral-700 sm:text-[1.22rem] dark:text-[#99a3ad]">
                Weekly coworking, practical city guides, and a community of
                remote workers who help each other settle in.
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <a
                  href={socialLinks.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    size="lg"
                    className="w-full rounded-full bg-[#1a1a2e] px-7 text-white hover:bg-[#1a1a2e] dark:bg-[#f2f3f4] dark:text-[#1a1a2e] dark:hover:bg-[#d5dce3] sm:w-auto"
                  >
                    Join on Telegram
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </a>
                <Link href="/guides">
                  <Button
                    variant="secondary"
                    size="lg"
                    className="w-full rounded-full border border-black/60 bg-white/70 px-7 text-neutral-950 hover:bg-white dark:border-white/40 dark:bg-white/10 dark:text-[#f2f3f4] dark:hover:bg-white/20 sm:w-auto"
                  >
                    Browse the guides
                  </Button>
                </Link>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-2 sm:flex-nowrap">
                {heroTrustSignals.map((signal) => (
                  <div
                    key={signal}
                    className="inline-flex items-center gap-2 rounded-full border border-black/15 bg-white/70 px-3 py-2 text-xs font-medium text-neutral-700 dark:border-white/10 dark:bg-white/5 dark:text-[#99a3ad]"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-primary-500" />
                    {signal}
                  </div>
                ))}
              </div>
            </div>

            <div className="relative hidden aspect-[4/3] overflow-hidden rounded-[2.3rem] border border-black/10 lg:block lg:aspect-auto lg:min-h-[600px] dark:border-white/10">
              <Image
                src="/images/neighborhoods/galata/hero.webp"
                alt="Istanbul skyline from Galata"
                fill
                priority
                sizes="(max-width: 1024px) 0px, 700px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between gap-4">
                <Link
                  href="/guides/neighborhoods"
                  className="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-neutral-950 backdrop-blur-md transition-colors hover:bg-white dark:bg-[#1a1d27]/90 dark:text-[#f2f3f4] dark:hover:bg-[#1a1d27]"
                >
                  <MapPin className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                  Explore 5 nomad neighborhoods
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-b border-black/5 py-8 dark:border-white/10">
        <Container>
          <div>
            <p className="mb-5 max-w-2xl text-sm leading-6 text-[#5d6d7e] dark:text-[#99a3ad]">
              Built for people who want a city that becomes workable quickly,
              not just another place to pass through.
            </p>
            <div className="grid gap-6 md:grid-cols-4">
              {[
                { value: "Growing", label: "community", icon: Users },
                {
                  value: "Weekly",
                  label: "coworking rhythm",
                  icon: CalendarDays,
                },
                { value: "11", label: "local living guides", icon: Globe },
                { value: "15+", label: "neighborhoods covered", icon: MapPin },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-start gap-4 border-l border-black/10 pl-4 first:border-l-0 first:pl-0 dark:border-white/10"
                >
                  <item.icon className="mt-1 h-5 w-5 text-primary-600 dark:text-primary-400" />
                  <div>
                    <p className="text-3xl font-semibold text-[#1a1a2e] dark:text-[#f2f3f4]">
                      {item.value}
                    </p>
                    <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-neutral-500 dark:text-[#85929e]">
                      {item.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="py-20 lg:py-24">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <Reveal className="lg:sticky lg:top-24 lg:self-start">
              <p className="eyebrow">What&apos;s happening</p>
              <h2 className="mt-4 max-w-md text-4xl font-semibold text-neutral-950 sm:text-5xl dark:text-[#f2f3f4]">
                This week&apos;s events
              </h2>
              <p className="text-muted mt-5 max-w-md text-lg leading-8">
                Coworking sessions, meetups, and workshops happening in Istanbul
                this week.
              </p>
            </Reveal>

            <div className="space-y-4">
              {liveEvents.map((event, index) => (
                <Reveal
                  key={event.id}
                  delay={index as 0 | 1 | 2}
                  className="group rounded-[2rem] border border-black/10 bg-white/55 p-6 transition-all hover:-translate-y-1 hover:bg-white/80 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
                >
                  <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                    <div className="max-w-xl">
                      <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary-600 dark:text-primary-400">
                        {event.type}
                      </p>
                      <h3 className="mt-3 text-2xl font-semibold text-[#1a1a2e] dark:text-[#f2f3f4]">
                        {event.title}
                      </h3>
                      <p className="mt-3 text-sm leading-7 text-[#5d6d7e] dark:text-[#99a3ad]">
                        {event.description}
                      </p>
                      <p className="mt-4 text-sm font-medium leading-6 text-neutral-950 dark:text-[#f2f3f4]">
                        {eventMoments[event.id]}
                      </p>
                    </div>

                    <div className="min-w-[220px] border-t border-black/10 pt-4 md:border-l md:border-t-0 md:pl-6 md:pt-0 dark:border-white/10">
                      <div className="flex items-center gap-2 text-sm text-[#5d6d7e] dark:text-[#99a3ad]">
                        <CalendarDays className="h-4 w-4" />
                        {formatEventDate(event.date)}
                      </div>
                      <div className="mt-3 flex items-center gap-2 text-sm text-[#5d6d7e] dark:text-[#99a3ad]">
                        <MapPin className="h-4 w-4" />
                        {event.location_name}
                      </div>
                      <div className="mt-3 flex items-center gap-2 text-sm text-[#5d6d7e] dark:text-[#99a3ad]">
                        <Users className="h-4 w-4" />
                        {event.capacity ? `${event.capacity} spots` : "Open"}
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}

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

      <section className="border-y border-black/5 py-20 dark:border-white/10">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1fr_1.15fr]">
            <Reveal className="max-w-xl">
              <p className="eyebrow">City guides</p>
              <h2 className="mt-4 max-w-lg text-4xl font-semibold text-neutral-950 sm:text-5xl dark:text-[#f2f3f4]">
                Everything you need for your first month.
              </h2>
              <p className="text-muted mt-5 max-w-md text-lg leading-8">
                Neighborhoods, coworking, housing, internet, transport, cost of
                living, and more - written by people living here.
              </p>
              <p className="mt-5 max-w-md text-sm leading-7 text-[#5d6d7e] dark:text-[#99a3ad]">
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
                    className="rounded-full border border-black/10 bg-white/55 px-4 py-2 text-sm text-neutral-700 transition-colors hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-[#99a3ad] dark:hover:bg-white/10"
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
                    className="group flex items-start justify-between gap-6 rounded-[1.75rem] border border-transparent px-1 py-4 transition-all hover:border-black/10 hover:bg-white/45 hover:px-5 dark:hover:border-white/10 dark:hover:bg-white/5"
                  >
                    <div className="flex gap-5">
                      <div className="font-mono text-xs uppercase tracking-[0.3em] text-neutral-400 dark:text-[#5d6d7e]">
                        0{index + 1}
                      </div>
                      <div>
                        <h3 className="text-2xl font-semibold text-[#1a1a2e] dark:text-[#f2f3f4]">
                          {guide.title}
                        </h3>
                        <p className="mt-2 max-w-xl text-sm leading-7 text-[#5d6d7e] dark:text-[#99a3ad]">
                          {guide.description}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="mt-1 h-5 w-5 shrink-0 text-neutral-400 transition-transform group-hover:translate-x-1 group-hover:text-primary-600 dark:group-hover:text-primary-400" />
                  </Link>
                </Reveal>
              ))}

              <Reveal delay={4}>
                <div className="surface-blur rounded-[2rem] border border-black/10 p-6 dark:border-white/10">
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

      <section className="py-20">
        <Container>
          <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
            <Reveal className="rounded-[2rem] border border-primary-500/20 bg-[linear-gradient(135deg,#c0392b_0%,#922b21_50%,#641e16_100%)] p-8 text-white dark:bg-[linear-gradient(135deg,#922b21_0%,#641e16_50%,#15212c_100%)]">
              <p className="eyebrow text-white/70">First month essentials</p>
              <h2 className="mt-4 max-w-md text-4xl font-semibold sm:text-5xl">
                Start with the pieces that make remote life easier to operate.
              </h2>
              <p className="mt-5 max-w-md text-base leading-8 text-white/72 dark:text-white/65">
                If you just landed, begin with neighborhoods, internet, transit,
                and this week&apos;s meetup. It&apos;s the fastest path from
                arrival mode to a workable local routine.
              </p>

              <div className="mt-8 space-y-4">
                {orientationLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center justify-between border-t border-white/10 pt-4 text-left transition-colors hover:text-primary-200 dark:border-white/10 dark:hover:text-primary-300"
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
                  <div className="surface-panel flex h-full flex-col justify-between rounded-[2rem] p-6 transition-transform duration-300 hover:-translate-y-1">
                    <div>
                      <p className="eyebrow">{item.phase}</p>
                      <h3 className="mt-4 text-lg font-semibold text-[#1a1a2e] dark:text-[#f2f3f4]">
                        {item.title}
                      </h3>
                      <p className="mt-3 text-base leading-8 text-[#526e89] dark:text-[#99a3ad]">
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

      <section className="py-20">
        <Container>
          <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
            <Reveal className="rounded-[2rem] border border-primary-500/20 bg-[linear-gradient(135deg,#c0392b_0%,#922b21_50%,#641e16_100%)] p-8 text-white dark:bg-[linear-gradient(135deg,#922b21_0%,#641e16_50%,#15212c_100%)]">
              <p className="eyebrow text-white/70">Why people stay</p>
              <h2 className="mt-4 max-w-md text-4xl font-semibold sm:text-5xl">
                Why nomads keep extending their stay.
              </h2>
              <p className="mt-5 max-w-md text-base leading-8 text-white/72 dark:text-white/65">
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
                    className="border-t border-white/10 pt-4 dark:border-white/10"
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="h-5 w-5" />
                      <h3 className="text-lg font-medium">{item.title}</h3>
                    </div>
                    <p className="mt-2 text-sm leading-7 text-white/70 dark:text-white/60">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal
              delay={1}
              className="surface-panel flex flex-col justify-between rounded-[2rem] p-8"
            >
              <div>
                <p className="eyebrow">Local knowledge, shared quickly</p>
                <h3 className="mt-4 max-w-lg text-3xl font-semibold text-primary-950 dark:text-primary-100">
                  Ask one question and skip hours of guesswork.
                </h3>
                <p className="mt-4 max-w-xl text-base leading-8 text-[#5d6d7e] dark:text-[#99a3ad]">
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
                    className="surface-subtle rounded-[1.5rem] p-4 text-sm leading-7 text-[#5d6d7e] transition-transform duration-300 hover:-translate-y-1 dark:text-[#99a3ad]"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="pb-20">
        <Container>
          <Reveal className="relative overflow-hidden rounded-[2.5rem] border border-primary-500/20 bg-[linear-gradient(135deg,#c0392b_0%,#922b21_40%,#641e16_100%)] px-6 py-10 text-white dark:bg-[linear-gradient(135deg,#922b21_0%,#641e16_40%,#15212c_100%)] sm:px-10 sm:py-14">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(192,57,43,0.28),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(243,156,18,0.18),transparent_30%)]" />
            <div className="relative">
              <p className="eyebrow text-white/60">Get started</p>
              <h2 className="mt-4 max-w-3xl text-4xl font-semibold sm:text-5xl">
                Join us on Telegram.
              </h2>
              <p className="mt-5 max-w-xl text-lg leading-8 text-white/72">
                Introduce yourself and we&apos;ll point you to this week&apos;s
                meetup, a good workspace, or the right neighborhood to start
                from.
              </p>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <a
                  href={socialLinks.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-none"
                >
                  <Button
                    size="lg"
                    className="h-14 w-full rounded-2xl bg-white px-8 text-base font-semibold text-neutral-950 shadow-lg shadow-white/10 hover:bg-primary-50 sm:w-auto"
                  >
                    Join on Telegram
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </a>
                <Link href="/about" className="flex-1 sm:flex-none">
                  <Button
                    variant="ghost"
                    size="lg"
                    className="h-14 w-full rounded-2xl border border-white/20 px-8 text-base font-medium text-white/90 backdrop-blur-sm hover:bg-white/10 hover:text-white sm:w-auto"
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
