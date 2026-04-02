import type { Metadata } from "next";
import Link from "next/link";
import { Calendar, Clock, User, ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { mdxComponents } from "@/components/ui/mdx-components";
import { getAllBlogPosts, getBlogPost } from "@/lib/blog";
import { formatDate } from "@/lib/utils";

interface BlogPostPageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  const posts = getAllBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const post = getBlogPost(params.slug);
  if (!post) return {};
  return {
    title: post.meta.title,
    description: post.meta.description,
  };
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = getBlogPost(params.slug);
  if (!post) notFound();

  return (
    <section className="py-16 md:py-24">
      <Container>
        <Reveal>
          <div className="mx-auto max-w-3xl">
            {/* Breadcrumb */}
            <nav className="mb-6 flex items-center gap-2 text-sm text-[#6b6257] dark:text-[#b8a898]">
              <Link
                href="/"
                className="transition-colors hover:text-primary-600 dark:hover:text-primary-400"
              >
                Home
              </Link>
              <span>/</span>
              <Link
                href="/blog"
                className="transition-colors hover:text-primary-600 dark:hover:text-primary-400"
              >
                Blog
              </Link>
              <span>/</span>
              <span className="truncate text-[#2a2018] dark:text-[#f7f2ea]">
                {post.meta.title}
              </span>
            </nav>

            {/* Header */}
            <h1 className="text-3xl font-bold tracking-tight text-[#2a2018] sm:text-4xl dark:text-[#f7f2ea]">
              {post.meta.title}
            </h1>
            <p className="mt-4 text-lg text-[#6b6257] dark:text-[#b8a898]">
              {post.meta.description}
            </p>

            {/* Meta */}
            <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-[#6b6257] dark:text-[#b8a898]">
              <span className="flex items-center gap-1.5">
                <User className="h-4 w-4" />
                {post.meta.author}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {formatDate(post.meta.date)}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {post.meta.readingTime}
              </span>
            </div>

            {/* Tags */}
            <div className="mt-4 flex flex-wrap gap-2">
              {post.meta.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/blog?tag=${tag}`}
                  className="rounded-full bg-primary-100/60 px-3 py-1 text-xs font-medium capitalize text-primary-700 transition-colors hover:bg-primary-200/60 dark:bg-primary-900/20 dark:text-primary-300 dark:hover:bg-primary-900/40"
                >
                  {tag}
                </Link>
              ))}
            </div>

            {/* Content */}
            <article className="mt-10">
              <MDXRemote source={post.content} components={mdxComponents} />
            </article>

            {/* Back to blog */}
            <div className="mt-12 border-t border-primary-200/30 pt-8 dark:border-[rgba(200,100,60,0.1)]">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-sm font-medium text-primary-600 transition-colors hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to all posts
              </Link>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
