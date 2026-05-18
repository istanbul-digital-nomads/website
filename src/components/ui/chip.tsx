"use client";

import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

type ChipProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean;
  color?: "gold" | "rose" | "live";
};

const COLOR_VAR: Record<NonNullable<ChipProps["color"]>, string> = {
  gold: "244, 184, 96",
  rose: "232, 122, 93",
  live: "134, 239, 172",
};

/**
 * Pill-shaped filter chip. `active` flips it to the colored variant
 * (tinted border + 10% fill), default is a quiet outlined chip.
 */
export function Chip({
  active = false,
  color = "gold",
  className,
  children,
  ...rest
}: ChipProps) {
  const rgb = COLOR_VAR[color];
  return (
    <button
      type="button"
      className={cn(
        "whitespace-nowrap rounded-full border px-3 py-1.5 font-grotesk text-[11px] tracking-[0.04em] transition-colors",
        active ? "text-cream" : "text-cream/70 hover:text-cream",
        className,
      )}
      style={{
        borderColor: active
          ? `rgba(${rgb}, 1)`
          : "rgba(246, 236, 217, 0.10)",
        background: active ? `rgba(${rgb}, 0.10)` : "transparent",
        color: active ? `rgb(${rgb})` : undefined,
      }}
      {...rest}
    >
      {children}
    </button>
  );
}
