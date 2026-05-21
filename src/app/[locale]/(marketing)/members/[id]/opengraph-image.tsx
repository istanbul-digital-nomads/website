import { getTranslations } from "next-intl/server";
import { ogSize, ogContentType, renderOgImage } from "@/lib/og-image";
import { renderMemberOgImage } from "@/lib/og-member";
import { getMemberByIdPublic } from "@/lib/supabase/queries";
import { isValidLocale, defaultLocale } from "@/lib/i18n/config";
import { isVerificationLevel } from "@/lib/verification";

export const size = ogSize;
export const contentType = ogContentType;
export const alt = "Istanbul Nomads member";

interface Props {
  params: Promise<{ locale: string; id: string }>;
}

export default async function Image({ params }: Props) {
  const { locale: rawLocale, id } = await params;
  const locale = isValidLocale(rawLocale) ? rawLocale : defaultLocale;
  const t = await getTranslations({ locale, namespace: "og" });
  const { data: member } = await getMemberByIdPublic(id);

  // No member (deleted / hidden) -> generic brand card.
  if (!member) {
    return renderOgImage({
      locale,
      category: t("member.category"),
      title: "Istanbul Nomads",
      tagline: t("tagline"),
    });
  }

  const tRoles = await getTranslations({
    locale,
    namespace: "onboardingPage.steps.interests.memberTypeOptions",
  });
  const tLevels = await getTranslations({
    locale,
    namespace: "verification.levels",
  });

  const roleLabel = member.member_type ? tRoles(member.member_type) : undefined;
  const level = isVerificationLevel(member.verification_level)
    ? member.verification_level
    : "basic";
  const verifiedLabel = level !== "basic" ? tLevels(level) : undefined;

  return renderMemberOgImage({
    locale,
    category: t("member.category"),
    tagline: t("tagline"),
    displayName: member.display_name,
    roleLabel,
    location: member.location ?? undefined,
    verifiedLabel,
    avatarUrl: member.avatar_url,
  });
}
