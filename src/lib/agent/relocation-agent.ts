// Relocation agent's plan generator. ONE LLM call - Sonnet builds the
// structured plan, then we synthesise the human-readable narrative
// summary deterministically from that JSON. Two LLM calls in a row was
// blowing past Vercel's 60s Hobby function cap on cold starts.
//
// Reference:
//   - https://ai-sdk.dev/docs/ai-sdk-core/generating-structured-data
//   - https://ai-sdk.dev/providers/ai-sdk-providers/anthropic

import { generateObject } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { SYSTEM_PROMPT, buildPlanPrompt } from "./prompts";
import { relocationPlanSchema } from "./types";
import type {
  RelocationIntake,
  RelocationPlan,
  RetrievedContext,
} from "./types";

export const PLAN_MODEL = "claude-sonnet-4-6";

export interface GeneratePlanResult {
  plan: RelocationPlan;
  planText: string;
  model: string;
}

// Deterministic narrative built from the structured plan. Reuses fields
// the agent already produced (neighborhood reasoning, tips), so the voice
// stays grounded without a second LLM round-trip. No em dashes, casual
// contractions, in line with brand rules
export function synthesizeNarrative(plan: RelocationPlan): string {
  const primary = plan.neighborhood_match.primary;
  const alternates = plan.neighborhood_match.alternates ?? [];
  const reasoning = plan.neighborhood_match.reasoning.trim();
  const total = plan.cost_breakdown.monthly_total_usd;
  const tier = plan.cost_breakdown.tier;
  const tierWord =
    tier === "low" ? "budget" : tier === "high" ? "comfortable" : "moderate";

  // Find week-1 priority items (sorted ascending by week, then index)
  const week1 = plan.setup_plan
    .filter((w) => w.week === 1)
    .flatMap((w) => w.items)
    .slice(0, 1);
  const firstTip = (plan.tips ?? [])[0];

  const parts: string[] = [];

  parts.push(`${primary} is your best landing spot.`);
  if (reasoning) parts.push(reasoning);
  parts.push(
    `At the ${tierWord} tier, you're looking at about $${total} a month, all in.`,
  );

  if (alternates.length > 0) {
    if (alternates.length === 1) {
      parts.push(
        `If ${primary} doesn't click once you're on the ground, ${alternates[0]} is the next-best fit.`,
      );
    } else {
      const last = alternates[alternates.length - 1];
      const head = alternates.slice(0, -1).join(", ");
      parts.push(
        `${head} and ${last} are solid alternates if ${primary} doesn't click in person.`,
      );
    }
  }

  if (week1.length > 0) {
    parts.push(`Week one, the move is: ${week1[0].title}. ${week1[0].why}`);
  }

  if (firstTip) {
    parts.push(`One thing you'll thank us for later: ${firstTip}`);
  }

  return parts.join(" ");
}

export async function generatePlan(
  intake: RelocationIntake,
  context: RetrievedContext,
  planModel: string = PLAN_MODEL,
): Promise<GeneratePlanResult> {
  const planResult = await generateObject({
    model: anthropic(planModel),
    schema: relocationPlanSchema,
    system: SYSTEM_PROMPT,
    prompt: buildPlanPrompt(intake, context),
    maxRetries: 1,
  });

  // generateObject already validates against the schema, but a final parse
  // catches any drift between the model's output and our Zod constraints
  const plan = relocationPlanSchema.parse(planResult.object);

  return {
    plan,
    planText: synthesizeNarrative(plan),
    model: planModel,
  };
}
