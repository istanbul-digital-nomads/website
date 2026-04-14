import { renderOgImage, ogSize, ogContentType } from "@/lib/og-image";
import { getCountryBySlug } from "@/lib/path-to-istanbul";
import { getPathContent } from "@/lib/path-to-istanbul-content";

export const runtime = "nodejs";
export const size = ogSize;
export const contentType = ogContentType;
export const alt = "Moving to Istanbul";

interface Props {
  params: { country: string };
}

export default function Image({ params }: Props) {
  const country = getCountryBySlug(params.country);
  const content = country ? getPathContent(country.slug) : null;
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
