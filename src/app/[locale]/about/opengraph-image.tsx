import { renderOgImage, ogLocale, ogSize, ogContentType } from "@/lib/og-image";
import { getTranslations } from "next-intl/server";
import { isValidLocale, defaultLocale } from "@/lib/i18n/config";

export const runtime = "edge";
export const size = ogSize;
export const contentType = ogContentType;
export const alt = "About Istanbul Digital Nomads";

interface Props {
  params: { locale: string };
}

export default async function Image({ params }: Props) {
  const locale = ogLocale(
    isValidLocale(params.locale) ? params.locale : defaultLocale,
  );
  const t = await getTranslations({ locale, namespace: "og" });
  return renderOgImage({
    category: t("about.category"),
    title: t("about.title"),
    description: t("about.description"),
    tagline: t("tagline"),
  });
}
