import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { bcp47, defaultLocale, type Locale } from "@/lib/i18n/config";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Resolve a Locale (or undefined) to a BCP 47 tag for Intl. Falls back to the
// default locale's tag so callers that don't have a locale in context still
// get a sensible format.
function resolveTag(locale?: Locale): string {
  return bcp47[locale ?? defaultLocale];
}

export function formatDate(
  date: string | Date,
  options?: Intl.DateTimeFormatOptions,
  locale?: Locale,
) {
  return new Intl.DateTimeFormat(resolveTag(locale), {
    month: "long",
    day: "numeric",
    year: "numeric",
    ...options,
  }).format(new Date(date));
}

export function formatDateShort(date: string | Date, locale?: Locale) {
  return new Intl.DateTimeFormat(resolveTag(locale), {
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

export function formatEventDate(date: string | Date, locale?: Locale) {
  return new Intl.DateTimeFormat(resolveTag(locale), {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

export function truncate(str: string, length: number) {
  if (str.length <= length) return str;
  return str.slice(0, length).trimEnd() + "...";
}
