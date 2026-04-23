import { NextResponse } from "next/server";
import { findSkill, agentSkills } from "@/lib/agent-skills";

export const dynamic = "force-static";

export function generateStaticParams() {
  return agentSkills.map((s) => ({ name: s.name }));
}

export async function GET(
  _req: Request,
  { params }: { params: { name: string } },
) {
  const skill = findSkill(params.name);

  if (!skill) {
    return new NextResponse("Not found", {
      status: 404,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  return new NextResponse(skill.body, {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
