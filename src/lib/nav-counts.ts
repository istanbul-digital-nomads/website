// Server-side count fetcher for the workspace nav. Reuses the already-
// cached public queries so we don't fan out duplicate Supabase round-trips
// on every page load. Returns hidden-pill counts (0) on failure so the
// nav never breaks a page render - the UI hides "0" pills anyway.
//
// `"use cache"` keeps Date.now() inside a cached scope (Next 16's
// cacheComponents forbids reading the current time in plain server
// components). cacheLife("minutes") matches the upstream events cache.

import { unstable_cacheLife as cacheLife } from "next/cache";
import { getEventsPublic } from "@/lib/supabase/queries";
import type { HeaderCounts } from "@/components/layout/header";

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

export async function getNavCounts(): Promise<HeaderCounts> {
  "use cache";
  cacheLife("minutes");
  try {
    const eventsRes = await getEventsPublic({ past: false });

    const now = Date.now();
    const horizon = now + SEVEN_DAYS_MS;
    const events =
      eventsRes.data?.filter((e) => {
        if (!e.date) return false;
        const t = new Date(e.date).getTime();
        return t >= now && t <= horizon;
      }).length ?? 0;

    return { events };
  } catch {
    return { events: 0 };
  }
}
