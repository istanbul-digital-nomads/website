import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { getCurrentMember } from "@/lib/supabase/queries";
import { isValidLocale, defaultLocale, type Locale } from "@/lib/i18n/config";
import { isHostRole } from "@/lib/member-roles";
import { centsToLira } from "@/lib/payments/fees";
import { Container } from "@/components/ui/container";
import { PayoutSetupForm } from "@/components/sections/payouts/payout-setup-form";

export const metadata: Metadata = {
  title: "Payouts",
  robots: { index: false, follow: false },
};

interface Props {
  params: Promise<{ locale: string }>;
}

export default function PayoutsPage(props: Props) {
  return (
    <Suspense fallback={null}>
      <PayoutsContent {...props} />
    </Suspense>
  );
}

async function PayoutsContent({ params }: Props) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : defaultLocale;
  const { data: member } = await getCurrentMember();
  if (!member) redirect("/login?next=/dashboard/payouts");

  const role = member.member_type as
    | "nomad"
    | "remote_worker"
    | "local_guide"
    | "tour_guide"
    | null;
  const canEarn = isHostRole(role) || member.is_agent === true;
  if (!canEarn) redirect("/dashboard");

  const t = await getTranslations({ locale, namespace: "payouts" });

  // Tickets sold for this host's plans.
  const sb = (await createClient()) as unknown as { from: (t: string) => any };
  const { data: tickets } = await sb
    .from("plan_tickets")
    .select(
      "id, status, net_to_host_cents, paid_at, released_at, plan:plans(title)",
    )
    .eq("host_id", member.id)
    .order("created_at", { ascending: false });

  const rows = (tickets ?? []) as Array<{
    id: string;
    status: string;
    net_to_host_cents: number;
    paid_at: string | null;
    released_at: string | null;
    plan: { title: string } | null;
  }>;

  const pendingCents = rows
    .filter((r) => r.status === "held")
    .reduce((s, r) => s + r.net_to_host_cents, 0);
  const releasedCents = rows
    .filter((r) => r.status === "released")
    .reduce((s, r) => s + r.net_to_host_cents, 0);

  const lira = (c: number) =>
    centsToLira(c).toLocaleString(locale, { maximumFractionDigits: 2 });

  const hasPayoutSetup = Boolean(member.payout_iban);

  return (
    <section className="bg-ink-1 pt-16 lg:pt-24">
      <Container className="max-w-3xl">
        <p className="font-mono text-[11px] uppercase tracking-wider text-paper-mute">
          {t("eyebrow")}
        </p>
        <h1 className="mt-4 font-display text-h1 leading-none text-paper">
          {t("title")}
        </h1>

        {/* Balance cards */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <div className="border border-ink-3 bg-ink-2 p-6">
            <div className="font-mono text-[10px] uppercase tracking-wider text-ferry-yellow">
              {t("pendingLabel")}
            </div>
            <div className="mt-2 font-display text-3xl text-paper">
              {lira(pendingCents)} TL
            </div>
            <p className="mt-2 text-[12px] text-paper-mute">
              {t("pendingHint")}
            </p>
          </div>
          <div className="border border-ink-3 bg-ink-2 p-6">
            <div className="font-mono text-[10px] uppercase tracking-wider text-moss">
              {t("releasedLabel")}
            </div>
            <div className="mt-2 font-display text-3xl text-paper">
              {lira(releasedCents)} TL
            </div>
            <p className="mt-2 text-[12px] text-paper-mute">
              {t("releasedHint")}
            </p>
          </div>
        </div>

        {/* Payout setup */}
        <div className="mt-10 border border-ink-3 bg-ink-2 p-6">
          <h2 className="font-mono text-[11px] uppercase tracking-wider text-terracotta">
            {t("setupTitle")}
          </h2>
          <PayoutSetupForm
            initialName={member.payout_name ?? ""}
            hasIban={hasPayoutSetup}
          />
        </div>

        {/* Ticket history */}
        {rows.length > 0 ? (
          <div className="mt-10">
            <h2 className="font-mono text-[11px] uppercase tracking-wider text-paper-mute">
              {t("historyTitle")}
            </h2>
            <ul className="mt-4 divide-y divide-ink-3 border-t border-ink-3">
              {rows.map((r) => (
                <li
                  key={r.id}
                  className="grid grid-cols-[1fr_auto_auto] items-center gap-3 py-3"
                >
                  <span className="truncate text-[14px] text-paper">
                    {r.plan?.title ?? "Plan"}
                  </span>
                  <span className="font-mono text-[11px] uppercase tracking-wider text-paper-faint">
                    {t(`status.${r.status}`)}
                  </span>
                  <span className="font-mono text-[13px] text-paper">
                    {lira(r.net_to_host_cents)} TL
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="mt-10 text-[14px] text-paper-mute">{t("noTickets")}</p>
        )}
      </Container>
    </section>
  );
}
