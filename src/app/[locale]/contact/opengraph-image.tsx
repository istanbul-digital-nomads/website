import { renderOgImage, ogSize, ogContentType } from "@/lib/og-image";

export const runtime = "edge";
export const size = ogSize;
export const contentType = ogContentType;
export const alt = "Contact Istanbul Digital Nomads";

export default function Image() {
  return renderOgImage({
    category: "Contact",
    title: "Get in touch",
    description:
      "Questions, partnerships, or press? Reach out and we'll get back to you.",
  });
}
