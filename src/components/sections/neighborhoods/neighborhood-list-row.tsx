import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getCachedTranslations } from "@/lib/i18n/cache-translations";
import type { Locale } from "@/lib/i18n/config";
import {
  type Neighborhood,
  formatRentRange,
  getSpacesInNeighborhood,
} from "@/lib/neighborhoods";
import { getNeighborhoodPhotoSet } from "@/lib/editorial-photos";
import { PhotoSlot, type PhotoKind } from "@/components/ui/photo-slot";

/**
 * Design System v2 - one editorial row in the neighborhoods list. The row
 * is the unit, not a card: a mono index number, a photo slot, the name +
 * blurb, and a four-cell data grid. Every value is real (rent, side,
 * noise, tracked spaces) - no invented scores.
 */
const PHOTO_BY_SIDE: Record<Neighborhood["side"], PhotoKind> = {
  Asian: "dawn",
  European: "dusk",
};

export function NeighborhoodListRow({
  neighborhood: n,
  locale,
  num,
}: {
  neighborhood: Neighborhood;
  locale: Locale;
  num: number;
}) {
  const tList = getCachedTranslations(locale, "neighborhoodList");
  const tCommon = getCachedTranslations(locale, "common");
  const tDetail = getCachedTranslations(locale, "neighborhoodDetailPage");
  const tV2 = getCachedTranslations(locale, "neighborhoodsV2");

  const name = tList(`${n.slug}.name`);
  const sideLabel = tCommon(
    n.side === "European" ? "side.european" : "side.asian",
  );
  const spaceCount = getSpacesInNeighborhood(n.slug).length;
  const photos = getNeighborhoodPhotoSet(n);

  const cells: [string, string][] = [
    [tV2("row.rent"), formatRentRange(n)],
    [tV2("row.side"), sideLabel],
    [tV2("row.noise"), tDetail(`noise.${n.noise}`)],
    [tV2("row.spaces"), String(spaceCount)],
  ];

  return (
    <Link
      href={`/guides/neighborhoods/${n.slug}`}
      className="group grid items-center gap-6 border-b border-ink-3 py-10 transition-colors hover:bg-ink-2 lg:grid-cols-[auto_1.4fr_2fr_1fr] lg:gap-12"
    >
      <div className="font-mono text-4xl tabular-nums text-paper-faint lg:text-5xl">
        {String(num).padStart(2, "0")}
      </div>

      <PhotoSlot
        kind={PHOTO_BY_SIDE[n.side]}
        src={photos.hero.src}
        alt={photos.hero.alt}
        credit={photos.hero.credit}
        objectPosition={photos.hero.objectPosition}
        corner={name}
        caption={`${name} · ${sideLabel}`}
        className="h-44"
      />

      <div>
        <div className="flex flex-wrap items-baseline gap-3">
          <h3 className="font-display text-h2 leading-none text-paper">
            {name}
          </h3>
          <span className="h-1.5 w-1.5 rounded-full bg-terracotta" />
          <span className="font-mono text-[11px] uppercase tracking-wider text-paper-mute">
            {sideLabel}
          </span>
        </div>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-paper-dim">
          {tList(`${n.slug}.oneLiner`)}
        </p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {n.badges.slice(0, 3).map((badgeKey) => (
            <span
              key={badgeKey}
              className="border border-ink-4 px-2 py-1 font-mono text-[10px] uppercase tracking-wide text-paper-mute"
            >
              {tList(`${n.slug}.badges.${badgeKey}`)}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
        {cells.map(([label, value]) => (
          <div key={label} className="border-t border-ink-3 py-2.5">
            <div className="font-mono text-[9.5px] uppercase tracking-wider text-paper-faint">
              {label}
            </div>
            <div className="mt-1 font-mono text-base tabular-nums text-paper">
              {value}
            </div>
          </div>
        ))}
        <div className="col-span-2 mt-3">
          <span className="inline-flex items-center gap-1.5 border-b border-terracotta pb-0.5 text-sm text-terracotta">
            {tV2("row.open", { name })}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
