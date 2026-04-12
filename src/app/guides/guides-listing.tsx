"use client";

import { useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import {
  MapPin,
  Wifi,
  Home,
  Banknote,
  FileText,
  Smartphone,
  Train,
  UtensilsCrossed,
  Stethoscope,
  Music,
  Globe,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { guides, guideCategories, type GuideCategory } from "@/lib/data";
import { hasGuideContent } from "@/lib/guides";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  MapPin,
  Wifi,
  Home,
  Banknote,
  FileText,
  Smartphone,
  Train,
  UtensilsCrossed,
  Stethoscope,
  Music,
  Globe,
};

const categories = [
  { value: "all" as const, label: "All guides" },
  ...Object.entries(guideCategories).map(([value, { label }]) => ({
    value: value as GuideCategory,
    label,
  })),
];

interface GuidesListingProps {
  guidesWithContent: string[];
}

export function GuidesListing({ guidesWithContent }: GuidesListingProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<"all" | GuideCategory>("all");

  const filtered = guides.filter((guide) => {
    const matchesSearch =
      search === "" ||
      guide.title.toLowerCase().includes(search.toLowerCase()) ||
      guide.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "all" || guide.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      {/* Search + Filters */}
      <div className="mb-8 space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6b6257] dark:text-[#b8a898]" />
          <input
            type="text"
            placeholder="Search guides..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-primary-200/40 bg-white/70 py-3 pl-11 pr-4 text-sm text-[#2a2018] placeholder:text-[#6b6257]/60 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-[rgba(200,100,60,0.12)] dark:bg-[#1c1614] dark:text-[#f7f2ea] dark:placeholder:text-[#b8a898]/60"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setCategory(cat.value)}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                category === cat.value
                  ? "bg-primary-600 text-white shadow-[0_6px_20px_rgba(200,53,31,0.15)] dark:bg-primary-500"
                  : "bg-white/70 text-[#6b6257] ring-1 ring-black/5 hover:bg-primary-50 hover:text-primary-700 dark:bg-[#1c1614] dark:text-[#b8a898] dark:ring-white/5 dark:hover:bg-primary-950/30",
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-primary-200/50 bg-primary-50/30 p-12 text-center dark:border-primary-900/30 dark:bg-primary-950/10">
          <p className="text-[#6b6257] dark:text-[#b8a898]">
            No guides match your search. Try a different term or category.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((guide) => {
            const Icon = iconMap[guide.icon] || MapPin;
            const hasContent = guidesWithContent.includes(guide.slug);
            return (
              <Link key={guide.slug} href={`/guides/${guide.slug}`}>
                <Card hoverable className="h-full">
                  <CardContent>
                    <div className="flex items-start justify-between">
                      <Icon className="h-8 w-8 text-primary-600 dark:text-primary-400" />
                      {hasContent && (
                        <span className="rounded-full bg-primary-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
                          Live
                        </span>
                      )}
                    </div>
                    <h2 className="mt-4 text-lg font-semibold text-[#2a2018] dark:text-[#f7f2ea]">
                      {guide.title}
                    </h2>
                    <p className="mt-2 text-sm text-[#6b6257] dark:text-[#b8a898]">
                      {guide.description}
                    </p>
                    <span className="mt-4 inline-block text-sm font-medium text-primary-600 dark:text-primary-400">
                      Read guide &rarr;
                    </span>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
