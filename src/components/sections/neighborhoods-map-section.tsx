"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { Container } from "@/components/ui/container";

const IstanbulMap = dynamic(
  () =>
    import("@/components/ui/istanbul-map").then((mod) => ({
      default: mod.IstanbulMap,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 rounded-[2.3rem] border border-primary-200/60 bg-[#e8e0d4] dark:border-primary-900/40 dark:bg-[#1a1d27]" />
    ),
  },
);

export function NeighborhoodsMapSection() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "400px 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="border-b border-black/5 py-16 lg:py-24 dark:border-white/10">
      <Container>
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <p className="eyebrow">Where they sit on the map</p>
          <h2 className="mt-4 text-4xl font-semibold text-neutral-950 sm:text-5xl dark:text-[#f2f3f4]">
            The five neighborhoods, mapped.
          </h2>
          <p className="text-muted mt-5 text-lg leading-8">
            Two on the European side, two on the Asian, and one straddling the
            Bosphorus. The ferry between them is part of the commute.
          </p>
        </div>

        <div
          ref={ref}
          className="relative min-h-[380px] sm:min-h-[520px] lg:min-h-[620px]"
        >
          {inView && <IstanbulMap />}
        </div>
      </Container>
    </section>
  );
}
