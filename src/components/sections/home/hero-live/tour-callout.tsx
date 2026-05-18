"use client";

import { useTranslations } from "next-intl";
import { HERO_TOUR } from "@/lib/hero-data";

type Props = { stopIdx: number };

export function TourCallout({ stopIdx }: Props) {
  const t = useTranslations("home.heroLive");
  const stop = HERO_TOUR[stopIdx];
  const labelKey = stop.id ?? "intro";

  return (
    <div
      className="pointer-events-none absolute right-4 top-24 z-[1200] hidden w-[280px] rounded-xl border border-gold/30 bg-deep-water/80 p-4 backdrop-blur-md md:block"
    >
      <div className="mb-1.5 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-gold/80">
        <span
          className="hero-live-pip inline-block h-1.5 w-1.5 rounded-full bg-moss"
          style={{ boxShadow: "0 0 8px rgb(134, 239, 172)" }}
        />
        {t("nowLive")}
      </div>
      <div
        key={stopIdx}
        className="hero-callout-in font-editorial italic text-gold"
        style={{ fontSize: 28, lineHeight: 1.05, marginBottom: 4 }}
      >
        {t(`tour.${labelKey}.label`)}
      </div>
      <div
        key={`s-${stopIdx}`}
        className="hero-callout-in text-[12.5px] text-cream/70"
      >
        {t(`tour.${labelKey}.sub`)}
      </div>
      <div className="mt-3 flex gap-1">
        {HERO_TOUR.map((_, i) => (
          <div
            key={i}
            className="h-0.5 flex-1 rounded-sm transition-colors duration-400"
            style={{
              background:
                i === stopIdx ? "rgb(244 184 96)" : "rgba(244, 184, 96, 0.18)",
            }}
          />
        ))}
      </div>
    </div>
  );
}
