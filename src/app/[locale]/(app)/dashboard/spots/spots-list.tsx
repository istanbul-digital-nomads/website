"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Bell, ExternalLink, Instagram, MapPin, Trash2 } from "lucide-react";
import { Link } from "@/lib/i18n/routing";
import { Button } from "@/components/ui/button";
import { showToast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import type { Database } from "@/types/database";

type SavedSpot = Database["public"]["Tables"]["saved_spots"]["Row"];

export function SpotsList({ spots: initial }: { spots: SavedSpot[] }) {
  const t = useTranslations("dashboardSpots");
  const [spots, setSpots] = useState(initial);
  const [busy, setBusy] = useState<string | null>(null);

  async function toggleNotify(spot: SavedSpot) {
    const next = !spot.notify_on_plan_match;
    // Optimistic flip.
    setSpots((list) =>
      list.map((s) =>
        s.id === spot.id ? { ...s, notify_on_plan_match: next } : s,
      ),
    );
    try {
      const res = await fetch(`/api/spots/${spot.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notifyOnPlanMatch: next }),
      });
      if (!res.ok) throw new Error();
    } catch {
      // Revert on failure.
      setSpots((list) =>
        list.map((s) =>
          s.id === spot.id ? { ...s, notify_on_plan_match: !next } : s,
        ),
      );
      showToast.error(t("errors.update"));
    }
  }

  async function remove(spot: SavedSpot) {
    setBusy(spot.id);
    try {
      const res = await fetch(`/api/spots/${spot.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setSpots((list) => list.filter((s) => s.id !== spot.id));
      showToast.success(t("toasts.removed"));
    } catch {
      showToast.error(t("errors.remove"));
    } finally {
      setBusy(null);
    }
  }

  if (spots.length === 0) {
    return (
      <div className="rounded-md border border-ink-3 bg-ink-2/40 p-8 text-center">
        <MapPin className="mx-auto h-6 w-6 text-paper-mute" aria-hidden />
        <p className="mt-3 text-sm text-paper-dim">{t("empty.body")}</p>
        <Link
          href="/tools/spot-finder"
          className="mt-4 inline-flex items-center gap-1.5 font-medium text-terracotta underline-offset-2 hover:underline"
        >
          <Instagram className="h-4 w-4" aria-hidden />
          {t("empty.cta")}
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-paper-mute">{t("notifyHint")}</p>
      <ul className="space-y-3">
        {spots.map((spot) => (
          <li
            key={spot.id}
            className="flex items-start gap-3 rounded-md border border-ink-3 bg-ink-2/40 p-4"
          >
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-terracotta/15 text-terracotta">
              <MapPin className="h-4 w-4" aria-hidden />
            </span>

            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-paper">{spot.label}</p>
              <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 font-mono text-[10px] uppercase tracking-wider text-paper-faint">
                {spot.neighborhood_slug && (
                  <span>{spot.neighborhood_slug}</span>
                )}
                {spot.source === "instagram" && spot.source_url && (
                  <a
                    href={spot.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 hover:text-paper"
                  >
                    <Instagram className="h-3 w-3" aria-hidden />
                    {t("source.instagram")}
                  </a>
                )}
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${spot.lat},${spot.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-paper"
                >
                  <ExternalLink className="h-3 w-3" aria-hidden />
                  {t("viewMap")}
                </a>
              </div>

              <button
                type="button"
                onClick={() => toggleNotify(spot)}
                aria-pressed={spot.notify_on_plan_match}
                className={cn(
                  "mt-2.5 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs transition-colors",
                  spot.notify_on_plan_match
                    ? "border-terracotta bg-terracotta/10 text-paper"
                    : "border-ink-3 text-paper-mute hover:border-ink-4 hover:text-paper",
                )}
              >
                <Bell className="h-3 w-3" aria-hidden />
                {spot.notify_on_plan_match ? t("notify.on") : t("notify.off")}
              </button>
            </div>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => remove(spot)}
              loading={busy === spot.id}
              aria-label={t("remove")}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
