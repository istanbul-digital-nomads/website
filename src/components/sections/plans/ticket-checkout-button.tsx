"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { showToast } from "@/lib/toast";

// Buy-a-ticket button for ticketed plans. POSTs to the checkout API;
// on success redirects to the iyzico hosted checkout. When payments
// aren't live yet (503 payments_not_live) it shows a clean "coming
// soon" toast instead of a dead redirect.
export function TicketCheckoutButton({
  planId,
  priceLabel,
}: {
  planId: string;
  priceLabel: string;
}) {
  const t = useTranslations("plans.checkout");
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      const res = await fetch(`/api/plans/${planId}/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const json = await res.json().catch(() => ({}));
      if (res.status === 503 && json.error === "payments_not_live") {
        showToast.info(t("notLiveTitle"), t("notLiveBody"));
        return;
      }
      if (!res.ok) {
        showToast.error(t("errorTitle"), json.error ?? t("errorBody"));
        return;
      }
      if (json.checkoutUrl) {
        window.location.href = json.checkoutUrl;
        return;
      }
      showToast.error(t("errorTitle"), t("errorBody"));
    } catch {
      showToast.error(t("errorTitle"), t("errorBody"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className="inline-flex items-center gap-2 rounded-full bg-ferry-yellow px-5 py-2.5 text-sm font-medium text-[#06101f] transition-colors hover:bg-ferry-yellow/90 disabled:opacity-60"
    >
      {loading ? t("loading") : t("buyTicket", { price: priceLabel })}
    </button>
  );
}
