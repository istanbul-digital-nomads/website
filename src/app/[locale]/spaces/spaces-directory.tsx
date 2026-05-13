"use client";

import dynamic from "next/dynamic";
import type { ReactNode } from "react";
import { useMemo, useState, useTransition } from "react";
import {
  BriefcaseBusiness,
  Check,
  ChevronDown,
  CloudRain,
  Coffee,
  Compass,
  Crosshair,
  Focus,
  Map,
  Moon,
  Navigation,
  PhoneCall,
  PlugZap,
  Search,
  SlidersHorizontal,
  Sparkles,
  WalletCards,
  X,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import type { NomadSpace } from "@/lib/spaces";
import {
  finderModes,
  getDefaultSpaceFinderFilters,
  getSpaceNeighborhoods,
  needOptions,
  rankSpaces,
  type FinderMode,
  type SpaceFinderFilters,
  type SpaceNeed,
  type SpaceSort,
  type SpaceTypeFilter,
} from "@/lib/spaces-finder";
import { SpaceCard } from "./space-card";

const SpacesMap = dynamic(
  () => import("./spaces-map").then((mod) => ({ default: mod.SpacesMap })),
  { ssr: false },
);

const defaultFilters = getDefaultSpaceFinderFilters();

const modeSuggestedNeeds: Record<FinderMode, SpaceNeed[]> = {
  best: ["firstVisit", "strongSockets"],
  calls: ["callsFriendly", "quiet", "strongSockets"],
  quiet: ["quiet", "strongSockets"],
  rain: ["rainSafe", "strongSockets"],
  late: ["openLate", "rainSafe"],
  budget: ["budget", "firstVisit"],
  "first-visit": ["firstVisit", "strongSockets"],
};

const modeIcons: Record<FinderMode, typeof BriefcaseBusiness> = {
  best: Crosshair,
  calls: PhoneCall,
  quiet: Focus,
  rain: CloudRain,
  late: Moon,
  budget: WalletCards,
  "first-visit": Compass,
};

export function SpacesDirectory({ spaces }: { spaces: NomadSpace[] }) {
  const t = useTranslations("spacesPage.finder");
  const tModes = useTranslations("spacesPage.finder.modes");
  const tNeeds = useTranslations("spacesPage.finder.needs");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filters, setFilters] = useState<SpaceFinderFilters>(defaultFilters);
  const [showMap, setShowMap] = useState(false);
  const [isPending, startTransition] = useTransition();

  const neighborhoods = useMemo(() => getSpaceNeighborhoods(spaces), [spaces]);
  const rankedSpaces = useMemo(
    () => rankSpaces(spaces, filters),
    [spaces, filters],
  );
  const topMatches = rankedSpaces.slice(0, 3);
  const topMatch = topMatches[0];
  const backupMatch = topMatches[1];
  const selectedNeeds = new Set(filters.needs);
  const equippedNeeds = needOptions.filter((need) =>
    selectedNeeds.has(need.value),
  );
  const selectedMode =
    finderModes.find((mode) => mode.value === filters.mode) ?? finderModes[0];
  const suggestedNeeds = modeSuggestedNeeds[filters.mode].filter(
    (need) => !selectedNeeds.has(need),
  );
  const selectedModeLabel = tModes(`${selectedMode.value}.label`);
  const selectedModeDescription = tModes(`${selectedMode.value}.description`);

  function updateFilters(next: Partial<SpaceFinderFilters>) {
    startTransition(() => {
      setFilters((current) => ({ ...current, ...next }));
      setSelectedId(null);
    });
  }

  function toggleNeed(need: SpaceNeed) {
    const nextNeeds = selectedNeeds.has(need)
      ? filters.needs.filter((item) => item !== need)
      : [...filters.needs, need];
    updateFilters({ needs: nextNeeds });
  }

  function resetFilters() {
    updateFilters(defaultFilters);
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-2 rounded-md border border-black/10 bg-white/70 p-2 dark:border-white/10 dark:bg-white/[0.04] sm:grid-cols-3">
        <QuestStep
          active
          label={t("quest.step1Label")}
          value={selectedModeLabel}
        />
        <QuestStep
          active={filters.needs.length > 0}
          label={t("quest.step2Label")}
          value={
            filters.needs.length > 0
              ? t("quest.activeCount", { count: filters.needs.length })
              : t("quest.optional")
          }
        />
        <QuestStep
          active={rankedSpaces.length > 0}
          label={t("quest.step3Label")}
          value={topMatch ? topMatch.space.name : t("quest.noMatchYet")}
        />
      </div>

      <section className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-stretch">
        <div className="rounded-md border border-black/10 bg-[#f6f1ea] p-5 dark:border-white/10 dark:bg-[#1a1612]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-primary-700 dark:text-primary-200">
                {t("mission.eyebrow")}
              </p>
              <h2 className="mt-3 max-w-lg font-display text-h2 text-neutral-950 dark:text-[#f2f3f4]">
                {t("mission.title")}
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-7 text-[#5d6d7e] dark:text-[#b7aaa0]">
                {selectedModeDescription} {t("mission.bodySuffix")}
              </p>
            </div>
            <BriefcaseBusiness className="mt-1 h-6 w-6 text-primary-600 dark:text-primary-200" />
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {finderModes.map((mode) => (
              <MissionCard
                key={mode.value}
                value={mode.value}
                label={tModes(`${mode.value}.label`)}
                description={tModes(`${mode.value}.description`)}
                stage={tModes(`${mode.value}.stage`)}
                reward={tModes(`${mode.value}.reward`)}
                selectedLabel={t("mission.selected")}
                rewardPrefix={t("mission.rewardPrefix")}
                active={filters.mode === mode.value}
                onClick={() => updateFilters({ mode: mode.value })}
              />
            ))}
          </div>

          {suggestedNeeds.length > 0 ? (
            <div className="mt-5 rounded-md border border-black/10 bg-white/55 p-3 dark:border-white/10 dark:bg-white/[0.04]">
              <div className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-neutral-500 dark:text-[#94877d]">
                <Sparkles className="h-4 w-4 text-primary-600 dark:text-primary-200" />
                {t("suggested.title")}
              </div>
              <div className="flex flex-wrap gap-2">
                {suggestedNeeds.slice(0, 3).map((need) => {
                  const option = needOptions.find(
                    (item) => item.value === need,
                  );
                  if (!option) return null;
                  return (
                    <button
                      key={need}
                      type="button"
                      onClick={() => toggleNeed(need)}
                      className="rounded-md border border-black/10 bg-white px-3 py-2 text-xs font-semibold text-neutral-700 transition-colors hover:border-primary-500/40 hover:bg-primary-50 dark:border-white/10 dark:bg-white/5 dark:text-[#d8d0c8] dark:hover:bg-white/10"
                    >
                      {t("suggested.equip", {
                        label: tNeeds(`${need}.label`).toLowerCase(),
                      })}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>

        <div className="rounded-md border border-black/10 bg-[#14110f] p-5 text-white dark:border-white/10">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/10 pb-4 dark:border-white/10">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-primary-200">
                {t("brief.eyebrow")}
              </p>
              <p className="mt-1 text-sm text-white/62">
                {t("brief.subtitle")}
              </p>
            </div>
            <p className="rounded-md bg-white/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-white/70">
              {t("brief.found", { count: rankedSpaces.length })}
            </p>
          </div>

          {topMatch ? (
            <div className="mt-5">
              <button
                type="button"
                onClick={() => setSelectedId(topMatch.space.id)}
                className="w-full rounded-md border border-white/15 bg-white/[0.08] p-4 text-left transition-colors hover:bg-white/[0.12]"
              >
                <span className="flex flex-wrap items-start justify-between gap-3">
                  <span>
                    <span className="block font-display text-3xl font-extrabold">
                      {topMatch.space.name}
                    </span>
                    <span className="mt-2 block text-sm leading-6 text-white/68">
                      {topMatch.space.neighborhood} /{" "}
                      {topMatch.matchReasons.join(" / ")}
                    </span>
                  </span>
                  <span className="rounded-md bg-primary-300 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-[#14110f]">
                    {topMatch.signals.score == null
                      ? t("brief.checkLive")
                      : t("brief.scoreSuffix", {
                          score: topMatch.signals.score.toFixed(1),
                        })}
                  </span>
                </span>

                <span className="mt-4 grid gap-2 sm:grid-cols-3">
                  <BriefItem
                    icon={<PlugZap className="h-4 w-4" />}
                    label={t("brief.power")}
                    value={
                      topMatch.signals.strongSockets
                        ? t("brief.powerGood")
                        : t("brief.powerCheck")
                    }
                  />
                  <BriefItem
                    icon={<Coffee className="h-4 w-4" />}
                    label={t("brief.type")}
                    value={
                      topMatch.space.type === "coworking"
                        ? t("brief.typeCoworking")
                        : t("brief.typeCafe")
                    }
                  />
                  <BriefItem
                    icon={<Navigation className="h-4 w-4" />}
                    label={t("brief.backup")}
                    value={
                      backupMatch ? backupMatch.space.name : t("brief.openMap")
                    }
                  />
                </span>

                {topMatch.signals.caution ? (
                  <span className="mt-4 block rounded-md border border-amber-200/20 bg-amber-100/10 p-3 text-xs leading-5 text-amber-50">
                    {topMatch.signals.caution}
                  </span>
                ) : null}
              </button>

              <div className="mt-3 space-y-2">
                {topMatches
                  .slice(1)
                  .map(({ space, signals, matchReasons }, index) => (
                    <button
                      key={space.id}
                      type="button"
                      onClick={() => setSelectedId(space.id)}
                      className={cn(
                        "grid w-full gap-3 rounded-md border p-3 text-left transition-colors sm:grid-cols-[2rem_1fr_auto]",
                        selectedId === space.id
                          ? "border-primary-300 bg-white/12"
                          : "border-white/10 bg-white/[0.04] hover:bg-white/[0.08]",
                      )}
                    >
                      <span className="flex h-8 w-8 items-center justify-center rounded-md bg-white/10 font-display text-sm font-extrabold text-white">
                        {index + 2}
                      </span>
                      <span>
                        <span className="block font-display text-lg font-extrabold">
                          {space.name}
                        </span>
                        <span className="mt-1 block text-xs leading-5 text-white/62">
                          {space.neighborhood} / {matchReasons.join(" / ")}
                        </span>
                      </span>
                      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/48">
                        {signals.score == null
                          ? t("brief.unverified")
                          : t("brief.scoreSuffix", {
                              score: signals.score.toFixed(1),
                            })}
                      </span>
                    </button>
                  ))}
              </div>
            </div>
          ) : (
            <div className="mt-5 rounded-md border border-white/10 bg-white/[0.04] p-5">
              <p className="font-display text-2xl font-extrabold">
                {t("brief.noPickTitle")}
              </p>
              <p className="mt-2 text-sm leading-6 text-white/62">
                {t("brief.noPickBody")}
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="rounded-md border border-black/10 bg-white/70 p-4 dark:border-white/10 dark:bg-white/[0.04]">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input
              type="search"
              placeholder={t("search.placeholder")}
              value={filters.search}
              onChange={(event) =>
                updateFilters({ search: event.target.value })
              }
              className="h-11 w-full rounded-md border border-black/10 bg-white pl-10 pr-4 text-sm outline-none transition-colors placeholder:text-neutral-400 focus:border-primary-400 focus:ring-1 focus:ring-primary-400 dark:border-white/10 dark:bg-[#14110f] dark:text-[#f2f3f4] dark:placeholder:text-[#94877d]"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <TypeFilter
              value={filters.type}
              onChange={(type) => updateFilters({ type })}
            />
            <SortFilter
              value={filters.sort}
              onChange={(sort) => updateFilters({ sort })}
            />
            <button
              type="button"
              onClick={resetFilters}
              disabled={isPending}
              className="inline-flex h-11 items-center gap-2 rounded-md border border-black/10 px-3 text-sm font-semibold text-neutral-700 transition-colors hover:border-primary-500/40 hover:bg-primary-50/60 disabled:opacity-60 dark:border-white/10 dark:text-[#d8d0c8] dark:hover:bg-white/10"
            >
              <X className="h-4 w-4" />
              {t("search.reset")}
            </button>
          </div>
        </div>

        <div className="mt-4 grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
          <FilterPanel
            title={t("filters.neighborhood")}
            icon={<Map className="h-4 w-4" />}
            className="xl:col-span-1"
          >
            <div className="flex flex-wrap gap-1.5">
              {neighborhoods.map((neighborhood) => (
                <FilterChip
                  key={neighborhood}
                  label={
                    neighborhood === "All neighborhoods"
                      ? t("filters.allNeighborhoods")
                      : neighborhood
                  }
                  active={filters.neighborhood === neighborhood}
                  onClick={() => updateFilters({ neighborhood })}
                />
              ))}
            </div>
          </FilterPanel>

          <FilterPanel
            title={t("filters.powerUps")}
            icon={<SlidersHorizontal className="h-4 w-4" />}
          >
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {needOptions.map((need) => (
                <NeedButton
                  key={need.value}
                  value={need.value}
                  label={tNeeds(`${need.value}.label`)}
                  description={tNeeds(`${need.value}.description`)}
                  active={selectedNeeds.has(need.value)}
                  onClick={() => toggleNeed(need.value)}
                />
              ))}
            </div>
          </FilterPanel>
        </div>
      </section>

      <section className="overflow-hidden rounded-md border border-black/10 dark:border-white/10">
        <button
          type="button"
          onClick={() => setShowMap((current) => !current)}
          className="flex w-full items-center justify-between gap-3 bg-[#f6f1ea] px-4 py-3 text-left dark:bg-[#1a1612]"
        >
          <span>
            <span className="block font-mono text-[10px] uppercase tracking-[0.24em] text-primary-700 dark:text-primary-200">
              {t("map.label")}
            </span>
            <span className="mt-1 block text-sm text-[#5d6d7e] dark:text-[#b7aaa0]">
              {showMap ? t("map.open") : t("map.closed")}
            </span>
          </span>
          <ChevronDown
            className={cn(
              "h-5 w-5 text-neutral-500 transition-transform",
              showMap && "rotate-180",
            )}
          />
        </button>
        {showMap ? (
          <div className="p-3">
            <SpacesMap
              spaces={rankedSpaces.map(({ space }) => space)}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
          </div>
        ) : null}
      </section>

      <section>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-primary-700 dark:text-primary-200">
              {t("results.eyebrow")}
            </p>
            <h2 className="mt-2 font-display text-h2 text-neutral-950 dark:text-[#f2f3f4]">
              {rankedSpaces.length === 1
                ? t("results.matchOne", { count: rankedSpaces.length })
                : t("results.matchOther", { count: rankedSpaces.length })}
            </h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-[#5d6d7e] dark:text-[#b7aaa0]">
            {t("results.body")}
          </p>
        </div>

        {(filters.neighborhood !== "All neighborhoods" ||
          filters.type !== "all" ||
          equippedNeeds.length > 0 ||
          filters.search) && (
          <div className="mt-4 flex flex-wrap gap-2">
            <LoadoutPill
              label={t("results.loadout.mission")}
              value={selectedModeLabel}
              removeAriaLabel={t("results.loadout.removeLabel", {
                value: selectedModeLabel,
              })}
            />
            {filters.neighborhood !== "All neighborhoods" ? (
              <LoadoutPill
                label={t("results.loadout.area")}
                value={filters.neighborhood}
                removeAriaLabel={t("results.loadout.removeLabel", {
                  value: filters.neighborhood,
                })}
              />
            ) : null}
            {filters.type !== "all" ? (
              <LoadoutPill
                label={t("results.loadout.type")}
                value={
                  filters.type === "cafe" ? t("type.cafe") : t("type.coworking")
                }
                removeAriaLabel={t("results.loadout.removeLabel", {
                  value:
                    filters.type === "cafe"
                      ? t("type.cafe")
                      : t("type.coworking"),
                })}
              />
            ) : null}
            {equippedNeeds.map((need) => {
              const needLabel = tNeeds(`${need.value}.label`);
              return (
                <LoadoutPill
                  key={need.value}
                  label={t("results.loadout.powerUp")}
                  value={needLabel}
                  removeAriaLabel={t("results.loadout.removeLabel", {
                    value: needLabel,
                  })}
                  onRemove={() => toggleNeed(need.value)}
                />
              );
            })}
            {filters.search ? (
              <LoadoutPill
                label={t("results.loadout.search")}
                value={filters.search}
                removeAriaLabel={t("results.loadout.removeLabel", {
                  value: filters.search,
                })}
                onRemove={() => updateFilters({ search: "" })}
              />
            ) : null}
          </div>
        )}

        {rankedSpaces.length > 0 ? (
          <div className="mt-5 grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {rankedSpaces.map((ranked) => (
              <SpaceCard
                key={ranked.space.id}
                space={ranked.space}
                signals={ranked.signals}
                matchReasons={ranked.matchReasons}
                isSelected={selectedId === ranked.space.id}
                onSelect={setSelectedId}
              />
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-md border border-black/10 bg-[#f6f1ea] p-8 text-center dark:border-white/10 dark:bg-[#1a1612]">
            <p className="font-display text-2xl font-extrabold text-neutral-950 dark:text-[#f2f3f4]">
              {t("results.empty.title")}
            </p>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-[#5d6d7e] dark:text-[#b7aaa0]">
              {t("results.empty.body")}
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="mt-5 inline-flex items-center gap-2 rounded-md bg-neutral-950 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-neutral-800 dark:bg-[#f2f3f4] dark:text-[#14110f] dark:hover:bg-[#d8d0c8]"
            >
              {t("results.empty.cta")}
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

function QuestStep({
  active,
  label,
  value,
}: {
  active: boolean;
  label: string;
  value: string;
}) {
  return (
    <div
      className={cn(
        "rounded-md border px-3 py-2 transition-colors",
        active
          ? "border-primary-500/30 bg-primary-50 dark:border-primary-400/30 dark:bg-primary-950/20"
          : "border-black/10 bg-white dark:border-white/10 dark:bg-white/[0.04]",
      )}
    >
      <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-neutral-500 dark:text-[#94877d]">
        {label}
      </p>
      <p className="mt-1 truncate text-sm font-semibold text-neutral-950 dark:text-[#f2f3f4]">
        {value}
      </p>
    </div>
  );
}

function MissionCard({
  value,
  label,
  description,
  stage,
  reward,
  selectedLabel,
  rewardPrefix,
  active,
  onClick,
}: {
  value: FinderMode;
  label: string;
  description: string;
  stage: string;
  reward: string;
  selectedLabel: string;
  rewardPrefix: string;
  active: boolean;
  onClick: () => void;
}) {
  const Icon = modeIcons[value];

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "group relative min-h-36 overflow-hidden rounded-md border p-3 text-left transition-all",
        active
          ? "border-primary-600 bg-white text-neutral-950 shadow-[0_18px_46px_rgba(20,17,15,0.12)] dark:border-primary-400 dark:bg-white/10 dark:text-[#f2f3f4]"
          : "border-black/10 bg-white/35 text-neutral-700 hover:-translate-y-0.5 hover:border-primary-500/40 hover:bg-white/70 dark:border-white/10 dark:bg-white/5 dark:text-[#b7aaa0] dark:hover:bg-white/10",
      )}
    >
      <span className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary-500/10 transition-transform group-hover:scale-125" />
      <span className="relative flex items-start justify-between gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-md bg-[#14110f] text-white dark:bg-[#f2f3f4] dark:text-[#14110f]">
          <Icon className="h-5 w-5" />
        </span>
        <span
          className={cn(
            "rounded-md border px-2 py-1 font-mono text-[9px] uppercase tracking-[0.18em]",
            active
              ? "border-primary-500/30 bg-primary-50 text-primary-800 dark:border-primary-300/30 dark:bg-primary-950/30 dark:text-primary-100"
              : "border-black/10 bg-white/60 text-neutral-500 dark:border-white/10 dark:bg-white/5 dark:text-[#94877d]",
          )}
        >
          {active ? selectedLabel : stage}
        </span>
      </span>
      <span className="relative mt-4 block text-base font-extrabold">
        {label}
      </span>
      <span className="relative mt-1 block text-xs leading-5 opacity-80">
        {description}
      </span>
      <span className="relative mt-4 flex items-center gap-2 border-t border-black/10 pt-3 font-mono text-[9px] uppercase tracking-[0.18em] text-neutral-500 dark:border-white/10 dark:text-[#94877d]">
        <Sparkles className="h-3.5 w-3.5 text-primary-600 dark:text-primary-200" />
        {rewardPrefix} {reward}
      </span>
    </button>
  );
}

function BriefItem({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <span className="rounded-md border border-white/10 bg-white/[0.06] p-3">
      <span className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.2em] text-white/44">
        {icon}
        {label}
      </span>
      <span className="mt-2 block truncate text-sm font-semibold text-white">
        {value}
      </span>
    </span>
  );
}

function LoadoutPill({
  label,
  value,
  removeAriaLabel,
  onRemove,
}: {
  label: string;
  value: string;
  removeAriaLabel?: string;
  onRemove?: () => void;
}) {
  return (
    <span className="inline-flex items-center gap-2 rounded-md border border-black/10 bg-white px-3 py-2 text-xs text-neutral-700 dark:border-white/10 dark:bg-white/5 dark:text-[#d8d0c8]">
      <span className="font-mono uppercase tracking-[0.18em] text-neutral-400 dark:text-[#94877d]">
        {label}
      </span>
      <span className="font-semibold">{value}</span>
      {onRemove ? (
        <button
          type="button"
          onClick={onRemove}
          className="rounded-full p-0.5 text-neutral-400 transition-colors hover:bg-black/5 hover:text-neutral-900 dark:hover:bg-white/10 dark:hover:text-white"
          aria-label={removeAriaLabel ?? value}
        >
          <X className="h-3.5 w-3.5" />
        </button>
      ) : null}
    </span>
  );
}

function TypeFilter({
  value,
  onChange,
}: {
  value: SpaceTypeFilter;
  onChange: (value: SpaceTypeFilter) => void;
}) {
  const t = useTranslations("spacesPage.finder.type");
  return (
    <div className="inline-flex h-11 overflow-hidden rounded-md border border-black/10 bg-white dark:border-white/10 dark:bg-[#14110f]">
      {(["all", "cafe", "coworking"] as const).map((type) => (
        <button
          key={type}
          type="button"
          onClick={() => onChange(type)}
          className={cn(
            "px-3 text-sm font-semibold capitalize transition-colors",
            value === type
              ? "bg-neutral-950 text-white dark:bg-[#f2f3f4] dark:text-[#14110f]"
              : "text-neutral-600 hover:bg-primary-50 dark:text-[#b7aaa0] dark:hover:bg-white/10",
          )}
        >
          {t(type)}
        </button>
      ))}
    </div>
  );
}

function SortFilter({
  value,
  onChange,
}: {
  value: SpaceSort;
  onChange: (value: SpaceSort) => void;
}) {
  const t = useTranslations("spacesPage.finder.sort");
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value as SpaceSort)}
      className="h-11 rounded-md border border-black/10 bg-white px-3 text-sm font-semibold text-neutral-700 outline-none dark:border-white/10 dark:bg-[#14110f] dark:text-[#d8d0c8]"
    >
      <option value="recommended">{t("recommended")}</option>
      <option value="score">{t("score")}</option>
      <option value="name">{t("name")}</option>
    </select>
  );
}

function FilterPanel({
  title,
  icon,
  className,
  children,
}: {
  title: string;
  icon: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-md border border-black/10 bg-[#fbfaf8] p-3 dark:border-white/10 dark:bg-[#14110f]",
        className,
      )}
    >
      <div className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-neutral-500 dark:text-[#94877d]">
        {icon}
        {title}
      </div>
      {children}
    </div>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-md px-3 py-1.5 text-xs font-semibold transition-colors",
        active
          ? "bg-primary-600 text-white dark:bg-primary-500"
          : "bg-white text-neutral-600 ring-1 ring-black/10 hover:bg-primary-50 dark:bg-white/5 dark:text-[#b7aaa0] dark:ring-white/10",
      )}
    >
      {label}
    </button>
  );
}

function NeedButton({
  value,
  label,
  description,
  active,
  onClick,
}: {
  value: SpaceNeed;
  label: string;
  description: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      data-need={value}
      className={cn(
        "flex min-h-16 items-start gap-2 rounded-md border px-3 py-2 text-left transition-colors",
        active
          ? "border-primary-600 bg-primary-50 text-neutral-950 dark:border-primary-400 dark:bg-primary-950/30 dark:text-[#f2f3f4]"
          : "border-black/10 bg-white text-neutral-700 hover:border-primary-500/40 dark:border-white/10 dark:bg-white/5 dark:text-[#b7aaa0]",
      )}
    >
      <span
        className={cn(
          "mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border",
          active
            ? "border-primary-600 bg-primary-600 text-white dark:border-primary-400 dark:bg-primary-400 dark:text-[#14110f]"
            : "border-black/20 text-transparent dark:border-white/20",
        )}
      >
        <Check className="h-3 w-3" />
      </span>
      <span>
        <span className="block text-sm font-semibold">{label}</span>
        <span className="mt-0.5 block text-xs leading-5 opacity-80">
          {description}
        </span>
      </span>
    </button>
  );
}
