-- Saved spots: a member's personal "spots to visit" list.
--
-- Built for the spot-finder tool (paste an Instagram reel/post link, we
-- best-effort detect the place, the member confirms the pin on a map and
-- saves it here). The existing members.favorite_spots text[] is a free-text
-- chip list with no coordinates - useless for putting a spot on a map or, in
-- the next phase, matching it against plan_stops to ping the owner when a
-- community plan visits the spot. So this is a real relational table with
-- coordinates, mirroring the lat/lng + RLS conventions from plan_stops (015).
--
-- space_id is set when detection matched one of our curated NomadSpaces
-- (src/lib/spaces.ts); otherwise the spot is a free pin. notify_on_plan_match
-- is persisted now and consumed by the v2 spot-match cron.

create table if not exists saved_spots (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references members(id) on delete cascade,
  label text not null check (char_length(label) between 1 and 120),

  -- Location: a curated NomadSpace id, an Istanbul neighborhood slug, and/or a
  -- raw pin. lat+lng are always set (the member confirms a pin before saving).
  space_id text,
  neighborhood_slug text,
  lat numeric(9, 6) not null,
  lng numeric(9, 6) not null,

  source text not null default 'instagram' check (source in ('instagram', 'manual')),
  source_url text check (source_url is null or char_length(source_url) <= 500),
  thumbnail_url text,

  -- Persisted now, acted on by the v2 spot-match notification cron.
  notify_on_plan_match boolean not null default false,

  created_at timestamptz not null default now()
);

create index if not exists idx_saved_spots_member
  on saved_spots (member_id, created_at desc);

-- Soft de-dupe: the same Instagram link can't be saved twice by one member.
-- (NULL source_url - manual pins - are exempt, so duplicates are allowed there.)
create unique index if not exists uq_saved_spots_member_url
  on saved_spots (member_id, source_url) where source_url is not null;

-- ---------- RLS ----------
-- Own-row only for every verb. A saved list is private to its owner; mirror
-- the members/rsvps own-row policies (auth.uid() = member_id).
alter table saved_spots enable row level security;

drop policy if exists "saved spots select own" on saved_spots;
create policy "saved spots select own" on saved_spots for select
  to authenticated using (auth.uid() = member_id);

drop policy if exists "saved spots insert own" on saved_spots;
create policy "saved spots insert own" on saved_spots for insert
  to authenticated with check (auth.uid() = member_id);

drop policy if exists "saved spots update own" on saved_spots;
create policy "saved spots update own" on saved_spots for update
  to authenticated using (auth.uid() = member_id)
  with check (auth.uid() = member_id);

drop policy if exists "saved spots delete own" on saved_spots;
create policy "saved spots delete own" on saved_spots for delete
  to authenticated using (auth.uid() = member_id);
