import { renderOgImage, ogSize, ogContentType } from "@/lib/og-image";

export const runtime = "edge";
export const size = ogSize;
export const contentType = ogContentType;
export const alt = "Istanbul City Guides";

export default function Image() {
  return renderOgImage({
    category: "City Guides",
    title: "Istanbul, without the guesswork",
    description:
      "Visa, housing, transport, cost of living - the answers we'd give a friend moving here.",
  });
}
