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
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { IstanbulTodayWidget } from "@/components/sections/istanbul-today-widget";
import { NeighborhoodCardsSection } from "@/components/sections/neighborhood-cards";
import { NeighborhoodsMapSection } from "@/components/sections/neighborhoods-map-section";
import { NeighborhoodRhythmMatcher } from "@/components/sections/neighborhood-rhythm-matcher";
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

const orientationLinkKeys = [
  { key: "whereStay", href: "/guides/neighborhoods" },
  { key: "bestCoworking", href: "/guides/coworking" },
  { key: "monthlyCost", href: "/guides/cost-of-living" },
  { key: "fastInternet", href: "/guides/internet" },
] as const;

const heroRouteSteps = [
  { key: "kadikoyPier", time: "09:10", icon: MapPin },
  { key: "karakoyTable", time: "10:25", icon: Wifi },
  { key: "galataEvening", time: "18:30", icon: Users },
] as const;

const phaseKeys = ["weekOne", "monthOne", "monthThree"] as const;

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const tGuides = await getTranslations("guides");

  const { data: upcomingEvents } = await getEventsPublic({
    past: false,
    limit: 3,
  });
  const liveEvents = upcomingEvents ?? [];
  const nextEvent = liveEvents[0];
  const heroTrustSignals = nextEvent
    ? [
        t("hero.trustSignals.nextCoworking", {
          date: formatEventDate(nextEvent.date),
        }),
        t("hero.trustSignals.freeToJoin"),
        t("hero.trustSignals.allRemoteWorkers"),
      ]
    : [
        t("hero.trustSignals.freeToJoin"),
        t("hero.trustSignals.allRemoteWorkers"),
        t("hero.trustSignals.weeklyCoworking"),
      ];

  const heroDeskNotes = [
    [t("hero.deskNotes.baseLabel"), t("hero.deskNotes.baseValue")],
    [t("hero.deskNotes.crossingLabel"), t("hero.deskNotes.crossingValue")],
    [t("hero.deskNotes.fallbackLabel"), t("hero.deskNotes.fallbackValue")],
  ];

  const whyStayItems = [
    {
      icon: Wifi,
      titleKey: "reliableWorkdays" as const,
    },
    {
      icon: Clock3,
      titleKey: "lowFriction" as const,
    },
    {
      icon: Sparkles,
      titleKey: "localTexture" as const,
    },
  ];

  const whyStayBulletKeys = [
    "tradeoffs",
    "rituals",
    "setup",
    "landing",
  ] as const;

  return (
    <div className="overflow-hidden">
      <section className="relative isolate border-b border-black/10 bg-[#fbfaf8] dark:border-white/10 dark:bg-[#14110f]">
        <div className="bg-grid absolute inset-0 opacity-[0.32] dark:opacity-[0.14]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-primary-500/10 to-transparent dark:from-primary-950/20" />

        <Container className="relative py-8 sm:py-12 lg:py-16">
          <div className="mb-8 grid gap-3 border-y border-black/10 py-3 font-mono text-[10px] uppercase tracking-[0.22em] text-neutral-500 sm:grid-cols-[1fr_auto] sm:items-center dark:border-white/10 dark:text-[#94877d]">
            <p className="text-primary-700 dark:text-primary-300">
              {t("meta.tickerSchedule")}
            </p>
            <p>{t("meta.tickerTimezone")}</p>
          </div>

          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(440px,0.82fr)] lg:items-stretch lg:gap-14">
            <div className="flex flex-col justify-between gap-10 lg:min-h-[590px]">
              <div>
                <div className="mb-6 max-w-xl">
                  <div className="grid grid-cols-[auto_1fr_auto_1fr_auto] items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#6b6257] dark:text-[#94877d]">
                    <span>{t("meta.asiaBase")}</span>
                    <span className="h-px bg-black/10 dark:bg-white/10" />
                    <span>{t("meta.ferryReset")}</span>
                    <span className="h-px bg-black/10 dark:bg-white/10" />
                    <span>{t("meta.eveningTable")}</span>
                  </div>
                </div>

                <h1 className="max-w-[11.5ch] text-balance font-display text-[2.86rem] font-extrabold leading-[0.94] text-neutral-950 sm:text-[4.15rem] lg:text-[5.55rem] dark:text-[#f2f3f4]">
                  {t("hero.title")}
                </h1>
                <p className="mt-5 max-w-2xl text-[1.0625rem] leading-8 text-neutral-700 sm:text-body-xl dark:text-[#b7aaa0]">
                  {t("hero.subtitle")}
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
                      {t("hero.joinWorkweek")}
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  </a>
                  <Link href="/guides/neighborhoods">
                    <Button
                      variant="secondary"
                      size="lg"
                      className="w-full rounded-lg border border-black/40 bg-transparent px-6 text-neutral-950 hover:bg-white/60 dark:border-white/30 dark:text-[#f2f3f4] dark:hover:bg-white/10 sm:w-auto"
                    >
                      {t("hero.chooseBase")}
                    </Button>
                  </Link>
                </div>

                <div className="mt-7 overflow-hidden rounded-xl border border-white/10 bg-[#1a1612] lg:hidden">
                  <div className="relative h-36">
                    <Image
                      src="/images/neighborhoods/moda/hero-premium-2026.jpg"
                      alt={t("hero.imageAlt")}
                      fill
                      priority
                      sizes="100vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#14110f] via-[#14110f]/20 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-white/70">
                        {t("hero.ferryWorkdayBadge")}
                      </p>
                      <div className="mt-2 grid grid-cols-[1fr_auto_1fr] items-center gap-3 rounded-lg bg-white/90 px-3 py-2 text-[13px] font-semibold text-neutral-950 backdrop-blur-md">
                        <span>{t("hero.kadikoy")}</span>
                        <span className="h-px w-12 bg-primary-500/60" />
                        <span className="text-right">{t("hero.galata")}</span>
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
                  alt={t("hero.imageAlt")}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 520px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a2e]/75 via-[#1a1a2e]/10 to-transparent" />
                <div className="absolute left-4 top-4 rounded-md bg-[#14110f]/80 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.22em] text-white/75 backdrop-blur">
                  {t("hero.fieldCard.boardEyebrow")}
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-3 rounded-lg bg-white/90 px-4 py-3 text-sm font-semibold text-neutral-950 backdrop-blur-md dark:bg-[#14110f]/90 dark:text-[#f2f3f4]">
                    <span>{t("hero.kadikoy")}</span>
                    <span className="h-px flex-1 bg-primary-500/45" />
                    <span className="text-center">{t("hero.karakoy")}</span>
                    <span className="h-px flex-1 bg-primary-500/45" />
                    <span>{t("hero.galata")}</span>
                  </div>
                </div>
              </div>

              <div className="p-5 sm:p-6">
                <div className="flex items-center justify-between gap-4 border-b border-black/10 pb-4 dark:border-white/10">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-primary-700 dark:text-primary-300">
                      {t("hero.fieldCard.eyebrow")}
                    </p>
                    <h2 className="mt-2 font-display text-2xl font-extrabold text-neutral-950 dark:text-[#f2f3f4]">
                      {t("hero.fieldCard.title")}
                    </h2>
                  </div>
                  <div className="rounded-lg border border-black/10 px-3 py-2 text-right dark:border-white/10">
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500 dark:text-[#94877d]">
                      {t("hero.fieldCard.tzLabel")}
                    </p>
                    <p className="text-sm font-semibold text-neutral-950 dark:text-[#f2f3f4]">
                      {t("hero.fieldCard.tzValue")}
                    </p>
                  </div>
                </div>

                <div className="mt-5 space-y-4">
                  {heroRouteSteps.map((step, index) => (
                    <div
                      key={step.key}
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
                          {t(`hero.routeSteps.${step.key}.title`)}
                        </h3>
                        <p className="mt-1 text-sm leading-6 text-[#5d6d7e] dark:text-[#b7aaa0]">
                          {t(`hero.routeSteps.${step.key}.detail`)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Link
                  href="/guides"
                  className="mt-6 inline-flex items-center gap-2 border-t border-black/10 pt-4 text-sm font-semibold text-primary-700 transition-colors hover:text-primary-900 dark:border-white/10 dark:text-primary-300 dark:hover:text-primary-100"
                >
                  {t("hero.fieldCard.openGuide")}
                  <MoveUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <IstanbulTodayWidget />

      <section className="border-b border-black/10 bg-[#fbfaf8] py-10 dark:border-white/10 dark:bg-[#14110f]">
        <Container>
          <div className="grid gap-6 lg:grid-cols-[0.88fr_1.12fr] lg:items-end">
            <div>
              <p className="eyebrow">{t("firstWeekTool.eyebrow")}</p>
              <h2 className="mt-3 max-w-xl font-display text-h2 text-neutral-950 dark:text-[#f2f3f4]">
                {t("firstWeekTool.title")}
              </h2>
            </div>
            <div className="grid gap-5 sm:grid-cols-[1fr_auto] sm:items-end">
              <p className="max-w-2xl text-sm leading-7 text-[#5d6d7e] dark:text-[#b7aaa0]">
                {t("firstWeekTool.body")}
              </p>
              <Link
                href="/tools/first-week-planner"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-neutral-950 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-neutral-800 dark:bg-[#f2f3f4] dark:text-[#14110f] dark:hover:bg-[#d8d0c8]"
              >
                {t("firstWeekTool.cta")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-b border-black/10 py-9 dark:border-white/10">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[0.9fr_2fr] lg:items-end">
            <p className="max-w-md text-sm leading-6 text-[#5d6d7e] dark:text-[#b7aaa0]">
              {t("stats.intro")}
            </p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  value: t("stats.growing"),
                  label: t("stats.growingLabel"),
                  icon: Users,
                },
                {
                  value: t("stats.weekly"),
                  label: t("stats.weeklyLabel"),
                  icon: CalendarDays,
                },
                {
                  value: t("stats.guides"),
                  label: t("stats.guidesLabel"),
                  icon: Globe,
                },
                {
                  value: t("stats.neighborhoods"),
                  label: t("stats.neighborhoodsLabel"),
                  icon: MapPin,
                },
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

      <NeighborhoodRhythmMatcher />

      <section className="py-16 lg:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr]">
            <Reveal className="lg:sticky lg:top-24 lg:self-start">
              <p className="eyebrow">{t("events.eyebrow")}</p>
              <h2 className="mt-4 max-w-md font-display text-h1 text-neutral-950 dark:text-[#f2f3f4]">
                {t("events.title")}
              </h2>
              <p className="text-muted mt-5 max-w-md text-body-lg">
                {t("events.intro")}
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
                        {(event.id === "1" ||
                          event.id === "2" ||
                          event.id === "3") && (
                          <p className="mt-4 text-sm font-medium leading-6 text-neutral-950 dark:text-[#f2f3f4]">
                            {t(`events.moments.${event.id}`)}
                          </p>
                        )}
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
                          {event.capacity
                            ? t("events.spots", { capacity: event.capacity })
                            : t("events.openSpots")}
                        </div>
                      </div>
                    </div>
                  </Reveal>
                ))
              ) : (
                <Reveal className="border-y border-black/10 py-6 dark:border-white/10">
                  <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary-600 dark:text-primary-400">
                    {t("events.datesScheduledEyebrow")}
                  </p>
                  <h3 className="mt-3 font-display text-2xl font-extrabold text-[#1a1a2e] dark:text-[#f2f3f4]">
                    {t("events.datesScheduledTitle")}
                  </h3>
                  <p className="mt-3 max-w-xl text-sm leading-7 text-[#5d6d7e] dark:text-[#b7aaa0]">
                    {t("events.datesScheduledBody")}
                  </p>
                </Reveal>
              )}

              <Reveal delay={3}>
                <Link
                  href="/events"
                  className="group inline-flex items-center gap-2 font-medium text-neutral-950 transition-colors hover:text-primary-600 dark:text-[#f2f3f4] dark:hover:text-primary-400"
                >
                  {t("events.seeAll")}
                  <MoveUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
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
              <p className="eyebrow">{t("cityGuides.eyebrow")}</p>
              <h2 className="mt-4 max-w-lg font-display text-h1 text-neutral-950 dark:text-[#f2f3f4]">
                {t("cityGuides.title")}
              </h2>
              <p className="text-muted mt-5 max-w-md text-body-lg">
                {t("cityGuides.intro")}
              </p>
              <p className="mt-5 max-w-md text-sm leading-7 text-[#5d6d7e] dark:text-[#b7aaa0]">
                {t("cityGuides.subIntro")}
              </p>
            </Reveal>

            <div className="space-y-4">
              <Reveal delay={1} className="flex flex-wrap gap-3">
                {orientationLinkKeys.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-lg border border-black/10 bg-white/45 px-4 py-2 text-sm text-neutral-700 transition-colors hover:border-primary-500/40 hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-[#b7aaa0] dark:hover:border-primary-400/40 dark:hover:bg-white/10"
                  >
                    {t(`cityGuides.orientation.${item.key}`)}
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
                          {tGuides(`${guide.slug}.title`)}
                        </h3>
                        <p className="mt-2 max-w-xl text-sm leading-7 text-[#5d6d7e] dark:text-[#b7aaa0]">
                          {tGuides(`${guide.slug}.description`)}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="mt-1 h-5 w-5 shrink-0 text-neutral-400 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1 group-hover:text-primary-600 dark:group-hover:text-primary-400" />
                  </Link>
                </Reveal>
              ))}

              <Reveal delay={4}>
                <div className="border-t border-black/10 pt-6 dark:border-white/10">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="eyebrow">
                        {t("cityGuides.fastAnswersEyebrow")}
                      </p>
                      <p className="mt-2 text-lg font-medium text-[#1a1a2e] dark:text-[#f2f3f4]">
                        {t("cityGuides.fastAnswersBody")}
                      </p>
                    </div>
                    <Link
                      href="/guides"
                      className="inline-flex items-center gap-2 text-sm font-medium text-neutral-950 transition-colors hover:text-primary-600 dark:text-[#f2f3f4] dark:hover:text-primary-400"
                    >
                      {t("cityGuides.browseAll")}
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
                {t("firstMonth.eyebrow")}
              </p>
              <h2 className="mt-4 max-w-md font-display text-h1 text-neutral-950 dark:text-[#f2f3f4]">
                {t("firstMonth.title")}
              </h2>
              <p className="mt-5 max-w-md text-base leading-8 text-[#5d6d7e] dark:text-[#b7aaa0]">
                {t("firstMonth.body")}
              </p>

              <div className="mt-8 space-y-4">
                {orientationLinkKeys.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center justify-between border-t border-black/10 pt-4 text-left text-neutral-950 transition-colors hover:text-primary-700 dark:border-white/10 dark:text-[#f2f3f4] dark:hover:text-primary-300"
                  >
                    <span className="text-base font-medium">
                      {t(`cityGuides.orientation.${item.key}`)}
                    </span>
                    <MoveUpRight className="h-4 w-4 shrink-0" />
                  </Link>
                ))}
              </div>
            </Reveal>

            <div className="grid gap-4 sm:grid-cols-3">
              {phaseKeys.map((key, index) => (
                <Reveal key={key} delay={index as 0 | 1 | 2}>
                  <div className="surface-panel flex h-full flex-col justify-between rounded-md p-6 transition-transform duration-300 hover:-translate-y-0.5">
                    <div>
                      <p className="eyebrow">{t(`phases.${key}.phase`)}</p>
                      <h3 className="mt-4 font-display text-lg font-extrabold text-[#1a1a2e] dark:text-[#f2f3f4]">
                        {t(`phases.${key}.title`)}
                      </h3>
                      <p className="mt-3 text-base leading-8 text-[#526e89] dark:text-[#b7aaa0]">
                        {t(`phases.${key}.description`)}
                      </p>
                    </div>
                    <footer className="mt-8 border-t border-black/10 pt-4 dark:border-white/10">
                      <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-neutral-500 dark:text-[#85929e]">
                        {t(`phases.${key}.tag`)}
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
                {t("whyStay.eyebrow")}
              </p>
              <h2 className="mt-4 max-w-md font-display text-h1 text-neutral-950 dark:text-[#f2f3f4]">
                {t("whyStay.title")}
              </h2>
              <p className="mt-5 max-w-md text-base leading-8 text-[#5d6d7e] dark:text-[#b7aaa0]">
                {t("whyStay.body")}
              </p>

              <div className="mt-8 space-y-4">
                {whyStayItems.map((item) => (
                  <div
                    key={item.titleKey}
                    className="border-t border-black/10 pt-4 dark:border-white/10"
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                      <h3 className="text-lg font-medium text-neutral-950 dark:text-[#f2f3f4]">
                        {t(`whyStay.items.${item.titleKey}.title`)}
                      </h3>
                    </div>
                    <p className="mt-2 text-sm leading-7 text-[#5d6d7e] dark:text-[#b7aaa0]">
                      {t(`whyStay.items.${item.titleKey}.description`)}
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
                <p className="eyebrow">{t("whyStay.card.eyebrow")}</p>
                <h3 className="mt-4 max-w-lg font-display text-h2 text-primary-950 dark:text-primary-100">
                  {t("whyStay.card.title")}
                </h3>
                <p className="mt-4 max-w-xl text-base leading-8 text-[#5d6d7e] dark:text-[#b7aaa0]">
                  {t("whyStay.card.body")}
                </p>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {whyStayBulletKeys.map((key) => (
                  <div
                    key={key}
                    className="surface-subtle rounded-md p-4 text-sm leading-7 text-[#5d6d7e] transition-transform duration-300 hover:-translate-y-0.5 dark:text-[#b7aaa0]"
                  >
                    {t(`whyStay.card.bullets.${key}`)}
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
                  {t("joinCta.eyebrow")}
                </p>
                <h2 className="mt-4 max-w-3xl font-display text-h1 text-neutral-950 dark:text-[#f2f3f4]">
                  {t("joinCta.title")}
                </h2>
                <p className="mt-5 max-w-xl text-body-lg text-[#5d6d7e] dark:text-[#b7aaa0]">
                  {t("joinCta.body")}
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
                    {t("joinCta.joinTelegram")}
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </a>
                <Link href="/about" className="flex-1 sm:flex-none">
                  <Button
                    variant="secondary"
                    size="lg"
                    className="h-12 w-full rounded-lg px-7 text-base font-medium sm:w-auto"
                  >
                    {t("joinCta.aboutCommunity")}
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
