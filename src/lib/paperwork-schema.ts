import { z } from "zod";
import { SERVICE_TYPES } from "./paperwork";

const emptyToNull = (v: unknown) =>
  typeof v === "string" && v.trim() === "" ? null : v;
const numberOrNull = (v: unknown) =>
  v === "" || v === null || v === undefined ? null : Number(v);
const csvToArray = (v: unknown) => {
  if (Array.isArray(v)) return v as string[];
  if (typeof v !== "string") return [];
  return v
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
};

export const paperworkServiceCreateSchema = z.object({
  service_type: z.enum(SERVICE_TYPES),
  title: z.string().trim().min(3).max(120),
  description: z.preprocess(
    emptyToNull,
    z.string().max(1200).nullable().optional(),
  ),
  languages: z.preprocess(csvToArray, z.array(z.string()).max(10)),
  neighborhoods: z.preprocess(csvToArray, z.array(z.string()).max(20)),
  price_lira: z
    .preprocess(numberOrNull, z.number().int().min(0))
    .transform((n) => n * 100), // store as cents
  duration_estimate_minutes: z.preprocess(
    numberOrNull,
    z.number().int().min(15).max(480).nullable().optional(),
  ),
});

export type PaperworkServiceCreateInput = z.infer<
  typeof paperworkServiceCreateSchema
>;
