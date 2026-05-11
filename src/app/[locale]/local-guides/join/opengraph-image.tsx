import { renderOgImage, ogSize, ogContentType } from "@/lib/og-image";

export const runtime = "edge";
export const size = ogSize;
export const contentType = ogContentType;
export const alt = "Become a Local Guide";

export default function Image() {
  return renderOgImage({
    category: "Local Guides",
    title: "Become a local guide",
    description:
      "Help the next person from your country land well. Apply to join the guide network.",
  });
}
