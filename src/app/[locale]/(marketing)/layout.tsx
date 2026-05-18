import { Suspense } from "react";
import { HeaderWithCounts } from "@/components/layout/header-with-counts";

/**
 * Marketing layout - applies to every public-facing content route (about,
 * blog, guides, members, perks, spaces, events, etc.). Just wraps the
 * route in the global Header. The shell layout above still provides
 * Footer + BottomTabBar + universal islands.
 */
export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Suspense fallback={null}>
        <HeaderWithCounts />
      </Suspense>
      {children}
    </>
  );
}
