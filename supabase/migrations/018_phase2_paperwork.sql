-- Phase 2 (PRODUCT.md): plans v2 + paperwork surface.
--
-- Major shape change to the member role model: `agent` becomes a
-- capability flag (`is_agent BOOLEAN`) instead of a primary role.
-- Any member can host plans like before; only `is_agent = true`
-- members can offer paperwork services on the new `/paperwork`
-- surface. This means a person who's a `nomad` AND offers visa help
-- has one account with `member_type = 'nomad', is_agent = true`.
--
-- Plans gain money fields at the plan level (not per-stop): every
-- plan is either a `budget` plan (free, host shows an estimated cost
-- range) or a `ticketed` plan (host charges a real entry fee). Phase
-- 2 ships the plumbing; Phase 4 adds checkout.
--
-- New `paperwork_services` table is the agent's primary surface.
-- Shape: service_type enum (visa / ikamet / etc.), title,
-- description, languages, neighborhoods, price + currency, duration
-- estimate, is_active. RLS so members can write only their own.

-- ============================================================
-- 1. Member role: drop `agent` from member_type, add is_agent flag
-- ============================================================

-- No existing rows have member_type = 'agent' (verified before this
-- migration), so no data migration is required. The constraint
-- swap is safe.
alter table members drop constraint if exists members_member_type_check;
alter table members add constraint members_member_type_check
  check (member_type is null or member_type in (
    'nomad', 'remote_worker', 'local_guide', 'tour_guide'
  ));

alter table members add column if not exists is_agent boolean not null default false;

comment on column members.is_agent is
  'Capability flag - when true, the member can offer paperwork services on /paperwork. Independent of member_type; an is_agent nomad is a perfectly valid combo.';

create index if not exists members_is_agent_idx
  on members (is_agent)
  where is_agent = true and is_visible = true and onboarding_completed = true;

-- ============================================================
-- 2. Plans v2: culture vibe + money fields + host snapshots
-- ============================================================

-- 2a. Extend plan_stops.vibe enum with 'culture'. Existing values
-- (focus / cowork / social / meal / after-work / outdoor) keep
-- working; no paperwork value (paperwork lives in a separate table).
alter table plan_stops drop constraint if exists plan_stops_vibe_check;
alter table plan_stops add constraint plan_stops_vibe_check
  check (vibe in (
    'focus','cowork','social','meal','after-work','outdoor','culture'
  ));

-- 2b. Money fields on `plans` (per-plan, not per-stop). Either both
-- budget_min/max are set (budget plan) OR entry_fee_cents is set
-- (ticketed plan), enforced by check constraint.
alter table plans add column if not exists is_ticketed boolean not null default false;
alter table plans add column if not exists entry_fee_cents integer
  check (entry_fee_cents is null or entry_fee_cents >= 0);
alter table plans add column if not exists budget_per_person_min_cents integer
  check (budget_per_person_min_cents is null or budget_per_person_min_cents >= 0);
alter table plans add column if not exists budget_per_person_max_cents integer
  check (budget_per_person_max_cents is null or budget_per_person_max_cents >= 0);
alter table plans add column if not exists currency text default 'TRY'
  check (currency in ('TRY'));

alter table plans drop constraint if exists plans_money_consistency_check;
alter table plans add constraint plans_money_consistency_check check (
  case
    when is_ticketed = true then
      entry_fee_cents is not null
      and budget_per_person_min_cents is null
      and budget_per_person_max_cents is null
    else
      entry_fee_cents is null
  end
);

-- 2c. Host snapshot fields. Captured at creation time so a
-- downgraded guide's older plans still display the badge they had
-- when they posted.
alter table plans add column if not exists host_role_at_creation text
  check (host_role_at_creation is null or host_role_at_creation in (
    'nomad', 'remote_worker', 'local_guide', 'tour_guide'
  ));
alter table plans add column if not exists host_badge_at_creation text
  check (host_badge_at_creation is null or host_badge_at_creation in (
    'basic', 'verified', 'trusted'
  ));

-- Backfill existing plans: best-effort role from current member_type;
-- badge defaults to 'basic' since no verification ladder exists yet
-- (Phase 3).
update plans p
set host_role_at_creation = coalesce(
      (select member_type from members where id = p.creator_id),
      'nomad'
    ),
    host_badge_at_creation = 'basic'
where host_role_at_creation is null;

comment on column plans.is_ticketed is
  'True when this plan has an entry fee (paid plan). False (default) means budget plan - host shows a cost estimate but no money flows through the platform.';

comment on column plans.host_role_at_creation is
  'Snapshot of the host role at the time the plan was created. Frozen so older plans display correctly even after the host changes role.';

comment on column plans.host_badge_at_creation is
  'Snapshot of the host verification badge at creation (basic/verified/trusted). All values default to basic until Phase 3 lands.';

-- ============================================================
-- 3. paperwork_services - agents' primary product surface
-- ============================================================

create table if not exists paperwork_services (
  id uuid primary key default gen_random_uuid(),
  host_id uuid not null references members(id) on delete cascade,

  service_type text not null check (service_type in (
    'visa', 'ikamet', 'residency_permit', 'bank_account',
    'notary', 'gbt', 'tax_office', 'other'
  )),
  title text not null check (char_length(title) between 3 and 120),
  description text check (description is null or char_length(description) <= 1200),

  languages text[] not null default '{}',
  neighborhoods text[] not null default '{}',

  price_cents integer not null check (price_cents >= 0),
  currency text not null default 'TRY' check (currency in ('TRY')),
  duration_estimate_minutes integer
    check (duration_estimate_minutes is null or duration_estimate_minutes between 15 and 480),

  is_active boolean not null default true,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists paperwork_services_active_type_idx
  on paperwork_services (service_type)
  where is_active = true;

create index if not exists paperwork_services_host_idx
  on paperwork_services (host_id);

-- updated_at trigger
create or replace function paperwork_services_set_updated_at()
returns trigger as $$
begin
  new.updated_at := now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists paperwork_services_updated_at_trg on paperwork_services;
create trigger paperwork_services_updated_at_trg
  before update on paperwork_services
  for each row execute function paperwork_services_set_updated_at();

-- Guard: only is_agent members can host paperwork services.
create or replace function paperwork_services_host_must_be_agent()
returns trigger as $$
declare
  agent_flag boolean;
begin
  select is_agent into agent_flag from members where id = new.host_id;
  if agent_flag is not true then
    raise exception 'paperwork_services.host_id must reference a member with is_agent = true (got %)', new.host_id;
  end if;
  return new;
end;
$$ language plpgsql;

drop trigger if exists paperwork_services_host_check_trg on paperwork_services;
create trigger paperwork_services_host_check_trg
  before insert or update of host_id on paperwork_services
  for each row execute function paperwork_services_host_must_be_agent();

-- ============================================================
-- 4. RLS for paperwork_services
-- ============================================================

alter table paperwork_services enable row level security;

drop policy if exists paperwork_public_read on paperwork_services;
create policy paperwork_public_read on paperwork_services
  for select using (is_active = true);

drop policy if exists paperwork_host_insert on paperwork_services;
create policy paperwork_host_insert on paperwork_services
  for insert with check (
    auth.uid() = host_id
    and (select is_agent from members where id = auth.uid()) = true
  );

drop policy if exists paperwork_host_update on paperwork_services;
create policy paperwork_host_update on paperwork_services
  for update using (auth.uid() = host_id)
  with check (auth.uid() = host_id);

drop policy if exists paperwork_host_delete on paperwork_services;
create policy paperwork_host_delete on paperwork_services
  for delete using (auth.uid() = host_id);

comment on table paperwork_services is
  'Agent-hosted paperwork services (visa, ikamet, bank account opening, notary, govt offices). Surfaced at /paperwork. Distinct from `plans` which is the community planner. Only members with members.is_agent = true can host services; enforced by trigger + RLS.';
