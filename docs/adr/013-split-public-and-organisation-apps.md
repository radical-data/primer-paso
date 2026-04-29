# ADR 013: Split the public service and organisation portal into separate apps

## Status

Accepted

## Date

2026-04-25

## Context

Primer Paso is expanding beyond a public intake screener to support preparation of vulnerability certificate drafts and authenticated review by collaborating organisations.

The existing public service is deliberately low-friction, unauthenticated, multilingual, and focused on triage and preparation. The organisation workflow has a different risk profile: it needs organisation accounts, volunteer roles, certificate review, issuance, audit logs, and stronger access control.

Keeping both flows inside one SvelteKit app would make the public service carry organisation-portal security and operational complexity.

## Decision

The repository will become a pnpm monorepo with separate applications:

- `apps/public` for the public Primer Paso service
- `apps/org-portal` for the authenticated organisation portal

Shared domain code will live under `packages/*` where it is needed by more than one app.

The current app will move to `apps/public` without product behaviour changes.

## Consequences

- the public app can remain lightweight and unauthenticated
- the organisation portal can be hardened independently
- deployment can target separate sites, such as `primerpaso.org` and `org.primerpaso.org`
- shared contracts such as certificate schemas can be reused without duplicating code
- CI and local development need workspace-aware commands

## Alternatives considered

### Single SvelteKit app with organisation routes

This was not chosen because the public flow and organisation workflow have materially different users, access-control rules, session behaviour, audit requirements, and security posture.

### Separate repositories

This was not chosen for now because the two apps need to share certificate models, translation/content conventions, UI patterns, and possibly organisation types. A monorepo keeps those contracts easier to evolve together.

## Review trigger

Review if the organisation portal becomes operationally independent enough to justify a separate repository, or if deployment constraints make the monorepo materially harder to maintain.
