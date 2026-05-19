import {
  isVerificationLevel,
  VERIFICATION_TONE,
  type VerificationLevel,
} from "@/lib/verification";
import { cn } from "@/lib/utils";

// Verification badge - Red dot / Blue check / Gold star. Pure
// presentational leaf, caller passes the already-translated label so
// this works in both regular RSC and "use cache" scopes without
// pulling next-intl into the cache boundary.
//
// Hidden entirely for `basic` (Red) by default so the directory + plan
// cards aren't littered with "unverified" badges - pass showBasic to
// force render (useful in admin contexts or the verify page itself).

interface Props {
  level: string | null | undefined;
  label: string;
  tooltip?: string;
  size?: "sm" | "md";
  showBasic?: boolean;
  className?: string;
}

export function VerificationBadge({
  level,
  label,
  tooltip,
  size = "sm",
  showBasic = false,
  className,
}: Props) {
  if (!isVerificationLevel(level)) return null;
  if (level === "basic" && !showBasic) return null;
  const tone = VERIFICATION_TONE[level as VerificationLevel];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full font-mono uppercase tracking-wider",
        tone.bg,
        tone.text,
        tone.ring,
        size === "sm" ? "px-1.5 py-0.5 text-[10px]" : "px-2 py-0.5 text-[11px]",
        className,
      )}
      title={tooltip}
    >
      <span aria-hidden>{tone.symbol}</span>
      <span className="sr-only">{tooltip ?? label}</span>
      <span aria-hidden>{label}</span>
    </span>
  );
}
