"use client";

import { useTranslations } from "next-intl";
import type { OnboardingData, FieldErrors } from "../onboarding-wizard";
import { MEMBER_ROLES, type MemberRole } from "@/lib/member-roles";

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

// The 5 operational roles (PRODUCT.md §3). The key matches the DB enum
// value verbatim so we don't need a slug<->display mapping.
const MEMBER_TYPE_OPTIONS: readonly { key: MemberRole; value: MemberRole }[] =
  MEMBER_ROLES.map((r) => ({ key: r, value: r }));

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

      {data.member_type === "tour_guide" && (
        <div>
          <label
            htmlFor="tour_guide_license_no"
            className="block text-sm font-medium text-neutral-700 dark:text-[#d4c4b4]"
          >
            {t("tourGuideLicenseLabel")}
          </label>
          <input
            id="tour_guide_license_no"
            type="text"
            maxLength={60}
            value={(data.tour_guide_license_no as string) || ""}
            onChange={(e) =>
              updateField("tour_guide_license_no", e.target.value)
            }
            className="mt-2 w-full rounded-xl border border-black/5 bg-white/70 px-3 py-2 text-sm text-[#1a1a2e] focus:border-primary-400 focus:outline-none dark:border-white/5 dark:bg-[#1e2130] dark:text-[#f2f3f4]"
          />
          <p className="mt-1 text-xs text-[#5d6d7e] dark:text-[#99a3ad]">
            {t("tourGuideLicenseHint")}
          </p>
        </div>
      )}

      {/* Phase 2: is_agent capability toggle. Independent of role -
          any role can also offer paperwork services. */}
      <div className="rounded-xl border border-black/5 bg-white/40 p-4 dark:border-white/5 dark:bg-[#1e2130]/60">
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={Boolean(data.is_agent)}
            onChange={(e) => updateField("is_agent", e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500 dark:border-neutral-600"
          />
          <span>
            <span className="block text-sm font-medium text-neutral-700 dark:text-[#d4c4b4]">
              {t("isAgentLabel")}
            </span>
            <span className="mt-1 block text-xs leading-relaxed text-[#5d6d7e] dark:text-[#99a3ad]">
              {t("isAgentHint")}
            </span>
          </span>
        </label>
      </div>

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
