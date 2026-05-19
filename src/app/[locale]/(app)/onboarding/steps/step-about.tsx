"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import type { OnboardingData, FieldErrors } from "../onboarding-wizard";

interface StepProps {
  data: OnboardingData;
  updateField: (field: string, value: unknown) => void;
  errors: FieldErrors;
}

const AGE_RANGES = ["18-24", "25-29", "30-35", "36-40", "41-50", "50+"];
const GENDER_KEYS = ["female", "male", "preferNotToSay"] as const;
const GENDER_VALUES: Record<(typeof GENDER_KEYS)[number], string> = {
  female: "female",
  male: "male",
  preferNotToSay: "prefer-not-to-say",
};

export function StepAbout({ data, updateField, errors }: StepProps) {
  const t = useTranslations("onboardingPage.steps.about");
  const tGenders = useTranslations("onboardingPage.steps.about.genders");
  const [preferAgeRange, setPreferAgeRange] = useState(!!data.age_range);

  function handleAgeRangeToggle() {
    setPreferAgeRange(!preferAgeRange);
    if (!preferAgeRange) {
      updateField("birthday", null);
    } else {
      updateField("age_range", null);
    }
  }

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

      <Input
        label={t("fullName")}
        value={(data.display_name as string) || ""}
        onChange={(e) => updateField("display_name", e.target.value)}
        placeholder={t("fullNamePlaceholder")}
        required
        error={errors.display_name}
      />

      {/* Birthday / Age Range toggle */}
      <div data-field="age_or_birthday">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-neutral-700 dark:text-[#d4c4b4]">
            {preferAgeRange ? t("ageRange") : t("birthday")}
            <span className="ml-0.5 text-red-500" aria-hidden="true">
              *
            </span>
          </label>
          <button
            type="button"
            onClick={handleAgeRangeToggle}
            className="text-xs text-primary-600 transition-colors hover:text-primary-800 dark:text-primary-400"
          >
            {preferAgeRange ? t("toggleToBirthday") : t("toggleToAgeRange")}
          </button>
        </div>

        {preferAgeRange ? (
          <div className="mt-2 flex flex-wrap gap-2">
            {AGE_RANGES.map((range) => (
              <button
                key={range}
                type="button"
                onClick={() => updateField("age_range", range)}
                className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
                  data.age_range === range
                    ? "bg-primary-600 text-white"
                    : "bg-white/70 text-[#5d6d7e] ring-1 ring-black/5 hover:bg-primary-50 dark:bg-[#1e2130] dark:text-[#99a3ad] dark:ring-white/5"
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        ) : (
          <Input
            type="date"
            value={(data.birthday as string) || ""}
            onChange={(e) => updateField("birthday", e.target.value)}
            className="mt-1.5"
          />
        )}

        {errors.age_or_birthday && (
          <p className="animate-error-fade-in mt-1.5 text-sm text-red-600 dark:text-red-400">
            {errors.age_or_birthday}
          </p>
        )}
      </div>

      {/* Gender */}
      <div>
        <label className="block text-sm font-medium text-neutral-700 dark:text-[#d4c4b4]">
          {t("gender")}
        </label>
        <div className="mt-2 flex flex-wrap gap-2">
          {GENDER_KEYS.map((g) => {
            const value = GENDER_VALUES[g];
            return (
              <button
                key={g}
                type="button"
                onClick={() => updateField("gender", value)}
                className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
                  data.gender === value
                    ? "bg-primary-600 text-white"
                    : "bg-white/70 text-[#5d6d7e] ring-1 ring-black/5 hover:bg-primary-50 dark:bg-[#1e2130] dark:text-[#99a3ad] dark:ring-white/5"
                }`}
              >
                {tGenders(g)}
              </button>
            );
          })}
        </div>
      </div>

      <Input
        label={t("nationality")}
        value={(data.nationality as string) || ""}
        onChange={(e) => updateField("nationality", e.target.value)}
        placeholder={t("nationalityPlaceholder")}
      />

      <Input
        label={t("cityDistrict")}
        value={(data.city_district as string) || ""}
        onChange={(e) => updateField("city_district", e.target.value)}
        placeholder={t("cityDistrictPlaceholder")}
      />
    </div>
  );
}
