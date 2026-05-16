import {
  Coffee,
  Focus,
  Sunset,
  TreePine,
  Users,
  Utensils,
  type LucideIcon,
} from "lucide-react";

export const PLAN_VIBES = [
  "focus",
  "cowork",
  "social",
  "meal",
  "after-work",
  "outdoor",
] as const;

export type PlanVibe = (typeof PLAN_VIBES)[number];

export const VIBE_ICONS: Record<PlanVibe, LucideIcon> = {
  focus: Focus,
  cowork: Coffee,
  social: Users,
  meal: Utensils,
  "after-work": Sunset,
  outdoor: TreePine,
};

export function isPlanVibe(value: unknown): value is PlanVibe {
  return (
    typeof value === "string" && (PLAN_VIBES as readonly string[]).includes(value)
  );
}
