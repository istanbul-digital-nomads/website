-- Istanbul Digital Nomads - Initial Schema
-- Run this in the Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Enum types
create type event_type as enum ('meetup', 'coworking', 'workshop', 'social');
create type rsvp_status as enum ('going', 'maybe', 'not_going');

-- Members table (linked to Supabase Auth)
create table members (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  display_name text not null,
  bio text,
  avatar_url text,
  location text,
  skills text[],
  website text,
  telegram_handle text,
  is_visible boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Events table
create table events (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text not null,
  type event_type not null,
  date timestamptz not null,
  end_date timestamptz,
  location_name text not null,
  location_address text,
  location_url text,
  capacity integer,
  organizer_id uuid not null references members(id) on delete cascade,
  image_url text,
  is_published boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RSVPs table
create table rsvps (
  id uuid primary key default uuid_generate_v4(),
  event_id uuid not null references events(id) on delete cascade,
  member_id uuid not null references members(id) on delete cascade,
  status rsvp_status not null default 'going',
  created_at timestamptz default now(),
  unique(event_id, member_id)
);

-- Blog posts table
create table blog_posts (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  title text not null,
  excerpt text not null,
  content text not null,
  author_id uuid not null references members(id) on delete cascade,
  cover_image_url text,
  tags text[] default '{}',
  is_published boolean default false,
  published_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Indexes
create index idx_events_date on events(date);
create index idx_events_type on events(type);
create index idx_events_published on events(is_published);
create index idx_rsvps_event on rsvps(event_id);
create index idx_rsvps_member on rsvps(member_id);
create index idx_blog_posts_slug on blog_posts(slug);
create index idx_blog_posts_published on blog_posts(is_published);
create index idx_members_visible on members(is_visible);

-- Updated_at trigger function
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Apply updated_at triggers
create trigger members_updated_at before update on members
  for each row execute function update_updated_at();
create trigger events_updated_at before update on events
  for each row execute function update_updated_at();
create trigger blog_posts_updated_at before update on blog_posts
  for each row execute function update_updated_at();

-- Row Level Security
alter table members enable row level security;
alter table events enable row level security;
alter table rsvps enable row level security;
alter table blog_posts enable row level security;

-- Members RLS policies
create policy "Members are viewable by everyone if visible"
  on members for select using (is_visible = true);

create policy "Members can view their own profile"
  on members for select using (auth.uid() = id);

create policy "Members can update their own profile"
  on members for update using (auth.uid() = id);

create policy "Members can insert their own profile"
  on members for insert with check (auth.uid() = id);

-- Events RLS policies
create policy "Published events are viewable by everyone"
  on events for select using (is_published = true);

create policy "Organizers can view their own unpublished events"
  on events for select using (auth.uid() = organizer_id);

create policy "Authenticated users can create events"
  on events for insert with check (auth.uid() = organizer_id);

create policy "Organizers can update their own events"
  on events for update using (auth.uid() = organizer_id);

create policy "Organizers can delete their own events"
  on events for delete using (auth.uid() = organizer_id);

-- RSVPs RLS policies
create policy "RSVPs are viewable by everyone"
  on rsvps for select using (true);

create policy "Authenticated users can create RSVPs"
  on rsvps for insert with check (auth.uid() = member_id);

create policy "Users can update their own RSVPs"
  on rsvps for update using (auth.uid() = member_id);

create policy "Users can delete their own RSVPs"
  on rsvps for delete using (auth.uid() = member_id);

-- Blog posts RLS policies
create policy "Published blog posts are viewable by everyone"
  on blog_posts for select using (is_published = true);

create policy "Authors can view their own unpublished posts"
  on blog_posts for select using (auth.uid() = author_id);

create policy "Authors can create blog posts"
  on blog_posts for insert with check (auth.uid() = author_id);

create policy "Authors can update their own posts"
  on blog_posts for update using (auth.uid() = author_id);

create policy "Authors can delete their own posts"
  on blog_posts for delete using (auth.uid() = author_id);

-- Auto-create member profile on signup
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.members (id, email, display_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
