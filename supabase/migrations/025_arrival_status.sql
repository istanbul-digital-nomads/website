-- Onboarding refinement: capture where a member is in their move to
-- Istanbul. The role step is trimmed to nomad vs remote_worker (guides
-- and agents sign up through separate forms), so we add a small arrival
-- signal instead: are they already here, elsewhere in Turkey, or still
-- planning the move? Drives "who's actually around right now" framing.
--
--   in_istanbul     -> living in Istanbul now
--   elsewhere_turkey -> in Turkey, not Istanbul yet
--   planning         -> outside Turkey, planning to come
--
-- Nullable + free of a CHECK constraint so older rows and future
-- options don't break; the app validates the value set.

ALTER TABLE members
  ADD COLUMN IF NOT EXISTS arrival_status TEXT;

COMMENT ON COLUMN members.arrival_status IS
  'Move-to-Istanbul stage: in_istanbul | elsewhere_turkey | planning';
