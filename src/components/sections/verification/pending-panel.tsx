"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { showToast } from "@/lib/toast";

// Client wrapper for the pending-state panel - takes server-pre-
// translated copy as props (the parent server component still owns
// translations) and adds a cancel button that calls DELETE
// /api/verification with the pending row id.

interface Props {
  level: string;
  levelLabel: string;
  pendingBody: string;
  pendingTitle: string;
  requestId: string;
}

export function PendingPanel({
  levelLabel,
  pendingBody,
  pendingTitle,
  requestId,
}: Props) {
  const router = useRouter();
  const tPage = useTranslations("verification.page");
  const [submitting, setSubmitting] = useState(false);
  void levelLabel;

  async function handleCancel() {
    if (!window.confirm(tPage("cancelRequest") + "?")) {
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/verification", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: requestId }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        showToast.error(
          tPage("errorTitle"),
          (json as { error?: string }).error ?? tPage("errorBody"),
        );
        return;
      }
      router.refresh();
    } catch {
      showToast.error(tPage("errorTitle"), tPage("errorBody"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mt-8 rounded-md border border-sky-500/40 bg-sky-500/5 p-5">
      <h2 className="font-display text-xl text-paper">{pendingTitle}</h2>
      <p className="mt-2 text-[14px] leading-[1.6] text-paper-dim">
        {pendingBody}
      </p>
      <div className="mt-4 flex items-center justify-between gap-3">
        <p className="font-mono text-[10px] uppercase tracking-wider text-paper-faint">
          #{requestId.slice(0, 8)}
        </p>
        <button
          type="button"
          onClick={handleCancel}
          disabled={submitting}
          className="text-[12px] text-paper-mute underline-offset-2 transition-colors hover:text-paper hover:underline disabled:opacity-60"
        >
          {tPage("cancelRequest")}
        </button>
      </div>
    </div>
  );
}
