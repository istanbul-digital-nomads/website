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
          member_type:
            | "nomad"
            | "remote_worker"
            | "local_guide"
            | "tour_guide"
            | null;
          is_agent: boolean;
          professional_role: string | null;
          tour_guide_license_no: string | null;
          arrival_status: string | null;
          xp: number;
          verification_level: "basic" | "verified" | "trusted";
          verified_at: string | null;
          verified_by: string | null;
          current_status:
            | "deep_work"
            | "open_to_meet"
            | "exploring"
            | "settling_in"
            | "hosting"
            | "hibernating"
            | null;
          working_on: string[] | null;
          wants_to_talk_about: string[] | null;
          hobbies: string[] | null;
          move_in_date: string | null;
          planned_move_out_date: string | null;
          favorite_spots: string[] | null;
          payout_iban: string | null;
          payout_name: string | null;
          iyzico_submerchant_key: string | null;
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
          notify_telegram: boolean;
          notify_plan_activity: boolean;
          notify_comments: boolean;
          notify_tickets: boolean;
          notify_events: boolean;
          notify_reminders: boolean;
          preferred_locale: string;
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
          // Added in migration 012_event_ticketing.sql. Nullable so existing
          // rows and the free-RSVP flow are unaffected.
          slug: string | null;
          price_try: number | null;
          price_usd: number | null;
          kind: string | null;
          waitlist_count: number;
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
      plans: {
        Row: {
          id: string;
          creator_id: string;
          scheduled_date: string;
          title: string;
          capacity: number | null;
          status: "active" | "cancelled" | "expired";
          reminder_sent_at: string | null;
          expires_at: string;
          language: string | null;
          // Phase 2 - plans v2 money fields.
          is_ticketed: boolean;
          entry_fee_cents: number | null;
          budget_per_person_min_cents: number | null;
          budget_per_person_max_cents: number | null;
          currency: "TRY" | null;
          host_role_at_creation:
            | "nomad"
            | "remote_worker"
            | "local_guide"
            | "tour_guide"
            | null;
          host_badge_at_creation: "basic" | "verified" | "trusted" | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          creator_id: string;
          scheduled_date: string;
          title: string;
          capacity?: number | null;
          status?: "active" | "cancelled" | "expired";
          reminder_sent_at?: string | null;
          expires_at: string;
          language?: string | null;
          is_ticketed?: boolean;
          entry_fee_cents?: number | null;
          budget_per_person_min_cents?: number | null;
          budget_per_person_max_cents?: number | null;
          currency?: "TRY" | null;
          host_role_at_creation?: string | null;
          host_badge_at_creation?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          [key: string]: unknown;
        };
      };
      paperwork_services: {
        Row: {
          id: string;
          host_id: string;
          service_type:
            | "visa"
            | "ikamet"
            | "residency_permit"
            | "bank_account"
            | "notary"
            | "gbt"
            | "tax_office"
            | "other";
          title: string;
          description: string | null;
          languages: string[];
          neighborhoods: string[];
          price_cents: number;
          currency: "TRY";
          duration_estimate_minutes: number | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          host_id: string;
          service_type: string;
          title: string;
          description?: string | null;
          languages?: string[];
          neighborhoods?: string[];
          price_cents: number;
          currency?: "TRY";
          duration_estimate_minutes?: number | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          [key: string]: unknown;
        };
      };
      plan_stops: {
        Row: {
          id: string;
          plan_id: string;
          ordinal: number;
          space_id: string | null;
          custom_location: string | null;
          neighborhood_slug: string | null;
          lat: number | null;
          lng: number | null;
          start_time: string | null;
          end_time: string | null;
          vibe:
            | "focus"
            | "cowork"
            | "social"
            | "meal"
            | "after-work"
            | "outdoor"
            | "culture";
          notes: string | null;
          // How the host gets to THIS stop from the previous one.
          // Null on ordinal=1 (no previous stop).
          transport_mode:
            | "ferry"
            | "metro"
            | "bus"
            | "taxi"
            | "shared_uber"
            | "walk"
            | "bike"
            | "tram"
            | "minibus"
            | null;
          transport_price_min: number | null;
          transport_price_max: number | null;
          cost_min_cents: number | null;
          cost_max_cents: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          plan_id: string;
          ordinal: number;
          space_id?: string | null;
          custom_location?: string | null;
          neighborhood_slug?: string | null;
          lat?: number | null;
          lng?: number | null;
          start_time?: string | null;
          end_time?: string | null;
          vibe:
            | "focus"
            | "cowork"
            | "social"
            | "meal"
            | "after-work"
            | "outdoor"
            | "culture";
          notes?: string | null;
          transport_mode?:
            | "ferry"
            | "metro"
            | "bus"
            | "taxi"
            | "shared_uber"
            | "walk"
            | "bike"
            | "tram"
            | "minibus"
            | null;
          transport_price_min?: number | null;
          transport_price_max?: number | null;
          cost_min_cents?: number | null;
          cost_max_cents?: number | null;
          created_at?: string;
        };
        Update: {
          [key: string]: unknown;
        };
      };
      plan_attendees: {
        Row: {
          plan_id: string;
          member_id: string;
          status: "going" | "left";
          joined_at: string;
        };
        Insert: {
          plan_id: string;
          member_id: string;
          status?: "going" | "left";
          joined_at?: string;
        };
        Update: {
          status?: "going" | "left";
        };
      };
      plan_comments: {
        Row: {
          id: string;
          plan_id: string;
          author_id: string;
          body: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          plan_id: string;
          author_id: string;
          body: string;
          created_at?: string;
        };
        Update: {
          body?: string;
        };
      };
      telegram_subscriptions: {
        Row: {
          member_id: string;
          telegram_chat_id: number;
          linked_at: string;
        };
        Insert: {
          member_id: string;
          telegram_chat_id: number;
          linked_at?: string;
        };
        Update: {
          telegram_chat_id?: number;
        };
      };
      short_links: {
        Row: {
          code: string;
          kind: string;
          entity_id: string;
          target_path: string;
          created_by: string | null;
          click_count: number;
          created_at: string;
        };
        Insert: {
          code: string;
          kind: string;
          entity_id: string;
          target_path: string;
          created_by?: string | null;
          click_count?: number;
          created_at?: string;
        };
        Update: {
          click_count?: number;
        };
      };
      nomad_brands: {
        Row: {
          id: string;
          name: string;
          slug: string;
          icon: string | null;
          category: string | null;
          color: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          icon?: string | null;
          category?: string | null;
          color?: string | null;
          created_at?: string;
        };
        Update: {
          name?: string;
          slug?: string;
          icon?: string | null;
          category?: string | null;
          color?: string | null;
        };
      };
      brand_locations: {
        Row: {
          id: string;
          brand_id: string | null;
          name: string | null;
          lat: number | null;
          lng: number | null;
          district: string | null;
          neighborhood_slug: string | null;
          address: string | null;
          opening_hours: string | null;
          rating: number | null;
          reviews_count: number | null;
          wifi_score: number | null;
          atmosphere_score: number | null;
          laptop_friendliness: number | null;
          power_outlet_score: number | null;
          images: Json;
          sources: Json;
          unverified_fields: string[];
          last_verified: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          brand_id?: string | null;
          name?: string | null;
          lat?: number | null;
          lng?: number | null;
          district?: string | null;
          neighborhood_slug?: string | null;
          address?: string | null;
          opening_hours?: string | null;
          rating?: number | null;
          reviews_count?: number | null;
          wifi_score?: number | null;
          atmosphere_score?: number | null;
          laptop_friendliness?: number | null;
          power_outlet_score?: number | null;
          images?: Json;
          sources?: Json;
          unverified_fields?: string[];
          last_verified?: string | null;
          created_at?: string;
        };
        Update: {
          name?: string | null;
          lat?: number | null;
          lng?: number | null;
          district?: string | null;
          neighborhood_slug?: string | null;
          address?: string | null;
          opening_hours?: string | null;
          rating?: number | null;
          reviews_count?: number | null;
          wifi_score?: number | null;
          atmosphere_score?: number | null;
          laptop_friendliness?: number | null;
          power_outlet_score?: number | null;
          images?: Json;
          sources?: Json;
          unverified_fields?: string[];
          last_verified?: string | null;
        };
      };
      // Migration 030 - district/neighborhood intelligence layer.
      // Public reference content (RLS public-read, no client writes), so
      // only Row is meaningfully consumed; reads degrade to the static seed
      // in src/lib/districts.ts when the tables aren't applied.
      istanbul_districts: {
        Row: {
          id: string;
          name: string;
          side: string | null;
          slug: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          side?: string | null;
          slug?: string | null;
          created_at?: string;
        };
        Update: {
          name?: string;
          side?: string | null;
          slug?: string | null;
        };
      };
      istanbul_neighborhoods: {
        Row: {
          id: string;
          district_id: string | null;
          slug: string | null;
          name: string;
          description: string | null;
          tags: string[];
          atmosphere: string | null;
          nomad_score: number | null;
          nightlife_score: number | null;
          cost_level: number | null;
          walkability: number | null;
          safety: number | null;
          transportation: string | null;
          sources: Json;
          unverified_fields: string[];
          last_verified: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          district_id?: string | null;
          slug?: string | null;
          name: string;
          description?: string | null;
          tags?: string[];
          atmosphere?: string | null;
          nomad_score?: number | null;
          nightlife_score?: number | null;
          cost_level?: number | null;
          walkability?: number | null;
          safety?: number | null;
          transportation?: string | null;
          sources?: Json;
          unverified_fields?: string[];
          last_verified?: string | null;
          created_at?: string;
        };
        Update: {
          district_id?: string | null;
          slug?: string | null;
          name?: string;
          description?: string | null;
          tags?: string[];
          atmosphere?: string | null;
          nomad_score?: number | null;
          nightlife_score?: number | null;
          cost_level?: number | null;
          walkability?: number | null;
          safety?: number | null;
          transportation?: string | null;
          sources?: Json;
          unverified_fields?: string[];
          last_verified?: string | null;
        };
      };
    };
    Views: {
      plans_today_count: {
        Row: { count: number };
      };
      plans_today_by_neighborhood: {
        Row: { neighborhood_slug: string; count: number };
      };
    };
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
      plan_vibe:
        | "focus"
        | "cowork"
        | "social"
        | "meal"
        | "after-work"
        | "outdoor";
      plan_status: "active" | "cancelled" | "expired";
    };
  };
}
