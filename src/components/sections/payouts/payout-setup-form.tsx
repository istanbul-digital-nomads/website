"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { showToast } from "@/lib/toast";

// Guide payout setup - IBAN + account name. On save, the API stores
// the details and (when iyzico is live) creates the sub-merchant
// record. IBAN is masked once set; re-submitting replaces it.
export function PayoutSetupForm({
  initialName,
  hasIban,
}: {
  initialName: string;
  hasIban: boolean;
}) {
  const router = useRouter();
  const t = useTranslations("payouts");
  const [name, setName] = useState(initialName);
  const [iban, setIban] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/payouts/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payout_name: name.trim(), payout_iban: iban }),
      });
      const json = await res.json();
      if (!res.ok) {
        showToast.error(
          t("setupErrorTitle"),
          json.error ?? t("setupErrorBody"),
        );
        return;
      }
      showToast.success(t("setupSuccess"));
      setIban("");
      router.refresh();
    } catch {
      showToast.error(t("setupErrorTitle"), t("setupErrorBody"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
      {hasIban ? (
        <p className="rounded-md border border-moss/30 bg-moss/5 px-3 py-2 text-[13px] text-moss">
          {t("ibanOnFile")}
        </p>
      ) : null}
      <div>
        <label
          htmlFor="payout-name"
          className="block font-mono text-[10px] uppercase tracking-wider text-paper-mute"
        >
          {t("nameLabel")}
        </label>
        <input
          id="payout-name"
          type="text"
          required
          maxLength={140}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t("namePlaceholder")}
          className="mt-2 w-full rounded-md border border-ink-3 bg-ink-1 px-3 py-2 text-sm text-paper"
        />
      </div>
      <div>
        <label
          htmlFor="payout-iban"
          className="block font-mono text-[10px] uppercase tracking-wider text-paper-mute"
        >
          {t("ibanLabel")}
        </label>
        <input
          id="payout-iban"
          type="text"
          required={!hasIban}
          value={iban}
          onChange={(e) => setIban(e.target.value)}
          placeholder="TR00 0000 0000 0000 0000 0000 00"
          className="mt-2 w-full rounded-md border border-ink-3 bg-ink-1 px-3 py-2 font-mono text-sm text-paper"
        />
        <p className="mt-1 text-[11px] text-paper-faint">{t("ibanHint")}</p>
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="inline-flex items-center rounded-full bg-terracotta px-5 py-2.5 text-sm font-medium text-[#06101f] transition-colors hover:bg-terracotta-dim disabled:opacity-60"
      >
        {submitting ? t("setupSubmitting") : t("setupSubmit")}
      </button>
    </form>
  );
}
