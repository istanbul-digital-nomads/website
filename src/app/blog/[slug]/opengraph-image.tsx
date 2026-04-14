import { renderOgImage, ogSize, ogContentType } from "@/lib/og-image";
import { getBlogPost } from "@/lib/blog";

export const runtime = "nodejs";
export const size = ogSize;
export const contentType = ogContentType;
export const alt = "Istanbul Digital Nomads Blog";

interface Props {
  params: { slug: string };
}

export default function Image({ params }: Props) {
  const post = getBlogPost(params.slug);
  return renderOgImage({
    category: "Blog",
    title: post?.meta.title ?? "Istanbul Digital Nomads",
    description: post?.meta.description,
  });
}
