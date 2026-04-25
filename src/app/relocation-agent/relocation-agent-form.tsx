"use client";

import { useState, type FormEvent } from "react";
import { Input, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MultiSelectToggle } from "@/components/ui/multi-select-toggle";
import { showToast } from "@/lib/toast";
import { COUNTRIES } from "@/lib/path-to-istanbul";
import type {
  RelocationIntake,
  RelocationPlanResponse,
} from "@/lib/agent/types";
import { cn } from "@/lib/utils";

const CURRENCIES = ["USD", "EUR", "TL"] as const;

const DURATION_OPTIONS = [
  { value: "few-weeks", label: "A few weeks" },
  { value: "1-3-months", label: "1-3 months" },
  { value: "3-6-months", label: "3-6 months" },
  { value: "6-plus-months", label: "6+ months" },
] as const;

const LIFESTYLE_OPTIONS = [
  { value: "social", label: "Social" },
  { value: "quiet", label: "Quiet" },
  { value: "mixed", label: "Mix of both" },
] as const;

const WORK_OPTIONS = [
  { value: "remote-fulltime", label: "Remote full-time" },
  { value: "remote-flex", label: "Remote, flexible hours" },
  { value: "freelance", label: "Freelance" },
  { value: "founder", label: "Founder / building" },
  { value: "other", label: "Other" },
] as const;

const MUST_HAVE_OPTIONS = [
  "fast wifi",
  "ferry commute",
  "quiet street",
  "social scene",
  "gym nearby",
  "vegetarian-friendly",
  "near coworking",
] as const;

const ORIGIN_COUNTRY_OPTIONS = [
  { value: "", label: "Skip / not sure" },
  ...COUNTRIES.map((c) => ({
    value: c.slug,
    label: `${c.flag} ${c.name}`,
  })),
  { value: "other", label: "Other country" },
];

interface RadioGroupProps<T extends string> {
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: readonly { value: T; label: string }[];
  required?: boolean;
}

function RadioGroup<T extends string>({
  label,
  value,
  onChange,
  options,
  required,
}: RadioGroupProps<T>) {
  return (
    <div>
      <label className="block text-sm font-medium text-neutral-900 dark:text-[#f2f3f4]">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((opt) => {
          const selected = opt.value === value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={cn(
                "rounded-xl px-3.5 py-2 text-sm font-medium transition-colors",
                selected
                  ? "bg-primary-600 text-white dark:bg-primary-500"
                  : "bg-white/70 text-neutral-600 ring-1 ring-black/10 hover:bg-primary-50 hover:text-primary-700 dark:bg-white/5 dark:text-[#99a3ad] dark:ring-white/10 dark:hover:bg-white/10",
              )}
              aria-pressed={selected}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

interface FormState {
  budget: string;
  currency: (typeof CURRENCIES)[number];
  duration: (typeof DURATION_OPTIONS)[number]["value"];
  lifestyle: (typeof LIFESTYLE_OPTIONS)[number]["value"];
  work: (typeof WORK_OPTIONS)[number]["value"];
  originCountry: string;
  mustHaves: string[];
  notes: string;
}

const initialState: FormState = {
  budget: "1500",
  currency: "USD",
  duration: "3-6-months",
  lifestyle: "social",
  work: "remote-fulltime",
  originCountry: "",
  mustHaves: [],
  notes: "",
};

interface RelocationAgentFormProps {
  onResult: (response: RelocationPlanResponse) => void;
}

export function RelocationAgentForm({ onResult }: RelocationAgentFormProps) {
  const [form, setForm] = useState<FormState>(initialState);
  const [loading, setLoading] = useState(false);

  function update<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const intake: RelocationIntake = {
      budget: parseInt(form.budget, 10) || 0,
      currency: form.currency,
      duration: form.duration,
      lifestyle: form.lifestyle,
      work: form.work,
      originCountry:
        form.originCountry && form.originCountry !== "other"
          ? form.originCountry
          : undefined,
      mustHaves: form.mustHaves.length ? form.mustHaves : undefined,
      notes: form.notes.trim() || undefined,
    };

    try {
      const res = await fetch("/api/relocation-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(intake),
      });
      const json = await res.json();

      if (!res.ok) {
        const detail =
          (typeof json?.error === "string" && json.error) ||
          "Try again in a minute.";
        showToast.error("Couldn't build your plan", detail);
        return;
      }

      onResult(json.data as RelocationPlanResponse);
    } catch (err) {
      console.error(err);
      showToast.error(
        "Couldn't build your plan",
        "Network hiccup. Try again in a minute.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
        <Input
          label="Monthly budget"
          type="number"
          inputMode="numeric"
          min={200}
          max={20000}
          required
          value={form.budget}
          onChange={(e) => update("budget", e.target.value)}
          helperText="What you can comfortably spend per month."
        />
        <RadioGroup
          label="Currency"
          value={form.currency}
          onChange={(v) => update("currency", v)}
          options={CURRENCIES.map((c) => ({ value: c, label: c }))}
        />
      </div>

      <RadioGroup
        label="How long are you planning to stay?"
        value={form.duration}
        onChange={(v) => update("duration", v)}
        options={DURATION_OPTIONS}
        required
      />

      <RadioGroup
        label="What kind of lifestyle do you want?"
        value={form.lifestyle}
        onChange={(v) => update("lifestyle", v)}
        options={LIFESTYLE_OPTIONS}
        required
      />

      <RadioGroup
        label="How do you work?"
        value={form.work}
        onChange={(v) => update("work", v)}
        options={WORK_OPTIONS}
        required
      />

      <div>
        <label
          htmlFor="originCountry"
          className="block text-sm font-medium text-neutral-700 dark:text-[#99a3ad]"
        >
          Where are you coming from?{" "}
          <span className="text-neutral-500">(optional)</span>
        </label>
        <select
          id="originCountry"
          value={form.originCountry}
          onChange={(e) => update("originCountry", e.target.value)}
          className="mt-1.5 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-[rgba(44,62,80,0.15)] dark:bg-[#1a1a2e] dark:text-[#f2f3f4]"
        >
          {ORIGIN_COUNTRY_OPTIONS.map((opt) => (
            <option key={opt.value || "skip"} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <MultiSelectToggle
        label="Must-haves (pick any)"
        options={MUST_HAVE_OPTIONS as unknown as readonly string[]}
        value={form.mustHaves}
        onChange={(v) => update("mustHaves", v)}
      />

      <Textarea
        label="Anything else we should know?"
        placeholder="Coming with a partner? Pet? Special routine?"
        value={form.notes}
        onChange={(e) => update("notes", e.target.value)}
        helperText="Optional. We pass this to the agent verbatim."
      />

      <Button type="submit" loading={loading} size="lg">
        {loading ? "Pulling things together..." : "Build my plan"}
      </Button>
    </form>
  );
}
