import Link from "next/link";
import type { Circle, CircleAccent } from "@/lib/circles";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";

// Static accent -> Tailwind class maps so the content scanner sees literals.
// Mirrors the maps on the circles page; kept local so this section is
// self-contained and reusable.
const ACCENT_RING: Record<CircleAccent, string> = {
  terracotta: "border-terracotta",
  bosphorus: "border-bosphorus",
  "ferry-yellow": "border-ferry-yellow",
  moss: "border-moss",
  "terracotta-dim": "border-terracotta-dim",
  "bosphorus-dim": "border-bosphorus-dim",
};
const ACCENT_TEXT: Record<CircleAccent, string> = {
  terracotta: "text-terracotta-ink",
  bosphorus: "text-bosphorus",
  "ferry-yellow": "text-gold-ink",
  moss: "text-moss-ink",
  "terracotta-dim": "text-terracotta-ink",
  "bosphorus-dim": "text-bosphorus-dim",
};

/** Resolved, render-ready label for one circle (translation or fallback). */
export interface CircleCardCopy {
  name: string;
  blurb: string;
}

/**
 * One category group on the circles discovery page: an eyebrow with the group
 * name + blurb, then the circle cards in the same card design as the rest of
 * the page. `copyFor` resolves the display name/blurb for a circle - the page
 * uses translations for the original six and falls back to the static
 * `Circle` fields for circles that don't have translation keys yet.
 */
export function CircleCategorySection({
  num,
  categoryName,
  categoryBlurb,
  circles,
  copyFor,
  openLabel,
}: {
  num: string;
  categoryName: string;
  categoryBlurb: string;
  circles: Circle[];
  copyFor: (circle: Circle) => CircleCardCopy;
  openLabel: string;
}) {
  if (circles.length === 0) return null;

  return (
    <div className="mt-14">
      <SectionEyebrow num={num} label={categoryName} />
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-paper-mute">
        {categoryBlurb}
      </p>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {circles.map((circle) => {
          const copy = copyFor(circle);
          return (
            <Link
              key={circle.slug}
              href={`/circles/${circle.slug}`}
              className="group flex min-h-[13rem] flex-col border border-ink-3 bg-ink-2 p-6 transition-colors duration-fast hover:border-ink-5"
            >
              <span
                className={`h-3.5 w-3.5 rounded-full border-2 ${ACCENT_RING[circle.accent]}`}
              />
              <h3 className="mt-6 font-display text-h3 text-paper">
                {copy.name}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-paper-dim">
                {copy.blurb}
              </p>
              <span
                className={`mt-4 inline-flex items-center gap-1.5 text-sm ${ACCENT_TEXT[circle.accent]}`}
              >
                {openLabel} <span className="inline-dir-arrow" aria-hidden />
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
