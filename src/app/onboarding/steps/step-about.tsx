"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import type { OnboardingData } from "../onboarding-wizard";

interface StepProps {
  data: OnboardingData;
  updateField: (field: string, value: unknown) => void;
}

const AGE_RANGES = ["18-24", "25-29", "30-35", "36-40", "41-50", "50+"];
const GENDERS = [
  { value: "female", label: "Female" },
  { value: "male", label: "Male" },
  { value: "prefer-not-to-say", label: "Prefer not to say" },
];

export function StepAbout({ data, updateField }: StepProps) {
  const [preferAgeRange, setPreferAgeRange] = useState(!!data.age_range);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#2a2018] dark:text-[#f7f2ea]">
          About you
        </h2>
        <p className="mt-1 text-sm text-[#6b6257] dark:text-[#b8a898]">
          Let&apos;s start with the basics so the community can get to know you.
        </p>
      </div>

      <Input
        label="Full Name"
        value={(data.display_name as string) || ""}
        onChange={(e) => updateField("display_name", e.target.value)}
        placeholder="Your full name"
        required
      />

      {/* Birthday / Age Range toggle */}
      <div>
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-neutral-700 dark:text-[#d4c4b4]">
            {preferAgeRange ? "Age Range" : "Birthday"}
          </label>
          <button
            type="button"
            onClick={() => {
              setPreferAgeRange(!preferAgeRange);
              if (!preferAgeRange) {
                updateField("birthday", null);
              } else {
                updateField("age_range", null);
              }
            }}
            className="text-xs text-primary-600 transition-colors hover:text-primary-800 dark:text-primary-400"
          >
            {preferAgeRange
              ? "I'll share my birthday instead"
              : "I'd rather pick an age range"}
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
                    : "bg-white/70 text-[#6b6257] ring-1 ring-black/5 hover:bg-primary-50 dark:bg-[#231a14] dark:text-[#b8a898] dark:ring-white/5"
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        ) : (
          <input
            type="date"
            value={(data.birthday as string) || ""}
            onChange={(e) => updateField("birthday", e.target.value)}
            className="mt-1.5 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-[rgba(180,140,110,0.15)] dark:bg-[#1c1614] dark:text-[#f7f2ea]"
          />
        )}
      </div>

      {/* Gender */}
      <div>
        <label className="block text-sm font-medium text-neutral-700 dark:text-[#d4c4b4]">
          Gender
        </label>
        <div className="mt-2 flex flex-wrap gap-2">
          {GENDERS.map((g) => (
            <button
              key={g.value}
              type="button"
              onClick={() => updateField("gender", g.value)}
              className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
                data.gender === g.value
                  ? "bg-primary-600 text-white"
                  : "bg-white/70 text-[#6b6257] ring-1 ring-black/5 hover:bg-primary-50 dark:bg-[#231a14] dark:text-[#b8a898] dark:ring-white/5"
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>

      <Input
        label="Nationality"
        value={(data.nationality as string) || ""}
        onChange={(e) => updateField("nationality", e.target.value)}
        placeholder="e.g., German, Brazilian, Turkish"
      />

      <Input
        label="City / District you live in"
        value={(data.city_district as string) || ""}
        onChange={(e) => updateField("city_district", e.target.value)}
        placeholder="e.g., Kadikoy, Cihangir, Besiktas"
      />
    </div>
  );
}
