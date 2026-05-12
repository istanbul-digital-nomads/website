import { renderOgImage, ogLocale, ogSize, ogContentType } from "@/lib/og-image";
import { getBlogPost } from "@/lib/blog";
import { getTranslations } from "next-intl/server";
import { isValidLocale, defaultLocale } from "@/lib/i18n/config";

export const runtime = "nodejs";
export const size = ogSize;
export const contentType = ogContentType;
export const alt = "Istanbul Digital Nomads Blog";

interface Props {
  params: { locale: string; slug: string };
}

export default async function Image({ params }: Props) {
  const locale = ogLocale(
    isValidLocale(params.locale) ? params.locale : defaultLocale,
  );
  const post = getBlogPost(params.slug, locale);
  const t = await getTranslations({ locale, namespace: "og" });
  return renderOgImage({
    category: t("blogDetail.category"),
    title: post?.meta.title ?? "Istanbul Digital Nomads",
    description: post?.meta.description,
    tagline: t("tagline"),
  });
}
