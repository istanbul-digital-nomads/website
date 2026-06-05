// Phase 5: XP - a light engagement counter, derived on read.
//
// We don't keep a stored XP ledger (members.xp exists in the schema but
// stays at its 0 default for now). Until there's an attendance-confirmation
// flow and a balance pass, an incrementing column would just drift from the
// real activity. So XP is computed from the same plan counts that drive
// badges - one source of truth, nothing to farm, nothing to backfill.
//
// Values are deliberately round and easy to reason about. Hosting a plan is
// worth more than joining one because it's the action the community needs.

export const XP_PER_PLAN_HOSTED = 20;
export const XP_PER_PLAN_JOINED = 10;

export interface XpInput {
  // Every plan the member created (past + upcoming). Creating a plan earns
  // XP at creation, like the roadmap says - not on RSVP.
  hostedCount: number;
  // Past plans the member joined but didn't host. Joining earns XP only
  // once the plan has actually happened, so this is a past-only count.
  joinedCount: number;
}

export function deriveXp({ hostedCount, joinedCount }: XpInput): number {
  return hostedCount * XP_PER_PLAN_HOSTED + joinedCount * XP_PER_PLAN_JOINED;
}
