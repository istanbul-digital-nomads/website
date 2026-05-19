import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getCachedTranslations } from "@/lib/i18n/cache-translations";
import { getMemberByIdPublic } from "@/lib/supabase/queries";
import { isValidLocale, defaultLocale, type Locale } from "@/lib/i18n/config";
import { Container } from "@/components/ui/container";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { Tag } from "@/components/ui/tag";
import { MemberPlansToday } from "@/components/sections/plans/member-plans-today";
import { RoleBadge } from "@/components/ui/role-badge";
import { VerificationBadge } from "@/components/ui/verification-badge";
import { isVerificationLevel } from "@/lib/verification";
import { isCurrentStatus, STATUS_TONE } from "@/lib/member-profile";
import { getMemberActivity } from "@/lib/member-activity";
import { neighborhoods as ALL_HOODS } from "@/lib/neighborhoods";

interface Props {
  params: Promise<{ locale: string; id: string }>;
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { id } = await props.params;
  const { data: member } = await getMemberByIdPublic(id);
  if (!member) return {};
  return {
    title: member.display_name,
    description: member.bio?.slice(0, 160) ?? member.display_name,
  };
}

export default async function MemberProfilePage(props: Props) {
  return (
    <Suspense fallback={null}>
      <MemberProfileContent {...props} />
    </Suspense>
  );
}

async function MemberProfileContent(props: Props) {
  const { locale: rawLocale, id } = await props.params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : defaultLocale;
  const { data: member } = await getMemberByIdPublic(id);
  if (!member) notFound();

  const t = getCachedTranslations(locale, "membersV2");
  const tRoles = getCachedTranslations(
    locale,
    "onboardingPage.steps.interests.memberTypeOptions",
  );
  const tVerifyLevels = getCachedTranslations(locale, "verification.levels");
  const tVerifyTooltips = getCachedTranslations(
    locale,
    "verification.tooltips",
  );
  const tStatusOptions = getCachedTranslations(
    locale,
    "onboardingPage.steps.interests.currentStatusOptions",
  );
  const initial = (member.display_name || "?").trim().charAt(0).toUpperCase();
  const roleLabel = member.member_type ? tRoles(member.member_type) : "";
  const verificationLevel = isVerificationLevel(member.verification_level)
    ? member.verification_level
    : "basic";
  const currentStatus = isCurrentStatus(member.current_status)
    ? member.current_status
    : null;
  const activity = await getMemberActivity(member.id);
  const moveOutDate = member.planned_move_out_date
    ? new Date(member.planned_move_out_date)
    : null;
  const today = new Date();
  const isActiveThisWeek =
    activity.trustSignals.lastAttendedDate !== null &&
    today.getTime() -
      new Date(activity.trustSignals.lastAttendedDate).getTime() <=
      7 * 24 * 60 * 60 * 1000;
  const memberSinceLabel = t("profile.trustMemberSince", {
    when: new Intl.DateTimeFormat(locale, {
      month: "short",
      year: "numeric",
    }).format(new Date(member.created_at)),
  });
  const weeksLeft = moveOutDate
    ? Math.max(
        0,
        Math.round(
          (moveOutDate.getTime() - today.getTime()) / (7 * 24 * 60 * 60 * 1000),
        ),
      )
    : null;

  return (
    <section className="bg-ink-1 pt-12 lg:pt-16">
      <Container>
        <nav className="flex flex-wrap gap-2.5 font-mono text-[11px] uppercase tracking-wider text-paper-mute">
          <Link href="/members" className="hover:text-paper">
            {t("eyebrow")}
          </Link>
          <span>/</span>
          <span className="text-paper">{member.display_name}</span>
        </nav>

        <div className="mt-10 grid gap-12 pb-24 lg:grid-cols-[280px_1fr] lg:items-start">
          {/* Avatar + meta */}
          <div>
            <div className="relative aspect-square w-full overflow-hidden border border-ink-4 bg-ink-3">
              {member.avatar_url ? (
                <Image
                  src={member.avatar_url}
                  alt={member.display_name}
                  fill
                  sizes="280px"
                  className="object-cover"
                />
              ) : (
                <span className="absolute inset-0 grid place-items-center font-display text-7xl text-paper-faint">
                  {initial}
                </span>
              )}
            </div>
            {member.member_type ||
            member.is_agent ||
            verificationLevel !== "basic" ? (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                {member.member_type ? (
                  <RoleBadge
                    role={member.member_type}
                    label={roleLabel}
                    size="md"
                  />
                ) : null}
                <VerificationBadge
                  level={verificationLevel}
                  label={tVerifyLevels(verificationLevel)}
                  tooltip={tVerifyTooltips(verificationLevel)}
                  size="md"
                />
                {member.is_agent ? (
                  <Link
                    href={`/paperwork?host=${member.id}`}
                    className="inline-flex items-center rounded-full bg-moss/15 px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider text-moss transition-colors hover:bg-moss/25"
                  >
                    {t("agentBadge")}
                    <span className="ms-1 opacity-60" aria-hidden>
                      →
                    </span>
                  </Link>
                ) : null}
              </div>
            ) : null}
            <dl className="mt-5 border-t border-ink-3">
              {member.location ? (
                <Fact label={t("profile.location")} value={member.location} />
              ) : null}
              {member.member_type === "remote_worker" &&
              member.professional_role ? (
                <Fact
                  label={t("profile.profession")}
                  value={member.professional_role}
                />
              ) : member.profession ? (
                <Fact
                  label={t("profile.profession")}
                  value={member.profession}
                />
              ) : null}
              {member.member_type === "tour_guide" &&
              member.tour_guide_license_no ? (
                <Fact
                  label={t("profile.tourGuideLicense")}
                  value={member.tour_guide_license_no}
                />
              ) : null}
            </dl>
            {member.telegram_handle ? (
              <a
                href={`https://t.me/${member.telegram_handle.replace(/^@/, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex w-full items-center justify-center gap-1.5 bg-terracotta px-5 py-3.5 text-center text-sm font-medium text-ink-0 transition-colors duration-fast hover:bg-terracotta-dim"
              >
                {t("profile.reachOut")}{" "}
                <span className="inline-dir-arrow" aria-hidden />
              </a>
            ) : null}
          </div>

          {/* Editorial body - section per category */}
          <div>
            <SectionEyebrow num="N° 01" label={t("profile.aboutEyebrow")} />
            <h1 className="mt-6 font-display text-display-lg leading-none text-paper">
              {member.display_name}
            </h1>
            {currentStatus !== null ? (
              <StatusPip
                status={currentStatus}
                label={tStatusOptions(currentStatus)}
              />
            ) : null}
            {member.bio ? (
              <p className="mt-6 max-w-2xl text-lede leading-relaxed text-paper-dim">
                {member.bio}
              </p>
            ) : (
              <p className="mt-6 text-base text-paper-mute">
                {t("profile.noBio")}
              </p>
            )}

            {weeksLeft !== null ? (
              <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-ferry-yellow/10 px-3 py-1 text-[12px] text-ferry-yellow">
                <span
                  className="inline-block h-1.5 w-1.5 rounded-full bg-ferry-yellow"
                  aria-hidden
                />
                {weeksLeft === 0
                  ? t("profile.lastWeekHere")
                  : t("profile.weeksLeft", { count: weeksLeft })}
              </p>
            ) : null}

            {/* Stats strip - three numbers that make the profile feel alive. */}
            {activity.totalPlanCount > 0 ||
            activity.neighborhoodsVisited.length > 0 ||
            activity.coAttendees.length > 0 ? (
              <dl className="mt-8 flex max-w-md divide-x divide-ink-3 border border-ink-3 bg-ink-2/40">
                <StatBlock
                  num={activity.totalPlanCount}
                  label={t("profile.statPlans")}
                />
                <StatBlock
                  num={activity.neighborhoodsVisited.length}
                  label={t("profile.statHoods")}
                />
                <StatBlock
                  num={activity.coAttendees.length}
                  label={t("profile.statPeople")}
                />
              </dl>
            ) : null}

            {/* Trust signals - earned badge pills. Positive-only. */}
            <TrustPills
              trust={activity.trustSignals}
              isActiveThisWeek={isActiveThisWeek}
              labels={{
                memberSince: memberSinceLabel,
                reliableHost: t("profile.trustReliableHost"),
                allOnTime: t("profile.trustAllOnTime"),
                activeThisWeek: t("profile.trustActiveWeek"),
              }}
            />

            <MemberPlansToday memberId={member.id} locale={locale} />

            <ProfileChipSection
              num="N° 02"
              title={t("profile.workingOn")}
              tone="terracotta"
              chips={member.working_on}
            />
            <ProfileChipSection
              num="N° 03"
              title={t("profile.wantsToTalk")}
              tone="ferry-yellow"
              chips={member.wants_to_talk_about}
            />
            <ProfileChipSection
              num="N° 04"
              title={t("profile.hobbies")}
              tone="moss"
              chips={member.hobbies}
            />

            {activity.upcomingPlans.length > 0 ? (
              <div className="mt-10 border-t border-ink-3 pt-8">
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-paper-faint">
                    N° 05
                  </span>
                  <h2 className="font-mono text-[11px] uppercase tracking-wider text-sky-400">
                    {t("profile.upcomingPlans")}
                  </h2>
                </div>
                <ul className="mt-4 divide-y divide-ink-3 border-t border-ink-3">
                  {activity.upcomingPlans.map((p) => (
                    <li key={p.id}>
                      <Link
                        href={`/plans/${p.id}`}
                        className="grid grid-cols-[100px_1fr_auto_auto] items-center gap-3 py-3 transition-colors hover:bg-ink-2/40"
                      >
                        <span className="font-mono text-[10px] uppercase tracking-wider text-paper-mute">
                          {new Intl.DateTimeFormat(locale, {
                            month: "short",
                            day: "numeric",
                          }).format(new Date(p.scheduled_date))}
                        </span>
                        <span className="truncate text-[14px] text-paper">
                          {p.title}
                        </span>
                        <span
                          className={`rounded-full px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider ${
                            p.isHost
                              ? "bg-terracotta/20 text-terracotta"
                              : "bg-moss/15 text-moss"
                          }`}
                        >
                          {p.isHost
                            ? t("profile.hostingTag")
                            : t("profile.goingTag")}
                        </span>
                        {p.neighborhood_slug ? (
                          <span className="text-[11px] uppercase tracking-wider text-paper-faint">
                            {p.neighborhood_slug}
                          </span>
                        ) : (
                          <span aria-hidden />
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {activity.pastPlans.length > 0 ? (
              <div className="mt-10 border-t border-ink-3 pt-8">
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-paper-faint">
                    N° 06
                  </span>
                  <h2 className="font-mono text-[11px] uppercase tracking-wider text-terracotta">
                    {t("profile.pastPlans")}
                  </h2>
                </div>
                <ul className="mt-4 divide-y divide-ink-3 border-t border-ink-3">
                  {activity.pastPlans.map((p) => (
                    <li key={p.id}>
                      <Link
                        href={`/plans/${p.id}`}
                        className="grid grid-cols-[100px_1fr_auto] items-center gap-3 py-3 transition-colors hover:bg-ink-2/40"
                      >
                        <span className="font-mono text-[10px] uppercase tracking-wider text-paper-mute">
                          {new Intl.DateTimeFormat(locale, {
                            month: "short",
                            day: "numeric",
                          }).format(new Date(p.scheduled_date))}
                        </span>
                        <span className="truncate text-[14px] text-paper">
                          {p.title}
                        </span>
                        {p.neighborhood_slug ? (
                          <span className="text-[11px] uppercase tracking-wider text-paper-faint">
                            {p.neighborhood_slug}
                          </span>
                        ) : (
                          <span aria-hidden />
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {/* Neighborhood passport - shows ALL Istanbul hoods, with
                ones the member has visited highlighted. Cute gamified
                feel without being aggressive about it. */}
            {activity.neighborhoodsVisited.length > 0 ? (
              <div className="mt-10 border-t border-ink-3 pt-8">
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-paper-faint">
                    N° 07
                  </span>
                  <h2 className="font-mono text-[11px] uppercase tracking-wider text-ferry-yellow">
                    {t("profile.hoodPassport")}
                  </h2>
                  <span className="font-mono text-[11px] text-paper-faint">
                    {activity.neighborhoodsVisited.length} / {ALL_HOODS.length}
                  </span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {ALL_HOODS.map((h) => {
                    const visited = activity.neighborhoodsVisited.includes(
                      h.slug,
                    );
                    return (
                      <span
                        key={h.slug}
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] transition-colors ${
                          visited
                            ? "bg-ferry-yellow/15 text-ferry-yellow"
                            : "border border-ink-3 text-paper-faint"
                        }`}
                      >
                        {visited ? <span aria-hidden>✓</span> : null}
                        {h.name}
                      </span>
                    );
                  })}
                </div>
              </div>
            ) : null}

            {activity.coAttendees.length > 0 ? (
              <div className="mt-10 border-t border-ink-3 pt-8">
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-paper-faint">
                    N° 08
                  </span>
                  <h2 className="font-mono text-[11px] uppercase tracking-wider text-moss">
                    {t("profile.peopleMet")}
                  </h2>
                </div>
                <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                  {activity.coAttendees.map((m) => (
                    <li key={m.id}>
                      <Link
                        href={`/members/${m.id}`}
                        className="flex items-center gap-3 rounded-md border border-ink-3 bg-ink-2/40 p-2.5 transition-colors hover:border-moss/40 hover:bg-ink-2/70"
                      >
                        {m.avatar_url ? (
                          <Image
                            src={m.avatar_url}
                            alt=""
                            width={32}
                            height={32}
                            className="rounded-full"
                          />
                        ) : (
                          <span className="inline-block h-8 w-8 rounded-full bg-ink-3" />
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-[13px] text-paper">
                            {m.display_name}
                          </div>
                          <div className="font-mono text-[10px] uppercase tracking-wider text-paper-faint">
                            {m.shared_count === 1
                              ? t("profile.metOnce")
                              : t("profile.metPlural", {
                                  count: m.shared_count,
                                })}
                          </div>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <ProfileChipSection
              num="N° 09"
              title={t("profile.favoriteSpots")}
              tone="terracotta"
              chips={member.favorite_spots}
            />

            {member.skills && member.skills.length > 0 ? (
              <div className="mt-10 border-t border-ink-3 pt-8">
                <h2 className="font-mono text-[11px] uppercase tracking-wider text-terracotta">
                  {t("profile.skills")}
                </h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {member.skills.map((skill) => (
                    <Tag key={skill}>{skill}</Tag>
                  ))}
                </div>
              </div>
            ) : null}

            {member.languages && member.languages.length > 0 ? (
              <div className="mt-8 border-t border-ink-3 pt-8">
                <h2 className="font-mono text-[11px] uppercase tracking-wider text-terracotta">
                  {t("profile.languages")}
                </h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {member.languages.map((lang) => (
                    <Tag key={lang}>{lang}</Tag>
                  ))}
                </div>
              </div>
            ) : null}

            {member.website ? (
              <p className="mt-8 border-t border-ink-3 pt-8">
                <a
                  href={member.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-b border-terracotta pb-0.5 text-sm text-terracotta"
                >
                  {member.website.replace(/^https?:\/\//, "")}{" "}
                  <span className="inline-dir-arrow" aria-hidden />
                </a>
              </p>
            ) : null}
          </div>
        </div>
      </Container>
    </section>
  );
}

function ProfileChipSection({
  num,
  title,
  tone,
  chips,
}: {
  num: string;
  title: string;
  tone: "terracotta" | "ferry-yellow" | "moss";
  chips: string[] | null | undefined;
}) {
  if (!chips || chips.length === 0) return null;
  const toneClass = {
    terracotta: "text-terracotta",
    "ferry-yellow": "text-ferry-yellow",
    moss: "text-moss",
  }[tone];
  const chipBg = {
    terracotta: "bg-terracotta/10 text-terracotta",
    "ferry-yellow": "bg-ferry-yellow/10 text-ferry-yellow",
    moss: "bg-moss/10 text-moss",
  }[tone];
  return (
    <div className="mt-10 border-t border-ink-3 pt-8">
      <div className="flex items-baseline gap-3">
        <span className="font-mono text-[11px] uppercase tracking-wider text-paper-faint">
          {num}
        </span>
        <h2
          className={`font-mono text-[11px] uppercase tracking-wider ${toneClass}`}
        >
          {title}
        </h2>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {chips.map((c) => (
          <span
            key={c}
            className={`inline-flex items-center rounded-full px-3 py-1 text-[13px] ${chipBg}`}
          >
            {c}
          </span>
        ))}
      </div>
    </div>
  );
}

// Earned-badge pill cluster. Positive-only - members who haven't
// earned a signal just don't see that pill (we never display 'N
// no-shows' or 'cancelled X plans' publicly). 'Member since' is the
// one always-on pill so the cluster doesn't collapse to nothing on a
// brand-new profile.
function TrustPills({
  trust,
  isActiveThisWeek,
  labels,
}: {
  trust: {
    hostedCount: number;
    cancelledHostedCount: number;
    joinedCount: number;
    noShowCount: number;
    lastAttendedDate: string | null;
  };
  isActiveThisWeek: boolean;
  labels: {
    memberSince: string;
    reliableHost: string;
    allOnTime: string;
    activeThisWeek: string;
  };
}) {
  const isReliableHost =
    trust.hostedCount >= 3 && trust.cancelledHostedCount === 0;
  const isAllOnTime = trust.joinedCount >= 3 && trust.noShowCount === 0;

  return (
    <div className="mt-5 flex flex-wrap gap-2">
      <span className="inline-flex items-center gap-1.5 rounded-full bg-ink-2/60 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-paper-mute">
        {labels.memberSince}
      </span>
      {isReliableHost ? (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-terracotta/15 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-terracotta">
          <span aria-hidden>★</span>
          {labels.reliableHost}
        </span>
      ) : null}
      {isAllOnTime ? (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-moss/15 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-moss">
          <span aria-hidden>✓</span>
          {labels.allOnTime}
        </span>
      ) : null}
      {isActiveThisWeek ? (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-ferry-yellow/15 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-ferry-yellow">
          <span
            className="inline-block h-1.5 w-1.5 rounded-full bg-ferry-yellow"
            aria-hidden
          />
          {labels.activeThisWeek}
        </span>
      ) : null}
    </div>
  );
}

function StatBlock({ num, label }: { num: number; label: string }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-5">
      <span className="font-display text-2xl text-paper">{num}</span>
      <span className="mt-1 font-mono text-[10px] uppercase tracking-wider text-paper-faint">
        {label}
      </span>
    </div>
  );
}

function StatusPip({ status, label }: { status: string; label: string }) {
  const tone =
    status in STATUS_TONE
      ? STATUS_TONE[status as keyof typeof STATUS_TONE]
      : null;
  if (!tone) return null;
  return (
    <span
      className={`mt-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-mono uppercase tracking-wider ${tone.bg} ${tone.text}`}
    >
      <span
        className={`inline-block h-1.5 w-1.5 rounded-full ${tone.dotColor}`}
        aria-hidden
      />
      {label}
    </span>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-ink-3 py-2.5">
      <dt className="font-mono text-[10px] uppercase tracking-wider text-paper-faint">
        {label}
      </dt>
      <dd className="text-right text-[12px] text-paper">{value}</dd>
    </div>
  );
}
