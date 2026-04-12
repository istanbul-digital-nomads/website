import type {
  CreateEventBody,
  UpdateEventBody,
  CreateRSVPBody,
  UpdateMemberBody,
  ContactFormBody,
  GuideApplicationBody,
} from "@/types/api";

type Result<T> = { data: T; error?: never } | { data?: never; error: string };

const EVENT_TYPES = ["meetup", "coworking", "workshop", "social"] as const;
const RSVP_STATUSES = ["going", "maybe", "not_going"] as const;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isString(v: unknown): v is string {
  return typeof v === "string" && v.length > 0;
}

export function validateCreateEvent(body: unknown): Result<CreateEventBody> {
  if (!body || typeof body !== "object")
    return { error: "Invalid request body" };
  const b = body as Record<string, unknown>;

  if (!isString(b.title)) return { error: "title is required" };
  if (!isString(b.description)) return { error: "description is required" };
  if (
    !isString(b.type) ||
    !(EVENT_TYPES as readonly string[]).includes(b.type as string)
  )
    return {
      error: "type must be one of: meetup, coworking, workshop, social",
    };
  if (!isString(b.date)) return { error: "date is required" };
  if (!isString(b.location_name)) return { error: "location_name is required" };

  return {
    data: {
      title: b.title as string,
      description: b.description as string,
      type: b.type as CreateEventBody["type"],
      date: b.date as string,
      end_date: (b.end_date as string) ?? null,
      location_name: b.location_name as string,
      location_address: (b.location_address as string) ?? null,
      location_url: (b.location_url as string) ?? null,
      capacity: typeof b.capacity === "number" ? b.capacity : null,
      image_url: (b.image_url as string) ?? null,
    },
  };
}

export function validateUpdateEvent(body: unknown): Result<UpdateEventBody> {
  if (!body || typeof body !== "object")
    return { error: "Invalid request body" };
  const b = body as Record<string, unknown>;

  if (
    b.type !== undefined &&
    (!isString(b.type) ||
      !(EVENT_TYPES as readonly string[]).includes(b.type as string))
  )
    return {
      error: "type must be one of: meetup, coworking, workshop, social",
    };

  const data: UpdateEventBody = {};
  if (b.title !== undefined) data.title = b.title as string;
  if (b.description !== undefined) data.description = b.description as string;
  if (b.type !== undefined) data.type = b.type as UpdateEventBody["type"];
  if (b.date !== undefined) data.date = b.date as string;
  if (b.end_date !== undefined) data.end_date = (b.end_date as string) ?? null;
  if (b.location_name !== undefined)
    data.location_name = b.location_name as string;
  if (b.location_address !== undefined)
    data.location_address = (b.location_address as string) ?? null;
  if (b.location_url !== undefined)
    data.location_url = (b.location_url as string) ?? null;
  if (b.capacity !== undefined)
    data.capacity = typeof b.capacity === "number" ? b.capacity : null;
  if (b.image_url !== undefined)
    data.image_url = (b.image_url as string) ?? null;
  if (b.is_published !== undefined) data.is_published = b.is_published === true;

  if (Object.keys(data).length === 0)
    return { error: "No valid fields to update" };

  return { data };
}

export function validateCreateRSVP(body: unknown): Result<CreateRSVPBody> {
  if (!body || typeof body !== "object")
    return { error: "Invalid request body" };
  const b = body as Record<string, unknown>;

  if (!isString(b.event_id)) return { error: "event_id is required" };
  if (
    !isString(b.status) ||
    !(RSVP_STATUSES as readonly string[]).includes(b.status as string)
  )
    return { error: "status must be one of: going, maybe, not_going" };

  return {
    data: {
      event_id: b.event_id as string,
      status: b.status as CreateRSVPBody["status"],
    },
  };
}

export function validateUpdateMember(body: unknown): Result<UpdateMemberBody> {
  if (!body || typeof body !== "object")
    return { error: "Invalid request body" };
  const b = body as Record<string, unknown>;

  const ALLOWED = [
    "display_name",
    "bio",
    "avatar_url",
    "location",
    "skills",
    "website",
    "telegram_handle",
    "is_visible",
    // Onboarding fields
    "age_range",
    "birthday",
    "gender",
    "nationality",
    "city_district",
    "phone_whatsapp",
    "profession",
    "heard_from",
    "attended_events_before",
    "attended_which_events",
    "languages",
    "member_type",
    "activity_interests",
    "event_frequency",
    "looking_for",
    "agrees_community_values",
    "agrees_no_unsolicited_dms",
    "agrees_kindness",
    "agrees_mixed_environments",
    "why_join",
    "social_profile",
    "friends_in_community",
    "photo_verification_url",
    "confirms_rules",
    "confirms_positive_behavior",
    "confirms_admin_removal",
    "confirms_not_dating_app",
    "atmosphere_preferences",
    "contribution_preferences",
    "disagreement_handling",
    "real_name_on_whatsapp",
    "understands_rsvp_policy",
    "agrees_payment_policy",
    "agrees_no_misuse",
    "onboarding_completed",
    "onboarding_completed_at",
  ];

  const data: UpdateMemberBody = {};
  for (const key of ALLOWED) {
    if (key in b) {
      (data as Record<string, unknown>)[key] = b[key];
    }
  }

  if (Object.keys(data).length === 0)
    return { error: "No valid fields to update" };

  return { data };
}

export function validateContactForm(body: unknown): Result<ContactFormBody> {
  if (!body || typeof body !== "object")
    return { error: "Invalid request body" };
  const b = body as Record<string, unknown>;

  if (!isString(b.name)) return { error: "name is required" };
  if (!isString(b.email) || !EMAIL_REGEX.test(b.email as string))
    return { error: "Valid email is required" };
  if (!isString(b.message) || (b.message as string).length < 10)
    return { error: "message must be at least 10 characters" };

  return {
    data: {
      name: b.name as string,
      email: b.email as string,
      message: b.message as string,
    },
  };
}

export function validateGuideApplication(
  body: unknown,
): Result<GuideApplicationBody> {
  if (!body || typeof body !== "object")
    return { error: "Invalid request body" };
  const b = body as Record<string, unknown>;

  if (!isString(b.name)) return { error: "Your name is required" };
  if (!isString(b.email) || !EMAIL_REGEX.test(b.email as string))
    return { error: "A valid email is required" };
  if (!Array.isArray(b.languages) || b.languages.length === 0)
    return { error: "Select at least one language" };
  if (!Array.isArray(b.specializations) || b.specializations.length === 0)
    return { error: "Select at least one area of expertise" };
  if (!Array.isArray(b.neighborhoods) || b.neighborhoods.length === 0)
    return { error: "Select at least one neighborhood" };
  if (typeof b.years_in_istanbul !== "number" || b.years_in_istanbul < 0)
    return { error: "Years in Istanbul is required" };
  if (!isString(b.bio) || (b.bio as string).length < 50)
    return { error: "Bio must be at least 50 characters" };
  if (!isString(b.sample_tip) || (b.sample_tip as string).length < 20)
    return { error: "Your local tip must be at least 20 characters" };
  if (!isString(b.motivation) || (b.motivation as string).length < 20)
    return { error: "Motivation must be at least 20 characters" };
  if (b.agrees_guidelines !== true)
    return { error: "You must agree to the community guidelines" };

  return {
    data: {
      name: b.name as string,
      email: b.email as string,
      phone_whatsapp: (b.phone_whatsapp as string) || undefined,
      languages: b.languages as string[],
      specializations: b.specializations as string[],
      neighborhoods: b.neighborhoods as string[],
      years_in_istanbul: b.years_in_istanbul as number,
      bio: b.bio as string,
      sample_tip: b.sample_tip as string,
      motivation: b.motivation as string,
      social_instagram: (b.social_instagram as string) || undefined,
      social_linkedin: (b.social_linkedin as string) || undefined,
      social_twitter: (b.social_twitter as string) || undefined,
      social_website: (b.social_website as string) || undefined,
      photo_url: (b.photo_url as string) || undefined,
      agrees_guidelines: true,
      references_text: (b.references_text as string) || undefined,
    },
  };
}
