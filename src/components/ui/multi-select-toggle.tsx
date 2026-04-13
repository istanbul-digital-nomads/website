"use client";

import { cn } from "@/lib/utils";

interface MultiSelectToggleProps {
  label: string;
  options: readonly { value: string; label: string }[] | readonly string[];
  value: string[];
  onChange: (value: string[]) => void;
  error?: string;
  required?: boolean;
}

export function MultiSelectToggle({
  label,
  options,
  value,
  onChange,
  error,
  required,
}: MultiSelectToggleProps) {
  function toggle(optValue: string) {
    if (value.includes(optValue)) {
      onChange(value.filter((v) => v !== optValue));
    } else {
      onChange([...value, optValue]);
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium text-neutral-900 dark:text-[#f2f3f4]">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((opt) => {
          const optValue = typeof opt === "string" ? opt : opt.value;
          const optLabel = typeof opt === "string" ? opt : opt.label;
          const isSelected = value.includes(optValue);

          return (
            <button
              key={optValue}
              type="button"
              onClick={() => toggle(optValue)}
              className={cn(
                "rounded-xl px-3.5 py-2 text-sm font-medium transition-colors",
                isSelected
                  ? "bg-primary-600 text-white dark:bg-primary-500"
                  : "bg-white/70 text-neutral-600 ring-1 ring-black/10 hover:bg-primary-50 hover:text-primary-700 dark:bg-white/5 dark:text-[#99a3ad] dark:ring-white/10 dark:hover:bg-white/10",
              )}
            >
              {optLabel}
            </button>
          );
        })}
      </div>
      {error && (
        <p className="mt-1.5 animate-error-fade-in text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
