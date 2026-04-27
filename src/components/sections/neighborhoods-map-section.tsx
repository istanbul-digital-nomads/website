"use client";

import dynamic from "next/dynamic";
import { Container } from "@/components/ui/container";

const IstanbulMap = dynamic(
  () =>
    import("@/components/ui/istanbul-map").then((mod) => ({
      default: mod.IstanbulMap,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 rounded-xl border border-primary-200/60 bg-[#e8e0d4] dark:border-primary-900/40 dark:bg-[#1a1612]" />
    ),
  },
);

export function NeighborhoodsMapSection() {
  return (
    <section className="border-b border-black/10 py-16 lg:py-20 dark:border-white/10">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <p className="eyebrow">Where they sit on the map</p>
            <h2 className="mt-4 max-w-md font-display text-h1 text-neutral-950 dark:text-[#f2f3f4]">
              The five neighborhoods, mapped.
            </h2>
            <p className="text-muted mt-5 max-w-md text-body-lg">
              Two on the European side, two on the Asian, and one straddling the
              Bosphorus. The ferry between them is part of the commute.
            </p>
          </div>

          <div className="relative min-h-[360px] sm:min-h-[480px] lg:min-h-[560px]">
            <IstanbulMap />
          </div>
        </div>
      </Container>
    </section>
  );
}
