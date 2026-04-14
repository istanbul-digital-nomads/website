-- Add origin_countries to local_guides + guide_applications for Path to Istanbul integration.
-- Values are ISO 3166-1 alpha-2 codes (e.g. 'IR', 'RU', 'IN').

alter table local_guides add column if not exists origin_countries text[] default '{}';
alter table guide_applications add column if not exists origin_countries text[] default '{}';

create index if not exists idx_local_guides_origin_countries
  on local_guides using gin(origin_countries);
