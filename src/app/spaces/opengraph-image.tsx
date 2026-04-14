import { renderOgImage, ogSize, ogContentType } from "@/lib/og-image";

export const runtime = "edge";
export const size = ogSize;
export const contentType = ogContentType;
export const alt = "Istanbul Coworking Spaces";

export default function Image() {
  return renderOgImage({
    category: "Spaces",
    title: "Coworking spaces, rated by nomads",
    description:
      "Wifi, noise, coffee, and vibe - scored by people who actually worked there.",
  });
}
