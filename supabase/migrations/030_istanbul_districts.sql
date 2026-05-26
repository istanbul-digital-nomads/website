-- Istanbul district/neighborhood intelligence layer.
-- A curated hierarchy on top of the rich static neighborhoods in
-- src/lib/neighborhoods.ts: districts (ilce) -> nomad-relevant
-- neighborhoods (mahalle/area), with cited-source-only facts and
-- nullable scores. The static seed lives in src/lib/districts.ts and is
-- the source of truth; these tables let us override/extend without a
-- redeploy. Nullable/defaulted columns so partial rows are fine. Not
-- applied yet - reading code degrades gracefully to the static seed when
-- the tables are absent.

create table if not exists istanbul_districts (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  side text,                                -- 'Asian' | 'European' | null
  slug text unique,
  created_at timestamptz not null default now()
);

create table if not exists istanbul_neighborhoods (
  id uuid primary key default gen_random_uuid(),
  district_id uuid references istanbul_districts(id) on delete cascade,
  slug text unique,
  name text not null,
  description text,
  tags text[] not null default '{}',
  atmosphere text,
  nomad_score smallint,                     -- 0-100, null until a source backs it
  nightlife_score smallint,
  cost_level smallint,
  walkability smallint,
  safety smallint,
  transportation text,
  sources jsonb not null default '[]',      -- [{label,url}] - matches SpaceSource
  unverified_fields text[] not null default '{}',
  last_verified date,
  created_at timestamptz not null default now()
);

create index if not exists idx_istanbul_neighborhoods_district
  on istanbul_neighborhoods (district_id);
create index if not exists idx_istanbul_neighborhoods_slug
  on istanbul_neighborhoods (slug);

-- RLS: both tables are public reference content, publicly readable. No
-- write policy - rows are seeded server-side (service role / migrations).
alter table istanbul_districts enable row level security;
alter table istanbul_neighborhoods enable row level security;

create policy "istanbul_districts public read"
  on istanbul_districts for select using (true);
create policy "istanbul_neighborhoods public read"
  on istanbul_neighborhoods for select using (true);
