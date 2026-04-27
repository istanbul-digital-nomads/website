// Ingest the site's content into the corpus_chunks vector index.
//
// Run with: pnpm tsx scripts/ingest-corpus.ts
//
// Required env: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY,
// VOYAGE_API_KEY. Reads from .env.local automatically via dotenv loading
// below
//
// What gets ingested:
//   - All five neighborhoods (compact structured form)
//   - Every space with status === "open", with unverified_fields stripped
//   - Every guide MDX
//   - Every blog post MDX
//   - Every path-to-istanbul country playbook
//   - The three cost tiers from src/lib/agent/cost-tiers.ts
//   - The 4-week setup checklist from src/lib/agent/setup-steps.ts
//
// Idempotent: a (source_type, source_slug) pair is fully replaced on every
// run. Safe to re-run after content changes

import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { neighborhoods } from "../src/lib/neighborhoods";
import { spaces } from "../src/lib/spaces";
import { guides } from "../src/lib/data";
import { getAllBlogPosts, getBlogPost } from "../src/lib/blog";
import { getGuideContent } from "../src/lib/guides";
import { getPathContent } from "../src/lib/path-to-istanbul-content";
import { getSupportedCountries } from "../src/lib/path-to-istanbul";
import { costTiers } from "../src/lib/agent/cost-tiers";
import { setupSteps } from "../src/lib/agent/setup-steps";
import { chunk, type Chunk } from "../src/lib/agent/chunker";
import {
  embedDocuments,
  VOYAGE_DIMENSIONS,
} from "../src/lib/agent/embeddings";
import type { Database } from "../src/types/database";

config({ path: ".env.local" });
config({ path: ".env" });

const SITE = "https://istanbulnomads.com";

function mdxToMarkdown(content: string): string {
  return content
    .replace(/^import\s+.*?$/gm, "")
    .replace(/^export\s+.*?$/gm, "")
    .replace(/<(\/)?([A-Z][A-Za-z0-9]*)[^>]*>/g, "")
    .trim();
}

function neighborhoodBody(slug: string): string {
  const n = neighborhoods.find((x) => x.slug === slug)!;
  const lines = [
    `# ${n.name}`,
    "",
    n.oneLiner,
    "",
    `## Overview`,
    "",
    n.description,
    "",
    `## Verified stats`,
    "",
    `- Side: ${n.side}`,
    `- Rent (1BR): $${n.rentUsd.low}-${n.rentUsd.high} USD / ${n.rentTl.low.toLocaleString()}-${n.rentTl.high.toLocaleString()} TL`,
    `- Transport: ${n.transport}`,
    `- Noise level: ${n.noise}`,
    `- Vibe: ${n.vibe}`,
    `- Best for: ${n.bestFor.join(", ")}`,
    "",
  ];
  return lines.join("\n");
}

function spaceBody(slug: string): string | null {
  const s = spaces.find((x) => x.id === slug);
  if (!s) return null;
  if (s.status && s.status !== "open") return null;

  const unverified = new Set(s.unverified_fields ?? []);
  const lines: string[] = [
    `# ${s.name} (${s.type})`,
    "",
    s.description,
    "",
    `## Verified facts`,
    "",
    `- Neighborhood: ${s.neighborhood}`,
    `- Address: ${s.address}`,
    `- Laptop friendly: ${s.laptop_friendly ? "yes" : "no"}`,
  ];
  if (s.hours && !unverified.has("hours")) {
    lines.push(`- Hours: ${s.hours}`);
  }
  if (s.wifi_speed && !unverified.has("wifi_speed")) {
    lines.push(`- Wifi speed: ${s.wifi_speed}`);
  }
  if (s.price_range && !unverified.has("price_range")) {
    lines.push(`- Price range: ${s.price_range}`);
  }
  if (s.amenities && s.amenities.length > 0) {
    lines.push(`- Amenities: ${s.amenities.join(", ")}`);
  }
  if (s.last_verified) {
    lines.push(`- Last verified: ${s.last_verified}`);
  }
  return lines.join("\n");
}

function costTierBody(tier: (typeof costTiers)[number]): string {
  const lines = [
    `# Cost tier: ${tier.label}`,
    "",
    `Approximate monthly total: $${tier.monthly_total_usd} USD.`,
    "",
    `## Line items`,
    "",
  ];
  for (const line of tier.lines) {
    const note = line.note ? ` (${line.note})` : "";
    lines.push(`- ${line.label}: $${line.usd} USD / ${line.tl} TL${note}`);
  }
  return lines.join("\n");
}

function setupStepBody(step: (typeof setupSteps)[number]): string {
  return [
    `# Week ${step.week}: ${step.title}`,
    "",
    step.why,
    "",
    `Source guide: ${step.source_url}`,
  ].join("\n");
}

function buildAllChunks(): Chunk[] {
  const out: Chunk[] = [];

  // Neighborhoods - one source per slug
  for (const n of neighborhoods) {
    out.push(
      ...chunk({
        source_type: "neighborhood",
        source_slug: n.slug,
        source_url: `${SITE}/guides/neighborhoods/${n.slug}`,
        body: neighborhoodBody(n.slug),
      }),
    );
  }

  // Spaces - skip closed and unverified ones
  for (const s of spaces) {
    const body = spaceBody(s.id);
    if (!body) continue;
    out.push(
      ...chunk({
        source_type: "space",
        source_slug: s.id,
        source_url: `${SITE}/spaces`,
        body,
      }),
    );
  }

  // Guides
  for (const g of guides) {
    const c = getGuideContent(g.slug);
    if (!c) continue;
    const md = `# ${g.title}\n\n${g.description}\n\n${mdxToMarkdown(c.content)}`;
    out.push(
      ...chunk({
        source_type: "guide",
        source_slug: g.slug,
        source_url: `${SITE}/guides/${g.slug}`,
        body: md,
      }),
    );
  }

  // Blog
  for (const meta of getAllBlogPosts()) {
    const post = getBlogPost(meta.slug);
    if (!post) continue;
    const md = `# ${post.meta.title}\n\n${post.meta.description}\n\n${mdxToMarkdown(post.content)}`;
    out.push(
      ...chunk({
        source_type: "blog",
        source_slug: meta.slug,
        source_url: `${SITE}/blog/${meta.slug}`,
        body: md,
      }),
    );
  }

  // Path-to-istanbul country playbooks
  for (const c of getSupportedCountries()) {
    const content = getPathContent(c.slug);
    if (!content) continue;
    const md = `# ${c.flag} ${c.name} to Istanbul\n\n${content.frontmatter.summary ?? ""}\n\n${mdxToMarkdown(content.content)}`;
    out.push(
      ...chunk({
        source_type: "path",
        source_slug: c.slug,
        source_url: `${SITE}/path-to-istanbul/${c.slug}`,
        body: md,
      }),
    );
  }

  // Cost tiers - one chunk per tier (small)
  for (const tier of costTiers) {
    out.push(
      ...chunk({
        source_type: "cost-tier",
        source_slug: tier.tier,
        source_url: `${SITE}/guides/cost-of-living`,
        body: costTierBody(tier),
      }),
    );
  }

  // Setup steps - one chunk per step
  for (const step of setupSteps) {
    out.push(
      ...chunk({
        source_type: "setup-step",
        source_slug: `${step.week}-${step.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40)}`,
        source_url: step.source_url,
        body: setupStepBody(step),
      }),
    );
  }

  return out;
}

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    console.error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY",
    );
    process.exit(1);
  }
  if (!process.env.VOYAGE_API_KEY) {
    console.error("Missing VOYAGE_API_KEY");
    process.exit(1);
  }

  const supabase = createClient<Database>(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  console.log("Building chunks from local sources...");
  const all = buildAllChunks();
  console.log(`  ${all.length} chunks ready`);

  // Group by source so we can replace each source atomically
  const bySource = new Map<string, Chunk[]>();
  for (const c of all) {
    const key = `${c.source_type}::${c.source_slug}`;
    const arr = bySource.get(key) ?? [];
    arr.push(c);
    bySource.set(key, arr);
  }

  console.log("Embedding in batches...");
  const texts = all.map((c) => c.content);
  const embeddings = await embedDocuments(texts);
  if (embeddings.length !== all.length) {
    throw new Error(
      `Embedding count mismatch: got ${embeddings.length}, expected ${all.length}`,
    );
  }
  for (const v of embeddings) {
    if (v.length !== VOYAGE_DIMENSIONS) {
      throw new Error(
        `Embedding dimension mismatch: got ${v.length}, expected ${VOYAGE_DIMENSIONS}`,
      );
    }
  }
  console.log(`  ${embeddings.length} embeddings ready`);

  // Replace per source: delete then insert. The deletes are scoped, so a
  // partial failure leaves a coherent state for sources we already finished
  console.log("Writing to Supabase...");
  let written = 0;
  for (const [key, chunks] of bySource) {
    const [source_type, source_slug] = key.split("::");
    const { error: deleteError } = await (
      supabase.from("corpus_chunks") as any
    )
      .delete()
      .eq("source_type", source_type)
      .eq("source_slug", source_slug);
    if (deleteError) {
      throw new Error(`Delete failed for ${key}: ${deleteError.message}`);
    }

    const rows = chunks.map((c) => {
      const idx = all.indexOf(c);
      return {
        source_type: c.source_type,
        source_slug: c.source_slug,
        section_heading: c.section_heading,
        chunk_index: c.chunk_index,
        content: c.content,
        metadata: c.metadata,
        embedding: embeddings[idx],
        token_count: Math.ceil(c.content.length / 4),
      };
    });

    const { error: insertError } = await (
      supabase.from("corpus_chunks") as any
    ).insert(rows);
    if (insertError) {
      throw new Error(`Insert failed for ${key}: ${insertError.message}`);
    }
    written += rows.length;
    process.stdout.write(`  ${written}/${all.length} written\r`);
  }
  process.stdout.write("\n");

  console.log("Done.");
  console.log(`  Total chunks: ${all.length}`);
  console.log(`  Sources: ${bySource.size}`);
  console.log(`  Tokens (approx): ${all.reduce((s, c) => s + Math.ceil(c.content.length / 4), 0)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
