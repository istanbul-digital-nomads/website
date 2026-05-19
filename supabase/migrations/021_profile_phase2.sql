-- Profile Phase 2 (3.13.0): the "fun and good" pass.
--
-- Adds stay-window dates + a free-text favorite_spots array. Profile
-- page additionally derives 3 sections from existing tables (past
-- plans, neighborhood passport, people you've met) - those don't need
-- schema changes, just queries on top of plan_attendees + plan_stops.

alter table members add column if not exists move_in_date date;
alter table members add column if not exists planned_move_out_date date;
alter table members add column if not exists favorite_spots text[];

alter table members drop constraint if exists members_favorite_spots_size_check;
alter table members add constraint members_favorite_spots_size_check check (
  favorite_spots is null
  or (array_length(favorite_spots, 1) is null or array_length(favorite_spots, 1) <= 12)
);

-- planned_move_out_date should be after move_in_date when both set.
alter table members drop constraint if exists members_stay_dates_order_check;
alter table members add constraint members_stay_dates_order_check check (
  move_in_date is null
  or planned_move_out_date is null
  or planned_move_out_date >= move_in_date
);

comment on column members.move_in_date is
  'When the member landed in (or plans to land in) Istanbul. Drives the "Here for X more weeks" pip on profile.';

comment on column members.planned_move_out_date is
  'When the member plans to leave Istanbul. Soft commitment - members can update it any time. Pairs with move_in_date.';

comment on column members.favorite_spots is
  'Free-text chip list of the member''s favorite spots in Istanbul. Cap 12 entries. Not constrained to verified spaces - members can write whatever.';
