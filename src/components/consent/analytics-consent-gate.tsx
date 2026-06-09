"use client";

import { Analytics } from "@vercel/analytics/next";
import { useConsent } from "./consent-provider";

// Vercel Analytics, aligned with the same policy as GA4: an explicit
// rejection wins, otherwise measure. Vercel Web Analytics is cookieless
// (no identifiers stored on the device, like the always-on SpeedInsights),
// so it doesn't need the EEA denied-by-default that gates GA4's
// analytics_storage - only an explicit "reject" should turn it off.
// Mounting it for undecided visitors keeps its numbers comparable with
// GA4's instead of undercounting everyone who never touches the banner.
export function AnalyticsConsentGate() {
  const { consent } = useConsent();
  if (consent.decided && consent.analytics === "denied") return null;
  return <Analytics />;
}
