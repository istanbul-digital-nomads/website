import { z } from "zod";
import { PLAN_VIBES } from "./vibes";

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;

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
  })
  .refine(
    (v) =>
      !!v.space_id || (typeof v.lat === "number" && typeof v.lng === "number"),
    {
      message: "Pick a verified space, or drop a pin on the map",
      path: ["space_id"],
    },
  )
  .refine((v) => !v.end_time || !v.start_time || v.end_time > v.start_time, {
    message: "end_time must be after start_time",
    path: ["end_time"],
  });

export type PlanStopInput = z.infer<typeof planStopSchema>;

const planBase = z.object({
  scheduled_date: z.string().regex(dateRegex, "Invalid date"),
  title: z.string().trim().min(3).max(80),
  capacity: z.preprocess(
    numberOrNull,
    z.number().int().min(2).max(20).nullable().optional(),
  ),
  language: z.string().min(2).max(5).optional(),
});

export const planCreateSchema = planBase.extend({
  stops: z.array(planStopSchema).min(1, "Add at least one stop").max(8),
});

export type PlanCreateInput = z.infer<typeof planCreateSchema>;

// Edit/PATCH. Stops, if present, replace the existing set wholesale.
export const planUpdateSchema = planBase.partial().extend({
  stops: z.array(planStopSchema).min(1).max(8).optional(),
});

export const commentCreateSchema = z.object({
  body: z.string().trim().min(1).max(500),
});
