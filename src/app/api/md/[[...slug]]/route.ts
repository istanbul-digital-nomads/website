import { NextResponse } from "next/server";
import { getMarkdownForPath } from "@/lib/markdown";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug?: string[] }> },
) {
  const { slug } = await params;
  const pathname = "/" + (slug ?? []).join("/");
  const result = getMarkdownForPath(pathname);

  if (!result) {
    return new NextResponse(
      `# Not found\n\nNo markdown representation for ${pathname}. See https://istanbulnomads.com/llms.txt for the site index.\n`,
      {
        status: 404,
        headers: {
          "Content-Type": "text/markdown; charset=utf-8",
          Vary: "Accept",
        },
      },
    );
  }

  return new NextResponse(result.body, {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      Vary: "Accept",
    },
  });
}
