import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock both the embeddings call and the Supabase client. The structured
// block must be returned no matter what these dependencies do
vi.mock("./embeddings", () => ({
  embedQuery: vi.fn(),
  VOYAGE_DIMENSIONS: 1024,
  VOYAGE_MODEL: "voyage-3",
}));

vi.mock("@/lib/supabase/server", () => ({
  createPublicClient: vi.fn(),
}));

import { retrieveContext } from "./retrieve";
import { embedQuery } from "./embeddings";
import { createPublicClient } from "@/lib/supabase/server";

const baseIntake = {
  budget: 1500,
  currency: "USD" as const,
  duration: "3-6-months" as const,
  lifestyle: "social" as const,
  work: "remote-fulltime" as const,
};

describe("retrieveContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("always returns all 5 neighborhoods, 3 cost tiers, and the setup checklist", async () => {
    vi.mocked(embedQuery).mockRejectedValueOnce(new Error("voyage down"));
    vi.mocked(createPublicClient).mockReturnValue({
      rpc: vi.fn().mockResolvedValue({ data: [], error: null }),
    } as any);

    const ctx = await retrieveContext(baseIntake);

    expect(ctx.structured.neighborhoods).toHaveLength(5);
    expect(ctx.structured.costTiers).toHaveLength(3);
    expect(ctx.structured.setupSteps.length).toBeGreaterThanOrEqual(8);
    expect(ctx.retrieved).toEqual([]);
  });

  it("falls back gracefully when match_corpus_chunks errors", async () => {
    vi.mocked(embedQuery).mockResolvedValue(new Array(1024).fill(0.1));
    vi.mocked(createPublicClient).mockReturnValue({
      rpc: vi
        .fn()
        .mockResolvedValue({ data: null, error: { message: "boom" } }),
    } as any);

    const ctx = await retrieveContext(baseIntake);
    expect(ctx.retrieved).toEqual([]);
    expect(ctx.structured.neighborhoods).toHaveLength(5);
  });

  it("maps RPC results into the RetrievedChunk shape", async () => {
    vi.mocked(embedQuery).mockResolvedValue(new Array(1024).fill(0.1));
    vi.mocked(createPublicClient).mockReturnValue({
      rpc: vi.fn().mockResolvedValue({
        data: [
          {
            id: "00000000-0000-0000-0000-000000000001",
            source_type: "guide",
            source_slug: "housing",
            section_heading: "Where to look",
            content: "## Where to look\n\nStart with Flatio.",
            metadata: {
              source_url: "https://istanbulnomads.com/guides/housing",
            },
            similarity: 0.82,
          },
        ],
        error: null,
      }),
    } as any);

    const ctx = await retrieveContext(baseIntake);
    expect(ctx.retrieved).toHaveLength(1);
    expect(ctx.retrieved[0].source_slug).toBe("housing");
    expect(ctx.retrieved[0].source_url).toBe(
      "https://istanbulnomads.com/guides/housing",
    );
    expect(ctx.retrieved[0].similarity).toBeCloseTo(0.82);
  });

  it("attaches the matching origin-country playbook when present", async () => {
    vi.mocked(embedQuery).mockResolvedValue(new Array(1024).fill(0.1));
    vi.mocked(createPublicClient).mockReturnValue({
      rpc: vi.fn().mockResolvedValue({ data: [], error: null }),
    } as any);

    const ctx = await retrieveContext({
      ...baseIntake,
      originCountry: "india",
    });
    expect(ctx.structured.originPlaybook?.country.toLowerCase()).toBe("india");
    expect(ctx.structured.originPlaybook?.markdown).toContain("India");
  });

  it("ignores unknown origin countries", async () => {
    vi.mocked(embedQuery).mockResolvedValue(new Array(1024).fill(0.1));
    vi.mocked(createPublicClient).mockReturnValue({
      rpc: vi.fn().mockResolvedValue({ data: [], error: null }),
    } as any);

    const ctx = await retrieveContext({
      ...baseIntake,
      originCountry: "neverland",
    });
    expect(ctx.structured.originPlaybook).toBeUndefined();
  });
});
