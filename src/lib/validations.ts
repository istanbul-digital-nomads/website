import type {
  CreateEventBody,
  UpdateEventBody,
  CreateRSVPBody,
  UpdateMemberBody,
  ContactFormBody,
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
