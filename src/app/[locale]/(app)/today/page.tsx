import type { Metadata } from "next";
import { Link } from "@/lib/i18n/routing";
import { getTranslations } from "next-intl/server";
import { ArrowRight, Plus } from "lucide-react";
import { getCurrentMember, getMembersPublic } from "@/lib/supabase/queries";
import { getPlansForFeed } from "@/lib/plans/queries";
import { defaultLocale, isValidLocale, type Locale } from "@/lib/i18n/config";
import { alternatesFor, localeUrl } from "@/lib/seo";
import { LivePip } from "@/components/ui/live-pip";
import { Eyebrow } from "@/components/ui/eyebrow";
import { PlanCard } from "@/components/sections/today/plan-card";
import { SectionHead } from "@/components/sections/today/section-head";
import {
  adaptPlanToCard,
  groupBySlot,
  type TodayPlanCard,
} from "@/components/sections/today/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : defaultLocale;
  const t = await getTranslations({ locale, namespace: "today.meta" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: alternatesFor(locale, "/today"),
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: localeUrl(locale, "/today"),
      type: "website",
    },
  };
}

function statsFor(cards: TodayPlanCard[]) {
  const open = cards.reduce((acc, p) => {
    if (p.seats == null) return acc;
    return acc + Math.max(0, p.seats - p.filled);
  }, 0);
  const hoods = new Set(cards.map((c) => c.hood).filter(Boolean)).size;
  return { total: cards.length, open, hoods };
}

export default async function TodayPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : defaultLocale;
  const t = await getTranslations({ locale, namespace: "today" });

  const { data: member } = await getCurrentMember();
  const isAuthed = !!member;

  // Today's board is public read-only (plans have public-read RLS) so
  // signed-out visitors see the day's activity - "proof of community".
  // Joining/hosting is still gated downstream (the plan page + composer).
  const [{ data: plansRaw }, { data: membersRaw }] = await Promise.all([
    getPlansForFeed({ range: "today" }),
    getMembersPublic(),
  ]);

  const cards = (plansRaw ?? []).map((p) =>
    adaptPlanToCard(p, member?.id ?? null),
  );
  const grouped = groupBySlot(cards);
  const stats = statsFor(cards);
  const mine = cards.find((c) => c.mine);

  // Tiny right-rail recap of recently-joined members - matches the
  // "Featured local guides" rail in the prototype, with real data and
  // honest framing (no rating/fees we don't have).
  const recentMembers = (membersRaw ?? []).slice(0, 5);

  return (
    <section className="relative overflow-hidden bg-deep-water font-grotesk text-cream">
      {/* Background texture - matches the cinematic hero's water feel. */}
      <div
        className="pointer-events-none absolute inset-0 opacity-55"
        style={{
          backgroundImage: `
            radial-gradient(1400px 700px at 95% 0%, rgba(244,184,96,0.07), transparent 60%),
            radial-gradient(900px 600px at 0% 80%, rgba(232,122,93,0.05), transparent 60%),
            linear-gradient(180deg, #06101f, #0a1a2f 60%, #06101f)
          `,
        }}
      />

      <div className="relative mx-auto max-w-[1320px] px-6 pt-14 md:px-10 md:pt-20">
        {/* Top eyebrow row: live pip + date hairline */}
        <div className="mb-7 grid items-center gap-6 md:grid-cols-[auto_1fr_auto]">
          <LivePip label={t("livePip", { count: stats.total })} />
          <span
            aria-hidden
            className="hidden h-px md:block"
            style={{ background: "rgba(246, 236, 217, 0.10)" }}
          />
          <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-cream/32 md:text-right">
            {t("dateRibbon")}
          </span>
        </div>

        {/* Headline + lede */}
        <div className="grid items-end gap-10 md:grid-cols-[1.4fr_1fr] md:gap-20">
          <h1
            className="font-editorial text-cream"
            style={{
              fontSize: "clamp(2.75rem, 6.5vw, 6rem)",
              lineHeight: 0.98,
              letterSpacing: "-0.025em",
              margin: 0,
              fontWeight: 400,
              maxWidth: 820,
            }}
          >
            {t("headlineA")}{" "}
            <em className="italic text-gold">{t("headlineB")}</em>
            <br />
            {t("headlineC")}
          </h1>
          <p className="md:pb-3.5 max-w-[460px] text-[16px] leading-[1.6] text-cream/70">
            {t("lede")}
          </p>
        </div>

        {/* Stats strip */}
        <div
          className="mt-12 grid overflow-hidden rounded-2xl border md:grid-cols-4"
          style={{
            borderColor: "rgba(246, 236, 217, 0.10)",
            background: "rgba(10,26,47,0.4)",
          }}
        >
          {[
            { k: t("stats.total"), v: stats.total, sub: t("stats.totalSub") },
            {
              k: t("stats.open"),
              v: stats.open,
              sub: t("stats.openSub", { hoods: stats.hoods }),
              tone: "text-moss",
            },
            {
              k: t("stats.mine"),
              v: mine ? mine.startTime : t("stats.mineNone"),
              sub: mine
                ? t("stats.mineSub", {
                    filled: mine.filled,
                    seats: mine.seats ?? 0,
                  })
                : t("stats.mineNoneSub"),
              tone: "text-rose",
            },
            {
              k: t("stats.hoods"),
              v: stats.hoods,
              sub: t("stats.hoodsSub"),
              tone: "text-gold",
            },
          ].map((c, i) => (
            <div
              key={i}
              className="border-b p-6 md:border-b-0 md:border-r last:border-r-0 md:p-7"
              style={{ borderColor: "rgba(246, 236, 217, 0.10)" }}
            >
              <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gold/55">
                {c.k}
              </div>
              <div
                className={`mt-3 font-editorial ${c.tone ?? "text-cream"}`}
                style={{
                  fontSize: "clamp(2rem, 4vw, 2.5rem)",
                  letterSpacing: "-0.02em",
                  lineHeight: 1,
                }}
              >
                {c.v}
              </div>
              <div className="mt-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-cream/32">
                ↳ {c.sub}
              </div>
            </div>
          ))}
        </div>

        {/* Main grid: board + side rail */}
        <div className="mt-14 grid items-start gap-8 pb-20 md:grid-cols-[1fr_340px]">
          {/* Board */}
          <div>
            {cards.length === 0 ? (
              <EmptyBoard label={t("emptyBoard")} />
            ) : (
              <>
                {!isAuthed && <SignInPrompt />}
                {grouped.morning.length > 0 && (
                  <>
                    <SectionHead
                      label={t("groups.morning.label")}
                      kickerLead={t("groups.morning.kickerLead")}
                      kickerRest={t("groups.morning.kickerRest")}
                      range={t("groups.morning.range", {
                        count: grouped.morning.length,
                      })}
                    />
                    <div className="flex flex-col gap-3.5">
                      {grouped.morning.map((p) => (
                        <PlanCard key={p.id} plan={p} />
                      ))}
                    </div>
                  </>
                )}
                {grouped.afternoon.length > 0 && (
                  <>
                    <SectionHead
                      label={t("groups.afternoon.label")}
                      kickerLead={t("groups.afternoon.kickerLead")}
                      kickerRest={t("groups.afternoon.kickerRest")}
                      range={t("groups.afternoon.range", {
                        count: grouped.afternoon.length,
                      })}
                    />
                    <div className="flex flex-col gap-3.5">
                      {grouped.afternoon.map((p) => (
                        <PlanCard key={p.id} plan={p} />
                      ))}
                    </div>
                  </>
                )}
                {grouped.evening.length > 0 && (
                  <>
                    <SectionHead
                      label={t("groups.evening.label")}
                      kickerLead={t("groups.evening.kickerLead")}
                      kickerRest={t("groups.evening.kickerRest")}
                      range={t("groups.evening.range", {
                        count: grouped.evening.length,
                      })}
                    />
                    <div className="flex flex-col gap-3.5">
                      {grouped.evening.map((p) => (
                        <PlanCard key={p.id} plan={p} />
                      ))}
                    </div>
                  </>
                )}
              </>
            )}
          </div>

          {/* Side rail */}
          <aside className="flex flex-col gap-4 md:sticky md:top-24">
            {/* Composer (server-rendered shell - "+ post a plan") */}
            <Link
              href={isAuthed ? "/plans/new" : "/login?next=/today"}
              className="rounded-2xl border p-5 transition-colors hover:bg-gold/5"
              style={{ borderColor: "rgba(246, 236, 217, 0.10)" }}
            >
              <div className="flex items-baseline justify-between">
                <Eyebrow label={t("composer.eyebrow")} />
                <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-cream/32">
                  ⌘N
                </span>
              </div>
              <div
                className="mt-3.5 flex items-center justify-between gap-3 rounded-xl border px-3.5 py-3 font-editorial text-[14px] text-cream/55"
                style={{
                  background: "#0a1a2f",
                  borderColor: "rgba(246, 236, 217, 0.10)",
                }}
              >
                <span>{t("composer.placeholder")}</span>
                <Plus className="h-3.5 w-3.5 text-gold" />
              </div>
              <div className="mt-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-cream/32">
                ↳ {t("composer.hint")}
              </div>
            </Link>

            {/* Recently-joined members (honest framing for the rail slot the
                prototype used for "Featured local guides") */}
            <div
              className="overflow-hidden rounded-2xl border"
              style={{
                borderColor: "rgba(246, 236, 217, 0.10)",
                background: "rgba(10,26,47,0.45)",
              }}
            >
              <div
                className="flex items-baseline justify-between border-b px-5 py-3.5"
                style={{ borderColor: "rgba(246, 236, 217, 0.10)" }}
              >
                <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gold">
                  ★ {t("rail.title")}
                </span>
                <Link
                  href="/members"
                  className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cream/32 hover:text-cream"
                >
                  {t("rail.cta")} →
                </Link>
              </div>
              {recentMembers.map((m, i, arr) => (
                <Link
                  key={m.id}
                  href={`/members/${m.id}`}
                  className="grid items-center gap-3 px-5 py-3 transition-colors hover:bg-gold/[0.04]"
                  style={{
                    gridTemplateColumns: "auto 1fr auto",
                    borderBottom:
                      i < arr.length - 1
                        ? "0.5px solid rgba(246, 236, 217, 0.06)"
                        : "none",
                  }}
                >
                  <span
                    className="grid h-8 w-8 place-items-center rounded-full font-grotesk text-[11px] font-semibold text-deep-water"
                    style={{
                      background: "linear-gradient(135deg, #f4b860, #e87a5d)",
                    }}
                  >
                    {(m.display_name ?? "?")
                      .split(/\s+/)
                      .map((p) => p[0])
                      .filter(Boolean)
                      .slice(0, 2)
                      .join("")
                      .toUpperCase()}
                  </span>
                  <div>
                    <div className="font-editorial text-[15px] text-cream">
                      {m.display_name}
                    </div>
                    {m.location && (
                      <div className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-cream/32">
                        ↳ {m.location}
                      </div>
                    )}
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-gold" />
                </Link>
              ))}
              {recentMembers.length === 0 && (
                <div className="px-5 py-6 text-[12px] text-cream/55">
                  {t("rail.empty")}
                </div>
              )}
            </div>

            <p className="px-1 text-[10px] font-semibold uppercase leading-[1.9] tracking-[0.22em] text-cream/32">
              ↳ {t("legend.nomad")}
              <br />↳ {t("legend.shortcut")}
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}

// Slim nudge shown above the (public) board for logged-out visitors:
// browsing is open, joining/posting needs an account.
function SignInPrompt() {
  return (
    <div
      className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border px-4 py-3"
      style={{
        borderColor: "rgba(244, 184, 96, 0.22)",
        background: "rgba(10,26,47,0.45)",
      }}
    >
      <p className="text-[13.5px] leading-snug text-cream/75">
        You&apos;re browsing as a guest. Sign in to join a plan or post your
        own.
      </p>
      <Link
        href="/login?next=/today"
        className="inline-flex shrink-0 items-center gap-2 rounded-full bg-gold px-4 py-2 font-grotesk text-[12.5px] font-semibold text-[#06101f] transition-colors hover:bg-gold/90"
      >
        Sign in <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}

function EmptyBoard({ label }: { label: string }) {
  return (
    <div
      className="rounded-2xl border border-dashed p-8 md:p-10"
      style={{ borderColor: "rgba(244, 184, 96, 0.22)" }}
    >
      <Eyebrow label="Empty board" />
      <p
        className="mt-4 font-editorial text-cream"
        style={{
          fontSize: "clamp(1.5rem, 2.5vw, 1.875rem)",
          lineHeight: 1.1,
          letterSpacing: "-0.015em",
          fontWeight: 400,
        }}
      >
        {label}
      </p>
    </div>
  );
}
