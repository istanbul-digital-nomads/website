import { NextResponse } from "next/server";
import { getBlogPosts } from "@/lib/supabase/queries";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = searchParams.get("limit");

  const { data, error } = await getBlogPosts({
    limit: limit ? parseInt(limit) : undefined,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}
