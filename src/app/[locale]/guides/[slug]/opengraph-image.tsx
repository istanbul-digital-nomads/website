import { renderOgImage, ogSize, ogContentType } from "@/lib/og-image";
import { guides } from "@/lib/data";
import { getGuideContent } from "@/lib/guides";
import { getTranslations } from "next-intl/server";
import { isValidLocale, defaultLocale } from "@/lib/i18n/config";

export const size = ogSize;
export const contentType = ogContentType;
export const alt = "Istanbul City Guide";

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export default async function Image({ params }: Props) {
  const { locale: rawLocale, slug } = await params;
  const locale = isValidLocale(rawLocale) ? rawLocale : defaultLocale;
  const guide = guides.find((g) => g.slug === slug);
  const guideContent = guide ? getGuideContent(slug, locale) : null;
  const t = await getTranslations({ locale, namespace: "og" });
  const tGuides = await getTranslations({ locale, namespace: "guides" });
  return renderOgImage({
    locale,
    category: t("guideDetail.category"),
    title:
      guideContent?.frontmatter.title ??
      (guide ? tGuides(`${guide.slug}.title`) : t("guideDetail.fallbackTitle")),
    description:
      guideContent?.frontmatter.description ??
      (guide ? tGuides(`${guide.slug}.description`) : undefined),
    tagline: t("tagline"),
  });
}
