import { createClient, createPublicClient } from "./server";
import type {
  Event,
  EventWithRSVPCount,
  Member,
  MemberPublic,
  BlogPost,
  BlogPostWithAuthor,
  RSVP,
  RSVPWithMember,
} from "@/types/models";
import type { Database } from "@/types/database";

type LocalGuideRow = Database["public"]["Tables"]["local_guides"]["Row"];

// --- Events ---

// Public (cookie-less) events query. Safe for ISR/SSG pages where we don't
// want the route bailed out to dynamic rendering by `cookies()`.
export async function getEventsPublic(options?: {
  type?: string;
  past?: boolean;
  limit?: number;
}) {
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

// --- Members ---

export async function getMembers() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("members")
    .select(
      "id, display_name, bio, avatar_url, location, skills, website, telegram_handle",
    )
    .eq("is_visible", true)
    .order("created_at", { ascending: false });

  return { data: data as MemberPublic[] | null, error };
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
