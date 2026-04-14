import fs from "fs";
import path from "path";
import matter from "gray-matter";

const CONTENT_DIR = path.join(process.cwd(), "src/content/path-to-istanbul");

export interface HeroStat {
  label: string;
  value: string;
}

export interface PathFrontmatter {
  country: string;
  countryCode: string;
  slug: string;
  flag: string;
  lastUpdated?: string;
  summary: string;
  heroStats?: HeroStat[];
  relatedGuides?: string[];
  relatedPosts?: string[];
}

export function getPathContent(slug: string) {
  const filePath = path.join(CONTENT_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf-8");
  const { content, data } = matter(raw);
  return { content, frontmatter: data as PathFrontmatter };
}

export function hasPathContent(slug: string): boolean {
  return fs.existsSync(path.join(CONTENT_DIR, `${slug}.mdx`));
}
