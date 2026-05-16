"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "@/lib/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { Input, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { showToast } from "@/lib/toast";
import { PLAN_VIBES, VIBE_ICONS, type PlanVibe } from "@/lib/plans/vibes";
import type { NeighborhoodSlug } from "@/lib/neighborhoods";
import { todayInIstanbul, addDays } from "@/lib/plans/expiry";

interface SpaceOption {
  id: string;
  name: string;
  neighborhood: string;
}

interface Props {
  spaces: SpaceOption[];
  neighborhoods: ReadonlyArray<{ slug: NeighborhoodSlug; name: string }>;
}

export function PlanCreateForm({ spaces, neighborhoods }: Props) {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("plans.create");
  const tVibes = useTranslations("plans.vibes");

  const today = todayInIstanbul();
  const tomorrow = addDays(today, 1);

  const [date, setDate] = useState(today);
  const [vibe, setVibe] = useState<PlanVibe>("cowork");
  const [spaceId, setSpaceId] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const fd = new FormData(e.currentTarget);
    const space = spaceId ? spaces.find((s) => s.id === spaceId) : null;
    const body = {
      scheduled_date: fd.get("scheduled_date"),
      start_time: fd.get("start_time"),
      end_time: fd.get("end_time"),
      space_id: spaceId || null,
      neighborhood_slug:
        space?.neighborhood?.toLowerCase() ||
        (fd.get("neighborhood_slug") as string) ||
        null,
      custom_location: spaceId ? null : (fd.get("custom_location") as string),
      title: fd.get("title"),
      vibe,
      notes: fd.get("notes"),
      capacity: fd.get("capacity") || null,
      language: locale,
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
    <form onSubmit={handleSubmit} className="space-y-10">
      {/* When */}
      <section>
        <h2 className="font-mono text-[11px] uppercase tracking-wider text-terracotta">
          01 · {t("whenTitle")}
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-[auto_auto_1fr]">
          <div className="flex gap-2">
            <DayButton
              active={date === today}
              onClick={() => setDate(today)}
              label={t("today")}
            />
            <DayButton
              active={date === tomorrow}
              onClick={() => setDate(tomorrow)}
              label={t("tomorrow")}
            />
          </div>
          <Input
            type="date"
            name="scheduled_date"
            value={date}
            min={today}
            onChange={(e) => setDate(e.target.value)}
            className="w-auto"
          />
        </div>
        <input type="hidden" name="scheduled_date" value={date} />
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <Input
            label={t("startTime")}
            type="time"
            name="start_time"
            placeholder="14:00"
          />
          <Input
            label={t("endTime")}
            type="time"
            name="end_time"
            placeholder="18:00"
          />
        </div>
      </section>

      {/* Where */}
      <section>
        <h2 className="font-mono text-[11px] uppercase tracking-wider text-terracotta">
          02 · {t("whereTitle")}
        </h2>
        <div className="mt-4 space-y-3">
          <div>
            <label className="block text-sm font-medium text-paper">
              {t("pickSpace")}
            </label>
            <select
              value={spaceId}
              onChange={(e) => setSpaceId(e.target.value)}
              className="mt-1.5 w-full rounded-md border border-ink-4 bg-ink-2 px-3 py-2 text-sm text-paper"
            >
              <option value="">{t("orCustom")}</option>
              {spaces.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} - {s.neighborhood}
                </option>
              ))}
            </select>
          </div>
          {!spaceId && (
            <>
              <Input
                label={t("customLocation")}
                name="custom_location"
                placeholder={t("customLocationPlaceholder")}
                maxLength={120}
              />
              <div>
                <label className="block text-sm font-medium text-paper">
                  {t("neighborhood")}
                </label>
                <select
                  name="neighborhood_slug"
                  className="mt-1.5 w-full rounded-md border border-ink-4 bg-ink-2 px-3 py-2 text-sm text-paper"
                  defaultValue=""
                >
                  <option value="">-</option>
                  {neighborhoods.map((n) => (
                    <option key={n.slug} value={n.slug}>
                      {n.name}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}
        </div>
      </section>

      {/* What */}
      <section>
        <h2 className="font-mono text-[11px] uppercase tracking-wider text-terracotta">
          03 · {t("whatTitle")}
        </h2>
        <div className="mt-4 space-y-3">
          <Input
            label={t("titleLabel")}
            name="title"
            placeholder={t("titlePlaceholder")}
            maxLength={80}
            required
          />
          <div>
            <label className="block text-sm font-medium text-paper">
              {t("vibeLabel")}
            </label>
            <div className="mt-2 flex flex-wrap gap-2">
              {PLAN_VIBES.map((v) => {
                const Icon = VIBE_ICONS[v as PlanVibe];
                const active = v === vibe;
                return (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setVibe(v as PlanVibe)}
                    className={cn(
                      "inline-flex items-center gap-1.5 border px-3 py-2 font-mono text-[11px] uppercase tracking-wider transition-colors",
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
          <Textarea
            label={t("notesLabel")}
            name="notes"
            placeholder={t("notesPlaceholder")}
            maxLength={280}
            helperText={t("notesHelp")}
          />
        </div>
      </section>

      {/* Who */}
      <section>
        <h2 className="font-mono text-[11px] uppercase tracking-wider text-terracotta">
          04 · {t("whoTitle")}
        </h2>
        <div className="mt-4">
          <Input
            label={t("capacityLabel")}
            name="capacity"
            type="number"
            min={2}
            max={20}
            placeholder={t("capacityPlaceholder")}
            helperText={t("capacityHelp")}
          />
        </div>
      </section>

      <Button type="submit" loading={loading} size="lg" className="w-full">
        {t("submit")}
      </Button>
    </form>
  );
}

function DayButton({
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
      className={cn(
        "border px-4 py-2 font-mono text-[11px] uppercase tracking-wider transition-colors",
        active
          ? "border-terracotta bg-terracotta/10 text-paper"
          : "border-ink-4 text-paper-mute hover:border-ink-5",
      )}
    >
      {label}
    </button>
  );
}
