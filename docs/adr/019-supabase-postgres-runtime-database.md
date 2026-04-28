# ADR 019: Use Supabase Postgres as the runtime database

## Status

Accepted

## Date

2026-04-28

## Context

Primer Paso already uses Supabase Auth for the organisation portal.

The project also needs hosted Postgres for certificate handoff records, organisation
members, review workflow state, issued certificates, audit events, and auth rate
limits.

The codebase already has:

- SQL migrations in `packages/db/migrations`
- a repository package in `packages/db`
- SvelteKit server-first forms
- explicit organisation role and permission checks
- server-only database access through `PRIVATE_DATABASE_URL`

Moving runtime Postgres hosting to Supabase simplifies operations without requiring
the application data model to move to Supabase's generated Data API.

## Decision

Primer Paso will use Supabase Postgres as the hosted runtime database.

Application data access remains server-only through `@primer-paso/db` and the
`postgres` package.

The deployed apps should use Supabase's pooled Postgres connection string through:

```txt
PRIVATE_DATABASE_URL
```

For Netlify/serverless deployments, the preferred runtime URL is the Supabase
transaction pooler URL.

The repo will keep its existing migration runner:

```sh
pnpm db:migrate
```

This PR does not introduce Supabase CLI-managed database migrations.

## Consequences

- Supabase becomes the managed Postgres provider.
- Existing migrations and repository code continue to work.
- Runtime secrets stay private and server-only.
- Certificate handoff and organisation portal storage use the same database.
- The app avoids exposing certificate, review, organisation, and audit tables through
  the Supabase Data API in this phase.
- A later PR may introduce Supabase CLI migrations, but that should be a deliberate
  migration-system change rather than part of this low-risk runtime move.

## Alternatives considered

### Use `supabase-js` for application data

Not chosen for this phase. The current server-first repository model is simpler for
sensitive certificate workflow data, audit events, transactions, and organisation
permission checks.

### Convert to Supabase CLI migrations immediately

Not chosen for this phase. The repo already has a working migration table and runner.
Converting migration systems would add risk without being necessary to use Supabase
as the runtime database.

### Keep a separate hosted Postgres provider

Not chosen because Supabase is already used for Auth, and using Supabase Postgres
reduces operational surface area.

## Review trigger

Review this decision if:

- client-side realtime organisation dashboards are introduced
- Supabase Storage becomes part of certificate delivery
- the team wants Supabase branching or CLI-managed migrations
- RLS-backed browser data access becomes a deliberate product requirement
