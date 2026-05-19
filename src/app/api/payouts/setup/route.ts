import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { isIyzicoConfigured, ensureSubmerchant } from "@/lib/payments/iyzico";

// Guide payout setup: save IBAN + name, and (when iyzico is live)
// create/refresh the sub-merchant record so the guide can receive the
// escrowed split. Gated to verified host-role members.
const setupSchema = z.object({
  payout_name: z.string().trim().min(2).max(140),
  payout_iban: z
    .string()
    .trim()
    .transform((s) => s.replace(/\s+/g, "").toUpperCase())
    .refine((s) => /^TR\d{24}$/.test(s), "Enter a valid Turkish IBAN (TR...)"),
});

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sb = supabase as unknown as { from: (t: string) => any };
  const { data: member } = await sb
    .from("members")
    .select("id, member_type, is_agent, verification_level, email")
    .eq("id", user.id)
    .maybeSingle();

  const isHostRole =
    member?.member_type === "local_guide" ||
    member?.member_type === "tour_guide" ||
    member?.is_agent === true;
  if (!isHostRole) {
    return NextResponse.json(
      { error: "Only guides and agents set up payouts." },
      { status: 403 },
    );
  }
  if (
    member.verification_level !== "verified" &&
    member.verification_level !== "trusted"
  ) {
    return NextResponse.json(
      { error: "Verification required before payout setup." },
      { status: 403 },
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = setupSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 },
    );
  }

  // Create the iyzico sub-merchant when live; store the returned key.
  let submerchantKey: string | null = null;
  if (isIyzicoConfigured()) {
    const res = await ensureSubmerchant({
      memberId: user.id,
      name: parsed.data.payout_name,
      iban: parsed.data.payout_iban,
      email: member.email ?? "",
    });
    if (!res.ok) {
      return NextResponse.json(
        { error: res.message ?? "Payment setup failed" },
        { status: 502 },
      );
    }
    submerchantKey = res.submerchantKey;
  }

  const { error } = await sb
    .from("members")
    .update({
      payout_name: parsed.data.payout_name,
      payout_iban: parsed.data.payout_iban,
      ...(submerchantKey ? { iyzico_submerchant_key: submerchantKey } : {}),
    })
    .eq("id", user.id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, configured: isIyzicoConfigured() });
}
