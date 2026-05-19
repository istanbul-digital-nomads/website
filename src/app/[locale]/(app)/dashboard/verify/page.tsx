import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { getCurrentMember } from "@/lib/supabase/queries";
import { isValidLocale, defaultLocale, type Locale } from "@/lib/i18n/config";
import { Container } from "@/components/ui/container";
import { VerificationBadge } from "@/components/ui/verification-badge";
import { isVerificationLevel } from "@/lib/verification";
import { isHostRole } from "@/lib/member-roles";
import { VerifyForm } from "@/components/sections/verification/verify-form";

export const metadata: Metadata = {
  title: "Verify your account",
  robots: { index: false, follow: false },
};

interface Props {
  params: Promise<{ locale: string }>;
}

export default function VerifyPage(props: Props) {
  return (
    <Suspense fallback={null}>
      <VerifyContent {...props} />
    </Suspense>
  );
}

async function VerifyContent({ params }: Props) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : defaultLocale;
  const { data: member } = await getCurrentMember();
  if (!member) redirect("/login?next=/dashboard/verify");

  const t = await getTranslations({ locale, namespace: "verification.page" });
  const tLevels = await getTranslations({
    locale,
    namespace: "verification.levels",
  });
  const tTooltips = await getTranslations({
    locale,
    namespace: "verification.tooltips",
  });

  // Pull the latest verification_requests row for this member - either
  // a pending request we should surface as "under review", or the most
  // recent rejection so the member knows where they stand.
  const supabase = (await createClient()) as unknown as {
    from: (t: string) => any;
  };
  const { data: latestRequest } = await supabase
    .from("verification_requests")
    .select("*")
    .eq("member_id", member.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const role = member.member_type as
    | "nomad"
    | "remote_worker"
    | "local_guide"
    | "tour_guide"
    | null;
  const canApply = isHostRole(role) || member.is_agent === true;
  const currentLevel = isVerificationLevel(member.verification_level)
    ? member.verification_level
    : "basic";

  return (
    <section className="bg-ink-0 py-12 lg:py-16">
      <Container className="max-w-2xl">
        <p className="font-mono text-[11px] uppercase tracking-wider text-paper-mute">
          {t("currentLabel")}
        </p>
        <div className="mt-3 flex items-center gap-3">
          <VerificationBadge
            level={currentLevel}
            label={tLevels(currentLevel)}
            tooltip={tTooltips(currentLevel)}
            size="md"
            showBasic
          />
        </div>

        <h1 className="mt-6 font-display text-display-lg leading-tight text-paper">
          {t("title")}
        </h1>
        <p className="mt-3 max-w-prose text-[15px] text-paper-dim">
          {t("intro")}
        </p>

        {!canApply ? (
          <div className="mt-8 rounded-md border border-ink-3 bg-ink-1 p-4 text-[14px] leading-[1.6] text-paper-dim">
            {t.rich("trustedNote", {
              strong: (chunks) => <strong>{chunks}</strong>,
            })}
          </div>
        ) : latestRequest && latestRequest.status === "pending" ? (
          <PendingState
            level={latestRequest.requested_level}
            createdAt={latestRequest.created_at}
            requestId={latestRequest.id}
            locale={locale}
          />
        ) : latestRequest && latestRequest.status === "rejected" ? (
          <RejectedThenForm
            currentLevel={currentLevel}
            isAgent={member.is_agent === true}
            locale={locale}
          />
        ) : currentLevel === "trusted" ? (
          <div className="mt-8 rounded-md border border-gold/40 bg-gold/5 p-4 text-[14px] leading-[1.6] text-paper">
            {t("trustedNote")}
          </div>
        ) : (
          <VerifyForm
            currentLevel={currentLevel}
            isAgent={member.is_agent === true}
          />
        )}
      </Container>
    </section>
  );
}

async function PendingState({
  level,
  createdAt,
  requestId,
  locale,
}: {
  level: string;
  createdAt: string;
  requestId: string;
  locale: Locale;
}) {
  const t = await getTranslations({ locale, namespace: "verification.page" });
  const tLevels = await getTranslations({
    locale,
    namespace: "verification.levels",
  });
  const dateFmt = new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  return (
    <div className="mt-8 rounded-md border border-sky-500/40 bg-sky-500/5 p-5">
      <h2 className="font-display text-xl text-paper">{t("pendingTitle")}</h2>
      <p className="mt-2 text-[14px] leading-[1.6] text-paper-dim">
        {t("pendingBody", {
          level: tLevels(level as "verified" | "trusted"),
          date: dateFmt.format(new Date(createdAt)),
        })}
      </p>
      <p className="mt-3 font-mono text-[10px] uppercase tracking-wider text-paper-faint">
        #{requestId.slice(0, 8)}
      </p>
    </div>
  );
}

async function RejectedThenForm({
  currentLevel,
  isAgent,
  locale,
}: {
  currentLevel: "basic" | "verified" | "trusted";
  isAgent: boolean;
  locale: Locale;
}) {
  const t = await getTranslations({ locale, namespace: "verification.page" });
  return (
    <>
      <div className="mt-8 rounded-md border border-terracotta/40 bg-terracotta/5 p-4">
        <h2 className="font-display text-lg text-paper">
          {t("rejectedTitle")}
        </h2>
        <p className="mt-1 text-[13px] text-paper-dim">{t("rejectedBody")}</p>
      </div>
      <div className="mt-6">
        <VerifyForm currentLevel={currentLevel} isAgent={isAgent} />
      </div>
    </>
  );
}
