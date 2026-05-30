-- Plan reviews: let a nomad who actually attended a plan rate it after it ends.
-- One review per attendee (editable), with a 1-5 star rating, a "would you go
-- again?" recommend flag, and optional free text. Hosts can't review their own
-- plan. Aggregates (average + count) power a badge on plan cards and the detail
-- page. The "trips" equivalent will follow the same shape later.

create table if not exists plan_reviews (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null references plans(id) on delete cascade,
  author_id uuid not null references members(id) on delete cascade,
  rating smallint not null check (rating between 1 and 5),
  would_return boolean not null,
  body text check (body is null or char_length(body) <= 1000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (plan_id, author_id)
);

create index if not exists idx_plan_reviews_plan on plan_reviews (plan_id);

-- ---------- updated_at trigger ----------
create or replace function set_plan_review_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists trg_plan_reviews_updated_at on plan_reviews;
create trigger trg_plan_reviews_updated_at
  before update on plan_reviews
  for each row execute function set_plan_review_updated_at();

-- ---------- RLS ----------
alter table plan_reviews enable row level security;

-- read: any authed user (so averages can render on the feed + detail)
drop policy if exists "reviews read authed" on plan_reviews;
create policy "reviews read authed" on plan_reviews for select
  to authenticated using (true);

-- insert: only the author, only if they're a going attendee, and only once the
-- plan has ended. The host can't review their own plan.
drop policy if exists "reviews insert eligible" on plan_reviews;
create policy "reviews insert eligible" on plan_reviews for insert
  to authenticated with check (
    author_id = auth.uid()
    and exists (
      select 1 from plans p
      where p.id = plan_reviews.plan_id
        and p.creator_id <> auth.uid()
        and p.expires_at < now()
    )
    and exists (
      select 1 from plan_attendees a
      where a.plan_id = plan_reviews.plan_id
        and a.member_id = auth.uid()
        and a.status = 'going'
    )
  );

-- update: author only, same eligibility guard
drop policy if exists "reviews update own" on plan_reviews;
create policy "reviews update own" on plan_reviews for update
  to authenticated
  using (author_id = auth.uid())
  with check (
    author_id = auth.uid()
    and exists (
      select 1 from plans p
      where p.id = plan_reviews.plan_id
        and p.creator_id <> auth.uid()
        and p.expires_at < now()
    )
    and exists (
      select 1 from plan_attendees a
      where a.plan_id = plan_reviews.plan_id
        and a.member_id = auth.uid()
        and a.status = 'going'
    )
  );

-- delete: author only (the host can NOT delete reviews of their own plan)
drop policy if exists "reviews delete own" on plan_reviews;
create policy "reviews delete own" on plan_reviews for delete
  to authenticated using (author_id = auth.uid());
