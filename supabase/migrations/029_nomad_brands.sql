-- Nomad Brands map layer. Coffee chains (and later coworking chains, gyms,
-- etc.) that nomads recognise, plus their individual Istanbul branches. The
-- brand catalogue and a verified seed of branches live in src/lib/brands.ts;
-- these tables let us grow the dataset past what's comfortable to hardcode and
-- accept community-submitted branches later. Public data, so both tables are
-- publicly readable. Nullable/defaulted columns mirror the spaces verification
-- convention: scores stay null and get listed in unverified_fields until a
-- citable source backs them. Not applied yet - reading code degrades
-- gracefully to the static seed when the tables are absent/empty.

-- A brand is a chain or recognisable name (Espressolab, Starbucks, BEX...).
create table if not exists nomad_brands (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  icon text,                                -- emoji or icon key for the marker
  category text,                            -- 'coffee' | 'cowork' | 'gym' | ...
  color text,                               -- hex used for the marker tint
  created_at timestamptz not null default now()
);

-- One physical branch of a brand.
create table if not exists brand_locations (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid references nomad_brands(id) on delete cascade,
  name text,
  lat double precision,
  lng double precision,
  district text,
  neighborhood_slug text,
  address text,
  opening_hours text,
  rating numeric,
  reviews_count integer,
  wifi_score smallint,
  atmosphere_score smallint,
  laptop_friendliness smallint,
  power_outlet_score smallint,
  images jsonb default '[]',
  sources jsonb default '[]',
  unverified_fields text[] default '{}',
  last_verified date,
  created_at timestamptz not null default now()
);

create index if not exists idx_brand_locations_brand on brand_locations (brand_id);
create index if not exists idx_brand_locations_neighborhood on brand_locations (neighborhood_slug);

-- RLS: both tables hold public reference data (chain names + branch info), so
-- anyone can read. Writes stay service-role only (no insert/update policy).
alter table nomad_brands enable row level security;
alter table brand_locations enable row level security;

create policy "nomad_brands public read" on nomad_brands for select using (true);
create policy "brand_locations public read" on brand_locations for select using (true);
