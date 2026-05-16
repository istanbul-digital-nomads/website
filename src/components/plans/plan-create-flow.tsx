"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { useRouter } from "@/lib/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BottomSheet, type SheetHeight } from "@/components/ui/bottom-sheet";
import { cn } from "@/lib/utils";
import { showToast } from "@/lib/toast";
import { todayInIstanbul, addDays } from "@/lib/plans/expiry";
import { VIBE_ICONS, type PlanVibe } from "@/lib/plans/vibes";
import type { NomadSpace } from "@/lib/spaces";
import { spaces } from "@/lib/spaces";
import { neighborhoods, type NeighborhoodSlug } from "@/lib/neighborhoods";
import { PlanCreateMap, type DraftStop } from "./plan-create-map";
import { PlanStopEditor, type EditableStop } from "./plan-stop-editor";

function uid() {
  return Math.random().toString(36).slice(2, 11);
}

function inferNeighborhood(lat: number, lng: number): NeighborhoodSlug | null {
  let best: { slug: NeighborhoodSlug; dist: number } | null = null;
  for (const n of neighborhoods) {
    const [nlng, nlat] = n.coords;
    const d = Math.hypot(lat - nlat, lng - nlng);
    if (!best || d < best.dist) best = { slug: n.slug, dist: d };
  }
  return best && best.dist < 0.04 ? best.slug : null;
}

function makeStopFromSpace(sp: NomadSpace): EditableStop {
  const slug =
    neighborhoods.find(
      (n) => n.name.toLowerCase() === sp.neighborhood.toLowerCase(),
    )?.slug ?? null;
  return {
    uid: uid(),
    space_id: sp.id,
    custom_location: null,
    neighborhood_slug: slug,
    lat: sp.coordinates[1],
    lng: sp.coordinates[0],
    start_time: "",
    end_time: "",
    vibe: "cowork",
    notes: "",
  };
}

function makeStopFromPin(lat: number, lng: number): EditableStop {
  return {
    uid: uid(),
    space_id: null,
    custom_location: "",
    neighborhood_slug: inferNeighborhood(lat, lng),
    lat,
    lng,
    start_time: "",
    end_time: "",
    vibe: "social",
    notes: "",
  };
}

export function PlanCreateFlow() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("plans.create");

  const today = todayInIstanbul();
  const tomorrow = addDays(today, 1);

  const [scheduledDate, setScheduledDate] = useState(today);
  const [title, setTitle] = useState("");
  const [capacity, setCapacity] = useState("");
  const [stops, setStops] = useState<EditableStop[]>([]);
  const [focusedUid, setFocusedUid] = useState<string | null>(null);
  const [pickerMode, setPickerMode] = useState(true); // open in picker mode
  const [sheetHeight, setSheetHeight] = useState<SheetHeight>("peek");
  const [loading, setLoading] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  // Auto-generate title from first two stops if user hasn't typed one.
  const autoTitle = useMemo(() => {
    const names = stops.map(
      (s) =>
        spaces.find((sp) => sp.id === s.space_id)?.name ??
        s.custom_location ??
        "Stop",
    );
    return names.slice(0, 2).join(" → ");
  }, [stops]);

  const handlePickSpace = useCallback((sp: NomadSpace) => {
    const stop = makeStopFromSpace(sp);
    setStops((prev) => [...prev, stop]);
    setFocusedUid(stop.uid);
    setPickerMode(false);
    setSheetHeight("half");
  }, []);

  const handleDropCustomPin = useCallback((lat: number, lng: number) => {
    const stop = makeStopFromPin(lat, lng);
    setStops((prev) => [...prev, stop]);
    setFocusedUid(stop.uid);
    setPickerMode(false);
    setSheetHeight("half");
  }, []);

  const handleFocusStop = useCallback((targetUid: string) => {
    setFocusedUid(targetUid);
    setPickerMode(false);
    setSheetHeight("half");
  }, []);

  function startPicker() {
    setFocusedUid(null);
    setPickerMode(true);
    setSheetHeight("peek");
  }

  function updateStop(targetUid: string, next: EditableStop) {
    setStops((prev) => prev.map((s) => (s.uid === targetUid ? next : s)));
  }

  function removeStop(targetUid: string) {
    setStops((prev) => {
      const next = prev.filter((s) => s.uid !== targetUid);
      if (focusedUid === targetUid) {
        setFocusedUid(next[0]?.uid ?? null);
      }
      return next;
    });
  }

  // Scroll editor into view when focus changes.
  useEffect(() => {
    if (focusedUid && editorRef.current) {
      editorRef.current.scrollTop = 0;
    }
  }, [focusedUid]);

  const focusedStop = stops.find((s) => s.uid === focusedUid) ?? null;

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (stops.length === 0) {
      showToast.error(t("errorTitle"), t("noStops"));
      return;
    }
    setLoading(true);

    const body = {
      scheduled_date: scheduledDate,
      title: title.trim() || autoTitle || "Today",
      capacity: capacity ? Number(capacity) : null,
      language: locale,
      stops: stops.map((s) => ({
        space_id: s.space_id,
        custom_location: s.custom_location,
        neighborhood_slug: s.neighborhood_slug,
        lat: s.lat,
        lng: s.lng,
        start_time: s.start_time || null,
        end_time: s.end_time || null,
        vibe: s.vibe,
        notes: s.notes || null,
      })),
    };

    try {
      const res = await fetch("/api/plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!res.ok) {
        showToast.error(t("errorTitle"), json.error);
        return;
      }
      showToast.success(t("successTitle"));
      router.push(`/plans/${json.data.id}` as never);
    } catch {
      showToast.error(t("errorTitle"), t("errorBody"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="fixed inset-0 z-10 flex flex-col bg-ink-0"
    >
      {/* Map fills the screen behind the sheet */}
      <PlanCreateMap
        stops={stops}
        focusedUid={focusedUid}
        pickerMode={pickerMode}
        onPickSpace={handlePickSpace}
        onDropCustomPin={handleDropCustomPin}
        onFocusStop={handleFocusStop}
      />

      {/* Close button */}
      <button
        type="button"
        onClick={() => router.push("/plans" as never)}
        aria-label="Close create plan"
        className="absolute end-4 top-4 z-20 rounded-full border border-ink-4 bg-ink-0/90 p-2 text-paper backdrop-blur-md transition-colors hover:border-paper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
      >
        <X className="h-5 w-5" />
      </button>

      <BottomSheet
        height={sheetHeight}
        onHeightChange={setSheetHeight}
        ariaLabel="Create plan"
        caption={
          stops.length === 0
            ? "Add your first stop"
            : `${stops.length} stop${stops.length === 1 ? "" : "s"}`
        }
      >
        {/* Header: date + title */}
        <div className="space-y-3 px-4 py-3">
          <div className="flex flex-wrap items-center gap-2">
            <DayChip
              active={scheduledDate === today}
              onClick={() => setScheduledDate(today)}
              label={t("today")}
            />
            <DayChip
              active={scheduledDate === tomorrow}
              onClick={() => setScheduledDate(tomorrow)}
              label={t("tomorrow")}
            />
            <input
              type="date"
              value={scheduledDate}
              min={today}
              onChange={(e) => setScheduledDate(e.target.value)}
              aria-label={t("dateLabel")}
              className="ms-auto rounded-md border border-ink-4 bg-ink-2 px-2 py-1.5 text-sm text-paper focus-visible:border-terracotta focus-visible:outline-none"
            />
          </div>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={autoTitle || t("titlePlaceholder")}
            maxLength={80}
            aria-label={t("titleLabel")}
            className="font-display text-lg"
          />
        </div>

        {/* Stop chips row */}
        <div className="border-y border-ink-3 bg-ink-2 px-4 py-3">
          <div
            role="tablist"
            aria-label="Plan stops"
            className="flex gap-2 overflow-x-auto pb-1"
          >
            {stops.map((stop, i) => {
              const VibeIcon = VIBE_ICONS[stop.vibe];
              const active = stop.uid === focusedUid;
              const label =
                spaces.find((sp) => sp.id === stop.space_id)?.name ??
                stop.custom_location ??
                "Pin";
              return (
                <button
                  key={stop.uid}
                  role="tab"
                  aria-selected={active}
                  type="button"
                  onClick={() => handleFocusStop(stop.uid)}
                  className={cn(
                    "inline-flex shrink-0 items-center gap-2 rounded-full border px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta",
                    active
                      ? "border-terracotta bg-terracotta/15 text-paper"
                      : "border-ink-4 bg-ink-1 text-paper-mute hover:border-paper",
                  )}
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-terracotta font-mono text-[10px] text-ink-0">
                    {i + 1}
                  </span>
                  <span className="max-w-[10ch] truncate">{label}</span>
                  <VibeIcon className="h-3 w-3 text-terracotta" />
                </button>
              );
            })}
            <button
              type="button"
              onClick={startPicker}
              aria-label={t("addStop")}
              className={cn(
                "inline-flex shrink-0 items-center gap-1.5 rounded-full border-2 border-dashed px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta",
                pickerMode
                  ? "border-terracotta text-paper"
                  : "border-ink-4 text-paper-mute hover:border-paper hover:text-paper",
              )}
            >
              <Plus className="h-4 w-4" />
              {stops.length === 0 ? t("addFirstStop") : t("addStop")}
            </button>
          </div>
        </div>

        {/* Focused stop editor */}
        <div ref={editorRef}>
          {focusedStop ? (
            <PlanStopEditor
              key={focusedStop.uid}
              stop={focusedStop}
              index={stops.findIndex((s) => s.uid === focusedUid)}
              total={stops.length}
              onChange={(next) => updateStop(focusedStop.uid, next)}
              onRemove={() => removeStop(focusedStop.uid)}
              onRequestRePin={startPicker}
            />
          ) : (
            <div className="px-4 py-8 text-center text-sm text-paper-dim">
              {pickerMode ? t("pickerHint") : t("tapAStopHint")}
            </div>
          )}
        </div>

        {/* Capacity (optional) */}
        {stops.length > 0 && (
          <div className="border-t border-ink-3 px-4 py-4">
            <Input
              label={t("capacityLabel")}
              type="number"
              min={2}
              max={20}
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              placeholder={t("capacityPlaceholder")}
              helperText={t("capacityHelp")}
            />
          </div>
        )}

        {/* Submit */}
        <div className="sticky bottom-0 border-t border-ink-3 bg-ink-1 px-4 py-3">
          <Button
            type="submit"
            size="lg"
            loading={loading}
            disabled={stops.length === 0}
            className="w-full"
          >
            {t("submit")}
          </Button>
        </div>
      </BottomSheet>
    </form>
  );
}

function DayChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex min-h-[36px] items-center rounded-full border px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta",
        active
          ? "border-terracotta bg-terracotta/10 text-paper"
          : "border-ink-4 text-paper-mute hover:border-paper",
      )}
    >
      {label}
    </button>
  );
}
