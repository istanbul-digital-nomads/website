/**
 * Design System v2 custom marks - small hand-drawn SVG atoms. Not Lucide
 * icons; these are brand glyphs (the ferry, the Bosphorus wave).
 */

/** A simple side-view ferry. Used in the moving Bosphorus header strip. */
export function FerryMark({
  className,
  width = 20,
  height = 12,
}: {
  className?: string;
  width?: number;
  height?: number;
}) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 20 12"
      className={className}
      aria-hidden="true"
      fill="currentColor"
    >
      <path d="M1 8 L19 8 L17 11 L3 11 Z" />
      <rect x="6" y="3" width="9" height="4" />
      <rect x="9" y="0" width="2" height="3" />
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
