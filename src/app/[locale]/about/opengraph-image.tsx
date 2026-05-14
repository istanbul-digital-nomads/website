import { renderOgImage, ogSize, ogContentType } from "@/lib/og-image";
import { getTranslations } from "next-intl/server";
import { isValidLocale, defaultLocale } from "@/lib/i18n/config";

export const size = ogSize;
export const contentType = ogContentType;
export const alt = "About Istanbul Digital Nomads";

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function Image({ params }: Props) {
  const { locale: rawLocale } = await params;
  const locale = isValidLocale(rawLocale) ? rawLocale : defaultLocale;
  const t = await getTranslations({ locale, namespace: "og" });
  return renderOgImage({
    locale,
    category: t("about.category"),
    title: t("about.title"),
    description: t("about.description"),
    tagline: t("tagline"),
  });
}
