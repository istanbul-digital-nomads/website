-- Storage buckets for Istanbul Digital Nomads
-- Run this in the Supabase SQL Editor

-- Create storage buckets
insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true);
insert into storage.buckets (id, name, public) values ('event-images', 'event-images', true);

-- Avatars bucket policies
create policy "Avatar images are publicly accessible"
  on storage.objects for select
  using (bucket_id = 'avatars');

create policy "Users can upload their own avatar"
  on storage.objects for insert
  with check (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Users can update their own avatar"
  on storage.objects for update
  using (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Users can delete their own avatar"
  on storage.objects for delete
  using (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);

-- Event images bucket policies
create policy "Event images are publicly accessible"
  on storage.objects for select
  using (bucket_id = 'event-images');

create policy "Authenticated users can upload event images"
  on storage.objects for insert
  with check (bucket_id = 'event-images' and auth.role() = 'authenticated');

create policy "Event image uploader can update"
  on storage.objects for update
  using (bucket_id = 'event-images' and auth.uid() = owner);

create policy "Event image uploader can delete"
  on storage.objects for delete
  using (bucket_id = 'event-images' and auth.uid() = owner);
