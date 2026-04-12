import { NextResponse } from "next/server";
import { getBlogPostBySlug } from "@/lib/supabase/queries";

export async function GET(
  _request: Request,
  { params }: { params: { slug: string } },
) {
  const { data, error } = await getBlogPostBySlug(params.slug);

  if (error || !data) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  return NextResponse.json({ data });
}
