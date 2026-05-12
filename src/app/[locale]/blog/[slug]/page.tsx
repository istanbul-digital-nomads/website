import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, User, ArrowLeft, Languages } from "lucide-react";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { mdxComponents } from "@/components/ui/mdx-components";
import { getAllBlogPosts, getBlogPost } from "@/lib/blog";
import {
  isValidLocale,
  defaultLocale,
  localeNames,
  type Locale,
} from "@/lib/i18n/config";
import { formatDate } from "@/lib/utils";
import { mdxOptions } from "@/lib/mdx-options";

const SITE_URL = "https://istanbulnomads.com";

interface BlogPostPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

function plainText(markdown: string): string {
  return markdown
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*_`>#-]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function extractFaqs(
  content: string,
): Array<{ question: string; answer: string }> {
  const faqStart = content.search(/^## FAQ\s*$/m);
  if (faqStart === -1) return [];

  const faqContent = content.slice(faqStart);
  const sectionEnd = faqContent.slice(1).search(/^## (?!#)/m);
  const section =
    sectionEnd === -1 ? faqContent : faqContent.slice(0, sectionEnd + 1);
  const entries = section.split(/^### /m).slice(1);

  return entries
    .map((entry) => {
      const [question = "", ...answerLines] = entry.split("\n");
      return {
        question: plainText(question),
        answer: plainText(answerLines.join("\n")),
      };
    })
    .filter((item) => item.question && item.answer);
}

export async function generateStaticParams() {
  const posts = getAllBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { locale: localeParam, slug } = await params;
  const locale = isValidLocale(localeParam) ? localeParam : defaultLocale;
  const post = getBlogPost(slug, locale);
  if (!post) return {};
  return {
    title: post.meta.title,
    description: post.meta.description,
    keywords: post.meta.keywords ?? post.meta.tags,
    alternates: {
      canonical: `/blog/${post.meta.slug}`,
    },
    openGraph: post.meta.coverImage
      ? {
          type: "article",
          url: `${SITE_URL}/blog/${post.meta.slug}`,
          title: post.meta.title,
          description: post.meta.description,
          publishedTime: post.meta.date,
          authors: [post.meta.author],
          tags: post.meta.tags,
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

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { locale: localeParam, slug } = await params;
  const locale: Locale = isValidLocale(localeParam)
    ? localeParam
    : defaultLocale;
  const post = getBlogPost(slug, locale);
  if (!post) notFound();

  const t = await getTranslations("blogPostPage");
  const canonicalUrl = `${SITE_URL}/blog/${post.meta.slug}`;
  const faqs = extractFaqs(post.content);
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${canonicalUrl}#article`,
        headline: post.meta.title,
        description: post.meta.description,
        url: canonicalUrl,
        datePublished: post.meta.date,
        dateModified: post.meta.date,
        inLanguage: post.meta.translated ? locale : defaultLocale,
        author: {
          "@type": "Person",
          name: post.meta.author,
        },
        publisher: {
          "@type": "Organization",
          name: "Istanbul Digital Nomads",
          url: SITE_URL,
        },
        image: post.meta.coverImage
          ? `${SITE_URL}${post.meta.coverImage.src}`
          : undefined,
        keywords: post.meta.keywords ?? post.meta.tags,
        articleSection: post.meta.tags,
        mainEntityOfPage: canonicalUrl,
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${canonicalUrl}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: SITE_URL,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Blog",
            item: `${SITE_URL}/blog`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: post.meta.title,
            item: canonicalUrl,
          },
        ],
      },
      ...(faqs.length
        ? [
            {
              "@type": "FAQPage",
              "@id": `${canonicalUrl}#faq`,
              mainEntity: faqs.map((faq) => ({
                "@type": "Question",
                name: faq.question,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: faq.answer,
                },
              })),
            },
          ]
        : []),
    ],
  };

  return (
    <section className="py-16 md:py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Container>
        <Reveal>
          <div className="mx-auto max-w-3xl">
            <nav className="mb-6 flex items-center gap-2 text-sm text-[#5d6d7e] dark:text-[#99a3ad]">
              <Link
                href="/"
                className="transition-colors hover:text-primary-600 dark:hover:text-primary-400"
              >
                {t("breadcrumb.home")}
              </Link>
              <span>/</span>
              <Link
                href="/blog"
                className="transition-colors hover:text-primary-600 dark:hover:text-primary-400"
              >
                {t("breadcrumb.blog")}
              </Link>
              <span>/</span>
              <span className="truncate text-[#1a1a2e] dark:text-[#f2f3f4]">
                {post.meta.title}
              </span>
            </nav>

            {!post.meta.translated && locale !== defaultLocale && (
              <div className="mb-6 flex items-start gap-3 rounded-md border border-amber-200/60 bg-amber-50/60 p-4 text-sm text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-100">
                <Languages className="mt-0.5 h-4 w-4 shrink-0" />
                <p>
                  {t("translationInProgress", {
                    language: localeNames[locale],
                  })}
                </p>
              </div>
            )}

            <h1 className="text-3xl font-bold tracking-tight text-[#1a1a2e] sm:text-4xl dark:text-[#f2f3f4]">
              {post.meta.title}
            </h1>
            <p className="mt-4 text-lg text-[#5d6d7e] dark:text-[#99a3ad]">
              {post.meta.description}
            </p>

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

            <article className="mt-10">
              <MDXRemote
                source={post.content}
                components={mdxComponents}
                options={mdxOptions}
              />
            </article>

            <div className="mt-12 border-t border-primary-200/30 pt-8 dark:border-[rgba(44,62,80,0.1)]">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-sm font-medium text-primary-600 transition-colors hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300"
              >
                <ArrowLeft className="h-4 w-4" />
                {t("backToBlog")}
              </Link>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
