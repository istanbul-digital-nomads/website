import { renderOgImage, ogLocale, ogSize, ogContentType } from "@/lib/og-image";
import { getCountryBySlug } from "@/lib/path-to-istanbul";
import { getPathContent } from "@/lib/path-to-istanbul-content";
import { getTranslations } from "next-intl/server";
import { isValidLocale, defaultLocale } from "@/lib/i18n/config";

export const runtime = "nodejs";
export const size = ogSize;
export const contentType = ogContentType;
export const alt = "Moving to Istanbul";

interface Props {
  params: { locale: string; country: string };
}

export default async function Image({ params }: Props) {
  const locale = ogLocale(
    isValidLocale(params.locale) ? params.locale : defaultLocale,
  );
  const country = getCountryBySlug(params.country);
  const content = country ? getPathContent(country.slug, locale) : null;
  const t = await getTranslations({ locale, namespace: "og" });

  const categoryBase = t("pathToIstanbulCountry.category");
  const title = country
    ? t("pathToIstanbulCountry.titleTemplate", { country: country.name })
    : t("pathToIstanbulCountry.fallbackTitle");
  const description =
    content?.frontmatter.summary ??
    (country
      ? t("pathToIstanbulCountry.fallbackDescriptionTemplate", {
          country: country.name,
        })
      : undefined);

  return renderOgImage({
    locale,
    category: `${country?.flag ?? ""} ${categoryBase}`.trim(),
    title,
    description,
    tagline: t("tagline"),
  });
}
