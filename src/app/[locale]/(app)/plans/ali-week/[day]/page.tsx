import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { ArrowLeft, ArrowRight, MapPin, Play, Users } from "lucide-react";
import { Link } from "@/lib/i18n/routing";
import { Container } from "@/components/ui/container";
import { PlanVibeIcon } from "@/components/sections/plans/plan-vibe-icon";
import { PlanDetailMapLazy } from "@/components/sections/plans/plan-detail-map-lazy";
import { VerificationBadge } from "@/components/ui/verification-badge";
import { defaultLocale, isValidLocale, type Locale } from "@/lib/i18n/config";
import { alternatesFor, localeUrl } from "@/lib/seo";
import { aliMember, aliWeek } from "@/lib/ali-week";
import {
  aliDayToPlanCard,
  aliDaySlugs,
  daySlug,
  getAliDayBySlug,
} from "@/lib/ali-week-plans";

export function generateStaticParams() {
  return aliDaySlugs.map((day) => ({ day }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; day: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale, day: daySlugParam } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : defaultLocale;
  const day = getAliDayBySlug(daySlugParam);
  if (!day) return {};
  const title = `${day.title} - ${aliMember.name}'s ${day.weekday}`;
  const description = day.blurb;
  const path = `/plans/ali-week/${daySlug(day)}`;
  return {
    title,
    description,
    alternates: alternatesFor(locale, path),
    openGraph: {
      title,
      description,
      url: localeUrl(locale, path),
      type: "article",
    },
  };
}

function formatTime(start: string | null, end: string | null): string {
  if (!start) return "";
  const s = start.slice(0, 5);
  if (!end) return s;
  return `${s} - ${end.slice(0, 5)}`;
}

export default async function AliWeekDayPage({
  params,
}: {
  params: Promise<{ locale: string; day: string }>;
}) {
  const { locale: rawLocale, day: daySlugParam } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : defaultLocale;
  const day = getAliDayBySlug(daySlugParam);
  if (!day) notFound();

  const t = await getTranslations({ locale, namespace: "plans" });
  const tVerifyLevels = await getTranslations({
    locale,
    namespace: "verification.levels",
  });
  const tVerifyTooltips = await getTranslations({
    locale,
    namespace: "verification.tooltips",
  });

  const plan = aliDayToPlanCard(day);
  const dateFmt = new Intl.DateTimeFormat(locale, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  // Prev/next within the week, wrapping Sun -> Mon for a continuous loop.
  const idx = aliWeek.findIndex((d) => d.day === day.day);
  const prev = aliWeek[(idx - 1 + aliWeek.length) % aliWeek.length]!;
  const next = aliWeek[(idx + 1) % aliWeek.length]!;

  return (
    <article className="bg-ink-0 pb-20">
      <section className="border-b border-ink-3 bg-ink-1 py-12 lg:py-16">
        <Container className="max-w-3xl">
          <Link
            href="/plans/ali-week"
            className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-paper-mute transition-colors hover:text-paper"
          >
            <ArrowLeft className="h-3 w-3" aria-hidden />
            {`${aliMember.name}'s week`}
          </Link>

          <p className="mt-4 font-mono text-[11px] uppercase tracking-wider text-paper-mute">
            {dateFmt.format(new Date(`${day.date}T12:00:00Z`))} ·{" "}
            {day.neighborhood}
          </p>

          <h1 className="mt-2 max-w-2xl font-display text-h1 text-paper">
            {day.title}
          </h1>

          <p className="mt-4 max-w-2xl text-lede leading-relaxed text-paper-dim">
            {day.blurb}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-paper-dim">
            <span className="inline-flex items-center gap-2">
              <MapPin className="h-4 w-4 text-terracotta" aria-hidden />
              {t("stops", { count: day.stops.length })}
            </span>
            <Link
              href="/plans/ali-week"
              className="inline-flex items-center gap-2 text-terracotta transition-colors hover:text-paper"
            >
              <Play className="h-4 w-4" aria-hidden />
              Watch the week animated
            </Link>
          </div>

          {/* Host card - Ali Sameni */}
          <div className="mt-8 flex flex-wrap items-center gap-4 rounded-xl border border-ink-3 bg-ink-2 p-4">
            <span
              aria-hidden
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink-3 font-display text-sm text-paper-mute"
            >
              {aliMember.name
                .split(/\s+/)
                .map((p) => p[0])
                .slice(0, 2)
                .join("")}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-paper">
                  {aliMember.name}
                </p>
                <VerificationBadge
                  level="verified"
                  label={tVerifyLevels("verified")}
                  tooltip={tVerifyTooltips("verified")}
                />
              </div>
              <p className="font-mono text-[10px] uppercase tracking-wider text-paper-mute">
                {aliMember.bio}
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Map of the day's stops */}
      <Container className="max-w-3xl pt-8">
        <PlanDetailMapLazy stops={plan.stops} />
      </Container>

      {/* Stops timeline */}
      <Container className="max-w-3xl py-10">
        <h2 className="font-mono text-[11px] uppercase tracking-wider text-paper-mute">
          {t("stops", { count: day.stops.length })}
        </h2>
        <ol className="mt-5 space-y-3" aria-label="Plan stops">
          {plan.stops.map((stop, i) => (
            <li key={stop.id} className="border border-ink-3 bg-ink-1">
              <div className="flex gap-4 p-4">
                <span
                  aria-hidden
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-terracotta font-mono text-sm font-semibold text-[#06101f]"
                >
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="font-display text-h3 leading-tight text-paper">
                      {stop.custom_location}
                    </p>
                    {formatTime(stop.start_time, stop.end_time) && (
                      <span
                        className="font-mono text-[11px] uppercase tracking-wider text-terracotta"
                        dir="ltr"
                      >
                        {formatTime(stop.start_time, stop.end_time)}
                      </span>
                    )}
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-paper-dim">
                    <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-paper-mute">
                      <PlanVibeIcon
                        vibe={stop.vibe}
                        className="h-3 w-3 text-terracotta"
                      />
                      {t(`vibes.${stop.vibe}`)}
                    </span>
                    {stop.neighborhood_slug && (
                      <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-paper-mute">
                        <MapPin className="h-3 w-3" aria-hidden />
                        {stop.neighborhood_slug}
                      </span>
                    )}
                  </div>
                  {stop.notes && (
                    <p className="mt-3 whitespace-pre-wrap text-sm text-paper-dim">
                      {stop.notes}
                    </p>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </Container>

      {/* Prev / next day */}
      <Container className="max-w-3xl">
        <nav
          className="flex items-stretch justify-between gap-3 border-t border-ink-3 pt-6"
          aria-label="Other days this week"
        >
          <Link
            href={`/plans/ali-week/${daySlug(prev)}`}
            className="group flex flex-1 flex-col gap-1 rounded-lg border border-ink-3 bg-ink-1 p-4 transition-colors hover:border-terracotta"
          >
            <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-paper-mute">
              <ArrowLeft className="h-3 w-3" aria-hidden />
              {prev.weekday} · {prev.neighborhood}
            </span>
            <span className="text-sm text-paper">{prev.title}</span>
          </Link>
          <Link
            href={`/plans/ali-week/${daySlug(next)}`}
            className="group flex flex-1 flex-col items-end gap-1 rounded-lg border border-ink-3 bg-ink-1 p-4 text-right transition-colors hover:border-terracotta"
          >
            <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-paper-mute">
              {next.weekday} · {next.neighborhood}
              <ArrowRight className="h-3 w-3" aria-hidden />
            </span>
            <span className="text-sm text-paper">{next.title}</span>
          </Link>
        </nav>
        <p className="mt-6 inline-flex items-center gap-2 text-sm text-paper-dim">
          <Users className="h-4 w-4 text-terracotta" aria-hidden />
          Want to share your own week?{" "}
          <Link
            href="/plans/new"
            className="text-terracotta transition-colors hover:text-paper"
          >
            Post a plan
          </Link>
        </p>
      </Container>
    </article>
  );
}
