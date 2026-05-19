import Image from "next/image";
import { cn } from "@/lib/utils";

// Stable hue rotation - same name always gets the same gradient stop so
// the directory and the hero map agree on a member's "color".
const HUES = [
  "#f4b860", // gold
  "#e87a5d", // rose
  "#a78bfa", // violet
  "#7dd3fc", // sky
  "#86efac", // mint
  "#fde68a", // pale gold
  "#fb923c", // orange
];

export function hueFor(seed: string | null | undefined): string {
  if (!seed) return HUES[0];
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return HUES[h % HUES.length];
}

export function initialsOf(name: string | null | undefined): string {
  if (!name) return "?";
  return name
    .split(/\s+/)
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

type AvatarProps = {
  name?: string | null;
  src?: string | null;
  size?: number;
  hue?: string;
  online?: boolean;
  className?: string;
};

/**
 * Gradient-backed avatar with optional photo + live dot. Falls back to
 * initials on a stable hue-per-name gradient when no image is provided.
 * Used by the Members directory, the cinematic hero, the Today board,
 * and anywhere else nomads need to be represented at a glance.
 */
export function Avatar({
  name,
  src,
  size = 28,
  hue,
  online = false,
  className,
}: AvatarProps) {
  const color = hue ?? hueFor(name);
  const text = initialsOf(name);
  const dot = Math.max(8, Math.round(size * 0.3));
  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full",
        className,
      )}
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${color}, #e87a5d)`,
        boxShadow:
          "0 0 0 0.5px rgba(244, 184, 96, 0.22), inset 0 0 0 0.5px rgba(255,255,255,0.12)",
      }}
      aria-hidden={!name}
    >
      {src ? (
        <Image
          src={src}
          alt={name ?? ""}
          fill
          sizes={`${size}px`}
          style={{ objectFit: "cover" }}
        />
      ) : (
        <span
          className="font-grotesk font-semibold text-deep-water"
          style={{ fontSize: size * 0.36, letterSpacing: "-0.01em" }}
        >
          {text}
        </span>
      )}
      {online && (
        <span
          className="absolute"
          style={{
            bottom: -1,
            right: -1,
            width: dot,
            height: dot,
            borderRadius: "50%",
            background: "#86efac",
            boxShadow: "0 0 0 2px #0a1a2f, 0 0 8px #86efac",
          }}
        />
      )}
    </span>
  );
}

type StackPerson = {
  name?: string | null;
  src?: string | null;
  hue?: string;
};

type AvatarStackProps = {
  people: StackPerson[];
  total?: number;
  size?: number;
  max?: number;
  className?: string;
};

/**
 * Overlapping avatar row with a "+N" tail when the visible people are
 * fewer than the total. Used in the Today board to summarise attendees.
 */
export function AvatarStack({
  people,
  total,
  size = 26,
  max = 5,
  className,
}: AvatarStackProps) {
  const shown = people.slice(0, max);
  const sum = total ?? people.length;
  const overflow = Math.max(0, sum - shown.length);
  return (
    <div className={cn("inline-flex items-center", className)}>
      {shown.map((p, i) => (
        <span
          key={i}
          style={{
            marginLeft: i === 0 ? 0 : -8,
            boxShadow: "0 0 0 2px #0a1a2f",
            borderRadius: "50%",
            zIndex: 10 - i,
          }}
        >
          <Avatar name={p.name} src={p.src} hue={p.hue} size={size} />
        </span>
      ))}
      {overflow > 0 && (
        <span
          className="inline-grid place-items-center rounded-full border font-grotesk font-semibold text-cream/70"
          style={{
            marginLeft: -8,
            width: size,
            height: size,
            background: "#13294a",
            borderColor: "rgba(246,236,217,0.10)",
            boxShadow: "0 0 0 2px #0a1a2f",
            fontSize: 10,
          }}
        >
          +{overflow}
        </span>
      )}
    </div>
  );
}
