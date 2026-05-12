export const locales = ["en", "tr", "fa", "ar", "ru"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const localeNames: Record<Locale, string> = {
  en: "English",
  tr: "Türkçe",
  fa: "فارسی",
  ar: "العربية",
  ru: "Русский",
};

export const bcp47: Record<Locale, string> = {
  en: "en-US",
  tr: "tr-TR",
  fa: "fa-IR",
  ar: "ar-SA",
  ru: "ru-RU",
};

export const rtlLocales = new Set<Locale>(["fa", "ar"]);

export const isRtl = (locale: Locale) => rtlLocales.has(locale);

export const isValidLocale = (value: string): value is Locale =>
  (locales as readonly string[]).includes(value);
