-- Seed data for Istanbul Digital Nomads
-- Run this in the Supabase SQL Editor after creating a test user

-- First, create a test organizer in auth.users (skip if you already have users)
-- You can also just sign in with Google to create a real user, then use that user's ID below.

-- Insert sample events (organizer_id will need to be set to a real user ID)
-- For now, we'll use a placeholder approach: insert events without organizer_id constraint
-- by temporarily disabling the FK, or you can run this AFTER signing in with Google.

-- If you have a user, replace 'YOUR_USER_ID' with the actual UUID from auth.users

/*
INSERT INTO events (title, description, type, date, end_date, location_name, location_address, capacity, organizer_id, is_published) VALUES
  ('Weekly Coworking - Kadikoy', 'Our regular Wednesday coworking session at MOB Kadikoy. Bring your laptop, grab a coffee, and work alongside other nomads. Good wifi, power outlets, and great company.', 'coworking', '2026-04-09T10:00:00+03:00', '2026-04-09T17:00:00+03:00', 'MOB Kadikoy', 'Kadikoy, Istanbul', 20, 'YOUR_USER_ID', true),
  ('Nomad Meetup - Rooftop Social', 'Monthly social gathering on a Beyoglu rooftop. Meet new arrivals, catch up with regulars, and enjoy the Bosphorus view. Drinks at your own expense.', 'social', '2026-04-12T18:00:00+03:00', NULL, 'Beyoglu Rooftop Bar', 'Beyoglu, Istanbul', NULL, 'YOUR_USER_ID', true),
  ('Workshop: Turkish Tax for Freelancers', 'A local tax accountant walks us through the basics of Turkish tax obligations for freelancers and remote workers. Q&A included.', 'workshop', '2026-04-19T14:00:00+03:00', '2026-04-19T16:00:00+03:00', 'Online (Zoom)', NULL, 50, 'YOUR_USER_ID', true),
  ('Kadikoy Walking Tour', 'Explore the Asian side best neighborhood with a local guide. Markets, street art, cafes, and hidden gems.', 'meetup', '2026-03-15T11:00:00+03:00', NULL, 'Kadikoy Ferry Terminal', 'Kadikoy, Istanbul', 25, 'YOUR_USER_ID', true),
  ('Coworking Marathon - Cihangir', 'Full-day coworking session in Cihangir. Lunch break as a group at a local spot.', 'coworking', '2026-03-10T09:00:00+03:00', '2026-03-10T18:00:00+03:00', 'Setup Cihangir', 'Cihangir, Istanbul', 25, 'YOUR_USER_ID', true);
*/

-- To use: Sign in with Google on the site first, then find your user ID with:
-- SELECT id FROM auth.users LIMIT 1;
-- Then replace YOUR_USER_ID above, uncomment the INSERT, and run.
