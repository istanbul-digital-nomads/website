-- Phase 5 (PRODUCT.md §6): paid-plan marketplace.
--
-- plan_tickets is the money ledger - one row per attendee per
-- ticketed plan. Fee model is "stack on platform take": the attendee
-- pays the sticker entry fee (gross), and the 10% platform fee +
-- ~2.9% processor fee come out before the guide's net. Guide keeps
-- ~87%.
--
-- Escrow lifecycle:
--   pending  -> ticket created, awaiting iyzico capture
--   held     -> payment captured, funds in platform escrow
--   released -> 7-day holdback cleared, paid out to guide
--   refunded -> attendee cancelled in time / host cancelled
--   disputed -> attendee filed a dispute, payout frozen
--   failed   -> iyzico declined / abandoned
--
-- members gain payout fields (IBAN + iyzico sub-merchant key). The
-- KYC that gates Blue-badge verification (Phase 3) is the prerequisite
-- for collecting payouts.

-- ============================================================
-- 1. members payout fields
-- ============================================================

alter table members add column if not exists payout_iban text
  check (payout_iban is null or char_length(payout_iban) between 15 and 34);
alter table members add column if not exists payout_name text
  check (payout_name is null or char_length(payout_name) <= 140);
alter table members add column if not exists iyzico_submerchant_key text;

comment on column members.payout_iban is
  'Guide payout IBAN. Collected on /dashboard/payouts. TRY payouts via iyzico for Turkish-resident guides.';
comment on column members.iyzico_submerchant_key is
  'iyzico sub-merchant identifier once the guide is onboarded as a payee. Null until set up.';

-- ============================================================
-- 2. plan_tickets ledger
-- ============================================================

create table if not exists plan_tickets (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null references plans(id) on delete cascade,
  attendee_id uuid not null references members(id) on delete cascade,
  host_id uuid not null references members(id) on delete cascade,

  -- Money, all in minor units (kuruş). gross = sticker entry fee the
  -- attendee paid. platform_fee + processor_fee come out of gross;
  -- net_to_host is what the guide receives.
  gross_cents integer not null check (gross_cents >= 0),
  platform_fee_cents integer not null check (platform_fee_cents >= 0),
  processor_fee_cents integer not null check (processor_fee_cents >= 0),
  net_to_host_cents integer not null check (net_to_host_cents >= 0),
  currency text not null default 'TRY' check (currency in ('TRY')),

  status text not null default 'pending' check (status in (
    'pending', 'held', 'released', 'refunded', 'disputed', 'failed'
  )),

  -- iyzico references
  payment_provider text not null default 'iyzico'
    check (payment_provider in ('iyzico', 'stripe')),
  conversation_id text,           -- our idempotency key sent to iyzico
  payment_intent_id text,         -- iyzico paymentId once captured

  paid_at timestamptz,
  released_at timestamptz,
  refunded_at timestamptz,
  refunded_reason text,
  disputed_at timestamptz,
  dispute_reason text,
  dispute_resolved_at timestamptz,
  dispute_outcome text check (dispute_outcome is null or dispute_outcome in (
    'refunded', 'released', 'partial'
  )),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- One active (non-failed) ticket per attendee per plan. A failed
-- attempt can be retried, so the unique index excludes failed.
create unique index if not exists plan_tickets_one_active
  on plan_tickets (plan_id, attendee_id)
  where status <> 'failed';

create index if not exists plan_tickets_host_idx on plan_tickets (host_id);
create index if not exists plan_tickets_attendee_idx
  on plan_tickets (attendee_id);
create index if not exists plan_tickets_status_idx on plan_tickets (status);
-- Payout-release cron scans held tickets.
create index if not exists plan_tickets_held_idx
  on plan_tickets (status, paid_at)
  where status = 'held';

create or replace function plan_tickets_set_updated_at()
returns trigger as $$
begin
  new.updated_at := now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists plan_tickets_updated_at_trg on plan_tickets;
create trigger plan_tickets_updated_at_trg
  before update on plan_tickets
  for each row execute function plan_tickets_set_updated_at();

-- ============================================================
-- 3. RLS
-- ============================================================

alter table plan_tickets enable row level security;

-- Attendee reads their own tickets; host reads tickets sold for their
-- own plans. No public read - this is money data.
drop policy if exists plan_tickets_party_read on plan_tickets;
create policy plan_tickets_party_read on plan_tickets
  for select to authenticated using (
    auth.uid() = attendee_id or auth.uid() = host_id
  );

-- Inserts + status transitions go through the service-role API routes
-- (checkout, webhook, payout cron, refund/dispute handlers), never
-- the client directly. No anon/authenticated insert/update policy =
-- writes only via service role.

comment on table plan_tickets is
  'Money ledger for ticketed plans. One row per attendee per plan. Fee model: gross (sticker) - platform 10% - processor ~2.9% = net_to_host. Escrow lifecycle pending->held->released with refunded/disputed/failed branches. All writes via service-role API routes.';
