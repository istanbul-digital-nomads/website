import Image from "next/image";
import { getTranslations } from "next-intl/server";

// Branded route-loading state. Shown while a route's server components stream.
// Built on the design system: deep-water/cream canvas (ink-0), the logo mark
// breathing inside a soft terracotta glow, the display wordmark, and a slim
// terracotta-to-moss progress bar. Honours prefers-reduced-motion (the glow,
// breathe, and bar animations are disabled in globals.css).
export default async function Loading() {
  const t = await getTranslations("errorPages.loading");
  const tSite = await getTranslations("site");

  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-[70vh] flex-col items-center justify-center px-6 py-20 text-center"
    >
      {/* Logo mark + glow */}
      <div className="page-loader-mark relative flex h-20 w-20 items-center justify-center">
        <span className="page-loader-glow" aria-hidden />
        <Image
          src="/images/logo-light.png"
          alt=""
          width={530}
          height={680}
          priority
          aria-hidden
          className="relative block dark:hidden"
          style={{ width: 44, height: "auto" }}
        />
        <Image
          src="/images/logo-dark.png"
          alt=""
          width={542}
          height={693}
          priority
          aria-hidden
          className="relative hidden dark:block"
          style={{ width: 44, height: "auto" }}
        />
      </div>

      {/* Wordmark */}
      <p className="mt-6 font-display text-xl tracking-tight text-paper">
        {tSite("shortName")}
      </p>

      {/* Indeterminate progress bar - a segment sweeps across in reading
          direction (purposeful "working" motion, not a fill/empty pulse). */}
      <div className="page-loader-track mt-6 h-[3px] w-40 rounded-full bg-ink-3/50">
        <div className="page-loader-bar bg-gradient-to-r from-terracotta to-terracotta-dim" />
      </div>

      {/* Label */}
      <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.22em] text-paper-mute">
        {t("label")}
      </p>

      <span className="sr-only">{t("srLabel")}</span>
    </div>
  );
}
