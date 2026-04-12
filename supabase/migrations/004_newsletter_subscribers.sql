-- Newsletter subscribers table
-- Stores email addresses for newsletter signups (no auth required)

create table newsletter_subscribers (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  created_at timestamptz default now()
);

-- Index for fast email lookups (deduplication check)
create index idx_newsletter_email on newsletter_subscribers(email);

-- RLS: allow anonymous inserts and reads for the API route
alter table newsletter_subscribers enable row level security;

-- Anyone can check if an email exists (needed for dedup)
create policy "Newsletter subscribers are readable by anon"
  on newsletter_subscribers for select
  using (true);

-- Anyone can subscribe (no auth required)
create policy "Anyone can subscribe to newsletter"
  on newsletter_subscribers for insert
  with check (true);
