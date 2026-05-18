// Sanity check the seeded plans. Read-only.
// Run: pnpm tsx --env-file=.env.local scripts/check-today-plans.ts

import { createClient } from "@supabase/supabase-js";

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const supabase = createClient(url, key, { auth: { persistSession: false } });

  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Istanbul",
  }).format(new Date());

  const { data, error } = await (supabase as any)
    .from("plans")
    .select(
      "id, title, capacity, status, scheduled_date, expires_at, creator:members!plans_creator_id_fkey(display_name), stops:plan_stops(ordinal, start_time, end_time, vibe, neighborhood_slug, custom_location)",
    )
    .eq("scheduled_date", today)
    .order("scheduled_date", { ascending: true });

  if (error) {
    console.error(error);
    return;
  }

  console.log(`Found ${data?.length ?? 0} plan(s) scheduled for ${today}:\n`);
  for (const p of data ?? []) {
    const stops = (p.stops ?? []).sort(
      (a: any, b: any) => a.ordinal - b.ordinal,
    );
    const first = stops[0];
    console.log(`  ${first?.start_time ?? "—"}  ${p.title}`);
    console.log(
      `        host: ${p.creator?.display_name ?? "?"}  cap: ${p.capacity}  stops: ${stops.length}  status: ${p.status}`,
    );
    for (const s of stops) {
      console.log(
        `          ${s.start_time}-${s.end_time}  ${s.vibe.padEnd(10)}  ${s.neighborhood_slug ?? ""}  · ${s.custom_location ?? ""}`,
      );
    }
    console.log("");
  }
}

main().catch(console.error);
