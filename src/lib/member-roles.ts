// Single source of truth for the 4 member roles + the is_agent
// capability flag. Every onboarding step, profile view, /members
// filter, and admin tool reads from this module so adding a new role
// (or renaming one) doesn't drift across the codebase.
//
// Phase 2 (3.10.0): `agent` was demoted from a primary role to a
// capability flag (`members.is_agent`). Any role can ALSO offer
// paperwork services - an is_agent nomad is a perfectly valid combo.
//
// Schema-side enum + flag live in
// supabase/migrations/017_member_roles.sql +
// supabase/migrations/018_phase2_paperwork.sql. PRODUCT.md §3 is the
// strategy doc; this is its TS counterpart.

export const MEMBER_ROLES = [
  "nomad",
  "remote_worker",
  "local_guide",
  "tour_guide",
] as const;

export type MemberRole = (typeof MEMBER_ROLES)[number];

export function isMemberRole(value: unknown): value is MemberRole {
  return (
    typeof value === "string" &&
    (MEMBER_ROLES as readonly string[]).includes(value)
  );
}

// Roles that can host plans with a real entry fee (gated further by
// the verification ladder in Phase 3 - this only checks role, not
// badge). Nomads + remote workers post budget plans only.
export const HOST_ROLES: ReadonlyArray<MemberRole> = [
  "local_guide",
  "tour_guide",
];

export function isHostRole(role: MemberRole | null | undefined): boolean {
  return role != null && HOST_ROLES.includes(role);
}

// Tone-token per role for the small badge chip used on profile cards,
// /today plan rows, and /members. Maps to existing Tailwind tokens so
// dark/light mode stays consistent.
export const ROLE_TONE: Record<MemberRole, { bg: string; text: string }> = {
  nomad: { bg: "bg-ink-2/70", text: "text-paper-mute" },
  remote_worker: { bg: "bg-ferry-yellow/15", text: "text-ferry-yellow" },
  local_guide: { bg: "bg-terracotta/20", text: "text-terracotta" },
  tour_guide: { bg: "bg-terracotta/30", text: "text-terracotta" },
};

// Agent capability lives next to roles but is independent. Tone is
// distinct from any role tone so the secondary chip reads as "this
// is a different dimension."
export const AGENT_TONE = {
  bg: "bg-moss/15",
  text: "text-moss",
};
