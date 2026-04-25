// Markdown chunker for the relocation agent's RAG corpus.
//
// Strategy:
//   1. Split by H2 headings - sections are the natural unit on this site
//   2. If a section is longer than MAX_CHARS, split into overlapping windows
//   3. Drop any chunk that's all whitespace or below MIN_CHARS
//
// We approximate "tokens" as chars / 4. This is good enough for picking
// chunk sizes - we don't store exact token counts, the embedding API does
// that for us

const MAX_CHARS = 2400; // ~600 tokens
const TARGET_CHARS = 1600; // ~400 tokens
const OVERLAP_CHARS = 200; // ~50 tokens
const MIN_CHARS = 80;

export interface ChunkInput {
  source_type:
    | "guide"
    | "blog"
    | "path"
    | "neighborhood"
    | "space"
    | "cost-tier"
    | "setup-step";
  source_slug: string;
  source_url: string;
  body: string;
}

export interface Chunk {
  source_type: ChunkInput["source_type"];
  source_slug: string;
  section_heading: string | null;
  chunk_index: number;
  content: string;
  metadata: Record<string, unknown>;
}

interface Section {
  heading: string | null;
  body: string;
}

function splitBySection(markdown: string): Section[] {
  const lines = markdown.split("\n");
  const sections: Section[] = [];
  let currentHeading: string | null = null;
  let buffer: string[] = [];

  const flush = () => {
    const body = buffer.join("\n").trim();
    if (body.length > 0) {
      sections.push({ heading: currentHeading, body });
    }
    buffer = [];
  };

  for (const line of lines) {
    // H2 boundary - everything below counts toward the new section.
    // H1 we treat as part of the lead, not a chunk boundary
    const h2 = line.match(/^##\s+(.+?)\s*$/);
    if (h2) {
      flush();
      currentHeading = h2[1].trim();
      continue;
    }
    buffer.push(line);
  }
  flush();
  return sections;
}

function windowSection(body: string): string[] {
  if (body.length <= MAX_CHARS) return [body];

  const windows: string[] = [];
  let start = 0;
  while (start < body.length) {
    const end = Math.min(body.length, start + TARGET_CHARS);
    let window = body.slice(start, end);

    // If we're not at the end, try to cut at a paragraph break so chunks
    // don't end mid-sentence
    if (end < body.length) {
      const lastBreak = window.lastIndexOf("\n\n");
      if (lastBreak > TARGET_CHARS * 0.6) {
        window = window.slice(0, lastBreak);
      }
    }

    windows.push(window.trim());
    if (end >= body.length) break;
    start += Math.max(window.length - OVERLAP_CHARS, TARGET_CHARS / 2);
  }
  return windows.filter((w) => w.length >= MIN_CHARS);
}

export function chunk(input: ChunkInput): Chunk[] {
  const sections = splitBySection(input.body);
  const chunks: Chunk[] = [];
  let chunkIndex = 0;

  for (const section of sections) {
    const windows = windowSection(section.body);
    for (const w of windows) {
      if (w.length < MIN_CHARS) continue;
      // Prepend the heading so the embedding sees it. Also keeps the
      // chunk readable on its own when injected into the LLM prompt
      const content = section.heading ? `## ${section.heading}\n\n${w}` : w;
      chunks.push({
        source_type: input.source_type,
        source_slug: input.source_slug,
        section_heading: section.heading,
        chunk_index: chunkIndex++,
        content,
        metadata: {
          source_url: input.source_url,
        },
      });
    }
  }

  return chunks;
}
