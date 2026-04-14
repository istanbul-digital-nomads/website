"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Search, ArrowRight } from "lucide-react";
import { COUNTRIES, type Country } from "@/lib/path-to-istanbul";
import { cn } from "@/lib/utils";

const WorldMap = dynamic(
  () => import("./world-map").then((m) => m.WorldMap),
  {
    ssr: false,
    loading: () => (
      <div className="h-[420px] w-full animate-pulse rounded-2xl bg-neutral-100 dark:bg-white/5" />
    ),
  },
);

export function CountrySelector() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return [];
    const q = search.toLowerCase();
    return COUNTRIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q),
    ).slice(0, 8);
  }, [search]);

  const supported = COUNTRIES.filter((c) => c.supported);

  function handleSelect(country: Country) {
    if (country.supported) {
      router.push(`/path-to-istanbul/${country.slug}`);
    }
  }

  return (
    <div className="space-y-8">
      {/* Map */}
      <WorldMap />

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5d6d7e] dark:text-[#99a3ad]" />
        <input
          type="text"
          placeholder="Search your country..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-primary-200/40 bg-white/70 py-3 pl-11 pr-4 text-sm text-[#1a1a2e] placeholder:text-[#5d6d7e]/60 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-[rgba(44,62,80,0.12)] dark:bg-[#1a1a2e] dark:text-[#f2f3f4] dark:placeholder:text-[#99a3ad]/60"
        />
        {filtered.length > 0 && (
          <ul className="absolute left-0 right-0 top-full z-10 mt-2 max-h-80 overflow-y-auto rounded-xl border border-black/10 bg-white shadow-lg dark:border-white/10 dark:bg-[#1a1a2e]">
            {filtered.map((c) => (
              <li key={c.code}>
                <button
                  type="button"
                  onClick={() => handleSelect(c)}
                  disabled={!c.supported}
                  className={cn(
                    "flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-sm transition-colors",
                    c.supported
                      ? "hover:bg-primary-50 dark:hover:bg-primary-950/30"
                      : "cursor-not-allowed opacity-50",
                  )}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-xl" aria-hidden="true">
                      {c.flag}
                    </span>
                    <span className="text-[#1a1a2e] dark:text-[#f2f3f4]">
                      {c.name}
                    </span>
                  </span>
                  {c.supported ? (
                    <ArrowRight className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                  ) : (
                    <span className="text-xs text-[#5d6d7e] dark:text-[#99a3ad]">
                      Coming soon
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Supported grid (SEO-crawlable) */}
      <div>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#5d6d7e] dark:text-[#99a3ad]">
          Available guides
        </h2>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 lg:grid-cols-5">
          {supported.map((c) => (
            <Link
              key={c.code}
              href={`/path-to-istanbul/${c.slug}`}
              className="group flex items-center gap-3 rounded-xl border border-black/5 bg-white/70 p-3 transition-all hover:border-primary-300 hover:bg-primary-50/50 hover:shadow-md dark:border-white/10 dark:bg-white/5 dark:hover:border-primary-700 dark:hover:bg-primary-950/20 sm:p-4"
            >
              <span aria-hidden="true" className="text-2xl sm:text-3xl">
                {c.flag}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-[#1a1a2e] dark:text-[#f2f3f4]">
                  {c.name}
                </p>
                <p className="flex items-center gap-1 text-xs text-primary-600 dark:text-primary-400">
                  See the path <ArrowRight className="h-3 w-3" />
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
