-- Event steps on a plan: a stop that IS an external event (Luma first).
--
-- Until now every plan_stop (015) was a "place" - a verified NomadSpace or a
-- dropped pin you pick on the map. Lots of Istanbul nomad meetups live on Luma
-- (lu.ma), so we let a host paste a lu.ma link and have that event become a
-- stop: title, venue, and start/end time are read from the event's public page
-- (schema.org JSON-LD) at save time and snapshotted here.
--
-- This is built provider-agnostic on purpose (event_provider) so Eventbrite /
-- Meetup / etc. can slot in later without another migration. For an event step:
--   - step_kind = 'event', event_provider = 'luma', event_url set
--   - start_time / end_time reuse the existing HH:MM columns (Istanbul-local,
--     converted from the event), so card rendering + expiry (016/expiry.ts)
--     keep working untouched
--   - custom_location holds the venue name, lat/lng the venue geo when Luma
--     exposes it, so the existing location handling still applies
--   - event_starts_at / event_ends_at keep the full tz-aware instants for
--     future-proofing and re-validation
-- A 'place' stop leaves all event_* columns null, exactly as before.

alter table plan_stops
  add column if not exists step_kind text not null default 'place'
    check (step_kind in ('place', 'event')),
  add column if not exists event_provider text
    check (event_provider is null or event_provider in ('luma')),
  add column if not exists event_url text
    check (event_url is null or char_length(event_url) <= 500),
  add column if not exists event_title text
    check (event_title is null or char_length(event_title) <= 200),
  add column if not exists event_cover_url text
    check (event_cover_url is null or char_length(event_cover_url) <= 1000),
  add column if not exists event_starts_at timestamptz,
  add column if not exists event_ends_at timestamptz;

-- An event step must carry a provider + url; a place step must not.
alter table plan_stops drop constraint if exists plan_stops_event_shape;
alter table plan_stops add constraint plan_stops_event_shape check (
  (step_kind = 'event' and event_provider is not null and event_url is not null)
  or (step_kind = 'place' and event_provider is null and event_url is null)
);
