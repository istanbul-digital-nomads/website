"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { showToast } from "@/lib/toast";
import { trackThenNavigate } from "@/lib/analytics";

// Buy-a-ticket button for ticketed plans. POSTs to the checkout API;
// on success redirects to the iyzico hosted checkout. When payments
// aren't live yet (503 payments_not_live) it shows a clean "coming
// soon" toast instead of a dead redirect.
export function TicketCheckoutButton({
  planId,
  priceLabel,
  entryFeeCents,
}: {
  planId: string;
  priceLabel: string;
  // Entry fee in cents (100 = 1 TL). Used only for the begin_checkout value.
  entryFeeCents: number;
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
        // Real checkout is proceeding to the payment provider - record it.
        // `purchase` is captured server-side from the iyzico callback.
        // trackThenNavigate gives GA4 a short window (event_callback +
        // timeout fallback) to flush the event before the full-page redirect
        // would otherwise destroy the queued dataLayer push.
        trackThenNavigate(
          "begin_checkout",
          {
            value: entryFeeCents / 100,
            currency: "TRY",
            plan_id: planId,
          },
          () => {
            window.location.href = json.checkoutUrl;
          },
        );
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
