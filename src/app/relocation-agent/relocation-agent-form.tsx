"use client";

import { useState, type FormEvent } from "react";
import { Textarea } from "@/components/ui/input";
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

// Shared label styling. Used across all field types so spacing reads as
// one consistent rhythm
function FieldLabel({
  htmlFor,
  required,
  optional,
  children,
}: {
  htmlFor?: string;
  required?: boolean;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-sm font-medium text-neutral-900 dark:text-[#f2f3f4]"
    >
      {children}
      {required && (
        <span className="ml-0.5 text-red-500" aria-hidden="true">
          *
        </span>
      )}
      {optional && (
        <span className="ml-2 text-xs font-normal text-neutral-500 dark:text-[#85929e]">
          (optional)
        </span>
      )}
    </label>
  );
}

function HelperText({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-1.5 text-sm text-neutral-500 dark:text-[#85929e]">
      {children}
    </p>
  );
}

interface RadioGroupProps<T extends string> {
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: readonly { value: T; label: string }[];
  required?: boolean;
  helperText?: string;
}

function RadioGroup<T extends string>({
  label,
  value,
  onChange,
  options,
  required,
  helperText,
}: RadioGroupProps<T>) {
  return (
    <div>
      <FieldLabel required={required}>{label}</FieldLabel>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((opt) => {
          const selected = opt.value === value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={cn(
                "h-10 rounded-xl px-4 text-sm font-medium transition-colors",
                selected
                  ? "bg-primary-600 text-white shadow-sm dark:bg-primary-500"
                  : "bg-white/70 text-neutral-700 ring-1 ring-black/10 hover:bg-primary-50 hover:text-primary-700 dark:bg-white/5 dark:text-[#99a3ad] dark:ring-white/10 dark:hover:bg-white/10",
              )}
              aria-pressed={selected}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
      {helperText && <HelperText>{helperText}</HelperText>}
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
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Budget + currency: composite field. Input and currency pills share
          a row, share a label, and helper text spans below the whole thing. */}
      <div>
        <FieldLabel htmlFor="budget" required>
          Monthly budget
        </FieldLabel>
        <div className="mt-1.5 flex flex-col gap-2 sm:flex-row sm:items-stretch">
          <input
            id="budget"
            type="number"
            inputMode="numeric"
            min={200}
            max={20000}
            required
            value={form.budget}
            onChange={(e) => update("budget", e.target.value)}
            className="h-11 flex-1 rounded-md border border-neutral-300 bg-white px-3 text-sm placeholder:text-neutral-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-[rgba(44,62,80,0.15)] dark:bg-[#1a1a2e] dark:text-[#f2f3f4]"
          />
          <div
            role="radiogroup"
            aria-label="Currency"
            className="flex h-11 items-center gap-0.5 rounded-md border border-neutral-300 bg-white p-1 dark:border-[rgba(44,62,80,0.15)] dark:bg-[#1a1a2e]"
          >
            {CURRENCIES.map((c) => {
              const selected = form.currency === c;
              return (
                <button
                  key={c}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => update("currency", c)}
                  className={cn(
                    "h-full min-w-[3rem] rounded px-3 text-sm font-medium transition-colors",
                    selected
                      ? "bg-primary-600 text-white shadow-sm dark:bg-primary-500"
                      : "text-neutral-600 hover:bg-neutral-100 dark:text-[#99a3ad] dark:hover:bg-white/5",
                  )}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </div>
        <HelperText>What you can comfortably spend per month.</HelperText>
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
        <FieldLabel htmlFor="originCountry" optional>
          Where are you coming from?
        </FieldLabel>
        <select
          id="originCountry"
          value={form.originCountry}
          onChange={(e) => update("originCountry", e.target.value)}
          className="mt-1.5 h-11 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-[rgba(44,62,80,0.15)] dark:bg-[#1a1a2e] dark:text-[#f2f3f4]"
        >
          {ORIGIN_COUNTRY_OPTIONS.map((opt) => (
            <option key={opt.value || "skip"} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <HelperText>
          We&apos;ll fold a country-specific playbook into the plan when we have one.
        </HelperText>
      </div>

      <div>
        <FieldLabel optional>Must-haves</FieldLabel>
        <div className="mt-2">
          <MultiSelectToggleInline
            options={MUST_HAVE_OPTIONS as unknown as readonly string[]}
            value={form.mustHaves}
            onChange={(v) => update("mustHaves", v)}
          />
        </div>
        <HelperText>Tap any that apply. Skip if nothing fits.</HelperText>
      </div>

      <div>
        <FieldLabel htmlFor="notes" optional>
          Anything else we should know?
        </FieldLabel>
        <Textarea
          id="notes"
          placeholder="Coming with a partner? Pet? Special routine?"
          value={form.notes}
          onChange={(e) => update("notes", e.target.value)}
          className="mt-1.5"
        />
        <HelperText>We pass this to the agent verbatim.</HelperText>
      </div>

      <div className="flex flex-col-reverse items-stretch gap-3 border-t border-neutral-100 pt-6 sm:flex-row sm:items-center sm:justify-between dark:border-[rgba(44,62,80,0.12)]">
        <p className="text-xs text-neutral-500 dark:text-[#85929e]">
          We never store your intake unless you&apos;re signed in.
        </p>
        <Button
          type="submit"
          loading={loading}
          size="lg"
          className="sm:min-w-[12rem]"
        >
          {loading ? "Pulling things together..." : "Build my plan"}
        </Button>
      </div>
    </form>
  );
}

// MultiSelectToggle wrapper that drops the built-in label so we can
// position it consistently with FieldLabel
function MultiSelectToggleInline({
  options,
  value,
  onChange,
}: {
  options: readonly string[];
  value: string[];
  onChange: (v: string[]) => void;
}) {
  function toggle(optValue: string) {
    if (value.includes(optValue)) {
      onChange(value.filter((v) => v !== optValue));
    } else {
      onChange([...value, optValue]);
    }
  }
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const selected = value.includes(opt);
        return (
          <button
            key={opt}
            type="button"
            onClick={() => toggle(opt)}
            aria-pressed={selected}
            className={cn(
              "h-10 rounded-xl px-4 text-sm font-medium transition-colors",
              selected
                ? "bg-primary-600 text-white shadow-sm dark:bg-primary-500"
                : "bg-white/70 text-neutral-700 ring-1 ring-black/10 hover:bg-primary-50 hover:text-primary-700 dark:bg-white/5 dark:text-[#99a3ad] dark:ring-white/10 dark:hover:bg-white/10",
            )}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}
