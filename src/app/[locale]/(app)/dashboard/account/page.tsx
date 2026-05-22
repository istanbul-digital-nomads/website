import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getCurrentMember } from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/server";
import { isValidLocale, defaultLocale, type Locale } from "@/lib/i18n/config";
import { Container } from "@/components/ui/container";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { getCachedTranslations } from "@/lib/i18n/cache-translations";
import { AccountSettings } from "./account-settings";

export const metadata: Metadata = {
  title: "Account",
  robots: { index: false, follow: false },
};

export default function AccountPage(props: {
  params: Promise<{ locale: string }>;
}) {
  return (
    <Suspense fallback={null}>
      <AccountContent {...props} />
    </Suspense>
  );
}

async function AccountContent({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : defaultLocale;

  const { data: member } = await getCurrentMember();
  if (!member) {
    redirect("/login?next=/dashboard/account");
  }

  // Own-row read of the Telegram subscription (RLS-allowed).
  const supabase = await createClient();
  const { data: subRow } = await supabase
    .from("telegram_subscriptions")
    .select("linked_at")
    .eq("member_id", member.id)
    .maybeSingle();
  const sub = subRow as { linked_at: string } | null;

  const t = getCachedTranslations(locale, "accountPage");

  const prefs = {
    notify_telegram: member.notify_telegram ?? true,
    notify_plan_activity: member.notify_plan_activity ?? true,
    notify_comments: member.notify_comments ?? true,
    notify_tickets: member.notify_tickets ?? true,
    notify_events: member.notify_events ?? true,
    notify_reminders: member.notify_reminders ?? true,
  };

  return (
    <section className="bg-ink-1 pt-16 lg:pt-24">
      <Container>
        <SectionEyebrow num="N° 01" label={t("eyebrow")} />
        <h1 className="mt-8 font-display text-h1 leading-none text-paper lg:text-display-lg">
          {t("title")}
        </h1>
        <p className="mt-6 max-w-xl text-sm text-paper-dim">{t("intro")}</p>

        <div className="mt-12 max-w-2xl pb-24">
          <AccountSettings
            memberId={member.id}
            connected={Boolean(sub)}
            linkedAt={sub?.linked_at ?? null}
            prefs={prefs}
          />
        </div>
      </Container>
    </section>
  );
}
