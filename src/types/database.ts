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
          age_range: string | null;
          birthday: string | null;
          gender: string | null;
          nationality: string | null;
          city_district: string | null;
          phone_whatsapp: string | null;
          profession: string | null;
          heard_from: string | null;
          attended_events_before: boolean | null;
          attended_which_events: string | null;
          languages: string[] | null;
          member_type: string | null;
          activity_interests: string[] | null;
          event_frequency: string | null;
          looking_for: string[] | null;
          agrees_community_values: boolean;
          agrees_no_unsolicited_dms: boolean;
          agrees_kindness: boolean;
          agrees_mixed_environments: boolean;
          why_join: string | null;
          social_profile: string | null;
          friends_in_community: string | null;
          photo_verification_url: string | null;
          confirms_rules: boolean;
          confirms_positive_behavior: boolean;
          confirms_admin_removal: boolean;
          confirms_not_dating_app: boolean;
          atmosphere_preferences: string[] | null;
          contribution_preferences: string[] | null;
          disagreement_handling: string[] | null;
          real_name_on_whatsapp: boolean | null;
          understands_rsvp_policy: boolean | null;
          agrees_payment_policy: boolean | null;
          agrees_no_misuse: string[] | null;
          onboarding_completed: boolean;
          onboarding_completed_at: string | null;
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
          [key: string]: unknown;
        };
        Update: {
          [key: string]: unknown;
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
      newsletter_subscribers: {
        Row: {
          id: string;
          email: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          created_at?: string;
        };
      };
      local_guides: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone_whatsapp: string | null;
          photo_url: string | null;
          role_title: string | null;
          bio: string;
          specializations: string[];
          neighborhoods: string[];
          languages: string[];
          years_in_istanbul: number;
          social_instagram: string | null;
          social_linkedin: string | null;
          social_twitter: string | null;
          social_website: string | null;
          is_visible: boolean;
          origin_countries: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          phone_whatsapp?: string | null;
          photo_url?: string | null;
          role_title?: string | null;
          bio: string;
          specializations?: string[];
          neighborhoods?: string[];
          languages?: string[];
          years_in_istanbul: number;
          social_instagram?: string | null;
          social_linkedin?: string | null;
          social_twitter?: string | null;
          social_website?: string | null;
          is_visible?: boolean;
          origin_countries?: string[];
        };
        Update: {
          [key: string]: unknown;
        };
      };
      guide_applications: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone_whatsapp: string | null;
          photo_url: string | null;
          languages: string[];
          specializations: string[];
          neighborhoods: string[];
          years_in_istanbul: number;
          bio: string;
          sample_tip: string;
          motivation: string;
          social_instagram: string | null;
          social_linkedin: string | null;
          social_twitter: string | null;
          social_website: string | null;
          agrees_guidelines: boolean;
          references_text: string | null;
          origin_countries: string[];
          status: string;
          reviewed_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          phone_whatsapp?: string | null;
          photo_url?: string | null;
          languages: string[];
          specializations: string[];
          neighborhoods: string[];
          years_in_istanbul: number;
          bio: string;
          sample_tip: string;
          motivation: string;
          social_instagram?: string | null;
          social_linkedin?: string | null;
          social_twitter?: string | null;
          social_website?: string | null;
          agrees_guidelines: boolean;
          references_text?: string | null;
          origin_countries?: string[];
        };
        Update: {
          [key: string]: unknown;
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
      corpus_chunks: {
        Row: {
          id: string;
          source_type:
            | "guide"
            | "blog"
            | "path"
            | "neighborhood"
            | "space"
            | "cost-tier"
            | "setup-step";
          source_slug: string;
          section_heading: string | null;
          chunk_index: number;
          content: string;
          metadata: Json;
          embedding: number[] | null;
          token_count: number | null;
          last_ingested_at: string;
        };
        Insert: {
          id?: string;
          source_type:
            | "guide"
            | "blog"
            | "path"
            | "neighborhood"
            | "space"
            | "cost-tier"
            | "setup-step";
          source_slug: string;
          section_heading?: string | null;
          chunk_index: number;
          content: string;
          metadata?: Json;
          embedding?: number[] | null;
          token_count?: number | null;
          last_ingested_at?: string;
        };
        Update: {
          id?: string;
          source_type?:
            | "guide"
            | "blog"
            | "path"
            | "neighborhood"
            | "space"
            | "cost-tier"
            | "setup-step";
          source_slug?: string;
          section_heading?: string | null;
          chunk_index?: number;
          content?: string;
          metadata?: Json;
          embedding?: number[] | null;
          token_count?: number | null;
          last_ingested_at?: string;
        };
      };
      relocation_plans: {
        Row: {
          id: string;
          member_id: string | null;
          intake: Json;
          plan: Json;
          plan_text: string;
          model: string;
          retrieved_chunk_count: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          member_id?: string | null;
          intake: Json;
          plan: Json;
          plan_text: string;
          model: string;
          retrieved_chunk_count: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          member_id?: string | null;
          intake?: Json;
          plan?: Json;
          plan_text?: string;
          model?: string;
          retrieved_chunk_count?: number;
          created_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: {
      match_corpus_chunks: {
        Args: {
          query_embedding: number[];
          match_count?: number;
          source_filter?: string[] | null;
        };
        Returns: Array<{
          id: string;
          source_type: string;
          source_slug: string;
          section_heading: string | null;
          content: string;
          metadata: Json;
          similarity: number;
        }>;
      };
    };
    Enums: {
      event_type: "meetup" | "coworking" | "workshop" | "social";
      rsvp_status: "going" | "maybe" | "not_going";
    };
  };
}
