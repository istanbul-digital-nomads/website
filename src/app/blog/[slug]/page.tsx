import type { Metadata } from "next";
import Image from "next/image";
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
    openGraph: post.meta.coverImage
      ? {
          images: [
            {
              url: post.meta.coverImage.src,
              alt: post.meta.coverImage.alt,
            },
          ],
        }
      : undefined,
    twitter: post.meta.coverImage
      ? {
          card: "summary_large_image",
          images: [post.meta.coverImage.src],
        }
      : undefined,
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
            <nav className="mb-6 flex items-center gap-2 text-sm text-[#5d6d7e] dark:text-[#99a3ad]">
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
              <span className="truncate text-[#1a1a2e] dark:text-[#f2f3f4]">
                {post.meta.title}
              </span>
            </nav>

            {/* Header */}
            <h1 className="text-3xl font-bold tracking-tight text-[#1a1a2e] sm:text-4xl dark:text-[#f2f3f4]">
              {post.meta.title}
            </h1>
            <p className="mt-4 text-lg text-[#5d6d7e] dark:text-[#99a3ad]">
              {post.meta.description}
            </p>

            {/* Meta */}
            <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-[#5d6d7e] dark:text-[#99a3ad]">
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

            {post.meta.coverImage ? (
              <figure className="mt-10 overflow-hidden rounded-xl border border-black/10 bg-white/60 dark:border-white/10 dark:bg-white/5">
                <div className="relative aspect-[16/9]">
                  <Image
                    src={post.meta.coverImage.src}
                    alt={post.meta.coverImage.alt}
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 768px"
                    className="object-cover"
                  />
                </div>
                <figcaption className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-xs text-[#5d6d7e] dark:text-[#99a3ad]">
                  <span>{post.meta.coverImage.alt}</span>
                  <a
                    href={post.meta.coverImage.credit.sourceHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium underline decoration-dotted underline-offset-2 hover:text-primary-600 dark:hover:text-primary-300"
                  >
                    {post.meta.coverImage.credit.author} /{" "}
                    {post.meta.coverImage.credit.source}
                  </a>
                </figcaption>
              </figure>
            ) : null}

            {/* Content */}
            <article className="mt-10">
              <MDXRemote source={post.content} components={mdxComponents} />
            </article>

            {/* Back to blog */}
            <div className="mt-12 border-t border-primary-200/30 pt-8 dark:border-[rgba(44,62,80,0.1)]">
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
