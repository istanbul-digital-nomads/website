"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { useConsent } from "./consent-provider";

// Non-modal consent banner. `dir` is inherited from <html dir>, and the layout
// is centered + symmetric, so it reads correctly in RTL (fa/ar) without extra
// overrides. Colors use ink/paper tokens so it follows light/dark automatically.
//
// Always rendered (hidden by default via .consent-banner in globals.css) so
// the markup is in the server HTML and the inline <head> bootstrap can show
// it at first paint for undecided visitors. `open` takes over after
// hydration: it drives data-open and the focus/Escape behavior.
export function CookieBanner({ open }: { open: boolean }) {
  const t = useTranslations("consent");
  const { acceptAll, rejectNonEssential } = useConsent();
  const acceptRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    acceptRef.current?.focus();
    function onKey(e: KeyboardEvent) {
      // Treat Esc / dismiss as "reject non-essential" (the privacy-safe default).
      if (e.key === "Escape") rejectNonEssential();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, rejectNonEssential]);

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="consent-title"
      aria-describedby="consent-body"
      data-open={open || undefined}
      className="consent-banner fixed inset-x-0 bottom-0 z-[2000] justify-center px-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] pt-4 md:px-6"
    >
      <div className="w-full max-w-3xl rounded-2xl border border-ink-3 bg-ink-1/95 p-5 shadow-2xl backdrop-blur-md md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0">
            <h2
              id="consent-title"
              className="font-grotesk text-sm font-semibold text-paper"
            >
              {t("title")}
            </h2>
            <p
              id="consent-body"
              className="mt-1 text-[13px] leading-relaxed text-paper-mute"
            >
              {t("body")}
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row md:flex-col lg:flex-row">
            <Button
              ref={acceptRef}
              variant="primary"
              size="sm"
              onClick={acceptAll}
            >
              {t("acceptAll")}
            </Button>
            <Button variant="secondary" size="sm" onClick={rejectNonEssential}>
              {t("rejectNonEssential")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
