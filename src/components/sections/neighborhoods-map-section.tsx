"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
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

// MapLibre + style + worker is ~280 KB of JS. Defer the dynamic import until
// the map section is near the viewport so it doesn't compete with the rest of
// the home page's initial paint or hydration. rootMargin="400px" gives the
// chunk time to download + parse before the user scrolls in.
function LazyMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") {
      setShouldLoad(true);
      return;
    }
    const node = containerRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "400px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative min-h-[360px] sm:min-h-[480px] lg:min-h-[560px]"
    >
      {shouldLoad ? (
        <IstanbulMap />
      ) : (
        <div className="absolute inset-0 rounded-xl border border-primary-200/60 bg-[#e8e0d4] dark:border-primary-900/40 dark:bg-[#1a1612]" />
      )}
    </div>
  );
}

export function NeighborhoodsMapSection() {
  const t = useTranslations("sections.neighborhoodsMap");

  return (
    <section className="border-b border-black/10 py-16 lg:py-20 dark:border-white/10">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <p className="eyebrow">{t("eyebrow")}</p>
            <h2 className="mt-4 max-w-md font-display text-h1 text-neutral-950 dark:text-[#f2f3f4]">
              {t("title")}
            </h2>
            <p className="text-muted mt-5 max-w-md text-body-lg">
              {t("intro")}
            </p>
          </div>

          <LazyMap />
        </div>
      </Container>
    </section>
  );
}
