"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
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
  Search,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { guides, type GuideCategory } from "@/lib/data";

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

interface GuidesListingProps {
  guidesWithContent: string[];
}

export function GuidesListing({ guidesWithContent }: GuidesListingProps) {
  const t = useTranslations("guidesIndexPage.listing");
  const tGuides = useTranslations("guides");
  const tCategories = useTranslations("guideCategories");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<"all" | GuideCategory>("all");

  const categoryKeys: GuideCategory[] = [
    "getting-started",
    "daily-life",
    "living-here",
  ];
  const categories = [
    { value: "all" as const, label: t("allGuides") },
    ...categoryKeys.map((value) => ({
      value,
      label: tCategories(`${value}.label`),
    })),
  ];

  const localized = guides.map((guide) => ({
    ...guide,
    title: tGuides(`${guide.slug}.title`),
    description: tGuides(`${guide.slug}.description`),
  }));

  const filtered = localized.filter((guide) => {
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
          <Search className="absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5d6d7e] dark:text-[#99a3ad]" />
          <input
            type="text"
            placeholder={t("searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-primary-200/40 bg-white/70 py-3 pe-4 ps-11 text-start text-sm text-[#1a1a2e] placeholder:text-[#5d6d7e]/60 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-[rgba(44,62,80,0.12)] dark:bg-[#1a1a2e] dark:text-[#f2f3f4] dark:placeholder:text-[#99a3ad]/60"
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
                  ? "bg-primary-600 text-white shadow-[0_6px_20px_rgba(192,57,43,0.15)] dark:bg-primary-500"
                  : "bg-white/70 text-[#5d6d7e] ring-1 ring-black/5 hover:bg-primary-50 hover:text-primary-700 dark:bg-[#1a1a2e] dark:text-[#99a3ad] dark:ring-white/5 dark:hover:bg-primary-950/30",
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
          <p className="text-[#5d6d7e] dark:text-[#99a3ad]">{t("empty")}</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((guide) => {
            const Icon = iconMap[guide.icon] || MapPin;
            const hasContent = guidesWithContent.includes(guide.slug);
            return (
              <Link
                key={guide.slug}
                href={`/guides/${guide.slug}`}
                className="group block h-full rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#fbfaf8] dark:focus-visible:ring-offset-[#14110f]"
              >
                <Card hoverable className="h-full p-0">
                  <CardContent className="flex h-full min-h-[244px] flex-col p-5">
                    <div className="flex items-start justify-between gap-4">
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-md border border-primary-500/15 bg-primary-50 text-primary-700 dark:border-primary-400/20 dark:bg-primary-950/25 dark:text-primary-300">
                        <Icon className="h-5 w-5" />
                      </span>
                      {hasContent && (
                        <span className="rounded-sm border border-primary-500/20 bg-primary-50 px-2 py-1 font-mono text-[10px] font-medium uppercase tracking-wider text-primary-800 dark:border-primary-400/20 dark:bg-primary-950/30 dark:text-primary-200">
                          {t("liveBadge")}
                        </span>
                      )}
                    </div>
                    <h2 className="mt-5 text-lg font-semibold leading-tight text-[#1a1a2e] dark:text-[#f2f3f4]">
                      {guide.title}
                    </h2>
                    <p className="mt-2 line-clamp-3 flex-1 text-sm leading-6 text-[#5d6d7e] dark:text-[#99a3ad]">
                      {guide.description}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-1.5 border-t border-black/5 pt-4 text-sm font-medium text-primary-700 transition-colors group-hover:text-primary-600 dark:border-white/5 dark:text-primary-300 dark:group-hover:text-primary-200">
                      {t("readGuide")}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
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
