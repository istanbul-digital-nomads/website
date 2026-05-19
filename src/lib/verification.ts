// Three-tier verification ladder (PRODUCT.md §3 + docs/product-plan.md
// Phase 3). Red (basic) is the default for every member; Blue
// (verified) and Gold (trusted) are issued via the
// verification_requests table.
//
// Phase 3 v1 ships the schema + manual approval flow (via Supabase
// dashboard); a real KYC vendor SDK (Sumsub / Persona / Onfido) plugs
// into kyc_provider / kyc_session_id columns in a follow-up.

import type { MemberRole } from "./member-roles";
import { HOST_ROLES } from "./member-roles";

export const VERIFICATION_LEVELS = ["basic", "verified", "trusted"] as const;
export type VerificationLevel = (typeof VERIFICATION_LEVELS)[number];

export function isVerificationLevel(v: unknown): v is VerificationLevel {
  return (
    typeof v === "string" &&
    (VERIFICATION_LEVELS as readonly string[]).includes(v)
  );
}

// Display tone per badge - subtle dot for Red, blue check for Blue,
// gold star for Gold. Mapped to existing Tailwind tokens so dark/light
// stay consistent.
export const VERIFICATION_TONE: Record<
  VerificationLevel,
  { bg: string; text: string; ring: string; symbol: string }
> = {
  basic: {
    bg: "bg-ink-2/70",
    text: "text-paper-mute",
    ring: "ring-1 ring-ink-3",
    symbol: "●",
  },
  verified: {
    bg: "bg-sky-500/15",
    text: "text-sky-400",
    ring: "ring-1 ring-sky-500/40",
    symbol: "✓",
  },
  trusted: {
    bg: "bg-gold/20",
    text: "text-gold",
    ring: "ring-1 ring-gold/50",
    symbol: "★",
  },
};

// Can this member's plans set a real entry fee? Gate combines:
//   1. role IS a host role (local_guide, tour_guide), OR is_agent flag
//   2. verification_level is verified or trusted (NOT basic)
//
// Phase 3 enforces (2) for the first time. Phase 4 will layer on
// subscription-quota checks for plan volume.
export function canChargeEntryFees(input: {
  role: MemberRole | null;
  is_agent?: boolean;
  verification_level: VerificationLevel;
}): boolean {
  const roleOk =
    (input.role != null && HOST_ROLES.includes(input.role)) ||
    input.is_agent === true;
  const verified =
    input.verification_level === "verified" ||
    input.verification_level === "trusted";
  return roleOk && verified;
}

// True iff a verification request currently exists for this member
// that hasn't been approved/rejected yet. Used by the verify page to
// show "Request pending review" instead of a fresh form.
export type VerificationRequestStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "cancelled";

export function isPendingStatus(s: unknown): s is "pending" {
  return s === "pending";
}
