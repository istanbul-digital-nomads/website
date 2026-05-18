"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { showToast } from "@/lib/toast";

export function ConnectTelegramButton() {
  const t = useTranslations("plans.telegram");
  const [loading, setLoading] = useState(false);

  async function connect() {
    setLoading(true);
    try {
      const res = await fetch("/api/telegram/link", { method: "POST" });
      const json = await res.json();
      if (!res.ok) {
        showToast.error(t("errorTitle"), json.error ?? t("notConfigured"));
        return;
      }
      window.open(json.data.url, "_blank", "noopener,noreferrer");
      showToast.success(t("openedTitle"), t("openedBody"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button variant="secondary" loading={loading} onClick={connect}>
      {t("connect")}
    </Button>
  );
}
