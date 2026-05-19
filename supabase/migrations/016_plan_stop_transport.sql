-- Multi-stop plans now capture how the host moves between stops.
-- transport_* fields describe how the host gets TO this stop from the
-- previous stop (i.e. they describe the leg ending at this stop).
-- The first stop (ordinal=1) has no previous and these stay null.

alter table plan_stops add column if not exists transport_mode text
  check (
    transport_mode is null
    or transport_mode in (
      'ferry','metro','bus','taxi','shared_uber','walk','bike','tram','minibus'
    )
  );

alter table plan_stops add column if not exists transport_price_min int
  check (transport_price_min is null or transport_price_min >= 0);

alter table plan_stops add column if not exists transport_price_max int
  check (transport_price_max is null or transport_price_max >= 0);

-- Sanity: max >= min when both present.
alter table plan_stops drop constraint if exists plan_stops_transport_price_range_check;
alter table plan_stops add constraint plan_stops_transport_price_range_check
  check (
    transport_price_min is null
    or transport_price_max is null
    or transport_price_max >= transport_price_min
  );
