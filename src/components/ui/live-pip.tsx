import { cn } from "@/lib/utils";

type Props = {
  label: string;
  color?: "live" | "gold" | "rose";
  className?: string;
};

const COLOR: Record<NonNullable<Props["color"]>, string> = {
  live: "134, 239, 172",
  gold: "244, 184, 96",
  rose: "232, 122, 93",
};

/**
 * Pill with a glowing dot - "live activity" badge used at the top of the
 * editorial pages. Default is moss-green (`live`). Same one used by the
 * cinematic hero, Members directory, Today board.
 */
export function LivePip({ label, color = "live", className }: Props) {
  const rgb = COLOR[color];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 whitespace-nowrap rounded-full border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em]",
        className,
      )}
      style={{
        background: `rgba(${rgb}, 0.10)`,
        borderColor: `rgba(${rgb}, 0.35)`,
        color: `rgb(${rgb})`,
      }}
    >
      <span
        className="hero-live-pip inline-block h-1.5 w-1.5 rounded-full"
        style={{ background: `rgb(${rgb})`, boxShadow: `0 0 8px rgb(${rgb})` }}
      />
      {label}
    </span>
  );
}
