-- Same rationale as 022: /members/[id] is a public profile and needs
-- to aggregate past plans + neighborhood passport + people met. The
-- existing plans / plan_stops policies are 'authenticated only',
-- which empties the join.
--
-- Open read on plans + plan_stops for active/expired (visible) rows.
-- Cancelled plans stay private since they're noisy and the host may
-- prefer not to advertise them publicly.

drop policy if exists "plans read public" on plans;
create policy "plans read public" on plans for select
  to anon, authenticated using (status in ('active', 'expired'));

drop policy if exists "stops read public" on plan_stops;
create policy "stops read public" on plan_stops for select
  to anon, authenticated using (
    exists (
      select 1 from plans p
      where p.id = plan_stops.plan_id
        and p.status in ('active', 'expired')
    )
  );
