"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { RelocationPlanResponse } from "@/lib/agent/types";
import { neighborhoods } from "@/lib/neighborhoods";
import { MapPin, Banknote, ListChecks, Compass, Sparkles } from "lucide-react";
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

interface ResultProps {
  response: RelocationPlanResponse;
  onReset: () => void;
}

export function RelocationAgentResult({ response, onReset }: ResultProps) {
  const { plan_text, plan_json, retrieved_chunk_count } = response;
  const primary = neighborhoods.find(
    (n) =>
      n.name.toLowerCase() ===
      plan_json.neighborhood_match.primary.toLowerCase(),
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardDescription className="uppercase tracking-wider">
            Your plan, in plain English
          </CardDescription>
          <CardTitle>Plan summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-line text-base leading-relaxed text-neutral-700 dark:text-[#d5dbdb]">
            {plan_text}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex items-start gap-3">
          <MapPin className="mt-1 h-5 w-5 text-primary-600 dark:text-primary-400" />
          <div>
            <CardDescription className="uppercase tracking-wider">
              Neighborhood match
            </CardDescription>
            <CardTitle>{plan_json.neighborhood_match.primary}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {primary && (
            <dl className="grid gap-3 rounded-md border border-neutral-100 bg-neutral-50 p-4 text-sm dark:border-[rgba(44,62,80,0.12)] dark:bg-[rgba(44,62,80,0.08)] sm:grid-cols-2">
              <div>
                <dt className="text-xs font-medium uppercase tracking-wider text-neutral-500">
                  Side
                </dt>
                <dd className="mt-0.5 text-neutral-900 dark:text-[#f2f3f4]">
                  {primary.side}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wider text-neutral-500">
                  Rent (1BR)
                </dt>
                <dd className="mt-0.5 text-neutral-900 dark:text-[#f2f3f4]">
                  ${primary.rentUsd.low}-{primary.rentUsd.high} / month
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wider text-neutral-500">
                  Vibe
                </dt>
                <dd className="mt-0.5 text-neutral-900 dark:text-[#f2f3f4]">
                  {primary.vibe}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wider text-neutral-500">
                  Noise
                </dt>
                <dd className="mt-0.5 text-neutral-900 dark:text-[#f2f3f4]">
                  {primary.noise}
                </dd>
              </div>
            </dl>
          )}
          <p className="text-sm leading-relaxed text-neutral-700 dark:text-[#d5dbdb]">
            {plan_json.neighborhood_match.reasoning}
          </p>
          {plan_json.neighborhood_match.alternates.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="text-neutral-500">Also worth a look:</span>
              {plan_json.neighborhood_match.alternates.map((a) => (
                <span
                  key={a}
                  className="rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-800 dark:bg-primary-900/30 dark:text-primary-200"
                >
                  {a}
                </span>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex items-start gap-3">
          <Banknote className="mt-1 h-5 w-5 text-primary-600 dark:text-primary-400" />
          <div>
            <CardDescription className="uppercase tracking-wider">
              {plan_json.cost_breakdown.tier} tier - approximate
            </CardDescription>
            <CardTitle>
              ${plan_json.cost_breakdown.monthly_total_usd} / month
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <dl className="divide-y divide-neutral-100 text-sm dark:divide-[rgba(44,62,80,0.12)]">
            {plan_json.cost_breakdown.lines.map((line, i) => (
              <div
                key={`${line.label}-${i}`}
                className="flex flex-col gap-0.5 py-2.5 sm:flex-row sm:items-center sm:justify-between"
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
                  ${line.usd}
                  <span className="ml-2 text-xs text-neutral-500">
                    {line.tl.toLocaleString()} TL
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>

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
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {plan_json.setup_plan
              .sort((a, b) => a.week - b.week)
              .map((week) => (
                <div
                  key={week.week}
                  className="rounded-md border border-neutral-100 bg-neutral-50 p-4 dark:border-[rgba(44,62,80,0.12)] dark:bg-[rgba(44,62,80,0.08)]"
                >
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-primary-700 dark:text-primary-400">
                    Week {week.week}
                  </p>
                  <ul className="space-y-3 text-sm">
                    {week.items.map((item, i) => (
                      <li key={`${week.week}-${i}`}>
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
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
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
            <ol className="space-y-2 text-sm leading-relaxed text-neutral-700 dark:text-[#d5dbdb]">
              {plan_json.strategy.map((item, i) => (
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
            <ul className="space-y-2 text-sm leading-relaxed text-neutral-700 dark:text-[#d5dbdb]">
              {plan_json.tips.map((tip, i) => (
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
      </div>

      <div className="flex flex-col gap-4 rounded-lg border border-neutral-100 bg-neutral-50 p-4 text-xs text-neutral-600 dark:border-[rgba(44,62,80,0.12)] dark:bg-[rgba(44,62,80,0.08)] dark:text-[#99a3ad] sm:flex-row sm:items-center sm:justify-between">
        <p>
          Built from {retrieved_chunk_count} verified chunk
          {retrieved_chunk_count === 1 ? "" : "s"} of our content. Sources:{" "}
          {plan_json.citations
            .map(
              (c) =>
                `${SOURCE_TYPE_LABELS[c.source_type] ?? c.source_type}: ${c.source}`,
            )
            .join(" - ")}
        </p>
        <Button type="button" variant="secondary" size="sm" onClick={onReset}>
          Start over
        </Button>
      </div>
    </div>
  );
}
