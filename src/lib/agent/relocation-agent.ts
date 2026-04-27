// Relocation agent's plan generator. One typed call to Sonnet for the
// structured plan, plus a faster Haiku call for the narrative summary so we
// stay comfortably under Vercel's 60s function cap on the Hobby plan
//
// Reference:
//   - https://ai-sdk.dev/docs/ai-sdk-core/generating-structured-data
//   - https://ai-sdk.dev/providers/ai-sdk-providers/anthropic

import { generateObject, generateText } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import {
  SYSTEM_PROMPT,
  NARRATIVE_SYSTEM_PROMPT,
  buildPlanPrompt,
  buildNarrativePrompt,
} from "./prompts";
import { relocationPlanSchema } from "./types";
import type {
  RelocationIntake,
  RelocationPlan,
  RetrievedContext,
} from "./types";

// Sonnet for the structured plan (high stakes, picks the neighborhood and
// builds the cost breakdown), Haiku for the narrative rewrite (cheap and
// fast - it's just rephrasing the JSON the agent already produced)
export const PLAN_MODEL = "claude-sonnet-4-6";
export const NARRATIVE_MODEL = "claude-haiku-4-5";

export interface GeneratePlanResult {
  plan: RelocationPlan;
  planText: string;
  model: string;
}

export async function generatePlan(
  intake: RelocationIntake,
  context: RetrievedContext,
  planModel: string = PLAN_MODEL,
  narrativeModel: string = NARRATIVE_MODEL,
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

  const narrativeResult = await generateText({
    model: anthropic(narrativeModel),
    system: NARRATIVE_SYSTEM_PROMPT,
    prompt: buildNarrativePrompt(intake, plan),
    maxRetries: 1,
  });

  return {
    plan,
    planText: narrativeResult.text.trim(),
    model: planModel,
  };
}
