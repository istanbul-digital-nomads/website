"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, SlidersHorizontal, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import {
  matchNeighborhoods,
  rhythmOptions,
  type RhythmKey,
} from "@/lib/neighborhood-decision";
import { formatRentRange } from "@/lib/neighborhoods";
import { cn } from "@/lib/utils";

interface Props {
  compact?: boolean;
}

const defaultRhythms: RhythmKey[] = ["ferry", "budget"];

export function NeighborhoodRhythmMatcher({ compact = false }: Props) {
  const [selected, setSelected] = useState<RhythmKey[]>(defaultRhythms);
  const matches = useMemo(
    () => matchNeighborhoods(selected).slice(0, 3),
    [selected],
  );

  function toggle(key: RhythmKey) {
    setSelected((current) => {
      if (current.includes(key)) {
        return current.filter((item) => item !== key);
      }
      return [...current, key].slice(-4);
    });
  }

  return (
    <section
      className={cn(
        "border-y border-black/10 bg-[#f6f1ea] dark:border-white/10 dark:bg-[#1a1612]",
        compact ? "py-12" : "py-16 lg:py-20",
      )}
    >
      <div
        className={cn(
          "mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:px-8",
          compact
            ? "lg:grid-cols-[0.9fr_1.1fr]"
            : "lg:grid-cols-[0.82fr_1.18fr]",
        )}
      >
        <div>
          <p className="eyebrow">Choose your Istanbul rhythm</p>
          <h2 className="mt-4 max-w-xl font-display text-h1 text-neutral-950 dark:text-[#f2f3f4]">
            Pick the day you want, then let the city narrow itself.
          </h2>
          <p className="mt-5 max-w-xl text-body-lg leading-8 text-[#5d6d7e] dark:text-[#b7aaa0]">
            Choose up to four signals. The matcher ranks the full neighborhood
            set by pace, budget, ferry access, work setup, and social energy.
          </p>

          <div className="mt-7 grid gap-2 sm:grid-cols-2">
            {rhythmOptions.map((option) => {
              const active = selected.includes(option.key);
              return (
                <button
                  key={option.key}
                  type="button"
                  onClick={() => toggle(option.key)}
                  className={cn(
                    "group flex min-h-[74px] items-start gap-3 rounded-md border px-4 py-3 text-left transition-colors",
                    active
                      ? "border-primary-600 bg-white text-neutral-950 dark:border-primary-400 dark:bg-white/10 dark:text-[#f2f3f4]"
                      : "border-black/10 bg-white/35 text-neutral-700 hover:border-primary-500/40 hover:bg-white/65 dark:border-white/10 dark:bg-white/5 dark:text-[#b7aaa0] dark:hover:border-primary-400/40 dark:hover:bg-white/10",
                  )}
                  aria-pressed={active}
                >
                  <span
                    className={cn(
                      "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
                      active
                        ? "border-primary-600 bg-primary-600 text-white dark:border-primary-400 dark:bg-primary-400 dark:text-[#14110f]"
                        : "border-black/20 text-transparent dark:border-white/20",
                    )}
                  >
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold">
                      {option.label}
                    </span>
                    <span className="mt-1 block text-xs leading-5 opacity-80">
                      {option.description}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-md border border-black/10 bg-white/70 p-3 dark:border-white/10 dark:bg-[#14110f]/80">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/10 px-2 pb-3 dark:border-white/10">
            <div className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-primary-700 dark:text-primary-300">
              <SlidersHorizontal className="h-4 w-4" />
              Live match
            </div>
            <div className="inline-flex items-center gap-2 rounded-md bg-[#f6f1ea] px-3 py-1.5 text-xs text-neutral-700 dark:bg-white/10 dark:text-[#d5dce3]">
              <Sparkles className="h-3.5 w-3.5 text-primary-600 dark:text-primary-300" />
              {selected.length || defaultRhythms.length} signals
            </div>
          </div>

          <div className="mt-3 space-y-3">
            {matches.map((match, index) => (
              <Link
                key={match.neighborhood.slug}
                href={`/guides/neighborhoods/${match.neighborhood.slug}`}
                className="group grid gap-4 rounded-md border border-black/10 bg-white p-3 transition-colors hover:border-primary-500/40 dark:border-white/10 dark:bg-white/5 dark:hover:border-primary-400/40 sm:grid-cols-[9rem_1fr]"
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-primary-50/40 dark:bg-primary-950/20">
                  <Image
                    src={match.neighborhood.hero.src}
                    alt={match.neighborhood.hero.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, 180px"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                  <div className="absolute left-2 top-2 rounded-md bg-[#14110f]/80 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-white">
                    #{index + 1}
                  </div>
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="font-display text-2xl font-extrabold text-neutral-950 dark:text-[#f2f3f4]">
                        {match.neighborhood.name}
                      </h3>
                      <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500 dark:text-[#94877d]">
                        {match.score}% fit /{" "}
                        {formatRentRange(match.neighborhood)}
                      </p>
                    </div>
                    <ArrowRight className="mt-1 h-5 w-5 shrink-0 text-neutral-400 transition-transform group-hover:translate-x-1 group-hover:text-primary-600 dark:group-hover:text-primary-300" />
                  </div>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {match.matchingRhythms.slice(0, 3).map((rhythm) => (
                      <span
                        key={rhythm.key}
                        className="rounded-md bg-primary-50 px-2 py-1 text-xs font-medium text-primary-800 dark:bg-primary-950/30 dark:text-primary-200"
                      >
                        {rhythm.shortLabel}
                      </span>
                    ))}
                    {match.matchingRhythms.length === 0 &&
                      match.neighborhood.badges.slice(0, 2).map((badge) => (
                        <span
                          key={badge}
                          className="rounded-md bg-primary-50 px-2 py-1 text-xs font-medium text-primary-800 dark:bg-primary-950/30 dark:text-primary-200"
                        >
                          {badge}
                        </span>
                      ))}
                  </div>

                  <ul className="mt-3 space-y-1 text-sm leading-6 text-[#5d6d7e] dark:text-[#b7aaa0]">
                    {match.reasons.slice(0, 2).map((reason) => (
                      <li key={reason}>{reason}</li>
                    ))}
                  </ul>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
