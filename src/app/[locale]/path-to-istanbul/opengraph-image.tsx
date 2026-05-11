import { renderOgImage, ogSize, ogContentType } from "@/lib/og-image";

export const runtime = "edge";
export const size = ogSize;
export const contentType = ogContentType;
export const alt = "Path to Istanbul - Relocation Guides by Country";

export default function Image() {
  return renderOgImage({
    category: "Path to Istanbul",
    title: "Find your path to Istanbul",
    description:
      "Country-specific playbooks for visa, flights, housing, banking, and community - everything you need to land well.",
  });
}
