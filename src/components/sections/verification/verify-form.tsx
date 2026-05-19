"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { showToast } from "@/lib/toast";
import { socialLinks } from "@/lib/constants";

interface Props {
  currentLevel: "basic" | "verified" | "trusted";
  isAgent: boolean;
}

// Verification application form. Phase 3 v1: free-text reason + the
// requested level. A real KYC vendor SDK plugs in later via a session
// id field. Gold (trusted) isn't a self-service path - those users
// get the Telegram-organizer CTA instead.

export function VerifyForm({ currentLevel }: Props) {
  const router = useRouter();
  const t = useTranslations("verification.page");
  const tLevels = useTranslations("verification.levels");

  // The next level you can apply for: basic -> verified, verified ->
  // (no self-service for trusted), trusted -> already there.
  const nextLevel = currentLevel === "basic" ? "verified" : null;

  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (nextLevel === null) {
    return (
      <div className="mt-8 rounded-md border border-gold/40 bg-gold/5 p-4 text-[14px] leading-[1.6] text-paper">
        {t("trustedNote")}{" "}
        <a
          href={socialLinks.telegram}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-gold underline-offset-2 hover:underline"
        >
          {t("telegramCta")}
        </a>
      </div>
    );
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!nextLevel) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requested_level: nextLevel,
          reason: reason.trim(),
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        showToast.error(t("errorTitle"), json.error ?? t("errorBody"));
        return;
      }
      showToast.success(t("successTitle"), t("successBody"));
      router.refresh();
    } catch {
      showToast.error(t("errorTitle"), t("errorBody"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-wider text-paper-mute">
          {t("applyLabel")}
        </p>
        <p className="mt-1 font-display text-xl text-paper">
          {tLevels(nextLevel)}
        </p>
      </div>

      <label className="block">
        <span className="font-mono text-[10px] uppercase tracking-wider text-paper-mute">
          {t("reasonLabel")}
        </span>
        <textarea
          rows={5}
          maxLength={1000}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder={t("reasonPlaceholder")}
          required
          minLength={20}
          className="mt-2 w-full rounded-md border border-ink-3 bg-ink-1 px-3 py-2 text-sm text-paper placeholder:text-paper-faint focus-visible:border-terracotta focus-visible:outline-none"
        />
      </label>

      <button
        type="submit"
        disabled={submitting || reason.trim().length < 20}
        className="inline-flex items-center rounded-full bg-terracotta px-5 py-2.5 text-sm font-medium text-ink-0 transition-colors hover:bg-terracotta-dim disabled:opacity-60"
      >
        {submitting ? t("submitting") : t("submit")}
      </button>
    </form>
  );
}
