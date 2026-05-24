import { getCachedTranslations } from "@/lib/i18n/cache-translations";
import type { Locale } from "@/lib/i18n/config";
import { Container } from "@/components/ui/container";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { NewsletterForm } from "@/components/sections/newsletter-form";

/**
 * Design System v2 - "The Sunday letter". The newsletter cadence, with the
 * existing signup form. No fabricated issue content - just an honest note
 * about what lands in the inbox.
 */
export function SundayLetterPreview({ locale }: { locale: Locale }) {
  const t = getCachedTranslations(locale, "homeV2.letter");

  return (
    <section className="border-b border-ink-3 bg-ink-1 py-24 lg:py-32">
      <Container>
        <div className="grid gap-16 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <div>
            <SectionEyebrow num="N° 07" label={t("eyebrow")} />
            <h2 className="mt-8 font-display text-h1 leading-tight text-paper">
              {t("title")}
              <br />
              <span className="italic text-terracotta-ink">
                {t("titleItalic")}
              </span>
            </h2>
            <p className="mt-6 max-w-xl text-lede leading-relaxed text-paper-dim">
              {t("body")}
            </p>
            <div className="mt-8 max-w-md">
              <NewsletterForm variant="footer" />
            </div>
          </div>

          <div className="border border-ink-3 bg-ink-2 p-8">
            <div className="flex items-baseline justify-between border-b border-ink-3 pb-4 font-mono text-[10px] uppercase tracking-wider text-paper-faint">
              <span>{t("cardEyebrow")}</span>
              <span>Sun · 09:00</span>
            </div>
            <ul className="mt-5 space-y-4">
              {(["item1", "item2", "item3"] as const).map((key) => (
                <li key={key} className="flex gap-3">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-terracotta" />
                  <span className="text-sm leading-relaxed text-paper-dim">
                    {t(`card.${key}`)}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-6 border-t border-ink-3 pt-4 font-mono text-[10px] uppercase tracking-wider text-paper-faint">
              {t("cardFoot")}
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
