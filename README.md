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

The organisation portal uses Supabase Auth magic links. It is not open registration:
the email must already exist in `organisation_members`, and the same address must
be able to sign in via your Supabase project.

For local testing, set:

```sh
PRIVATE_DATABASE_URL=postgres://primer_paso:primer_paso@localhost:5432/primer_paso
PUBLIC_CERTIFICATE_HANDOFF_ENABLED=true
PUBLIC_ORG_PORTAL_URL=http://localhost:5174
PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
PUBLIC_SUPABASE_ANON_KEY=your-anon-key
PRIVATE_ORG_PORTAL_CUSTOM_SMTP_CONFIGURED=false
```

Configure the Supabase redirect URL for magic links to include
`http://localhost:5174/auth/callback` (or your dev portal origin). For deployed
environments, set `PRIVATE_ORG_PORTAL_CUSTOM_SMTP_CONFIGURED=true` and use custom
SMTP in the Supabase dashboard.

See `docs/supabase-org-auth.md` for the Supabase dashboard setup.

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

Use any of those emails on the organisation portal sign-in page; Supabase will
send a sign-in link if the project is configured.

## Supabase Auth setup for the organisation portal

The organisation portal uses Supabase Auth for email magic-link sign-in, then maps
the authenticated Supabase user email to an active row in `organisation_members`.
Supabase authenticates the inbox. Primer Paso still owns organisation membership,
roles, and permissions.

### 1. Authentication -> URL Configuration

Set:

```txt
Site URL: https://org.primerpaso.org
Redirect URL: https://org.primerpaso.org/auth/callback
```

Add preview and local callback URLs as needed, for example:

```txt
http://localhost:5174/auth/callback
```

Only add origins you actually use. Avoid wildcard redirects for production.

### 2. Authentication -> Providers -> Email

Enable email sign-ins.

Use the magic-link email flow. The application passes `emailRedirectTo` when it
requests the link, so links should return to:

```txt
/auth/callback
```

The callback exchanges the Supabase auth code for a session and then checks that
the email belongs to an active organisation member.

### 3. Authentication -> Emails -> SMTP Settings

Configure a real SMTP provider before deployed use. Do not rely on Supabase's
default email service for production or previews.

Set this only after SMTP is configured and tested:

```sh
PRIVATE_ORG_PORTAL_CUSTOM_SMTP_CONFIGURED=true
```

For local development against a hosted Supabase project, this can stay false:

```sh
PRIVATE_ORG_PORTAL_CUSTOM_SMTP_CONFIGURED=false
```

### 4. Security settings

Recommended Supabase project settings for this repository:

- Enable Data API: optional. The current app does not need it for server-side
  database access, because it uses the Postgres connection directly.
- Automatically expose new tables and functions: disable.
- Enable automatic RLS: enable.

Even if the Data API is not used now, keeping RLS enabled by default is a useful
defence against future accidental exposure.

### SMTP provider recommendation

Use Postmark for the organisation portal.

It is a better fit for this workflow because the portal sends low-volume,
high-trust transactional email where deliverability and clear operational
debugging matter more than marketing features. Resend is also good, especially
for developer experience, but Postmark is the safer default for magic-link auth
emails in a public-interest service.

Basic setup:

1. Create a Postmark account.
2. Add and verify the sending domain, for example `primerpaso.org`.
3. Add the DNS records Postmark gives you for SPF, DKIM, and return-path/bounce
   handling.
4. Create a server/message stream for transactional email.
5. Copy the SMTP host, port, username, and password into Supabase:
   Authentication -> Emails -> SMTP Settings.
6. Send a test magic link from the organisation portal.
7. Set `PRIVATE_ORG_PORTAL_CUSTOM_SMTP_CONFIGURED=true` in deployed environments.
