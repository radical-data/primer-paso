# Supabase Postgres runtime database

## Purpose

Primer Paso uses Supabase as the managed Postgres runtime database.

This does not move application data access to `supabase-js`.

The application still uses:

- `packages/db/migrations`
- `@primer-paso/db`
- `postgres`
- SvelteKit server actions and server load functions

Supabase is the hosted Postgres provider and Supabase Auth provider.

## Runtime connection string

Use `PRIVATE_DATABASE_URL` for runtime database access.

For Netlify deploys, use the Supabase **Transaction pooler** connection string:

```txt
postgresql://postgres.<project-ref>:<database-password>@aws-0-<region>.pooler.supabase.com:6543/postgres?sslmode=require
```

Do not use a browser/public key for database access.

Do not expose this value through any `PUBLIC_*` environment variable.

## Why the transaction pooler

Netlify functions are serverless. They create many short-lived runtime contexts rather
than a single long-lived application server.

The transaction pooler is the safest default for this deployment model because it
reduces direct Postgres connection pressure.

The repository code already avoids session-specific Postgres features:

- no prepared statements
- no temporary tables
- no session-level `set search_path`
- explicit SQL transactions where multi-step writes need atomicity

The `postgres` client is configured with:

```ts
prepare: false,
max: 1
```

Keep that default for Netlify unless there is a measured reason to change it.

## Environment variables

Required for certificate handoff and organisation portal storage:

```sh
PRIVATE_DATABASE_URL=
```

Required for Supabase Auth in the organisation portal:

```sh
PUBLIC_SUPABASE_URL=
PUBLIC_SUPABASE_PUBLISHABLE_KEY=
PRIVATE_ORG_PORTAL_CUSTOM_SMTP_CONFIGURED=true
```

Required when enabling certificate handoff:

```sh
PUBLIC_CERTIFICATE_HANDOFF_ENABLED=true
PUBLIC_ORG_PORTAL_URL=https://org.primerpaso.org
```

## Local setup

Create a local `.env` from `.env.example` and set:

```sh
PRIVATE_DATABASE_URL="<supabase-transaction-pooler-url>"
PUBLIC_CERTIFICATE_HANDOFF_ENABLED=true
PUBLIC_SUPABASE_URL="<supabase-project-url>"
PUBLIC_SUPABASE_PUBLISHABLE_KEY="<supabase-publishable-key>"
PRIVATE_ORG_PORTAL_CUSTOM_SMTP_CONFIGURED=false
PRIVATE_ORG_PORTAL_ENVIRONMENT=local
```

Then run:

```sh
pnpm db:migrate
pnpm db:seed:local-org-portal
pnpm check:db-runtime
pnpm check:org-env
pnpm check:analytics-env
pnpm typecheck
pnpm test
```

The seed script creates local organisation-member records in Postgres only. It does
not create Supabase Auth users manually. Organisation users are created by Supabase
Auth when an allow-listed email requests a magic link.

## Netlify setup

Set `PRIVATE_DATABASE_URL` separately for each Netlify context:

- Production
- Deploy previews
- Branch deploys

Recommended:

- production uses the production Supabase project
- deploy previews and branch deploys use a separate non-production Supabase project
- do not point previews at production personal data

For the organisation portal, deployed environments must also set:

```sh
PRIVATE_ORG_PORTAL_ENVIRONMENT=preview
PRIVATE_ORG_PORTAL_CUSTOM_SMTP_CONFIGURED=true
```

or:

```sh
PRIVATE_ORG_PORTAL_ENVIRONMENT=production
PRIVATE_ORG_PORTAL_CUSTOM_SMTP_CONFIGURED=true
```

## Migration rule

This repo does not use Supabase CLI migrations in this phase.

Use the existing migration runner:

```sh
pnpm db:migrate
```

This writes to this repo's existing `schema_migrations` table.

Do not run `supabase db push` for these migrations unless a later PR explicitly
converts the repo to Supabase CLI-managed migrations.

## Smoke test

After migrating and seeding, run:

```sh
pnpm check:db-runtime
```

Expected output should include:

```txt
Database runtime check passed.
```

Then complete the manual smoke:

1. Start the public app.
2. Create a certificate draft.
3. Consent to handoff.
4. Confirm a handoff token is created.
5. Start the organisation portal.
6. Sign in with a seeded organisation member email.
7. Open the handoff.
8. Mark the review ready to issue.
9. Issue and download the PDF.

## Rollback

To roll back the runtime database change:

1. Set `PRIVATE_DATABASE_URL` back to the previous Postgres database.
2. Run `pnpm db:migrate` against that database.
3. Disable handoff with `PUBLIC_CERTIFICATE_HANDOFF_ENABLED=false` if storage is not ready.
