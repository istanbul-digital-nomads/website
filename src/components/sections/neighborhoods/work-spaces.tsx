import Link from "next/link";
import { getCachedTranslations } from "@/lib/i18n/cache-translations";
import type { Locale } from "@/lib/i18n/config";
import {
  type Neighborhood,
  getSpacesInNeighborhood,
} from "@/lib/neighborhoods";
import { computeNomadScore } from "@/lib/spaces";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";

/**
 * Design System v2 - "Where to work" in a neighborhood. The verified
 * coworking spaces and cafes from src/lib/spaces.ts, restyled to the new
 * tokens. Scores, wifi, and price come straight off the (sourced) data -
 * fields stay blank when unverified rather than guessed.
 */
export function WorkSpaces({
  neighborhood: n,
  locale,
}: {
  neighborhood: Neighborhood;
  locale: Locale;
}) {
  const tSpaces = getCachedTranslations(locale, "spacesList");
  const tV2 = getCachedTranslations(locale, "neighborhoodsV2");

  const here = getSpacesInNeighborhood(n.slug);
  if (here.length === 0) return null;

  const coworking = here.filter((s) => s.type === "coworking");
  const cafes = here.filter((s) => s.type === "cafe");

  const describe = (id: string, fallback: string) =>
    tSpaces.has(`${id}.description`) ? tSpaces(`${id}.description`) : fallback;

  return (
    <section className="border-b border-ink-3 bg-ink-1 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionEyebrow num="N° 03" label={tV2("work.eyebrow")} />
          <Link
            href="/spaces"
            className="inline-flex items-center gap-1.5 border-b border-terracotta pb-0.5 text-sm text-terracotta"
          >
            {tV2("work.allSpaces")}{" "}
            <span className="inline-dir-arrow" aria-hidden />
          </Link>
        </div>

        <h2 className="mt-8 max-w-3xl font-display text-display-lg leading-tight text-paper">
          {tV2("work.title")}
        </h2>

        {coworking.length > 0 ? (
          <>
            <h3 className="mt-12 font-mono text-[11px] uppercase tracking-wider text-terracotta">
              {tV2("work.coworking")}
            </h3>
            <div className="mt-4 grid gap-px border border-ink-4 bg-ink-4 md:grid-cols-2">
              {coworking.map((s) => {
                const score = computeNomadScore(s.nomad_score);
                return (
                  <div key={s.id} className="bg-ink-2 p-6">
                    <div className="flex items-baseline justify-between gap-3">
                      <h4 className="font-display text-h4 text-paper">
                        {s.name}
                      </h4>
                      {score !== null ? (
                        <span className="font-mono text-sm tabular-nums text-terracotta">
                          {score.toFixed(1)}
                          <span className="text-paper-faint">/5</span>
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-2.5 text-sm leading-relaxed text-paper-dim">
                      {describe(s.id, s.description)}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 border-t border-ink-3 pt-3 font-mono text-[10px] uppercase tracking-wider text-paper-faint">
                      {s.wifi_speed ? <span>wifi · {s.wifi_speed}</span> : null}
                      {s.price_range ? <span>{s.price_range}</span> : null}
                      <span>{s.neighborhood}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : null}

        {cafes.length > 0 ? (
          <>
            <h3 className="mt-12 font-mono text-[11px] uppercase tracking-wider text-terracotta">
              {tV2("work.cafes")}
            </h3>
            <div className="mt-4 grid gap-px border border-ink-4 bg-ink-4 md:grid-cols-2 lg:grid-cols-3">
              {cafes.map((s) => {
                const score = computeNomadScore(s.nomad_score);
                return (
                  <div key={s.id} className="bg-ink-2 p-6">
                    <div className="flex items-baseline justify-between gap-3">
                      <h4 className="font-display text-h4 text-paper">
                        {s.name}
                      </h4>
                      {score !== null ? (
                        <span className="font-mono text-sm tabular-nums text-terracotta">
                          {score.toFixed(1)}
                          <span className="text-paper-faint">/5</span>
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-2.5 text-sm leading-relaxed text-paper-dim">
                      {describe(s.id, s.description)}
                    </p>
                    {s.laptop_friendly ? (
                      <div className="mt-4 border-t border-ink-3 pt-3 font-mono text-[10px] uppercase tracking-wider text-paper-faint">
                        ↳ {tV2("work.laptopReady")}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </>
        ) : null}
      </div>
    </section>
  );
}
