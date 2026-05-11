"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { guideSpecializations, istanbulNeighborhoods } from "@/lib/constants";
import { GuideCard } from "./guide-card";
import type { Database } from "@/types/database";

type LocalGuide = Database["public"]["Tables"]["local_guides"]["Row"];

export function LocalGuidesDirectory({ guides }: { guides: LocalGuide[] }) {
  const [search, setSearch] = useState("");
  const [activeSpec, setActiveSpec] = useState<string | null>(null);
  const [activeNeighborhood, setActiveNeighborhood] = useState<string | null>(
    null,
  );

  const filtered = useMemo(() => {
    return guides.filter((g) => {
      if (search) {
        const q = search.toLowerCase();
        if (
          !g.name.toLowerCase().includes(q) &&
          !g.bio.toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      if (activeSpec && !g.specializations.includes(activeSpec)) return false;
      if (activeNeighborhood && !g.neighborhoods.includes(activeNeighborhood))
        return false;
      return true;
    });
  }, [guides, search, activeSpec, activeNeighborhood]);

  return (
    <div>
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
        <input
          type="text"
          placeholder="Search guides by name or expertise..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-black/10 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition-colors placeholder:text-neutral-400 focus:border-primary-400 focus:ring-1 focus:ring-primary-400 dark:border-white/10 dark:bg-white/5 dark:text-[#f2f3f4] dark:placeholder:text-[#5d6d7e]"
        />
      </div>

      {/* Specialization filters */}
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={() => setActiveSpec(null)}
          className={cn(
            "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
            activeSpec === null
              ? "bg-primary-600 text-white dark:bg-primary-500"
              : "bg-white/70 text-neutral-600 ring-1 ring-black/10 hover:bg-primary-50 dark:bg-white/5 dark:text-[#99a3ad] dark:ring-white/10",
          )}
        >
          All expertise
        </button>
        {guideSpecializations.map((spec) => (
          <button
            key={spec.value}
            onClick={() =>
              setActiveSpec(activeSpec === spec.value ? null : spec.value)
            }
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
              activeSpec === spec.value
                ? "bg-primary-600 text-white dark:bg-primary-500"
                : "bg-white/70 text-neutral-600 ring-1 ring-black/10 hover:bg-primary-50 dark:bg-white/5 dark:text-[#99a3ad] dark:ring-white/10",
            )}
          >
            {spec.label}
          </button>
        ))}
      </div>

      {/* Neighborhood filters */}
      <div className="mt-2 flex flex-wrap gap-2">
        <button
          onClick={() => setActiveNeighborhood(null)}
          className={cn(
            "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
            activeNeighborhood === null
              ? "bg-primary-600 text-white dark:bg-primary-500"
              : "bg-white/70 text-neutral-600 ring-1 ring-black/10 hover:bg-primary-50 dark:bg-white/5 dark:text-[#99a3ad] dark:ring-white/10",
          )}
        >
          All areas
        </button>
        {istanbulNeighborhoods.map((n) => (
          <button
            key={n.value}
            onClick={() =>
              setActiveNeighborhood(
                activeNeighborhood === n.value ? null : n.value,
              )
            }
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
              activeNeighborhood === n.value
                ? "bg-primary-600 text-white dark:bg-primary-500"
                : "bg-white/70 text-neutral-600 ring-1 ring-black/10 hover:bg-primary-50 dark:bg-white/5 dark:text-[#99a3ad] dark:ring-white/10",
            )}
          >
            {n.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((guide) => (
            <GuideCard key={guide.id} guide={guide} />
          ))}
        </div>
      ) : (
        <div className="mt-12 text-center">
          <p className="text-lg font-medium text-neutral-900 dark:text-[#f2f3f4]">
            No guides match your filters
          </p>
          <p className="mt-2 text-sm text-neutral-500 dark:text-[#85929e]">
            Try broadening your search or clearing some filters.
          </p>
        </div>
      )}
    </div>
  );
}
