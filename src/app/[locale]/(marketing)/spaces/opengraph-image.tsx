import { renderOgImage, ogSize, ogContentType } from "@/lib/og-image";
import { getTranslations } from "next-intl/server";
import { isValidLocale, defaultLocale } from "@/lib/i18n/config";

export const size = ogSize;
export const contentType = ogContentType;
export const alt = "Istanbul Coworking Spaces";

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function Image({ params }: Props) {
  const { locale: rawLocale } = await params;
  const locale = isValidLocale(rawLocale) ? rawLocale : defaultLocale;
  const t = await getTranslations({ locale, namespace: "og" });
  return renderOgImage({
    locale,
    category: t("spaces.category"),
    title: t("spaces.title"),
    description: t("spaces.description"),
    tagline: t("tagline"),
  });
}
