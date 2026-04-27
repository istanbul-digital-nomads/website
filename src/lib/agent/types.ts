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
// IMPORTANT: Anthropic's structured-output endpoint accepts only a narrow
// JSON Schema subset. Things it rejects:
//   - minItems / maxItems on arrays
//   - minimum / maximum on numbers and integers
//   - multipleOf (which Zod's .int() can emit)
//   - minLength / maxLength / pattern / format on strings
//   - exclusiveMinimum / exclusiveMaximum
//   - integer-literal unions that get serialised as integer + minimum/maximum
//
// So this schema uses ONLY: type tags (string / number / boolean / array /
// object), enums, optional/required. No .int(), no .min()/.max(), no
// .nonnegative(), no z.literal() unions over numbers. The prompt bounds
// shape and counts in plain English; we refine() post-parse if needed.
export const planCitationSchema = z.object({
  source: z.string(),
  source_type: z.enum([
    "guide",
    "blog",
    "path",
    "neighborhood",
    "space",
    "cost-tier",
    "setup-step",
  ]),
  source_slug: z.string(),
});

export const planCostLineSchema = z.object({
  label: z.string(),
  usd: z.number(),
  tl: z.number(),
  note: z.string().optional(),
});

export const planSetupItemSchema = z.object({
  title: z.string(),
  why: z.string(),
  link: z.string().optional(),
});

export const planSetupWeekSchema = z.object({
  // Numeric 1-4. The prompt says "weeks 1 through 4" so the agent picks
  // sensibly; we don't constrain in JSON Schema because Anthropic rejects
  // both integer min/max and integer-literal unions
  week: z.number(),
  items: z.array(planSetupItemSchema),
});

export const relocationPlanSchema = z.object({
  neighborhood_match: z.object({
    primary: z.string(),
    alternates: z.array(z.string()),
    reasoning: z.string(),
  }),
  cost_breakdown: z.object({
    tier: z.enum(["low", "medium", "high"]),
    monthly_total_usd: z.number(),
    lines: z.array(planCostLineSchema),
  }),
  setup_plan: z.array(planSetupWeekSchema),
  strategy: z.array(z.string()),
  tips: z.array(z.string()),
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
