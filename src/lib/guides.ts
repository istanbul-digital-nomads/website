import fs from "fs";
import path from "path";
import matter from "gray-matter";

const GUIDES_DIR = path.join(process.cwd(), "src/content/guides");

interface GuideFrontmatter {
  title?: string;
  description?: string;
  lastUpdated?: string;
}

export function getGuideContent(slug: string) {
  const filePath = path.join(GUIDES_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { content, data } = matter(raw);
  return { content, frontmatter: data as GuideFrontmatter };
}

export function hasGuideContent(slug: string): boolean {
  return fs.existsSync(path.join(GUIDES_DIR, `${slug}.mdx`));
}
