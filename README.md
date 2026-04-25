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
