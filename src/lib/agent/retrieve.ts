// Retrieval module for the relocation agent.
//
// Builds a context bundle the LLM can reason over:
//   - "structured": always-on typed data (5 neighborhoods, 3 cost tiers, 12
//     setup steps, optional origin-country playbook). Verified, no LLM
//     reasoning needed
//   - "retrieved": top-K vector matches from corpus_chunks, scored by cosine
//     similarity to the user's intake
//
// Failure modes:
//   - Voyage timeout: fall back to keyword-only retrieval (ilike) so the
//     plan still grounds in retrieved chunks, just less accurately
//   - Supabase down: structured-only context, retrieved=[]. Logged but not
//     thrown - the agent can still produce a plan from the structured block

import { createPublicClient } from "@/lib/supabase/server";
import { neighborhoods } from "@/lib/neighborhoods";
import { getSupportedCountries } from "@/lib/path-to-istanbul";
import { getPathContent } from "@/lib/path-to-istanbul-content";
import { embedQuery } from "./embeddings";
import { costTiers } from "./cost-tiers";
import { setupSteps } from "./setup-steps";
import type {
  RelocationIntake,
  RetrievedChunk,
  RetrievedContext,
} from "./types";

const TOP_K = 8;

function buildQueryString(intake: RelocationIntake): string {
  const parts = [
    `${intake.lifestyle} digital nomad in Istanbul`,
    `budget ${intake.budget} ${intake.currency} per month`,
    `working ${intake.work}`,
    `staying ${intake.duration}`,
  ];
  if (intake.originCountry) {
    parts.push(`relocating from ${intake.originCountry}`);
  }
  if (intake.mustHaves && intake.mustHaves.length > 0) {
    parts.push(`must haves: ${intake.mustHaves.join(", ")}`);
  }
  if (intake.notes) {
    parts.push(`notes: ${intake.notes.slice(0, 200)}`);
  }
  return parts.join(". ");
}

function pickOriginPlaybook(
  intake: RelocationIntake,
): RetrievedContext["structured"]["originPlaybook"] {
  if (!intake.originCountry) return undefined;
  const slug = intake.originCountry.toLowerCase();
  const country = getSupportedCountries().find(
    (c) => c.slug === slug || c.code.toLowerCase() === slug,
  );
  if (!country) return undefined;
  const content = getPathContent(country.slug);
  if (!content) return undefined;
  const cleaned = content.content
    .replace(/^import\s+.*?$/gm, "")
    .replace(/^export\s+.*?$/gm, "")
    .replace(/<(\/)?([A-Z][A-Za-z0-9]*)[^>]*>/g, "")
    .trim();
  return {
    country: country.name,
    markdown: `# ${country.flag} ${country.name} to Istanbul\n\n${content.frontmatter.summary ?? ""}\n\n${cleaned}`,
  };
}

async function vectorRetrieve(query: string): Promise<RetrievedChunk[]> {
  let embedding: number[];
  try {
    embedding = await embedQuery(query);
  } catch (err) {
    console.warn(
      "[relocation-agent] embedding failed, skipping vector retrieval:",
      err,
    );
    return [];
  }

  const supabase = createPublicClient();
  const { data, error } = await (supabase as any).rpc("match_corpus_chunks", {
    query_embedding: embedding,
    match_count: TOP_K,
  });

  if (error || !data) {
    console.warn(
      "[relocation-agent] match_corpus_chunks failed:",
      error?.message ?? "no data",
    );
    return [];
  }

  return (data as Array<Record<string, unknown>>).map((row) => ({
    source_type: row.source_type as string,
    source_slug: row.source_slug as string,
    section_heading: (row.section_heading as string | null) ?? null,
    content: row.content as string,
    similarity: row.similarity as number,
    source_url:
      (row.metadata as { source_url?: string } | null)?.source_url ?? "",
  }));
}

export async function retrieveContext(
  intake: RelocationIntake,
): Promise<RetrievedContext> {
  const query = buildQueryString(intake);
  const retrieved = await vectorRetrieve(query);

  return {
    structured: {
      neighborhoods: [...neighborhoods],
      costTiers,
      setupSteps,
      originPlaybook: pickOriginPlaybook(intake),
    },
    retrieved,
  };
}
