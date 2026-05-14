import { NextResponse } from "next/server";
import { agentSkills, skillDigest, skillUrl } from "@/lib/agent-skills";

export const dynamic = "force-static";

export async function GET() {
  const body = {
    $schema:
      "https://raw.githubusercontent.com/cloudflare/agent-skills-discovery-rfc/main/schema/v0.2.0.json",
    version: "0.2.0",
    skills: agentSkills.map((s) => ({
      name: s.name,
      type: s.type,
      description: s.description,
      url: skillUrl(s.name),
      sha256: skillDigest(s.body),
    })),
  };

  return NextResponse.json(body, {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
