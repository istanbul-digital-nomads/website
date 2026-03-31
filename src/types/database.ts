export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      members: {
        Row: {
          id: string;
          email: string;
          display_name: string;
          bio: string | null;
          avatar_url: string | null;
          location: string | null;
          skills: string[] | null;
          website: string | null;
          telegram_handle: string | null;
          is_visible: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          display_name: string;
          bio?: string | null;
          avatar_url?: string | null;
          location?: string | null;
          skills?: string[] | null;
          website?: string | null;
          telegram_handle?: string | null;
          is_visible?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          display_name?: string;
          bio?: string | null;
          avatar_url?: string | null;
          location?: string | null;
          skills?: string[] | null;
          website?: string | null;
          telegram_handle?: string | null;
          is_visible?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      events: {
        Row: {
          id: string;
          title: string;
          description: string;
          type: "meetup" | "coworking" | "workshop" | "social";
          date: string;
          end_date: string | null;
          location_name: string;
          location_address: string | null;
          location_url: string | null;
          capacity: number | null;
          organizer_id: string;
          image_url: string | null;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          type: "meetup" | "coworking" | "workshop" | "social";
          date: string;
          end_date?: string | null;
          location_name: string;
          location_address?: string | null;
          location_url?: string | null;
          capacity?: number | null;
          organizer_id: string;
          image_url?: string | null;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          type?: "meetup" | "coworking" | "workshop" | "social";
          date?: string;
          end_date?: string | null;
          location_name?: string;
          location_address?: string | null;
          location_url?: string | null;
          capacity?: number | null;
          organizer_id?: string;
          image_url?: string | null;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      rsvps: {
        Row: {
          id: string;
          event_id: string;
          member_id: string;
          status: "going" | "maybe" | "not_going";
          created_at: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          member_id: string;
          status: "going" | "maybe" | "not_going";
          created_at?: string;
        };
        Update: {
          id?: string;
          event_id?: string;
          member_id?: string;
          status?: "going" | "maybe" | "not_going";
          created_at?: string;
        };
      };
      blog_posts: {
        Row: {
          id: string;
          slug: string;
          title: string;
          excerpt: string;
          content: string;
          author_id: string;
          cover_image_url: string | null;
          tags: string[];
          is_published: boolean;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          excerpt: string;
          content: string;
          author_id: string;
          cover_image_url?: string | null;
          tags?: string[];
          is_published?: boolean;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          excerpt?: string;
          content?: string;
          author_id?: string;
          cover_image_url?: string | null;
          tags?: string[];
          is_published?: boolean;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      event_type: "meetup" | "coworking" | "workshop" | "social";
      rsvp_status: "going" | "maybe" | "not_going";
    };
  };
}
