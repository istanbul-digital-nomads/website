-- Nomad Brands: store a real logo asset path instead of an emoji "icon".
-- The map markers + filter chips now render each brand's own SVG logo
-- (public/brands/<slug>.svg), so the column is renamed icon -> logo to match.
-- nomad_brands is public reference data and currently empty (the app reads the
-- static seed in src/lib/brands.ts), so the rename is safe. Idempotent: only
-- renames when the old column still exists.
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'nomad_brands'
      and column_name = 'icon'
  ) then
    alter table nomad_brands rename column icon to logo;
  end if;
end $$;
