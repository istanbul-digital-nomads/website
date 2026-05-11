"use client";

import { useLocale, useTranslations } from "next-intl";
import { useState, useRef, useEffect } from "react";
import { ChevronDown, Globe } from "lucide-react";
import { usePathname, useRouter } from "@/lib/i18n/routing";
import { locales, localeNames, type Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

export function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const t = useTranslations("languageSwitcher");
  const router = useRouter();
  const pathname = usePathname();
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

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 rounded-full border border-black/5 px-2.5 py-1.5 text-xs font-medium uppercase tracking-wider text-neutral-600 transition-colors hover:bg-black/5 dark:border-white/10 dark:text-[#99a3ad] dark:hover:bg-white/10"
        aria-label={t("label")}
        title={t("label")}
      >
        <Globe className="h-3.5 w-3.5" />
        <span>{locale}</span>
        <ChevronDown
          className={cn(
            "h-3 w-3 transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-40 rounded-xl border border-black/10 bg-white/95 p-1.5 shadow-[0_16px_42px_rgba(20,17,15,0.1)] backdrop-blur-xl dark:border-white/10 dark:bg-[#1a1612]/95 dark:shadow-[0_16px_42px_rgba(0,0,0,0.35)]">
          {locales.map((l) => (
            <button
              key={l}
              onClick={() => {
                setOpen(false);
                router.replace(pathname, { locale: l });
              }}
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
