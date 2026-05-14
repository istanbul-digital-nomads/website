-- Design System v2 Phase 4: event ticketing fields.
-- Adds optional pricing + categorisation columns to `events`. All nullable
-- so existing rows and the free-RSVP-via-Telegram flow are untouched; paid
-- events route through Stripe Checkout (see src/lib/stripe.ts).

alter table events add column if not exists slug text;
alter table events add column if not exists price_try integer;   -- null = free
alter table events add column if not exists price_usd integer;    -- null = free
alter table events add column if not exists kind text;            -- 'dinner' | 'cowork' | 'walk' | 'drinks' | 'outdoor' | 'talk' | 'class'
alter table events add column if not exists waitlist_count integer not null default 0;

-- Slug is optional; the detail route falls back to the uuid id when absent.
create unique index if not exists idx_events_slug on events (slug)
  where slug is not null;
