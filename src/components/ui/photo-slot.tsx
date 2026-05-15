import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Design System v2 photo slot. Two modes:
 *
 * 1. **Placeholder** (default, no `src`) - a tinted, grid-textured panel
 *    with an optional mono corner mark and caption describing the intended
 *    shot. Honest stand-in until real Istanbul photography is shot.
 *
 * 2. **Real photo** (pass `src` + `alt`) - renders `next/image` with the
 *    same chrome (corner mark + caption). An optional `credit` slot
 *    appears in the lower-right of the caption strip ("photographer ·
 *    location · time"). When real photos arrive, every existing
 *    `<PhotoSlot kind="..." />` call upgrades by adding `src` and `alt`
 *    - no refactor needed.
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
  src,
  alt,
  credit,
  priority,
  sizes,
  corner,
  caption,
  className,
  style,
}: {
  kind?: PhotoKind;
  /** Real image source. When set, renders next/image instead of the
   *  placeholder gradient. `alt` becomes required at the type level. */
  src?: string;
  alt?: string;
  /** Photographer credit shown in the lower-right of the caption strip
   *  when a real photo is rendered. Mono caption stays in design voice. */
  credit?: string;
  /** Pass-through to next/image for above-the-fold slots. */
  priority?: boolean;
  /** Pass-through to next/image. Defaults sensibly for grid + hero use. */
  sizes?: string;
  /** Top-left mono mark (section number, category, or short label). */
  corner?: string;
  /** Bottom caption - intended-shot description in placeholder mode, or
   *  a place/date caption in real-photo mode. */
  caption?: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const isReal = Boolean(src && alt);
  return (
    <figure
      className={cn(
        "relative overflow-hidden border border-ink-4",
        className,
      )}
      style={isReal ? style : { background: background(kind), ...style }}
    >
      {isReal ? (
        <Image
          src={src!}
          alt={alt!}
          fill
          priority={priority}
          sizes={sizes ?? "(max-width: 768px) 100vw, 50vw"}
          className="object-cover"
        />
      ) : null}
      {corner ? (
        <span className="absolute left-3 top-3 z-10 font-mono text-[10px] uppercase tracking-wider text-paper-dim">
          {corner}
        </span>
      ) : null}
      {caption || credit ? (
        <figcaption className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-3 bg-gradient-to-t from-black/85 to-transparent p-3 font-mono text-[10px] uppercase tracking-wider text-paper-dim">
          {caption ? <span>{caption}</span> : <span />}
          <span className="shrink-0 text-paper-faint">
            {isReal ? credit : "↳ photo slot"}
          </span>
        </figcaption>
      ) : null}
    </figure>
  );
}
