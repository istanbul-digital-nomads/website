-- Plan experiences: enrich a review with a short standout quote and photos,
-- so an attendee can actually share what the day was like - not just a rating.
-- Photos live in a public 'plan-photos' bucket; the review row stores their
-- public URLs in a jsonb array.

alter table plan_reviews
  add column if not exists quote text
    check (quote is null or char_length(quote) <= 140),
  add column if not exists photos jsonb not null default '[]'::jsonb;

-- ---------- storage bucket: plan-photos ----------
insert into storage.buckets (id, name, public)
values ('plan-photos', 'plan-photos', true)
on conflict (id) do nothing;

-- Public read so photos render on the plan page.
drop policy if exists "Plan photos are publicly accessible" on storage.objects;
create policy "Plan photos are publicly accessible"
  on storage.objects for select
  using (bucket_id = 'plan-photos');

-- Uploads are scoped to a per-user folder: {auth.uid}/... so a member can
-- only write under their own prefix (matches the avatars bucket convention).
drop policy if exists "Users can upload their own plan photos" on storage.objects;
create policy "Users can upload their own plan photos"
  on storage.objects for insert
  with check (
    bucket_id = 'plan-photos'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "Users can update their own plan photos" on storage.objects;
create policy "Users can update their own plan photos"
  on storage.objects for update
  using (
    bucket_id = 'plan-photos'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "Users can delete their own plan photos" on storage.objects;
create policy "Users can delete their own plan photos"
  on storage.objects for delete
  using (
    bucket_id = 'plan-photos'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
