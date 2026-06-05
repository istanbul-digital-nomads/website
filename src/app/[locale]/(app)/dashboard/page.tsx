import type { Metadata } from "next";
import { Suspense } from "react";
import { Link } from "@/lib/i18n/routing";
import { redirect } from "next/navigation";
import { getCachedTranslations } from "@/lib/i18n/cache-translations";
import { getCurrentMember, getMyRSVPdEvents } from "@/lib/supabase/queries";
import { getMyAttendedPlans, getMyHostedPlans } from "@/lib/plans/queries";
import { getMemberActivity } from "@/lib/member-activity";
import { computeBadges, nextTierProgress, BADGE_ICONS } from "@/lib/badges";
import { deriveXp } from "@/lib/xp";
import { isValidLocale, defaultLocale, type Locale } from "@/lib/i18n/config";
import { Container } from "@/components/ui/container";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { VerificationBadge } from "@/components/ui/verification-badge";
import { isVerificationLevel } from "@/lib/verification";
import { isHostRole } from "@/lib/member-roles";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

export default function DashboardPage(props: {
  params: Promise<{ locale: string }>;
}) {
  return (
    <Suspense fallback={null}>
      <DashboardContent {...props} />
    </Suspense>
  );
}

async function DashboardContent({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : defaultLocale;

  const { data: member } = await getCurrentMember();
  if (!member) {
    redirect("/login?next=/dashboard");
  }

  const t = getCachedTranslations(locale, "membersV2.dashboard");
  const tVerify = getCachedTranslations(locale, "verification.page");
  const tVerifyLevels = getCachedTranslations(locale, "verification.levels");
  const tVerifyTooltips = getCachedTranslations(
    locale,
    "verification.tooltips",
  );

  // Phase 3: surface verification status when the member is in a role
  // where it matters (host roles or is_agent). Plain Red-badge nomads
  // don't need to see "you're not verified" - they can't charge anyway.
  const verificationLevel = isVerificationLevel(member.verification_level)
    ? member.verification_level
    : "basic";
  const showVerification =
    isHostRole(member.member_type as never) || member.is_agent === true;

  // Profile completeness from real fields only - a gentle nudge, not a score.
  const fields: [string, boolean][] = [
    [t("fields.bio"), Boolean(member.bio)],
    [t("fields.location"), Boolean(member.location)],
    [t("fields.profession"), Boolean(member.profession)],
    [t("fields.skills"), Boolean(member.skills && member.skills.length > 0)],
    [
      t("fields.languages"),
      Boolean(member.languages && member.languages.length > 0),
    ],
    [t("fields.visible"), member.is_visible],
  ];
  const done = fields.filter(([, ok]) => ok).length;

  // Plans the member joined + events they RSVP'd to. This is the only place
  // a member can get back to a plan they attended (the /plans feed only shows
  // active, upcoming plans) - and the path to leave a review on ended ones.
  const [attendedPlans, hostedPlans, rsvpEvents, activity] = await Promise.all([
    getMyAttendedPlans(),
    getMyHostedPlans(),
    getMyRSVPdEvents(),
    getMemberActivity(member.id),
  ]);
  // eslint-disable-next-line react-hooks/purity -- async server component, response is per-request
  const nowMs = Date.now();
  const upcomingPlans = attendedPlans.filter(
    (p) => !p.ended && p.status === "active",
  );
  const pastPlans = attendedPlans.filter((p) => p.ended);
  const upcomingHosted = hostedPlans.filter((p) => !p.ended);
  const pastHosted = hostedPlans.filter((p) => p.ended);
  const upcomingEvents = rsvpEvents.filter(
    (e) => new Date(e.date).getTime() >= nowMs,
  );

  // XP + badges, computed on read from the same plan activity. `todayIstanbul`
  // is derived once here so the badge math stays a pure call.
  const todayIstanbul = new Date(nowMs).toLocaleDateString("en-CA", {
    timeZone: "Europe/Istanbul",
  });
  const xp = deriveXp({
    hostedCount: activity.trustSignals.hostedCount,
    joinedCount: activity.trustSignals.joinedCount,
  });
  const badges = computeBadges({
    planCount: activity.totalPlanCount,
    firstAttendedDate: activity.trustSignals.firstAttendedDate,
    manualBadgeSlugs: activity.manualBadgeSlugs,
    todayIstanbul,
  });
  const nextBadge = nextTierProgress(activity.totalPlanCount);
  const dateFmt = new Intl.DateTimeFormat(locale, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  const fmtDay = (d: string) => dateFmt.format(new Date(`${d}T12:00:00Z`));

  // Profile editing, verification, and payouts now live in the dashboard
  // sub-nav, so these quick-links focus on exploring the rest of the app.
  const links: [string, string][] = [
    [t("links.profile"), `/members/${member.id}`],
    [t("links.plans"), "/plans"],
    [t("links.sharePlan"), "/plans/new"],
    [t("links.directory"), "/members"],
    [t("links.events"), "/events"],
    [t("links.paperwork"), "/paperwork"],
  ];

  return (
    <section className="bg-ink-1 pt-16 lg:pt-24">
      <Container>
        {/* Masthead */}
        <SectionEyebrow num="N° 01" label={t("eyebrow")} />
        <h1 className="mt-8 font-display text-h1 leading-none text-paper lg:text-display-lg">
          {t("greeting", { name: member.display_name })}
        </h1>
        <p className="mt-6 font-mono text-[12px] uppercase tracking-wider text-paper-mute">
          {[member.profession, member.location].filter(Boolean).join(" · ") ||
            t("noMeta")}
        </p>

        {showVerification ? (
          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border border-ink-3 bg-ink-2 p-5">
            <div className="flex items-center gap-3">
              <VerificationBadge
                level={verificationLevel}
                label={tVerifyLevels(verificationLevel)}
                tooltip={tVerifyTooltips(verificationLevel)}
                size="md"
                showBasic
              />
              <span className="text-sm text-paper-dim">
                {tVerifyTooltips(verificationLevel)}
              </span>
            </div>
            <Link
              href="/dashboard/verify"
              className="inline-flex items-center gap-1.5 rounded-full bg-terracotta px-4 py-2 text-sm font-medium text-[#06101f] transition-colors hover:bg-terracotta-dim"
            >
              {verificationLevel === "basic"
                ? tVerify("title")
                : tVerify("currentLabel")}
              <span className="inline-dir-arrow" aria-hidden />
            </Link>
          </div>
        ) : null}

        {/* XP + badges: a light engagement strip. Always visible (even at
            0 XP) so a new member sees what there is to earn. */}
        <div className="mt-10 border border-ink-3 bg-ink-2 p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-baseline gap-3">
              <h2 className="font-mono text-[11px] uppercase tracking-wider text-terracotta">
                {t("badges.eyebrow")}
              </h2>
              <span className="font-mono text-sm tabular-nums text-paper">
                {t("badges.xp", { xp })}
              </span>
            </div>
            {nextBadge ? (
              <span className="font-mono text-[10px] uppercase tracking-wider text-paper-faint">
                {t("badges.nextHint", { count: nextBadge.remaining })}
              </span>
            ) : null}
          </div>
          {badges.length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {badges.map((slug) => (
                <span
                  key={slug}
                  className="inline-flex items-center gap-1.5 rounded-full bg-terracotta/15 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-terracotta"
                >
                  <span aria-hidden>{BADGE_ICONS[slug]}</span>
                  {t(`badges.${slug}`)}
                </span>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-paper-dim">{t("badges.none")}</p>
          )}
        </div>

        <div className="mt-10 grid gap-8 pb-24 lg:grid-cols-[1.4fr_1fr] lg:items-start">
          {/* Profile completeness */}
          <div className="border border-ink-3 bg-ink-2 p-7">
            <div className="flex items-baseline justify-between">
              <h2 className="font-mono text-[11px] uppercase tracking-wider text-terracotta">
                {t("profileEyebrow")}
              </h2>
              <span className="font-mono text-sm tabular-nums text-paper">
                {done}
                <span className="text-paper-faint">/{fields.length}</span>
              </span>
            </div>
            <ul className="mt-5">
              {fields.map(([label, ok]) => (
                <li
                  key={label}
                  className="flex items-center justify-between border-b border-ink-3 py-2.5"
                >
                  <span className="text-sm text-paper-dim">{label}</span>
                  <span
                    className={`font-mono text-[10px] uppercase tracking-wider ${
                      ok ? "text-moss" : "text-paper-faint"
                    }`}
                  >
                    {ok ? t("done") : t("todo")}
                  </span>
                </li>
              ))}
            </ul>
            {done < fields.length ? (
              <Link
                href="/dashboard/profile"
                className="mt-6 inline-flex items-center gap-1.5 border-b border-terracotta pb-0.5 text-sm text-terracotta"
              >
                {t("completeProfile")}{" "}
                <span className="inline-dir-arrow" aria-hidden />
              </Link>
            ) : null}
          </div>

          {/* Quick links */}
          <div className="border border-ink-3 bg-ink-2 p-7">
            <h2 className="font-mono text-[11px] uppercase tracking-wider text-terracotta">
              {t("linksEyebrow")}
            </h2>
            <ul className="mt-4">
              {links.map(([label, href]) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="flex items-center justify-between border-b border-ink-3 py-3 text-sm text-paper transition-colors hover:text-terracotta"
                  >
                    {label}
                    <span className="inline-dir-arrow" aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Your activity: plans joined + events RSVP'd. The one place to get
            back to an attended plan and review it once it's ended. */}
        <div className="pb-24">
          <div className="flex items-baseline gap-3">
            <span className="font-mono text-[11px] uppercase tracking-wider text-paper-faint">
              N° 02
            </span>
            <h2 className="font-mono text-[11px] uppercase tracking-wider text-terracotta">
              {t("activity.eyebrow")}
            </h2>
          </div>

          <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:items-start">
            {/* Plans */}
            <div className="border border-ink-3 bg-ink-2 p-7">
              <h3 className="font-mono text-[11px] uppercase tracking-wider text-paper-mute">
                {t("activity.plansTitle")}
              </h3>
              {attendedPlans.length === 0 ? (
                <p className="mt-4 text-sm text-paper-dim">
                  {t("activity.plansEmpty")}{" "}
                  <Link
                    href="/plans"
                    className="border-b border-terracotta pb-0.5 text-terracotta"
                  >
                    {t("activity.browsePlans")}
                  </Link>
                </p>
              ) : (
                <ul className="mt-4 divide-y divide-ink-3 border-t border-ink-3">
                  {[...upcomingPlans, ...pastPlans].map((p) => (
                    <li
                      key={p.id}
                      className="flex items-center justify-between gap-3 py-3"
                    >
                      <Link
                        href={`/plans/${p.id}`}
                        className="min-w-0 flex-1 text-sm text-paper transition-colors hover:text-terracotta"
                      >
                        <span className="block truncate">{p.title}</span>
                        <span className="font-mono text-[10px] uppercase tracking-wider text-paper-faint">
                          {fmtDay(p.scheduled_date)}
                          {p.status === "cancelled"
                            ? ` · ${t("activity.cancelled")}`
                            : p.ended
                              ? ` · ${t("activity.past")}`
                              : ` · ${t("activity.upcoming")}`}
                        </span>
                      </Link>
                      {p.ended && p.status !== "cancelled" ? (
                        <Link
                          href={`/plans/${p.id}#reviews`}
                          className="shrink-0 whitespace-nowrap font-mono text-[10px] uppercase tracking-wider text-moss transition-colors hover:text-paper"
                        >
                          {p.reviewed
                            ? t("activity.reviewed")
                            : t("activity.leaveReview")}
                        </Link>
                      ) : null}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Events */}
            <div className="border border-ink-3 bg-ink-2 p-7">
              <h3 className="font-mono text-[11px] uppercase tracking-wider text-paper-mute">
                {t("activity.eventsTitle")}
              </h3>
              {rsvpEvents.length === 0 ? (
                <p className="mt-4 text-sm text-paper-dim">
                  {t("activity.eventsEmpty")}{" "}
                  <Link
                    href="/events"
                    className="border-b border-terracotta pb-0.5 text-terracotta"
                  >
                    {t("activity.browseEvents")}
                  </Link>
                </p>
              ) : (
                <ul className="mt-4 divide-y divide-ink-3 border-t border-ink-3">
                  {rsvpEvents.map((e) => {
                    const past = new Date(e.date).getTime() < nowMs;
                    return (
                      <li key={e.id} className="py-3">
                        <Link
                          href={`/events/${e.id}`}
                          className="block text-sm text-paper transition-colors hover:text-terracotta"
                        >
                          <span className="block truncate">{e.title}</span>
                          <span className="font-mono text-[10px] uppercase tracking-wider text-paper-faint">
                            {dateFmt.format(new Date(e.date))}
                            {past
                              ? ` · ${t("activity.past")}`
                              : ` · ${t("activity.upcoming")}`}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
              {upcomingEvents.length > 0 ? (
                <p className="mt-4 font-mono text-[10px] uppercase tracking-wider text-paper-faint">
                  {t("activity.upcomingCount", {
                    count: upcomingEvents.length,
                  })}
                </p>
              ) : null}
            </div>
          </div>
        </div>

        {/* Plans you've hosted: the host-side history. The only place to get
            back to a plan you ran once it's dropped off the active feed. */}
        <div className="pb-24">
          <div className="flex items-baseline gap-3">
            <span className="font-mono text-[11px] uppercase tracking-wider text-paper-faint">
              N° 03
            </span>
            <h2 className="font-mono text-[11px] uppercase tracking-wider text-terracotta">
              {t("hosted.eyebrow")}
            </h2>
          </div>

          <div className="mt-6 border border-ink-3 bg-ink-2 p-7">
            {hostedPlans.length === 0 ? (
              <p className="text-sm text-paper-dim">
                {t("hosted.empty")}{" "}
                <Link
                  href="/plans/new"
                  className="border-b border-terracotta pb-0.5 text-terracotta"
                >
                  {t("hosted.share")}
                </Link>
              </p>
            ) : (
              <ul className="divide-y divide-ink-3">
                {[...upcomingHosted, ...pastHosted].map((p) => (
                  <li
                    key={p.id}
                    className="flex items-center justify-between gap-3 py-3 first:pt-0"
                  >
                    <Link
                      href={`/plans/${p.id}`}
                      className="min-w-0 flex-1 text-sm text-paper transition-colors hover:text-terracotta"
                    >
                      <span className="block truncate">{p.title}</span>
                      <span className="font-mono text-[10px] uppercase tracking-wider text-paper-faint">
                        {fmtDay(p.scheduled_date)}
                        {p.status === "cancelled"
                          ? ` · ${t("activity.cancelled")}`
                          : p.ended
                            ? ` · ${t("activity.past")}`
                            : ` · ${t("activity.upcoming")}`}
                      </span>
                    </Link>
                    <span className="shrink-0 whitespace-nowrap font-mono text-[10px] uppercase tracking-wider text-paper-mute">
                      {t("hosted.going", { count: p.attendee_count })}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
