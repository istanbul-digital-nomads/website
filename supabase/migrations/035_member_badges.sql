-- Phase 5: member badges (manual awards only).
--
-- The automatic tier badges (first_plan / regular / veteran) and the
-- one_year_istanbul anniversary badge are computed on read from the
-- member's plan activity - see src/lib/badges.ts. No row is stored for
-- those; they can't drift out of sync with the underlying counts and
-- there's nothing to farm.
--
-- This table only holds the two editorially-awarded badges that have no
-- formula behind them: best_nomad_year and top_host_year. An organizer
-- inserts a row by hand (service role / Supabase admin) - there is no
-- public write path, deliberately.

create table if not exists member_badges (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references members(id) on delete cascade,
  badge_slug text not null,
  awarded_at timestamptz not null default now(),
  note text check (note is null or char_length(note) <= 280),
  unique (member_id, badge_slug)
);

create index if not exists idx_member_badges_member on member_badges (member_id);

-- ---------- RLS ----------
alter table member_badges enable row level security;

-- read: anyone (badges are a public profile signal, like reviews). Uses
-- the anon + authenticated roles so the cached public client can read.
drop policy if exists "member badges public read" on member_badges;
create policy "member badges public read" on member_badges for select
  using (true);

-- No insert / update / delete policy: awards are made out-of-band with
-- the service role. Without a policy, RLS denies all writes to normal
-- users, which is exactly what we want for a manually-curated honor.
