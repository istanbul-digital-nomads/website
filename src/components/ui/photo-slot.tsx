import { cn } from "@/lib/utils";

/**
 * Design System v2 atmospheric photo placeholder. Until real Istanbul
 * photography is shot (a later phase), every image slot ships as one of
 * these - a tinted, grid-textured panel with a mono corner mark and a
 * caption describing the intended shot. A placeholder is honest; a stock
 * photo is a lie. When a real photo arrives, swap this for `next/image`.
 */

export type PhotoKind =
  | "dawn"
  | "dusk"
  | "bosphorus"
  | "interior"
  | "street"
  | "mono";

// Base diagonal gradient per kind - photos are dark, atmospheric Istanbul
// imagery in both themes, so the slot stays dark-tinted regardless of theme.
const KIND_GRADIENT: Record<PhotoKind, string> = {
  dawn: "linear-gradient(135deg, #3a2f1a, #1a1612)",
  dusk: "linear-gradient(135deg, #3a1f15, #1a1612)",
  bosphorus: "linear-gradient(135deg, #1a3550, #141a20)",
  interior: "linear-gradient(135deg, #2a221a, #141a20)",
  street: "linear-gradient(135deg, #241f1a, #141a20)",
  mono: "linear-gradient(135deg, #1c232b, #10141a)",
};

// Two faint grid overlays + the kind gradient, composited.
function background(kind: PhotoKind): string {
  return [
    "repeating-linear-gradient(90deg, rgba(244,234,215,0.04) 0 1px, transparent 1px 14px)",
    "repeating-linear-gradient(0deg, rgba(244,234,215,0.03) 0 1px, transparent 1px 14px)",
    KIND_GRADIENT[kind],
  ].join(", ");
}

export function PhotoSlot({
  kind = "mono",
  corner,
  caption,
  className,
  style,
}: {
  kind?: PhotoKind;
  /** Top-left mono mark (section number, category, or short label). */
  corner?: string;
  /** Bottom caption describing the intended shot. */
  caption?: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <figure
      className={cn(
        "relative overflow-hidden border border-ink-4",
        className,
      )}
      style={{ background: background(kind), ...style }}
    >
      {corner ? (
        <span className="absolute left-3 top-3 font-mono text-[10px] uppercase tracking-wider text-paper-dim">
          {corner}
        </span>
      ) : null}
      {caption ? (
        <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-black/85 to-transparent p-3 font-mono text-[10px] uppercase tracking-wider text-paper-dim">
          <span>{caption}</span>
          <span className="shrink-0 text-paper-faint">↳ photo slot</span>
        </figcaption>
      ) : null}
    </figure>
  );
}
