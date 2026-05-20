"use client";

import { useState, type KeyboardEvent } from "react";

// Free-text chip/tag input. Press Enter or comma to add, click a chip
// (or Backspace on an empty field) to remove. Stores a string[]. Themed
// for the onboarding + profile-editor inputs (light + dark). The remove
// label is passed in so callers control i18n.

export interface ChipInputProps {
  label: string;
  hint?: string;
  value: string[];
  onChange: (next: string[]) => void;
  max?: number;
  placeholder?: string;
  removeLabel?: string;
}

export function ChipInput({
  label,
  hint,
  value,
  onChange,
  max = 12,
  placeholder,
  removeLabel = "Remove",
}: ChipInputProps) {
  const [draft, setDraft] = useState("");

  function commit() {
    const trimmed = draft.trim();
    if (!trimmed) return;
    if (value.length >= max) return;
    if (value.includes(trimmed)) {
      setDraft("");
      return;
    }
    onChange([...value, trimmed]);
    setDraft("");
  }

  function handleKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      commit();
    } else if (e.key === "Backspace" && draft === "" && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium text-neutral-700 dark:text-[#d4c4b4]">
        {label}
      </label>
      {hint && (
        <p className="mt-1 text-xs text-[#5d6d7e] dark:text-[#99a3ad]">
          {hint}
        </p>
      )}
      <div className="mt-2 flex flex-wrap items-center gap-2 rounded-xl border border-black/5 bg-white/70 px-2.5 py-2 dark:border-white/5 dark:bg-[#1e2130]">
        {value.map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => onChange(value.filter((x) => x !== v))}
            aria-label={`${removeLabel}: ${v}`}
            className="group inline-flex items-center gap-1 rounded-full bg-primary-100 px-2.5 py-1 text-xs font-medium text-primary-800 transition-colors hover:bg-red-100 hover:text-red-700 dark:bg-primary-950/40 dark:text-primary-200 dark:hover:bg-red-950/40 dark:hover:text-red-300"
          >
            {v}
            <span className="opacity-50 group-hover:opacity-100" aria-hidden>
              ×
            </span>
          </button>
        ))}
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKey}
          onBlur={commit}
          placeholder={value.length === 0 ? placeholder : ""}
          maxLength={60}
          disabled={value.length >= max}
          className="min-w-[120px] flex-1 bg-transparent text-sm text-[#1a1a2e] placeholder:text-[#5d6d7e]/60 focus:outline-none disabled:opacity-50 dark:text-[#f2f3f4] dark:placeholder:text-[#99a3ad]/60"
        />
      </div>
    </div>
  );
}
