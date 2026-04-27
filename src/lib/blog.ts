import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { getBlogCoverImage, type BlogCoverImage } from "@/lib/blog-covers";

const BLOG_DIR = path.join(process.cwd(), "src/content/blog");

export interface BlogPostMeta {
  slug: string;
  title: string;
  description: string;
  author: string;
  date: string;
  tags: string[];
  readingTime: string;
  coverImage?: BlogCoverImage;
}

interface BlogFrontmatter {
  title?: string;
  description?: string;
  author?: string;
  date?: string;
  tags?: string[];
}

function estimateReadingTime(content: string): string {
  const words = content.split(/\s+/).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}

export function getAllBlogPosts(): BlogPostMeta[] {
  if (!fs.existsSync(BLOG_DIR)) return [];

  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".mdx"));

  const posts = files.map((file) => {
    const slug = file.replace(".mdx", "");
    const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf-8");
    const { content, data } = matter(raw);
    const fm = data as BlogFrontmatter;

    return {
      slug,
      title: fm.title || slug,
      description: fm.description || "",
      author: fm.author || "Istanbul Digital Nomads",
      date: fm.date || "2026-01-01",
      tags: fm.tags || [],
      readingTime: estimateReadingTime(content),
      coverImage: getBlogCoverImage(slug),
    };
  });

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

export function getBlogPost(slug: string) {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { content, data } = matter(raw);
  const fm = data as BlogFrontmatter;

  return {
    content,
    meta: {
      slug,
      title: fm.title || slug,
      description: fm.description || "",
      author: fm.author || "Istanbul Digital Nomads",
      date: fm.date || "2026-01-01",
      tags: fm.tags || [],
      readingTime: estimateReadingTime(content),
      coverImage: getBlogCoverImage(slug),
    } satisfies BlogPostMeta,
  };
}

export function getAllTags(): string[] {
  const posts = getAllBlogPosts();
  const tags = new Set<string>();
  posts.forEach((post) => post.tags.forEach((tag) => tags.add(tag)));
  return Array.from(tags).sort();
}
