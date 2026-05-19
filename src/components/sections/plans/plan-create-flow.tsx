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
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
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
    transport_mode: null,
    transport_price_min: "",
    transport_price_max: "",
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
    transport_mode: null,
    transport_price_min: "",
    transport_price_max: "",
  };
}

export interface PlanInitialState {
  /** Existing plan id when editing - switches submit to PATCH. */
  id: string;
  scheduled_date: string;
  title: string;
  capacity: number | null;
  stops: Array<{
    space_id: string | null;
    custom_location: string | null;
    neighborhood_slug: string | null;
    lat: number | null;
    lng: number | null;
    start_time: string | null;
    end_time: string | null;
    vibe: PlanVibe;
    notes: string | null;
    transport_mode: import("@/lib/plans/transport").TransportMode | null;
    transport_price_min: number | null;
    transport_price_max: number | null;
  }>;
}

interface PlanCreateFlowProps {
  /** When provided, the flow becomes an edit flow for that plan. */
  initial?: PlanInitialState;
  /**
   * Host's member_type. Drives whether the "Charge an entry fee" mode
   * is exposed. Phase 2 limits ticketing to local_guide + tour_guide;
   * Phase 3 will further gate by Blue-badge verification.
   */
  hostRole?: "nomad" | "remote_worker" | "local_guide" | "tour_guide" | null;
}

export function PlanCreateFlow({
  initial,
  hostRole = null,
}: PlanCreateFlowProps = {}) {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("plans.create");
  const tMoney = useTranslations("plans.money");
  const isEdit = !!initial;

  const canTicket = hostRole === "local_guide" || hostRole === "tour_guide";

  const today = todayInIstanbul();
  const tomorrow = addDays(today, 1);

  const [scheduledDate, setScheduledDate] = useState(
    initial?.scheduled_date ?? today,
  );
  const [title, setTitle] = useState(initial?.title ?? "");
  const [capacity, setCapacity] = useState(
    initial?.capacity != null ? String(initial.capacity) : "",
  );
  // Phase 2 money state. Lira-denominated string inputs serialize to
  // _cents on submit. is_ticketed only ever flips true for canTicket
  // hosts (UI hides the toggle for others; server still verifies).
  const [isTicketed, setIsTicketed] = useState(false);
  const [entryFeeLira, setEntryFeeLira] = useState("");
  const [budgetMinLira, setBudgetMinLira] = useState("");
  const [budgetMaxLira, setBudgetMaxLira] = useState("");
  // Compute initial stops + first focused uid together so the edit flow
  // can open with the first stop focused (no setState-in-effect dance).
  const initialStops = useMemo<EditableStop[]>(
    () =>
      initial?.stops.map<EditableStop>((s) => ({
        uid: uid(),
        space_id: s.space_id,
        custom_location: s.custom_location,
        neighborhood_slug: s.neighborhood_slug,
        lat: s.lat,
        lng: s.lng,
        start_time: s.start_time ?? "",
        end_time: s.end_time ?? "",
        vibe: s.vibe,
        notes: s.notes ?? "",
        transport_mode: s.transport_mode,
        transport_price_min:
          s.transport_price_min != null ? String(s.transport_price_min) : "",
        transport_price_max:
          s.transport_price_max != null ? String(s.transport_price_max) : "",
      })) ?? [],
    // initial only matters at first render; the prop is conceptually a one-shot seed.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  const [stops, setStops] = useState<EditableStop[]>(initialStops);
  const [focusedUid, setFocusedUid] = useState<string | null>(
    isEdit ? (initialStops[0]?.uid ?? null) : null,
  );
  // Edit mode opens directly in the editor; create mode opens in picker.
  const [pickerMode, setPickerMode] = useState(!isEdit);
  /**
   * When set, the next "pick a space" / "drop a pin" REPLACES the
   * location on this stop's uid instead of creating a new stop.
   */
  const [replacingUid, setReplacingUid] = useState<string | null>(null);
  const [sheetHeight, setSheetHeight] = useState<SheetHeight>(
    isEdit ? "half" : "peek",
  );
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

  const handlePickSpace = useCallback(
    (sp: NomadSpace) => {
      if (replacingUid) {
        setStops((prev) =>
          prev.map((s) =>
            s.uid === replacingUid
              ? {
                  ...s,
                  space_id: sp.id,
                  custom_location: null,
                  neighborhood_slug:
                    neighborhoods.find(
                      (n) =>
                        n.name.toLowerCase() === sp.neighborhood.toLowerCase(),
                    )?.slug ?? null,
                  lat: sp.coordinates[1],
                  lng: sp.coordinates[0],
                }
              : s,
          ),
        );
        setFocusedUid(replacingUid);
        setReplacingUid(null);
      } else {
        const stop = makeStopFromSpace(sp);
        setStops((prev) => [...prev, stop]);
        setFocusedUid(stop.uid);
      }
      setPickerMode(false);
      setSheetHeight("half");
    },
    [replacingUid],
  );

  const handleDropCustomPin = useCallback(
    (lat: number, lng: number) => {
      if (replacingUid) {
        setStops((prev) =>
          prev.map((s) =>
            s.uid === replacingUid
              ? {
                  ...s,
                  space_id: null,
                  custom_location: s.custom_location ?? "",
                  neighborhood_slug: inferNeighborhood(lat, lng),
                  lat,
                  lng,
                }
              : s,
          ),
        );
        setFocusedUid(replacingUid);
        setReplacingUid(null);
      } else {
        const stop = makeStopFromPin(lat, lng);
        setStops((prev) => [...prev, stop]);
        setFocusedUid(stop.uid);
      }
      setPickerMode(false);
      setSheetHeight("half");
    },
    [replacingUid],
  );

  const handleFocusStop = useCallback((targetUid: string) => {
    setFocusedUid(targetUid);
    setPickerMode(false);
    setReplacingUid(null);
    setSheetHeight("half");
  }, []);

  function startAddPicker() {
    setFocusedUid(null);
    setReplacingUid(null);
    setPickerMode(true);
    setSheetHeight("peek");
  }

  function startReplacePicker(targetUid: string) {
    setReplacingUid(targetUid);
    setFocusedUid(targetUid);
    setPickerMode(true);
    setSheetHeight("peek");
  }

  function cancelPicker() {
    setPickerMode(false);
    setReplacingUid(null);
    if (stops.length > 0) {
      setFocusedUid((cur) => cur ?? stops[0]!.uid);
      setSheetHeight("half");
    }
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

    // Lira (display unit) → cents (DB unit). 100 cents = 1 TL.
    const liraToCents = (s: string) => {
      const n = Number(s);
      return Number.isFinite(n) && n > 0 ? Math.round(n * 100) : null;
    };
    const body = {
      scheduled_date: scheduledDate,
      title: title.trim() || autoTitle || "Today",
      capacity: capacity ? Number(capacity) : null,
      language: locale,
      is_ticketed: canTicket && isTicketed,
      entry_fee_cents:
        canTicket && isTicketed ? liraToCents(entryFeeLira) : null,
      budget_per_person_min_cents: !isTicketed
        ? liraToCents(budgetMinLira)
        : null,
      budget_per_person_max_cents: !isTicketed
        ? liraToCents(budgetMaxLira)
        : null,
      currency: "TRY",
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
        transport_mode: s.transport_mode ?? null,
        transport_price_min: s.transport_price_min
          ? Number(s.transport_price_min)
          : null,
        transport_price_max: s.transport_price_max
          ? Number(s.transport_price_max)
          : null,
      })),
    };

    try {
      const url = isEdit ? `/api/plans/${initial.id}` : "/api/plans";
      const method = isEdit ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!res.ok) {
        showToast.error(t("errorTitle"), json.error);
        return;
      }
      showToast.success(isEdit ? t("updateSuccess") : t("successTitle"));
      const planId = isEdit ? initial.id : json.data.id;
      router.push(`/plans/${planId}` as never);
    } catch {
      showToast.error(t("errorTitle"), t("errorBody"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container className="py-4 md:py-6">
      <form
        onSubmit={handleSubmit}
        className="relative h-[calc(100svh-9rem)] max-h-[840px] overflow-hidden rounded-lg border border-ink-3 bg-ink-1"
      >
        {/* Map fills the card, sheet sits absolute at the bottom */}
        <PlanCreateMap
          stops={stops}
          focusedUid={focusedUid}
          pickerMode={pickerMode}
          onPickSpace={handlePickSpace}
          onDropCustomPin={handleDropCustomPin}
          onFocusStop={handleFocusStop}
        />

        {/* Picker cancel button - only when in picker mode AND we have stops */}
        {pickerMode && stops.length > 0 && (
          <button
            type="button"
            onClick={cancelPicker}
            className="absolute end-4 top-20 z-20 rounded-full border border-ink-4 bg-ink-0/90 px-4 py-2 text-xs font-medium text-paper backdrop-blur-md transition-colors hover:border-paper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
          >
            {t("cancelPicker")}
          </button>
        )}

        <BottomSheet
          height={sheetHeight}
          onHeightChange={setSheetHeight}
          ariaLabel="Create plan"
          caption={
            stops.length === 0
              ? t("addFirstStop")
              : t("stopCountCaption", { count: stops.length })
          }
        >
          {/* Header: title + date in one compact row */}
          <div className="flex items-center gap-2 px-4 py-2.5">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={autoTitle || t("titlePlaceholder")}
              maxLength={80}
              aria-label={t("titleLabel")}
              className="min-w-0 flex-1 border-0 bg-transparent p-0 font-display text-base text-paper placeholder:text-paper-faint focus-visible:outline-none"
            />
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
              className="w-9 cursor-pointer rounded-md border border-ink-3 bg-transparent p-1.5 text-xs text-paper focus-visible:border-terracotta focus-visible:outline-none"
            />
          </div>

          {/* Stop chips row */}
          <div className="border-t border-ink-3 px-4 py-2.5">
            <div
              role="tablist"
              aria-label="Plan stops"
              className="flex gap-1.5 overflow-x-auto"
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
                      "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta",
                      active
                        ? "border-terracotta bg-terracotta/15 text-paper"
                        : "border-ink-3 text-paper-mute hover:border-paper",
                    )}
                  >
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-terracotta font-mono text-[9px] text-ink-0">
                      {i + 1}
                    </span>
                    <span className="max-w-[10ch] truncate">{label}</span>
                    <VibeIcon className="h-3 w-3 text-terracotta" aria-hidden />
                  </button>
                );
              })}
              <button
                type="button"
                onClick={startAddPicker}
                aria-label={t("addStop")}
                className={cn(
                  "inline-flex shrink-0 items-center gap-1 rounded-full border border-dashed px-2.5 py-1.5 text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta",
                  pickerMode && !replacingUid
                    ? "border-terracotta text-paper"
                    : "border-ink-3 text-paper-mute hover:border-paper hover:text-paper",
                )}
              >
                <Plus className="h-3.5 w-3.5" aria-hidden />
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
                onRequestChangeLocation={() =>
                  startReplacePicker(focusedStop.uid)
                }
              />
            ) : (
              <div className="px-4 py-8 text-center text-sm text-paper-dim">
                {pickerMode ? t("pickerHint") : t("tapAStopHint")}
              </div>
            )}
          </div>

          {/* Capacity (optional, inline + minimal) */}
          {stops.length > 0 && (
            <div className="flex items-center gap-3 border-t border-ink-3 px-4 py-3">
              <label
                htmlFor="plan-capacity"
                className="font-mono text-[10px] uppercase tracking-wider text-paper-mute"
              >
                {t("capacityLabel")}
              </label>
              <input
                id="plan-capacity"
                type="number"
                min={2}
                max={20}
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                placeholder="-"
                className="w-16 rounded-md border border-ink-3 bg-transparent px-2 py-1 text-sm text-paper placeholder:text-paper-faint focus-visible:border-terracotta focus-visible:outline-none"
              />
            </div>
          )}

          {/* Phase 2 money block. Budget mode by default. Ticketed mode
              only exposed for canTicket hosts and disabled with a
              "Verification required" tooltip until Phase 3. */}
          {stops.length > 0 && (
            <div className="space-y-3 border-t border-ink-3 px-4 py-4">
              <div className="font-mono text-[10px] uppercase tracking-wider text-paper-mute">
                {tMoney("sectionLabel")}
              </div>

              {canTicket && (
                <div
                  className="flex items-center justify-between gap-3 rounded-md border border-ink-3 px-3 py-2"
                  title={tMoney("verificationRequiredHint")}
                >
                  <div className="text-sm text-paper">
                    <div>{tMoney("ticketedToggleLabel")}</div>
                    <div className="text-[11px] text-paper-mute">
                      {tMoney("verificationRequiredHint")}
                    </div>
                  </div>
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isTicketed}
                      onChange={(e) => setIsTicketed(e.target.checked)}
                      disabled
                      className="h-4 w-4 rounded border-ink-3 opacity-50"
                    />
                    <span className="font-mono text-[10px] uppercase tracking-wider text-paper-faint">
                      {tMoney("verificationLockedTag")}
                    </span>
                  </label>
                </div>
              )}

              {!isTicketed && (
                <div className="grid grid-cols-2 gap-2">
                  <label className="flex flex-col gap-1">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-paper-mute">
                      {tMoney("budgetMinLabel")}
                    </span>
                    <input
                      type="number"
                      min={0}
                      step={10}
                      value={budgetMinLira}
                      onChange={(e) => setBudgetMinLira(e.target.value)}
                      placeholder="0"
                      className="rounded-md border border-ink-3 bg-transparent px-2 py-1.5 text-sm text-paper placeholder:text-paper-faint focus-visible:border-terracotta focus-visible:outline-none"
                    />
                  </label>
                  <label className="flex flex-col gap-1">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-paper-mute">
                      {tMoney("budgetMaxLabel")}
                    </span>
                    <input
                      type="number"
                      min={0}
                      step={10}
                      value={budgetMaxLira}
                      onChange={(e) => setBudgetMaxLira(e.target.value)}
                      placeholder="0"
                      className="rounded-md border border-ink-3 bg-transparent px-2 py-1.5 text-sm text-paper placeholder:text-paper-faint focus-visible:border-terracotta focus-visible:outline-none"
                    />
                  </label>
                </div>
              )}

              {isTicketed && canTicket && (
                <label className="flex flex-col gap-1">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-paper-mute">
                    {tMoney("entryFeeLabel")}
                  </span>
                  <input
                    type="number"
                    min={1}
                    step={10}
                    value={entryFeeLira}
                    onChange={(e) => setEntryFeeLira(e.target.value)}
                    placeholder="0"
                    className="rounded-md border border-ink-3 bg-transparent px-2 py-1.5 text-sm text-paper placeholder:text-paper-faint focus-visible:border-terracotta focus-visible:outline-none"
                  />
                </label>
              )}
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
              {isEdit ? t("updateSubmit") : t("submit")}
            </Button>
          </div>
        </BottomSheet>
      </form>
    </Container>
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
        "inline-flex shrink-0 items-center rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta",
        active
          ? "border-terracotta bg-terracotta/10 text-paper"
          : "border-ink-3 text-paper-mute hover:border-paper",
      )}
    >
      {label}
    </button>
  );
}
