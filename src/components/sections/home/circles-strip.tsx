import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getCachedTranslations } from "@/lib/i18n/cache-translations";
import type { Locale } from "@/lib/i18n/config";
import { circles, type CircleAccent } from "@/lib/circles";
import { Container } from "@/components/ui/container";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";

// Static accent -> Tailwind class maps so the content scanner sees literals.
const ACCENT_RING: Record<CircleAccent, string> = {
  terracotta: "border-terracotta",
  bosphorus: "border-bosphorus",
  "ferry-yellow": "border-ferry-yellow",
  moss: "border-moss",
  "terracotta-dim": "border-terracotta-dim",
  "bosphorus-dim": "border-bosphorus-dim",
};
const ACCENT_TEXT: Record<CircleAccent, string> = {
  terracotta: "text-terracotta",
  bosphorus: "text-bosphorus",
  "ferry-yellow": "text-ferry-yellow",
  moss: "text-moss",
  "terracotta-dim": "text-terracotta-dim",
  "bosphorus-dim": "text-bosphorus-dim",
};

/**
 * Design System v2 - "Six smaller rooms". The six circles inside the
 * Telegram community. Real data from src/lib/circles.ts.
 */
export function CirclesStrip({ locale }: { locale: Locale }) {
  const t = getCachedTranslations(locale, "homeV2.circles");
  const tList = getCachedTranslations(locale, "circlesV2");

  return (
    <section className="border-b border-ink-3 bg-ink-1 py-24 lg:py-32">
      <Container>
        <SectionEyebrow num="N° 08" label={t("eyebrow")} />

        <h2 className="mt-8 max-w-3xl font-display text-display-lg leading-tight text-paper">
          {t("title")}{" "}
          <span className="italic text-terracotta">{t("titleItalic")}</span>
        </h2>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {circles.map((circle) => (
            <Link
              key={circle.slug}
              href={`/circles/${circle.slug}`}
              className="group flex min-h-[12rem] flex-col rounded-md border border-ink-3 bg-ink-2 p-5 transition-[border-color,background-color,transform] duration-fast hover:-translate-y-0.5 hover:border-ink-5 hover:bg-ink-2/80"
            >
              <span
                className={`h-3 w-3 rounded-full border-2 ${ACCENT_RING[circle.accent]}`}
              />
              <h3 className="mt-5 font-display text-h4 text-paper">
                {tList(`names.${circle.slug}`)}
              </h3>
              <p className="mt-1.5 flex-1 text-xs leading-relaxed text-paper-dim">
                {tList(`blurbs.${circle.slug}`)}
              </p>
              <span
                className={`mt-3 inline-flex items-center gap-1.5 text-xs ${ACCENT_TEXT[circle.accent]}`}
              >
                {t("open")}
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-ink-3 pt-6">
          <p className="max-w-xl text-sm leading-relaxed text-paper-mute">
            {t("footnote")}
          </p>
          <Link
            href="/circles"
            className="group inline-flex items-center gap-1.5 border-b border-terracotta pb-0.5 text-sm text-terracotta"
          >
            {t("seeAll")}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
