"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  CONSENT_COOKIE,
  CONSENT_DENIED,
  CONSENT_GRANTED,
} from "@/lib/analytics";
import { CookieBanner } from "./cookie-banner";

export type ConsentValue = "granted" | "denied";
export type ConsentState = {
  /** Has the visitor made a choice yet? Banner shows while false. */
  decided: boolean;
  /** GA4 + Vercel Analytics. */
  analytics: ConsentValue;
};

interface ConsentContextValue {
  consent: ConsentState;
  acceptAll: () => void;
  rejectNonEssential: () => void;
  /** Re-open the banner (e.g. from a footer "Cookie settings" link). */
  openPreferences: () => void;
}

const ConsentContext = createContext<ConsentContextValue | undefined>(
  undefined,
);

export function useConsent() {
  const ctx = useContext(ConsentContext);
  if (!ctx) throw new Error("useConsent must be used within ConsentProvider");
  return ctx;
}

const COOKIE_MAX_AGE = 60 * 60 * 24 * 180; // 180 days

function persist(granted: boolean) {
  const value = granted ? CONSENT_GRANTED : CONSENT_DENIED;
  try {
    localStorage.setItem(CONSENT_COOKIE, value);
  } catch {
    /* private mode / storage disabled - cookie below is the fallback */
  }
  // Mirror the cookie-write pattern from language-switcher.tsx so the inline
  // <head> bootstrap can read the decision on the next visit (no denied-flash).
  document.cookie = `${CONSENT_COOKIE}=${value}; path=/; max-age=${COOKIE_MAX_AGE}; samesite=lax`;
}

export function ConsentProvider({ children }: { children: ReactNode }) {
  // Start `decided: true` so the banner never flashes during SSR/first paint.
  // The mount effect flips it to false only when there's no prior decision.
  const [consent, setConsent] = useState<ConsentState>({
    decided: true,
    analytics: "denied",
  });

  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(CONSENT_COOKIE);
    } catch {
      /* ignore */
    }
    if (stored === CONSENT_GRANTED || stored === CONSENT_DENIED) {
      // Re-persist on every visit. localStorage never expires but the cookie's
      // 180-day max-age does; without this, a lapsed cookie silently flips the
      // visitor back to the <head> bootstrap's region default (granted outside
      // the EEA) while the banner stays hidden - tracking someone who said no.
      // Re-writing slides the cookie's expiry and the consent update corrects
      // Consent Mode if this page load already booted from the wrong default.
      persist(stored === CONSENT_GRANTED);
      window.gtag?.("consent", "update", {
        analytics_storage: stored === CONSENT_GRANTED ? "granted" : "denied",
      });
    }
    // One-shot post-hydration sync; consent is read once then user-driven.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional one-shot boot sync (mirrors ThemeProvider)
    setConsent(
      stored === CONSENT_GRANTED
        ? { decided: true, analytics: "granted" }
        : stored === CONSENT_DENIED
          ? { decided: true, analytics: "denied" }
          : { decided: false, analytics: "denied" },
    );
  }, []);

  const apply = useCallback((granted: boolean) => {
    persist(granted);
    // Consent Mode v2 update. ad_* stay denied - this product has no ads.
    window.gtag?.("consent", "update", {
      analytics_storage: granted ? "granted" : "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
    window.dispatchEvent(new Event("consent-changed"));
    setConsent({ decided: true, analytics: granted ? "granted" : "denied" });
  }, []);

  const acceptAll = useCallback(() => apply(true), [apply]);
  const rejectNonEssential = useCallback(() => apply(false), [apply]);
  const openPreferences = useCallback(
    () => setConsent((c) => ({ ...c, decided: false })),
    [],
  );

  return (
    <ConsentContext.Provider
      value={{ consent, acceptAll, rejectNonEssential, openPreferences }}
    >
      {children}
      {!consent.decided && <CookieBanner />}
    </ConsentContext.Provider>
  );
}
