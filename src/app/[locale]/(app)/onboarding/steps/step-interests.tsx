"use client";

import { useState, type KeyboardEvent } from "react";
import { useTranslations } from "next-intl";
import type { OnboardingData, FieldErrors } from "../onboarding-wizard";
import { CURRENT_STATUS_OPTIONS } from "@/lib/member-profile";

interface StepProps {
  data: OnboardingData;
  updateField: (field: string, value: unknown) => void;
  errors: FieldErrors;
}

// Each option keeps a stable slug value used for storage. The label is
// translated; the slug is locale-agnostic so existing DB values keep working.
type OptionDef = { key: string; value: string };

const HEARD_FROM: readonly OptionDef[] = [
  { key: "instagram", value: "instagram" },
  { key: "friend", value: "friend-recommendation" },
  { key: "event", value: "event-invitation" },
  { key: "website", value: "website" },
  { key: "other", value: "other" },
];

// Onboarding only asks the two self-serve roles. Local guides, tour
// guides, and paperwork agents apply through their own dedicated forms,
// so we don't crowd the nomad signup with options that need vetting.
const ONBOARDING_ROLES = ["nomad", "remote_worker"] as const;
type OnboardingRole = (typeof ONBOARDING_ROLES)[number];
const MEMBER_TYPE_OPTIONS: readonly {
  key: OnboardingRole;
  value: OnboardingRole;
}[] = ONBOARDING_ROLES.map((r) => ({ key: r, value: r }));

// Where the member is in their move to Istanbul. Stored in arrival_status.
const ARRIVAL_STATUS: readonly OptionDef[] = [
  { key: "in_istanbul", value: "in_istanbul" },
  { key: "elsewhere_turkey", value: "elsewhere_turkey" },
  { key: "planning", value: "planning" },
];

const ACTIVITIES: readonly OptionDef[] = [
  { key: "language", value: "language-exchange" },
  { key: "social", value: "social-nights" },
  { key: "coworking", value: "coworking-days" },
  { key: "hiking", value: "hiking" },
  { key: "dining", value: "dining-events" },
  { key: "sports", value: "sports" },
  { key: "workshops", value: "workshops" },
  { key: "cultural", value: "cultural-trips" },
  { key: "networking", value: "networking-events" },
  { key: "other", value: "other" },
];

const LOOKING_FOR: readonly OptionDef[] = [
  { key: "friends", value: "making-new-friends" },
  { key: "social", value: "social-life" },
  { key: "networking", value: "professional-networking" },
  { key: "language", value: "language-practice" },
  { key: "activities", value: "activities-hobbies" },
  { key: "exploring", value: "exploring-istanbul" },
  { key: "other", value: "other" },
];

function RadioGroup({
  label,
  options,
  optionLabels,
  value,
  onChange,
  required,
  error,
  fieldKey,
}: {
  label: string;
  options: readonly OptionDef[];
  optionLabels: (key: string) => string;
  value: string;
  onChange: (val: string) => void;
  required?: boolean;
  error?: string;
  fieldKey?: string;
}) {
  return (
    <div data-field={fieldKey}>
      <label className="block text-sm font-medium text-neutral-700 dark:text-[#d4c4b4]">
        {label}
        {required && (
          <span className="ml-0.5 text-red-500" aria-hidden="true">
            *
          </span>
        )}
      </label>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt.key}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
              value === opt.value
                ? "bg-primary-600 text-white"
                : "bg-white/70 text-[#5d6d7e] ring-1 ring-black/5 hover:bg-primary-50 dark:bg-[#1e2130] dark:text-[#99a3ad] dark:ring-white/5"
            }`}
          >
            {optionLabels(opt.key)}
          </button>
        ))}
      </div>
      {error && (
        <p className="animate-error-fade-in mt-1.5 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}

// Free-text chip input. Press Enter (or comma) to add. Click chip to
// remove. Stores values as a string[] in the form state.
function ChipInput({
  label,
  hint,
  value,
  onChange,
  max,
}: {
  label: string;
  hint: string;
  value: string[];
  onChange: (next: string[]) => void;
  max: number;
}) {
  const t = useTranslations("onboardingPage.steps.interests");
  const [draft, setDraft] = useState("");

  function commit() {
    const trimmed = draft.trim();
    if (!trimmed) return;
    if (value.length >= max) return;
    if (value.includes(trimmed)) {
      setDraft("");
      return;
    }
    onChange([...value, trimmed]);
    setDraft("");
  }

  function handleKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      commit();
    } else if (e.key === "Backspace" && draft === "" && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium text-neutral-700 dark:text-[#d4c4b4]">
        {label}
      </label>
      <p className="mt-1 text-xs text-[#5d6d7e] dark:text-[#99a3ad]">{hint}</p>
      <div className="mt-2 flex flex-wrap items-center gap-2 rounded-xl border border-black/5 bg-white/70 px-2.5 py-2 dark:border-white/5 dark:bg-[#1e2130]">
        {value.map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => onChange(value.filter((x) => x !== v))}
            aria-label={`${t("chipRemove")}: ${v}`}
            className="group inline-flex items-center gap-1 rounded-full bg-primary-100 px-2.5 py-1 text-xs font-medium text-primary-800 transition-colors hover:bg-red-100 hover:text-red-700 dark:bg-primary-950/40 dark:text-primary-200 dark:hover:bg-red-950/40 dark:hover:text-red-300"
          >
            {v}
            <span className="opacity-50 group-hover:opacity-100" aria-hidden>
              ×
            </span>
          </button>
        ))}
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKey}
          onBlur={commit}
          placeholder={value.length === 0 ? t("chipPlaceholder") : ""}
          maxLength={60}
          disabled={value.length >= max}
          className="min-w-[120px] flex-1 bg-transparent text-sm text-[#1a1a2e] placeholder:text-[#5d6d7e]/60 focus:outline-none disabled:opacity-50 dark:text-[#f2f3f4] dark:placeholder:text-[#99a3ad]/60"
        />
      </div>
    </div>
  );
}

function CheckboxGroup({
  label,
  options,
  optionLabels,
  value,
  onChange,
}: {
  label: string;
  options: readonly OptionDef[];
  optionLabels: (key: string) => string;
  value: string[];
  onChange: (val: string[]) => void;
}) {
  function toggle(optValue: string) {
    if (value.includes(optValue)) {
      onChange(value.filter((v) => v !== optValue));
    } else {
      onChange([...value, optValue]);
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium text-neutral-700 dark:text-[#d4c4b4]">
        {label}
      </label>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt.key}
            type="button"
            onClick={() => toggle(opt.value)}
            className={`rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
              value.includes(opt.value)
                ? "bg-primary-600 text-white"
                : "bg-white/70 text-[#5d6d7e] ring-1 ring-black/5 hover:bg-primary-50 dark:bg-[#1e2130] dark:text-[#99a3ad] dark:ring-white/5"
            }`}
          >
            {optionLabels(opt.key)}
          </button>
        ))}
      </div>
    </div>
  );
}

export function StepInterests({ data, updateField, errors }: StepProps) {
  const t = useTranslations("onboardingPage.steps.interests");
  const tHeard = useTranslations(
    "onboardingPage.steps.interests.heardFromOptions",
  );
  const tMember = useTranslations(
    "onboardingPage.steps.interests.memberTypeOptions",
  );
  const tMemberDesc = useTranslations(
    "onboardingPage.steps.interests.memberTypeDescriptions",
  );
  const tArrival = useTranslations(
    "onboardingPage.steps.interests.arrivalStatusOptions",
  );
  const tStatus = useTranslations(
    "onboardingPage.steps.interests.currentStatusOptions",
  );
  const tActivity = useTranslations(
    "onboardingPage.steps.interests.activityOptions",
  );
  const tLooking = useTranslations(
    "onboardingPage.steps.interests.lookingForOptions",
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#1a1a2e] dark:text-[#f2f3f4]">
          {t("title")}
        </h2>
        <p className="mt-1 text-sm text-[#5d6d7e] dark:text-[#99a3ad]">
          {t("intro")}
        </p>
      </div>

      <RadioGroup
        label={t("heardFrom")}
        options={HEARD_FROM}
        optionLabels={(k) => tHeard(k)}
        value={(data.heard_from as string) || ""}
        onChange={(v) => updateField("heard_from", v)}
      />

      <div data-field="member_type">
        <label className="block text-sm font-medium text-neutral-700 dark:text-[#d4c4b4]">
          {t("memberType")}
          <span className="ml-0.5 text-red-500" aria-hidden="true">
            *
          </span>
        </label>
        <p className="mt-1 text-xs text-[#5d6d7e] dark:text-[#99a3ad]">
          {t("memberTypeHint")}
        </p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {MEMBER_TYPE_OPTIONS.map((opt) => {
            const selected = data.member_type === opt.value;
            return (
              <button
                key={opt.key}
                type="button"
                onClick={() => updateField("member_type", opt.value)}
                className={`rounded-xl border p-3 text-start text-sm transition-colors ${
                  selected
                    ? "border-primary-600 bg-primary-50 dark:border-primary-400 dark:bg-primary-950/30"
                    : "border-black/5 bg-white/70 hover:border-primary-300 dark:border-white/5 dark:bg-[#1e2130] dark:hover:border-primary-700"
                }`}
              >
                <div className="font-medium text-[#1a1a2e] dark:text-[#f2f3f4]">
                  {tMember(opt.key)}
                </div>
                <div className="mt-1 text-xs leading-relaxed text-[#5d6d7e] dark:text-[#99a3ad]">
                  {tMemberDesc(opt.key)}
                </div>
              </button>
            );
          })}
        </div>
        {errors.member_type && (
          <p className="animate-error-fade-in mt-1.5 text-sm text-red-600 dark:text-red-400">
            {errors.member_type}
          </p>
        )}
      </div>

      {/* Arrival status - where they are in the move to Istanbul. */}
      <RadioGroup
        label={t("arrivalStatusLabel")}
        options={ARRIVAL_STATUS}
        optionLabels={(k) => tArrival(k)}
        value={(data.arrival_status as string) || ""}
        onChange={(v) => updateField("arrival_status", v)}
      />

      {/* Stay window - roughly how long they're around. Both optional. */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="move_in_date"
            className="block text-sm font-medium text-neutral-700 dark:text-[#d4c4b4]"
          >
            {t("moveInLabel")}
          </label>
          <input
            id="move_in_date"
            type="date"
            value={(data.move_in_date as string) || ""}
            onChange={(e) => updateField("move_in_date", e.target.value)}
            className="mt-2 w-full rounded-xl border border-black/5 bg-white/70 px-3 py-2 text-sm text-[#1a1a2e] focus:border-primary-400 focus:outline-none dark:border-white/5 dark:bg-[#1e2130] dark:text-[#f2f3f4]"
          />
        </div>
        <div>
          <label
            htmlFor="planned_move_out_date"
            className="block text-sm font-medium text-neutral-700 dark:text-[#d4c4b4]"
          >
            {t("moveOutLabel")}
          </label>
          <input
            id="planned_move_out_date"
            type="date"
            value={(data.planned_move_out_date as string) || ""}
            onChange={(e) =>
              updateField("planned_move_out_date", e.target.value)
            }
            className="mt-2 w-full rounded-xl border border-black/5 bg-white/70 px-3 py-2 text-sm text-[#1a1a2e] focus:border-primary-400 focus:outline-none dark:border-white/5 dark:bg-[#1e2130] dark:text-[#f2f3f4]"
          />
        </div>
      </div>

      {data.member_type === "remote_worker" && (
        <div>
          <label
            htmlFor="professional_role"
            className="block text-sm font-medium text-neutral-700 dark:text-[#d4c4b4]"
          >
            {t("professionalRoleLabel")}
          </label>
          <input
            id="professional_role"
            type="text"
            maxLength={120}
            value={(data.professional_role as string) || ""}
            onChange={(e) => updateField("professional_role", e.target.value)}
            placeholder={t("professionalRolePlaceholder")}
            className="mt-2 w-full rounded-xl border border-black/5 bg-white/70 px-3 py-2 text-sm text-[#1a1a2e] placeholder:text-[#5d6d7e]/60 focus:border-primary-400 focus:outline-none dark:border-white/5 dark:bg-[#1e2130] dark:text-[#f2f3f4] dark:placeholder:text-[#99a3ad]/60"
          />
        </div>
      )}

      {/* Phase 4 (3.12.0): current vibe + free-text chip fields. */}
      <div data-field="current_status">
        <label className="block text-sm font-medium text-neutral-700 dark:text-[#d4c4b4]">
          {t("currentStatusLabel")}
        </label>
        <p className="mt-1 text-xs text-[#5d6d7e] dark:text-[#99a3ad]">
          {t("currentStatusHint")}
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {CURRENT_STATUS_OPTIONS.map((status) => {
            const selected = data.current_status === status;
            return (
              <button
                key={status}
                type="button"
                onClick={() => updateField("current_status", status)}
                className={`rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                  selected
                    ? "bg-primary-600 text-white"
                    : "bg-white/70 text-[#5d6d7e] ring-1 ring-black/5 hover:bg-primary-50 dark:bg-[#1e2130] dark:text-[#99a3ad] dark:ring-white/5"
                }`}
              >
                {tStatus(status)}
              </button>
            );
          })}
        </div>
      </div>

      <ChipInput
        label={t("skillsLabel")}
        hint={t("skillsHint")}
        value={(data.skills as string[]) || []}
        onChange={(v) => updateField("skills", v)}
        max={12}
      />
      <ChipInput
        label={t("workingOnLabel")}
        hint={t("workingOnHint")}
        value={(data.working_on as string[]) || []}
        onChange={(v) => updateField("working_on", v)}
        max={8}
      />
      <ChipInput
        label={t("wantsToTalkLabel")}
        hint={t("wantsToTalkHint")}
        value={(data.wants_to_talk_about as string[]) || []}
        onChange={(v) => updateField("wants_to_talk_about", v)}
        max={8}
      />
      <ChipInput
        label={t("hobbiesLabel")}
        hint={t("hobbiesHint")}
        value={(data.hobbies as string[]) || []}
        onChange={(v) => updateField("hobbies", v)}
        max={12}
      />
      <ChipInput
        label={t("favoriteSpotsLabel")}
        hint={t("favoriteSpotsHint")}
        value={(data.favorite_spots as string[]) || []}
        onChange={(v) => updateField("favorite_spots", v)}
        max={10}
      />

      <CheckboxGroup
        label={t("activities")}
        options={ACTIVITIES}
        optionLabels={(k) => tActivity(k)}
        value={(data.activity_interests as string[]) || []}
        onChange={(v) => updateField("activity_interests", v)}
      />

      <CheckboxGroup
        label={t("lookingFor")}
        options={LOOKING_FOR}
        optionLabels={(k) => tLooking(k)}
        value={(data.looking_for as string[]) || []}
        onChange={(v) => updateField("looking_for", v)}
      />
    </div>
  );
}
