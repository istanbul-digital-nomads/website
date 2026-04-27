"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { showToast } from "@/lib/toast";
import {
  ChevronDown,
  Loader2,
  MapPin,
  Banknote,
  ListChecks,
} from "lucide-react";
import { COUNTRIES } from "@/lib/path-to-istanbul";
import {
  relocationIntakeSchema,
  type RelocationIntake,
  type RelocationPlanResponse,
} from "@/lib/agent/types";
import { cn } from "@/lib/utils";

const CURRENCIES = ["USD", "EUR", "TL"] as const;
const MAX_NOTES = 800;

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

// One source of truth for label/optional/required styling so labels read
// at the same rhythm across every field
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

function HelperText({
  children,
  id,
}: {
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <p id={id} className="mt-1.5 text-sm text-neutral-500 dark:text-[#85929e]">
      {children}
    </p>
  );
}

function FieldError({ id, children }: { id: string; children: string }) {
  return (
    <p
      id={id}
      role="alert"
      className="mt-1.5 animate-error-fade-in text-sm text-red-600 dark:text-red-400"
    >
      {children}
    </p>
  );
}

interface RadioGroupProps<T extends string> {
  label: string;
  name: string;
  value: T;
  onChange: (v: T) => void;
  options: readonly { value: T; label: string }[];
  required?: boolean;
  error?: string;
  helperText?: string;
}

function RadioGroup<T extends string>({
  label,
  name,
  value,
  onChange,
  options,
  required,
  error,
  helperText,
}: RadioGroupProps<T>) {
  const errorId = `${name}-error`;
  const helperId = `${name}-helper`;
  return (
    <div>
      <FieldLabel required={required}>{label}</FieldLabel>
      <div
        role="radiogroup"
        aria-label={label}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : helperText ? helperId : undefined}
        className="mt-2 flex flex-wrap gap-2"
      >
        {options.map((opt) => {
          const selected = opt.value === value;
          return (
            <button
              key={opt.value}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(opt.value)}
              className={cn(
                "h-10 rounded-xl px-4 text-sm font-medium transition-colors",
                selected
                  ? "bg-primary-600 text-white shadow-sm dark:bg-primary-500"
                  : "bg-white/70 text-neutral-700 ring-1 ring-black/10 hover:bg-primary-50 hover:text-primary-700 dark:bg-white/5 dark:text-[#99a3ad] dark:ring-white/10 dark:hover:bg-white/10",
              )}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
      {error ? (
        <FieldError id={errorId}>{error}</FieldError>
      ) : helperText ? (
        <HelperText id={helperId}>{helperText}</HelperText>
      ) : null}
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

type Errors = Partial<Record<keyof FormState | "_form", string>>;

// Clean form state into the shape the API expects. Returns null if the
// budget can't be turned into a non-negative integer; the caller surfaces
// a friendly message in that case
function buildIntake(form: FormState): RelocationIntake | null {
  const budgetStr = form.budget.trim();
  if (!budgetStr || !/^\d+$/.test(budgetStr)) return null;
  const budget = parseInt(budgetStr, 10);
  return {
    budget,
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
}

// Friendlier-than-Zod messages where it matters. Other paths fall back
// to the schema's own messages
const FRIENDLY_OVERRIDES: Partial<Record<string, string>> = {
  budget: "Budget seems off. Try a number between 200 and 20000.",
  notes: `Notes are too long. Keep it under ${MAX_NOTES} characters.`,
  mustHaves: "Pick at most 10 must-haves.",
};

function getErrors(form: FormState): Errors {
  const errors: Errors = {};

  // Budget: handle empty + non-numeric before the schema sees NaN
  const budgetStr = form.budget.trim();
  if (!budgetStr) {
    errors.budget = "Tell us a budget so we can match a tier.";
  } else if (!/^\d+$/.test(budgetStr)) {
    errors.budget = "Budget should be a whole number.";
  }

  // Notes: cheap length cap before sending
  if (form.notes.length > MAX_NOTES) {
    errors.notes = `Keep notes under ${MAX_NOTES} characters. Yours is ${form.notes.length}.`;
  }

  // Schema check covers the rest
  const intake = buildIntake(form);
  if (intake) {
    const result = relocationIntakeSchema.safeParse(intake);
    if (!result.success) {
      for (const issue of result.error.issues) {
        const key = String(issue.path[0] ?? "_form") as keyof Errors;
        if (errors[key]) continue;
        errors[key] = FRIENDLY_OVERRIDES[String(key)] ?? issue.message;
      }
    }
  }

  return errors;
}

interface RelocationAgentFormProps {
  onResult: (response: RelocationPlanResponse) => void;
}

export function RelocationAgentForm({ onResult }: RelocationAgentFormProps) {
  const [form, setForm] = useState<FormState>(initialState);
  const [loading, setLoading] = useState(false);
  const [attempted, setAttempted] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

  const budgetRef = useRef<HTMLInputElement | null>(null);
  const notesRef = useRef<HTMLTextAreaElement | null>(null);

  // Live re-validation kicks in only after the first submit attempt so we
  // don't shout "Required" at someone who just opened the page
  useEffect(() => {
    if (!attempted) return;
    setErrors(getErrors(form));
  }, [form, attempted]);

  const liveErrors: Errors = useMemo(
    () => (attempted ? errors : {}),
    [attempted, errors],
  );
  const hasErrors = Object.keys(liveErrors).length > 0;

  function update<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function focusFirstError(currentErrors: Errors) {
    if (currentErrors.budget) {
      budgetRef.current?.focus();
      return;
    }
    if (currentErrors.notes) {
      notesRef.current?.focus();
      return;
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const currentErrors = getErrors(form);
    setAttempted(true);
    setErrors(currentErrors);

    if (Object.keys(currentErrors).length > 0) {
      focusFirstError(currentErrors);
      showToast.error(
        "A few fields need attention",
        "Check the highlighted ones and try again.",
      );
      return;
    }

    const intake = buildIntake(form);
    if (!intake) return; // belt-and-braces; getErrors would have caught it

    setLoading(true);
    try {
      const res = await fetch("/api/relocation-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(intake),
      });

      // Read as text first - 504 (Vercel function timeout) and other gateway
      // errors return plain text or HTML, not JSON. Parsing JSON.parse on those
      // throws SyntaxError which crashes the form. Fall through to the toast
      // path with the gateway status code if the body isn't JSON
      const raw = await res.text();
      let json: {
        data?: RelocationPlanResponse;
        error?: string;
        issues?: Array<{ path?: (string | number)[]; message?: string }>;
      } | null = null;
      if (raw) {
        try {
          json = JSON.parse(raw);
        } catch {
          // Non-JSON body (likely Vercel 504 / 502 / HTML page). Leave json null
        }
      }

      if (res.status === 400 && json?.issues && Array.isArray(json.issues)) {
        const serverErrors: Errors = {};
        for (const issue of json.issues) {
          const key = String(issue.path?.[0] ?? "_form") as keyof Errors;
          if (!serverErrors[key]) {
            serverErrors[key] =
              FRIENDLY_OVERRIDES[String(key)] ??
              issue.message ??
              "This field looks off.";
          }
        }
        setErrors(serverErrors);
        focusFirstError(serverErrors);
        showToast.error("Couldn't build your plan", "Some fields need fixing.");
        return;
      }

      if (!res.ok) {
        // 504 from Vercel function timeout, 502 from agent failure, etc
        const detail =
          (typeof json?.error === "string" && json.error) ||
          (res.status === 504
            ? "The agent took too long. Try again in a minute."
            : "Try again in a minute.");
        showToast.error("Couldn't build your plan", detail);
        return;
      }

      if (!json?.data) {
        showToast.error(
          "Couldn't build your plan",
          "Got an unexpected response. Try again.",
        );
        return;
      }

      onResult(json.data);
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

  // Disabled = blocked from submitting. Always visible
  const submitDisabled = loading || (attempted && hasErrors);
  const submitLabel = loading ? "Pulling things together..." : "Build my plan";

  // Render LoadingState while waiting for /api/relocation-agent. The form
  // stays mounted but visually hidden so any failure path can re-display
  // it with the user's intake values intact
  if (loading) {
    return <LoadingState />;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8" noValidate>
      {/* Budget + currency: composite field. Input and currency pills share
          a row and share a label; helper / error spans below the whole field. */}
      <div>
        <FieldLabel htmlFor="budget" required>
          Monthly budget
        </FieldLabel>
        <div className="mt-1.5 flex flex-col gap-2 sm:flex-row sm:items-stretch">
          <input
            ref={budgetRef}
            id="budget"
            type="number"
            inputMode="numeric"
            min={200}
            max={20000}
            step={1}
            required
            value={form.budget}
            onChange={(e) => update("budget", e.target.value)}
            aria-invalid={!!liveErrors.budget}
            aria-describedby={
              liveErrors.budget ? "budget-error" : "budget-helper"
            }
            className={cn(
              "h-11 flex-1 rounded-md border bg-white px-4 text-sm placeholder:text-neutral-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-[#1a1a2e] dark:text-[#f2f3f4]",
              liveErrors.budget
                ? "border-red-500 focus:ring-red-500 dark:border-red-400/60"
                : "border-neutral-300 dark:border-[rgba(44,62,80,0.15)]",
            )}
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
        {liveErrors.budget ? (
          <FieldError id="budget-error">{liveErrors.budget}</FieldError>
        ) : (
          <HelperText id="budget-helper">
            What you can comfortably spend per month.
          </HelperText>
        )}
      </div>

      <RadioGroup
        name="duration"
        label="How long are you planning to stay?"
        value={form.duration}
        onChange={(v) => update("duration", v)}
        options={DURATION_OPTIONS}
        required
        error={liveErrors.duration}
      />

      <RadioGroup
        name="lifestyle"
        label="What kind of lifestyle do you want?"
        value={form.lifestyle}
        onChange={(v) => update("lifestyle", v)}
        options={LIFESTYLE_OPTIONS}
        required
        error={liveErrors.lifestyle}
      />

      <RadioGroup
        name="work"
        label="How do you work?"
        value={form.work}
        onChange={(v) => update("work", v)}
        options={WORK_OPTIONS}
        required
        error={liveErrors.work}
      />

      {/* Custom-chevron select: appearance-none + a chevron icon positioned
          absolute, with pl-4 / pr-10 so the text never collides with the icon */}
      <div>
        <FieldLabel htmlFor="originCountry" optional>
          Where are you coming from?
        </FieldLabel>
        <div className="relative mt-1.5">
          <select
            id="originCountry"
            value={form.originCountry}
            onChange={(e) => update("originCountry", e.target.value)}
            aria-describedby="originCountry-helper"
            className="h-11 w-full appearance-none rounded-md border border-neutral-300 bg-white pl-4 pr-10 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-[rgba(44,62,80,0.15)] dark:bg-[#1a1a2e] dark:text-[#f2f3f4]"
          >
            {ORIGIN_COUNTRY_OPTIONS.map((opt) => (
              <option key={opt.value || "skip"} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown
            aria-hidden="true"
            className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500 dark:text-[#85929e]"
          />
        </div>
        <HelperText id="originCountry-helper">
          We&apos;ll fold a country-specific playbook into the plan when we have
          one.
        </HelperText>
      </div>

      <div>
        <FieldLabel optional>Must-haves</FieldLabel>
        <div className="mt-2">
          <MustHaveToggles
            options={MUST_HAVE_OPTIONS as unknown as readonly string[]}
            value={form.mustHaves}
            onChange={(v) => update("mustHaves", v)}
          />
        </div>
        {liveErrors.mustHaves ? (
          <FieldError id="mustHaves-error">{liveErrors.mustHaves}</FieldError>
        ) : (
          <HelperText>Tap any that apply. Skip if nothing fits.</HelperText>
        )}
      </div>

      <div>
        <FieldLabel htmlFor="notes" optional>
          Anything else we should know?
        </FieldLabel>
        <Textarea
          ref={notesRef}
          id="notes"
          placeholder="Coming with a partner? Pet? Special routine?"
          value={form.notes}
          onChange={(e) => update("notes", e.target.value)}
          aria-invalid={!!liveErrors.notes}
          aria-describedby={liveErrors.notes ? "notes-error" : "notes-helper"}
          error={liveErrors.notes}
          className="mt-1.5"
        />
        {!liveErrors.notes && (
          <HelperText id="notes-helper">
            We pass this to the agent verbatim.{" "}
            <span className="tabular-nums">
              {form.notes.length}/{MAX_NOTES}
            </span>
          </HelperText>
        )}
      </div>

      <div className="flex flex-col-reverse items-stretch gap-3 border-t border-neutral-100 pt-6 sm:flex-row sm:items-center sm:justify-between dark:border-[rgba(44,62,80,0.12)]">
        <p className="text-xs text-neutral-500 dark:text-[#85929e]">
          We never store your intake unless you&apos;re signed in.
        </p>
        <Button
          type="submit"
          loading={loading}
          disabled={submitDisabled}
          size="lg"
          className="sm:min-w-[12rem]"
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}

// Loading messages roughly mirror the agent's actual mental model. They
// rotate every ~5 seconds and stop on the last so the user never sees
// "almost there" loop back to "looking at your budget"
const LOADING_MESSAGES = [
  "Looking at your budget...",
  "Walking the five neighborhoods we cover...",
  "Pulling fresh rents from our cost-of-living guide...",
  "Cross-checking which coworking spaces actually have wifi...",
  "Mapping out your first-month checklist...",
  "Working out the monthly total in USD and TL...",
  "Drafting the why behind each pick...",
  "Almost there, just polishing this up...",
] as const;

const LOADING_MESSAGE_INTERVAL_MS = 5000;

function LoadingState() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIdx((i) => Math.min(i + 1, LOADING_MESSAGES.length - 1));
    }, LOADING_MESSAGE_INTERVAL_MS);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="space-y-6"
    >
      {/* Top-of-panel status - replaces the form while we wait */}
      <div className="rounded-lg border border-neutral-100 bg-white p-8 dark:border-[rgba(44,62,80,0.12)] dark:bg-[rgba(44,62,80,0.08)]">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="relative flex h-12 w-12 items-center justify-center">
            <div className="absolute inset-0 animate-ping rounded-full bg-primary-200/40 dark:bg-primary-500/20" />
            <Loader2 className="h-7 w-7 animate-spin text-primary-600 dark:text-primary-400" />
          </div>

          <p
            key={idx}
            className="animate-error-fade-in text-base font-medium text-neutral-900 dark:text-[#f2f3f4]"
          >
            {LOADING_MESSAGES[idx]}
          </p>

          <p className="max-w-md text-sm text-neutral-500 dark:text-[#85929e]">
            This usually takes 30 to 50 seconds. Don&apos;t close the tab -
            we&apos;re running real retrieval against our content, not just
            rephrasing your inputs.
          </p>
        </div>
      </div>

      {/* Skeleton preview of the result cards so the user sees what's coming */}
      <div className="grid gap-4 sm:grid-cols-3">
        <SkeletonCard icon={MapPin} label="Neighborhood" />
        <SkeletonCard icon={Banknote} label="Cost breakdown" />
        <SkeletonCard icon={ListChecks} label="First month" />
      </div>
      <Skeleton className="h-32 w-full rounded-md" />
    </div>
  );
}

function SkeletonCard({
  icon: Icon,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <div className="rounded-md border border-neutral-100 bg-white p-4 dark:border-[rgba(44,62,80,0.12)] dark:bg-[rgba(44,62,80,0.08)]">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-neutral-500 dark:text-[#85929e]">
        <Icon className="h-3.5 w-3.5" aria-hidden="true" />
        {label}
      </div>
      <Skeleton className="mt-3 h-5 w-2/3" />
      <Skeleton className="mt-2 h-3 w-full" />
      <Skeleton className="mt-1.5 h-3 w-5/6" />
    </div>
  );
}

function MustHaveToggles({
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
