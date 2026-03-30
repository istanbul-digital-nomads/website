import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Clock3,
  Globe,
  MessageCircle,
  MapPin,
  MoveUpRight,
  Sparkles,
  Users,
  Wifi,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { events, guides } from "@/lib/data";
import { socialLinks } from "@/lib/constants";

const liveEvents = events.filter((event) => !event.isPast).slice(0, 3);
const featuredGuides = guides.slice(0, 4);
const nextEvent = liveEvents[0];
const heroTrustSignals = nextEvent
  ? [
      `Next coworking ${formatEventDate(nextEvent.date)}`,
      "Free to join",
      "English-friendly meetups",
    ]
  : [
      "Free to join",
      "English-friendly meetups",
      "Weekly coworking in the city",
    ];
const orientationLinks = [
  { label: "Where should I stay?", href: "/guides/neighborhoods" },
  { label: "Best areas for coworking", href: "/guides/coworking" },
  { label: "What does a month cost?", href: "/guides/cost-of-living" },
  { label: "How do I get online fast?", href: "/guides/internet" },
];
const heroSides = [
  {
    name: "Kadikoy / Moda",
    tone: "Calmer",
    description:
      "Better for steady routines, ferry access, strong cafe culture, and neighborhood feel.",
  },
  {
    name: "Galata / Beyoglu",
    tone: "Livelier",
    description:
      "Better for social density, quicker nights out, and easy access across the European side.",
  },
];
const heroMapPoints = [
  {
    name: "Galata",
    x: 38,
    y: 28,
    align: "left" as const,
    toneClass: "bg-accent-warm text-neutral-950 shadow-accent-warm/30",
  },
  {
    name: "Besiktas",
    x: 32,
    y: 48,
    align: "right" as const,
    toneClass:
      "bg-white text-neutral-950 shadow-black/10 dark:bg-white/15 dark:text-neutral-50",
  },
  {
    name: "Kadikoy",
    x: 67,
    y: 64,
    align: "right" as const,
    toneClass: "bg-primary-500 text-white shadow-primary-500/30",
  },
  {
    name: "Moda",
    x: 73,
    y: 76,
    align: "left" as const,
    toneClass: "bg-accent-green text-white shadow-accent-green/30",
  },
  {
    name: "Uskudar",
    x: 61,
    y: 50,
    align: "left" as const,
    toneClass:
      "bg-white text-neutral-950 shadow-black/10 dark:bg-white/15 dark:text-neutral-50",
  },
];
const eventMoments: Record<string, string> = {
  "1": "Quiet work session with reliable wifi and plenty of regulars who welcome first-timers.",
  "2": "The easiest event to meet people fast, especially if you just arrived and want social momentum.",
  "3": "Bring real questions about freelancing, residency, and how to stay compliant while living here.",
};
const testimonials = [
  {
    quote:
      "I landed in Istanbul with two weeks booked. By the end of month one, I had a work rhythm, favorite ferry, and real friends.",
    name: "Sarah K.",
    role: "First month in Kadikoy - Product designer from Berlin",
  },
  {
    quote:
      "Most communities feel transactional. This one feels local, generous, and surprisingly well tuned to how remote people actually live.",
    name: "Marco T.",
    role: "Three months in Cihangir - Engineer from Lisbon",
  },
  {
    quote:
      "The guides removed the friction, and the coworking days gave the city a pulse. Istanbul stopped feeling huge and started feeling legible.",
    name: "Aiko M.",
    role: "Stayed for a year in Moda - Writer from Tokyo",
  },
];

function formatEventDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

export default function HomePage() {
  return (
    <div className="overflow-hidden">
      <section className="relative isolate border-b border-black/5 dark:border-white/10">
        <div className="bg-grid bg-noise absolute inset-0 opacity-40 dark:opacity-20" />
        <div className="animate-float absolute left-[-8%] top-20 h-72 w-72 rounded-full bg-primary-400/15 blur-3xl dark:bg-primary-500/20" />
        <div className="animate-float-slow absolute right-[-6%] top-10 h-80 w-80 rounded-full bg-accent-warm/15 blur-3xl dark:bg-accent-coral/20" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-[var(--background)]" />

        <Container className="relative py-8 sm:py-12 lg:min-h-[calc(100svh-7rem)] lg:py-8">
          <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
            <div className="eyebrow flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-primary-500" />
              Digital nomads in Istanbul
            </div>
            <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-neutral-500 dark:text-neutral-400">
              GMT+3 - ferry-friendly - walkable workdays
            </div>
          </div>

          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.72fr)_minmax(560px,1fr)] lg:items-center lg:gap-12">
            <Reveal delay={0} className="max-w-[30rem] pt-2 lg:pt-0">
              <p className="eyebrow">Istanbul Digital Nomads</p>
              <h1 className="mt-5 max-w-[8.4ch] text-balance text-[3rem] font-semibold leading-[0.9] text-neutral-950 sm:text-[4rem] lg:text-[4.35rem] dark:text-neutral-50">
                Build your
                <br />
                Istanbul base,
                <br />
                faster.
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-neutral-700 sm:text-[1.22rem] dark:text-neutral-200">
                Weekly coworking, practical guides, and local answers for
                digital nomads building a real life in Istanbul.
              </p>
              <p className="text-muted mt-4 max-w-md text-base leading-7">
                Start with the right neighborhood, a reliable workspace, and
                people already here.
              </p>

              <Reveal delay={1}>
                <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                  <a
                    href={socialLinks.telegram}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      size="lg"
                      className="w-full rounded-full bg-neutral-950 px-7 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 sm:w-auto"
                    >
                      Join the Telegram
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  </a>
                  <Link href="/guides">
                    <Button
                      variant="secondary"
                      size="lg"
                      className="w-full rounded-full border border-black/10 bg-white/60 px-7 text-neutral-950 hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-neutral-50 dark:hover:bg-white/10 sm:w-auto"
                    >
                      Start with the guides
                    </Button>
                  </Link>
                </div>
              </Reveal>

              <Reveal delay={2}>
                <div className="mt-5 flex flex-wrap gap-3">
                  {heroTrustSignals.map((signal) => (
                    <div
                      key={signal}
                      className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/55 px-3 py-2 text-sm text-neutral-700 dark:border-white/10 dark:bg-white/5 dark:text-neutral-200"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-primary-500" />
                      {signal}
                    </div>
                  ))}
                </div>
              </Reveal>

              <Reveal delay={3}>
                <p className="mt-5 text-sm leading-6 text-neutral-600 dark:text-neutral-300">
                  Introduce yourself once and get pointed to this week&apos;s
                  meetup, tomorrow&apos;s workspace, or the right district to
                  start from.
                </p>
              </Reveal>
            </Reveal>

            <Reveal
              delay={1}
              className="relative min-h-[500px] sm:min-h-[580px] lg:min-h-[560px]"
            >
              <div className="absolute inset-0 overflow-hidden rounded-[2.3rem] border border-primary-200/60 bg-[linear-gradient(180deg,rgba(229,240,245,0.82),rgba(210,225,233,0.62))] shadow-[0_30px_90px_rgba(15,23,42,0.12)] dark:border-primary-900/40 dark:bg-[linear-gradient(180deg,rgba(11,27,39,0.92),rgba(9,20,30,0.9))] dark:shadow-[0_30px_90px_rgba(0,0,0,0.35)]" />
              <div className="bg-grid absolute inset-5 rounded-[1.8rem] border border-black/5 opacity-40 dark:border-white/10 dark:opacity-50" />

              <div className="absolute inset-5 overflow-hidden rounded-[1.8rem]">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(255,255,255,0.52),transparent_22%),radial-gradient(circle_at_74%_84%,rgba(255,255,255,0.26),transparent_18%)] dark:bg-[radial-gradient(circle_at_20%_15%,rgba(255,255,255,0.06),transparent_22%),radial-gradient(circle_at_74%_84%,rgba(255,255,255,0.04),transparent_18%)]" />
                <svg
                  viewBox="0 0 100 100"
                  className="absolute inset-0 h-full w-full"
                  aria-hidden="true"
                >
                  <path
                    d="M0 0h100v100H0z"
                    className="fill-[rgba(178,207,220,0.62)] dark:fill-[rgba(20,44,58,0.78)]"
                  />
                  <path
                    d="M0 8C8 8 15 10 22 13c5 2 10 7 13 12 3 6 4 11 9 18 4 5 7 10 7 17 0 6-4 12-8 18-5 8-6 15-5 24H0z"
                    className="fill-[rgba(250,246,240,0.92)] stroke-[rgba(17,24,39,0.12)] dark:fill-[rgba(250,246,240,0.06)] dark:stroke-[rgba(255,255,255,0.12)]"
                    strokeWidth="0.6"
                  />
                  <path
                    d="M69 12c8-1 18 1 31 5v83H60c-2-9 0-17 4-23 4-6 7-10 7-16 0-8-5-14-9-20-5-7-7-13-7-22 0-8 4-13 14-7"
                    className="fill-[rgba(250,246,240,0.92)] stroke-[rgba(17,24,39,0.12)] dark:fill-[rgba(250,246,240,0.06)] dark:stroke-[rgba(255,255,255,0.12)]"
                    strokeWidth="0.6"
                  />
                  <path
                    d="M53 5c3 8 2 15 0 22-2 8-3 16-1 25 2 7 5 12 9 17 5 7 7 12 4 19"
                    className="stroke-[rgba(85,123,141,0.7)] dark:stroke-[rgba(120,170,193,0.62)]"
                    strokeWidth="3.2"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <path
                    d="M45 27c6 0 12 0 18-2"
                    className="stroke-[rgba(85,123,141,0.55)] dark:stroke-[rgba(120,170,193,0.5)]"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <path
                    d="M44 66C50 62 55 57 60 49c5-8 10-14 18-16"
                    className="animate-map-route stroke-primary-500/80 dark:stroke-primary-400/75"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeDasharray="2 3"
                    fill="none"
                  />
                  <path
                    d="M36 31c4 0 7 2 9 5M63 59c3 2 6 4 8 7"
                    className="stroke-accent-warm/70 dark:stroke-accent-warm/65"
                    strokeWidth="1.1"
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
              </div>

              {heroMapPoints.map((point, index) => (
                <div
                  key={point.name}
                  className="absolute"
                  style={{ left: `${point.x}%`, top: `${point.y}%` }}
                >
                  <div
                    className="animate-marker-pulse absolute -left-1.5 -top-1.5 h-3 w-3 rounded-full bg-primary-500 shadow-[0_0_0_10px_rgba(227,75,50,0.12)]"
                    style={{ animationDelay: `${index * 0.7}s` }}
                  />
                  <div
                    className={`animate-drift absolute top-3 rounded-full px-3 py-1 font-mono text-[11px] uppercase tracking-[0.24em] shadow-lg ${
                      point.align === "right" ? "-left-24" : "left-2"
                    } ${point.toneClass}`}
                    style={{ animationDelay: `${index * 0.45}s` }}
                  >
                    {point.name}
                  </div>
                </div>
              ))}

              <div className="absolute inset-5 flex flex-col justify-between rounded-[1.8rem] px-5 py-6 sm:px-7 sm:py-7">
                <div>
                  <div className="flex items-start justify-between gap-5">
                    <div>
                      <p className="eyebrow">Nomad Map - Istanbul</p>
                      <h2 className="mt-4 max-w-[11ch] text-[1.75rem] font-semibold leading-[1.02] text-neutral-950 dark:text-neutral-50 sm:text-[2.2rem]">
                        Read the city faster with a real Bosphorus map.
                      </h2>
                      <p className="mt-3 max-w-sm text-sm leading-6 text-neutral-600 dark:text-neutral-300">
                        European side on the left, Asian side on the right, and
                        ferry routes shaping how your week actually moves.
                      </p>
                    </div>
                    <div className="hidden rounded-full border border-black/10 bg-white/70 p-3 shadow-sm dark:border-white/10 dark:bg-white/10 sm:block">
                      <MapPin className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                    </div>
                  </div>

                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    {heroSides.map((side, index) => (
                      <div
                        key={side.name}
                        className="rounded-[1.7rem] border border-black/10 bg-white/78 p-5 backdrop-blur-md dark:border-white/10 dark:bg-white/8"
                      >
                        <div className="flex items-center justify-between gap-4">
                          <p className="text-lg font-medium text-neutral-950 dark:text-neutral-50">
                            {side.name}
                          </p>
                          <span
                            className={`font-mono text-[11px] uppercase tracking-[0.24em] ${
                              index === 0
                                ? "text-primary-600 dark:text-primary-300"
                                : "text-accent-warm dark:text-orange-300"
                            }`}
                          >
                            {side.tone}
                          </span>
                        </div>
                        <p className="mt-3 max-w-sm text-sm leading-6 text-neutral-600 dark:text-neutral-300">
                          {side.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-[1.08fr_0.92fr]">
                  <div className="rounded-[1.8rem] border border-black/10 bg-white/82 p-5 backdrop-blur-md dark:border-white/10 dark:bg-white/10">
                    <p className="eyebrow text-neutral-500 dark:text-neutral-400">
                      Bosphorus rhythm
                    </p>
                    <p className="mt-3 text-[1.55rem] font-semibold leading-[1.04] text-neutral-950 dark:text-neutral-50 sm:text-[1.85rem]">
                      Work on one side.
                      <br />
                      Meet on the other.
                    </p>
                    <p className="mt-3 max-w-md text-sm leading-6 text-neutral-600 dark:text-neutral-300">
                      Ferries make the city feel smaller: calmer mornings in
                      Kadikoy, more social energy around Galata by evening.
                    </p>
                  </div>
                  <div className="animate-drift-delayed rounded-[1.8rem] border border-black/10 bg-neutral-950 p-5 text-white dark:border-white/10 dark:bg-neutral-50 dark:text-neutral-950">
                    <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-white/65 dark:text-neutral-600">
                      Fresh signal
                    </p>
                    <div className="mt-4 flex items-start gap-3 text-sm leading-6">
                      <MessageCircle className="mt-0.5 h-4 w-4 shrink-0" />
                      <span>
                        Ask where to work tomorrow and get a local answer fast.
                      </span>
                    </div>
                    <div className="mt-3 flex items-start gap-3 text-sm leading-6 text-white/75 dark:text-neutral-600">
                      <CalendarDays className="mt-0.5 h-4 w-4 shrink-0" />
                      <span>
                        {nextEvent
                          ? `Next meetup ${formatEventDate(nextEvent.date)} in ${nextEvent.location}.`
                          : "Get pointed to the next meetup, coworking day, or neighborhood guide."}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="border-b border-black/5 py-8 dark:border-white/10">
        <Container>
          <Reveal>
            <p className="mb-5 max-w-2xl text-sm leading-6 text-neutral-600 dark:text-neutral-300">
              Built for people who want a city that becomes workable quickly,
              not just another place to pass through.
            </p>
            <div className="grid gap-6 md:grid-cols-4">
              {[
                { value: "500+", label: "active members", icon: Users },
                {
                  value: "Weekly",
                  label: "coworking rhythm",
                  icon: CalendarDays,
                },
                { value: "10", label: "local living guides", icon: Globe },
                { value: "15+", label: "neighborhoods covered", icon: MapPin },
              ].map((item, index) => (
                <Reveal
                  key={item.label}
                  delay={index as 0 | 1 | 2 | 3}
                  className="flex items-start gap-4 border-l border-black/10 pl-4 first:border-l-0 first:pl-0 dark:border-white/10"
                >
                  <item.icon className="mt-1 h-5 w-5 text-primary-600 dark:text-primary-400" />
                  <div>
                    <p className="text-3xl font-semibold text-neutral-950 dark:text-neutral-50">
                      {item.value}
                    </p>
                    <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-neutral-500 dark:text-neutral-400">
                      {item.label}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="py-20 lg:py-24">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <Reveal className="lg:sticky lg:top-24 lg:self-start">
              <p className="eyebrow">This week in the city</p>
              <h2 className="mt-4 max-w-md text-4xl font-semibold text-neutral-950 sm:text-5xl dark:text-neutral-50">
                The community runs on repeatable rituals.
              </h2>
              <p className="text-muted mt-5 max-w-md text-lg leading-8">
                Less one-off networking, more dependable moments to plug into:
                coworking days, rooftop meetups, practical workshops, and a
                group chat that actually answers questions.
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
                      <h3 className="mt-3 text-2xl font-semibold text-neutral-950 dark:text-neutral-50">
                        {event.title}
                      </h3>
                      <p className="mt-3 text-sm leading-7 text-neutral-600 dark:text-neutral-300">
                        {event.description}
                      </p>
                      <p className="mt-4 text-sm font-medium leading-6 text-neutral-950 dark:text-neutral-100">
                        {eventMoments[event.id]}
                      </p>
                    </div>

                    <div className="min-w-[220px] border-t border-black/10 pt-4 md:border-l md:border-t-0 md:pl-6 md:pt-0 dark:border-white/10">
                      <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-300">
                        <CalendarDays className="h-4 w-4" />
                        {formatEventDate(event.date)}
                      </div>
                      <div className="mt-3 flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-300">
                        <MapPin className="h-4 w-4" />
                        {event.location}
                      </div>
                      <div className="mt-3 flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-300">
                        <Users className="h-4 w-4" />
                        {event.attendees} attending
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}

              <Reveal delay={3}>
                <Link
                  href="/events"
                  className="group inline-flex items-center gap-2 font-medium text-neutral-950 transition-colors hover:text-primary-600 dark:text-neutral-50 dark:hover:text-primary-400"
                >
                  See all events
                  <MoveUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
              </Reveal>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-y border-black/5 py-20 dark:border-white/10">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1fr_1.15fr]">
            <Reveal className="max-w-xl">
              <p className="eyebrow">Remote life, decoded</p>
              <h2 className="mt-4 max-w-lg text-4xl font-semibold text-neutral-950 sm:text-5xl dark:text-neutral-50">
                The guides turn Istanbul from overwhelming into usable.
              </h2>
              <p className="text-muted mt-5 max-w-md text-lg leading-8">
                We focus on the questions that matter once you stay past the
                first week: where to live, how to move, how much things cost,
                and which workspaces keep your day smooth.
              </p>
              <p className="mt-5 max-w-md text-sm leading-7 text-neutral-600 dark:text-neutral-300">
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
                    className="rounded-full border border-black/10 bg-white/55 px-4 py-2 text-sm text-neutral-700 transition-colors hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-neutral-200 dark:hover:bg-white/10"
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
                      <div className="font-mono text-xs uppercase tracking-[0.3em] text-neutral-400 dark:text-neutral-500">
                        0{index + 1}
                      </div>
                      <div>
                        <h3 className="text-2xl font-semibold text-neutral-950 dark:text-neutral-50">
                          {guide.title}
                        </h3>
                        <p className="mt-2 max-w-xl text-sm leading-7 text-neutral-600 dark:text-neutral-300">
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
                      <p className="mt-2 text-lg font-medium text-neutral-950 dark:text-neutral-50">
                        Housing, internet, transport, visa basics, and
                        neighborhood fit.
                      </p>
                    </div>
                    <Link
                      href="/guides"
                      className="inline-flex items-center gap-2 text-sm font-medium text-neutral-950 transition-colors hover:text-primary-600 dark:text-neutral-50 dark:hover:text-primary-400"
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

      <section className="py-20">
        <Container>
          <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
            <Reveal className="rounded-[2rem] border border-black/10 bg-neutral-950 p-8 text-white dark:border-white/10 dark:bg-white dark:text-neutral-950">
              <p className="eyebrow text-white/60 dark:text-neutral-500">
                First month essentials
              </p>
              <h2 className="mt-4 max-w-md text-4xl font-semibold sm:text-5xl">
                Start with the pieces that make remote life easier to operate.
              </h2>
              <p className="mt-5 max-w-md text-base leading-8 text-white/72 dark:text-neutral-600">
                If you just landed, begin with neighborhoods, internet, transit,
                and this week&apos;s meetup. It is the fastest path from arrival
                mode to a workable local routine.
              </p>

              <div className="mt-8 space-y-4">
                {orientationLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center justify-between border-t border-white/10 pt-4 text-left transition-colors hover:text-primary-200 dark:border-neutral-300 dark:hover:text-primary-700"
                  >
                    <span className="text-base font-medium">{item.label}</span>
                    <MoveUpRight className="h-4 w-4 shrink-0" />
                  </Link>
                ))}
              </div>
            </Reveal>

            <div className="grid gap-4 sm:grid-cols-3">
              {testimonials.map((testimonial, index) => (
                <Reveal key={testimonial.name} delay={index as 0 | 1 | 2}>
                  <blockquote className="surface-panel flex h-full flex-col justify-between rounded-[2rem] p-6 transition-transform duration-300 hover:-translate-y-1">
                    <div>
                      <p className="eyebrow">
                        {index === 0
                          ? "Arrival"
                          : index === 1
                            ? "Orientation"
                            : "Attachment"}
                      </p>
                      <p className="mt-4 text-base leading-8 text-neutral-700 dark:text-neutral-200">
                        &ldquo;{testimonial.quote}&rdquo;
                      </p>
                    </div>
                    <footer className="mt-8 border-t border-black/10 pt-4 dark:border-white/10">
                      <p className="font-semibold text-neutral-950 dark:text-neutral-50">
                        {testimonial.name}
                      </p>
                      <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                        {testimonial.role}
                      </p>
                    </footer>
                  </blockquote>
                </Reveal>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
            <Reveal className="rounded-[2rem] border border-black/10 bg-neutral-950 p-8 text-white dark:border-white/10 dark:bg-white dark:text-neutral-950">
              <p className="eyebrow text-white/60 dark:text-neutral-500">
                Why people stay
              </p>
              <h2 className="mt-4 max-w-md text-4xl font-semibold sm:text-5xl">
                Not another expat feed. A city operating system.
              </h2>
              <p className="mt-5 max-w-md text-base leading-8 text-white/72 dark:text-neutral-600">
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
                    className="border-t border-white/10 pt-4 dark:border-neutral-300"
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="h-5 w-5" />
                      <h3 className="text-lg font-medium">{item.title}</h3>
                    </div>
                    <p className="mt-2 text-sm leading-7 text-white/70 dark:text-neutral-600">
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
                <h3 className="mt-4 max-w-lg text-3xl font-semibold text-neutral-950 dark:text-neutral-50">
                  Ask one question and skip hours of guesswork.
                </h3>
                <p className="mt-4 max-w-xl text-base leading-8 text-neutral-600 dark:text-neutral-300">
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
                  "A softer landing if you are staying more than a few weeks",
                ].map((item) => (
                  <div
                    key={item}
                    className="surface-subtle rounded-[1.5rem] p-4 text-sm leading-7 text-neutral-700 transition-transform duration-300 hover:-translate-y-1 dark:text-neutral-200"
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
          <Reveal className="relative overflow-hidden rounded-[2.5rem] border border-black/10 bg-neutral-950 px-6 py-10 text-white dark:border-white/10 dark:bg-[#08111b] sm:px-10 sm:py-14">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.35),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(236,72,153,0.22),transparent_30%)]" />
            <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <p className="eyebrow text-white/60">Start with one message</p>
                <h2 className="mt-4 text-4xl font-semibold sm:text-5xl">
                  Join the channel and make Istanbul feel smaller by tonight.
                </h2>
                <p className="mt-5 max-w-xl text-lg leading-8 text-white/72">
                  Drop into the Telegram, say hi, and get pointed toward this
                  week&apos;s meetup, the best area to start from, or a good
                  place to work tomorrow.
                </p>
                <p className="mt-4 max-w-xl text-sm leading-7 text-white/65">
                  Free to join. No application. Best for people staying longer
                  than a quick stopover.
                </p>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row">
                <a
                  href={socialLinks.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    size="lg"
                    className="w-full rounded-full bg-white px-7 text-neutral-950 hover:bg-neutral-200 sm:w-auto"
                  >
                    Join on Telegram
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </a>
                <Link href="/about">
                  <Button
                    variant="ghost"
                    size="lg"
                    className="w-full rounded-full border border-white/15 px-7 text-white hover:bg-white/10 hover:text-white sm:w-auto"
                  >
                    Learn about the community
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
