import { renderOgImage, ogSize, ogContentType } from "@/lib/og-image";

export const runtime = "edge";
export const size = ogSize;
export const contentType = ogContentType;
export const alt = "Istanbul Nomad Events";

export default function Image() {
  return renderOgImage({
    category: "Events",
    title: "Weekly coworking and monthly meetups",
    description:
      "Real people, real places. Join a session this week and meet the community.",
  });
}
