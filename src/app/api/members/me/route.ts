import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { getCurrentMember } from "@/lib/supabase/queries";
import { validateUpdateMember } from "@/lib/validations";

export async function GET() {
  const { data, error } = await getCurrentMember();

  if (!data) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

export async function PATCH(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const result = validateUpdateMember(body);

  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  const { data, error } = await (supabase.from("members") as any)
    .update(result.data)
    .eq("id", user.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

// Right-to-erasure: delete the member's account and all their data. members.id
// references auth.users(id) ON DELETE CASCADE, and every member-owned table
// (plans, attendees, comments, reviews, tickets, verification, badges...)
// cascades from members - so deleting the auth user removes the entire graph
// in one operation. Requires the service role (auth.admin). Irreversible; the
// client gates this behind an explicit type-to-confirm.
export async function DELETE() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createServiceClient();
  const { error } = await admin.auth.admin.deleteUser(user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Clear the now-orphaned session cookie so the browser isn't left in a
  // half-authenticated state.
  await supabase.auth.signOut();

  return NextResponse.json({ data: { deleted: true } });
}
