"use client";

import { Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Input, Textarea } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { PLAN_VIBES, VIBE_ICONS, type PlanVibe } from "@/lib/plans/vibes";
import { spaces } from "@/lib/spaces";
import type { DraftStop } from "./plan-create-map";

export interface EditableStop extends DraftStop {
  start_time: string;
  end_time: string;
  vibe: PlanVibe;
  notes: string;
}

interface Props {
  stop: EditableStop;
  index: number;
  total: number;
  onChange: (next: EditableStop) => void;
  onRemove: () => void;
  onRequestRePin: () => void;
}

export function PlanStopEditor({
  stop,
  index,
  total,
  onChange,
  onRemove,
  onRequestRePin,
}: Props) {
  const t = useTranslations("plans.create");
  const tVibes = useTranslations("plans.vibes");

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
      className="space-y-4 border-t border-ink-3 px-4 py-5 first:border-t-0"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-mono text-[10px] uppercase tracking-wider text-terracotta">
            Stop {index + 1} of {total}
          </p>
          <p className="mt-1 truncate font-display text-h3 leading-tight text-paper">
            {locationLabel}
          </p>
          {space?.neighborhood && (
            <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-paper-mute">
              {space.neighborhood}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove stop ${index + 1}`}
          className="rounded-md border border-ink-4 p-2 text-paper-mute transition-colors hover:border-red-500 hover:text-red-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {/* Custom-location label (only when this is a custom pin) */}
      {!stop.space_id && (
        <Input
          label={t("customLocation")}
          value={stop.custom_location ?? ""}
          onChange={(e) => patch({ custom_location: e.target.value })}
          placeholder={t("customLocationPlaceholder")}
          maxLength={120}
        />
      )}

      {/* Time */}
      <div className="grid grid-cols-2 gap-3">
        <Input
          label={t("startTime")}
          type="time"
          value={stop.start_time}
          onChange={(e) => patch({ start_time: e.target.value })}
        />
        <Input
          label={t("endTime")}
          type="time"
          value={stop.end_time}
          onChange={(e) => patch({ end_time: e.target.value })}
        />
      </div>

      {/* Vibe */}
      <div>
        <label className="mb-2 block text-sm font-medium text-paper">
          {t("vibeLabel")}
        </label>
        <div className="flex flex-wrap gap-2">
          {PLAN_VIBES.map((v) => {
            const Icon = VIBE_ICONS[v];
            const active = v === stop.vibe;
            return (
              <button
                key={v}
                type="button"
                onClick={() => patch({ vibe: v })}
                aria-pressed={active}
                className={cn(
                  "inline-flex min-h-[44px] items-center gap-1.5 border px-3 py-2 font-mono text-[11px] uppercase tracking-wider transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta",
                  active
                    ? "border-terracotta bg-terracotta/10 text-paper"
                    : "border-ink-4 text-paper-mute hover:border-ink-5",
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {tVibes(v)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Notes */}
      <Textarea
        label={t("notesLabel")}
        value={stop.notes}
        onChange={(e) => patch({ notes: e.target.value })}
        placeholder={t("notesPlaceholder")}
        maxLength={280}
        helperText={t("notesHelp")}
        rows={3}
      />

      {/* Re-pin shortcut for custom pins */}
      {!stop.space_id && (
        <button
          type="button"
          onClick={onRequestRePin}
          className="text-xs font-medium text-terracotta underline-offset-2 hover:underline focus-visible:outline-none focus-visible:underline"
        >
          Move pin
        </button>
      )}
    </section>
  );
}
