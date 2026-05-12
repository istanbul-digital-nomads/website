import { renderOgImage, ogSize, ogContentType } from "@/lib/og-image";

export const runtime = "edge";
export const size = ogSize;
export const contentType = ogContentType;
export const alt = "Istanbul Digital Nomads";

export default function Image() {
  return renderOgImage({
    category: "Remote life, local rhythm",
    title: "Find your rhythm in Istanbul",
    description:
      "Weekly coworking, practical city guides, and a community of remote workers who help each other settle in.",
  });
}
