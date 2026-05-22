-- Migration 028: Telegram notification preferences + per-member locale
-- Adds a master switch + per-category toggles so members control which
-- Telegram DMs they receive, and a preferred_locale so notifications are
-- rendered in the recipient's language. Defaults are `true`/`'en'` so a
-- member who connects their Telegram gets notifications without extra setup;
-- the master switch (notify_telegram) gates everything.

ALTER TABLE members
  ADD COLUMN IF NOT EXISTS notify_telegram      boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS notify_plan_activity boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS notify_comments      boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS notify_tickets       boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS notify_events        boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS notify_reminders     boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS preferred_locale     text    NOT NULL DEFAULT 'en';
