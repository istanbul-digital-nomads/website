"use client";

import { MapPin, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { PLAN_VIBES, VIBE_ICONS, type PlanVibe } from "@/lib/plans/vibes";
import {
  TRANSPORT_MODES,
  TRANSPORT_ICONS,
  type TransportMode,
} from "@/lib/plans/transport";
import { spaces } from "@/lib/spaces";
import type { DraftStop } from "./plan-create-map";

export interface EditableStop extends DraftStop {
  start_time: string;
  end_time: string;
  vibe: PlanVibe;
  notes: string;
  transport_mode: TransportMode | null;
  transport_price_min: string;
  transport_price_max: string;
}

interface Props {
  stop: EditableStop;
  index: number;
  total: number;
  onChange: (next: EditableStop) => void;
  onRemove: () => void;
  onRequestChangeLocation: () => void;
}

export function PlanStopEditor({
  stop,
  index,
  total,
  onChange,
  onRemove,
  onRequestChangeLocation,
}: Props) {
  const t = useTranslations("plans.create");
  const tVibes = useTranslations("plans.vibes");
  const tTransport = useTranslations("plans.transport");

  const space = stop.space_id
    ? spaces.find((s) => s.id === stop.space_id)
    : null;
  const locationLabel = space?.name ?? stop.custom_location ?? "Pinned spot";

  function patch(next: Partial<EditableStop>) {
    onChange({ ...stop, ...next });
  }

  return (
    <section
      aria-label={`Stop ${index + 1} of ${total}`}
      className="space-y-3 px-4 py-3"
    >
      {/* Location header: name on left, move + remove icon buttons on right. */}
      <div className="flex items-center gap-2">
        <div className="min-w-0 flex-1">
          <p className="truncate text-base font-medium text-paper">
            {locationLabel}
          </p>
          {space?.neighborhood && (
            <p className="truncate font-mono text-[10px] uppercase tracking-wider text-paper-mute">
              {space.neighborhood}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={onRequestChangeLocation}
          aria-label={t("changeLocation")}
          title={t("changeLocation")}
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-paper-mute transition-colors hover:bg-ink-2 hover:text-paper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
        >
          <MapPin className="h-4 w-4" aria-hidden />
        </button>
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove stop ${index + 1}`}
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-paper-mute transition-colors hover:bg-ink-2 hover:text-red-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
        >
          <Trash2 className="h-4 w-4" aria-hidden />
        </button>
      </div>

      {/* Custom pin: inline name field (placeholder-only, no label) */}
      {!stop.space_id && (
        <input
          type="text"
          value={stop.custom_location ?? ""}
          onChange={(e) => patch({ custom_location: e.target.value })}
          placeholder={t("customLocationPlaceholder")}
          maxLength={120}
          aria-label={t("customLocation")}
          className="w-full rounded-md border border-ink-3 bg-transparent px-3 py-2 text-sm text-paper placeholder:text-paper-faint focus-visible:border-terracotta focus-visible:outline-none"
        />
      )}

      {/* Time + vibe in one row */}
      <div className="flex items-center gap-2">
        <input
          type="time"
          value={stop.start_time}
          onChange={(e) => patch({ start_time: e.target.value })}
          aria-label={t("startTime")}
          className="min-w-0 flex-1 rounded-md border border-ink-3 bg-transparent px-2.5 py-2 text-sm text-paper focus-visible:border-terracotta focus-visible:outline-none"
        />
        <span aria-hidden className="text-paper-mute">
          –
        </span>
        <input
          type="time"
          value={stop.end_time}
          onChange={(e) => patch({ end_time: e.target.value })}
          aria-label={t("endTime")}
          className="min-w-0 flex-1 rounded-md border border-ink-3 bg-transparent px-2.5 py-2 text-sm text-paper focus-visible:border-terracotta focus-visible:outline-none"
        />
      </div>

      {/* Vibe: tight icon row, labels in tooltip + aria */}
      <div
        role="radiogroup"
        aria-label={t("vibeLabel")}
        className="flex flex-wrap gap-1.5"
      >
        {PLAN_VIBES.map((v) => {
          const Icon = VIBE_ICONS[v];
          const active = v === stop.vibe;
          const label = tVibes(v);
          return (
            <button
              key={v}
              type="button"
              role="radio"
              aria-checked={active}
              aria-label={label}
              title={label}
              onClick={() => patch({ vibe: v })}
              className={cn(
                "inline-flex h-9 w-9 items-center justify-center rounded-md border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta",
                active
                  ? "border-terracotta bg-terracotta/15 text-paper"
                  : "border-ink-3 text-paper-mute hover:border-ink-4 hover:text-paper",
              )}
            >
              <Icon className="h-4 w-4" aria-hidden />
            </button>
          );
        })}
      </div>

      {/* Notes: lightweight, no label */}
      <textarea
        value={stop.notes}
        onChange={(e) => patch({ notes: e.target.value })}
        placeholder={t("notesPlaceholder")}
        maxLength={280}
        rows={2}
        aria-label={t("notesLabel")}
        className="w-full resize-none rounded-md border border-ink-3 bg-transparent px-3 py-2 text-sm text-paper placeholder:text-paper-faint focus-visible:border-terracotta focus-visible:outline-none"
      />

      {/* Transport: only for stops after the first. */}
      {index > 0 && (
        <div className="space-y-2 border-t border-ink-3 pt-3">
          <p className="font-mono text-[10px] uppercase tracking-wider text-paper-mute">
            {t("transportEyebrow")}
          </p>
          <div
            role="radiogroup"
            aria-label={t("transportLabel")}
            className="flex flex-wrap gap-1.5"
          >
            {TRANSPORT_MODES.map((m) => {
              const Icon = TRANSPORT_ICONS[m];
              const active = stop.transport_mode === m;
              const label = tTransport(m);
              return (
                <button
                  key={m}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  aria-label={label}
                  title={label}
                  onClick={() => patch({ transport_mode: active ? null : m })}
                  className={cn(
                    "inline-flex h-9 w-9 items-center justify-center rounded-md border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta",
                    active
                      ? "border-terracotta bg-terracotta/15 text-paper"
                      : "border-ink-3 text-paper-mute hover:border-ink-4 hover:text-paper",
                  )}
                >
                  <Icon className="h-4 w-4" aria-hidden />
                </button>
              );
            })}
          </div>

          {/* Price range (only after a transport mode is picked). */}
          {stop.transport_mode && (
            <div className="flex items-center gap-2 text-sm">
              <span className="font-mono text-[10px] uppercase tracking-wider text-paper-mute">
                ₺
              </span>
              <input
                type="number"
                inputMode="numeric"
                min={0}
                value={stop.transport_price_min}
                onChange={(e) => patch({ transport_price_min: e.target.value })}
                placeholder={t("priceMinPlaceholder")}
                aria-label={t("priceMinLabel")}
                className="w-20 rounded-md border border-ink-3 bg-transparent px-2 py-1.5 text-sm text-paper placeholder:text-paper-faint focus-visible:border-terracotta focus-visible:outline-none"
              />
              <span aria-hidden className="text-paper-mute">
                –
              </span>
              <input
                type="number"
                inputMode="numeric"
                min={0}
                value={stop.transport_price_max}
                onChange={(e) => patch({ transport_price_max: e.target.value })}
                placeholder={t("priceMaxPlaceholder")}
                aria-label={t("priceMaxLabel")}
                className="w-20 rounded-md border border-ink-3 bg-transparent px-2 py-1.5 text-sm text-paper placeholder:text-paper-faint focus-visible:border-terracotta focus-visible:outline-none"
              />
              <span className="text-xs text-paper-mute">{t("priceHint")}</span>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
