"use client";

import { useTranslations } from "next-intl";
import type { OnboardingData, FieldErrors } from "../onboarding-wizard";

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

const MEMBER_TYPES: readonly OptionDef[] = [
  { key: "expat", value: "expat" },
  { key: "nomad", value: "digital-nomad" },
  { key: "traveler", value: "traveler" },
  { key: "local", value: "local-internationally-minded" },
  { key: "student", value: "student" },
  { key: "other", value: "other" },
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

      <RadioGroup
        label={t("memberType")}
        options={MEMBER_TYPES}
        optionLabels={(k) => tMember(k)}
        value={(data.member_type as string) || ""}
        onChange={(v) => updateField("member_type", v)}
        required
        error={errors.member_type}
        fieldKey="member_type"
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
