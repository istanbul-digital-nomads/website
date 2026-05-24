import { getCachedTranslations } from "@/lib/i18n/cache-translations";
import type { Locale } from "@/lib/i18n/config";
import { Container } from "@/components/ui/container";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";

/**
 * Design System v2 - "The shape of a week". The brand's organising
 * metaphor (Asia base / Ferry reset / Evening table) plus an annotated
 * timeline of an ordinary working day. Times are data, kept LTR.
 */
const TIMELINE = ["t1", "t2", "t3", "t4", "t5"] as const;
const TIMES = ["06:48", "10:00", "13:00", "17:35", "22:10"] as const;

export function WeekShape({ locale }: { locale: Locale }) {
  const t = getCachedTranslations(locale, "homeV2.week");

  return (
    <section className="border-b border-ink-3 bg-ink-1 py-24 lg:py-32">
      <Container>
        <SectionEyebrow num="N° 03" label={t("eyebrow")} />

        <div className="mt-14 grid gap-16 lg:grid-cols-[1.5fr_1fr] lg:items-start">
          <h2 className="font-display text-h1 leading-none text-paper">
            <span className="italic text-terracotta-ink">{t("line1")}</span>
            <br />
            <span className="italic text-bosphorus">{t("line2")}</span>
            <br />
            <span className="italic text-gold-ink">{t("line3")}</span>
          </h2>

          <div className="pt-2">
            <p className="font-display text-lede leading-relaxed text-paper">
              {t("body1")}
            </p>
            <p className="mt-5 text-sm leading-relaxed text-paper-mute">
              {t("body2")}
            </p>

            <div className="mt-8 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2.5 border-t border-ink-3 pt-6">
              {TIMELINE.map((key, i) => (
                <div key={key} className="contents">
                  <span className="font-mono text-[10.5px] tabular-nums text-paper-faint">
                    {TIMES[i]}
                  </span>
                  <span className="text-[13.5px] leading-snug text-paper-dim">
                    {t(`timeline.${key}`)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
