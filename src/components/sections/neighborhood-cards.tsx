import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import {
  neighborhoods,
  formatRentRange,
  getSpacesInNeighborhood,
} from "@/lib/neighborhoods";

export function NeighborhoodCardsSection() {
  return (
    <section
      id="neighborhoods"
      className="scroll-mt-24 border-y border-black/10 py-16 lg:py-20 dark:border-white/10"
    >
      <Container>
        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <p className="eyebrow">Where people land</p>
          <div>
            <h2 className="font-display text-h1 text-neutral-950 dark:text-[#f2f3f4]">
              Ten neighborhoods, one city.
            </h2>
            <p className="text-muted mt-4 max-w-2xl text-body-lg">
              Start with the ten full guides, then use the broader comparison to
              sense-check the rest of the city before you book.
            </p>
          </div>
        </div>

        <div className="-mx-4 mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3 [&::-webkit-scrollbar]:hidden">
          {neighborhoods.map((n, idx) => {
            const count = getSpacesInNeighborhood(n.slug).length;
            return (
              <Reveal
                key={n.slug}
                delay={Math.min(idx, 4) as 0 | 1 | 2 | 3 | 4}
              >
                <Link
                  href={`/guides/neighborhoods/${n.slug}`}
                  prefetch
                  className="group block min-w-[82vw] snap-start overflow-hidden rounded-md border border-black/10 bg-white/50 transition-all hover:-translate-y-0.5 hover:border-primary-500/35 hover:bg-white/80 dark:border-white/10 dark:bg-white/5 dark:hover:border-primary-400/35 dark:hover:bg-white/10 sm:min-w-0"
                >
                  <div className="relative aspect-[3/2] w-full overflow-hidden bg-primary-50/30 dark:bg-primary-950/20">
                    <Image
                      src={n.hero.src}
                      alt={n.hero.alt}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 420px"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    />
                    <div className="absolute left-4 top-4 flex items-center gap-2 rounded-md bg-white/85 px-3 py-1.5 text-xs font-medium text-[#1a1a2e] backdrop-blur dark:bg-[#1a1612]/85 dark:text-[#f2f3f4]">
                      <MapPin className="h-3.5 w-3.5 text-primary-600 dark:text-primary-400" />
                      {n.side} side
                    </div>
                    <div className="absolute bottom-4 right-4 rounded-md bg-[#1a1a2e]/85 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.24em] text-white backdrop-blur">
                      {formatRentRange(n)}
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="font-display text-2xl font-extrabold text-[#1a1a2e] dark:text-[#f2f3f4]">
                      {n.name}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-[#5d6d7e] dark:text-[#b7aaa0]">
                      {n.oneLiner}
                    </p>

                    <div className="mt-5 flex items-center justify-between border-t border-black/5 pt-4 dark:border-white/5">
                      <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-neutral-500 dark:text-[#85929e]">
                        {count > 0
                          ? `${count} ${count === 1 ? "space" : "spaces"} tracked`
                          : "Coworking nearby"}
                      </span>
                      <span className="inline-flex items-center gap-1 text-sm font-medium text-primary-700 transition-colors group-hover:text-primary-600 dark:text-primary-300 dark:group-hover:text-primary-200">
                        Explore
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={4} className="mt-10 flex justify-center">
          <Link
            href="/guides/neighborhoods"
            className="inline-flex items-center gap-2 text-sm font-medium text-neutral-950 transition-colors hover:text-primary-600 dark:text-[#f2f3f4] dark:hover:text-primary-400"
          >
            Compare all ten in the full guide
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>
      </Container>
    </section>
  );
}
