/**
 * Seed "Ali Sameni" as a real member and his week as 7 real plans, built the
 * same way the app's createPlan does - so they show up in the feed and on
 * /plans/[id] like any member's plans, and exercise the animated walkthrough
 * (vibe-icon markers + transport legs).
 *
 * Idempotent: the member is upserted by a stable email, and his plans are
 * purged by creator_id (cascading stops/attendees) before re-insert. Dates are
 * rolling - assigned to the upcoming 7 days so they stay inside the feed's
 * "this week" range. Re-run to refresh the dates.
 *
 * Run: pnpm tsx --env-file=.env.local scripts/seed-ali-week.ts
 */

import { createClient } from "@supabase/supabase-js";

const ALI_EMAIL = "ali-sameni@istanbulnomads.local";

// Istanbul is UTC+03 year-round (no DST since 2016), so a fixed offset is safe.
function todayIstanbul(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Istanbul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}
function addDays(date: string, n: number): string {
  const d = new Date(`${date}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}
function expiresAt(date: string, latestEnd: string | null): string {
  if (latestEnd) {
    const [hh = "0", mm = "0"] = latestEnd.split(":");
    const local = new Date(`${date}T${hh}:${mm}:00+03:00`);
    return new Date(local.getTime() + 60 * 60 * 1000).toISOString();
  }
  return new Date(`${date}T23:59:59+03:00`).toISOString();
}

type Vibe =
  | "focus"
  | "cowork"
  | "social"
  | "meal"
  | "after-work"
  | "outdoor"
  | "culture";
type Transport =
  | "ferry"
  | "metro"
  | "tram"
  | "bus"
  | "minibus"
  | "taxi"
  | "shared_uber"
  | "walk"
  | "bike"
  | null;

interface SeedStop {
  custom_location: string;
  neighborhood_slug: string;
  lat: number;
  lng: number;
  start_time: string;
  end_time: string;
  vibe: Vibe;
  notes: string;
  transport_mode: Transport; // leg INTO this stop; null on the first stop
}
interface SeedDay {
  title: string;
  neighborhood_slug: string;
  stops: SeedStop[];
}

const DAYS: SeedDay[] = [
  {
    title: "Moda slow morning",
    neighborhood_slug: "kadikoy",
    stops: [
      {
        custom_location: "BEX Coffee Caferağa",
        neighborhood_slug: "kadikoy",
        lat: 40.9897,
        lng: 29.0263,
        start_time: "09:00",
        end_time: "11:30",
        vibe: "cowork",
        notes: "Slow start with a flat white and a stack of unread messages.",
        transport_mode: null,
      },
      {
        custom_location: "Moda Sahili",
        neighborhood_slug: "kadikoy",
        lat: 40.9819,
        lng: 29.0277,
        start_time: "12:00",
        end_time: "13:30",
        vibe: "outdoor",
        notes: "Stretch the legs along the sea before lunch.",
        transport_mode: "walk",
      },
      {
        custom_location: "Çiya Sofrası",
        neighborhood_slug: "kadikoy",
        lat: 40.9886,
        lng: 29.0276,
        start_time: "13:45",
        end_time: "15:00",
        vibe: "meal",
        notes: "Anatolian comfort food at the Kadıköy market.",
        transport_mode: "walk",
      },
      {
        custom_location: "Süreyya Opera & Bahariye",
        neighborhood_slug: "kadikoy",
        lat: 40.9905,
        lng: 29.0282,
        start_time: "17:00",
        end_time: "19:00",
        vibe: "culture",
        notes: "Wander Bahariye, peek at Süreyya, end the day light.",
        transport_mode: "walk",
      },
    ],
  },
  {
    title: "Nişantaşı deep work",
    neighborhood_slug: "sisli",
    stops: [
      {
        custom_location: "Kahve Dünyası Nişantaşı",
        neighborhood_slug: "nisantasi",
        lat: 41.0518,
        lng: 28.9925,
        start_time: "09:00",
        end_time: "12:30",
        vibe: "focus",
        notes: "Long focus block. Big windows, steady wifi.",
        transport_mode: null,
      },
      {
        custom_location: "Lunch on Vali Konağı",
        neighborhood_slug: "nisantasi",
        lat: 41.0515,
        lng: 28.9919,
        start_time: "13:00",
        end_time: "14:00",
        vibe: "meal",
        notes: "Quick lunch nearby, then keep moving.",
        transport_mode: "walk",
      },
      {
        custom_location: "Maçka Demokrasi Park",
        neighborhood_slug: "nisantasi",
        lat: 41.0466,
        lng: 28.9925,
        start_time: "15:00",
        end_time: "17:00",
        vibe: "outdoor",
        notes: "Walk through the park toward the Bosphorus side.",
        transport_mode: "walk",
      },
      {
        custom_location: "BomontiAda",
        neighborhood_slug: "sisli",
        lat: 41.0617,
        lng: 28.9837,
        start_time: "18:00",
        end_time: "21:00",
        vibe: "after-work",
        notes: "Drinks and food in the old brewery courtyard.",
        transport_mode: "metro",
      },
    ],
  },
  {
    title: "Karaköy & Galata loop",
    neighborhood_slug: "beyoglu",
    stops: [
      {
        custom_location: "Mikel Coffee Karaköy",
        neighborhood_slug: "karakoy",
        lat: 41.0236,
        lng: 28.977,
        start_time: "09:30",
        end_time: "12:00",
        vibe: "cowork",
        notes: "Open near the water while it's still cool.",
        transport_mode: null,
      },
      {
        custom_location: "Karaköy lunch",
        neighborhood_slug: "karakoy",
        lat: 41.0247,
        lng: 28.9786,
        start_time: "12:30",
        end_time: "14:00",
        vibe: "meal",
        notes: "Old-school meyhane fare by the pier.",
        transport_mode: "walk",
      },
      {
        custom_location: "Galata Tower & alleys",
        neighborhood_slug: "galata",
        lat: 41.0257,
        lng: 28.9744,
        start_time: "14:30",
        end_time: "16:00",
        vibe: "culture",
        notes: "Climb to the tower, then through Galata's slope.",
        transport_mode: "walk",
      },
      {
        custom_location: "İstiklal Caddesi",
        neighborhood_slug: "beyoglu",
        lat: 41.0345,
        lng: 28.9777,
        start_time: "17:00",
        end_time: "20:00",
        vibe: "outdoor",
        notes: "Down İstiklal in the warm light, end at Tünel.",
        transport_mode: "walk",
      },
    ],
  },
  {
    title: "Bağdat Caddesi day",
    neighborhood_slug: "kadikoy",
    stops: [
      {
        custom_location: "Caffè Nero Caddebostan",
        neighborhood_slug: "kadikoy",
        lat: 40.9733,
        lng: 29.0561,
        start_time: "09:00",
        end_time: "12:00",
        vibe: "focus",
        notes: "Work block on the strip.",
        transport_mode: null,
      },
      {
        custom_location: "Lunch on Bağdat Cad",
        neighborhood_slug: "kadikoy",
        lat: 40.971,
        lng: 29.064,
        start_time: "12:30",
        end_time: "13:30",
        vibe: "meal",
        notes: "Quick bite between shop windows.",
        transport_mode: "walk",
      },
      {
        custom_location: "Suadiye shop walk",
        neighborhood_slug: "kadikoy",
        lat: 40.9692,
        lng: 29.07,
        start_time: "14:00",
        end_time: "16:00",
        vibe: "outdoor",
        notes: "Easy pace through Suadiye toward Bostancı.",
        transport_mode: "walk",
      },
      {
        custom_location: "Caddebostan Sahili sunset",
        neighborhood_slug: "kadikoy",
        lat: 40.9683,
        lng: 29.0623,
        start_time: "17:00",
        end_time: "19:00",
        vibe: "outdoor",
        notes: "Sit on the rocks for the sunset over the Marmara.",
        transport_mode: "walk",
      },
    ],
  },
  {
    title: "Mecidiyeköy + Bomonti",
    neighborhood_slug: "sisli",
    stops: [
      {
        custom_location: "BEX Coffee Fulya",
        neighborhood_slug: "sisli",
        lat: 41.0642,
        lng: 28.9934,
        start_time: "09:30",
        end_time: "12:30",
        vibe: "cowork",
        notes: "New BEX in Fulya, plenty of sockets.",
        transport_mode: null,
      },
      {
        custom_location: "Cevahir lunch",
        neighborhood_slug: "sisli",
        lat: 41.0653,
        lng: 28.9912,
        start_time: "13:00",
        end_time: "14:30",
        vibe: "meal",
        notes: "Quick stop at the mall, just refuel.",
        transport_mode: "walk",
      },
      {
        custom_location: "BomontiAda afternoon",
        neighborhood_slug: "sisli",
        lat: 41.0617,
        lng: 28.9837,
        start_time: "15:30",
        end_time: "18:00",
        vibe: "social",
        notes: "Coffee in the courtyard, watch the kids play.",
        transport_mode: "metro",
      },
      {
        custom_location: "Maçka evening",
        neighborhood_slug: "nisantasi",
        lat: 41.0466,
        lng: 28.9925,
        start_time: "19:00",
        end_time: "22:00",
        vibe: "after-work",
        notes: "Sunset through the park, dinner up in Nişantaşı.",
        transport_mode: "taxi",
      },
    ],
  },
  {
    title: "İstiklal social",
    neighborhood_slug: "beyoglu",
    stops: [
      {
        custom_location: "Starbucks Taksim (Marmara)",
        neighborhood_slug: "taksim",
        lat: 41.0367,
        lng: 28.986,
        start_time: "10:00",
        end_time: "12:00",
        vibe: "meal",
        notes: "Saturday brunch start.",
        transport_mode: null,
      },
      {
        custom_location: "Walk down İstiklal",
        neighborhood_slug: "beyoglu",
        lat: 41.0345,
        lng: 28.9777,
        start_time: "12:30",
        end_time: "14:30",
        vibe: "outdoor",
        notes: "Down İstiklal toward Galatasaray, slow.",
        transport_mode: "walk",
      },
      {
        custom_location: "Cihangir streets",
        neighborhood_slug: "cihangir",
        lat: 41.0337,
        lng: 28.9809,
        start_time: "15:00",
        end_time: "17:30",
        vibe: "social",
        notes: "Coffee and bookstores in Cihangir.",
        transport_mode: "walk",
      },
      {
        custom_location: "Asmalı Mescit dinner",
        neighborhood_slug: "beyoglu",
        lat: 41.0309,
        lng: 28.9758,
        start_time: "19:00",
        end_time: "22:30",
        vibe: "after-work",
        notes: "Meyhane evening with friends.",
        transport_mode: "walk",
      },
    ],
  },
  {
    title: "Moda easy Sunday",
    neighborhood_slug: "kadikoy",
    stops: [
      {
        custom_location: "Kahve Dünyası Moda",
        neighborhood_slug: "moda",
        lat: 40.9909,
        lng: 29.0249,
        start_time: "10:00",
        end_time: "12:00",
        vibe: "meal",
        notes: "Late breakfast, no rush.",
        transport_mode: null,
      },
      {
        custom_location: "Brunch in Moda",
        neighborhood_slug: "moda",
        lat: 40.987,
        lng: 29.0275,
        start_time: "12:30",
        end_time: "14:00",
        vibe: "meal",
        notes: "Slow brunch on the Moda streets.",
        transport_mode: "walk",
      },
      {
        custom_location: "Moda Sahili long walk",
        neighborhood_slug: "moda",
        lat: 40.9819,
        lng: 29.0277,
        start_time: "15:00",
        end_time: "18:00",
        vibe: "outdoor",
        notes: "Walk south toward the Caddebostan side, with breaks.",
        transport_mode: "walk",
      },
      {
        custom_location: "Süreyya wrap-up",
        neighborhood_slug: "kadikoy",
        lat: 40.9905,
        lng: 29.0282,
        start_time: "19:00",
        end_time: "21:00",
        vibe: "meal",
        notes: "Wrap the week with an easy dinner near the opera.",
        transport_mode: "walk",
      },
    ],
  },
];

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.",
    );
    process.exit(1);
  }
  const sb = createClient(url, key, { auth: { persistSession: false } });
  const db = sb as unknown as { from: (t: string) => any };

  // 1. Provision Ali's auth user + member row.
  const { data: usersList } = await sb.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });
  let aliId = (usersList?.users ?? []).find(
    (u) => u.email?.toLowerCase() === ALI_EMAIL,
  )?.id;
  if (!aliId) {
    const { data: created, error } = await sb.auth.admin.createUser({
      email: ALI_EMAIL,
      email_confirm: true,
      user_metadata: { full_name: "Ali Sameni" },
    });
    if (error || !created?.user) {
      console.error("✗ create auth user:", error?.message);
      process.exit(1);
    }
    aliId = created.user.id;
  }
  const { error: mErr } = await db.from("members").upsert(
    {
      id: aliId,
      email: ALI_EMAIL,
      display_name: "Ali Sameni",
      is_visible: true,
      onboarding_completed: true,
      member_type: "nomad",
      is_agent: false,
      verification_level: "verified",
      location: "Kadıköy",
      city_district: "Moda",
      profession: "Designer",
      bio: "Designer, walking nomad. Splits the week between Kadıköy, Şişli, and Beyoğlu - one neighborhood a day.",
    },
    { onConflict: "id" },
  );
  if (mErr) {
    console.error("✗ upsert member:", mErr.message);
    process.exit(1);
  }
  console.log(`✓ Member ready: Ali Sameni (${aliId})`);

  // 2. Purge Ali's prior plans (cascades stops + attendees via FK).
  const { data: prior } = await db
    .from("plans")
    .select("id")
    .eq("creator_id", aliId);
  const priorIds = (prior ?? []).map((p: { id: string }) => p.id);
  if (priorIds.length) {
    await db.from("plan_attendees").delete().in("plan_id", priorIds);
    await db.from("plan_stops").delete().in("plan_id", priorIds);
    await db.from("plans").delete().in("id", priorIds);
    console.log(`✓ Cleared ${priorIds.length} prior Ali plans`);
  }

  // 3. Insert the 7 days on rolling upcoming dates.
  const today = todayIstanbul();
  let planCount = 0;
  let stopCount = 0;
  for (let i = 0; i < DAYS.length; i++) {
    const day = DAYS[i]!;
    const date = addDays(today, i + 1); // tomorrow .. +7
    const latestEnd = day.stops.reduce<string | null>(
      (max, s) => (max === null || s.end_time > max ? s.end_time : max),
      null,
    );
    const { data: row, error } = await db
      .from("plans")
      .insert({
        creator_id: aliId,
        scheduled_date: date,
        title: day.title,
        capacity: null,
        language: "en",
        expires_at: expiresAt(date, latestEnd),
        is_ticketed: false,
        entry_fee_cents: null,
        budget_per_person_min_cents: null,
        budget_per_person_max_cents: null,
        currency: "TRY",
        host_role_at_creation: "nomad",
        host_badge_at_creation: "verified",
      })
      .select("id")
      .single();
    if (error || !row) {
      console.error(`✗ plan "${day.title}":`, error?.message);
      continue;
    }
    const stops = day.stops.map((s, idx) => ({
      plan_id: row.id,
      ordinal: idx + 1,
      space_id: null,
      custom_location: s.custom_location,
      neighborhood_slug: s.neighborhood_slug,
      lat: s.lat,
      lng: s.lng,
      start_time: s.start_time,
      end_time: s.end_time,
      vibe: s.vibe,
      notes: s.notes,
      // Transport is the leg from the previous stop; null on the first.
      transport_mode: idx === 0 ? null : s.transport_mode,
    }));
    const { error: sErr } = await db.from("plan_stops").insert(stops);
    if (sErr) {
      console.error(`✗ stops for "${day.title}":`, sErr.message);
      await db.from("plans").delete().eq("id", row.id);
      continue;
    }
    await db
      .from("plan_attendees")
      .insert({ plan_id: row.id, member_id: aliId, status: "going" });
    planCount++;
    stopCount += stops.length;
  }
  console.log(
    `✓ Seeded ${planCount} plans / ${stopCount} stops for Ali Sameni (${today} +1..+7)`,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
