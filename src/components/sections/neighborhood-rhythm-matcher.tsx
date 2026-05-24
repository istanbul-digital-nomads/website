"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, SlidersHorizontal, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import {
  matchNeighborhoods,
  rhythmOptions,
  type RhythmKey,
} from "@/lib/neighborhood-decision";
import { formatRentRange } from "@/lib/neighborhoods";
import { cn } from "@/lib/utils";

interface Props {
  compact?: boolean;
  /** Design System v2 section marker. Defaults suit the homepage. */
  eyebrowNum?: string;
}

const defaultRhythms: RhythmKey[] = ["ferry", "budget"];

export function NeighborhoodRhythmMatcher({
  compact = false,
  eyebrowNum = "N° 05",
}: Props) {
  const [selected, setSelected] = useState<RhythmKey[]>(defaultRhythms);
  const t = useTranslations("sections.rhythmMatcher");
  const tSignals = useTranslations("sections.rhythmSignals");
  const tList = useTranslations("neighborhoodList");

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
        "border-y border-ink-3 bg-ink-1",
        compact ? "py-12" : "py-24 lg:py-32",
      )}
    >
      <div
        className={cn(
          "mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:px-8",
          compact
            ? "lg:grid-cols-[0.9fr_1.1fr]"
            : "lg:grid-cols-[0.82fr_1.18fr]",
        )}
      >
        <div>
          <div className="flex items-center gap-3.5 font-mono text-[11px] uppercase tracking-wider">
            <span className="text-terracotta-ink">{eyebrowNum}</span>
            <span className="h-px w-7 bg-terracotta" />
            <span className="text-paper-mute">{t("eyebrow")}</span>
          </div>
          <h2 className="mt-6 max-w-xl font-display text-display-lg leading-tight text-paper">
            {t("title")}
          </h2>
          <p className="mt-5 max-w-xl text-lede leading-relaxed text-paper-dim">
            {t("intro")}
          </p>

          <div className="mt-8 grid gap-2 sm:grid-cols-2">
            {rhythmOptions.map((option) => {
              const active = selected.includes(option.key);
              return (
                <button
                  key={option.key}
                  type="button"
                  onClick={() => toggle(option.key)}
                  className={cn(
                    "group flex min-h-[74px] items-start gap-3 border px-4 py-3 text-start transition-colors duration-fast",
                    active
                      ? "border-terracotta bg-terracotta/10 text-paper"
                      : "border-ink-4 bg-ink-2 text-paper-mute hover:border-ink-5",
                  )}
                  aria-pressed={active}
                >
                  <span
                    className={cn(
                      "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
                      active
                        ? "border-terracotta bg-terracotta text-[#06101f]"
                        : "border-ink-5 text-transparent",
                    )}
                  >
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  <span>
                    <span className="block text-sm font-medium text-paper">
                      {tSignals(`${option.key}.label`)}
                    </span>
                    <span className="mt-1 block text-xs leading-5 text-paper-mute">
                      {tSignals(`${option.key}.description`)}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="border border-ink-3 bg-ink-2 p-3">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink-3 px-2 pb-3">
            <div className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-terracotta-ink">
              <SlidersHorizontal className="h-4 w-4" />
              {t("liveMatch")}
            </div>
            <div className="inline-flex items-center gap-2 border border-ink-4 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-paper-mute">
              <Sparkles className="h-3.5 w-3.5 text-terracotta-ink" />
              {t("signals", {
                count: selected.length || defaultRhythms.length,
              })}
            </div>
          </div>

          <div className="mt-3 space-y-3">
            {matches.map((match, index) => (
              <Link
                key={match.neighborhood.slug}
                href={`/guides/neighborhoods/${match.neighborhood.slug}`}
                className="group grid gap-4 border border-ink-3 bg-ink-1 p-3 transition-colors duration-fast hover:border-ink-5 sm:grid-cols-[9rem_1fr]"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-ink-3">
                  <Image
                    src={match.neighborhood.hero.src}
                    alt={match.neighborhood.hero.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, 180px"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                  <div className="absolute start-2 top-2 bg-ink-0/80 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-paper">
                    #{index + 1}
                  </div>
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="font-display text-h3 text-paper">
                        {tList(`${match.neighborhood.slug}.name`)}
                      </h3>
                      <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-paper-mute">
                        {t("fit", {
                          score: match.score,
                          // Wrap the LTR rent run in Unicode LRI/PDI so the
                          // bidi algorithm renders it left-to-right even inside
                          // RTL (fa/ar) message templates.
                          rent: `⁦${formatRentRange(match.neighborhood)}⁩`,
                        })}
                      </p>
                    </div>
                    <ArrowRight className="mt-1 h-5 w-5 shrink-0 text-paper-faint transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1 group-hover:text-terracotta-ink" />
                  </div>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {match.matchingRhythms.slice(0, 3).map((rhythm) => (
                      <span
                        key={rhythm.key}
                        className="border border-ink-4 px-2 py-1 font-mono text-[10px] uppercase tracking-wide text-paper-mute"
                      >
                        {tSignals(`${rhythm.key}.short`)}
                      </span>
                    ))}
                    {match.matchingRhythms.length === 0 &&
                      match.neighborhood.badges.slice(0, 2).map((badgeKey) => (
                        <span
                          key={badgeKey}
                          className="border border-ink-4 px-2 py-1 font-mono text-[10px] uppercase tracking-wide text-paper-mute"
                        >
                          {tList(
                            `${match.neighborhood.slug}.badges.${badgeKey}`,
                          )}
                        </span>
                      ))}
                  </div>

                  <ul className="mt-3 space-y-1 text-sm leading-6 text-paper-dim">
                    {match.reasons.slice(0, 2).map((reasonCode) => (
                      <li key={reasonCode}>
                        {reasonCode === "oneLiner"
                          ? tList(`${match.neighborhood.slug}.oneLiner`)
                          : t(`reasons.${reasonCode}`)}
                      </li>
                    ))}
                  </ul>
                </div>
              </Link>
            ))}
          </div>

          {matches[0] ? (
            <div className="mt-4 flex flex-col gap-3 border border-ink-3 bg-ink-1 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-wider text-terracotta-ink">
                  {t("turnIntoWeekOne")}
                </p>
                <p className="mt-1 text-sm leading-6 text-paper-dim">
                  {t("useAsBase", {
                    neighborhood: tList(`${matches[0].neighborhood.slug}.name`),
                  })}
                </p>
              </div>
              <Link
                href={`/plans?neighborhood=${matches[0].neighborhood.slug}`}
                className="inline-flex shrink-0 items-center justify-center gap-2 bg-terracotta px-4 py-2.5 text-sm font-medium text-[#06101f] transition-colors duration-fast hover:bg-terracotta-dim"
              >
                {t("planFromMatch")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
