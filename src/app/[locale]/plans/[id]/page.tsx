import type { Metadata } from "next";
import { Suspense } from "react";
import Image from "next/image";
import { redirect, notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Clock, MapPin, Users, ExternalLink } from "lucide-react";
import { Container } from "@/components/ui/container";
import { PlanVibeIcon } from "@/components/plans/plan-vibe-icon";
import { PlanAttendeeStack } from "@/components/plans/plan-attendee-stack";
import { PlanComments } from "@/components/plans/plan-comments";
import { JoinLeaveButton } from "@/components/plans/join-leave-button";
import { getPlanById } from "@/lib/plans/queries";
import { getCurrentMember } from "@/lib/supabase/queries";
import { spaces } from "@/lib/spaces";
import {
  defaultLocale,
  isValidLocale,
  type Locale,
} from "@/lib/i18n/config";

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

  const space = plan.space_id
    ? spaces.find((s) => s.id === plan.space_id)
    : null;
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
      {/* Hero */}
      <section className="border-b border-ink-3 bg-ink-1 py-12 lg:py-16">
        <Container className="max-w-3xl">
          <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-paper-mute">
            <PlanVibeIcon vibe={plan.vibe} className="h-3.5 w-3.5 text-terracotta" />
            <span>{t(`vibes.${plan.vibe}`)}</span>
            <span className="mx-1 text-paper-faint">·</span>
            <span>{dateFmt.format(new Date(`${plan.scheduled_date}T12:00:00Z`))}</span>
          </div>

          <h1 className="mt-4 font-display text-display-lg leading-tight text-paper">
            {plan.title}
          </h1>

          {plan.notes && (
            <p className="mt-4 max-w-2xl text-lede leading-relaxed text-paper-dim">
              {plan.notes}
            </p>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-paper-dim">
            <span className="inline-flex items-center gap-2">
              <Clock className="h-4 w-4 text-terracotta" />
              <span dir="ltr">
                {plan.start_time && plan.end_time
                  ? `${plan.start_time.slice(0, 5)} – ${plan.end_time.slice(0, 5)}`
                  : plan.start_time?.slice(0, 5) ?? t("range.today")}
              </span>
            </span>
            <span className="inline-flex items-center gap-2">
              <MapPin className="h-4 w-4 text-terracotta" />
              {space?.name ?? plan.custom_location ?? plan.neighborhood_slug}
            </span>
            <span className="inline-flex items-center gap-2">
              <Users className="h-4 w-4 text-terracotta" />
              {plan.capacity
                ? `${plan.attendee_count}/${plan.capacity}`
                : `${plan.attendee_count} ${t("capacity.going")}`}
            </span>
          </div>

          {/* Host card */}
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border border-ink-3 bg-ink-2 p-4">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 overflow-hidden rounded-full bg-ink-3">
                {plan.host?.avatar_url ? (
                  <Image
                    src={plan.host.avatar_url}
                    alt={plan.host.display_name}
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
                  {tDetail("host")} ·{" "}
                  {plan.host?.city_district ?? plan.neighborhood_slug ?? ""}
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

          {/* Telegram deep link (only after joining) */}
          {isAttendee && !isHost && plan.host_telegram_handle && (
            <a
              href={`https://t.me/${plan.host_telegram_handle.replace(/^@/, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-2 border border-ink-4 px-4 py-2.5 text-sm text-paper transition-colors hover:border-ink-5"
            >
              <ExternalLink className="h-4 w-4" />
              {tDetail("openTelegram", { name: plan.host?.display_name ?? "" })}
            </a>
          )}
        </Container>
      </section>

      <Container className="max-w-3xl space-y-12 py-12">
        {/* Attendees */}
        <section>
          <h2 className="font-mono text-[11px] uppercase tracking-wider text-paper-mute">
            {tDetail("attendees", { count: plan.attendee_count })}
          </h2>
          <div className="mt-4 flex items-center gap-3">
            <PlanAttendeeStack
              attendees={plan.attendees}
              max={8}
              size={36}
            />
            <ul className="flex flex-wrap gap-x-3 gap-y-1 text-sm text-paper-dim">
              {plan.attendees.slice(0, 8).map((a) => (
                <li key={a.member_id}>{a.display_name}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* Comments */}
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
