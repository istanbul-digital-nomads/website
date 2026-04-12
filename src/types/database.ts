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
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      event_type: "meetup" | "coworking" | "workshop" | "social";
      rsvp_status: "going" | "maybe" | "not_going";
    };
  };
}
