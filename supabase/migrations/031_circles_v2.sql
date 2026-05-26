-- Circles v2: promote circles to the DB, group them into categories, add
-- badges, an activity log, and a participation signal. This is ADDITIVE on
-- top of migration 013 (circle_members, perks). Nothing here drops or alters
-- the 013 tables; circle_members keeps its (circle_slug, member_id) shape.
--
-- src/lib/circles.ts stays the source of truth / fallback for the app. These
-- tables back runtime data + a future admin. Nullable/defaulted throughout so
-- existing rows are untouched. Not applied yet - reading code degrades
-- gracefully when these tables/columns are absent.

-- circle categories (the five groups: professional, lifestyle, growth,
-- social, relationship). Slugs match src/lib/circles.ts circleCategories.
create table if not exists circle_categories (
  slug text primary key,
  name text not null,
  sort_order integer not null default 0
);

-- circles promoted to the DB. Slugs stay stable and match src/lib/circles.ts.
-- category references circle_categories but is nullable so a circle can exist
-- before it's filed under a group.
create table if not exists circles (
  slug text primary key,
  name text not null,
  blurb text not null,
  description text not null default '',
  rhythm text not null default '',
  accent text not null default 'terracotta',
  category text references circle_categories (slug),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- badges a member can earn inside a circle (e.g. "regular", "host"). Criteria
-- is free text for now; the matching/award logic lives in app code later.
create table if not exists circle_badges (
  id uuid primary key default gen_random_uuid(),
  slug text not null,
  name text not null,
  description text not null default '',
  criteria text,
  created_at timestamptz not null default now()
);

-- one row per participation event (posted, showed up, hosted, ...). This is
-- the raw signal we roll up into a participation score. kind is free text so
-- we can add new event types without a migration.
create table if not exists circle_activity (
  id uuid primary key default gen_random_uuid(),
  circle_slug text not null,
  member_id uuid not null references members (id) on delete cascade,
  kind text not null,                       -- 'post' | 'rsvp' | 'attended' | 'hosted' | ...
  created_at timestamptz not null default now()
);

-- participation signal on the membership row. Defaulted to 0 so existing
-- circle_members rows from migration 013 are untouched. App can recompute it
-- from circle_activity (see circle_participation view below) on a schedule.
alter table circle_members add column if not exists participation_score integer not null default 0;

-- a derived, always-fresh participation count straight from the activity log.
-- The stored circle_members.participation_score above is a cache for hot
-- reads; this view is the source of truth when you want it computed live.
create or replace view circle_participation as
  select
    circle_slug,
    member_id,
    count(*)::integer as activity_count,
    max(created_at) as last_activity_at
  from circle_activity
  group by circle_slug, member_id;

-- indexes
create index if not exists idx_circles_category on circles (category) where is_active;
create index if not exists idx_circle_categories_sort on circle_categories (sort_order);
create index if not exists idx_circle_badges_slug on circle_badges (slug);
create index if not exists idx_circle_activity_circle on circle_activity (circle_slug);
create index if not exists idx_circle_activity_member on circle_activity (member_id);

-- RLS. Circles, categories, and badges are catalog data - publicly readable so
-- the discovery page can list them. Activity is member-scoped (you only see
-- your own rows); aggregate participation is exposed through the view, which
-- inherits the underlying table's policy.
alter table circle_categories enable row level security;
alter table circles enable row level security;
alter table circle_badges enable row level security;
alter table circle_activity enable row level security;

create policy "circle categories public read" on circle_categories for select using (true);
create policy "circles public read" on circles for select using (is_active);
create policy "circle badges public read" on circle_badges for select using (true);
create policy "own circle activity" on circle_activity for select using (auth.uid() = member_id);

-- seed the five groups. Slugs + order match src/lib/circles.ts so the static
-- fallback and the DB agree. Idempotent: do nothing if the slug already exists.
insert into circle_categories (slug, name, sort_order) values
  ('professional', 'Professional', 1),
  ('lifestyle', 'Lifestyle', 2),
  ('growth', 'Growth', 3),
  ('social', 'Social', 4),
  ('relationship', 'Relationship', 5)
on conflict (slug) do nothing;
