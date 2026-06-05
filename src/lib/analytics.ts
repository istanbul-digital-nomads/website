// Central GA4 event layer + consent constants.
//
// Every funnel event goes through `track()`, which is a no-op until the visitor
// has granted analytics consent (Google Consent Mode v2). Events go through the
// `gtag()` stub (defined in the <head> consent bootstrap), which pushes into the
// shared dataLayer. GTM (loaded with `strategy="lazyOnload"`) picks these up and
// its "GA4 - Event Forwarding" tag sends them to GA4 - the gtag-style push means
// the params land in eventModel and are forwarded automatically. Each event below
// fires from a user gesture that happens well after load, so the "stub missing"
// branch is rare and harmless (we'd rather drop one early event than buffer/replay).
//
// The source of truth for "may we track" is the first-party `in_consent`
// cookie that ConsentProvider writes and the inline <head> bootstrap reads -
// it's cheaper and more reliable than poking GTM's internal consent state.

export const CONSENT_COOKIE = "in_consent";
export const CONSENT_GRANTED = "analytics:granted";
export const CONSENT_DENIED = "analytics:denied";

// GA4 recommended event names (`login`, `sign_up`) are reused verbatim so GA4's
// standard reports light up; everything else is custom snake_case.
export type AnalyticsEvent =
  | "hero_cta_click"
  | "onboarding_start"
  | "onboarding_step"
  | "onboarding_complete"
  | "login"
  | "sign_up"
  | "plan_create_start"
  | "plan_create_submit"
  | "plan_create_success"
  | "plan_join"
  | "plan_leave"
  | "event_rsvp";

type EventParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

/** True only when the visitor has explicitly granted analytics consent. */
export function analyticsGranted(): boolean {
  if (typeof document === "undefined") return false;
  return new RegExp(
    `(?:^|;\\s*)${CONSENT_COOKIE}=[^;]*${CONSENT_GRANTED}`,
  ).test(document.cookie);
}

/** Fire a GA4 event. No-ops on the server, without consent, or before GA loads. */
export function track(event: AnalyticsEvent, params: EventParams = {}): void {
  if (typeof window === "undefined") return;
  if (!analyticsGranted()) return;
  if (typeof window.gtag !== "function") return;
  window.gtag("event", event, params);
}
