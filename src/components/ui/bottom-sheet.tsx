"use client";

import { useRef, useState, type HTMLAttributes, type ReactNode } from "react";
import { ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

export type SheetHeight = "peek" | "half" | "full";

const HEIGHT_VH: Record<SheetHeight, number> = {
  peek: 22,
  half: 50,
  full: 90,
};

const ORDER: SheetHeight[] = ["peek", "half", "full"];

interface BottomSheetProps extends HTMLAttributes<HTMLDivElement> {
  height: SheetHeight;
  onHeightChange: (next: SheetHeight) => void;
  ariaLabel: string;
  children: ReactNode;
  /** Visual hint shown next to the handle. */
  caption?: ReactNode;
}

/**
 * Map-overlay bottom sheet. Three snap heights (peek / half / full),
 * draggable by the handle on touch, tap-to-cycle for keyboard/click users.
 * Map underneath stays interactive at every height - this isn't a modal.
 */
export function BottomSheet({
  height,
  onHeightChange,
  ariaLabel,
  caption,
  className,
  children,
  ...rest
}: BottomSheetProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [dragOffsetVh, setDragOffsetVh] = useState(0);
  const dragStateRef = useRef<{
    startY: number;
    startHeightVh: number;
  } | null>(null);

  function cycleHeight(direction: 1 | -1 = 1) {
    const idx = ORDER.indexOf(height);
    const next = ORDER[(idx + direction + ORDER.length) % ORDER.length];
    onHeightChange(next);
  }

  function nearestSnap(currentVh: number): SheetHeight {
    return ORDER.reduce((best, h) => {
      return Math.abs(HEIGHT_VH[h] - currentVh) <
        Math.abs(HEIGHT_VH[best] - currentVh)
        ? h
        : best;
    }, ORDER[0]);
  }

  function onTouchStart(e: React.TouchEvent) {
    dragStateRef.current = {
      startY: e.touches[0]!.clientY,
      startHeightVh: HEIGHT_VH[height],
    };
  }

  function onTouchMove(e: React.TouchEvent) {
    const s = dragStateRef.current;
    if (!s) return;
    const deltaY = e.touches[0]!.clientY - s.startY;
    // Drag down = decrease height. Translate Y delta to vh.
    const vh = window.innerHeight / 100;
    const delta = -deltaY / vh;
    setDragOffsetVh(delta);
  }

  function onTouchEnd() {
    const s = dragStateRef.current;
    if (!s) return;
    const finalVh = Math.max(10, Math.min(95, s.startHeightVh + dragOffsetVh));
    const snap = nearestSnap(finalVh);
    onHeightChange(snap);
    setDragOffsetVh(0);
    dragStateRef.current = null;
  }

  const effectiveVh = Math.max(
    10,
    Math.min(95, HEIGHT_VH[height] + dragOffsetVh),
  );

  return (
    <div
      ref={ref}
      role="region"
      aria-label={ariaLabel}
      data-expanded={height !== "peek" ? "true" : "false"}
      className={cn(
        "fixed inset-x-0 bottom-0 z-30 flex flex-col rounded-t-2xl border-t border-ink-3 bg-ink-1 text-paper shadow-[0_-20px_60px_rgba(0,0,0,0.35)]",
        // Always render the height; CSS transitions handle motion. Disable
        // animation under reduced-motion.
        "transition-[height] duration-300 ease-out motion-reduce:transition-none",
        className,
      )}
      style={{ height: `${effectiveVh}vh` }}
      {...rest}
    >
      <button
        type="button"
        onClick={() => cycleHeight(1)}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        aria-label={height === "full" ? "Collapse sheet" : "Expand sheet"}
        className="group flex shrink-0 items-center justify-center gap-2 px-4 pb-1 pt-2 focus-visible:outline-none"
      >
        <span className="block h-1 w-10 rounded-full bg-paper-mute transition-colors group-hover:bg-paper group-focus-visible:bg-terracotta" />
        {caption ? (
          <span className="ms-2 font-mono text-[10px] uppercase tracking-wider text-paper-mute">
            {caption}
          </span>
        ) : null}
        {height !== "full" ? (
          <ChevronUp className="ms-1 hidden h-3 w-3 text-paper-mute group-focus-visible:block" />
        ) : null}
      </button>
      <div className="flex-1 overflow-y-auto overscroll-contain">
        {children}
      </div>
    </div>
  );
}
