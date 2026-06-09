// Central GA4 event layer + consent constants.
//
// Every funnel event goes through `track()`. Events go through the `gtag()`
// stub (defined in the <head> consent bootstrap), which pushes into the shared
// dataLayer. GTM (loaded with `strategy="lazyOnload"`) picks these up and its
// "GA4 - Event Forwarding" tag sends them to GA4 - the gtag-style push means
// the params land in eventModel and are forwarded automatically. Each event below
// fires from a user gesture that happens well after load, so the "stub missing"
// branch is rare and harmless (we'd rather drop one early event than buffer/replay).
//
// Consent has exactly one policy, applied in two layers:
//   1. An explicit choice (the first-party `in_consent` cookie that
//      ConsentProvider writes) wins globally. An explicit "denied" is a hard
//      gate here in `track()` - nothing is pushed at all, not even the
//      cookieless pings Consent Mode would otherwise send.
//   2. With no explicit choice, events are pushed and Google Consent Mode v2
//      decides: the <head> bootstrap defaults analytics_storage to denied in
//      the EEA/UK/CH (GA4 degrades to cookieless pings until the banner is
//      answered) and granted everywhere else. Google resolves the region from
//      IP, which client JS can't see - so the JS layer must not second-guess
//      the region default, only the explicit choice.

export const CONSENT_COOKIE = "in_consent";
export const CONSENT_GRANTED = "analytics:granted";
export const CONSENT_DENIED = "analytics:denied";

// EEA + UK + CH: the regions where analytics_storage defaults to denied and
// the cookie banner gates analytics. Interpolated into the inline <head>
// consent bootstrap (layout.tsx) so the policy has one home.
export const EEA_REGIONS = [
  "AT",
  "BE",
  "BG",
  "HR",
  "CY",
  "CZ",
  "DK",
  "EE",
  "FI",
  "FR",
  "DE",
  "GR",
  "HU",
  "IE",
  "IT",
  "LV",
  "LT",
  "LU",
  "MT",
  "NL",
  "PL",
  "PT",
  "RO",
  "SK",
  "SI",
  "ES",
  "SE",
  "IS",
  "LI",
  "NO",
  "GB",
  "CH",
] as const;

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
  | "event_rsvp"
  // GA4-recommended ecommerce name. Fired when a ticket checkout actually
  // proceeds to the payment provider - not on the "payments not live" path -
  // so it only counts real checkout starts. Carries value + currency so GA4
  // Monetization reports populate. The matching `purchase` event is captured
  // server-side from the iyzico callback (see payments docs), not here.
  | "begin_checkout"
  // A member submitted a verification request (Basic -> Verified).
  | "verification_request_submit"
  // A Command-K result was selected; carries the search term that led to it.
  | "command_menu_select"
  // GA4-recommended lead event - populates the standard Lead reports. Fired
  // from the three lead-capture moments; `lead_source` says which one:
  // "newsletter", "surprise_event_waitlist", or "relocation_agent".
  | "generate_lead"
  // GA4-recommended share event. Fired from ShareButton with the standard
  // params: method (native_sheet/clipboard), content_type, item_id.
  | "share"
  // Assistant widget: opened (trigger: launcher/page_cta), a quick-reply
  // chip advanced the flow (node_id/option_key), or a link card navigated
  // out of the assistant (destination/content_type).
  | "assistant_open"
  | "assistant_flow_advance"
  | "assistant_link_click"
  // Path to Istanbul: a country was picked on the selector. Unsupported
  // picks are tracked too - that's the demand signal for new playbooks.
  | "path_country_select"
  // Relocation agent form rendered - the top of its generate_lead funnel.
  | "relocation_form_start";

type EventParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

/** True only when the visitor has explicitly rejected analytics. */
export function analyticsDenied(): boolean {
  if (typeof document === "undefined") return false;
  return new RegExp(`(?:^|;\\s*)${CONSENT_COOKIE}=[^;]*${CONSENT_DENIED}`).test(
    document.cookie,
  );
}

/**
 * Fire a GA4 event. No-ops on the server, after an explicit rejection, or
 * before the gtag stub exists. Without an explicit choice the event is pushed
 * and Consent Mode's region-scoped state decides what GA4 does with it.
 */
export function track(event: AnalyticsEvent, params: EventParams = {}): void {
  if (typeof window === "undefined") return;
  if (analyticsDenied()) return;
  if (typeof window.gtag !== "function") return;
  window.gtag("event", event, params);
}

/**
 * Fire a GA4 event, then navigate. A bare dataLayer push dies with the page
 * on a full navigation, so this wires gtag's event_callback (fires once tags
 * have run) with a timeout fallback for when GTM hasn't booted yet
 * (`lazyOnload` means that window is real on slow connections). Worst case
 * the navigation is delayed by ~`timeoutMs`; the event is still lost if GTM
 * never loaded, which we accept rather than buffering across pages.
 */
export function trackThenNavigate(
  event: AnalyticsEvent,
  params: EventParams,
  navigate: () => void,
  timeoutMs = 400,
): void {
  if (typeof window === "undefined") return;
  let navigated = false;
  const go = () => {
    if (navigated) return;
    navigated = true;
    navigate();
  };
  if (analyticsDenied() || typeof window.gtag !== "function") {
    go();
    return;
  }
  window.gtag("event", event, {
    ...params,
    event_callback: go,
    event_timeout: timeoutMs,
  });
  setTimeout(go, timeoutMs);
}
