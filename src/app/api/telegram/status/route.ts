import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/telegram/status -> { connected, linkedAt }
// Own-row read (RLS allows member_id = auth.uid()). Used by the account page
// to poll for connection after the member opens the bot deep-link.
export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data } = await supabase
    .from("telegram_subscriptions")
    .select("linked_at")
    .eq("member_id", user.id)
    .maybeSingle();
  const row = data as { linked_at: string } | null;

  return NextResponse.json({
    connected: Boolean(row),
    linkedAt: row?.linked_at ?? null,
  });
}
