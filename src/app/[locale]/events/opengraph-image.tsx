import { renderOgImage, ogSize, ogContentType } from "@/lib/og-image";
import { getTranslations } from "next-intl/server";
import { isValidLocale, defaultLocale } from "@/lib/i18n/config";

export const runtime = "nodejs";
export const size = ogSize;
export const contentType = ogContentType;
export const alt = "Istanbul Nomad Events";

interface Props {
  params: { locale: string };
}

export default async function Image({ params }: Props) {
  const locale = isValidLocale(params.locale) ? params.locale : defaultLocale;
  const t = await getTranslations({ locale, namespace: "og" });
  return renderOgImage({
    locale,
    category: t("events.category"),
    title: t("events.title"),
    description: t("events.description"),
    tagline: t("tagline"),
  });
}
