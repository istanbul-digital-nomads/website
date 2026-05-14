// Cache-Components-friendly i18n.
//
// `getTranslations()` from `next-intl/server` reads the request context
// (`headers()`) internally to discover the active locale. That breaks under
// Next 16's `cacheComponents` because `headers()` calls inside `"use cache"`
// scopes fail at build time.
//
// This helper sidesteps that by importing the locale message files statically
// and calling `createTranslator` directly. The result is fully deterministic
// from its `locale` + `namespace` arguments, so it works inside cached scopes.

import { createTranslator } from "next-intl";
import type { Locale } from "@/lib/i18n/config";

import en from "@/messages/en.json";
import tr from "@/messages/tr.json";
import fa from "@/messages/fa.json";
import ar from "@/messages/ar.json";
import ru from "@/messages/ru.json";

const allMessages = { en, tr, fa, ar, ru } satisfies Record<Locale, unknown>;

type MessagesShape = (typeof allMessages)[Locale];

// Loose translator type that mirrors the runtime behavior of next-intl's
// translator (string in, string out, optional `values` for ICU interpolation,
// `.has()` for existence checks). next-intl's strict generic types reject
// dynamic key access (e.g. `t(`${id}.title`)`) which is common in our pages -
// the cached helper opts out of the narrowing on purpose.
export interface CachedTranslator {
  (key: string, values?: Record<string, unknown>): string;
  has: (key: string) => boolean;
}

/**
 * Cache-safe replacement for `next-intl`'s `getTranslations({ locale, namespace })`.
 * Returns a synchronous translator bound to the static message tree for the
 * given locale. Safe to call inside `"use cache"` functions. Accepts any
 * dotted namespace path (e.g. `"sections.neighborhoodCards"`).
 */
export function getCachedTranslations(
  locale: Locale,
  namespace: string,
): CachedTranslator {
  const messages = allMessages[locale];
  return createTranslator({
    locale,
    messages: messages as MessagesShape,
    namespace,
  } as Parameters<typeof createTranslator>[0]) as unknown as CachedTranslator;
}

/**
 * Cache-safe replacement for `next-intl`'s `getMessages()`. Returns the full
 * static message tree for the locale. Safe to call inside `"use cache"`
 * functions and for hand-off to `NextIntlClientProvider`.
 */
export function getCachedMessages(locale: Locale): MessagesShape {
  return allMessages[locale];
}
