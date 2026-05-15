/**
 * Design System v2 custom marks - small hand-drawn SVG atoms. Not Lucide
 * icons; these are brand glyphs (the ferry, the Bosphorus wave).
 */

/** A side-view ferry, bow pointing right. Used in the moving Bosphorus
 *  header strip. Larger viewBox + smooth bow curve so it renders crisply
 *  at small display sizes (~30px wide) instead of the previous 20x12 SVG,
 *  which had stair-stepped diagonals. */
export function FerryMark({
  className,
  width = 30,
  height = 18,
}: {
  className?: string;
  width?: number;
  height?: number;
}) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 60 36"
      className={className}
      aria-hidden="true"
      fill="currentColor"
      shapeRendering="geometricPrecision"
    >
      {/* Hull: flat stern on the left, curved bow on the right */}
      <path d="M3 23 L48 23 Q55 23 57 28 L57 31 Q57 33 55 33 L5 33 Q3 33 3 31 Z" />
      {/* Cabin / passenger deck */}
      <rect x="9" y="13" width="36" height="10" rx="1.5" />
      {/* Funnel */}
      <rect x="33" y="6" width="4" height="7" rx="0.5" />
      {/* Mast */}
      <rect x="18" y="3" width="1.5" height="10" />
    </svg>
  );
}

/** A small Bosphorus ink wave. Decorative section/footer mark. */
export function WaveMark({
  className,
  width = 36,
  height = 8,
}: {
  className?: string;
  width?: number;
  height?: number;
}) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 36 8"
      className={className}
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    >
      <path d="M1 5 C 4 1, 8 1, 11 5 S 18 9, 21 5 S 28 1, 31 5 S 35 7, 35 5" />
    </svg>
  );
}

/** The Istanbul Nomads logo mark - a ferry-compass roundel. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={`relative grid h-7 w-7 place-items-center rounded-full border border-paper ${className ?? ""}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-terracotta" />
      <span className="absolute inset-0 rounded-full border-t border-paper [transform:rotate(45deg)]" />
    </span>
  );
}
