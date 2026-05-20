import { Fragment } from "react";
import { getCachedTranslations } from "@/lib/i18n/cache-translations";
import type { Locale } from "@/lib/i18n/config";
import { Container } from "@/components/ui/container";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import {
  MapPin,
  UserPlus,
  CalendarDays,
  Handshake,
  RotateCcw,
} from "lucide-react";

// "The Loop" - the canonical community cycle from PRODUCT.md §4.
// Diagram-heavy: 5 numbered step cards connected by SVG arrows, with
// a loop-back curve that conveys "every morning, again". Horizontal
// rail on desktop, vertical timeline on mobile. RTL-safe (the flex
// direction + arrow rotation flip with `dir`).

const STEP_ICONS = [MapPin, UserPlus, CalendarDays, Handshake, RotateCcw];
const STEP_KEYS = ["land", "join", "today", "meet", "repeat"] as const;
const STEP_TONE = [
  "text-sky-400",
  "text-ferry-yellow",
  "text-gold",
  "text-terracotta",
  "text-moss",
];

export function TheLoop({ locale }: { locale: Locale }) {
  const t = getCachedTranslations(locale, "howItWorks.loop");

  return (
    <section className="border-b border-ink-3 bg-ink-1 py-20 lg:py-28">
      <Container>
        <SectionEyebrow num="N° 02" label={t("eyebrow")} />
        <h2 className="mt-6 max-w-3xl font-display text-h2 leading-tight text-paper">
          {t("title")}{" "}
          <span className="italic text-gold">{t("titleAccent")}</span>
        </h2>
        <p className="mt-5 max-w-2xl text-lede leading-relaxed text-paper-dim">
          {t("lede")}
        </p>

        {/* Desktop rail */}
        <ol className="mt-14 hidden gap-3 lg:grid lg:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr_auto_1fr] lg:items-stretch">
          {STEP_KEYS.map((key, i) => {
            const Icon = STEP_ICONS[i];
            return (
              <Fragment key={key}>
                <li className="flex flex-col rounded-xl border border-ink-3 bg-ink-2/50 p-5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] uppercase tracking-wider text-paper-faint">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <Icon className={`h-5 w-5 ${STEP_TONE[i]}`} aria-hidden />
                  </div>
                  <h3 className="mt-4 font-display text-lg leading-tight text-paper">
                    {t(`steps.${key}.title`)}
                  </h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-paper-dim">
                    {t(`steps.${key}.body`)}
                  </p>
                </li>
                {i < STEP_KEYS.length - 1 ? (
                  <li
                    aria-hidden
                    className="flex items-center justify-center text-ink-4"
                  >
                    <LoopArrow />
                  </li>
                ) : null}
              </Fragment>
            );
          })}
        </ol>

        {/* "every morning, again" loop-back caption */}
        <p className="mt-6 hidden items-center justify-center gap-2 font-mono text-[11px] uppercase tracking-wider text-moss lg:flex">
          <RotateCcw className="h-3.5 w-3.5" aria-hidden />
          {t("loopBack")}
        </p>

        {/* Mobile vertical timeline */}
        <ol className="mt-12 space-y-4 lg:hidden">
          {STEP_KEYS.map((key, i) => {
            const Icon = STEP_ICONS[i];
            return (
              <li
                key={key}
                className="flex gap-4 rounded-xl border border-ink-3 bg-ink-2/50 p-4"
              >
                <div className="flex flex-col items-center">
                  <Icon className={`h-5 w-5 ${STEP_TONE[i]}`} aria-hidden />
                  {i < STEP_KEYS.length - 1 ? (
                    <span className="mt-2 w-px flex-1 bg-ink-3" aria-hidden />
                  ) : null}
                </div>
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-paper-faint">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-display text-base leading-tight text-paper">
                    {t(`steps.${key}.title`)}
                  </h3>
                  <p className="mt-1 text-[13px] leading-relaxed text-paper-dim">
                    {t(`steps.${key}.body`)}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </Container>
    </section>
  );
}

// Small directional connector. Flips horizontally under RTL via the
// parent's `dir` (scaleX on the [dir=rtl] selector in globals).
function LoopArrow() {
  return (
    <svg
      width="28"
      height="16"
      viewBox="0 0 28 16"
      fill="none"
      className="rtl-flip-x"
    >
      <path
        d="M1 8h24m0 0l-6-6m6 6l-6 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
