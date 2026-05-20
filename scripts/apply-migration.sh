#!/usr/bin/env bash
# Apply a SQL migration file to the prod Supabase project via the
# Management API. Usage: bash scripts/apply-migration.sh <path-to.sql>
# Reads SUPABASE_ACCESS_TOKEN from .env.local. Project ref is fixed.
set -euo pipefail

MIGRATION_FILE="${1:?usage: apply-migration.sh <path-to.sql>}"
PROJECT_REF="yumymnifjueycgghaqwb"

if [ ! -f "$MIGRATION_FILE" ]; then
  echo "Migration file not found: $MIGRATION_FILE" >&2
  exit 1
fi

# shellcheck disable=SC1091
set -a; source .env.local; set +a

: "${SUPABASE_ACCESS_TOKEN:?SUPABASE_ACCESS_TOKEN not set in .env.local}"

BODY=$(python3 -c "import json,sys;print(json.dumps({'query':open(sys.argv[1]).read()}))" "$MIGRATION_FILE")

echo "Applying $MIGRATION_FILE to project $PROJECT_REF ..."
curl -s -X POST "https://api.supabase.com/v1/projects/$PROJECT_REF/database/query" \
  -H "Authorization: Bearer $SUPABASE_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d "$BODY"
echo
echo "Done."
