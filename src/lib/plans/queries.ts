import { cacheLife, cacheTag } from "next/cache";
import { createClient, createPublicClient } from "@/lib/supabase/server";
import { todayInIstanbul, addDays } from "./expiry";
import type { Database } from "@/types/database";

type PlanRow = Database["public"]["Tables"]["plans"]["Row"];
type AttendeeRow = Database["public"]["Tables"]["plan_attendees"]["Row"];
type CommentRow = Database["public"]["Tables"]["plan_comments"]["Row"];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnySupabase = { from: (table: string) => any };

export interface PlanCardSummary extends PlanRow {
  host: {
    id: string;
    display_name: string;
    avatar_url: string | null;
    city_district: string | null;
  } | null;
  attendees: Array<{
    member_id: string;
    display_name: string;
    avatar_url: string | null;
  }>;
  attendee_count: number;
}

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
  host_telegram_handle: string | null;
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

export async function getPlansForFeed(options: {
  range: PlanRange;
  neighborhood?: string;
  vibe?: string;
}): Promise<{ data: PlanCardSummary[]; error: string | null }> {
  const supabase = (await createClient()) as unknown as AnySupabase;
  const { from, to } = rangeBounds(options.range);

  let query = supabase
    .from("plans")
    .select(
      `
      *,
      host:members!plans_creator_id_fkey (
        id, display_name, avatar_url, city_district
      ),
      attendees:plan_attendees (
        member_id,
        member:members (id, display_name, avatar_url)
      )
      `,
    )
    .eq("status", "active")
    .gte("scheduled_date", from)
    .lte("scheduled_date", to)
    .gt("expires_at", new Date().toISOString())
    .order("scheduled_date", { ascending: true })
    .order("start_time", { ascending: true, nullsFirst: false });

  if (options.neighborhood) {
    query = query.eq("neighborhood_slug", options.neighborhood);
  }
  if (options.vibe) {
    query = query.eq("vibe", options.vibe);
  }

  const { data, error } = await query;
  if (error) return { data: [], error: error.message };

  const cards: PlanCardSummary[] = (
    (data ?? []) as unknown as Array<
      PlanRow & {
        host: PlanCardSummary["host"];
        attendees: Array<{
          member_id: string;
          member: {
            id: string;
            display_name: string;
            avatar_url: string | null;
          } | null;
        }>;
      }
    >
  ).map((row) => ({
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
  }));

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
        id, display_name, avatar_url, city_district, telegram_handle
      ),
      attendees:plan_attendees (
        member_id,
        member:members (id, display_name, avatar_url)
      ),
      comments:plan_comments (
        id, plan_id, author_id, body, created_at,
        author:members (id, display_name, avatar_url)
      )
      `,
    )
    .eq("id", id)
    .maybeSingle();

  if (error) return { data: null, error: error.message };
  if (!data) return { data: null, error: null };

  const row = data as unknown as PlanRow & {
    host: {
      id: string;
      display_name: string;
      avatar_url: string | null;
      city_district: string | null;
      telegram_handle: string | null;
    } | null;
    attendees: Array<{
      member_id: string;
      member: {
        id: string;
        display_name: string;
        avatar_url: string | null;
      } | null;
    }>;
    comments: Array<
      CommentRow & {
        author: {
          id: string;
          display_name: string;
          avatar_url: string | null;
        } | null;
      }
    >;
  };

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
          }
        : null,
      attendees,
      attendee_count: attendees.length,
      host_telegram_handle: row.host?.telegram_handle ?? null,
      comments: (row.comments ?? []).sort((a, b) =>
        a.created_at.localeCompare(b.created_at),
      ),
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
