-- Design System v2 Phase 5b: circles + perks.
-- Circles themselves are static content (src/lib/circles.ts); these tables
-- track membership and the partner-perks vault. Nullable/defaulted columns
-- so existing `members` rows are untouched. Not applied yet - reading code
-- degrades gracefully when the tables/columns are absent.

-- members: Nomad+ tier + presence + opt-in coffee flag
alter table members add column if not exists is_nomad_plus boolean not null default false;
alter table members add column if not exists nomad_plus_since timestamptz;
alter table members add column if not exists last_seen_at timestamptz;
alter table members add column if not exists open_to_coffee boolean not null default false;

-- circle membership (many-to-many; circle slugs live in src/lib/circles.ts)
create table if not exists circle_members (
  circle_slug text not null,
  member_id uuid not null references members(id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (circle_slug, member_id)
);

-- perks vault
create table if not exists perks (
  id uuid primary key default gen_random_uuid(),
  brand text not null,
  kind text not null,                       -- 'coffee' | 'cowork' | 'food' | 'travel' | ...
  offer text not null,
  cap text,
  city text,
  expires_at date,
  value_try integer,
  value_usd integer,
  story text,
  photo_url text,
  claimed_count integer not null default 0,
  is_active boolean not null default true,
  is_nomad_plus_only boolean not null default true,
  created_at timestamptz not null default now()
);

-- one row per claim
create table if not exists perk_claims (
  id uuid primary key default gen_random_uuid(),
  perk_id uuid not null references perks(id) on delete cascade,
  member_id uuid not null references members(id) on delete cascade,
  claimed_at timestamptz not null default now(),
  unique (perk_id, member_id)
);

create index if not exists idx_perks_active on perks (is_active) where is_active;
create index if not exists idx_circle_members_member on circle_members (member_id);

-- RLS: perks are publicly readable (the vault page lists them); claims and
-- circle membership are member-scoped.
alter table perks enable row level security;
alter table perk_claims enable row level security;
alter table circle_members enable row level security;

create policy "perks public read" on perks for select using (is_active);
create policy "own perk claims" on perk_claims for select using (auth.uid() = member_id);
create policy "own circle memberships" on circle_members for select using (auth.uid() = member_id);
