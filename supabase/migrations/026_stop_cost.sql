-- Migration 026: per-stop cost range
-- Adds optional cost_min_cents / cost_max_cents to plan_stops so hosts
-- can tell attendees how much to expect to spend at each individual stop
-- (separate from the plan-level budget_per_person_*_cents which covers
-- the whole day).

ALTER TABLE plan_stops
  ADD COLUMN IF NOT EXISTS cost_min_cents integer CHECK (cost_min_cents >= 0),
  ADD COLUMN IF NOT EXISTS cost_max_cents integer CHECK (cost_max_cents >= 0);

-- Sanity: max must be >= min when both are set.
ALTER TABLE plan_stops
  ADD CONSTRAINT plan_stops_cost_range_check
    CHECK (cost_max_cents IS NULL OR cost_min_cents IS NULL OR cost_max_cents >= cost_min_cents);
