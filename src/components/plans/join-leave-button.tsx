"use client";

import { useState, useTransition } from "react";
import { useRouter } from "@/lib/i18n/routing";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { showToast } from "@/lib/toast";

interface Props {
  planId: string;
  initialJoined: boolean;
  isHost: boolean;
  isFull: boolean;
}

export function JoinLeaveButton({
  planId,
  initialJoined,
  isHost,
  isFull,
}: Props) {
  const router = useRouter();
  const [joined, setJoined] = useState(initialJoined);
  const [loading, setLoading] = useState(false);
  const [, startTransition] = useTransition();
  const t = useTranslations("plans.detail");

  if (isHost) {
    return (
      <span className="inline-flex items-center justify-center border border-ink-4 px-4 py-2 font-mono text-[11px] uppercase tracking-wider text-paper-mute">
        {t("youHost")}
      </span>
    );
  }

  async function toggle() {
    setLoading(true);
    try {
      const method = joined ? "DELETE" : "POST";
      const res = await fetch(`/api/plans/${planId}/attendees`, { method });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        showToast.error(t("errorTitle"), json.error ?? t("errorBody"));
        return;
      }
      setJoined((v) => !v);
      startTransition(() => router.refresh());
    } finally {
      setLoading(false);
    }
  }

  if (joined) {
    return (
      <Button variant="secondary" loading={loading} onClick={toggle}>
        {t("leave")}
      </Button>
    );
  }

  return (
    <Button
      loading={loading}
      onClick={toggle}
      disabled={isFull && !joined}
    >
      {isFull ? t("full") : t("join")}
    </Button>
  );
}
