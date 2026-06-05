"use client";

import { Analytics } from "@vercel/analytics/next";
import { useConsent } from "./consent-provider";

// Vercel Analytics, gated behind the same consent toggle as GA4 so there's a
// single consent surface. SpeedInsights stays always-on in the layout (it's
// performance RUM with no behavioral/PII tracking).
export function AnalyticsConsentGate() {
  const { consent } = useConsent();
  if (consent.analytics !== "granted") return null;
  return <Analytics />;
}
