import { cn } from "@/lib/utils";

type Props = {
  label: string;
  kicker?: string;
  color?: "gold" | "rose" | "live";
  className?: string;
};

const COLOR_VAR: Record<NonNullable<Props["color"]>, string> = {
  gold: "rgb(244 184 96)",
  rose: "rgb(232 122 93)",
  live: "rgb(134 239 172)",
};

/**
 * The gold hairline + uppercase eyebrow used on every editorial surface
 * (Members directory, Today board, profile pages). 14px hairline, then
 * an `0.22em` letter-spaced uppercase label, then an optional dim kicker.
 */
export function Eyebrow({ label, kicker, color = "gold", className }: Props) {
  const c = COLOR_VAR[color];
  return (
    <div className={cn("flex items-center gap-3.5", className)}>
      <span
        className="block h-px w-6"
        style={{ background: c, opacity: 0.6 }}
        aria-hidden
      />
      <span
        className="text-[10px] font-semibold uppercase tracking-[0.22em]"
        style={{ color: c }}
      >
        {label}
      </span>
      {kicker && (
        <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cream/32">
          · {kicker}
        </span>
      )}
    </div>
  );
}
