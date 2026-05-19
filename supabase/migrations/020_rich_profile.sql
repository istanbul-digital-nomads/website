-- Phase 4 (PRODUCT.md addendum): rich member profile.
--
-- Adds four new self-id fields to members so the /members/[id] page
-- can render a categorized, nomads-list-style profile: current vibe,
-- what they're working on, what they want to talk about, hobbies.
--
-- Keeps the schema small + opinionated (4 columns, no new tables) so
-- onboarding doesn't bloat past 5 steps. Free-text TEXT[] arrays let
-- members write their own tags rather than constraining them to a
-- fixed taxonomy - the categorization happens at the section header
-- level, not at the field-value level.

alter table members add column if not exists current_status text
  check (current_status is null or current_status in (
    'deep_work',     -- heads-down, no plans for the day
    'open_to_meet',  -- happy to grab coffee
    'exploring',     -- out in the city today
    'settling_in',   -- just arrived, getting set up
    'hosting',       -- running a plan today
    'hibernating'    -- offline, will resurface
  ));

-- Free-text chip arrays. Length caps at the array + element level so
-- nobody writes an essay in a tag.
alter table members add column if not exists working_on text[];
alter table members add column if not exists wants_to_talk_about text[];
alter table members add column if not exists hobbies text[];

-- Soft caps via check (array_length nullable for empty arrays).
alter table members drop constraint if exists members_working_on_size_check;
alter table members add constraint members_working_on_size_check check (
  working_on is null
  or (array_length(working_on, 1) is null or array_length(working_on, 1) <= 8)
);
alter table members drop constraint if exists members_wants_to_talk_size_check;
alter table members add constraint members_wants_to_talk_size_check check (
  wants_to_talk_about is null
  or (array_length(wants_to_talk_about, 1) is null or array_length(wants_to_talk_about, 1) <= 8)
);
alter table members drop constraint if exists members_hobbies_size_check;
alter table members add constraint members_hobbies_size_check check (
  hobbies is null
  or (array_length(hobbies, 1) is null or array_length(hobbies, 1) <= 12)
);

comment on column members.current_status is
  'Member-set vibe pip shown on profile cards + /members directory. Six possible states: deep_work, open_to_meet, exploring, settling_in, hosting, hibernating. Null until the member picks one.';

comment on column members.working_on is
  'Free-text chip list - what they''re building / focused on right now. Cap 8 entries.';

comment on column members.wants_to_talk_about is
  'Free-text chip list - conversation starters they''d enjoy. Cap 8 entries.';

comment on column members.hobbies is
  'Free-text chip list - non-work interests. Cap 12 entries.';

-- Partial index for the directory "currently open to meet" filter
-- (potential future feature - cheap to add now).
create index if not exists members_status_open_idx
  on members (current_status)
  where current_status in ('open_to_meet', 'hosting') and is_visible = true;
