import { cacheLife, cacheTag } from "next/cache";
import { createClient, createPublicClient } from "./server";
import type {
  Event,
  EventWithRSVPCount,
  Member,
  MemberPublic,
  MemberPublicProfile,
  BlogPost,
  BlogPostWithAuthor,
  RSVP,
  RSVPWithMember,
} from "@/types/models";
import type { Database } from "@/types/database";

type LocalGuideRow = Database["public"]["Tables"]["local_guides"]["Row"];

// --- Events ---

// Public (cookie-less) events query. `use cache` so it can be called from
// uncached server components (the events index, generateMetadata) without
// bailing the route to fully-dynamic or tripping the "uncached data
// outside Suspense" guard under cacheComponents.
export async function getEventsPublic(options?: {
  type?: string;
  past?: boolean;
  limit?: number;
}) {
  "use cache";
  cacheLife("minutes");
  cacheTag("events");
  const supabase = createPublicClient();
  let query = supabase
    .from("events")
    .select("*")
    .eq("is_published", true)
    .order("date", { ascending: true });

  if (options?.type) query = query.eq("type", options.type);
  if (options?.past === true)
    query = query.lt("date", new Date().toISOString());
  else if (options?.past === false)
    query = query.gte("date", new Date().toISOString());
  if (options?.limit) query = query.limit(options.limit);

  const { data, error } = await query;
  return { data: data as Event[] | null, error };
}

export async function getEvents(options?: {
  type?: string;
  past?: boolean;
  limit?: number;
}) {
  const supabase = await createClient();
  let query = supabase
    .from("events")
    .select("*")
    .eq("is_published", true)
    .order("date", { ascending: true });

  if (options?.type) {
    query = query.eq("type", options.type);
  }

  if (options?.past === true) {
    query = query.lt("date", new Date().toISOString());
  } else if (options?.past === false) {
    query = query.gte("date", new Date().toISOString());
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;
  return { data: data as Event[] | null, error };
}

export async function getEventById(id: string) {
  const supabase = await createClient();
  const { data: event, error } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !event) return { data: null, error };

  const { count } = await supabase
    .from("rsvps")
    .select("*", { count: "exact", head: true })
    .eq("event_id", id)
    .eq("status", "going");

  const eventWithCount = Object.assign({}, event, { rsvp_count: count ?? 0 });
  return {
    data: eventWithCount as EventWithRSVPCount,
    error: null,
  };
}

// Public (cookie-less) single-event fetch by id or slug. ISR/SSG-safe -
// used by the event detail page. Tries `slug` first, falls back to `id`.
export async function getEventByIdPublic(idOrSlug: string) {
  "use cache";
  cacheLife("minutes");
  cacheTag("events");
  const supabase = createPublicClient();
  const bySlug = await supabase
    .from("events")
    .select("*")
    .eq("slug", idOrSlug)
    .eq("is_published", true)
    .maybeSingle();

  const result = bySlug.data
    ? bySlug
    : await supabase
        .from("events")
        .select("*")
        .eq("id", idOrSlug)
        .eq("is_published", true)
        .maybeSingle();

  // Cast: the two maybeSingle() results are structurally identical, but
  // TS unions their builder types into `never` for `.data`.
  const event = result.data as Event | null;
  if (result.error || !event) {
    return { data: null, error: result.error };
  }

  const { count } = await supabase
    .from("rsvps")
    .select("*", { count: "exact", head: true })
    .eq("event_id", event.id)
    .eq("status", "going");

  return {
    data: Object.assign({}, event, {
      rsvp_count: count ?? 0,
    }) as EventWithRSVPCount,
    error: null,
  };
}

// --- RSVPs ---

export async function getRSVPsForEvent(eventId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("rsvps")
    .select("*, member:members(id, display_name, avatar_url)")
    .eq("event_id", eventId);

  return { data: data as RSVPWithMember[] | null, error };
}

export async function getUserRSVP(eventId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { data: null, error: null };

  const { data, error } = await supabase
    .from("rsvps")
    .select("*")
    .eq("event_id", eventId)
    .eq("member_id", user.id)
    .maybeSingle();

  return { data: data as RSVP | null, error };
}

// All events the current member RSVP'd to (going/maybe), past + future,
// soonest upcoming first. Powers the "your events" surface on the dashboard.
export async function getMyRSVPdEvents(): Promise<Event[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("rsvps")
    .select("event:events!inner (*)")
    .eq("member_id", user.id)
    .in("status", ["going", "maybe"]);

  if (error || !data) return [];

  const events = (data as unknown as Array<{ event: Event | null }>)
    .map((r) => r.event)
    .filter((e): e is Event => !!e);
  // Soonest first; useful for "what's next" while still listing past ones.
  return events.sort((a, b) => a.date.localeCompare(b.date));
}

// --- Members ---

export async function getMembers() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("members")
    .select(
      "id, display_name, bio, avatar_url, location, skills, website, telegram_handle, member_type, is_agent, verification_level, current_status, created_at",
    )
    .eq("is_visible", true)
    .order("created_at", { ascending: false });

  return { data: data as MemberPublic[] | null, error };
}

// Public (cookie-less) opt-in member directory. `use cache` so the
// directory and profile pages stay prerenderable under cacheComponents.
export async function getMembersPublic() {
  "use cache";
  cacheLife("minutes");
  cacheTag("members");
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("members")
    .select(
      "id, display_name, bio, avatar_url, location, skills, website, telegram_handle, member_type, is_agent, verification_level, current_status, created_at",
    )
    .eq("is_visible", true)
    .order("created_at", { ascending: false });
  return { data: data as MemberPublic[] | null, error };
}

export async function getMemberByIdPublic(id: string) {
  "use cache";
  cacheLife("minutes");
  cacheTag("members");
  const supabase = createPublicClient();
  // Single select including the Phase 1 columns (professional_role,
  // tour_guide_license_no, migration 017 - applied in every live env).
  // Previously this was two round-trips for pre-migration safety; merged
  // into one query to halve the cold-load latency on the profile page.
  const { data, error } = await supabase
    .from("members")
    .select(
      "id, display_name, bio, avatar_url, location, skills, website, telegram_handle, profession, languages, member_type, is_agent, verification_level, current_status, working_on, wants_to_talk_about, hobbies, activity_interests, looking_for, move_in_date, planned_move_out_date, favorite_spots, created_at, professional_role, tour_guide_license_no",
    )
    .eq("id", id)
    .eq("is_visible", true)
    .maybeSingle();
  if (!data) return { data: null, error };
  return { data: data as MemberPublicProfile, error: null };
}

export async function getCurrentMember() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { data: null, error: null };

  const { data, error } = await supabase
    .from("members")
    .select("*")
    .eq("id", user.id)
    .single();

  return { data: data as Member | null, error };
}

// --- Blog ---

export async function getBlogPosts(options?: { limit?: number }) {
  const supabase = await createClient();
  let query = supabase
    .from("blog_posts")
    .select(
      "id, slug, title, excerpt, author_id, cover_image_url, tags, published_at",
    )
    .eq("is_published", true)
    .order("published_at", { ascending: false });

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;
  return { data: data as Partial<BlogPost>[] | null, error };
}

// --- Local Guides ---

export async function getLocalGuides(options?: {
  specialization?: string;
  neighborhood?: string;
  originCountry?: string;
  limit?: number;
}) {
  const supabase = await createClient();
  let query = (supabase.from("local_guides") as any)
    .select("*")
    .eq("is_visible", true)
    .order("created_at", { ascending: false });

  if (options?.specialization) {
    query = query.contains("specializations", [options.specialization]);
  }

  if (options?.neighborhood) {
    query = query.contains("neighborhoods", [options.neighborhood]);
  }

  if (options?.originCountry) {
    query = query.contains("origin_countries", [
      options.originCountry.toUpperCase(),
    ]);
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;
  return { data: data as LocalGuideRow[] | null, error };
}

export async function getGuidesByOriginCountry(code: string, limit = 6) {
  return getLocalGuides({ originCountry: code, limit });
}

// --- Blog ---

export async function getBlogPostBySlug(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*, author:members(id, display_name, avatar_url)")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  return { data: data as BlogPostWithAuthor | null, error };
}

// --- Surprise event waitlist ---

export interface WaitlistSummary {
  count: number;
  recent: { first_name: string; created_at: string }[];
}

export async function getWaitlistSummary(): Promise<{
  data: WaitlistSummary | null;
  error: { message: string } | null;
}> {
  const supabase = createPublicClient();

  const { count, error: countError } = await (
    supabase.from("surprise_event_waitlist") as any
  ).select("*", { count: "exact", head: true });

  if (countError) {
    return { data: null, error: countError };
  }

  const { data: rows, error: rowsError } = await (
    supabase.from("surprise_event_waitlist") as any
  )
    .select("first_name, created_at")
    .order("created_at", { ascending: false })
    .limit(10);

  if (rowsError) {
    return { data: null, error: rowsError };
  }

  return {
    data: {
      count: count ?? 0,
      recent: (rows ?? []) as { first_name: string; created_at: string }[],
    },
    error: null,
  };
}

// --- Paperwork services (Phase 2) ---

export type PaperworkServicePublic = {
  id: string;
  host_id: string;
  service_type: string;
  title: string;
  description: string | null;
  languages: string[];
  neighborhoods: string[];
  price_cents: number;
  currency: string;
  duration_estimate_minutes: number | null;
  host: {
    id: string;
    display_name: string;
    avatar_url: string | null;
    telegram_handle: string | null;
    member_type: string | null;
    verification_level: string | null;
  } | null;
};

export async function getPaperworkServicesPublic(filters?: {
  service_type?: string;
  host_id?: string;
}) {
  "use cache";
  cacheLife("minutes");
  cacheTag("paperwork_services");
  const supabase = createPublicClient();
  let q = (supabase as any)
    .from("paperwork_services")
    .select(
      "id, host_id, service_type, title, description, languages, neighborhoods, price_cents, currency, duration_estimate_minutes, host:members!paperwork_services_host_id_fkey (id, display_name, avatar_url, telegram_handle, member_type, verification_level)",
    )
    .eq("is_active", true)
    .order("created_at", { ascending: false });
  if (filters?.service_type) q = q.eq("service_type", filters.service_type);
  if (filters?.host_id) q = q.eq("host_id", filters.host_id);
  const { data, error } = await q;
  return {
    data: (data as PaperworkServicePublic[] | null) ?? [],
    error,
  };
}

export async function getPaperworkServiceById(id: string) {
  "use cache";
  cacheLife("minutes");
  cacheTag("paperwork_services");
  const supabase = createPublicClient();
  const { data, error } = await (supabase as any)
    .from("paperwork_services")
    .select(
      "id, host_id, service_type, title, description, languages, neighborhoods, price_cents, currency, duration_estimate_minutes, host:members!paperwork_services_host_id_fkey (id, display_name, avatar_url, telegram_handle, member_type, verification_level)",
    )
    .eq("id", id)
    .eq("is_active", true)
    .maybeSingle();
  return { data: data as PaperworkServicePublic | null, error };
}
