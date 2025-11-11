#!/usr/bin/env bash
set -euo pipefail

HOST="${POSTGRES_HOST:-postgres}"
PORT="${POSTGRES_PORT:-5432}"
DB_TO_REFRESH="${POSTGRES_DB:-igor}"
USER="${POSTGRES_USER:-myuser}"
PASSWORD="${POSTGRES_PASSWORD:-mypassword}"

export PGPASSWORD="$PASSWORD"

printf 'Waiting for PostgreSQL at %s:%s to become available...\n' "$HOST" "$PORT"
until pg_isready -h "$HOST" -p "$PORT" -U "$USER" >/dev/null 2>&1; do
  sleep 1
  printf '.'
done
printf '\n'

printf 'Refreshing collation metadata for database "%s"...\n' "$DB_TO_REFRESH"
psql "postgresql://$USER@$HOST:$PORT/postgres" -v ON_ERROR_STOP=1 \
  -c "ALTER DATABASE \"$DB_TO_REFRESH\" REFRESH COLLATION VERSION;"

printf 'Collation refresh completed successfully.\n'
