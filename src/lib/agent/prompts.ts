// System prompt + prompt template for the relocation agent.
// Lives in its own module so the prompt is unit-testable and the LLM call
// site stays a thin wrapper. If you change the system prompt the snapshot
// test in this module must be updated deliberately

import type { RelocationIntake, RetrievedContext } from "./types";
import { neighborhoods } from "@/lib/neighborhoods";

export const SYSTEM_PROMPT = `You are a relocation advisor for digital nomads moving to Istanbul. You write like a friend who's been here a while: warm, specific, no fluff. Always use casual contractions ("don't", "you'll", "it's"). Never use em dashes - use a regular dash. Never use the words "seamless", "leverage", "utilize", "cutting-edge", "world-class", "comprehensive solution". Never invent neighborhoods, prices, visa rules, or coworking spaces.

You receive:
1. The visitor's intake (budget, duration, lifestyle, work mode, optional origin).
2. A "structured" context block with all five Istanbul neighborhoods we cover, three cost tiers, and a first-month setup checklist - this is verified data.
3. A "retrieved" context block with chunks pulled from our guides, blog posts, path-to-istanbul playbooks, and verified spaces.

Rules:
- Recommend exactly one primary neighborhood and up to two alternates. Pick from the five in the structured block; do not invent.
- Build the cost breakdown by starting from the matching cost tier, then adjust the rent line to the chosen neighborhood's rent range. Never pick numbers that aren't in the structured block or a retrieved chunk.
- The setup_plan must group items into weeks 1 through 4. Source items only from the structured setup checklist or from retrieved chunks. Each item gets a one-sentence "why".
- For citations, list the source slugs you actually used. If you didn't use a retrieved chunk, don't cite it.
- If the intake is incompatible (for example the budget is below the lowest tier), say so in the strategy section and recommend lowering expectations or extending duration.
- Output must match the JSON schema exactly. Don't add fields. Don't omit fields.`;

export const NARRATIVE_SYSTEM_PROMPT = `You write like a friend who's been in Istanbul a while. Always use casual contractions. Never use em dashes - use a regular dash. Never use marketing words like "seamless", "leverage", "world-class". Be direct and specific.

You'll be given a structured relocation plan as JSON. Write a 6-8 sentence narrative summary the visitor can read at the top of the page. Lead with the neighborhood pick and why it fits. Mention the monthly total. Mention one concrete first-week step. End with one tip. Don't restate the JSON; speak to the visitor.`;

function compactNeighborhoods(): string {
  return neighborhoods
    .map(
      (n) =>
        `- ${n.name} (${n.side}): rent $${n.rentUsd.low}-${n.rentUsd.high} / ${n.rentTl.low}-${n.rentTl.high} TL. Vibe: ${n.vibe}. Noise: ${n.noise}. Best for: ${n.bestFor.join(", ")}.`,
    )
    .join("\n");
}

function compactCostTiers(context: RetrievedContext): string {
  return context.structured.costTiers
    .map((t) => {
      const lines = t.lines
        .map((l) => `    - ${l.label}: $${l.usd} / ${l.tl} TL`)
        .join("\n");
      return `- ${t.tier} (${t.label}, ~$${t.monthly_total_usd}/month):\n${lines}`;
    })
    .join("\n");
}

function compactSetupSteps(context: RetrievedContext): string {
  const byWeek: Record<number, string[]> = {};
  for (const s of context.structured.setupSteps) {
    (byWeek[s.week] ??= []).push(`  - ${s.title} (${s.source_slug}): ${s.why}`);
  }
  const ordered = Object.keys(byWeek).map(Number).sort();
  return ordered.map((w) => `Week ${w}:\n${byWeek[w].join("\n")}`).join("\n");
}

function compactRetrieved(context: RetrievedContext): string {
  if (context.retrieved.length === 0) return "(none retrieved)";
  return context.retrieved
    .map(
      (r, i) =>
        `[${i + 1}] ${r.source_type}/${r.source_slug}${
          r.section_heading ? ` - ${r.section_heading}` : ""
        } (similarity: ${r.similarity.toFixed(2)}, url: ${r.source_url})\n${r.content}`,
    )
    .join("\n\n");
}

export function buildPlanPrompt(
  intake: RelocationIntake,
  context: RetrievedContext,
): string {
  const sections: string[] = [
    "INTAKE:",
    JSON.stringify(intake, null, 2),
    "",
    "STRUCTURED CONTEXT (verified, always trust):",
    "",
    "Neighborhoods:",
    compactNeighborhoods(),
    "",
    "Cost tiers:",
    compactCostTiers(context),
    "",
    "Setup checklist:",
    compactSetupSteps(context),
  ];

  if (context.structured.originPlaybook) {
    sections.push(
      "",
      `ORIGIN PLAYBOOK (${context.structured.originPlaybook.country}):`,
      context.structured.originPlaybook.markdown,
    );
  }

  sections.push(
    "",
    "RETRIEVED CHUNKS (ranked by similarity):",
    compactRetrieved(context),
    "",
    "Produce the plan now.",
  );

  return sections.join("\n");
}

export function buildNarrativePrompt(
  intake: RelocationIntake,
  plan: unknown,
): string {
  return [
    "INTAKE:",
    JSON.stringify(intake, null, 2),
    "",
    "PLAN (JSON):",
    JSON.stringify(plan, null, 2),
    "",
    "Write the 6-8 sentence narrative now.",
  ].join("\n");
}
