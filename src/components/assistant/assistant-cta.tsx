"use client";

import { useTranslations } from "next-intl";
import { MessageCircle } from "lucide-react";

// Opens the floating assistant from anywhere via the same custom-event
// pattern the Cmd-K button uses. Rendered on the /help hub.

export function AssistantCta() {
  const t = useTranslations("assistant");
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event("open-assistant"))}
      className="inline-flex items-center gap-2 rounded-full border border-terracotta/40 bg-terracotta/10 px-4 py-2 text-sm font-medium text-terracotta transition-colors hover:bg-terracotta/15"
    >
      <MessageCircle className="h-4 w-4" />
      {t("askCta")}
    </button>
  );
}
