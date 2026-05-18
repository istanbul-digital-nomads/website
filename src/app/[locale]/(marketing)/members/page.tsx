import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getMembersPublic } from "@/lib/supabase/queries";
import { isValidLocale, defaultLocale, type Locale } from "@/lib/i18n/config";
import { alternatesFor } from "@/lib/seo";
import { MembersEditorial } from "@/components/sections/members/members-editorial";

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
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : defaultLocale;
  const { data } = await getMembersPublic();
  const members = data ?? [];

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
    <MembersEditorial
      locale={locale}
      members={members}
      hoodOrder={HOOD_ORDER}
    />
  );
}
