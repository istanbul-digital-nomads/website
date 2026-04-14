import { renderOgImage, ogSize, ogContentType } from "@/lib/og-image";

export const runtime = "edge";
export const size = ogSize;
export const contentType = ogContentType;
export const alt = "Istanbul Local Guides";

export default function Image() {
  return renderOgImage({
    category: "Local Guides",
    title: "Meet people who made the move",
    description:
      "Locals and fellow nomads who can help you settle in faster - paperwork, neighborhoods, and community.",
  });
}
