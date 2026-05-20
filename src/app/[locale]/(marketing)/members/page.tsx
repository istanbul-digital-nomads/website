import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getMembersPublic } from "@/lib/supabase/queries";
import { isValidLocale, defaultLocale, type Locale } from "@/lib/i18n/config";
import { alternatesFor } from "@/lib/seo";
import { MembersEditorial } from "@/components/sections/members/members-editorial";
import { BadgeLegend } from "@/components/sections/how-it-works/badge-legend";
import { isMemberRole } from "@/lib/member-roles";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : defaultLocale;
  const t = await getTranslations({ locale, namespace: "membersV2" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: alternatesFor(locale, "/members"),
  };
}

export default async function MembersPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ role?: string; agent?: string }>;
}) {
  const { locale: rawLocale } = await params;
  const { role: roleParam, agent: agentParam } = await searchParams;
  const activeRole = isMemberRole(roleParam) ? roleParam : null;
  const activeAgentOnly = agentParam === "1";
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : defaultLocale;
  const { data } = await getMembersPublic();
  const members = (data ?? []).filter((m) => {
    if (activeRole && m.member_type !== activeRole) return false;
    if (activeAgentOnly && !m.is_agent) return false;
    return true;
  });

  // Preferred hood ordering matches the hero map's tour stops where
  // possible, then falls through to whatever else is in the data.
  const HOOD_ORDER = [
    "Kadıköy",
    "Kadikoy",
    "Beyoğlu",
    "Beyoglu",
    "Karaköy",
    "Karakoy",
    "Cihangir",
    "Beşiktaş",
    "Besiktas",
    "Moda",
    "Üsküdar",
    "Uskudar",
    "Ortaköy",
    "Ortakoy",
    "Sultanahmet",
    "Şişli",
    "Sisli",
    "Balat",
  ];

  return (
    <>
      <MembersEditorial
        locale={locale}
        members={members}
        hoodOrder={HOOD_ORDER}
        activeRole={activeRole}
        activeAgentOnly={activeAgentOnly}
      />
      <section className="bg-deep-water font-grotesk text-cream">
        <div className="mx-auto max-w-[1320px] px-6 pb-20 md:px-10">
          <BadgeLegend locale={locale} />
        </div>
      </section>
    </>
  );
}
