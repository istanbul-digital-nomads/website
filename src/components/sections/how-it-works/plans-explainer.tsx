import { getCachedTranslations } from "@/lib/i18n/cache-translations";
import type { Locale } from "@/lib/i18n/config";
import { Container } from "@/components/ui/container";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { Coins, Ticket, ShieldCheck } from "lucide-react";

// Explains the two plan classes + the escrow timeline for ticketed
// plans. Reads cold for visitors ("what's the difference?") and as a
// reassurance for buyers ("how does my money stay safe?").

export function PlansExplainer({ locale }: { locale: Locale }) {
  const t = getCachedTranslations(locale, "howItWorks.plans");

  return (
    <section className="border-b border-ink-3 bg-ink-1 py-16 lg:py-24">
      <Container>
        <SectionEyebrow num="N° 08" label={t("eyebrow")} />
        <h2 className="mt-6 max-w-3xl font-display text-h2 leading-tight text-paper">
          {t("title")}
        </h2>

        {/* Two-class comparison */}
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-ink-3 bg-ink-2/50 p-6">
            <div className="flex items-center gap-2 text-paper-mute">
              <Coins className="h-5 w-5" aria-hidden />
              <h3 className="font-mono text-[11px] uppercase tracking-wider">
                {t("budget.label")}
              </h3>
            </div>
            <p className="mt-3 font-display text-xl text-paper">
              {t("budget.title")}
            </p>
            <p className="mt-2 text-[14px] leading-relaxed text-paper-dim">
              {t("budget.body")}
            </p>
            <ul className="mt-4 space-y-1.5 text-[13px] text-paper-dim">
              <li>· {t("budget.point1")}</li>
              <li>· {t("budget.point2")}</li>
              <li>· {t("budget.point3")}</li>
            </ul>
          </div>

          <div className="rounded-xl border border-ferry-yellow/30 bg-ferry-yellow/[0.04] p-6">
            <div className="flex items-center gap-2 text-ferry-yellow">
              <Ticket className="h-5 w-5" aria-hidden />
              <h3 className="font-mono text-[11px] uppercase tracking-wider">
                {t("ticketed.label")}
              </h3>
            </div>
            <p className="mt-3 font-display text-xl text-paper">
              {t("ticketed.title")}
            </p>
            <p className="mt-2 text-[14px] leading-relaxed text-paper-dim">
              {t("ticketed.body")}
            </p>
            <ul className="mt-4 space-y-1.5 text-[13px] text-paper-dim">
              <li>· {t("ticketed.point1")}</li>
              <li>· {t("ticketed.point2")}</li>
              <li>· {t("ticketed.point3")}</li>
            </ul>
          </div>
        </div>

        {/* Escrow timeline */}
        <div className="mt-10 rounded-xl border border-ink-3 bg-ink-2/40 p-6 lg:p-8">
          <div className="flex items-center gap-2 text-moss">
            <ShieldCheck className="h-5 w-5" aria-hidden />
            <h3 className="font-mono text-[11px] uppercase tracking-wider">
              {t("escrow.label")}
            </h3>
          </div>
          <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-paper-dim">
            {t("escrow.body")}
          </p>
          <EscrowTimeline
            steps={[
              t("escrow.step1"),
              t("escrow.step2"),
              t("escrow.step3"),
              t("escrow.step4"),
            ]}
          />
        </div>
      </Container>
    </section>
  );
}

// Horizontal 4-node timeline: pay -> held in escrow -> plan happens ->
// guide paid after 7 days. SVG track with dots; labels below. Stacks
// to a vertical list on small screens.
function EscrowTimeline({ steps }: { steps: string[] }) {
  return (
    <div className="mt-6">
      {/* Desktop track */}
      <div className="hidden md:block">
        <svg
          viewBox="0 0 800 40"
          className="w-full"
          role="presentation"
          aria-hidden
        >
          <line
            x1="40"
            y1="20"
            x2="760"
            y2="20"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-ink-4"
          />
          {[40, 280, 520, 760].map((cx, i) => (
            <g key={cx}>
              <circle
                cx={cx}
                cy="20"
                r="7"
                className={i === 3 ? "fill-moss" : "fill-ferry-yellow"}
              />
              <circle cx={cx} cy="20" r="12" className="fill-none" />
            </g>
          ))}
        </svg>
        <div className="mt-3 grid grid-cols-4 gap-2">
          {steps.map((s, i) => (
            <div key={i} className="text-center">
              <span className="font-mono text-[10px] uppercase tracking-wider text-paper-faint">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="mt-1 text-[12px] leading-snug text-paper-dim">
                {s}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile vertical */}
      <ol className="mt-4 space-y-3 md:hidden">
        {steps.map((s, i) => (
          <li key={i} className="flex gap-3">
            <span
              className={`mt-0.5 inline-block h-2.5 w-2.5 shrink-0 rounded-full ${
                i === 3 ? "bg-moss" : "bg-ferry-yellow"
              }`}
              aria-hidden
            />
            <p className="text-[13px] leading-snug text-paper-dim">{s}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
