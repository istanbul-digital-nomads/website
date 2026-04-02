"use client";

import type { OnboardingData } from "../onboarding-wizard";

interface StepProps {
  data: OnboardingData;
  updateField: (field: string, value: unknown) => void;
}

const HEARD_FROM = [
  "Instagram",
  "Friend recommendation",
  "Event invitation",
  "Website",
  "Other",
];

const LANGUAGES = [
  "English",
  "Turkish",
  "Spanish",
  "Italian",
  "French",
  "German",
  "Russian",
  "Arabic",
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
  "Sailing",
  "Hiking",
  "Dining events",
  "Sports",
  "Workshops",
  "Cultural trips",
  "Game nights",
  "Book club",
  "Networking events",
  "Singles events",
  "Family / kids activities",
  "Other",
];

const EVENT_FREQUENCY = [
  "Weekly",
  "A few times a month",
  "Occasionally",
  "Just exploring for now",
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
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (val: string) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-neutral-700 dark:text-[#d4c4b4]">
        {label}
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

export function StepInterests({ data, updateField }: StepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#2a2018] dark:text-[#f7f2ea]">
          Your interests
        </h2>
        <p className="mt-1 text-sm text-[#6b6257] dark:text-[#b8a898]">
          Help us understand what you&apos;re looking for so we can match you
          with the right events and people.
        </p>
      </div>

      <RadioGroup
        label="How did you hear about us?"
        options={HEARD_FROM}
        value={(data.heard_from as string) || ""}
        onChange={(v) => updateField("heard_from", v)}
      />

      <RadioGroup
        label="Have you attended any of our events before?"
        options={["Yes", "No"]}
        value={
          data.attended_events_before === true
            ? "yes"
            : data.attended_events_before === false
              ? "no"
              : ""
        }
        onChange={(v) => updateField("attended_events_before", v === "yes")}
      />

      {data.attended_events_before === true && (
        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-[#d4c4b4]">
            Which event(s)?
          </label>
          <input
            type="text"
            value={(data.attended_which_events as string) || ""}
            onChange={(e) =>
              updateField("attended_which_events", e.target.value)
            }
            placeholder="e.g., Weekly coworking, Rooftop social"
            className="mt-1.5 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-[rgba(180,140,110,0.15)] dark:bg-[#1c1614] dark:text-[#f7f2ea]"
          />
        </div>
      )}

      <CheckboxGroup
        label="Which languages do you speak?"
        options={LANGUAGES}
        value={(data.languages as string[]) || []}
        onChange={(v) => updateField("languages", v)}
      />

      <RadioGroup
        label="What best describes you?"
        options={MEMBER_TYPES}
        value={(data.member_type as string) || ""}
        onChange={(v) => updateField("member_type", v)}
      />

      <CheckboxGroup
        label="Which activities are you most interested in?"
        options={ACTIVITIES}
        value={(data.activity_interests as string[]) || []}
        onChange={(v) => updateField("activity_interests", v)}
      />

      <RadioGroup
        label="How often would you like to attend events?"
        options={EVENT_FREQUENCY}
        value={(data.event_frequency as string) || ""}
        onChange={(v) => updateField("event_frequency", v)}
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
