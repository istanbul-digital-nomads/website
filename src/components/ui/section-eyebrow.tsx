import { cn } from "@/lib/utils";

/**
 * Design System v2 section marker: a mono issue/section number, a short
 * terracotta rule, an uppercase label, and an optional kicker. Replaces
 * emoji or icon section headers (brand rule - no emoji as section icons).
 */
export function SectionEyebrow({
  num,
  label,
  kicker,
  className,
}: {
  num: string;
  label: string;
  kicker?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-3.5 font-mono text-[11px] uppercase tracking-wider",
        className,
      )}
    >
      <span className="text-terracotta">{num}</span>
      <span className="h-px w-7 bg-terracotta" />
      <span className="text-paper-mute">{label}</span>
      {kicker ? <span className="text-paper-faint">· {kicker}</span> : null}
    </div>
  );
}
