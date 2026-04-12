import { describe, it, expect } from "vitest";
import {
  validateCreateEvent,
  validateUpdateEvent,
  validateCreateRSVP,
  validateUpdateMember,
  validateContactForm,
} from "@/lib/validations";

describe("validateCreateEvent", () => {
  it("accepts valid event data", () => {
    const result = validateCreateEvent({
      title: "Weekly Coworking",
      description: "Bring your laptop and work alongside others.",
      type: "coworking",
      date: "2026-04-10T10:00:00Z",
      location_name: "MOB Kadikoy",
    });
    expect(result.error).toBeUndefined();
    expect(result.data?.title).toBe("Weekly Coworking");
    expect(result.data?.type).toBe("coworking");
  });

  it("rejects missing title", () => {
    const result = validateCreateEvent({
      description: "Test",
      type: "meetup",
      date: "2026-04-10T10:00:00Z",
      location_name: "Galata",
    });
    expect(result.error).toBe("title is required");
  });

  it("rejects invalid event type", () => {
    const result = validateCreateEvent({
      title: "Test",
      description: "Test",
      type: "party",
      date: "2026-04-10T10:00:00Z",
      location_name: "Galata",
    });
    expect(result.error).toContain("type must be one of");
  });

  it("rejects empty body", () => {
    expect(validateCreateEvent(null).error).toBe("Invalid request body");
    expect(validateCreateEvent(undefined).error).toBe("Invalid request body");
    expect(validateCreateEvent("string").error).toBe("Invalid request body");
  });

  it("sets optional fields to null when missing", () => {
    const result = validateCreateEvent({
      title: "Test",
      description: "Test",
      type: "meetup",
      date: "2026-04-10T10:00:00Z",
      location_name: "Galata",
    });
    expect(result.data?.end_date).toBeNull();
    expect(result.data?.capacity).toBeNull();
    expect(result.data?.image_url).toBeNull();
  });
});

describe("validateUpdateEvent", () => {
  it("accepts partial updates", () => {
    const result = validateUpdateEvent({ title: "New Title" });
    expect(result.error).toBeUndefined();
    expect(result.data?.title).toBe("New Title");
  });

  it("rejects empty updates", () => {
    expect(validateUpdateEvent({}).error).toBe("No valid fields to update");
  });

  it("rejects invalid type", () => {
    const result = validateUpdateEvent({ type: "invalid" });
    expect(result.error).toContain("type must be one of");
  });
});

describe("validateCreateRSVP", () => {
  it("accepts valid RSVP", () => {
    const result = validateCreateRSVP({
      event_id: "abc-123",
      status: "going",
    });
    expect(result.error).toBeUndefined();
    expect(result.data?.status).toBe("going");
  });

  it("accepts all valid statuses", () => {
    expect(
      validateCreateRSVP({ event_id: "1", status: "going" }).error,
    ).toBeUndefined();
    expect(
      validateCreateRSVP({ event_id: "1", status: "maybe" }).error,
    ).toBeUndefined();
    expect(
      validateCreateRSVP({ event_id: "1", status: "not_going" }).error,
    ).toBeUndefined();
  });

  it("rejects invalid status", () => {
    const result = validateCreateRSVP({ event_id: "1", status: "attending" });
    expect(result.error).toContain("status must be one of");
  });

  it("rejects missing event_id", () => {
    const result = validateCreateRSVP({ status: "going" });
    expect(result.error).toBe("event_id is required");
  });
});

describe("validateUpdateMember", () => {
  it("accepts valid profile update", () => {
    const result = validateUpdateMember({
      display_name: "Ali",
      bio: "Remote worker in Istanbul",
      location: "Kadikoy",
    });
    expect(result.error).toBeUndefined();
    expect(result.data?.display_name).toBe("Ali");
  });

  it("filters out disallowed fields", () => {
    const result = validateUpdateMember({
      display_name: "Ali",
      email: "hacker@evil.com",
      id: "fake-id",
    });
    expect(result.data?.display_name).toBe("Ali");
    expect((result.data as any)?.email).toBeUndefined();
    expect((result.data as any)?.id).toBeUndefined();
  });

  it("rejects empty updates", () => {
    expect(validateUpdateMember({}).error).toBe("No valid fields to update");
  });
});

describe("validateContactForm", () => {
  it("accepts valid contact form", () => {
    const result = validateContactForm({
      name: "Ali",
      email: "ali@example.com",
      message: "I have a question about coworking spaces.",
    });
    expect(result.error).toBeUndefined();
    expect(result.data?.email).toBe("ali@example.com");
  });

  it("rejects invalid email", () => {
    const result = validateContactForm({
      name: "Ali",
      email: "not-an-email",
      message: "This is a test message.",
    });
    expect(result.error).toContain("email");
  });

  it("rejects short message", () => {
    const result = validateContactForm({
      name: "Ali",
      email: "ali@example.com",
      message: "Hi",
    });
    expect(result.error).toContain("10 characters");
  });

  it("rejects missing fields", () => {
    expect(validateContactForm({}).error).toBe("name is required");
    expect(validateContactForm({ name: "Ali" }).error).toContain("email");
  });
});
