"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { computeNomadScore, type NomadSpace } from "@/lib/spaces";
import { SpaceCard } from "./space-card";

const SpacesMap = dynamic(
  () => import("./spaces-map").then((mod) => ({ default: mod.SpacesMap })),
  { ssr: false },
);

const NEIGHBORHOODS = [
  "All",
  "Kadikoy",
  "Moda",
  "Cihangir",
  "Beyoglu",
  "Karakoy",
  "Besiktas",
  "Levent",
  "Kagithane",
];

type SpaceFilter = "all" | "cafe" | "coworking";
type SortBy = "score" | "name";

export function SpacesDirectory({ spaces }: { spaces: NomadSpace[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<SpaceFilter>("all");
  const [neighborhood, setNeighborhood] = useState("All");
  const [sortBy, setSortBy] = useState<SortBy>("score");

  const filtered = useMemo(() => {
    let result = spaces;

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.neighborhood.toLowerCase().includes(q),
      );
    }

    if (typeFilter !== "all") {
      result = result.filter((s) => s.type === typeFilter);
    }

    if (neighborhood !== "All") {
      result = result.filter((s) => s.neighborhood === neighborhood);
    }

    result = [...result].sort((a, b) => {
      if (sortBy === "score") {
        return (
          computeNomadScore(b.nomad_score) - computeNomadScore(a.nomad_score)
        );
      }
      return a.name.localeCompare(b.name);
    });

    return result;
  }, [spaces, search, typeFilter, neighborhood, sortBy]);

  // Map always shows filtered spaces
  const mapSpaces = filtered;

  return (
    <div>
      {/* Map */}
      <SpacesMap
        spaces={mapSpaces}
        selectedId={selectedId}
        onSelect={setSelectedId}
      />

      {/* Filters */}
      <div className="mt-8 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search cafes and coworking spaces..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-black/10 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition-colors placeholder:text-neutral-400 focus:border-primary-400 focus:ring-1 focus:ring-primary-400 dark:border-white/10 dark:bg-white/5 dark:text-[#f7f2ea] dark:placeholder:text-[#6b6257]"
          />
        </div>

        {/* Type filter + Sort */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-1.5">
            {(["all", "cafe", "coworking"] as const).map((type) => (
              <button
                key={type}
                onClick={() => setTypeFilter(type)}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  typeFilter === type
                    ? "bg-primary-600 text-white dark:bg-primary-500"
                    : "bg-white/70 text-neutral-600 ring-1 ring-black/10 hover:bg-primary-50 dark:bg-white/5 dark:text-[#b8a898] dark:ring-white/10",
                )}
              >
                {type === "all"
                  ? "All"
                  : type === "cafe"
                    ? "Cafes"
                    : "Coworking"}
              </button>
            ))}
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortBy)}
            className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-neutral-700 outline-none dark:border-white/10 dark:bg-white/5 dark:text-[#b8a898]"
          >
            <option value="score">Sort by Nomad Score</option>
            <option value="name">Sort by name</option>
          </select>
        </div>

        {/* Neighborhood pills */}
        <div className="flex flex-wrap gap-1.5">
          {NEIGHBORHOODS.map((n) => (
            <button
              key={n}
              onClick={() => setNeighborhood(n)}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                neighborhood === n
                  ? "bg-primary-600 text-white dark:bg-primary-500"
                  : "bg-white/70 text-neutral-600 ring-1 ring-black/10 hover:bg-primary-50 dark:bg-white/5 dark:text-[#b8a898] dark:ring-white/10",
              )}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <p className="mt-6 text-sm text-neutral-500 dark:text-[#8a7a6a]">
        {filtered.length} {filtered.length === 1 ? "space" : "spaces"} found
      </p>

      {/* Cards grid */}
      {filtered.length > 0 ? (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((space) => (
            <SpaceCard
              key={space.id}
              space={space}
              isSelected={selectedId === space.id}
              onSelect={setSelectedId}
            />
          ))}
        </div>
      ) : (
        <div className="mt-12 text-center">
          <p className="text-lg font-medium text-neutral-900 dark:text-[#f7f2ea]">
            No spaces match your filters
          </p>
          <p className="mt-2 text-sm text-neutral-500 dark:text-[#8a7a6a]">
            Try broadening your search or clearing some filters.
          </p>
        </div>
      )}
    </div>
  );
}
