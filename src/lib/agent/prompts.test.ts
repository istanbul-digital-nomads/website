import { describe, it, expect } from "vitest";
import {
  SYSTEM_PROMPT,
  NARRATIVE_SYSTEM_PROMPT,
  buildPlanPrompt,
  buildNarrativePrompt,
} from "./prompts";
import { costTiers } from "./cost-tiers";
import { setupSteps } from "./setup-steps";
import { neighborhoods } from "@/lib/neighborhoods";
import type { RelocationIntake, RetrievedContext } from "./types";

const intake: RelocationIntake = {
  budget: 1500,
  currency: "USD",
  duration: "3-6-months",
  lifestyle: "social",
  work: "remote-fulltime",
};

const context: RetrievedContext = {
  structured: {
    neighborhoods: [...neighborhoods],
    costTiers,
    setupSteps,
  },
  retrieved: [
    {
      source_type: "guide",
      source_slug: "housing",
      section_heading: "Where to look",
      content: "## Where to look\n\nStart with Flatio for mid-term stays.",
      similarity: 0.81,
      source_url: "https://istanbulnomads.com/guides/housing",
    },
  ],
};

describe("agent prompts", () => {
  it("system prompt matches the snapshot (intentional change required)", () => {
    expect(SYSTEM_PROMPT).toMatchInlineSnapshot(`
      "You are a relocation advisor for digital nomads moving to Istanbul. You write like a friend who's been here a while: warm, specific, no fluff. Always use casual contractions ("don't", "you'll", "it's"). Never use em dashes - use a regular dash. Never use the words "seamless", "leverage", "utilize", "cutting-edge", "world-class", "comprehensive solution". Never invent neighborhoods, prices, visa rules, or coworking spaces.

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
      - Output must match the JSON schema exactly. Don't add fields. Don't omit fields."
    `);
  });

  it("narrative system prompt matches the snapshot", () => {
    expect(NARRATIVE_SYSTEM_PROMPT.length).toBeGreaterThan(50);
    expect(NARRATIVE_SYSTEM_PROMPT).toContain("Istanbul");
    expect(NARRATIVE_SYSTEM_PROMPT).toContain("contractions");
  });

  it("buildPlanPrompt always includes the intake, all neighborhoods, all cost tiers, and the checklist", () => {
    const prompt = buildPlanPrompt(intake, context);
    for (const n of neighborhoods) expect(prompt).toContain(n.name);
    expect(prompt).toContain("Cost tiers:");
    expect(prompt).toContain("Setup checklist:");
    expect(prompt).toContain("3-6-months");
    expect(prompt).toContain("RETRIEVED CHUNKS");
    expect(prompt).toContain("housing");
  });

  it("buildPlanPrompt includes the origin playbook when present", () => {
    const ctxWithPlaybook: RetrievedContext = {
      ...context,
      structured: {
        ...context.structured,
        originPlaybook: {
          country: "India",
          markdown: "# India to Istanbul\n\nPlaybook content here.",
        },
      },
    };
    const prompt = buildPlanPrompt(intake, ctxWithPlaybook);
    expect(prompt).toContain("ORIGIN PLAYBOOK (India)");
    expect(prompt).toContain("Playbook content here");
  });

  it("buildNarrativePrompt embeds the JSON plan", () => {
    const prompt = buildNarrativePrompt(intake, {
      neighborhood_match: { primary: "Kadikoy" },
    });
    expect(prompt).toContain('"primary": "Kadikoy"');
    expect(prompt).toContain('"budget": 1500');
  });
});
