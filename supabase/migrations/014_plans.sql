-- Daily Plans: lightweight peer-to-peer "I'll be at X cafe Monday 2pm" cards.
-- Deliberately the lighter sibling of events (no capacity-ticketing, no
-- organiser approval). Members-only feed with a public count for the
-- landing. Telegram is the notification channel; plan state stays in-app.

-- ---------- plans ----------
create table if not exists plans (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references members(id) on delete cascade,

  scheduled_date date not null,
  start_time time,
  end_time time,

  space_id text,                       -- NomadSpace.id (file-based, no FK)
  neighborhood_slug text,
  custom_location text,

  title text not null check (char_length(title) between 3 and 80),
  vibe text not null check (vibe in ('focus','cowork','social','meal','after-work','outdoor')),
  notes text check (notes is null or char_length(notes) <= 280),
  capacity int check (capacity is null or (capacity between 2 and 20)),

  status text not null default 'active' check (status in ('active','cancelled','expired')),
  reminder_sent_at timestamptz,
  expires_at timestamptz not null,
  language text default 'en',

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_plans_active_date on plans (scheduled_date) where status = 'active';
create index if not exists idx_plans_neighborhood on plans (neighborhood_slug, scheduled_date) where status = 'active';
create index if not exists idx_plans_creator on plans (creator_id);
create index if not exists idx_plans_expires on plans (expires_at) where status = 'active';

-- ---------- attendees ----------
create table if not exists plan_attendees (
  plan_id uuid not null references plans(id) on delete cascade,
  member_id uuid not null references members(id) on delete cascade,
  status text not null default 'going' check (status in ('going','left')),
  joined_at timestamptz not null default now(),
  primary key (plan_id, member_id)
);

create index if not exists idx_plan_attendees_member on plan_attendees (member_id);

-- ---------- comments ----------
create table if not exists plan_comments (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null references plans(id) on delete cascade,
  author_id uuid not null references members(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 500),
  created_at timestamptz not null default now()
);

create index if not exists idx_plan_comments_plan on plan_comments (plan_id, created_at);

-- ---------- telegram subscriptions ----------
-- chat_id is what the Bot API requires to send a DM; telegram_handle on the
-- members table is the user-visible handle and not enough for bot writes.
create table if not exists telegram_subscriptions (
  member_id uuid primary key references members(id) on delete cascade,
  telegram_chat_id bigint not null unique,
  linked_at timestamptz not null default now()
);

-- ---------- public count view ----------
-- Granted to anon for the public landing counter. No row leakage.
create or replace view plans_today_count as
select count(*)::int as count
from plans
where status = 'active'
  and scheduled_date = (now() at time zone 'Europe/Istanbul')::date;

create or replace view plans_today_by_neighborhood as
select neighborhood_slug, count(*)::int as count
from plans
where status = 'active'
  and scheduled_date = (now() at time zone 'Europe/Istanbul')::date
  and neighborhood_slug is not null
group by neighborhood_slug;

grant select on plans_today_count to anon, authenticated;
grant select on plans_today_by_neighborhood to anon, authenticated;

-- ---------- updated_at trigger ----------
create or replace function set_plan_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists trg_plans_updated_at on plans;
create trigger trg_plans_updated_at
  before update on plans
  for each row execute function set_plan_updated_at();

-- ---------- RLS ----------
alter table plans enable row level security;
alter table plan_attendees enable row level security;
alter table plan_comments enable row level security;
alter table telegram_subscriptions enable row level security;

-- plans: any authed user can read active/cancelled plans; only creator writes
drop policy if exists "plans read authed" on plans;
create policy "plans read authed" on plans for select
  to authenticated using (true);

drop policy if exists "plans insert own" on plans;
create policy "plans insert own" on plans for insert
  to authenticated with check (creator_id = auth.uid());

drop policy if exists "plans update own" on plans;
create policy "plans update own" on plans for update
  to authenticated using (creator_id = auth.uid()) with check (creator_id = auth.uid());

drop policy if exists "plans delete own" on plans;
create policy "plans delete own" on plans for delete
  to authenticated using (creator_id = auth.uid());

-- plan_attendees: authed read; insert/delete own membership
drop policy if exists "attendees read authed" on plan_attendees;
create policy "attendees read authed" on plan_attendees for select
  to authenticated using (true);

drop policy if exists "attendees insert own" on plan_attendees;
create policy "attendees insert own" on plan_attendees for insert
  to authenticated with check (member_id = auth.uid());

drop policy if exists "attendees delete own" on plan_attendees;
create policy "attendees delete own" on plan_attendees for delete
  to authenticated using (member_id = auth.uid());

-- plan_comments: authed read; author writes; author or plan creator deletes
drop policy if exists "comments read authed" on plan_comments;
create policy "comments read authed" on plan_comments for select
  to authenticated using (true);

drop policy if exists "comments insert own" on plan_comments;
create policy "comments insert own" on plan_comments for insert
  to authenticated with check (author_id = auth.uid());

drop policy if exists "comments delete own or host" on plan_comments;
create policy "comments delete own or host" on plan_comments for delete
  to authenticated using (
    author_id = auth.uid()
    or exists (
      select 1 from plans p
      where p.id = plan_comments.plan_id and p.creator_id = auth.uid()
    )
  );

-- telegram subscriptions: row-owner only
drop policy if exists "tg own read" on telegram_subscriptions;
create policy "tg own read" on telegram_subscriptions for select
  to authenticated using (member_id = auth.uid());

drop policy if exists "tg own write" on telegram_subscriptions;
create policy "tg own write" on telegram_subscriptions for insert
  to authenticated with check (member_id = auth.uid());

drop policy if exists "tg own update" on telegram_subscriptions;
create policy "tg own update" on telegram_subscriptions for update
  to authenticated using (member_id = auth.uid()) with check (member_id = auth.uid());

drop policy if exists "tg own delete" on telegram_subscriptions;
create policy "tg own delete" on telegram_subscriptions for delete
  to authenticated using (member_id = auth.uid());
