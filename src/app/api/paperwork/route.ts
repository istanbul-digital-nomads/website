import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { rateLimit, rateLimitHeaders } from "@/lib/rate-limit";
import { paperworkServiceCreateSchema } from "@/lib/paperwork-schema";

const CREATE_LIMIT = 10;
const CREATE_WINDOW_MS = 60 * 60 * 1000;

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Only is_agent members can create paperwork services. The DB trigger
  // also enforces this, but checking up-front gives a clear 403 instead
  // of a generic 500 from the trigger.
  const sb = supabase as unknown as { from: (t: string) => any };
  const { data: memberRow } = await sb
    .from("members")
    .select("is_agent")
    .eq("id", user.id)
    .maybeSingle();
  if (!memberRow?.is_agent) {
    return NextResponse.json(
      { error: "Only agent-flagged members can create paperwork services." },
      { status: 403 },
    );
  }

  const rl = await rateLimit(
    `paperwork-create:${user.id}`,
    CREATE_LIMIT,
    CREATE_WINDOW_MS,
  );
  const headers = rateLimitHeaders(rl, CREATE_LIMIT);
  if (!rl.allowed) {
    return NextResponse.json(
      {
        error: `Too many services created. Retry in ${rl.retryAfterSeconds}s.`,
      },
      { status: 429, headers },
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = paperworkServiceCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400, headers },
    );
  }

  const { data, error } = await sb
    .from("paperwork_services")
    .insert({
      host_id: user.id,
      service_type: parsed.data.service_type,
      title: parsed.data.title,
      description: parsed.data.description ?? null,
      languages: parsed.data.languages,
      neighborhoods: parsed.data.neighborhoods,
      price_cents: parsed.data.price_lira,
      currency: "TRY",
      duration_estimate_minutes: parsed.data.duration_estimate_minutes ?? null,
      is_active: true,
    })
    .select("*")
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: error?.message ?? "Failed to create service" },
      { status: 500, headers },
    );
  }

  revalidateTag("paperwork_services", "minutes");
  return NextResponse.json({ data }, { status: 201, headers });
}
