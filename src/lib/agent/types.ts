import { z } from "zod";

// Visitor intake. Mirrors the form fields on /relocation-agent and the body
// shape POSTed to /api/relocation-agent. Keep this list short - the agent
// performs better with a few well-chosen signals than with a long survey
export const relocationIntakeSchema = z.object({
  budget: z
    .number()
    .int()
    .min(200, "Budget seems too low. Try at least 200.")
    .max(20000, "Budget seems too high. Try below 20000."),
  currency: z.enum(["USD", "EUR", "TL"]),
  duration: z.enum(["few-weeks", "1-3-months", "3-6-months", "6-plus-months"]),
  lifestyle: z.enum(["social", "quiet", "mixed"]),
  work: z.enum([
    "remote-fulltime",
    "remote-flex",
    "freelance",
    "founder",
    "other",
  ]),
  // Optional. Matches a path-to-istanbul slug when present so the agent
  // can boost the matching country playbook
  originCountry: z
    .string()
    .trim()
    .toLowerCase()
    .max(40)
    .optional()
    .or(z.literal("")),
  mustHaves: z.array(z.string().min(1).max(40)).max(10).optional(),
  notes: z.string().trim().max(800).optional().or(z.literal("")),
});

export type RelocationIntake = z.infer<typeof relocationIntakeSchema>;

// Plan output. The shape the LLM is forced into via generateObject. Every
// field is required so we can render cards without conditional logic.
//
// IMPORTANT: do NOT call .min()/.max() on z.array() in this schema. The AI
// SDK serialises those to JSON Schema's minItems/maxItems, which Anthropic's
// structured-output endpoint rejects with "property 'maxItems' is not
// supported". String .min()/.max() (minLength/maxLength) is fine, only
// array length constraints break. The prompt itself caps the counts the
// agent should produce ("up to two alternates", "weeks 1 through 4", etc).
export const planCitationSchema = z.object({
  source: z.string().min(1),
  source_type: z.enum([
    "guide",
    "blog",
    "path",
    "neighborhood",
    "space",
    "cost-tier",
    "setup-step",
  ]),
  source_slug: z.string().min(1),
});

export const planCostLineSchema = z.object({
  label: z.string().min(1),
  usd: z.number().int().nonnegative(),
  tl: z.number().int().nonnegative(),
  note: z.string().max(200).optional(),
});

export const planSetupItemSchema = z.object({
  title: z.string().min(1).max(120),
  why: z.string().min(1).max(400),
  link: z.string().max(200).optional(),
});

export const planSetupWeekSchema = z.object({
  week: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]),
  items: z.array(planSetupItemSchema),
});

export const relocationPlanSchema = z.object({
  neighborhood_match: z.object({
    primary: z.string().min(1),
    alternates: z.array(z.string().min(1)),
    reasoning: z.string().min(20).max(900),
  }),
  cost_breakdown: z.object({
    tier: z.enum(["low", "medium", "high"]),
    monthly_total_usd: z.number().int().nonnegative(),
    lines: z.array(planCostLineSchema),
  }),
  setup_plan: z.array(planSetupWeekSchema),
  strategy: z.array(z.string().min(1).max(600)),
  tips: z.array(z.string().min(1).max(300)),
  citations: z.array(planCitationSchema),
});

export type RelocationPlan = z.infer<typeof relocationPlanSchema>;
export type PlanCitation = z.infer<typeof planCitationSchema>;

// API response wrapping. Used by /api/relocation-agent
export const relocationPlanResponseSchema = z.object({
  plan_text: z.string().min(1),
  plan_json: relocationPlanSchema,
  model: z.string(),
  retrieved_chunk_count: z.number().int().nonnegative(),
  request_id: z.string(),
});

export type RelocationPlanResponse = z.infer<
  typeof relocationPlanResponseSchema
>;

// Retrieved context shape. Built by src/lib/agent/retrieve.ts and consumed
// by src/lib/agent/relocation-agent.ts
export interface RetrievedChunk {
  source_type: string;
  source_slug: string;
  section_heading: string | null;
  content: string;
  similarity: number;
  source_url: string;
}

export interface CostTier {
  tier: "low" | "medium" | "high";
  label: string;
  monthly_total_usd: number;
  lines: { label: string; usd: number; tl: number; note?: string }[];
}

export interface SetupStep {
  week: 1 | 2 | 3 | 4;
  title: string;
  why: string;
  source_slug: string;
  source_url: string;
}

export interface RetrievedContext {
  structured: {
    neighborhoods: import("@/lib/neighborhoods").Neighborhood[];
    costTiers: CostTier[];
    setupSteps: SetupStep[];
    originPlaybook?: { country: string; markdown: string };
  };
  retrieved: RetrievedChunk[];
}
