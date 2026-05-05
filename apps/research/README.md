# Primer Paso Research

Astro + Starlight site for Primer Paso Research.

This site is for public research notes, process analysis, and civic-tech critique. It is not the applicant-facing public service and it is not the organisation portal.

## Boundaries

- `primerpaso.org`: applicant-facing public service
- `org.primerpaso.org`: authenticated organisation workflow
- `research.primerpaso.org`: research, rationale, and public learning

Organisation portal usage help should live in the organisation portal itself, close to the task it supports.

## Commands

Run from the repository root:

```sh
pnpm --filter @primer-paso/research dev
pnpm --filter @primer-paso/research build
pnpm --filter @primer-paso/research typecheck
```

## Content

Content lives in `src/content/docs`.
