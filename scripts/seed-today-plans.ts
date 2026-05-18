/**
 * Seed mock plans for today, hosted by aliwsome@gmail.com so the
 * /today board has something to render. Idempotent: previous seed
 * plans (matched by the [seed] title prefix) are purged before insert,
 * so re-running just refreshes them.
 *
 * Run with: pnpm tsx --env-file=.env.local scripts/seed-today-plans.ts
 */

import { createClient } from "@supabase/supabase-js";

const SEED_PREFIX = "[seed]";
const HOST_EMAIL = "aliwsome@gmail.com";

// Mock local guides. plans.creator_id FKs to auth.users so each guide
// needs a real (but unconfirmed, no-sign-in) auth user. We provision
// them via the admin API. Email is stable per-guide so re-running the
// seeder finds the same user rather than creating duplicates.
const GUIDES: Array<{
  email: string;
  display_name: string;
  city_district: string;
  bio: string;
}> = [
  {
    email: "seed-guide-cem@istanbulnomads.local",
    display_name: "Cem K.",
    city_district: "Karaköy",
    bio: "Born-and-raised Istanbullu. Coffee crawls, breakfast routes, ferry stories.",
  },
  {
    email: "seed-guide-sibel@istanbulnomads.local",
    display_name: "Sibel Ö.",
    city_district: "Kadıköy",
    bio: "Market guide. Çiya regular. Knows which vendor has the best pickled vine leaves.",
  },
  {
    email: "seed-guide-ahmet@istanbulnomads.local",
    display_name: "Ahmet S.",
    city_district: "Asmalımescit",
    bio: "Jazz nights, reserved tables, ferry back at 23:50.",
  },
];

type Vibe =
  | "focus"
  | "cowork"
  | "social"
  | "meal"
  | "after-work"
  | "outdoor";

type SeedStop = {
  start_time: string; // "HH:MM"
  end_time: string;
  vibe: Vibe;
  neighborhood_slug: string;
  custom_location: string;
  notes: string;
  transport_mode?:
    | "ferry"
    | "metro"
    | "bus"
    | "taxi"
    | "shared_uber"
    | "walk"
    | "bike"
    | "tram"
    | "minibus"
    | null;
  transport_price_min?: number | null;
  transport_price_max?: number | null;
};

type SeedPlan = {
  title: string;
  capacity: number | null;
  stops: SeedStop[];
  // When set, the plan is hosted by this guide instead of HOST_EMAIL.
  // Must match one of GUIDES[].email above; resolved to an auth-user id
  // at run time.
  guideEmail?: string;
};

const PLANS: SeedPlan[] = [
  {
    title: `${SEED_PREFIX} Moda sahil walk · sunrise`,
    capacity: 5,
    stops: [
      {
        start_time: "07:00",
        end_time: "08:00",
        vibe: "outdoor",
        neighborhood_slug: "moda",
        custom_location: "Moda Pier",
        notes: "~3 km loop along the promenade. Tea after if anyone's up for it.",
      },
    ],
  },
  {
    title: `${SEED_PREFIX} Walter's window seat, two calls then ferry`,
    capacity: 3,
    stops: [
      {
        start_time: "10:30",
        end_time: "12:30",
        vibe: "focus",
        neighborhood_slug: "kadikoy",
        custom_location: "Walter's Coffee Roastery",
        notes: "Two scheduled calls. Window seats usually free at this hour.",
      },
      {
        start_time: "13:00",
        end_time: "14:00",
        vibe: "social",
        neighborhood_slug: "karakoy",
        custom_location: "Karaköy iskele",
        notes: "13:15 ferry, deck if it's clear.",
        transport_mode: "ferry",
        transport_price_min: 37,
        transport_price_max: 37,
      },
    ],
  },
  {
    title: `${SEED_PREFIX} Salı pazarı walk · Tuesday market`,
    capacity: 4,
    stops: [
      {
        start_time: "11:00",
        end_time: "12:30",
        vibe: "outdoor",
        neighborhood_slug: "yeldegirmeni",
        custom_location: "Yeldeğirmeni · Salı pazarı",
        notes: "Bring a tote. Fruit, fish, cheese; pace is slow.",
      },
    ],
  },
  {
    title: `${SEED_PREFIX} Cowork at Coffee Department · afternoon`,
    capacity: 6,
    stops: [
      {
        start_time: "14:00",
        end_time: "17:30",
        vibe: "cowork",
        neighborhood_slug: "cihangir",
        custom_location: "Coffee Department",
        notes: "Quiet room downstairs has 4 outlets. Cake at 4.",
      },
    ],
  },
  {
    title: `${SEED_PREFIX} Sunset ferry · Kadıköy → Karaköy → dinner`,
    capacity: 8,
    stops: [
      {
        start_time: "17:35",
        end_time: "18:15",
        vibe: "outdoor",
        neighborhood_slug: "kadikoy",
        custom_location: "Kadıköy iskele",
        notes: "Cameras welcome. Upstairs deck.",
        transport_mode: "ferry",
        transport_price_min: 37,
        transport_price_max: 37,
      },
      {
        start_time: "18:30",
        end_time: "19:30",
        vibe: "outdoor",
        neighborhood_slug: "karakoy",
        custom_location: "Karaköy → Cihangir",
        notes: "~40 min uphill walk through Galata.",
        transport_mode: "walk",
      },
      {
        start_time: "19:30",
        end_time: "22:00",
        vibe: "meal",
        neighborhood_slug: "cihangir",
        custom_location: "Susam Sokak",
        notes: "Communal table, ~₺280 per person. RSVP so we hold seats.",
      },
    ],
  },
  {
    title: `${SEED_PREFIX} Pide at Bambi · just opened, walk-up only`,
    capacity: 5,
    stops: [
      {
        start_time: "19:00",
        end_time: "21:00",
        vibe: "meal",
        neighborhood_slug: "caferaga",
        custom_location: "Bambi Pide · Caferağa Mah.",
        notes: "Four kinds of pide, family style. ~₺180 each.",
      },
    ],
  },

  // ─── Guide-hosted plans ────────────────────────────────────────────
  {
    title: `${SEED_PREFIX} ★ Old Kadıköy · ferry, breakfast, coffee crawl`,
    capacity: 12,
    guideEmail: "seed-guide-cem@istanbulnomads.local",
    stops: [
      {
        start_time: "08:00",
        end_time: "08:45",
        vibe: "outdoor",
        neighborhood_slug: "kadikoy",
        custom_location: "Kadıköy iskele · 08:00 ferry to Karaköy",
        notes: "Meet at the pier. Tea on the deck during the crossing.",
      },
      {
        start_time: "08:45",
        end_time: "10:30",
        vibe: "meal",
        neighborhood_slug: "karakoy",
        custom_location: "Van Kahvaltı Evi",
        notes: "Breakfast spread, 7 plates, çay. Includes a guided rundown of each.",
        transport_mode: "ferry",
        transport_price_min: 37,
        transport_price_max: 37,
      },
      {
        start_time: "10:30",
        end_time: "11:30",
        vibe: "outdoor",
        neighborhood_slug: "karakoy",
        custom_location: "Galata stairs + Şişhane lookout",
        notes: "Walk back uphill. Photo stops welcome.",
        transport_mode: "walk",
      },
      {
        start_time: "11:30",
        end_time: "12:30",
        vibe: "social",
        neighborhood_slug: "karakoy",
        custom_location: "Geyik Coffee, Tophane",
        notes: "Third-wave coffee tasting · 2 origins.",
        transport_mode: "walk",
      },
    ],
  },
  {
    title: `${SEED_PREFIX} ★ Çiya + neighborhood market · lunch with the chef`,
    capacity: 8,
    guideEmail: "seed-guide-sibel@istanbulnomads.local",
    stops: [
      {
        start_time: "13:00",
        end_time: "14:30",
        vibe: "outdoor",
        neighborhood_slug: "kadikoy",
        custom_location: "Salı pazarı · market walk",
        notes: "Pickles, cheese, wild herbs. Bring a tote.",
      },
      {
        start_time: "14:30",
        end_time: "16:30",
        vibe: "meal",
        neighborhood_slug: "kadikoy",
        custom_location: "Çiya Sofrası",
        notes: "Lunch with a brief chef intro. ~12 dishes, family style.",
        transport_mode: "walk",
      },
    ],
  },
  {
    title: `${SEED_PREFIX} ★ Bar Babylon jazz night · reserved table`,
    capacity: 8,
    guideEmail: "seed-guide-ahmet@istanbulnomads.local",
    stops: [
      {
        start_time: "21:30",
        end_time: "23:30",
        vibe: "after-work",
        neighborhood_slug: "asmalimescit",
        custom_location: "Bar Babylon · reserved table",
        notes: "Second set starts 22:00. Cover included.",
      },
      {
        start_time: "23:30",
        end_time: "00:15",
        vibe: "outdoor",
        neighborhood_slug: "karakoy",
        custom_location: "Karaköy iskele · 23:50 ferry back",
        notes: "Last drink, group walks to the ferry together.",
        transport_mode: "walk",
      },
    ],
  },
];

function todayInIstanbul(): string {
  // Server time may be UTC; we want today's date in Europe/Istanbul.
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Istanbul",
  }).format(new Date());
}

function computeExpiresAt(date: string, lastEnd: string): string {
  // Plan expires at last stop's end_time + 2h grace, in Istanbul TZ.
  // Stored as a UTC ISO string.
  const [hh, mm] = lastEnd.split(":").map(Number);
  const local = new Date(`${date}T${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}:00+03:00`);
  local.setHours(local.getHours() + 2);
  return local.toISOString();
}

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in env.");
    process.exit(1);
  }

  const supabase = createClient(url, key, { auth: { persistSession: false } });

  // Find the host. The `members` table is keyed by auth user id; we need
  // to look the user up via the admin auth API.
  const { data: usersList, error: usersErr } =
    await supabase.auth.admin.listUsers({ page: 1, perPage: 200 });
  if (usersErr) {
    console.error("Failed to list users:", usersErr.message);
    process.exit(1);
  }
  const host = usersList.users.find(
    (u) => u.email?.toLowerCase() === HOST_EMAIL.toLowerCase(),
  );
  if (!host) {
    console.error(`No auth user with email ${HOST_EMAIL}.`);
    process.exit(1);
  }

  // Confirm a members row exists; if not, scaffold a minimal one.
  const { data: existingMember } = await (supabase as any)
    .from("members")
    .select("id, display_name")
    .eq("id", host.id)
    .maybeSingle();

  if (!existingMember) {
    console.log(`Creating members row for ${HOST_EMAIL}...`);
    const { error: insErr } = await (supabase as any).from("members").insert({
      id: host.id,
      display_name: host.user_metadata?.full_name ?? "Ali Sameni",
      is_visible: true,
      location: "Kadikoy",
    });
    if (insErr) {
      console.error("Failed to scaffold members row:", insErr.message);
      process.exit(1);
    }
  }

  // Provision an auth user per guide, then upsert their members row.
  // `auth.admin.createUser` is idempotent only if we pass email_confirm
  // and look up existing users first. We index the user list once and
  // create only the missing ones.
  const byEmail = new Map(
    usersList.users.map((u) => [u.email?.toLowerCase() ?? "", u.id]),
  );
  const guideIds: string[] = [];
  for (const g of GUIDES) {
    let id = byEmail.get(g.email.toLowerCase());
    if (!id) {
      const { data: created, error: cErr } =
        await supabase.auth.admin.createUser({
          email: g.email,
          email_confirm: true,
          user_metadata: { full_name: g.display_name },
        });
      if (cErr || !created?.user) {
        console.error(
          `  ✗ Failed to create auth user for ${g.display_name}:`,
          cErr?.message,
        );
        continue;
      }
      id = created.user.id;
    }
    const { error: mErr } = await (supabase as any).from("members").upsert(
      {
        id,
        email: g.email,
        display_name: g.display_name,
        is_visible: true,
        location: g.city_district,
        member_type: "guide",
        bio: g.bio,
      },
      { onConflict: "id" },
    );
    if (mErr) {
      console.error(
        `  ✗ Failed to upsert member row for ${g.display_name}:`,
        mErr.message,
      );
      continue;
    }
    guideIds.push(id);
  }
  // Build lookup so PLANS[].guideEmail can resolve to an id at insert time.
  const guideIdByEmail = new Map<string, string>();
  for (const g of GUIDES) {
    const id = byEmail.get(g.email.toLowerCase()) ?? guideIds.shift();
    if (id) guideIdByEmail.set(g.email.toLowerCase(), id);
  }

  // Idempotent: purge any prior seed plans (both Ali's and the guides').
  const seedHostIds = [host.id, ...Array.from(guideIdByEmail.values())];
  const { data: priorPlans } = await (supabase as any)
    .from("plans")
    .select("id")
    .in("creator_id", seedHostIds)
    .like("title", `${SEED_PREFIX}%`);
  const priorIds = (priorPlans ?? []).map((p: { id: string }) => p.id);
  if (priorIds.length > 0) {
    console.log(`Purging ${priorIds.length} prior seed plan(s)...`);
    // FK cascade should drop stops + attendees; do it explicitly to be safe.
    await (supabase as any).from("plan_attendees").delete().in("plan_id", priorIds);
    await (supabase as any).from("plan_stops").delete().in("plan_id", priorIds);
    await (supabase as any).from("plans").delete().in("id", priorIds);
  }

  const today = todayInIstanbul();
  console.log(`Seeding ${PLANS.length} plan(s) for ${today} (host: ${HOST_EMAIL})...`);

  for (const plan of PLANS) {
    const lastStop = plan.stops[plan.stops.length - 1];
    const expires_at = computeExpiresAt(today, lastStop.end_time);
    const creatorId = plan.guideEmail
      ? guideIdByEmail.get(plan.guideEmail.toLowerCase()) ?? host.id
      : host.id;

    const { data: planRow, error: planErr } = await (supabase as any)
      .from("plans")
      .insert({
        creator_id: creatorId,
        scheduled_date: today,
        title: plan.title,
        capacity: plan.capacity,
        language: "en",
        expires_at,
      })
      .select("id")
      .single();
    if (planErr || !planRow) {
      console.error(`  ✗ Failed to insert "${plan.title}":`, planErr?.message);
      continue;
    }
    const planId = planRow.id;

    const stopRows = plan.stops.map((s, i) => ({
      plan_id: planId,
      ordinal: i + 1,
      neighborhood_slug: s.neighborhood_slug,
      custom_location: s.custom_location,
      start_time: s.start_time,
      end_time: s.end_time,
      vibe: s.vibe,
      notes: s.notes,
      transport_mode: i === 0 ? null : (s.transport_mode ?? null),
      transport_price_min: i === 0 ? null : (s.transport_price_min ?? null),
      transport_price_max: i === 0 ? null : (s.transport_price_max ?? null),
    }));
    const { error: stopsErr } = await (supabase as any)
      .from("plan_stops")
      .insert(stopRows);
    if (stopsErr) {
      console.error(`  ✗ Stops failed for "${plan.title}":`, stopsErr.message);
      await (supabase as any).from("plans").delete().eq("id", planId);
      continue;
    }

    // Host auto-attends.
    await (supabase as any).from("plan_attendees").insert({
      plan_id: planId,
      member_id: creatorId,
      status: "going",
    });

    console.log(
      `  ✓ ${plan.title}  (${plan.stops.length} stop${plan.stops.length === 1 ? "" : "s"})`,
    );
  }

  console.log("Done. Visit /today (signed in) to see them.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
