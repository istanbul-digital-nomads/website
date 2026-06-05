import { cacheLife, cacheTag } from "next/cache";
import { createClient, createPublicClient } from "@/lib/supabase/server";
import { todayInIstanbul, addDays } from "./expiry";
import type { Database } from "@/types/database";
import type { PlanVibe } from "./vibes";
import type { TransportMode } from "./transport";

type PlanRow = Database["public"]["Tables"]["plans"]["Row"];
type StopRow = Database["public"]["Tables"]["plan_stops"]["Row"];
type AttendeeRow = Database["public"]["Tables"]["plan_attendees"]["Row"];
type CommentRow = Database["public"]["Tables"]["plan_comments"]["Row"];
type ReviewRow = Database["public"]["Tables"]["plan_reviews"]["Row"];

type AnySupabase = {
  from: (table: string) => any;
};

export interface PlanStop extends Omit<StopRow, "vibe" | "transport_mode"> {
  vibe: PlanVibe;
  transport_mode: TransportMode | null;
}

export interface ReviewSummary {
  // Average rating rounded to 1 decimal, or null when there are no reviews.
  average: number | null;
  count: number;
  wouldReturnCount: number;
}

// Aggregate a set of reviews into the numbers a card/detail badge needs.
// Mirrors the honest-partial spirit of computeNomadScore in spaces.ts.
export function summarizeReviews(
  rows: Array<{ rating: number; would_return: boolean }> | null | undefined,
): ReviewSummary {
  const list = rows ?? [];
  if (list.length === 0) {
    return { average: null, count: 0, wouldReturnCount: 0 };
  }
  const total = list.reduce((sum, r) => sum + r.rating, 0);
  return {
    average: Math.round((total / list.length) * 10) / 10,
    count: list.length,
    wouldReturnCount: list.filter((r) => r.would_return).length,
  };
}

export interface PlanCardSummary extends PlanRow {
  host: {
    id: string;
    display_name: string;
    avatar_url: string | null;
    city_district: string | null;
    member_type: string | null;
    verification_level: string | null;
  } | null;
  attendees: Array<{
    member_id: string;
    display_name: string;
    avatar_url: string | null;
  }>;
  attendee_count: number;
  stops: PlanStop[];
  rating_summary: ReviewSummary;
}

export type PlanReviewWithAuthor = ReviewRow & {
  author: {
    id: string;
    display_name: string;
    avatar_url: string | null;
  } | null;
};

export interface PlanDetail extends PlanCardSummary {
  comments: Array<
    CommentRow & {
      author: {
        id: string;
        display_name: string;
        avatar_url: string | null;
      } | null;
    }
  >;
  reviews: PlanReviewWithAuthor[];
  host_telegram_handle: string | null;
  // True once the plan's expiry has passed. Computed server-side so the
  // page render stays pure (no Date.now() in the component body).
  ended: boolean;
}

export type PlanRange = "today" | "tomorrow" | "week";

function rangeBounds(range: PlanRange): { from: string; to: string } {
  const today = todayInIstanbul();
  if (range === "today") return { from: today, to: today };
  if (range === "tomorrow") {
    const t = addDays(today, 1);
    return { from: t, to: t };
  }
  return { from: today, to: addDays(today, 7) };
}

function sortStops<T extends { ordinal: number }>(
  stops: T[] | null | undefined,
): T[] {
  return (stops ?? []).slice().sort((a, b) => a.ordinal - b.ordinal);
}

const PLAN_SELECT = `
  *,
  host:members!plans_creator_id_fkey (
    id, display_name, avatar_url, city_district, member_type, verification_level
  ),
  attendees:plan_attendees (
    member_id,
    member:members (id, display_name, avatar_url)
  ),
  stops:plan_stops (*),
  reviews:plan_reviews (rating, would_return)
`;

export async function getPlansForFeed(options: {
  range: PlanRange;
  neighborhood?: string;
  vibe?: string;
}): Promise<{ data: PlanCardSummary[]; error: string | null }> {
  const supabase = (await createClient()) as unknown as AnySupabase;
  const { from, to } = rangeBounds(options.range);

  let query = supabase
    .from("plans")
    .select(PLAN_SELECT)
    .eq("status", "active")
    .gte("scheduled_date", from)
    .lte("scheduled_date", to)
    .gt("expires_at", new Date().toISOString())
    .order("scheduled_date", { ascending: true });

  // Stop-level filters: server-side via the stop table join. Supabase
  // doesn't filter the parent table by joined-row conditions out of the box,
  // so we post-filter in app code below.

  const { data, error } = await query;
  if (error) return { data: [], error: error.message };

  type Raw = PlanRow & {
    host: PlanCardSummary["host"];
    attendees: Array<{
      member_id: string;
      member: {
        id: string;
        display_name: string;
        avatar_url: string | null;
      } | null;
    }>;
    stops: StopRow[];
    reviews: Array<{ rating: number; would_return: boolean }>;
  };

  const cards: PlanCardSummary[] = ((data ?? []) as unknown as Raw[])
    .map((row) => ({
      ...row,
      host: row.host,
      attendees: (row.attendees ?? [])
        .filter((a) => a.member)
        .map((a) => ({
          member_id: a.member_id,
          display_name: a.member!.display_name,
          avatar_url: a.member!.avatar_url,
        })),
      attendee_count: row.attendees?.length ?? 0,
      stops: sortStops(row.stops) as PlanStop[],
      rating_summary: summarizeReviews(row.reviews),
    }))
    .filter((plan) => {
      if (
        options.neighborhood &&
        !plan.stops.some((s) => s.neighborhood_slug === options.neighborhood)
      ) {
        return false;
      }
      if (options.vibe && !plan.stops.some((s) => s.vibe === options.vibe)) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      const aStart = a.stops[0]?.start_time ?? "99:99";
      const bStart = b.stops[0]?.start_time ?? "99:99";
      return (
        a.scheduled_date.localeCompare(b.scheduled_date) ||
        aStart.localeCompare(bStart)
      );
    });

  return { data: cards, error: null };
}

export async function getPlanById(
  id: string,
): Promise<{ data: PlanDetail | null; error: string | null }> {
  const supabase = (await createClient()) as unknown as AnySupabase;
  const { data, error } = await supabase
    .from("plans")
    .select(
      `
      *,
      host:members!plans_creator_id_fkey (
        id, display_name, avatar_url, city_district, telegram_handle, member_type, verification_level
      ),
      attendees:plan_attendees (
        member_id,
        member:members (id, display_name, avatar_url)
      ),
      stops:plan_stops (*),
      comments:plan_comments (
        id, plan_id, author_id, body, created_at,
        author:members (id, display_name, avatar_url)
      ),
      reviews:plan_reviews (
        id, plan_id, author_id, rating, would_return, quote, body, photos, created_at, updated_at,
        author:members (id, display_name, avatar_url)
      )
      `,
    )
    .eq("id", id)
    .maybeSingle();

  if (error) return { data: null, error: error.message };
  if (!data) return { data: null, error: null };

  type Raw = PlanRow & {
    host: {
      id: string;
      display_name: string;
      avatar_url: string | null;
      city_district: string | null;
      telegram_handle: string | null;
      member_type: string | null;
      verification_level: string | null;
    } | null;
    attendees: Array<{
      member_id: string;
      member: {
        id: string;
        display_name: string;
        avatar_url: string | null;
      } | null;
    }>;
    stops: StopRow[];
    comments: Array<
      CommentRow & {
        author: {
          id: string;
          display_name: string;
          avatar_url: string | null;
        } | null;
      }
    >;
    reviews: PlanReviewWithAuthor[];
  };
  const row = data as unknown as Raw;

  const attendees = (row.attendees ?? [])
    .filter((a) => a.member)
    .map((a) => ({
      member_id: a.member_id,
      display_name: a.member!.display_name,
      avatar_url: a.member!.avatar_url,
    }));

  return {
    data: {
      ...row,
      host: row.host
        ? {
            id: row.host.id,
            display_name: row.host.display_name,
            avatar_url: row.host.avatar_url,
            city_district: row.host.city_district,
            member_type: row.host.member_type,
            verification_level: row.host.verification_level,
          }
        : null,
      attendees,
      attendee_count: attendees.length,
      host_telegram_handle: row.host?.telegram_handle ?? null,
      stops: sortStops(row.stops) as PlanStop[],
      comments: (row.comments ?? []).sort((a, b) =>
        a.created_at.localeCompare(b.created_at),
      ),
      reviews: (row.reviews ?? []).sort((a, b) =>
        b.created_at.localeCompare(a.created_at),
      ),
      rating_summary: summarizeReviews(row.reviews),
      ended: new Date(row.expires_at).getTime() < Date.now(),
    },
    error: null,
  };
}

export async function getMyAttendance(planIds: string[]): Promise<Set<string>> {
  if (!planIds.length) return new Set();
  const client = await createClient();
  const {
    data: { user },
  } = await client.auth.getUser();
  if (!user) return new Set();
  const supabase = client as unknown as AnySupabase;

  const { data } = await supabase
    .from("plan_attendees")
    .select("plan_id")
    .eq("member_id", user.id)
    .eq("status", "going")
    .in("plan_id", planIds);

  return new Set(
    ((data ?? []) as Pick<AttendeeRow, "plan_id">[]).map((r) => r.plan_id),
  );
}

// A plan the member joined, trimmed to what a dashboard row needs, plus a
// flag for whether the plan has ended (so we can nudge a review).
export interface AttendedPlan {
  id: string;
  title: string;
  scheduled_date: string;
  status: PlanRow["status"];
  ended: boolean;
  reviewed: boolean;
}

// All plans the current member is going to (past + future), newest first.
// Drives the "your plans" surface on the dashboard. `reviewed` lets the UI
// show "leave a review" only on ended plans the member hasn't reviewed yet.
export async function getMyAttendedPlans(): Promise<AttendedPlan[]> {
  const client = await createClient();
  const {
    data: { user },
  } = await client.auth.getUser();
  if (!user) return [];
  const supabase = client as unknown as AnySupabase;

  const { data, error } = await supabase
    .from("plan_attendees")
    .select(
      `
      plan:plans!inner (
        id, title, scheduled_date, status, expires_at,
        reviews:plan_reviews (author_id)
      )
      `,
    )
    .eq("member_id", user.id)
    .eq("status", "going");

  if (error || !data) return [];

  type Raw = {
    plan: {
      id: string;
      title: string;
      scheduled_date: string;
      status: PlanRow["status"];
      expires_at: string;
      reviews: Array<{ author_id: string }>;
    } | null;
  };

  const now = Date.now();
  return ((data as unknown as Raw[]) ?? [])
    .map((row) => row.plan)
    .filter((p): p is NonNullable<Raw["plan"]> => !!p)
    .map((p) => ({
      id: p.id,
      title: p.title,
      scheduled_date: p.scheduled_date,
      status: p.status,
      ended: new Date(p.expires_at).getTime() < now,
      reviewed: (p.reviews ?? []).some((r) => r.author_id === user.id),
    }))
    .sort((a, b) => b.scheduled_date.localeCompare(a.scheduled_date));
}

export async function getMyTelegramSubscription(): Promise<{
  chat_id: number;
} | null> {
  const client = await createClient();
  const {
    data: { user },
  } = await client.auth.getUser();
  if (!user) return null;
  const supabase = client as unknown as AnySupabase;

  const { data } = await supabase
    .from("telegram_subscriptions")
    .select("telegram_chat_id")
    .eq("member_id", user.id)
    .maybeSingle();

  return data
    ? { chat_id: (data as { telegram_chat_id: number }).telegram_chat_id }
    : null;
}

// Public counters - cookie-less, cached for the landing.
export async function getPlansTodayCount(): Promise<{
  count: number;
  byNeighborhood: Array<{ neighborhood_slug: string; count: number }>;
}> {
  "use cache";
  cacheLife("minutes");
  cacheTag("plans-today");
  const supabase = createPublicClient() as unknown as AnySupabase;
  const [countRes, byHoodRes] = await Promise.all([
    supabase.from("plans_today_count").select("count").maybeSingle(),
    supabase.from("plans_today_by_neighborhood").select("*"),
  ]);
  return {
    count:
      ((countRes.data as { count?: number } | null)?.count as
        | number
        | undefined) ?? 0,
    byNeighborhood:
      ((byHoodRes.data ?? []) as Array<{
        neighborhood_slug: string;
        count: number;
      }>) ?? [],
  };
}

// Plans hosted today by a specific member (for the profile page surface).
export async function getMemberPlansToday(
  memberId: string,
): Promise<PlanCardSummary[]> {
  const supabase = (await createClient()) as unknown as AnySupabase;
  const today = todayInIstanbul();
  const { data, error } = await supabase
    .from("plans")
    .select(PLAN_SELECT)
    .eq("status", "active")
    .eq("creator_id", memberId)
    .gte("scheduled_date", today)
    .lte("scheduled_date", addDays(today, 7))
    .gt("expires_at", new Date().toISOString())
    .order("scheduled_date", { ascending: true });

  if (error || !data) return [];

  type Raw = PlanRow & {
    host: PlanCardSummary["host"];
    attendees: Array<{
      member_id: string;
      member: {
        id: string;
        display_name: string;
        avatar_url: string | null;
      } | null;
    }>;
    stops: StopRow[];
    reviews: Array<{ rating: number; would_return: boolean }>;
  };

  return (data as unknown as Raw[]).map((row) => ({
    ...row,
    host: row.host,
    attendees: (row.attendees ?? [])
      .filter((a) => a.member)
      .map((a) => ({
        member_id: a.member_id,
        display_name: a.member!.display_name,
        avatar_url: a.member!.avatar_url,
      })),
    attendee_count: row.attendees?.length ?? 0,
    stops: sortStops(row.stops) as PlanStop[],
    rating_summary: summarizeReviews(row.reviews),
  }));
}
