import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { getAllBlogPosts, getAllTags } from "@/lib/blog";
import { BlogListing } from "./blog-listing";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Community stories, Istanbul tips, and remote work insights from digital nomads living in Istanbul.",
};

export default function BlogPage() {
  const posts = getAllBlogPosts();
  const allTags = getAllTags();

  return (
    <section className="py-16 md:py-24">
      <Container>
        <Reveal>
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Blog
            </h1>
            <p className="mt-4 text-lg text-[#5d6d7e] dark:text-[#99a3ad]">
              Stories, tips, and insights from remote workers living in
              Istanbul.
            </p>
          </div>

          <BlogListing posts={posts} allTags={allTags} />
        </Reveal>
      </Container>
    </section>
  );
}
