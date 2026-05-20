import { getCachedTranslations } from "@/lib/i18n/cache-translations";
import type { Locale } from "@/lib/i18n/config";
import { Search, BadgeCheck, MessageCircle } from "lucide-react";

// 3-step "how paperwork works" strip for the /paperwork directory.
// Sits under the hero, above the listings. Reassures both sides: the
// nomad ("here's how I get help") and sets the not-legal-advice
// expectation up front.

const STEP_ICONS = [Search, BadgeCheck, MessageCircle];
const STEP_KEYS = ["browse", "pick", "contact"] as const;

export function PaperworkExplainer({ locale }: { locale: Locale }) {
  const t = getCachedTranslations(locale, "howItWorks.paperwork");

  return (
    <div className="rounded-xl border border-cream/10 bg-ink-1/40 p-6 md:p-8">
      <h2 className="font-mono text-[11px] uppercase tracking-[0.18em] text-moss">
        {t("eyebrow")}
      </h2>
      <ol className="mt-5 grid gap-5 md:grid-cols-3">
        {STEP_KEYS.map((key, i) => {
          const Icon = STEP_ICONS[i];
          return (
            <li key={key} className="flex gap-3">
              <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-moss/15 text-moss">
                <Icon className="h-4.5 w-4.5" aria-hidden />
              </span>
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-cream/40">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-grotesk text-[15px] font-medium text-cream">
                    {t(`steps.${key}.title`)}
                  </h3>
                </div>
                <p className="mt-1 text-[13px] leading-relaxed text-cream/65">
                  {t(`steps.${key}.body`)}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
      <p className="mt-6 border-t border-cream/10 pt-4 text-[12px] leading-relaxed text-cream/50">
        {t("disclaimer")}
      </p>
    </div>
  );
}
