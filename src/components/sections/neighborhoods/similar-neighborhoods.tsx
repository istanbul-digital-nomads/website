import Link from "next/link";
import { getCachedTranslations } from "@/lib/i18n/cache-translations";
import type { Locale } from "@/lib/i18n/config";
import { type Neighborhood, neighborhoods } from "@/lib/neighborhoods";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { PhotoSlot, type PhotoKind } from "@/components/ui/photo-slot";

/**
 * Design System v2 - "If you like X" closer for a neighborhood detail
 * page. Surfaces up to four other neighborhoods, same-side first.
 */
const PHOTO_BY_SIDE: Record<Neighborhood["side"], PhotoKind> = {
  Asian: "dawn",
  European: "dusk",
};

export function SimilarNeighborhoods({
  neighborhood: n,
  locale,
}: {
  neighborhood: Neighborhood;
  locale: Locale;
}) {
  const tList = getCachedTranslations(locale, "neighborhoodList");
  const tCommon = getCachedTranslations(locale, "common");
  const tV2 = getCachedTranslations(locale, "neighborhoodsV2");

  const others = [
    ...neighborhoods.filter((o) => o.slug !== n.slug && o.side === n.side),
    ...neighborhoods.filter((o) => o.slug !== n.slug && o.side !== n.side),
  ].slice(0, 4);

  return (
    <section className="border-b border-ink-3 bg-ink-1 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionEyebrow
          num="N° 04"
          label={tV2("similar.eyebrow", {
            name: tList(`${n.slug}.name`),
          })}
          kicker={tV2("similar.kicker")}
        />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {others.map((o) => {
            const sideLabel = tCommon(
              o.side === "European" ? "side.european" : "side.asian",
            );
            return (
              <Link
                key={o.slug}
                href={`/guides/neighborhoods/${o.slug}`}
                className="group"
              >
                <PhotoSlot
                  kind={PHOTO_BY_SIDE[o.side]}
                  corner={sideLabel}
                  className="h-52"
                />
                <div className="mt-3.5 flex items-baseline justify-between">
                  <h3 className="font-display text-h4 text-paper transition-colors group-hover:text-terracotta">
                    {tList(`${o.slug}.name`)}
                  </h3>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-paper-faint">
                    {sideLabel}
                  </span>
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-paper-dim">
                  {tList(`${o.slug}.oneLiner`)}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
