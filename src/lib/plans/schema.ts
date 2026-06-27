import { z } from "zod";
import { PLAN_VIBES } from "./vibes";
import { TRANSPORT_MODES } from "./transport";
import { toIstanbulDateTime } from "./expiry";

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;

// Event-step providers. Generic on purpose - Luma is first, more can follow.
export const EVENT_PROVIDERS = ["luma"] as const;

const emptyToNull = (v: unknown) =>
  typeof v === "string" && v.trim() === "" ? null : v;

const numberOrNull = (v: unknown) =>
  v === "" || v === null || v === undefined ? null : Number(v);

// One stop on a multi-stop day plan. Either pick a verified space by id,
// or drop a custom pin (lat + lng required, label optional).
export const planStopSchema = z
  .object({
    space_id: z.preprocess(emptyToNull, z.string().nullable().optional()),
    custom_location: z.preprocess(
      emptyToNull,
      z.string().max(120).nullable().optional(),
    ),
    neighborhood_slug: z.preprocess(
      emptyToNull,
      z.string().nullable().optional(),
    ),
    lat: z.preprocess(numberOrNull, z.number().nullable().optional()),
    lng: z.preprocess(numberOrNull, z.number().nullable().optional()),
    start_time: z.preprocess(
      emptyToNull,
      z.string().regex(timeRegex).nullable().optional(),
    ),
    end_time: z.preprocess(
      emptyToNull,
      z.string().regex(timeRegex).nullable().optional(),
    ),
    vibe: z.enum(PLAN_VIBES),
    notes: z.preprocess(emptyToNull, z.string().max(280).nullable().optional()),
    transport_mode: z.preprocess(
      emptyToNull,
      z.enum(TRANSPORT_MODES).nullable().optional(),
    ),
    transport_price_min: z.preprocess(
      numberOrNull,
      z.number().int().min(0).nullable().optional(),
    ),
    transport_price_max: z.preprocess(
      numberOrNull,
      z.number().int().min(0).nullable().optional(),
    ),
    cost_min_cents: z.preprocess(
      numberOrNull,
      z.number().int().min(0).nullable().optional(),
    ),
    cost_max_cents: z.preprocess(
      numberOrNull,
      z.number().int().min(0).nullable().optional(),
    ),
    // Event steps (Luma first). A 'place' step leaves these null and keeps the
    // space/pin location rule below; an 'event' step needs a provider + url.
    step_kind: z.enum(["place", "event"]).default("place"),
    event_provider: z.preprocess(
      emptyToNull,
      z.enum(EVENT_PROVIDERS).nullable().optional(),
    ),
    event_url: z.preprocess(
      emptyToNull,
      z.string().url().max(500).nullable().optional(),
    ),
    event_title: z.preprocess(
      emptyToNull,
      z.string().max(200).nullable().optional(),
    ),
    event_cover_url: z.preprocess(
      emptyToNull,
      z.string().url().max(1000).nullable().optional(),
    ),
    event_starts_at: z.preprocess(
      emptyToNull,
      z.string().datetime({ offset: true }).nullable().optional(),
    ),
    event_ends_at: z.preprocess(
      emptyToNull,
      z.string().datetime({ offset: true }).nullable().optional(),
    ),
  })
  .refine(
    (v) =>
      v.step_kind === "event"
        ? !!v.event_provider && !!v.event_url
        : !!v.space_id ||
          (typeof v.lat === "number" && typeof v.lng === "number"),
    {
      message: "Pick a verified space, drop a pin, or add an event link",
      path: ["space_id"],
    },
  )
  .refine((v) => !v.end_time || !v.start_time || v.end_time > v.start_time, {
    message: "end_time must be after start_time",
    path: ["end_time"],
  })
  .refine(
    (v) =>
      v.transport_price_min == null ||
      v.transport_price_max == null ||
      v.transport_price_max >= v.transport_price_min,
    {
      message: "Max price must be greater than min",
      path: ["transport_price_max"],
    },
  )
  .refine(
    (v) =>
      v.cost_min_cents == null ||
      v.cost_max_cents == null ||
      v.cost_max_cents >= v.cost_min_cents,
    {
      message: "Max cost must be at least the min",
      path: ["cost_max_cents"],
    },
  );

export type PlanStopInput = z.infer<typeof planStopSchema>;

const planBase = z.object({
  scheduled_date: z.string().regex(dateRegex, "Invalid date"),
  title: z.string().trim().min(3).max(80),
  capacity: z.preprocess(
    numberOrNull,
    z.number().int().min(2).max(20).nullable().optional(),
  ),
  language: z.string().min(2).max(5).optional(),
  // Phase 2 money fields. Exactly one mode applies:
  //   budget plan  -> is_ticketed=false, optional budget_*_cents range
  //   ticketed plan -> is_ticketed=true, entry_fee_cents required
  // The Phase 3 verification ladder gates whether is_ticketed=true is
  // even allowed at the API layer; schema enforces shape only.
  is_ticketed: z.boolean().optional().default(false),
  entry_fee_cents: z.preprocess(
    numberOrNull,
    z.number().int().min(0).nullable().optional(),
  ),
  budget_per_person_min_cents: z.preprocess(
    numberOrNull,
    z.number().int().min(0).nullable().optional(),
  ),
  budget_per_person_max_cents: z.preprocess(
    numberOrNull,
    z.number().int().min(0).nullable().optional(),
  ),
  currency: z.literal("TRY").optional().default("TRY"),
});

// Every event step must fall on the plan's day. The client blocks this with a
// "set plan date to the event" prompt; this is the server-side backstop.
// Only checks when both a scheduled_date and stops are in the payload.
function eventDatesMatchPlanDay(v: {
  scheduled_date?: string;
  stops?: PlanStopInput[];
}): boolean {
  if (!v.scheduled_date || !v.stops) return true;
  return v.stops.every((s) => {
    if (s.step_kind !== "event" || !s.event_starts_at) return true;
    const local = toIstanbulDateTime(s.event_starts_at);
    return !local || local.date === v.scheduled_date;
  });
}

const eventDateRefineMessage = {
  message: "Event date must match the plan's date",
  path: ["stops"],
};

export const planCreateSchema = planBase
  .extend({
    stops: z.array(planStopSchema).min(1, "Add at least one stop").max(8),
  })
  .refine(eventDatesMatchPlanDay, eventDateRefineMessage)
  .refine(
    (v) =>
      !v.is_ticketed ||
      (typeof v.entry_fee_cents === "number" && v.entry_fee_cents > 0),
    {
      message: "Ticketed plans need an entry fee",
      path: ["entry_fee_cents"],
    },
  )
  .refine(
    (v) =>
      v.is_ticketed ||
      v.budget_per_person_min_cents == null ||
      v.budget_per_person_max_cents == null ||
      v.budget_per_person_max_cents >= v.budget_per_person_min_cents,
    {
      message: "Max budget must be at least the min",
      path: ["budget_per_person_max_cents"],
    },
  );

export type PlanCreateInput = z.infer<typeof planCreateSchema>;

// Edit/PATCH. Stops, if present, replace the existing set wholesale.
export const planUpdateSchema = planBase
  .partial()
  .extend({
    stops: z.array(planStopSchema).min(1).max(8).optional(),
  })
  .refine(eventDatesMatchPlanDay, eventDateRefineMessage);

export const commentCreateSchema = z.object({
  body: z.string().trim().min(1).max(500),
});

// A review left by an attendee after a plan ends: a 1-5 star rating, a
// "would you go again?" flag, and optional free text. Upsert semantics -
// one review per attendee, editable.
const SUPABASE_PUBLIC_URL_RE =
  /^https:\/\/[a-z0-9-]+\.supabase\.co\/storage\/v1\/object\/public\/plan-photos\//;

export const MAX_REVIEW_PHOTOS = 4;

export const reviewUpsertSchema = z.object({
  rating: z.coerce.number().int().min(1).max(5),
  would_return: z.boolean(),
  // A short standout highlight (one line), shown above the longer review body.
  quote: z.preprocess(
    emptyToNull,
    z.string().trim().max(140).nullable().optional(),
  ),
  body: z.preprocess(
    emptyToNull,
    z.string().trim().max(1000).nullable().optional(),
  ),
  // Public URLs in the plan-photos bucket. The client uploads first, then
  // sends back the resulting URLs - we only persist ones that look right.
  photos: z
    .array(z.string().url().regex(SUPABASE_PUBLIC_URL_RE))
    .max(MAX_REVIEW_PHOTOS)
    .optional()
    .default([]),
});

export type ReviewUpsertInput = z.infer<typeof reviewUpsertSchema>;
