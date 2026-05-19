-- Phase 3 (PRODUCT.md): three-tier verification ladder.
--
-- Adds members.verification_level (basic|verified|trusted) with audit
-- columns (verified_at, verified_by). Default is 'basic' for every
-- member; the Blue (verified) and Gold (trusted) levels are issued
-- via the new verification_requests table - a separate concept from
-- the existing guide_applications form, which is about *becoming* a
-- local_guide via a bio/motivation submission.
--
-- Phase 3 v1 ships the schema + manual organizer-approval flow. A
-- real KYC vendor SDK (Sumsub / Persona / Onfido) plugs into the
-- kyc_provider / kyc_session_id columns in a follow-up.

-- ============================================================
-- 1. members.verification_level + audit columns
-- ============================================================

alter table members add column if not exists verification_level text
  not null default 'basic'
  check (verification_level in ('basic', 'verified', 'trusted'));

alter table members add column if not exists verified_at timestamptz;
alter table members add column if not exists verified_by uuid
  references members(id) on delete set null;

comment on column members.verification_level is
  'Verification ladder: basic (Red, default), verified (Blue, ID + selfie checked), trusted (Gold, in-person organizer meet). Gates the entry-fee field on /plans/new in Phase 3.';

comment on column members.verified_at is
  'Timestamp the current verification_level was issued. Null when basic.';

comment on column members.verified_by is
  'Organizer who signed off the current level. Null when basic or when issued automatically by the KYC vendor.';

-- Hot path index for the "verified hosts only" filters (e.g. /paperwork
-- filter, /today plan-card host badge).
create index if not exists members_verification_level_idx
  on members (verification_level)
  where verification_level in ('verified', 'trusted');

-- ============================================================
-- 2. verification_requests table
-- ============================================================

create table if not exists verification_requests (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references members(id) on delete cascade,

  requested_level text not null
    check (requested_level in ('verified', 'trusted')),
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected', 'cancelled')),

  -- Member-supplied context. v1: free-text 'why'. Future: file uploads
  -- via Supabase Storage when the KYC vendor lands.
  reason text check (reason is null or char_length(reason) <= 1000),
  document_ref text,

  -- KYC vendor hooks. Null until we wire one up.
  kyc_provider text check (
    kyc_provider is null or kyc_provider in ('sumsub', 'persona', 'onfido')
  ),
  kyc_session_id text,
  kyc_status text,

  -- Review trail
  reviewer_id uuid references members(id) on delete set null,
  reviewer_notes text,
  reviewed_at timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists verification_requests_member_idx
  on verification_requests (member_id);

create index if not exists verification_requests_pending_idx
  on verification_requests (status)
  where status = 'pending';

-- Exactly one pending request per member at a time. Avoids the
-- "submit, change your mind, submit again" double-queue case.
create unique index if not exists verification_requests_one_pending
  on verification_requests (member_id)
  where status = 'pending';

-- updated_at trigger
create or replace function verification_requests_set_updated_at()
returns trigger as $$
begin
  new.updated_at := now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists verification_requests_updated_at_trg on verification_requests;
create trigger verification_requests_updated_at_trg
  before update on verification_requests
  for each row execute function verification_requests_set_updated_at();

-- When a request is approved, bump the member's level. Audit columns
-- captured at the same time. Trigger-based so the level + audit stay
-- consistent even if a future admin tool flips status manually.
create or replace function verification_requests_apply_approval()
returns trigger as $$
begin
  if new.status = 'approved' and (old.status is distinct from 'approved') then
    update members
      set verification_level = new.requested_level,
          verified_at = now(),
          verified_by = new.reviewer_id
      where id = new.member_id;
  end if;
  return new;
end;
$$ language plpgsql;

drop trigger if exists verification_requests_apply_trg on verification_requests;
create trigger verification_requests_apply_trg
  after update of status on verification_requests
  for each row execute function verification_requests_apply_approval();

-- ============================================================
-- 3. RLS for verification_requests
-- ============================================================

alter table verification_requests enable row level security;

drop policy if exists verification_requests_self_read on verification_requests;
create policy verification_requests_self_read on verification_requests
  for select using (auth.uid() = member_id);

drop policy if exists verification_requests_self_insert on verification_requests;
create policy verification_requests_self_insert on verification_requests
  for insert with check (auth.uid() = member_id);

drop policy if exists verification_requests_self_cancel on verification_requests;
create policy verification_requests_self_cancel on verification_requests
  for update using (auth.uid() = member_id)
  with check (
    auth.uid() = member_id
    -- Members can only flip their own pending request to cancelled.
    and status in ('pending', 'cancelled')
  );

-- ============================================================
-- 4. host_badge_at_creation snapshot now uses real verification level
-- ============================================================

-- Phase 2 set host_badge_at_creation = 'basic' for all rows because
-- no verification existed. Now that verification_level is real,
-- back-fill existing plans whose creator has been upgraded since
-- the plan was posted. New plans get the live value via the
-- createPlan mutation.
update plans p
set host_badge_at_creation = m.verification_level
from members m
where p.creator_id = m.id
  and (p.host_badge_at_creation is null or p.host_badge_at_creation = 'basic')
  and m.verification_level in ('verified', 'trusted');

comment on table verification_requests is
  'Member-submitted requests for Blue (verified) or Gold (trusted) badges. Approval flow: member submits -> organizer reviews -> on approve, trigger bumps members.verification_level. Phase 3 v1 ships with manual review via the Supabase dashboard; a real admin UI lands later.';
