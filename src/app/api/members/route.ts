import { NextResponse } from "next/server";
import { getMembers } from "@/lib/supabase/queries";

export async function GET() {
  const { data, error } = await getMembers();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}
