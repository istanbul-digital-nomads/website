"use client";

import type { OnboardingData, FieldErrors } from "../onboarding-wizard";

interface StepProps {
  data: OnboardingData;
  updateField: (field: string, value: unknown) => void;
  errors: FieldErrors;
}

const HEARD_FROM = [
  "Instagram",
  "Friend recommendation",
  "Event invitation",
  "Website",
  "Other",
];

const MEMBER_TYPES = [
  "Expat",
  "Digital nomad",
  "Traveler",
  "Local (internationally minded)",
  "Student",
  "Other",
];

const ACTIVITIES = [
  "Language exchange",
  "Social nights",
  "Coworking days",
  "Hiking",
  "Dining events",
  "Sports",
  "Workshops",
  "Cultural trips",
  "Networking events",
  "Other",
];

const LOOKING_FOR = [
  "Making new friends",
  "Social life",
  "Professional networking",
  "Language practice",
  "Activities & hobbies",
  "Exploring Istanbul",
  "Other",
];

function RadioGroup({
  label,
  options,
  value,
  onChange,
  required,
  error,
  fieldKey,
}: {
  label: string;
  options: string[];
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
            key={opt}
            type="button"
            onClick={() =>
              onChange(opt.toLowerCase().replace(/[^a-z0-9]+/g, "-"))
            }
            className={`rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
              value === opt.toLowerCase().replace(/[^a-z0-9]+/g, "-")
                ? "bg-primary-600 text-white"
                : "bg-white/70 text-[#6b6257] ring-1 ring-black/5 hover:bg-primary-50 dark:bg-[#231a14] dark:text-[#b8a898] dark:ring-white/5"
            }`}
          >
            {opt}
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
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string[];
  onChange: (val: string[]) => void;
}) {
  function toggle(opt: string) {
    const key = opt.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    if (value.includes(key)) {
      onChange(value.filter((v) => v !== key));
    } else {
      onChange([...value, key]);
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium text-neutral-700 dark:text-[#d4c4b4]">
        {label}
      </label>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((opt) => {
          const key = opt.toLowerCase().replace(/[^a-z0-9]+/g, "-");
          return (
            <button
              key={opt}
              type="button"
              onClick={() => toggle(opt)}
              className={`rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                value.includes(key)
                  ? "bg-primary-600 text-white"
                  : "bg-white/70 text-[#6b6257] ring-1 ring-black/5 hover:bg-primary-50 dark:bg-[#231a14] dark:text-[#b8a898] dark:ring-white/5"
              }`}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function StepInterests({ data, updateField, errors }: StepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#2a2018] dark:text-[#f7f2ea]">
          Your interests
        </h2>
        <p className="mt-1 text-sm text-[#6b6257] dark:text-[#b8a898]">
          Help us match you with the right events and people.
        </p>
      </div>

      <RadioGroup
        label="How did you hear about us?"
        options={HEARD_FROM}
        value={(data.heard_from as string) || ""}
        onChange={(v) => updateField("heard_from", v)}
      />

      <RadioGroup
        label="What best describes you?"
        options={MEMBER_TYPES}
        value={(data.member_type as string) || ""}
        onChange={(v) => updateField("member_type", v)}
        required
        error={errors.member_type}
        fieldKey="member_type"
      />

      <CheckboxGroup
        label="Which activities interest you?"
        options={ACTIVITIES}
        value={(data.activity_interests as string[]) || []}
        onChange={(v) => updateField("activity_interests", v)}
      />

      <CheckboxGroup
        label="What are you mainly looking for?"
        options={LOOKING_FOR}
        value={(data.looking_for as string[]) || []}
        onChange={(v) => updateField("looking_for", v)}
      />
    </div>
  );
}
