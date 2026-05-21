-- Migration 027: on-demand short links
-- Backs the "Share" button: each share creates-or-reuses a short code that
-- redirects (/s/{code}) to a canonical entity path. Created lazily, never
-- auto-generated, so the table only holds links someone actually shared.
--
-- Access model: all reads (redirect resolution) and writes (share creation)
-- go through server routes using the service-role client. RLS is ENABLED with
-- NO policies, which denies all anon/auth client access - the table is only
-- reachable server-side. No PII beyond an optional creator reference.

CREATE TABLE IF NOT EXISTS short_links (
  code        text PRIMARY KEY,
  kind        text NOT NULL CHECK (kind IN ('member', 'plan', 'paperwork', 'guide', 'blog')),
  entity_id   text NOT NULL,
  target_path text NOT NULL,
  created_by  uuid REFERENCES members(id) ON DELETE SET NULL,
  click_count integer NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- One short link per (kind, entity) so re-sharing the same thing reuses
-- the same code instead of minting a new one each time.
CREATE UNIQUE INDEX IF NOT EXISTS short_links_kind_entity_idx
  ON short_links (kind, entity_id);

ALTER TABLE short_links ENABLE ROW LEVEL SECURITY;
-- Intentionally no policies: service-role routes only.
