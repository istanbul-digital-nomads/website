import { Suspense } from "react";
import { HeaderWithCounts } from "@/components/layout/header-with-counts";

/**
 * App layout - applies to product surfaces members come back to (today,
 * plans, dashboard, onboarding). Same Header as marketing today, but
 * isolated so we can diverge later (auth redirect at the layout level,
 * a thinner workspace nav, an authed-user menu).
 */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Suspense fallback={null}>
        <HeaderWithCounts />
      </Suspense>
      {children}
    </>
  );
}
