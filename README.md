# Primer Paso

A pnpm monorepo for a multilingual, server-first intake screener for Spain's 2026 extraordinary regularisation process and related organisation workflows.

## What it does

- guides people through a one-question-per-page journey
- stores progress in a session cookie
- shows a check-answers step before the result
- runs triage rules to produce a cautious next-step outcome
- supports assisted completion and language switching
- uses locale-prefixed URLs for every public route (`/es/...`, `/en/...`, `/fr/...`, `/ar/...`)

## Development

```sh
mise install
mise x -- pnpm install --frozen-lockfile
mise x -- pnpm dev
```

The default `pnpm dev` command runs the public app.

To run apps explicitly:

```sh
pnpm dev:public
pnpm dev:org
```

To check that the analytics environment contract is satisfied:

```sh
mise run analytics:env:check
```

## Checks

```sh
pnpm run check
pnpm run typecheck
pnpm test
```

`pnpm test` loads committed `.env.test` for the public app so Matomo-related unit tests match CI (see `apps/public/package.json` `test` script).

## Build

```sh
pnpm build
pnpm build:public
pnpm preview
```

## Project shape

- apps/public — public Primer Paso service
- apps/org-portal — authenticated organisation portal placeholder
- packages/certificate — shared certificate model and PDF generation package placeholder
- packages/auth — shared role and permission model placeholder
- packages/db — shared persistence package placeholder
- packages/config — shared app configuration placeholder
- packages/ui — shared UI package placeholder
- docs/ — design spec, journey, triage rules, ADRs

## Notes

- the core flow uses standard HTML forms and SvelteKit form actions
- the app is configured for Netlify deployment
- this service is triage, not a legal determination

## Certificate handoff storage

The public certificate handoff flow stores the certificate draft server-side and places
only an opaque token in the handoff URL/QR code.

To enable it:

1. apply `packages/db/migrations/001_certificate_handoffs.sql` to Postgres
2. set `PRIVATE_DATABASE_URL`
3. set `PUBLIC_CERTIFICATE_HANDOFF_ENABLED=true`
4. set `PUBLIC_ORG_PORTAL_URL`

The raw token is never stored. The database stores only a SHA-256 token hash.

## Local organisation portal testing

The organisation portal has a temporary bootstrap login for local and pilot testing.
It is not open registration: the email must already exist in `organisation_members`
and the shared bootstrap code must match `PRIVATE_ORG_PORTAL_LOGIN_CODE`.

For local testing, set:

```sh
PRIVATE_DATABASE_URL=postgres://primer_paso:primer_paso@localhost:5432/primer_paso
PRIVATE_ORG_PORTAL_LOGIN_CODE=test-code
PUBLIC_CERTIFICATE_HANDOFF_ENABLED=true
PUBLIC_ORG_PORTAL_URL=http://localhost:5174
```

Apply the database migrations:

```sh
psql "$PRIVATE_DATABASE_URL" -f packages/db/migrations/001_certificate_handoffs.sql
psql "$PRIVATE_DATABASE_URL" -f packages/db/migrations/002_org_portal_mvp.sql
```

Seed a local collaborating organisation and test users:

```sh
pnpm db:seed:local-org-portal
```

The seed command loads the repository-root `.env` automatically. If you run the
package script directly from `packages/db`, it loads `../../.env`.

Seeded local member emails:

```txt
admin@example.invalid
volunteer@example.invalid
signer@example.invalid
```

Use any of those emails with the value of `PRIVATE_ORG_PORTAL_LOGIN_CODE` on the
organisation portal sign-in page.
