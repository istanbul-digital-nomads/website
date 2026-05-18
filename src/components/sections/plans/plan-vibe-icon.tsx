import { cn } from "@/lib/utils";
import { VIBE_ICONS, type PlanVibe } from "@/lib/plans/vibes";

interface Props {
  vibe: PlanVibe;
  className?: string;
}

export function PlanVibeIcon({ vibe, className }: Props) {
  const Icon = VIBE_ICONS[vibe];
  return <Icon className={cn("h-4 w-4", className)} aria-hidden />;
}
