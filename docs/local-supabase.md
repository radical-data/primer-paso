# Local Supabase database

Primer Paso uses Supabase Postgres as the local development database.

The application still accesses project data server-side through `@primer-paso/db`
and the `postgres` package. Supabase CLI is used for the local database, Auth
stack, migration reset flow, and generated database types.

## Requirements

- Node 24, via `mise`
- pnpm 10, via `mise`
- Docker Desktop or a compatible Docker runtime

Install dependencies first:

```sh
mise install
pnpm install
```

## Start local Supabase

```sh
pnpm supabase:start
```

This starts the local Supabase stack, including Postgres, Auth, Studio, and the
local email catcher.

Common local endpoints:

- API: `http://127.0.0.1:54321`
- Postgres: `postgresql://postgres:postgres@127.0.0.1:54322/postgres`
- Studio: `http://127.0.0.1:54323`
- Local email catcher: `http://127.0.0.1:54324`

For database-oriented work, `pnpm supabase:start:minimal` starts a smaller stack
without Studio and other optional services.

## Local `.env`

Use the local Postgres connection string for repository-backed features:

```txt
PRIVATE_DATABASE_PROVIDER=supabase
PRIVATE_DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:54322/postgres
PUBLIC_CERTIFICATE_HANDOFF_ENABLED=true

PRIVATE_ORG_PORTAL_ENVIRONMENT=local
PUBLIC_ORG_PORTAL_URL=http://localhost:5174
PUBLIC_SUPABASE_URL=http://localhost:54321
PUBLIC_SUPABASE_PUBLISHABLE_KEY=<copy from `supabase status`>
PRIVATE_ORG_PORTAL_CUSTOM_SMTP_CONFIGURED=false
```

Use `supabase status` when you need the current local publishable key.

## Reset the local database

```sh
pnpm db:reset
```

This drops and recreates the local database, applies all migrations in
`supabase/migrations`, then runs `supabase/seed.sql`.

Seeded organisation portal members:

- `admin@example.invalid`
- `volunteer@example.invalid`
- `signer@example.invalid`

Use one of these emails on the local organisation portal login page. The magic
link email will appear in the local email catcher. The organisation portal must
be running on `http://localhost:5174` before you open the link.

## Generate database types

```sh
pnpm db:types
```

This writes local Supabase-generated database types to:

```txt
packages/db/src/database.types.ts
```

These types are for schema inspection and future typed Supabase integration. The
current application repository layer still uses explicit domain types.

## Migrations

Canonical migrations live in:

```txt
supabase/migrations
```

Do not add new migrations under `packages/db/migrations`.

For now, deployed migration application still uses:

```sh
pnpm db:migrate
```

That script reads the same canonical files from `supabase/migrations` and applies
them through the existing `schema_migrations` table.
