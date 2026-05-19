-- Phase 1 (PRODUCT.md): member roles operationalised.
--
-- Repurposes the existing `members.member_type` column. It used to hold a
-- descriptive self-id (expat / digital-nomad / traveler / local /
-- student / other) collected in the onboarding wizard. From 3.9.0 it
-- holds the operational role that drives what a member can do on the
-- platform:
--
--   nomad         - default for everyone
--   remote_worker - same plumbing as nomad, different profile framing +
--                   marketing CTAs
--   local_guide   - can host ticketed plans (after Phase 3 verification)
--   tour_guide    - same as local_guide + license credential
--   agent         - visa / govt-office / ikamet specialist; admin-vibe
--                   plans
--
-- Existing descriptive values are migrated to the operational role that
-- maps most cleanly to their behaviour today. Nobody loses access; the
-- self-id information was only used to collapse to a binary 'guide'
-- check in `today/types.ts`, which we preserve.
--
-- Additional columns:
--   professional_role        - free-text "what do you do" (for
--                              remote_worker profile framing)
--   tour_guide_license_no    - nullable, only set when member_type =
--                              tour_guide; manual organizer review until
--                              Phase 3 issues a Blue badge
--   xp                       - engagement counter; schema lands now,
--                              increments come in Phase 5

-- ---------- 1. Normalise existing member_type values ----------

update members set member_type = case
  when member_type = 'guide' then 'local_guide'
  when member_type = 'local-internationally-minded' then 'local_guide'
  when member_type in ('expat','traveler','student','digital-nomad','nomad','other') then 'nomad'
  when member_type is null then null
  else 'nomad'
end;

-- ---------- 2. CHECK constraint enforcing the 5 roles ----------

-- Drop any pre-existing constraint that might have been added by an
-- earlier ad-hoc migration. `if exists` keeps this safe to re-run.
alter table members drop constraint if exists members_member_type_check;

alter table members add constraint members_member_type_check
  check (member_type is null or member_type in (
    'nomad', 'remote_worker', 'local_guide', 'tour_guide', 'agent'
  ));

-- ---------- 3. New columns ----------

alter table members add column if not exists professional_role text
  check (professional_role is null or char_length(professional_role) <= 120);

alter table members add column if not exists tour_guide_license_no text
  check (tour_guide_license_no is null or char_length(tour_guide_license_no) <= 60);

alter table members add column if not exists xp integer not null default 0
  check (xp >= 0);

-- ---------- 4. Index for the /members role filter ----------

-- Hot path: SELECT ... FROM members WHERE is_visible AND member_type = ?
-- ORDER BY display_name. The existing index on (is_visible, display_name)
-- (added in 002 or 003) handles the broad case; a partial index on
-- member_type for visible members keeps the role-filtered directory cheap
-- once we have thousands of rows.
create index if not exists members_visible_role_idx
  on members (member_type)
  where is_visible = true and onboarding_completed = true;

-- ---------- 5. Trigger to clear tour_guide_license_no on role change ----------

-- If a member's role changes away from tour_guide, the license field is
-- meaningless. Same for professional_role on roles other than
-- remote_worker - keep it informational only when it's relevant.

create or replace function members_role_consistency()
returns trigger as $$
begin
  if new.member_type is distinct from 'tour_guide' then
    new.tour_guide_license_no := null;
  end if;
  -- professional_role intentionally NOT cleared on role change - members
  -- may switch from remote_worker to local_guide while keeping their
  -- "what I do for a living" line, so we let the UI manage it.
  return new;
end;
$$ language plpgsql;

drop trigger if exists members_role_consistency_trg on members;
create trigger members_role_consistency_trg
  before insert or update of member_type on members
  for each row execute function members_role_consistency();

-- ---------- 6. Comments for documentation ----------

comment on column members.member_type is
  'Operational role - one of nomad, remote_worker, local_guide, tour_guide, agent. Drives plan-creation permissions and profile framing. Self-id from the old onboarding wizard was migrated in 017.';

comment on column members.professional_role is
  'Free-text "what do you do" for remote_worker profile framing. Optional, max 120 chars.';

comment on column members.tour_guide_license_no is
  'Turkish tourism guide license number. Only meaningful when member_type = tour_guide. Cleared automatically when role changes.';

comment on column members.xp is
  'Engagement counter. Increments come in Phase 5 (XP + badges). Schema only in Phase 1.';
