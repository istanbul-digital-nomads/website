// Relocation agent's plan generator. One typed call to Claude via the
// Vercel AI SDK, plus a follow-up generateText for the narrative summary
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

export const DEFAULT_MODEL = "claude-sonnet-4-6";

export interface GeneratePlanResult {
  plan: RelocationPlan;
  planText: string;
  model: string;
}

export async function generatePlan(
  intake: RelocationIntake,
  context: RetrievedContext,
  model: string = DEFAULT_MODEL,
): Promise<GeneratePlanResult> {
  const planResult = await generateObject({
    model: anthropic(model),
    schema: relocationPlanSchema,
    system: SYSTEM_PROMPT,
    prompt: buildPlanPrompt(intake, context),
    maxRetries: 1,
  });

  // generateObject already validates against the schema, but a final parse
  // catches any drift between the model's output and our Zod constraints
  const plan = relocationPlanSchema.parse(planResult.object);

  const narrativeResult = await generateText({
    model: anthropic(model),
    system: NARRATIVE_SYSTEM_PROMPT,
    prompt: buildNarrativePrompt(intake, plan),
    maxRetries: 1,
  });

  return {
    plan,
    planText: narrativeResult.text.trim(),
    model,
  };
}
