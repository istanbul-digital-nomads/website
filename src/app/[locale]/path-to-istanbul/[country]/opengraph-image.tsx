import { renderOgImage, ogSize, ogContentType } from "@/lib/og-image";
import { getCountryBySlug } from "@/lib/path-to-istanbul";
import { getPathContent } from "@/lib/path-to-istanbul-content";
import { isValidLocale, defaultLocale } from "@/lib/i18n/config";

export const runtime = "nodejs";
export const size = ogSize;
export const contentType = ogContentType;
export const alt = "Moving to Istanbul";

interface Props {
  params: { locale: string; country: string };
}

export default function Image({ params }: Props) {
  const locale = isValidLocale(params.locale) ? params.locale : defaultLocale;
  const country = getCountryBySlug(params.country);
  const content = country ? getPathContent(country.slug, locale) : null;
  const title = country
    ? `Moving to Istanbul from ${country.name}`
    : "Path to Istanbul";
  const description =
    content?.frontmatter.summary ??
    (country
      ? `Visa, flights, housing, and community for ${country.name}-born nomads moving to Istanbul.`
      : undefined);

  return renderOgImage({
    category: `${country?.flag ?? ""} Path to Istanbul`.trim(),
    title,
    description,
  });
}
