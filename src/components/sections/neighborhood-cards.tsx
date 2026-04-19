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
    <section className="border-y border-black/5 py-20 lg:py-24 dark:border-white/10">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow">Where people land</p>
          <h2 className="mt-4 text-4xl font-semibold text-neutral-950 sm:text-5xl dark:text-[#f2f3f4]">
            Five neighborhoods, one city.
          </h2>
          <p className="text-muted mt-5 text-lg leading-8">
            Most nomads end up in one of these five. Each has a photo, verified
            stats, and a detail page with the coworking and cafes we track
            there.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
                  className="group block overflow-hidden rounded-[2rem] border border-black/10 bg-white/55 transition-all hover:-translate-y-1 hover:bg-white/80 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
                >
                  <div className="relative aspect-[3/2] w-full overflow-hidden bg-primary-50/30 dark:bg-primary-950/20">
                    <Image
                      src={n.hero.src}
                      alt={n.hero.alt}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    />
                    <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-white/85 px-3 py-1.5 text-xs font-medium text-[#1a1a2e] backdrop-blur dark:bg-[#1a1d27]/85 dark:text-[#f2f3f4]">
                      <MapPin className="h-3.5 w-3.5 text-primary-600 dark:text-primary-400" />
                      {n.side} side
                    </div>
                    <div className="absolute bottom-4 right-4 rounded-full bg-[#1a1a2e]/85 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.24em] text-white backdrop-blur">
                      {formatRentRange(n)}
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-2xl font-semibold text-[#1a1a2e] dark:text-[#f2f3f4]">
                      {n.name}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-[#5d6d7e] dark:text-[#99a3ad]">
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
            Compare all five in the full guide
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>
      </Container>
    </section>
  );
}
