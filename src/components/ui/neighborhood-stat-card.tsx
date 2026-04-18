import {
  Banknote,
  Compass,
  Train,
  Volume2,
  Coffee,
  Building2,
} from "lucide-react";
import {
  formatRentRange,
  getSpacesInNeighborhood,
  type Neighborhood,
} from "@/lib/neighborhoods";

interface Props {
  neighborhood: Neighborhood;
}

export function NeighborhoodStatCard({ neighborhood }: Props) {
  const spacesInNeighborhood = getSpacesInNeighborhood(neighborhood.slug);
  const cafeCount = spacesInNeighborhood.filter(
    (s) => s.type === "cafe",
  ).length;
  const coworkingCount = spacesInNeighborhood.filter(
    (s) => s.type === "coworking",
  ).length;

  const rows: Array<{ icon: React.ElementType; label: string; value: string }> =
    [
      {
        icon: Compass,
        label: "Side",
        value: `${neighborhood.side} side`,
      },
      {
        icon: Banknote,
        label: "Furnished 1BR rent",
        value: formatRentRange(neighborhood),
      },
      {
        icon: Volume2,
        label: "Noise level",
        value: neighborhood.noise,
      },
      {
        icon: Train,
        label: "Transport",
        value: neighborhood.transport,
      },
    ];

  if (coworkingCount > 0) {
    rows.push({
      icon: Building2,
      label: "Coworking tracked",
      value: `${coworkingCount} ${coworkingCount === 1 ? "space" : "spaces"}`,
    });
  }
  if (cafeCount > 0) {
    rows.push({
      icon: Coffee,
      label: "Cafes tracked",
      value: `${cafeCount} ${cafeCount === 1 ? "cafe" : "cafes"}`,
    });
  }

  return (
    <div className="rounded-[1.75rem] border border-black/10 bg-white/55 p-6 dark:border-white/10 dark:bg-white/5">
      <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary-600 dark:text-primary-400">
        Verified stats
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
                {value}
              </dd>
            </div>
          </div>
        ))}
      </dl>

      <div className="mt-5 border-t border-black/5 pt-4 dark:border-white/5">
        <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-neutral-500 dark:text-[#85929e]">
          Best for
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {neighborhood.bestFor.map((tag) => (
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
        Rent from guides/neighborhoods. Space counts live from spaces.ts.
      </p>
    </div>
  );
}
