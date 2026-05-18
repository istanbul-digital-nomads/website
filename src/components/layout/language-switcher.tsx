"use client";

import { useLocale, useTranslations } from "next-intl";
import { useState, useRef, useEffect, type CSSProperties } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { ChevronDown, Globe } from "lucide-react";
import {
  isRtl,
  locales,
  localeNames,
  defaultLocale,
  type Locale,
} from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

const headerControlStyle = {
  height: 32,
  fontSize: 11,
  lineHeight: "16px",
} satisfies CSSProperties;

export function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const rtl = isRtl(locale);
  const t = useTranslations("languageSwitcher");
  const browserPathname = usePathname();
  const browserSearch = useSearchParams();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Build the target URL ourselves. next-intl's router.replace with locale
  // overrides was no-op'ing when switching to the default locale from a
  // non-default URL under localePrefix: "as-needed", so we construct the
  // pathname explicitly and trigger a hard navigation that's guaranteed to
  // pick up the new locale's cookie and middleware rewrite.
  function buildHref(target: Locale): string {
    const base = browserPathname || "/";
    // Strip an existing locale prefix if present so we don't double-prefix.
    let stripped = base;
    for (const l of locales) {
      if (l === defaultLocale) continue;
      if (base === `/${l}` || base.startsWith(`/${l}/`)) {
        stripped = base.slice(`/${l}`.length) || "/";
        break;
      }
    }
    const path =
      target === defaultLocale
        ? stripped
        : `/${target}${stripped === "/" ? "" : stripped}`;
    const qs = browserSearch?.toString();
    return qs ? `${path}?${qs}` : path;
  }

  function switchLocale(target: Locale) {
    setOpen(false);
    if (target === locale) return;
    // Persist the choice the same way next-intl's middleware would, so the
    // next visit lands on the user's locale even from a non-prefixed URL.
    document.cookie = `NEXT_LOCALE=${target}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
    window.location.href = buildHref(target);
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="header-control inline-flex h-8 items-center justify-center gap-1 whitespace-nowrap rounded-full border border-ink-3/70 bg-ink-1/50 px-2.5 text-[11px] font-medium uppercase tracking-wider text-paper-mute transition-all duration-fast hover:border-ink-4 hover:bg-ink-2 hover:text-paper"
        title={t("label")}
        aria-haspopup="listbox"
        aria-expanded={open}
        style={headerControlStyle}
      >
        <Globe className="h-3 w-3" aria-hidden="true" />
        <span className="sr-only">{t("label")}:</span>
        <span>{locale}</span>
        <ChevronDown
          className={cn(
            "h-2.5 w-2.5 transition-transform duration-200",
            open && "rotate-180",
          )}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute end-0 top-full z-50 mt-2 w-40 overflow-hidden rounded-xl border border-ink-3 bg-ink-1/95 p-1.5 shadow-[0_20px_48px_rgba(0,0,0,0.45)] backdrop-blur-xl"
          dir={rtl ? "rtl" : "ltr"}
        >
          {locales.map((l) => (
            <button
              key={l}
              role="option"
              aria-selected={locale === l}
              onClick={() => switchLocale(l)}
              className={cn(
                "block w-full rounded-lg px-3 py-2 text-start text-sm transition-colors",
                locale === l
                  ? "bg-ferry-yellow/10 font-medium text-paper"
                  : "text-paper-mute hover:bg-paper/[0.05] hover:text-paper",
              )}
            >
              {localeNames[l]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
