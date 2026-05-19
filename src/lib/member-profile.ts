// Rich-profile constants. Powers the current-status pip, the
// chip-list inputs in onboarding, and the section headers on
// /members/[id].

export const CURRENT_STATUS_OPTIONS = [
  "deep_work",
  "open_to_meet",
  "exploring",
  "settling_in",
  "hosting",
  "hibernating",
] as const;

export type CurrentStatus = (typeof CURRENT_STATUS_OPTIONS)[number];

export function isCurrentStatus(v: unknown): v is CurrentStatus {
  return (
    typeof v === "string" &&
    (CURRENT_STATUS_OPTIONS as readonly string[]).includes(v)
  );
}

// Pip tone per status. Mossy green for "open" states, sky for "in
// motion" states, paper-muted for "offline" - keeps the directory
// scannable at a glance.
export const STATUS_TONE: Record<
  CurrentStatus,
  { bg: string; text: string; dotColor: string }
> = {
  deep_work: {
    bg: "bg-ink-2/70",
    text: "text-paper-mute",
    dotColor: "bg-paper-mute",
  },
  open_to_meet: {
    bg: "bg-moss/15",
    text: "text-moss",
    dotColor: "bg-moss",
  },
  exploring: {
    bg: "bg-sky-500/15",
    text: "text-sky-400",
    dotColor: "bg-sky-400",
  },
  settling_in: {
    bg: "bg-ferry-yellow/15",
    text: "text-ferry-yellow",
    dotColor: "bg-ferry-yellow",
  },
  hosting: {
    bg: "bg-terracotta/20",
    text: "text-terracotta",
    dotColor: "bg-terracotta",
  },
  hibernating: {
    bg: "bg-ink-2/50",
    text: "text-paper-faint",
    dotColor: "bg-paper-faint",
  },
};
