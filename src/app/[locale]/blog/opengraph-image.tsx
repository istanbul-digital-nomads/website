import { renderOgImage, ogSize, ogContentType } from "@/lib/og-image";

export const runtime = "edge";
export const size = ogSize;
export const contentType = ogContentType;
export const alt = "Istanbul Digital Nomads Blog";

export default function Image() {
  return renderOgImage({
    category: "Blog",
    title: "Field notes from Istanbul",
    description:
      "Practical stories from nomads and locals - neighborhoods, cafes, visas, and the small things that make life here click.",
  });
}
