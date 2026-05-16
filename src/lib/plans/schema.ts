import { z } from "zod";
import { PLAN_VIBES } from "./vibes";

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;

const emptyToNull = (v: unknown) =>
  typeof v === "string" && v.trim() === "" ? null : v;

// Base object schema (no refinements). Refinements are added separately so
// `planUpdateSchema = planBase.partial()` still works - Zod won't apply
// `.partial()` to a schema that already carries `.refine()`.
const planBase = z.object({
  scheduled_date: z.string().regex(dateRegex, "Invalid date"),
  start_time: z.preprocess(
    emptyToNull,
    z.string().regex(timeRegex).nullable().optional(),
  ),
  end_time: z.preprocess(
    emptyToNull,
    z.string().regex(timeRegex).nullable().optional(),
  ),
  space_id: z.preprocess(emptyToNull, z.string().nullable().optional()),
  neighborhood_slug: z.preprocess(
    emptyToNull,
    z.string().nullable().optional(),
  ),
  custom_location: z.preprocess(
    emptyToNull,
    z.string().max(120).nullable().optional(),
  ),
  title: z.string().trim().min(3).max(80),
  vibe: z.enum(PLAN_VIBES),
  notes: z.preprocess(emptyToNull, z.string().max(280).nullable().optional()),
  capacity: z.preprocess(
    (v) => (v === "" || v === null || v === undefined ? null : Number(v)),
    z.number().int().min(2).max(20).nullable().optional(),
  ),
  language: z.string().min(2).max(5).optional(),
});

export const planCreateSchema = planBase
  .refine((v) => !v.end_time || !v.start_time || v.end_time > v.start_time, {
    message: "end_time must be after start_time",
    path: ["end_time"],
  })
  .refine((v) => v.space_id || v.custom_location, {
    message: "Pick a space or write a custom location",
    path: ["space_id"],
  });

export type PlanCreateInput = z.infer<typeof planCreateSchema>;

// Edit/PATCH partial. Skips the "space_id or custom_location" refinement
// since a partial update may not touch either field; the create-time
// refinement still guards initial creation.
export const planUpdateSchema = planBase
  .partial()
  .refine(
    (v) =>
      v.end_time === undefined ||
      v.start_time === undefined ||
      !v.end_time ||
      !v.start_time ||
      v.end_time > v.start_time,
    { message: "end_time must be after start_time", path: ["end_time"] },
  );

export const commentCreateSchema = z.object({
  body: z.string().trim().min(1).max(500),
});
