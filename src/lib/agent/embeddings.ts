// Voyage AI embeddings client - thin fetch wrapper.
//
// Reference: https://docs.voyageai.com/reference/embeddings-api
//
// We use voyage-3 (1024-dim cosine). The DB index in
// supabase/migrations/010_relocation_agent.sql is sized for 1024.
// If you change the model, update both the index and the inserts.
//
// Batching: Voyage caps a single call at 128 inputs and ~120k tokens.
// We chunk well below that (max 64 inputs per call), retry once on 429s,
// and surface any other error to the caller

const VOYAGE_URL = "https://api.voyageai.com/v1/embeddings";
export const VOYAGE_MODEL = "voyage-3";
export const VOYAGE_DIMENSIONS = 1024;

const MAX_BATCH = 64;

interface VoyageResponse {
  object: "list";
  data: Array<{ object: "embedding"; embedding: number[]; index: number }>;
  model: string;
  usage: { total_tokens: number };
}

function getApiKey(): string {
  const key = process.env.VOYAGE_API_KEY;
  if (!key) {
    throw new Error(
      "VOYAGE_API_KEY is not set. The relocation agent's embeddings need it",
    );
  }
  return key;
}

async function embedOnce(
  texts: string[],
  inputType: "document" | "query",
): Promise<number[][]> {
  const res = await fetch(VOYAGE_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getApiKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      input: texts,
      model: VOYAGE_MODEL,
      input_type: inputType,
    }),
  });

  if (res.status === 429) {
    // One retry with a small backoff before giving up
    await new Promise((r) => setTimeout(r, 1500));
    const retry = await fetch(VOYAGE_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getApiKey()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input: texts,
        model: VOYAGE_MODEL,
        input_type: inputType,
      }),
    });
    if (!retry.ok) {
      throw new Error(
        `Voyage embeddings failed after retry: ${retry.status} ${await retry.text()}`,
      );
    }
    const data = (await retry.json()) as VoyageResponse;
    return data.data.sort((a, b) => a.index - b.index).map((d) => d.embedding);
  }

  if (!res.ok) {
    throw new Error(
      `Voyage embeddings failed: ${res.status} ${await res.text()}`,
    );
  }

  const data = (await res.json()) as VoyageResponse;
  return data.data.sort((a, b) => a.index - b.index).map((d) => d.embedding);
}

export async function embedDocuments(texts: string[]): Promise<number[][]> {
  const out: number[][] = [];
  for (let i = 0; i < texts.length; i += MAX_BATCH) {
    const batch = texts.slice(i, i + MAX_BATCH);
    const vectors = await embedOnce(batch, "document");
    out.push(...vectors);
  }
  return out;
}

export async function embedQuery(text: string): Promise<number[]> {
  const vectors = await embedOnce([text], "query");
  return vectors[0];
}
