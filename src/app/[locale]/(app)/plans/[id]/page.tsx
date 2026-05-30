import type { Metadata } from "next";
import { connection } from "next/server";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import {
  CircleDollarSign,
  ExternalLink,
  MapPin,
  Pencil,
  Users,
  Wallet,
} from "lucide-react";
import { Link } from "@/lib/i18n/routing";
import { Container } from "@/components/ui/container";
import { PlanVibeIcon } from "@/components/sections/plans/plan-vibe-icon";
import { PlanAttendeeStack } from "@/components/sections/plans/plan-attendee-stack";
import { PlanComments } from "@/components/sections/plans/plan-comments";
import { PlanReviews } from "@/components/sections/plans/plan-reviews";
import { JoinLeaveButton } from "@/components/sections/plans/join-leave-button";
import { TicketCheckoutButton } from "@/components/sections/plans/ticket-checkout-button";
import { PlanDetailMapLazy } from "@/components/sections/plans/plan-detail-map-lazy";
import { TRANSPORT_ICONS } from "@/lib/plans/transport";
import { getPlanById, type PlanStop } from "@/lib/plans/queries";
import { getCurrentMember } from "@/lib/supabase/queries";
import { spaces } from "@/lib/spaces";
import { defaultLocale, isValidLocale, type Locale } from "@/lib/i18n/config";
import { alternatesFor, localeUrl, SITE_URL } from "@/lib/seo";
import { planNeighborhoods, planDateLabel } from "@/lib/plans/share";
import { VerificationBadge } from "@/components/ui/verification-badge";
import { isVerificationLevel } from "@/lib/verification";
import { PlanShareButton } from "@/components/sections/plans/plan-share";

// Per-plan metadata so shares on X/FB/WhatsApp/Slack/iMessage show a rich card.
// og:image points at the canonical, locale-less /api/plans/[id]/og route (not a
// colocated opengraph-image, whose `/en/...` URL 307-redirects and trips strict
// scrapers). Plans are ephemeral, so we keep them out of the search index -
// social scrapers read these OG/Twitter tags regardless of robots.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale, id } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : defaultLocale;
  const { data: plan } = await getPlanById(id);
  if (!plan) {
    return { title: "Plan", robots: { index: false, follow: false } };
  }

  const tPlans = await getTranslations({ locale, namespace: "plans" });
  const hostName = plan.host?.display_name ?? "Istanbul Nomads";
  const hoods = planNeighborhoods(plan);
  const title = plan.title;
  const description = [
    planDateLabel(plan.scheduled_date, locale),
    hoods.join(", "),
    tPlans("stops", { count: plan.stops.length }),
  ]
    .filter(Boolean)
    .join(" · ");
  const url = localeUrl(locale, `/plans/${id}`);
  const ogImage = `${SITE_URL}/api/plans/${id}/og?locale=${locale}`;

  return {
    title,
    description,
    robots: { index: false, follow: false },
    alternates: alternatesFor(locale, `/plans/${id}`),
    openGraph: {
      title: `${title} · ${hostName}`,
      description,
      url,
      type: "article",
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} · ${hostName}`,
      description,
      images: [ogImage],
    },
  };
}

// Initials fallback for a host with no avatar (e.g. "Cem Kaya" -> "CK").
function initialsOf(name?: string | null): string {
  if (!name) return "·";
  return name
    .split(/\s+/)
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default async function PlanDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  // Login-gated, per-plan dynamic route. Resolve auth + the plan HERE (not
  // inside a Suspense) and opt into dynamic rendering, so redirect()/notFound()
  // set real HTTP status codes on the SSR first load. Under cacheComponents a
  // prerendered shell would otherwise commit a 200 and the redirect/not-found
  // would only resolve client-side - a broken 404-looking hard load even though
  // CSR navigation worked.
  await connection();
  const { locale: rawLocale, id } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : defaultLocale;

  const [{ data: member }, { data: plan }] = await Promise.all([
    getCurrentMember(),
    getPlanById(id),
  ]);
  if (!plan) notFound();

  return <Content locale={locale} member={member} plan={plan} />;
}

async function PlanMoneyChip({
  plan,
  locale,
}: {
  plan: {
    is_ticketed: boolean;
    entry_fee_cents: number | null;
    budget_per_person_min_cents: number | null;
    budget_per_person_max_cents: number | null;
  };
  locale: string;
}) {
  const t = await getTranslations({ locale, namespace: "plans.money" });
  const liraOf = (cents: number) => (cents / 100).toLocaleString(locale);

  if (plan.is_ticketed && plan.entry_fee_cents != null) {
    return (
      <span className="inline-flex items-center gap-2">
        <CircleDollarSign className="h-4 w-4 text-ferry-yellow" aria-hidden />
        {t("entryFeeDisplay", { amount: liraOf(plan.entry_fee_cents) })}
        <span className="font-mono text-[10px] uppercase tracking-wider text-paper-faint">
          · {t("checkoutComingSoon")}
        </span>
      </span>
    );
  }
  const min = plan.budget_per_person_min_cents;
  const max = plan.budget_per_person_max_cents;
  if (!plan.is_ticketed && min === 0 && (max === 0 || max === null)) {
    return (
      <span className="inline-flex items-center gap-2">
        <CircleDollarSign className="h-4 w-4 text-moss" aria-hidden />
        {t("free")}
      </span>
    );
  }
  if (min != null && max != null && max > min) {
    return (
      <span className="inline-flex items-center gap-2">
        <CircleDollarSign className="h-4 w-4 text-paper-mute" aria-hidden />
        {t("budgetDisplay", { min: liraOf(min), max: liraOf(max) })}
      </span>
    );
  }
  if (min != null || max != null) {
    return (
      <span className="inline-flex items-center gap-2">
        <CircleDollarSign className="h-4 w-4 text-paper-mute" aria-hidden />
        {t("budgetDisplayApprox", { amount: liraOf((max ?? min)!) })}
      </span>
    );
  }
  return null;
}

function stopLocationName(stop: PlanStop): string {
  if (stop.space_id) {
    const sp = spaces.find((s) => s.id === stop.space_id);
    if (sp) return sp.name;
  }
  return stop.custom_location ?? stop.neighborhood_slug ?? "Pinned spot";
}

function formatTime(start: string | null, end: string | null): string {
  if (!start) return "";
  const s = start.slice(0, 5);
  if (!end) return s;
  return `${s} - ${end.slice(0, 5)}`;
}

async function Content({
  locale,
  member,
  plan,
}: {
  locale: Locale;
  // Null for logged-out visitors - the plan is public (RLS allows anon read);
  // member-only actions (join, edit, comment) fall back to a sign-in prompt.
  member: Awaited<ReturnType<typeof getCurrentMember>>["data"];
  plan: NonNullable<Awaited<ReturnType<typeof getPlanById>>["data"]>;
}) {
  const t = await getTranslations("plans");
  const tDetail = await getTranslations("plans.detail");
  const tVerifyLevels = await getTranslations("verification.levels");
  const tVerifyTooltips = await getTranslations("verification.tooltips");
  const hostLevel = isVerificationLevel(plan.host?.verification_level)
    ? plan.host.verification_level
    : "basic";

  const isHost = !!member && plan.creator_id === member.id;
  const isAttendee =
    isHost ||
    (!!member && plan.attendees.some((a) => a.member_id === member.id));
  const isFull = plan.capacity != null && plan.attendee_count >= plan.capacity;

  // Reviews: a non-host attendee can review once the plan has ended.
  const planEnded = plan.ended;
  const canReview = isAttendee && !isHost && planEnded;
  const reviewLockReason: "not-attended" | "not-ended" | null =
    !member || canReview || isHost
      ? null
      : !isAttendee
        ? "not-attended"
        : !planEnded
          ? "not-ended"
          : null;

  const dateFmt = new Intl.DateTimeFormat(locale, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <article className="bg-ink-0 pb-20">
      <section className="border-b border-ink-3 bg-ink-1 py-12 lg:py-16">
        <Container className="max-w-3xl">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="font-mono text-[11px] uppercase tracking-wider text-paper-mute">
              {dateFmt.format(new Date(`${plan.scheduled_date}T12:00:00Z`))}
            </p>
            <PlanShareButton
              planId={plan.id}
              locale={locale}
              title={plan.title}
            />
          </div>

          <h1 className="mt-2 max-w-2xl font-display text-h1 text-paper">
            {plan.title}
          </h1>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-paper-dim">
            <span className="inline-flex items-center gap-2">
              <Users className="h-4 w-4 text-terracotta" aria-hidden />
              {plan.capacity
                ? `${plan.attendee_count}/${plan.capacity}`
                : `${plan.attendee_count} ${t("capacity.going")}`}
            </span>
            <PlanMoneyChip plan={plan} locale={locale} />
          </div>

          {/* Host card */}
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-ink-3 bg-ink-2 p-4">
            <div className="flex items-center gap-3">
              <span
                aria-hidden
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-ink-3 font-display text-sm text-paper-mute"
              >
                {plan.host?.avatar_url ? (
                  <Image
                    src={plan.host.avatar_url}
                    alt=""
                    width={40}
                    height={40}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  initialsOf(plan.host?.display_name)
                )}
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-paper">
                    {plan.host?.display_name}
                  </p>
                  <VerificationBadge
                    level={hostLevel}
                    label={tVerifyLevels(hostLevel)}
                    tooltip={tVerifyTooltips(hostLevel)}
                  />
                </div>
                <p className="font-mono text-[10px] uppercase tracking-wider text-paper-mute">
                  {tDetail("host")}
                  {plan.host?.city_district
                    ? ` · ${plan.host.city_district}`
                    : ""}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isHost && (
                <Link
                  href={`/plans/${plan.id}/edit`}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-ink-4 text-paper-mute transition-colors hover:border-paper hover:text-paper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
                  aria-label={tDetail("edit")}
                  title={tDetail("edit")}
                >
                  <Pencil className="h-4 w-4" aria-hidden />
                </Link>
              )}
              {!member ? (
                <Link
                  href={`/login?next=/plans/${plan.id}`}
                  className="inline-flex items-center gap-2 rounded-md border border-ink-4 px-4 py-2.5 text-sm text-paper transition-colors hover:border-paper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
                >
                  {tDetail("signInToJoin")}
                </Link>
              ) : plan.is_ticketed &&
                !isHost &&
                !isAttendee &&
                plan.entry_fee_cents != null ? (
                <TicketCheckoutButton
                  planId={plan.id}
                  priceLabel={`${(plan.entry_fee_cents / 100).toLocaleString(locale)} TL`}
                />
              ) : (
                <JoinLeaveButton
                  planId={plan.id}
                  initialJoined={
                    plan.attendees.some((a) => a.member_id === member.id) ||
                    isHost
                  }
                  isHost={isHost}
                  isFull={isFull}
                />
              )}
            </div>
          </div>

          {isAttendee && !isHost && plan.host_telegram_handle && (
            <a
              href={`https://t.me/${plan.host_telegram_handle.replace(/^@/, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-2 border border-ink-4 px-4 py-2.5 text-sm text-paper transition-colors hover:border-ink-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
            >
              <ExternalLink className="h-4 w-4" aria-hidden />
              {tDetail("openTelegram", { name: plan.host?.display_name ?? "" })}
            </a>
          )}
        </Container>
      </section>

      {/* Map: shown when 1+ stops have a resolvable location */}
      <Container className="max-w-3xl pt-8">
        <PlanDetailMapLazy stops={plan.stops} />
      </Container>

      {/* Stops timeline (with transport legs between stops) */}
      <Container className="max-w-3xl py-10">
        <h2 className="font-mono text-[11px] uppercase tracking-wider text-paper-mute">
          {t("stops", { count: plan.stops.length })}
        </h2>
        <ol className="mt-4 space-y-3" aria-label="Plan stops">
          {plan.stops.map((stop, i) => {
            const TransportIcon = stop.transport_mode
              ? TRANSPORT_ICONS[stop.transport_mode]
              : null;
            const priceLabel =
              stop.transport_price_min != null &&
              stop.transport_price_max != null &&
              stop.transport_price_min !== stop.transport_price_max
                ? `₺${stop.transport_price_min}-${stop.transport_price_max}`
                : stop.transport_price_min != null ||
                    stop.transport_price_max != null
                  ? `₺${stop.transport_price_min ?? stop.transport_price_max}`
                  : null;
            return (
              <li key={stop.id} className="border border-ink-3 bg-ink-1">
                {/* Transport leg from previous stop to this one. */}
                {i > 0 && TransportIcon && stop.transport_mode && (
                  <div
                    className="flex items-center gap-2 border-b border-ink-3 bg-ink-2 px-4 py-2 text-paper-dim"
                    aria-label={`Travel to stop ${i + 1}`}
                  >
                    <TransportIcon
                      className="h-3.5 w-3.5 text-terracotta"
                      aria-hidden
                    />
                    <span className="font-mono text-[10px] uppercase tracking-wider text-paper-mute">
                      {t(`transport.${stop.transport_mode}`)}
                    </span>
                    {priceLabel && (
                      <span className="font-mono text-[10px] uppercase tracking-wider text-paper-faint">
                        · {priceLabel}
                      </span>
                    )}
                  </div>
                )}
                <div className="flex gap-4 p-4">
                  <span aria-hidden className="relative shrink-0">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-terracotta text-[#06101f]">
                      <PlanVibeIcon
                        vibe={stop.vibe}
                        className="h-[18px] w-[18px]"
                      />
                    </span>
                    <span className="absolute -bottom-1 -right-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full border border-ink-1 bg-ink-2 px-1 font-mono text-[10px] font-semibold text-paper">
                      {i + 1}
                    </span>
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <p className="font-display text-h3 leading-tight text-paper">
                        {stopLocationName(stop)}
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
                      <span className="font-mono text-[10px] uppercase tracking-wider text-paper-mute">
                        {t(`vibes.${stop.vibe}`)}
                      </span>
                      {stop.neighborhood_slug && (
                        <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-paper-mute">
                          <MapPin className="h-3.5 w-3.5" aria-hidden />
                          {stop.neighborhood_slug}
                        </span>
                      )}
                      {(stop.cost_min_cents != null ||
                        stop.cost_max_cents != null) && (
                        <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-paper-mute">
                          <Wallet
                            className="h-3.5 w-3.5 text-moss"
                            aria-hidden
                          />
                          {stop.cost_min_cents != null &&
                          stop.cost_max_cents != null &&
                          stop.cost_max_cents !== stop.cost_min_cents
                            ? `₺${stop.cost_min_cents / 100} - ₺${stop.cost_max_cents / 100}`
                            : `₺${(stop.cost_min_cents ?? stop.cost_max_cents)! / 100}`}
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
            );
          })}
        </ol>
      </Container>

      <Container className="max-w-3xl space-y-12 py-2">
        <section>
          <h2 className="font-mono text-[11px] uppercase tracking-wider text-paper-mute">
            {tDetail("attendees", { count: plan.attendee_count })}
          </h2>
          <div className="mt-4 flex items-center gap-3">
            <PlanAttendeeStack attendees={plan.attendees} max={8} size={36} />
            <ul className="flex flex-wrap gap-x-3 gap-y-1 text-sm text-paper-dim">
              {plan.attendees.slice(0, 8).map((a) => (
                <li key={a.member_id}>{a.display_name}</li>
              ))}
            </ul>
          </div>
        </section>

        <PlanComments
          planId={plan.id}
          initial={plan.comments.map((c) => ({
            id: c.id,
            body: c.body,
            created_at: c.created_at,
            author: c.author,
          }))}
          isAttendee={isAttendee}
          currentMemberId={member?.id ?? ""}
          currentMemberName={member?.display_name ?? ""}
        />

        <PlanReviews
          planId={plan.id}
          initial={plan.reviews.map((r) => ({
            id: r.id,
            rating: r.rating,
            would_return: r.would_return,
            body: r.body,
            created_at: r.created_at,
            author: r.author,
          }))}
          canReview={canReview}
          lockReason={reviewLockReason}
          currentMemberId={member?.id ?? ""}
          currentMemberName={member?.display_name ?? ""}
        />
      </Container>
    </article>
  );
}
