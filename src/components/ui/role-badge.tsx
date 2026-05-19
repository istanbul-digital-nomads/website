import { isMemberRole, ROLE_TONE, type MemberRole } from "@/lib/member-roles";
import { cn } from "@/lib/utils";

// Small inline chip used wherever a member's operational role surfaces:
// /members cards, /members/[id] header, /today plan rows, plan-detail
// host strip. Caller passes the already-translated label so this stays a
// pure presentational leaf - works in both regular RSC and `"use cache"`
// scopes without bringing next-intl into the cache boundary.
//
// Falls back to null for unknown / missing role values so legacy rows
// don't crash.

interface Props {
  role: string | null | undefined;
  label: string;
  size?: "sm" | "md";
  className?: string;
}

export function RoleBadge({ role, label, size = "sm", className }: Props) {
  if (!isMemberRole(role)) return null;
  const tone = ROLE_TONE[role as MemberRole];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-mono uppercase tracking-wider",
        size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-[11px]",
        tone.bg,
        tone.text,
        className,
      )}
    >
      {label}
    </span>
  );
}
