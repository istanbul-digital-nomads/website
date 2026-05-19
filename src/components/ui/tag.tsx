import { cn } from "@/lib/utils";

/**
 * Design System v2 metadata tag - a mono, uppercase pill. The only recurring
 * "chip" in the system; most surfaces are composed from atoms rather than a
 * UI kit.
 */
export function Tag({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-ink-4 px-2.5 py-1 font-mono text-[10.5px] uppercase tracking-wide text-paper-mute",
        className,
      )}
    >
      {children}
    </span>
  );
}
