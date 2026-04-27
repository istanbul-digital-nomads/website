// Three monthly budget tiers, lifted line-for-line from
// src/content/guides/cost-of-living.mdx (last updated 2026-04-02). Numbers
// here must stay in lockstep with that guide. The agent uses these as the
// always-on cost context so it never invents a budget tier
//
// If you change a price, update the guide too - and bump the lastUpdated
// date below

import type { CostTier } from "./types";

export const COST_TIERS_LAST_UPDATED = "2026-04-02";

export const costTiers: CostTier[] = [
  {
    tier: "low",
    label: "Budget (~$750/month)",
    monthly_total_usd: 750,
    lines: [
      {
        label: "Rent (studio, outer neighborhood)",
        usd: 385,
        tl: 12000,
        note: "Sharing or studio outside the centre",
      },
      { label: "Groceries", usd: 160, tl: 5000 },
      {
        label: "Eating out",
        usd: 65,
        tl: 2000,
        note: "Occasional only - mostly cooking at home",
      },
      { label: "Transport (Istanbulkart)", usd: 16, tl: 500 },
      { label: "Phone / internet", usd: 10, tl: 300 },
      {
        label: "Cafes (working from)",
        usd: 48,
        tl: 1500,
        note: "Coffee while working - no coworking",
      },
      { label: "Entertainment / misc", usd: 65, tl: 2000 },
    ],
  },
  {
    tier: "medium",
    label: "Moderate (~$1,205/month)",
    monthly_total_usd: 1205,
    lines: [
      {
        label: "Rent (1BR, Kadikoy / Besiktas)",
        usd: 640,
        tl: 20000,
        note: "Furnished 1-bedroom in a popular neighborhood",
      },
      { label: "Groceries", usd: 190, tl: 6000 },
      {
        label: "Eating out (3-4x / week)",
        usd: 130,
        tl: 4000,
      },
      {
        label: "Transport (Istanbulkart + occasional taxi)",
        usd: 32,
        tl: 1000,
      },
      { label: "Phone / internet", usd: 10, tl: 300 },
      {
        label: "Coworking (Kolektif House)",
        usd: 16,
        tl: 500,
        note: "Day pass once or twice a week",
      },
      { label: "Cafes", usd: 65, tl: 2000 },
      { label: "Entertainment / social", usd: 96, tl: 3000 },
      { label: "Gym", usd: 26, tl: 800 },
    ],
  },
  {
    tier: "high",
    label: "Comfortable (~$1,970/month)",
    monthly_total_usd: 1970,
    lines: [
      {
        label: "Rent (1BR, Cihangir / central Kadikoy)",
        usd: 1120,
        tl: 35000,
        note: "Nice furnished apartment in a central neighborhood",
      },
      { label: "Groceries", usd: 190, tl: 6000 },
      { label: "Eating out (daily)", usd: 225, tl: 7000 },
      {
        label: "Transport (taxis + Istanbulkart)",
        usd: 80,
        tl: 2500,
      },
      { label: "Phone / internet", usd: 16, tl: 500 },
      { label: "Coworking (premium)", usd: 32, tl: 1000 },
      { label: "Cafes / bars", usd: 96, tl: 3000 },
      {
        label: "Entertainment / social / travel",
        usd: 160,
        tl: 5000,
      },
      { label: "Gym / wellness", usd: 48, tl: 1500 },
    ],
  },
];

export function pickTierForBudget(
  monthlyUsd: number,
): "low" | "medium" | "high" {
  if (monthlyUsd < 1000) return "low";
  if (monthlyUsd < 1700) return "medium";
  return "high";
}
