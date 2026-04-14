import { renderOgImage, ogSize, ogContentType } from "@/lib/og-image";

export const runtime = "edge";
export const size = ogSize;
export const contentType = ogContentType;
export const alt = "About Istanbul Digital Nomads";

export default function Image() {
  return renderOgImage({
    category: "About",
    title: "The Istanbul Digital Nomads story",
    description:
      "Why we built this community and how we help newcomers land well in Istanbul.",
  });
}
