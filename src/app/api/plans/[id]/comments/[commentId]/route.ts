import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface Ctx {
  params: Promise<{ id: string; commentId: string }>;
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const { commentId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Only the author can delete their own comment.
  const sb = supabase as any;
  const { error } = await sb
    .from("plan_comments")
    .delete()
    .eq("id", commentId)
    .eq("author_id", user.id);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
