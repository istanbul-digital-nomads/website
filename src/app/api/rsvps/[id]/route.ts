import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function DELETE(
  _request: Request,
  props: { params: Promise<{ id: string }> },
) {
  const params = await props.params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Filter by member_id as well as id: RLS already scopes this to the owner,
  // but enforcing ownership in-app too means a single RLS regression can't
  // turn this into a cross-user delete (defense in depth).
  const { error } = await supabase
    .from("rsvps")
    .delete()
    .eq("id", params.id)
    .eq("member_id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data: { deleted: true } });
}
