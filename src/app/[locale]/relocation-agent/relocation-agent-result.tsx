"use client";

import Image from "next/image";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type {
  RelocationIntake,
  RelocationPlanResponse,
} from "@/lib/agent/types";
import { neighborhoods } from "@/lib/neighborhoods";
import { COUNTRIES } from "@/lib/path-to-istanbul";
import {
  MapPin,
  Banknote,
  ListChecks,
  Compass,
  Sparkles,
  Home,
  ShoppingBasket,
  Bus,
  Briefcase,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const SOURCE_TYPE_LABELS: Record<string, string> = {
  guide: "Guide",
  blog: "Blog",
  path: "Country playbook",
  neighborhood: "Neighborhood",
  space: "Space",
  "cost-tier": "Cost tier",
  "setup-step": "Setup step",
};

const SOURCE_BASE_PATH: Record<string, string> = {
  guide: "/guides",
  blog: "/blog",
  path: "/path-to-istanbul",
  neighborhood: "/guides/neighborhoods",
  space: "/spaces",
  "cost-tier": "/guides/cost-of-living",
  "setup-step": "/guides",
};

interface ResultProps {
  intake: RelocationIntake;
  response: RelocationPlanResponse;
  onReset: () => void;
}

export function RelocationAgentResult({
  intake,
  response,
  onReset,
}: ResultProps) {
  const { plan_text, plan_json, retrieved_chunk_count } = response;
  const primary = neighborhoods.find(
    (n) =>
      n.name.toLowerCase() ===
      plan_json.neighborhood_match.primary.toLowerCase(),
  );
  const alternates = plan_json.neighborhood_match.alternates
    .map((name) =>
      neighborhoods.find((n) => n.name.toLowerCase() === name.toLowerCase()),
    )
    .filter((n): n is NonNullable<typeof n> => !!n);

  const tierLabel =
    plan_json.cost_breakdown.tier === "low"
      ? "Budget"
      : plan_json.cost_breakdown.tier === "high"
        ? "Comfortable"
        : "Moderate";

  return (
    <div className="space-y-8">
      <IntakeRecap intake={intake} />

      <PlanSummaryCard text={plan_text} />

      {primary && (
        <NeighborhoodMatchCard
          primary={primary}
          alternates={alternates}
          reasoning={plan_json.neighborhood_match.reasoning}
        />
      )}

      <AtAGlanceStrip
        monthlyTotal={plan_json.cost_breakdown.monthly_total_usd}
        tierLabel={tierLabel}
        weekCount={plan_json.setup_plan.length}
        tipCount={plan_json.tips.length}
      />

      <CostBreakdownCard breakdown={plan_json.cost_breakdown} />

      <SetupPlanCard weeks={plan_json.setup_plan} />

      <div className="grid gap-6 md:grid-cols-2">
        <StrategyCard items={plan_json.strategy} />
        <TipsCard items={plan_json.tips} />
      </div>

      <SourcesFooter
        citations={plan_json.citations}
        retrievedCount={retrieved_chunk_count}
      />

      <ActionRow onReset={onReset} planText={plan_text} />
    </div>
  );
}

// ----------------------------------------------------------------------------

function IntakeRecap({ intake }: { intake: RelocationIntake }) {
  const country = intake.originCountry
    ? COUNTRIES.find((c) => c.slug === intake.originCountry)
    : null;
  const items = [
    `${intake.currency} ${intake.budget.toLocaleString()}/month`,
    intake.duration.replace(/-/g, " "),
    `${intake.lifestyle} lifestyle`,
    intake.work.replace(/-/g, " "),
    country ? `from ${country.flag} ${country.name}` : null,
  ].filter(Boolean) as string[];

  return (
    <div className="rounded-lg border border-neutral-100 bg-neutral-50 px-4 py-3 text-sm dark:border-[rgba(44,62,80,0.12)] dark:bg-[rgba(44,62,80,0.08)]">
      <p className="text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-[#85929e]">
        Your plan, based on
      </p>
      <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-neutral-700 dark:text-[#d5dbdb]">
        {items.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-2">
            <span>{item}</span>
            {i < items.length - 1 && (
              <span
                aria-hidden="true"
                className="text-neutral-300 dark:text-[#5d6d7e]"
              >
                •
              </span>
            )}
          </span>
        ))}
      </p>
    </div>
  );
}

// ----------------------------------------------------------------------------

function PlanSummaryCard({ text }: { text: string }) {
  return (
    <Card>
      <CardHeader>
        <CardDescription className="uppercase tracking-wider">
          Your plan, in plain English
        </CardDescription>
        <CardTitle>The short version</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="whitespace-pre-line text-base leading-relaxed text-neutral-700 dark:text-[#d5dbdb]">
          {text}
        </p>
      </CardContent>
    </Card>
  );
}

// ----------------------------------------------------------------------------

function NeighborhoodMatchCard({
  primary,
  alternates,
  reasoning,
}: {
  primary: (typeof neighborhoods)[number];
  alternates: (typeof neighborhoods)[number][];
  reasoning: string;
}) {
  return (
    <Card className="overflow-hidden">
      <div className="grid md:grid-cols-[1.1fr_1fr]">
        <div className="relative h-56 md:h-auto">
          <Image
            src={primary.hero.src}
            alt={primary.hero.alt}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            priority={false}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-black/0 md:bg-gradient-to-r md:from-black/0 md:to-black/0" />
          <div className="absolute bottom-3 left-4 flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-neutral-700 backdrop-blur dark:bg-[#1a1a2e]/90 dark:text-[#f2f3f4]">
            <MapPin className="h-3.5 w-3.5 text-primary-600 dark:text-primary-400" />
            {primary.side} side
          </div>
        </div>

        <div className="p-6 md:p-8">
          <p className="text-xs font-medium uppercase tracking-wider text-primary-700 dark:text-primary-400">
            Best fit
          </p>
          <h2 className="mt-1 text-2xl font-semibold text-neutral-900 dark:text-[#f2f3f4]">
            {primary.name}
          </h2>
          <p className="mt-1 text-sm italic text-neutral-500 dark:text-[#85929e]">
            {primary.oneLiner}
          </p>

          <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
            <div>
              <dt className="text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-[#85929e]">
                Rent (1BR)
              </dt>
              <dd className="mt-0.5 font-medium text-neutral-900 dark:text-[#f2f3f4]">
                ${primary.rentUsd.low}-{primary.rentUsd.high}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-[#85929e]">
                Noise
              </dt>
              <dd className="mt-0.5 font-medium text-neutral-900 dark:text-[#f2f3f4]">
                {primary.noise}
              </dd>
            </div>
            <div className="col-span-2">
              <dt className="text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-[#85929e]">
                Best for
              </dt>
              <dd className="mt-1 flex flex-wrap gap-1.5">
                {primary.bestFor.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-medium text-primary-800 dark:bg-primary-900/30 dark:text-primary-200"
                  >
                    {tag}
                  </span>
                ))}
              </dd>
            </div>
          </dl>

          <p className="mt-5 border-t border-neutral-100 pt-4 text-sm leading-relaxed text-neutral-700 dark:border-[rgba(44,62,80,0.12)] dark:text-[#d5dbdb]">
            {reasoning}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
            <a
              href={`/guides/neighborhoods/${primary.slug}`}
              className="inline-flex items-center gap-1 font-medium text-primary-700 hover:text-primary-800 dark:text-primary-300 dark:hover:text-primary-200"
            >
              Read the {primary.name} guide
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>

          {alternates.length > 0 && (
            <div className="mt-5 border-t border-neutral-100 pt-4 dark:border-[rgba(44,62,80,0.12)]">
              <p className="text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-[#85929e]">
                Also worth a look
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {alternates.map((alt) => (
                  <a
                    key={alt.slug}
                    href={`/guides/neighborhoods/${alt.slug}`}
                    className="group rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-medium text-neutral-700 transition-colors hover:border-primary-300 hover:bg-primary-50 hover:text-primary-800 dark:border-[rgba(44,62,80,0.2)] dark:bg-[rgba(44,62,80,0.08)] dark:text-[#d5dbdb] dark:hover:border-primary-500/40 dark:hover:bg-primary-900/20"
                  >
                    {alt.name}
                    <span className="ml-1 text-neutral-400 group-hover:text-primary-600 dark:text-[#85929e]">
                      ${alt.rentUsd.low}-{alt.rentUsd.high}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

// ----------------------------------------------------------------------------

function AtAGlanceStrip({
  monthlyTotal,
  tierLabel,
  weekCount,
  tipCount,
}: {
  monthlyTotal: number;
  tierLabel: string;
  weekCount: number;
  tipCount: number;
}) {
  const stats = [
    { label: "Monthly total", value: `$${monthlyTotal.toLocaleString()}` },
    { label: "Tier", value: tierLabel },
    {
      label: "Week plan",
      value: `${weekCount} ${weekCount === 1 ? "week" : "weeks"}`,
    },
    { label: "Tips for you", value: tipCount },
  ];
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {stats.map((s) => (
        <div
          key={s.label}
          className="rounded-md border border-neutral-100 bg-white p-4 text-center dark:border-[rgba(44,62,80,0.12)] dark:bg-[rgba(44,62,80,0.08)]"
        >
          <p className="text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-[#85929e]">
            {s.label}
          </p>
          <p className="mt-1 text-xl font-semibold text-neutral-900 dark:text-[#f2f3f4]">
            {s.value}
          </p>
        </div>
      ))}
    </div>
  );
}

// ----------------------------------------------------------------------------

const COST_GROUP_FOR_LABEL = (label: string): string => {
  const l = label.toLowerCase();
  if (/rent/.test(l)) return "Housing";
  if (/grocer|eating out|cafe|bar|food/.test(l)) return "Food & drink";
  if (/transport|istanbulkart|taxi/.test(l)) return "Transport";
  if (/internet|phone/.test(l)) return "Connectivity";
  if (/coworking/.test(l)) return "Work";
  if (/gym|wellness|entertainment|social|travel|misc/.test(l))
    return "Lifestyle";
  return "Other";
};

const COST_GROUP_ICON: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  Housing: Home,
  "Food & drink": ShoppingBasket,
  Transport: Bus,
  Connectivity: Briefcase,
  Work: Briefcase,
  Lifestyle: Sparkles,
  Other: Banknote,
};

function CostBreakdownCard({
  breakdown,
}: {
  breakdown: RelocationPlanResponse["plan_json"]["cost_breakdown"];
}) {
  const grouped = breakdown.lines.reduce<
    Record<
      string,
      {
        usd: number;
        tl: number;
        items: typeof breakdown.lines;
      }
    >
  >((acc, line) => {
    const group = COST_GROUP_FOR_LABEL(line.label);
    if (!acc[group]) acc[group] = { usd: 0, tl: 0, items: [] };
    acc[group].usd += line.usd;
    acc[group].tl += line.tl;
    acc[group].items.push(line);
    return acc;
  }, {});

  // Order groups by total spend desc
  const orderedGroups = Object.entries(grouped).sort(
    (a, b) => b[1].usd - a[1].usd,
  );

  return (
    <Card>
      <CardHeader className="flex items-start gap-3">
        <Banknote className="mt-1 h-5 w-5 text-primary-600 dark:text-primary-400" />
        <div className="flex-1">
          <CardDescription className="uppercase tracking-wider">
            {breakdown.tier} tier - approximate
          </CardDescription>
          <div className="flex items-end justify-between gap-3">
            <CardTitle>
              ${breakdown.monthly_total_usd.toLocaleString()} / month
            </CardTitle>
            <span className="text-sm text-neutral-500 dark:text-[#85929e]">
              ≈ {breakdown.lines.reduce((s, l) => s + l.tl, 0).toLocaleString()}{" "}
              TL
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          {orderedGroups.map(([group, data]) => {
            const Icon = COST_GROUP_ICON[group] ?? Banknote;
            return (
              <div key={group}>
                <div className="flex items-center justify-between border-b border-neutral-100 pb-1.5 dark:border-[rgba(44,62,80,0.12)]">
                  <div className="flex items-center gap-2">
                    <Icon className="h-3.5 w-3.5 text-neutral-500 dark:text-[#85929e]" />
                    <p className="text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-[#d5dbdb]">
                      {group}
                    </p>
                  </div>
                  <p className="text-sm font-semibold tabular-nums text-neutral-900 dark:text-[#f2f3f4]">
                    ${data.usd.toLocaleString()}
                  </p>
                </div>
                <dl className="mt-2 space-y-1.5 text-sm">
                  {data.items.map((line, i) => (
                    <div
                      key={`${line.label}-${i}`}
                      className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between"
                    >
                      <dt className="text-neutral-700 dark:text-[#d5dbdb]">
                        {line.label}
                        {line.note && (
                          <span className="ml-2 text-xs text-neutral-500">
                            ({line.note})
                          </span>
                        )}
                      </dt>
                      <dd className="font-medium tabular-nums text-neutral-900 dark:text-[#f2f3f4]">
                        ${line.usd.toLocaleString()}
                        <span className="ml-2 text-xs text-neutral-500">
                          {line.tl.toLocaleString()} TL
                        </span>
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

// ----------------------------------------------------------------------------

function SetupPlanCard({
  weeks,
}: {
  weeks: RelocationPlanResponse["plan_json"]["setup_plan"];
}) {
  const sorted = [...weeks].sort((a, b) => a.week - b.week);
  return (
    <Card>
      <CardHeader className="flex items-start gap-3">
        <ListChecks className="mt-1 h-5 w-5 text-primary-600 dark:text-primary-400" />
        <div>
          <CardDescription className="uppercase tracking-wider">
            First month
          </CardDescription>
          <CardTitle>Setup plan</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <ol className="space-y-6">
          {sorted.map((week, weekIdx) => (
            <li key={week.week} className="relative pl-10">
              {/* Week marker */}
              <div className="absolute left-0 top-0 flex h-7 w-7 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-800 dark:bg-primary-900/40 dark:text-primary-200">
                {week.week}
              </div>
              {/* Vertical timeline line, except after last */}
              {weekIdx < sorted.length - 1 && (
                <div
                  aria-hidden="true"
                  className="absolute left-3.5 top-7 h-full w-px -translate-x-1/2 bg-primary-100 dark:bg-primary-900/40"
                />
              )}

              <p className="text-sm font-semibold uppercase tracking-wider text-primary-700 dark:text-primary-400">
                Week {week.week}
              </p>

              <ul className="mt-2 space-y-3 text-sm">
                {week.items.map((item, i) => (
                  <li key={`${week.week}-${i}`} className="flex gap-2">
                    <CheckCircle2
                      className="mt-0.5 h-4 w-4 shrink-0 text-primary-500/80 dark:text-primary-400/80"
                      aria-hidden="true"
                    />
                    <div>
                      <p className="font-medium text-neutral-900 dark:text-[#f2f3f4]">
                        {item.link ? (
                          <a
                            href={item.link}
                            className="hover:text-primary-700 dark:hover:text-primary-300"
                          >
                            {item.title}
                          </a>
                        ) : (
                          item.title
                        )}
                      </p>
                      <p className="mt-0.5 text-neutral-600 dark:text-[#99a3ad]">
                        {item.why}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}

// ----------------------------------------------------------------------------

function StrategyCard({ items }: { items: string[] }) {
  return (
    <Card>
      <CardHeader className="flex items-start gap-3">
        <Compass className="mt-1 h-5 w-5 text-primary-600 dark:text-primary-400" />
        <div>
          <CardDescription className="uppercase tracking-wider">
            Strategy
          </CardDescription>
          <CardTitle>The bigger picture</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <ol className="space-y-3 text-sm leading-relaxed text-neutral-700 dark:text-[#d5dbdb]">
          {items.map((item, i) => (
            <li key={i} className="flex gap-3">
              <span
                className={cn(
                  "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                  "bg-primary-100 text-primary-800 dark:bg-primary-900/40 dark:text-primary-200",
                )}
              >
                {i + 1}
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}

function TipsCard({ items }: { items: string[] }) {
  return (
    <Card>
      <CardHeader className="flex items-start gap-3">
        <Sparkles className="mt-1 h-5 w-5 text-primary-600 dark:text-primary-400" />
        <div>
          <CardDescription className="uppercase tracking-wider">
            Tips
          </CardDescription>
          <CardTitle>Things you&apos;ll thank us for</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3 text-sm leading-relaxed text-neutral-700 dark:text-[#d5dbdb]">
          {items.map((tip, i) => (
            <li key={i} className="flex gap-2">
              <span
                className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-400 dark:bg-primary-500"
                aria-hidden="true"
              />
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

// ----------------------------------------------------------------------------

function SourcesFooter({
  citations,
  retrievedCount,
}: {
  citations: RelocationPlanResponse["plan_json"]["citations"];
  retrievedCount: number;
}) {
  if (citations.length === 0) return null;
  return (
    <div className="rounded-lg border border-neutral-100 bg-neutral-50 p-5 dark:border-[rgba(44,62,80,0.12)] dark:bg-[rgba(44,62,80,0.08)]">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-[#85929e]">
          Why we picked this
        </p>
        <p className="text-xs text-neutral-500 dark:text-[#85929e]">
          Built deterministically from {citations.length} verified source
          {citations.length === 1 ? "" : "s"}
          {retrievedCount > 0 && ` + ${retrievedCount} retrieved chunks`}
        </p>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {citations.map((c, i) => {
          const base = SOURCE_BASE_PATH[c.source_type];
          const href = base ? `${base}/${c.source_slug}` : null;
          const label = `${SOURCE_TYPE_LABELS[c.source_type] ?? c.source_type}: ${c.source}`;
          return href ? (
            <a
              key={`${c.source_slug}-${i}`}
              href={href}
              className="inline-flex items-center gap-1 rounded-md border border-neutral-200 bg-white px-2.5 py-1 text-xs font-medium text-neutral-700 transition-colors hover:border-primary-300 hover:bg-primary-50 hover:text-primary-800 dark:border-[rgba(44,62,80,0.2)] dark:bg-[#1a1a2e] dark:text-[#d5dbdb] dark:hover:border-primary-500/40 dark:hover:bg-primary-900/20"
            >
              {label}
              <ArrowRight className="h-3 w-3" />
            </a>
          ) : (
            <span
              key={`${c.source_slug}-${i}`}
              className="inline-flex items-center rounded-md border border-neutral-200 bg-white px-2.5 py-1 text-xs font-medium text-neutral-600 dark:border-[rgba(44,62,80,0.2)] dark:bg-[#1a1a2e] dark:text-[#99a3ad]"
            >
              {label}
            </span>
          );
        })}
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------

function ActionRow({
  onReset,
  planText,
}: {
  onReset: () => void;
  planText: string;
}) {
  function handleEmail() {
    const subject = encodeURIComponent("My Istanbul relocation plan");
    const body = encodeURIComponent(planText);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  }
  return (
    <div className="flex flex-col-reverse items-stretch gap-3 border-t border-neutral-100 pt-6 sm:flex-row sm:items-center sm:justify-between dark:border-[rgba(44,62,80,0.12)]">
      <Button type="button" variant="ghost" onClick={onReset}>
        Start over
      </Button>
      <Button type="button" variant="secondary" onClick={handleEmail}>
        Email this to me
      </Button>
    </div>
  );
}
