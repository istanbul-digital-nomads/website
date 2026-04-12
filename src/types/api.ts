import type { EventType, RSVPStatus } from "./models";

// --- Response Envelope ---

export interface ApiResponse<T> {
  data: T;
}

export interface ApiError {
  error: string;
}

// --- Event Request Bodies ---

export interface CreateEventBody {
  title: string;
  description: string;
  type: EventType;
  date: string;
  end_date?: string | null;
  location_name: string;
  location_address?: string | null;
  location_url?: string | null;
  capacity?: number | null;
  image_url?: string | null;
}

export interface UpdateEventBody {
  title?: string;
  description?: string;
  type?: EventType;
  date?: string;
  end_date?: string | null;
  location_name?: string;
  location_address?: string | null;
  location_url?: string | null;
  capacity?: number | null;
  image_url?: string | null;
  is_published?: boolean;
}

// --- RSVP Request Bodies ---

export interface CreateRSVPBody {
  event_id: string;
  status: RSVPStatus;
}

// --- Member Request Bodies ---

export interface UpdateMemberBody {
  display_name?: string;
  bio?: string | null;
  avatar_url?: string | null;
  location?: string | null;
  skills?: string[] | null;
  website?: string | null;
  telegram_handle?: string | null;
  is_visible?: boolean;
}

// --- Contact Form ---

export interface ContactFormBody {
  name: string;
  email: string;
  message: string;
}

// --- Guide Application ---

export interface GuideApplicationBody {
  name: string;
  email: string;
  phone_whatsapp?: string;
  languages: string[];
  specializations: string[];
  neighborhoods: string[];
  years_in_istanbul: number;
  bio: string;
  sample_tip: string;
  motivation: string;
  social_instagram?: string;
  social_linkedin?: string;
  social_twitter?: string;
  social_website?: string;
  photo_url?: string;
  agrees_guidelines: boolean;
  references_text?: string;
}
