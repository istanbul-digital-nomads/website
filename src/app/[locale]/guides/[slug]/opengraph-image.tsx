import { renderOgImage, ogSize, ogContentType } from "@/lib/og-image";
import { guides } from "@/lib/data";

export const runtime = "nodejs";
export const size = ogSize;
export const contentType = ogContentType;
export const alt = "Istanbul City Guide";

interface Props {
  params: { slug: string };
}

export default function Image({ params }: Props) {
  const guide = guides.find((g) => g.slug === params.slug);
  return renderOgImage({
    category: "City Guide",
    title: guide?.title ?? "Istanbul City Guide",
    description: guide?.description,
  });
}
