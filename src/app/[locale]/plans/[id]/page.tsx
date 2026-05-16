import type { Metadata } from "next";
import { Suspense } from "react";
import Image from "next/image";
import { redirect, notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { ExternalLink, MapPin, Users } from "lucide-react";
import { Container } from "@/components/ui/container";
import { PlanVibeIcon } from "@/components/plans/plan-vibe-icon";
import { PlanAttendeeStack } from "@/components/plans/plan-attendee-stack";
import { PlanComments } from "@/components/plans/plan-comments";
import { JoinLeaveButton } from "@/components/plans/join-leave-button";
import { getPlanById, type PlanStop } from "@/lib/plans/queries";
import { getCurrentMember } from "@/lib/supabase/queries";
import { spaces } from "@/lib/spaces";
import { defaultLocale, isValidLocale, type Locale } from "@/lib/i18n/config";

export const metadata: Metadata = {
  title: "Plan",
  robots: { index: false, follow: false },
};

export default function PlanDetailPage(props: {
  params: Promise<{ locale: string; id: string }>;
}) {
  return (
    <Suspense fallback={null}>
      <Content {...props} />
    </Suspense>
  );
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
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale: rawLocale, id } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : defaultLocale;

  const { data: member } = await getCurrentMember();
  if (!member) redirect(`/login?next=/plans/${id}`);

  const { data: plan } = await getPlanById(id);
  if (!plan) notFound();

  const t = await getTranslations("plans");
  const tDetail = await getTranslations("plans.detail");

  const isHost = plan.creator_id === member.id;
  const isAttendee =
    isHost || plan.attendees.some((a) => a.member_id === member.id);
  const isFull = plan.capacity != null && plan.attendee_count >= plan.capacity;

  const dateFmt = new Intl.DateTimeFormat(locale, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <article className="bg-ink-0 pb-20">
      <section className="border-b border-ink-3 bg-ink-1 py-12 lg:py-16">
        <Container className="max-w-3xl">
          <p className="font-mono text-[11px] uppercase tracking-wider text-paper-mute">
            {dateFmt.format(new Date(`${plan.scheduled_date}T12:00:00Z`))}
          </p>

          <h1 className="mt-3 font-display text-display-lg leading-tight text-paper">
            {plan.title}
          </h1>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-paper-dim">
            <span className="inline-flex items-center gap-2">
              <Users className="h-4 w-4 text-terracotta" aria-hidden />
              {plan.capacity
                ? `${plan.attendee_count}/${plan.capacity}`
                : `${plan.attendee_count} ${t("capacity.going")}`}
            </span>
          </div>

          {/* Host card */}
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border border-ink-3 bg-ink-2 p-4">
            <div className="flex items-center gap-3">
              <span
                aria-hidden
                className="inline-flex h-10 w-10 overflow-hidden rounded-full bg-ink-3"
              >
                {plan.host?.avatar_url ? (
                  <Image
                    src={plan.host.avatar_url}
                    alt=""
                    width={40}
                    height={40}
                    className="h-full w-full object-cover"
                  />
                ) : null}
              </span>
              <div>
                <p className="text-sm font-medium text-paper">
                  {plan.host?.display_name}
                </p>
                <p className="font-mono text-[10px] uppercase tracking-wider text-paper-mute">
                  {tDetail("host")}
                  {plan.host?.city_district
                    ? ` · ${plan.host.city_district}`
                    : ""}
                </p>
              </div>
            </div>
            <JoinLeaveButton
              planId={plan.id}
              initialJoined={
                plan.attendees.some((a) => a.member_id === member.id) || isHost
              }
              isHost={isHost}
              isFull={isFull}
            />
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

      {/* Stops timeline */}
      <Container className="max-w-3xl py-10">
        <h2 className="font-mono text-[11px] uppercase tracking-wider text-paper-mute">
          {t("stops", { count: plan.stops.length })}
        </h2>
        <ol className="mt-5 space-y-3" aria-label="Plan stops">
          {plan.stops.map((stop, i) => (
            <li
              key={stop.id}
              className="relative flex gap-4 border border-ink-3 bg-ink-1 p-4"
            >
              <span
                aria-hidden
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-terracotta font-mono text-sm font-semibold text-ink-0"
              >
                {i + 1}
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
            </li>
          ))}
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
        />
      </Container>
    </article>
  );
}
