import { getCachedTranslations } from "@/lib/i18n/cache-translations";
import type { Locale } from "@/lib/i18n/config";
import {
  type Neighborhood,
  getSpacesInNeighborhood,
} from "@/lib/neighborhoods";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";

/**
 * Design System v2 - the "at a glance" data table for a neighborhood
 * detail page. Numbers, no apology - but only real ones: rent ranges,
 * side, noise, tracked spaces, coordinates. No invented survey scores.
 */
export function HoodAtAGlance({
  neighborhood: n,
  locale,
}: {
  neighborhood: Neighborhood;
  locale: Locale;
}) {
  const tCommon = getCachedTranslations(locale, "common");
  const tDetail = getCachedTranslations(locale, "neighborhoodDetailPage");
  const tV2 = getCachedTranslations(locale, "neighborhoodsV2");

  const cells: { label: string; value: string; sub?: string; tone: string }[] =
    [
      {
        label: tV2("glance.rentUsd"),
        value: `$${n.rentUsd.low}-$${n.rentUsd.high}`,
        sub: tV2("glance.perMonth"),
        tone: "text-terracotta",
      },
      {
        label: tV2("glance.rentTl"),
        value: `₺${n.rentTl.low.toLocaleString("en-US")}-₺${n.rentTl.high.toLocaleString("en-US")}`,
        sub: tV2("glance.perMonth"),
        tone: "text-bosphorus",
      },
      {
        label: tV2("glance.side"),
        value: tCommon(n.side === "European" ? "side.european" : "side.asian"),
        tone: "text-ferry-yellow",
      },
      {
        label: tV2("glance.noise"),
        value: tDetail(`noise.${n.noise}`),
        tone: "text-moss",
      },
      {
        label: tV2("glance.spaces"),
        value: String(getSpacesInNeighborhood(n.slug).length),
        sub: tV2("glance.spacesSub"),
        tone: "text-paper",
      },
      {
        label: tV2("glance.coords"),
        value: `${n.coords[1].toFixed(3)}, ${n.coords[0].toFixed(3)}`,
        tone: "text-paper-mute",
      },
    ];

  return (
    <section className="border-b border-ink-3 bg-ink-1 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionEyebrow
          num="N° 02"
          label={tV2("glance.eyebrow")}
          kicker={tV2("glance.kicker")}
        />
        <div className="mt-10 grid border border-ink-3 sm:grid-cols-2 lg:grid-cols-3">
          {cells.map((cell, i) => (
            <div
              key={cell.label}
              className="border-ink-3 px-6 py-7 [&:not(:nth-child(3n))]:lg:border-r [&:not(:last-child)]:border-b lg:[&:nth-child(n+4)]:border-b-0"
              style={{
                borderRightWidth: i % 3 === 2 ? 0 : undefined,
              }}
            >
              <div className="font-mono text-[10.5px] uppercase tracking-wider text-paper-mute">
                {cell.label}
              </div>
              <div
                className={`mt-3 font-mono text-3xl tabular-nums ${cell.tone}`}
              >
                {cell.value}
              </div>
              {cell.sub ? (
                <div className="mt-2 font-mono text-[10px] uppercase tracking-wider text-paper-faint">
                  {cell.sub}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
