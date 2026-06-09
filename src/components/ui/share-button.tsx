"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Share2, Check, Loader2 } from "lucide-react";
import { showToast } from "@/lib/toast";
import { track } from "@/lib/analytics";
import type { ShortableKind } from "@/lib/short-links";
import { cn } from "@/lib/utils";

// On-demand share: POSTs to /api/share to create-or-reuse a short link, then
// hands it off via the Web Share sheet (mobile) or the clipboard (desktop).
export function ShareButton({
  kind,
  entityId,
  path,
  title,
  className,
}: {
  kind: ShortableKind;
  entityId: string;
  path: string;
  title?: string;
  className?: string;
}) {
  const t = useTranslations("share");
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);

  async function handleClick() {
    if (pending) return;
    setPending(true);
    try {
      const res = await fetch("/api/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind, entityId, path }),
      });
      if (!res.ok) throw new Error("share failed");
      const { url } = (await res.json()) as { url: string };

      // GA4-recommended share event, fired at hand-off (a dismissed native
      // sheet still counts as share intent, mirroring GA4's built-in share).
      track("share", {
        method:
          typeof navigator !== "undefined" &&
          typeof navigator.share === "function"
            ? "native_sheet"
            : "clipboard",
        content_type: kind,
        item_id: entityId,
      });

      // Prefer the native share sheet when available (mobile); otherwise copy.
      if (typeof navigator !== "undefined" && navigator.share) {
        try {
          await navigator.share({ title, url });
        } catch {
          // User dismissed the sheet - treat as a no-op, not an error.
        }
      } else if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        showToast.success(t("copied"));
      } else {
        showToast.info(url);
      }
      setDone(true);
      setTimeout(() => setDone(false), 2000);
    } catch {
      showToast.error(t("error"));
    } finally {
      setPending(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      aria-label={t("button")}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-ink-3 bg-ink-2/40 px-4 py-2 font-mono text-[11px] uppercase tracking-wider text-paper-dim transition-colors hover:border-ink-4 hover:text-paper disabled:opacity-60",
        className,
      )}
    >
      {pending ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
      ) : done ? (
        <Check className="h-3.5 w-3.5 text-moss" aria-hidden />
      ) : (
        <Share2 className="h-3.5 w-3.5" aria-hidden />
      )}
      {t("button")}
    </button>
  );
}
