-- Open public read on plan_attendees (going/confirmed only) so
-- /members/[id] - which is publicly reachable - can aggregate the
-- past-plans + neighborhood-passport + people-met sections without
-- requiring sign-in.
--
-- Privacy boundary: members.is_visible is still enforced on the
-- members table, so even if someone queries plan_attendees from anon
-- they only learn member_id <-> plan_id pairs. Resolving those
-- member_ids to names/avatars goes through the members RLS, which
-- only returns is_visible=true rows.

drop policy if exists "attendees read public going" on plan_attendees;
create policy "attendees read public going" on plan_attendees for select
  to anon, authenticated using (status in ('going', 'confirmed'));
