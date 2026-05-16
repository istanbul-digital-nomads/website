-- Multi-stop plans. A plan is now "a day", and each plan_stops row is one
-- waypoint on that day (cowork at Kolektif 10-2, beer at Karga at 6).
--
-- Migration 014 stored space/time/vibe/notes directly on the plans row.
-- Moving them to plan_stops makes ordered multi-stop natural, keeps the
-- plan-level row about the day itself (date, title, capacity, expiry).

-- ---------- plan_stops ----------
create table if not exists plan_stops (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null references plans(id) on delete cascade,
  ordinal int not null check (ordinal >= 1),

  -- Location: pick a verified NomadSpace (space_id) OR drop a custom pin
  -- (lat + lng + optional custom_location label). Trigger below enforces.
  space_id text,
  custom_location text check (custom_location is null or char_length(custom_location) <= 120),
  neighborhood_slug text,
  lat numeric(9, 6),
  lng numeric(9, 6),

  start_time time,
  end_time time,
  vibe text not null check (vibe in ('focus','cowork','social','meal','after-work','outdoor')),
  notes text check (notes is null or char_length(notes) <= 280),

  created_at timestamptz not null default now()
);

create index if not exists idx_plan_stops_plan on plan_stops (plan_id, ordinal);
create index if not exists idx_plan_stops_neighborhood on plan_stops (neighborhood_slug);
create unique index if not exists uq_plan_stops_plan_ordinal on plan_stops (plan_id, ordinal);

-- Enforce: every stop has at least one of space_id, custom_location, or pinned lat+lng.
alter table plan_stops drop constraint if exists plan_stops_location_check;
alter table plan_stops add constraint plan_stops_location_check
  check (
    space_id is not null
    or custom_location is not null
    or (lat is not null and lng is not null)
  );

-- ---------- plans table cleanup ----------
-- Drop the per-stop fields that moved to plan_stops. Safe because no
-- production rows exist yet (table created in migration 014 with no inserts).
-- The plans_today_by_neighborhood view (created in 014) depends on
-- plans.neighborhood_slug; drop the view first, recreate against
-- plan_stops below.
drop view if exists plans_today_by_neighborhood;
alter table plans drop column if exists space_id;
alter table plans drop column if exists custom_location;
alter table plans drop column if exists neighborhood_slug;
alter table plans drop column if exists start_time;
alter table plans drop column if exists end_time;
alter table plans drop column if exists vibe;
alter table plans drop column if exists notes;

-- ---------- views ----------
-- The neighborhood breakdown now sources from stops (a multi-stop plan
-- counts in every neighborhood it visits, deduplicated per plan).
create or replace view plans_today_by_neighborhood as
select s.neighborhood_slug, count(distinct p.id)::int as count
from plans p
join plan_stops s on s.plan_id = p.id
where p.status = 'active'
  and p.scheduled_date = (now() at time zone 'Europe/Istanbul')::date
  and s.neighborhood_slug is not null
group by s.neighborhood_slug;

grant select on plans_today_by_neighborhood to anon, authenticated;

-- ---------- RLS ----------
alter table plan_stops enable row level security;

drop policy if exists "stops read authed" on plan_stops;
create policy "stops read authed" on plan_stops for select
  to authenticated using (true);

-- Only the plan creator can write stops. Subselect into plans for ownership.
drop policy if exists "stops insert own plan" on plan_stops;
create policy "stops insert own plan" on plan_stops for insert
  to authenticated with check (
    exists (
      select 1 from plans p
      where p.id = plan_stops.plan_id and p.creator_id = auth.uid()
    )
  );

drop policy if exists "stops update own plan" on plan_stops;
create policy "stops update own plan" on plan_stops for update
  to authenticated using (
    exists (
      select 1 from plans p
      where p.id = plan_stops.plan_id and p.creator_id = auth.uid()
    )
  ) with check (
    exists (
      select 1 from plans p
      where p.id = plan_stops.plan_id and p.creator_id = auth.uid()
    )
  );

drop policy if exists "stops delete own plan" on plan_stops;
create policy "stops delete own plan" on plan_stops for delete
  to authenticated using (
    exists (
      select 1 from plans p
      where p.id = plan_stops.plan_id and p.creator_id = auth.uid()
    )
  );
