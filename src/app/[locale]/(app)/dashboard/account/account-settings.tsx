"use client";

import { useCallback, useRef, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Send, Check, Loader2, Link2Off } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { showToast } from "@/lib/toast";

type Prefs = {
  notify_telegram: boolean;
  notify_plan_activity: boolean;
  notify_comments: boolean;
  notify_tickets: boolean;
  notify_events: boolean;
  notify_reminders: boolean;
};

const CATEGORY_KEYS: Array<keyof Omit<Prefs, "notify_telegram">> = [
  "notify_plan_activity",
  "notify_comments",
  "notify_tickets",
  "notify_events",
  "notify_reminders",
];

// Map each preference column to its i18n label/description key suffix.
const CATEGORY_I18N: Record<keyof Omit<Prefs, "notify_telegram">, string> = {
  notify_plan_activity: "planActivity",
  notify_comments: "comments",
  notify_tickets: "tickets",
  notify_events: "events",
  notify_reminders: "reminders",
};

export function AccountSettings({
  memberId,
  connected: initialConnected,
  linkedAt: initialLinkedAt,
  prefs: initialPrefs,
}: {
  memberId: string;
  connected: boolean;
  linkedAt: string | null;
  prefs: Prefs;
}) {
  const t = useTranslations("accountPage");
  const locale = useLocale();

  const [connected, setConnected] = useState(initialConnected);
  const [linkedAt, setLinkedAt] = useState(initialLinkedAt);
  const [connecting, setConnecting] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const [polling, setPolling] = useState(false);
  const [prefs, setPrefs] = useState<Prefs>(initialPrefs);
  const [saving, setSaving] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Poll the status endpoint for ~60s after the member opens the bot link,
  // flipping to "connected" as soon as the webhook records the subscription.
  const startPolling = useCallback(() => {
    if (pollRef.current) clearInterval(pollRef.current);
    setPolling(true);
    let elapsed = 0;
    const stop = () => {
      if (pollRef.current) clearInterval(pollRef.current);
      pollRef.current = null;
      setPolling(false);
    };
    pollRef.current = setInterval(async () => {
      elapsed += 3000;
      try {
        const res = await fetch("/api/telegram/status", { cache: "no-store" });
        const json = await res.json();
        if (json.connected) {
          setConnected(true);
          setLinkedAt(json.linkedAt ?? null);
          showToast.success(t("telegram.connectedToast"));
          stop();
          return;
        }
      } catch {
        // ignore transient errors; keep polling
      }
      if (elapsed >= 60000) stop();
    }, 3000);
  }, [t]);

  async function connect() {
    setConnecting(true);
    try {
      const res = await fetch("/api/telegram/link", { method: "POST" });
      const json = await res.json();
      if (!res.ok) {
        showToast.error(t("telegram.errorTitle"), json.error);
        return;
      }
      window.open(json.data.url, "_blank", "noopener,noreferrer");
      showToast.success(t("telegram.openedTitle"), t("telegram.openedBody"));
      startPolling();
    } finally {
      setConnecting(false);
    }
  }

  async function disconnect() {
    setDisconnecting(true);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("telegram_subscriptions")
        .delete()
        .eq("member_id", memberId);
      if (error) {
        showToast.error(t("telegram.errorTitle"), error.message);
        return;
      }
      setConnected(false);
      setLinkedAt(null);
      showToast.success(t("telegram.disconnectedToast"));
    } finally {
      setDisconnecting(false);
    }
  }

  function toggle(key: keyof Prefs) {
    setPrefs((p) => ({ ...p, [key]: !p[key] }));
  }

  async function save() {
    setSaving(true);
    try {
      const supabase = createClient();
      // Capture the active locale so notifications render in the member's
      // language (no separate locale picker needed).
      const { error } = await (supabase.from("members") as any)
        .update({ ...prefs, preferred_locale: locale })
        .eq("id", memberId);
      if (error) {
        showToast.error(t("saveError"), error.message);
        return;
      }
      showToast.success(t("saved"));
    } catch {
      showToast.error(t("saveError"));
    } finally {
      setSaving(false);
    }
  }

  const linkedDate = linkedAt
    ? new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(
        new Date(linkedAt),
      )
    : null;

  return (
    <div className="space-y-5">
      {/* Telegram connection card */}
      <div className="rounded-xl border border-ink-3 bg-ink-2 p-6">
        <div className="flex items-start gap-3">
          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#229ED9]/15 text-[#229ED9]">
            <Send className="h-5 w-5" aria-hidden />
          </span>
          <div className="flex-1">
            <h2 className="font-display text-lg text-paper">
              {t("telegram.title")}
            </h2>
            <p className="mt-1 text-[13px] text-paper-mute">
              {t("telegram.description")}
            </p>
          </div>
        </div>

        <div className="mt-5">
          {connected ? (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-moss">
                <Check className="h-3.5 w-3.5" aria-hidden />
                {linkedDate
                  ? t("telegram.connectedSince", { date: linkedDate })
                  : t("telegram.connected")}
              </span>
              <Button
                variant="secondary"
                size="sm"
                loading={disconnecting}
                onClick={disconnect}
              >
                <Link2Off className="me-1.5 h-3.5 w-3.5" aria-hidden />
                {t("telegram.disconnect")}
              </Button>
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="secondary"
                loading={connecting}
                onClick={connect}
              >
                <Send className="me-1.5 h-4 w-4" aria-hidden />
                {t("telegram.connect")}
              </Button>
              {polling ? (
                <span className="inline-flex items-center gap-1.5 text-[12px] text-paper-mute">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
                  {t("telegram.waiting")}
                </span>
              ) : null}
            </div>
          )}
        </div>
      </div>

      {/* Notification toggles */}
      <div className="rounded-xl border border-ink-3 bg-ink-2 p-6">
        <h2 className="font-display text-lg text-paper">{t("notify.title")}</h2>
        <p className="mt-1 text-[13px] text-paper-mute">
          {t("notify.description")}
        </p>

        <div className="mt-5 space-y-1">
          <ToggleRow
            label={t("notify.master")}
            description={t("notify.masterDescription")}
            checked={prefs.notify_telegram}
            disabled={!connected}
            onChange={() => toggle("notify_telegram")}
            emphasis
          />
          <div className="my-2 border-t border-ink-3" />
          {CATEGORY_KEYS.map((key) => (
            <ToggleRow
              key={key}
              label={t(`notify.${CATEGORY_I18N[key]}`)}
              description={t(`notify.${CATEGORY_I18N[key]}Description`)}
              checked={prefs[key]}
              disabled={!connected || !prefs.notify_telegram}
              onChange={() => toggle(key)}
            />
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <Button onClick={save} loading={saving} size="sm" className="px-6">
            {t("save")}
          </Button>
        </div>
      </div>
    </div>
  );
}

function ToggleRow({
  label,
  description,
  checked,
  disabled,
  onChange,
  emphasis,
}: {
  label: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange: () => void;
  emphasis?: boolean;
}) {
  return (
    <label
      className={`flex items-start justify-between gap-4 py-2.5 ${
        disabled ? "opacity-50" : "cursor-pointer"
      }`}
    >
      <span>
        <span
          className={`block text-sm ${emphasis ? "font-medium text-paper" : "text-paper-dim"}`}
        >
          {label}
        </span>
        <span className="mt-0.5 block text-[12px] text-paper-mute">
          {description}
        </span>
      </span>
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={onChange}
        className="mt-1 h-4 w-4 shrink-0 rounded border-neutral-300 text-primary-600 focus:ring-primary-500 dark:border-neutral-600"
      />
    </label>
  );
}
