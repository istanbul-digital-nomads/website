import {
  Banknote,
  Compass,
  Train,
  Volume2,
  Coffee,
  Building2,
} from "lucide-react";
import { useTranslations } from "next-intl";
import {
  formatRentRange,
  getSpacesInNeighborhood,
  type Neighborhood,
} from "@/lib/neighborhoods";

interface Props {
  neighborhood: Neighborhood;
}

export function NeighborhoodStatCard({ neighborhood }: Props) {
  const tList = useTranslations("neighborhoodList");
  const tCard = useTranslations("neighborhoodGuidePage.statCard");
  const tCommon = useTranslations("common.side");
  const tNoise = useTranslations("neighborhoodDetailPage.noise");
  const spacesInNeighborhood = getSpacesInNeighborhood(neighborhood.slug);
  const cafeCount = spacesInNeighborhood.filter(
    (s) => s.type === "cafe",
  ).length;
  const coworkingCount = spacesInNeighborhood.filter(
    (s) => s.type === "coworking",
  ).length;

  // Localized prose with English fallback when a translation key is missing.
  const transportValue = tList.has(`${neighborhood.slug}.transport`)
    ? tList(`${neighborhood.slug}.transport`)
    : neighborhood.transport;

  const bestForTags: string[] = tList.has(`${neighborhood.slug}.bestFor`)
    ? // next-intl returns the raw array via `raw()` for non-string values.
      (tList.raw(`${neighborhood.slug}.bestFor`) as string[])
    : neighborhood.bestFor;

  const sideValue = tCommon(
    neighborhood.side === "European" ? "european" : "asian",
  );
  const noiseValue = tNoise(neighborhood.noise);

  const rows: Array<{ icon: React.ElementType; label: string; value: string }> =
    [
      { icon: Compass, label: tCard("side"), value: sideValue },
      {
        icon: Banknote,
        label: tCard("rent"),
        value: formatRentRange(neighborhood),
      },
      { icon: Volume2, label: tCard("noiseLevel"), value: noiseValue },
      { icon: Train, label: tCard("transport"), value: transportValue },
    ];

  if (coworkingCount > 0) {
    rows.push({
      icon: Building2,
      label: tCard("coworkingTracked"),
      value: tCard("coworkingCountTemplate", { count: coworkingCount }),
    });
  }
  if (cafeCount > 0) {
    rows.push({
      icon: Coffee,
      label: tCard("cafesTracked"),
      value: tCard("cafeCountTemplate", { count: cafeCount }),
    });
  }

  return (
    <div className="rounded-[1.75rem] border border-black/10 bg-white/55 p-6 dark:border-white/10 dark:bg-white/5">
      <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary-600 dark:text-primary-400">
        {tCard("verifiedStats")}
      </p>
      <dl className="mt-5 space-y-4">
        {rows.map(({ icon: Icon, label, value }) => (
          <div
            key={label}
            className="flex items-start gap-3 border-t border-black/5 pt-4 first:border-t-0 first:pt-0 dark:border-white/5"
          >
            <Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary-600 dark:text-primary-400" />
            <div className="min-w-0 flex-1">
              <dt className="font-mono text-[10px] uppercase tracking-[0.24em] text-neutral-500 dark:text-[#85929e]">
                {label}
              </dt>
              <dd className="mt-1 text-sm leading-6 text-[#1a1a2e] dark:text-[#f2f3f4]">
                <bdi>{value}</bdi>
              </dd>
            </div>
          </div>
        ))}
      </dl>

      <div className="mt-5 border-t border-black/5 pt-4 dark:border-white/5">
        <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-neutral-500 dark:text-[#85929e]">
          {tCard("bestFor")}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {bestForTags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-primary-500/20 bg-primary-50/60 px-3 py-1 text-xs text-primary-800 dark:border-primary-500/30 dark:bg-primary-950/30 dark:text-primary-200"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <p className="mt-5 font-mono text-[9px] uppercase tracking-[0.2em] text-neutral-400 dark:text-[#5d6d7e]">
        {tCard("footnote")}
      </p>
    </div>
  );
}
