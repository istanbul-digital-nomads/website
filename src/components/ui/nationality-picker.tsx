"use client";

import { useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { useTranslations } from "next-intl";
import { Globe, X } from "lucide-react";
import { NATIONALITIES, type Nationality } from "@/lib/nationalities";

// Searchable nationality picker. Filters the full world list by demonym
// or country name (diacritic-insensitive) and stores the demonym string
// (e.g. "Turkish"). Themed for the onboarding / profile-editor inputs.

const MAX_RESULTS = 50;

function normalize(s: string): string {
  return s.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "").trim();
}

export interface NationalityPickerProps {
  value: string | null;
  onChange: (demonym: string | null) => void;
  label?: string;
  required?: boolean;
  error?: string;
}

export function NationalityPicker({
  value,
  onChange,
  label,
  required,
  error,
}: NationalityPickerProps) {
  const t = useTranslations("nationalityPicker");
  const listId = useId();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const blurTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // The flag for a currently-selected demonym, if we can find one.
  const selected = useMemo(
    () => NATIONALITIES.find((n) => n.demonym === value) ?? null,
    [value],
  );

  const results = useMemo<Nationality[]>(() => {
    const q = normalize(query);
    const list = q
      ? NATIONALITIES.filter(
          (n) =>
            normalize(n.demonym).includes(q) ||
            normalize(n.country).includes(q),
        )
      : NATIONALITIES;
    return list.slice(0, MAX_RESULTS);
  }, [query]);

  function select(n: Nationality) {
    onChange(n.demonym);
    setQuery("");
    setOpen(false);
  }

  function clear() {
    onChange(null);
    setQuery("");
  }

  function handleKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape") setOpen(false);
    else if (e.key === "Enter" && open && results.length > 0) {
      e.preventDefault();
      select(results[0]);
    }
  }

  const fieldId = `${listId}-input`;
  const hasSelection = Boolean(value);
  const displayValue = selected
    ? `${selected.flag} ${selected.demonym}`
    : (value ?? "");

  return (
    <div>
      {label && (
        <label
          htmlFor={fieldId}
          className="block text-sm font-medium text-neutral-700 dark:text-[#d4c4b4]"
        >
          {label}
          {required && (
            <span className="ms-0.5 text-red-500" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}

      <div className="relative mt-2">
        <Globe
          className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5d6d7e] dark:text-[#99a3ad]"
          aria-hidden
        />
        <input
          id={fieldId}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          autoComplete="off"
          value={open ? query : hasSelection ? displayValue : query}
          placeholder={t("placeholder")}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => {
            setOpen(true);
            if (hasSelection) setQuery("");
          }}
          onBlur={() => {
            blurTimer.current = setTimeout(() => setOpen(false), 150);
          }}
          onKeyDown={handleKey}
          className="w-full rounded-xl border border-black/5 bg-white/70 ps-9 pe-9 py-2.5 text-sm text-[#1a1a2e] placeholder:text-[#5d6d7e]/60 focus:border-primary-400 focus:outline-none dark:border-white/5 dark:bg-[#1e2130] dark:text-[#f2f3f4] dark:placeholder:text-[#99a3ad]/60"
        />
        {hasSelection && !open && (
          <button
            type="button"
            onClick={clear}
            aria-label={t("clear")}
            className="absolute end-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-[#5d6d7e] transition-colors hover:text-red-500 dark:text-[#99a3ad]"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        {open && results.length > 0 && (
          <ul
            id={listId}
            role="listbox"
            className="absolute z-30 mt-1 max-h-64 w-full overflow-auto rounded-xl border border-black/10 bg-white py-1 shadow-lg dark:border-white/10 dark:bg-[#1a1a2e]"
            onMouseDown={() => {
              if (blurTimer.current) clearTimeout(blurTimer.current);
            }}
          >
            {results.map((n) => (
              <li
                key={n.code}
                role="option"
                aria-selected={n.demonym === value}
              >
                <button
                  type="button"
                  onClick={() => select(n)}
                  className="flex w-full items-center gap-2 px-3 py-2 text-start text-sm text-[#1a1a2e] transition-colors hover:bg-primary-50 dark:text-[#f2f3f4] dark:hover:bg-[#1e2130]"
                >
                  <span aria-hidden>{n.flag}</span>
                  <span>{n.demonym}</span>
                  <span className="text-xs text-[#5d6d7e] dark:text-[#99a3ad]">
                    {n.country}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}

        {open && query && results.length === 0 && (
          <div className="absolute z-30 mt-1 w-full rounded-xl border border-black/10 bg-white px-3 py-3 text-sm text-[#5d6d7e] shadow-lg dark:border-white/10 dark:bg-[#1a1a2e] dark:text-[#99a3ad]">
            {t("noResults")}
          </div>
        )}
      </div>

      {error && (
        <p className="animate-error-fade-in mt-1.5 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
