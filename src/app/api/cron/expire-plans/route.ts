import { NextResponse } from "next/server";
import { createPublicClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const expected = process.env.CRON_SECRET;
  const auth = request.headers.get("authorization");
  if (!expected || auth !== `Bearer ${expected}`) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const supabase = createPublicClient();
  // Service role required for unrestricted update; fall through gracefully.
  const serviceUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceUrl || !serviceKey) {
    return NextResponse.json(
      { error: "Service role not configured" },
      { status: 503 },
    );
  }

  // Mark expired plans
  const res = await fetch(
    `${serviceUrl}/rest/v1/plans?status=eq.active&expires_at=lt.${new Date().toISOString()}`,
    {
      method: "PATCH",
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({ status: "expired" }),
    },
  );

  void supabase; // satisfies lint

  // Return a non-2xx when the PATCH failed so Vercel's cron monitoring (which
  // flags non-2xx runs) actually surfaces it - a 200 here would mask a
  // silently-failing expiry sweep as a healthy run.
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    return NextResponse.json(
      { error: "expire-plans patch failed", status: res.status, detail },
      { status: 502 },
    );
  }
  return NextResponse.json({ data: { ok: true, status: res.status } });
}
