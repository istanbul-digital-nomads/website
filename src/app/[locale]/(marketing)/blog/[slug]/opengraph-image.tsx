import { renderOgImage, ogSize, ogContentType } from "@/lib/og-image";
import { getBlogPost } from "@/lib/blog";
import { getTranslations } from "next-intl/server";
import { isValidLocale, defaultLocale } from "@/lib/i18n/config";

export const size = ogSize;
export const contentType = ogContentType;
export const alt = "Istanbul Nomads Blog";

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export default async function Image({ params }: Props) {
  const { locale: rawLocale, slug } = await params;
  const locale = isValidLocale(rawLocale) ? rawLocale : defaultLocale;
  const post = getBlogPost(slug, locale);
  const t = await getTranslations({ locale, namespace: "og" });
  return renderOgImage({
    locale,
    category: t("blogDetail.category"),
    title: post?.meta.title ?? "Istanbul Nomads",
    description: post?.meta.description,
    tagline: t("tagline"),
  });
}
