"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Calendar, Clock, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils";
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

  return (
    <div>
      {/* Search + Tag Filters */}
      <div className="mb-8 space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5d6d7e] dark:text-[#99a3ad]" />
          <input
            type="text"
            placeholder="Search posts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-primary-200/40 bg-white/70 py-3 pl-11 pr-4 text-sm text-[#1a1a2e] placeholder:text-[#5d6d7e]/60 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-[rgba(44,62,80,0.12)] dark:bg-[#1a1a2e] dark:text-[#f2f3f4] dark:placeholder:text-[#99a3ad]/60"
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
            All posts
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => selectTag(activeTag === tag ? null : tag)}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium capitalize transition-colors",
                activeTag === tag
                  ? "bg-primary-600 text-white shadow-[0_6px_20px_rgba(192,57,43,0.15)] dark:bg-primary-500"
                  : "bg-white/70 text-[#5d6d7e] ring-1 ring-black/5 hover:bg-primary-50 hover:text-primary-700 dark:bg-[#1a1a2e] dark:text-[#99a3ad] dark:ring-white/5 dark:hover:bg-primary-950/30",
              )}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Posts */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-primary-200/50 bg-primary-50/30 p-12 text-center dark:border-primary-900/30 dark:bg-primary-950/10">
          <p className="text-[#5d6d7e] dark:text-[#99a3ad]">
            No posts match your search. Try a different term or tag.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`}>
              <Card hoverable className="h-full">
                <CardContent>
                  <div className="flex flex-wrap gap-1.5">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-primary-100/60 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-primary-700 dark:bg-primary-900/20 dark:text-primary-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h2 className="mt-3 text-lg font-semibold text-[#1a1a2e] dark:text-[#f2f3f4]">
                    {post.title}
                  </h2>
                  <p className="mt-2 line-clamp-2 text-sm text-[#5d6d7e] dark:text-[#99a3ad]">
                    {post.description}
                  </p>
                  <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-[#5d6d7e] dark:text-[#99a3ad]">
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {post.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(post.date)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {post.readingTime}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
