-- Local guides directory and application system

-- Approved guides displayed on the public directory
create table local_guides (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text not null,
  phone_whatsapp text,
  photo_url text,
  role_title text,
  bio text not null,
  specializations text[] default '{}',
  neighborhoods text[] default '{}',
  languages text[] default '{}',
  years_in_istanbul integer not null default 0,
  social_instagram text,
  social_linkedin text,
  social_twitter text,
  social_website text,
  is_visible boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Pending guide applications from the public form
create table guide_applications (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text not null,
  phone_whatsapp text,
  photo_url text,
  languages text[] default '{}',
  specializations text[] default '{}',
  neighborhoods text[] default '{}',
  years_in_istanbul integer not null default 0,
  bio text not null,
  sample_tip text not null,
  motivation text not null,
  social_instagram text,
  social_linkedin text,
  social_twitter text,
  social_website text,
  agrees_guidelines boolean not null default false,
  references_text text,
  status text not null default 'pending',
  reviewed_at timestamptz,
  created_at timestamptz default now()
);

-- Indexes
create index idx_local_guides_visible on local_guides(is_visible);
create index idx_guide_applications_status on guide_applications(status);

-- Updated_at trigger for local_guides
create trigger local_guides_updated_at before update on local_guides
  for each row execute function update_updated_at();

-- Row Level Security
alter table local_guides enable row level security;
alter table guide_applications enable row level security;

-- Local guides: public read for visible guides
create policy "Visible local guides are viewable by everyone"
  on local_guides for select using (is_visible = true);

-- Guide applications: anyone can submit (public form)
create policy "Anyone can submit a guide application"
  on guide_applications for insert
  with check (true);
