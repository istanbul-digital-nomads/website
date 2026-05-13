"use client";

import { useLocale, useTranslations } from "next-intl";
import { useState, useRef, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { ChevronDown, Globe } from "lucide-react";
import {
  locales,
  localeNames,
  defaultLocale,
  type Locale,
} from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

export function LanguageSwitcher() {
  const locale = useLocale() as Locale;
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
        className="flex items-center gap-1.5 rounded-full border border-black/5 px-2.5 py-1.5 text-xs font-medium uppercase tracking-wider text-neutral-600 transition-colors hover:bg-black/5 dark:border-white/10 dark:text-[#99a3ad] dark:hover:bg-white/10"
        title={t("label")}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <Globe className="h-3.5 w-3.5" aria-hidden="true" />
        <span className="sr-only">{t("label")}:</span>
        <span>{locale}</span>
        <ChevronDown
          className={cn(
            "h-3 w-3 transition-transform duration-200",
            open && "rotate-180",
          )}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute right-0 top-full z-50 mt-2 w-40 rounded-xl border border-black/10 bg-white/95 p-1.5 shadow-[0_16px_42px_rgba(20,17,15,0.1)] backdrop-blur-xl dark:border-white/10 dark:bg-[#1a1612]/95 dark:shadow-[0_16px_42px_rgba(0,0,0,0.35)]"
        >
          {locales.map((l) => (
            <button
              key={l}
              role="option"
              aria-selected={locale === l}
              onClick={() => switchLocale(l)}
              className={cn(
                "block w-full rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-black/5 dark:hover:bg-white/5",
                locale === l
                  ? "bg-primary-50/80 font-medium text-primary-700 dark:bg-primary-900/20 dark:text-primary-200"
                  : "text-neutral-700 dark:text-[#d4d7da]",
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
