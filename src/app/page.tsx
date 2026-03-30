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

        <Container className="relative py-14 sm:py-20 lg:py-24">
          <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
            <div className="eyebrow flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-primary-500" />
              Digital nomads in Istanbul
            </div>
            <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-neutral-500 dark:text-neutral-400">
              GMT+3 - ferry-friendly - walkable workdays
            </div>
          </div>

          <div className="grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(420px,0.9fr)] lg:items-center">
            <div className="max-w-3xl">
              <p className="eyebrow">Istanbul Digital Nomads</p>
              <h1 className="mt-5 max-w-4xl text-balance text-[2.85rem] font-semibold leading-[0.96] text-neutral-950 sm:text-6xl lg:text-[5.15rem] dark:text-neutral-50">
                Build a real digital
                <br />
                life in Istanbul,
                <br />
                faster.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-700 sm:text-xl dark:text-neutral-200">
                A local community for digital nomads in Istanbul with weekly
                coworking, meetups, practical city guides, and fast answers from
                people already here.
              </p>
              <p className="text-muted mt-4 max-w-xl text-base leading-7">
                Ferry-friendly city logic, neighborhood tradeoffs, and a weekly
                rhythm that helps newcomers settle in fast.
              </p>

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

              <p className="mt-5 text-sm leading-6 text-neutral-600 dark:text-neutral-300">
                Join the Telegram, introduce yourself, and get pointed to this
                week&apos;s meetup, a good place to work tomorrow, or the right
                neighborhood to start from.
              </p>
            </div>

            <div className="relative min-h-[520px]">
              <div className="surface-panel absolute inset-0 rounded-[2rem] shadow-[0_30px_90px_rgba(15,23,42,0.12)] dark:shadow-[0_30px_90px_rgba(0,0,0,0.35)]" />
              <div className="bg-grid absolute inset-6 rounded-[1.5rem] border border-black/5 dark:border-white/10" />

              <div className="animate-pulse-line absolute left-[18%] top-[20%] h-px w-[56%] bg-gradient-to-r from-transparent via-primary-500 to-transparent" />
              <div className="animate-pulse-line absolute left-[26%] top-[55%] h-px w-[46%] bg-gradient-to-r from-transparent via-accent-warm to-transparent [animation-delay:1.2s]" />
              <div className="absolute left-[14%] top-[14%] h-24 w-24 rounded-full border border-primary-500/35" />
              <div className="absolute right-[10%] top-[14%] h-36 w-36 rounded-full border border-accent-warm/35" />
              <div className="absolute bottom-[26%] left-[20%] h-44 w-44 rounded-full border border-accent-green/30" />

              <div className="absolute left-[13%] top-[13%] rounded-full bg-primary-500 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.24em] text-white shadow-lg shadow-primary-500/30">
                Kadikoy
              </div>
              <div className="absolute right-[8%] top-[19%] rounded-full bg-accent-warm px-3 py-1 font-mono text-[11px] uppercase tracking-[0.24em] text-neutral-950 shadow-lg shadow-accent-warm/30">
                Galata
              </div>
              <div className="absolute bottom-[31%] left-[18%] rounded-full bg-accent-green px-3 py-1 font-mono text-[11px] uppercase tracking-[0.24em] text-white shadow-lg shadow-accent-green/30">
                Moda
              </div>
              <div className="absolute left-[42%] top-[38%] rounded-full border border-black/10 bg-white/70 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.24em] text-neutral-700 shadow-sm dark:border-white/10 dark:bg-white/10 dark:text-neutral-200">
                Ferry line
              </div>

              <div className="absolute left-8 right-8 top-10 rounded-[1.75rem] border border-black/10 bg-white/70 p-5 backdrop-blur-md dark:border-white/10 dark:bg-white/10">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="eyebrow">Asian Side or European Side?</p>
                    <h2 className="mt-2 text-2xl font-semibold text-neutral-950 dark:text-neutral-50">
                      Choose the side of the city that fits the way you want to
                      live.
                    </h2>
                  </div>
                  <MapPin className="h-5 w-5 shrink-0 text-primary-600 dark:text-primary-400" />
                </div>
                <div className="mt-5 grid gap-3">
                  <div className="surface-subtle flex items-start justify-between gap-4 rounded-[1.25rem] p-4">
                    <div>
                      <p className="font-medium text-neutral-950 dark:text-neutral-50">
                        Kadikoy / Moda
                      </p>
                      <p className="mt-1 text-sm leading-6 text-neutral-600 dark:text-neutral-300">
                        Easier routine, ferry access, more neighborhood feel,
                        and strong cafe and coworking culture.
                      </p>
                    </div>
                    <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-primary-600 dark:text-primary-300">
                      calmer
                    </span>
                  </div>
                  <div className="surface-subtle flex items-start justify-between gap-4 rounded-[1.25rem] p-4">
                    <div>
                      <p className="font-medium text-neutral-950 dark:text-neutral-50">
                        Galata / Beyoglu
                      </p>
                      <p className="mt-1 text-sm leading-6 text-neutral-600 dark:text-neutral-300">
                        Better if you want density, nightlife, and easier access
                        to meetups across the European side.
                      </p>
                    </div>
                    <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent-warm dark:text-orange-300">
                      livelier
                    </span>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-8 left-8 right-8 grid gap-3 sm:grid-cols-2">
                <div className="surface-subtle rounded-3xl p-4">
                  <p className="eyebrow text-neutral-500 dark:text-neutral-400">
                    Bosphorus crossing
                  </p>
                  <p className="mt-3 text-2xl font-semibold text-neutral-950 dark:text-neutral-50">
                    Work on one side.
                    <br />
                    Meet on the other.
                  </p>
                  <p className="mt-3 text-sm leading-6 text-neutral-600 dark:text-neutral-300">
                    Ferries turn the city into a loop: calmer mornings in
                    Kadikoy, denser social energy around Galata by evening.
                  </p>
                </div>
                <div className="rounded-3xl border border-black/10 bg-neutral-950 p-4 text-white dark:border-white/10 dark:bg-neutral-50 dark:text-neutral-950">
                  <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-white/65 dark:text-neutral-600">
                    Fresh signal
                  </p>
                  <div className="mt-4 flex items-start gap-3 text-sm">
                    <MessageCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>
                      Say hi in Telegram and ask where to work tomorrow.
                    </span>
                  </div>
                  <div className="mt-3 flex items-start gap-3 text-sm text-white/75 dark:text-neutral-600">
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
          </div>
        </Container>
      </section>

      <section className="border-b border-black/5 py-8 dark:border-white/10">
        <Container>
          <p className="mb-5 max-w-2xl text-sm leading-6 text-neutral-600 dark:text-neutral-300">
            Built for people who want a city that becomes workable quickly, not
            just another place to pass through.
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
            ].map((item) => (
              <div
                key={item.label}
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
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-20 lg:py-24">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="lg:sticky lg:top-24 lg:self-start">
              <p className="eyebrow">This week in the city</p>
              <h2 className="mt-4 max-w-md text-4xl font-semibold text-neutral-950 sm:text-5xl dark:text-neutral-50">
                The community runs on repeatable rituals.
              </h2>
              <p className="text-muted mt-5 max-w-md text-lg leading-8">
                Less one-off networking, more dependable moments to plug into:
                coworking days, rooftop meetups, practical workshops, and a
                group chat that actually answers questions.
              </p>
            </div>

            <div className="space-y-4">
              {liveEvents.map((event) => (
                <div
                  key={event.id}
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
                </div>
              ))}

              <Link
                href="/events"
                className="group inline-flex items-center gap-2 font-medium text-neutral-950 transition-colors hover:text-primary-600 dark:text-neutral-50 dark:hover:text-primary-400"
              >
                See all events
                <MoveUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-y border-black/5 py-20 dark:border-white/10">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1fr_1.15fr]">
            <div>
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
            </div>

            <div className="space-y-4">
              <div className="flex flex-wrap gap-3">
                {orientationLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-full border border-black/10 bg-white/55 px-4 py-2 text-sm text-neutral-700 transition-colors hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-neutral-200 dark:hover:bg-white/10"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              {featuredGuides.map((guide, index) => (
                <Link
                  key={guide.slug}
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
              ))}

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
            </div>
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
            <div className="rounded-[2rem] border border-black/10 bg-neutral-950 p-8 text-white dark:border-white/10 dark:bg-white dark:text-neutral-950">
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
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {testimonials.map((testimonial, index) => (
                <blockquote
                  key={testimonial.name}
                  className="surface-panel flex h-full flex-col justify-between rounded-[2rem] p-6"
                >
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
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
            <div className="rounded-[2rem] border border-black/10 bg-neutral-950 p-8 text-white dark:border-white/10 dark:bg-white dark:text-neutral-950">
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
            </div>

            <div className="surface-panel flex flex-col justify-between rounded-[2rem] p-8">
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
                    className="surface-subtle rounded-[1.5rem] p-4 text-sm leading-7 text-neutral-700 dark:text-neutral-200"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="pb-20">
        <Container>
          <div className="relative overflow-hidden rounded-[2.5rem] border border-black/10 bg-neutral-950 px-6 py-10 text-white dark:border-white/10 dark:bg-[#08111b] sm:px-10 sm:py-14">
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
          </div>
        </Container>
      </section>
    </div>
  );
}
