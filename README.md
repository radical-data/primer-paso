# Primer Paso

A SvelteKit app for a multilingual, server-first intake screener for Spain's 2026 extraordinary regularisation process.

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

## Checks

```sh
pnpm run check
pnpm run typecheck
pnpm test
```

## Build

```sh
pnpm build
pnpm preview
```

## Project shape

- src/routes — journey pages, check answers, result, handover
- src/lib/journey — step config, field adapters, shared types
- src/lib/triage — triage engine and result types
- src/lib/server — cookie-backed journey state
- src/lib/content — message content
- docs/ — design spec, journey, triage rules, ADRs

## Notes

- the core flow uses standard HTML forms and SvelteKit form actions
- the app is configured for Netlify deployment
- this service is triage, not a legal determination
