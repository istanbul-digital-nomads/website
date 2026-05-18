"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { ArrowRight, Search, Calendar, Clock, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils";
import type { Locale } from "@/lib/i18n/config";
import type { BlogPostMeta } from "@/lib/blog";

interface BlogListingProps {
  posts: BlogPostMeta[];
  allTags: string[];
}

export function BlogListing({ posts, allTags }: BlogListingProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tagFromUrl = searchParams.get("tag");
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(
    tagFromUrl && allTags.includes(tagFromUrl) ? tagFromUrl : null,
  );
  const t = useTranslations("blogIndexPage");
  const tTags = useTranslations("blogTags");
  const labelForTag = (slug: string) => (tTags.has(slug) ? tTags(slug) : slug);
  const locale = useLocale() as Locale;

  const selectTag = useCallback(
    (tag: string | null) => {
      setActiveTag(tag);
      const url = tag ? `/blog?tag=${encodeURIComponent(tag)}` : "/blog";
      router.replace(url, { scroll: false });
    },
    [router],
  );

  const filtered = posts.filter((post) => {
    const matchesSearch =
      search === "" ||
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.description.toLowerCase().includes(search.toLowerCase());
    const matchesTag = !activeTag || post.tags.includes(activeTag);
    return matchesSearch && matchesTag;
  });
  const tCommon = useTranslations("common");

  return (
    <div>
      {/* Search + Tag Filters */}
      <div className="mb-8 space-y-4">
        <div className="relative">
          <Search className="absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5d6d7e] dark:text-[#99a3ad]" />
          <input
            type="text"
            placeholder={t("search.placeholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-primary-200/40 bg-white/70 py-3 pe-4 ps-11 text-start text-sm text-[#1a1a2e] placeholder:text-[#5d6d7e]/60 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-[rgba(44,62,80,0.12)] dark:bg-[#1a1a2e] dark:text-[#f2f3f4] dark:placeholder:text-[#99a3ad]/60"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => selectTag(null)}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition-colors",
              !activeTag
                ? "bg-primary-600 text-white shadow-[0_6px_20px_rgba(192,57,43,0.15)] dark:bg-primary-500"
                : "bg-white/70 text-[#5d6d7e] ring-1 ring-black/5 hover:bg-primary-50 hover:text-primary-700 dark:bg-[#1a1a2e] dark:text-[#99a3ad] dark:ring-white/5 dark:hover:bg-primary-950/30",
            )}
          >
            {t("search.allPosts")}
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => selectTag(activeTag === tag ? null : tag)}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                activeTag === tag
                  ? "bg-primary-600 text-white shadow-[0_6px_20px_rgba(192,57,43,0.15)] dark:bg-primary-500"
                  : "bg-white/70 text-[#5d6d7e] ring-1 ring-black/5 hover:bg-primary-50 hover:text-primary-700 dark:bg-[#1a1a2e] dark:text-[#99a3ad] dark:ring-white/5 dark:hover:bg-primary-950/30",
              )}
            >
              {labelForTag(tag)}
            </button>
          ))}
        </div>
      </div>

      {/* Posts */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-primary-200/50 bg-primary-50/30 p-12 text-center dark:border-primary-900/30 dark:bg-primary-950/10">
          <p className="text-[#5d6d7e] dark:text-[#99a3ad]">
            {t("search.noResults")}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex h-full flex-col overflow-hidden rounded-md border border-black/10 bg-white transition-[border-color,background-color,box-shadow,transform] hover:-translate-y-0.5 hover:border-primary-300/70 hover:bg-white/95 hover:shadow-[0_18px_48px_rgba(20,17,15,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#fbfaf8] dark:border-white/10 dark:bg-[#1a1612] dark:hover:border-primary-500/35 dark:hover:bg-[rgba(60,40,30,0.35)] dark:hover:shadow-none dark:focus-visible:ring-offset-[#14110f]"
            >
              {post.coverImage ? (
                <div className="relative aspect-[16/10] overflow-hidden bg-[#1a1612]">
                  <Image
                    src={post.coverImage.src}
                    alt={post.coverImage.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 420px"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent" />
                </div>
              ) : null}
              <div className="flex flex-1 flex-col p-5">
                <div className="flex flex-wrap gap-1.5">
                  {post.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-primary-100/60 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-primary-700 dark:bg-primary-900/20 dark:text-primary-200"
                    >
                      {labelForTag(tag)}
                    </span>
                  ))}
                </div>
                <h2 className="mt-3 line-clamp-2 text-lg font-semibold leading-tight text-[#1a1a2e] dark:text-[#f2f3f4]">
                  {post.title}
                </h2>
                <p className="mt-2 line-clamp-3 flex-1 text-sm leading-6 text-[#5d6d7e] dark:text-[#99a3ad]">
                  {post.description}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-black/5 pt-4 text-xs text-[#5d6d7e] dark:border-white/5 dark:text-[#99a3ad]">
                  <span className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {post.author}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(post.date, undefined, locale)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {post.readingTime}
                  </span>
                </div>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary-700 transition-colors group-hover:text-primary-600 dark:text-primary-300 dark:group-hover:text-primary-200">
                  {tCommon("readMore")}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
