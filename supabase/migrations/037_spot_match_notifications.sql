-- Phase 2 of the spot finder: ping a member when a community plan stops by a
-- spot they've saved (and toggled on). Adds the per-category notification
-- preference and a de-dupe ledger so each (saved_spot, plan) pings at most once.

-- New notification category. Default true, like every other notify_* column
-- (028); the master notify_telegram switch still gates everything.
alter table members
  add column if not exists notify_spot_matches boolean not null default true;

-- One row per (saved spot, plan) we've already pinged about, so the cron is
-- idempotent and a member never gets the same plan twice for the same spot.
create table if not exists spot_match_notifications (
  id uuid primary key default gen_random_uuid(),
  saved_spot_id uuid not null references saved_spots(id) on delete cascade,
  plan_id uuid not null references plans(id) on delete cascade,
  notified_at timestamptz not null default now(),
  unique (saved_spot_id, plan_id)
);

create index if not exists idx_spot_match_notifications_spot
  on spot_match_notifications (saved_spot_id);

-- ---------- RLS ----------
-- This is an internal ledger written only by the spot-matches cron (service
-- role, which bypasses RLS). Enable RLS with no policies so normal users have
-- no access at all - there's nothing here a member needs to read or write.
alter table spot_match_notifications enable row level security;
