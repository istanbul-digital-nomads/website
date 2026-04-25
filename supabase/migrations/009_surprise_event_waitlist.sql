-- Surprise event waitlist
-- Lightweight signup for an unannounced community event.
-- Title and date stay hidden until the day; visitors join a waitlist with
-- email + first name. Public insert, public count read, no auth required.

create table surprise_event_waitlist (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  first_name text not null,
  created_at timestamptz default now()
);

create index idx_surprise_waitlist_created on surprise_event_waitlist(created_at desc);

alter table surprise_event_waitlist enable row level security;

-- Anyone can join the waitlist
create policy "Anyone can join the surprise event waitlist"
  on surprise_event_waitlist for insert
  with check (true);

-- Anyone can read so the API can return count + recent first names.
-- Email is never exposed by the API; only the count and first_name are returned.
create policy "Surprise event waitlist is readable by everyone"
  on surprise_event_waitlist for select
  using (true);
