import type { Database } from "./database";

// --- Core Models (Row types - what you read from the DB) ---

export type Event = Database["public"]["Tables"]["events"]["Row"];
export type Member = Database["public"]["Tables"]["members"]["Row"];
export type BlogPost = Database["public"]["Tables"]["blog_posts"]["Row"];
export type RSVP = Database["public"]["Tables"]["rsvps"]["Row"];

// --- Insert Types (what you send to create a record) ---

export type EventInsert = Database["public"]["Tables"]["events"]["Insert"];
export type MemberInsert = Database["public"]["Tables"]["members"]["Insert"];
export type BlogPostInsert =
  Database["public"]["Tables"]["blog_posts"]["Insert"];
export type RSVPInsert = Database["public"]["Tables"]["rsvps"]["Insert"];

// --- Update Types (what you send to patch a record) ---

export type EventUpdate = Database["public"]["Tables"]["events"]["Update"];
export type MemberUpdate = Database["public"]["Tables"]["members"]["Update"];
export type BlogPostUpdate =
  Database["public"]["Tables"]["blog_posts"]["Update"];

// --- Enum Types ---

export type EventType = Database["public"]["Enums"]["event_type"];
export type RSVPStatus = Database["public"]["Enums"]["rsvp_status"];

// --- Augmented Types (models with joined/computed data) ---

export type EventWithRSVPCount = Event & { rsvp_count: number };

export type RSVPWithMember = RSVP & {
  member: Pick<Member, "id" | "display_name" | "avatar_url">;
};

export type BlogPostWithAuthor = BlogPost & {
  author: Pick<Member, "id" | "display_name" | "avatar_url">;
};

// --- Public Types (safe to expose to clients) ---

export type MemberPublic = Pick<
  Member,
  | "id"
  | "display_name"
  | "bio"
  | "avatar_url"
  | "location"
  | "skills"
  | "website"
  | "telegram_handle"
>;

// --- Static Content Types ---

export type { Guide } from "@/lib/data";
