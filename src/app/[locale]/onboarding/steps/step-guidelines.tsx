"use client";

import { useTranslations } from "next-intl";
import type { OnboardingData, FieldErrors } from "../onboarding-wizard";

interface StepProps {
  data: OnboardingData;
  updateField: (field: string, value: unknown) => void;
  errors: FieldErrors;
}

const GUIDELINE_KEYS = [
  "kindness",
  "dms",
  "rsvp",
  "payment",
  "notDating",
  "noMisuse",
  "admins",
] as const;

export function StepGuidelines({ data, updateField, errors }: StepProps) {
  const t = useTranslations("onboardingPage.steps.guidelines");
  const tRules = useTranslations("onboardingPage.steps.guidelines.rules");

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

      <div className="rounded-xl border border-primary-200/30 bg-primary-50/30 p-5 dark:border-[rgba(192,57,43,0.1)] dark:bg-[rgba(192,57,43,0.04)]">
        <ul className="space-y-3">
          {GUIDELINE_KEYS.map((key, i) => (
            <li
              key={key}
              className="flex gap-3 text-sm text-[#5d6d7e] dark:text-[#99a3ad]"
            >
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-semibold text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
                {i + 1}
              </span>
              <span>{tRules(key)}</span>
            </li>
          ))}
        </ul>
      </div>

      <div data-field="agrees_guidelines">
        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-primary-200/30 bg-white/50 p-4 transition-colors hover:bg-primary-50/30 dark:border-[rgba(192,57,43,0.1)] dark:bg-[#1e2130]/50 dark:hover:bg-[rgba(192,57,43,0.06)]">
          <input
            type="checkbox"
            checked={(data.agrees_guidelines as boolean) || false}
            onChange={(e) => updateField("agrees_guidelines", e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
          />
          <span className="text-sm font-medium text-[#1a1a2e] dark:text-[#f2f3f4]">
            {t("agreeLabel")}
            <span className="ml-0.5 text-red-500" aria-hidden="true">
              *
            </span>
          </span>
        </label>
        {errors.agrees_guidelines && (
          <p className="animate-error-fade-in mt-1.5 text-sm text-red-600 dark:text-red-400">
            {errors.agrees_guidelines}
          </p>
        )}
      </div>
    </div>
  );
}
