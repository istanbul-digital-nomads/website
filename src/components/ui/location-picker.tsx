"use client";

import { useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { useTranslations } from "next-intl";
import { MapPin, LocateFixed, X, Loader2 } from "lucide-react";
import {
  ISTANBUL_DISTRICTS,
  ISTANBUL_DISTRICT_NAMES,
  ISTANBUL_PLACES,
} from "@/lib/istanbul-locations";

// Searchable Istanbul location picker. Backed by the full 39-district /
// 960-neighborhood dataset. The user types to filter; selecting a row
// stores both the district (ilçe) and, when chosen, the neighborhood
// (mahalle). A "use my location" button reverse-geocodes the device
// position to a district as a shortcut. Self-contained and themed for
// the onboarding/profile inputs (light + dark).

const MAX_RESULTS = 60;

// Diacritic + case-insensitive normalize so "besiktas" finds "Beşiktaş".
function normalize(s: string): string {
  return s
    .toLocaleLowerCase("tr")
    .replace(/ı/g, "i")
    .replace(/i̇/g, "i")
    .replace(/ş/g, "s")
    .replace(/ç/g, "c")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ö/g, "o")
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .trim();
}

type Suggestion =
  | { kind: "district"; district: string }
  | { kind: "place"; district: string; neighborhood: string; label: string };

export interface LocationPickerProps {
  district: string | null;
  neighborhood: string | null;
  onChange: (district: string | null, neighborhood: string | null) => void;
  label?: string;
  required?: boolean;
  error?: string;
}

export function LocationPicker({
  district,
  neighborhood,
  onChange,
  label,
  required,
  error,
}: LocationPickerProps) {
  const t = useTranslations("locationPicker");
  const listId = useId();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [locating, setLocating] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  const blurTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const selectedLabel = neighborhood
    ? `${neighborhood}, ${district}`
    : (district ?? "");

  const suggestions = useMemo<Suggestion[]>(() => {
    const q = normalize(query);
    if (!q) {
      // No query: offer the districts as a starting point.
      return ISTANBUL_DISTRICT_NAMES.map((d) => ({
        kind: "district" as const,
        district: d,
      }));
    }
    const districtHits: Suggestion[] = ISTANBUL_DISTRICTS.filter((d) =>
      normalize(d.district).includes(q),
    ).map((d) => ({ kind: "district", district: d.district }));
    const placeHits: Suggestion[] = ISTANBUL_PLACES.filter(
      (p) =>
        normalize(p.neighborhood).includes(q) ||
        normalize(p.district).includes(q),
    ).map((p) => ({
      kind: "place",
      district: p.district,
      neighborhood: p.neighborhood,
      label: p.label,
    }));
    return [...districtHits, ...placeHits].slice(0, MAX_RESULTS);
  }, [query]);

  function select(s: Suggestion) {
    if (s.kind === "district") {
      onChange(s.district, null);
    } else {
      onChange(s.district, s.neighborhood);
    }
    setQuery("");
    setOpen(false);
  }

  function clear() {
    onChange(null, null);
    setQuery("");
    setGeoError(null);
  }

  function handleKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape") {
      setOpen(false);
    } else if (e.key === "Enter" && open && suggestions.length > 0) {
      e.preventDefault();
      select(suggestions[0]);
    }
  }

  async function useMyLocation() {
    setGeoError(null);
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setGeoError(t("geoUnsupported"));
      return;
    }
    // Browsers only prompt for (and grant) geolocation on a secure
    // context - https or localhost. On an insecure origin, in a
    // permissioned iframe, or after a remembered block, the request
    // fails instantly with no prompt, so explain that rather than
    // claiming the user blocked it.
    if (typeof window !== "undefined" && window.isSecureContext === false) {
      setGeoError(t("geoInsecure"));
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&zoom=12&addressdetails=1`,
            { headers: { Accept: "application/json" } },
          );
          const data = await res.json();
          const addr = (data?.address ?? {}) as Record<string, string>;
          // Candidate fields where the ilçe tends to land.
          const candidates = [
            addr.city_district,
            addr.town,
            addr.suburb,
            addr.municipality,
            addr.county,
            addr.district,
          ].filter(Boolean);
          let matched: string | null = null;
          for (const c of candidates) {
            const hit = ISTANBUL_DISTRICT_NAMES.find(
              (d) => normalize(d) === normalize(c),
            );
            if (hit) {
              matched = hit;
              break;
            }
          }
          if (matched) {
            onChange(matched, null);
            setQuery("");
          } else {
            setGeoError(t("geoNoMatch"));
          }
        } catch {
          setGeoError(t("geoError"));
        } finally {
          setLocating(false);
        }
      },
      (err) => {
        setLocating(false);
        // 1 = PERMISSION_DENIED, 2 = POSITION_UNAVAILABLE, 3 = TIMEOUT.
        // Only code 1 is an actual block; the rest are "couldn't read it".
        setGeoError(err.code === 1 ? t("geoDenied") : t("geoError"));
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 },
    );
  }

  const fieldId = `${listId}-input`;
  const hasSelection = Boolean(district);

  return (
    <div data-field="city_district">
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
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <MapPin
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
              value={open ? query : hasSelection ? selectedLabel : query}
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
          </div>

          <button
            type="button"
            onClick={useMyLocation}
            disabled={locating}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-black/5 bg-white/70 px-3 py-2.5 text-xs font-medium text-[#5d6d7e] transition-colors hover:bg-primary-50 disabled:opacity-60 dark:border-white/5 dark:bg-[#1e2130] dark:text-[#99a3ad]"
          >
            {locating ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
            ) : (
              <LocateFixed className="h-3.5 w-3.5" aria-hidden />
            )}
            <span className="hidden sm:inline">{t("useLocation")}</span>
          </button>
        </div>

        {open && suggestions.length > 0 && (
          <ul
            id={listId}
            role="listbox"
            className="absolute z-30 mt-1 max-h-64 w-full overflow-auto rounded-xl border border-black/10 bg-white py-1 shadow-lg dark:border-white/10 dark:bg-[#1a1a2e]"
            onMouseDown={() => {
              // Keep the list open through the click that follows blur.
              if (blurTimer.current) clearTimeout(blurTimer.current);
            }}
          >
            {suggestions.map((s) => {
              const key =
                s.kind === "district" ? `d:${s.district}` : `p:${s.label}`;
              return (
                <li key={key} role="option" aria-selected={false}>
                  <button
                    type="button"
                    onClick={() => select(s)}
                    className="flex w-full items-center gap-2 px-3 py-2 text-start text-sm text-[#1a1a2e] transition-colors hover:bg-primary-50 dark:text-[#f2f3f4] dark:hover:bg-[#1e2130]"
                  >
                    {s.kind === "district" ? (
                      <>
                        <span className="font-medium">{s.district}</span>
                        <span className="text-xs text-[#5d6d7e] dark:text-[#99a3ad]">
                          {t("wholeDistrict")}
                        </span>
                      </>
                    ) : (
                      <>
                        <span>{s.neighborhood}</span>
                        <span className="text-xs text-[#5d6d7e] dark:text-[#99a3ad]">
                          {s.district}
                        </span>
                      </>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        {open && query && suggestions.length === 0 && (
          <div className="absolute z-30 mt-1 w-full rounded-xl border border-black/10 bg-white px-3 py-3 text-sm text-[#5d6d7e] shadow-lg dark:border-white/10 dark:bg-[#1a1a2e] dark:text-[#99a3ad]">
            {t("noResults")}
          </div>
        )}
      </div>

      {geoError && (
        <p className="mt-1.5 text-xs text-amber-600 dark:text-amber-400">
          {geoError}
        </p>
      )}
      {error && (
        <p className="animate-error-fade-in mt-1.5 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
