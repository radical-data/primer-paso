# ADR 020: Use an internal Python PDF signer for organisation certificate signing

## Status

Accepted

## Date

2026-04-30

## Context

Local/manual PDF signing is a bottleneck for partner organisations issuing
vulnerability certificates.

The organisation portal is TypeScript/SvelteKit, but PAdES PDF signing is better
handled by a specialised PDF signing library. Primer Paso also needs to keep
issuance, authorisation, audit logging, PDF rendering, and storage inside the
organisation portal workflow.

## Decision

The organisation portal will keep issuance, authorisation, audit, PDF rendering,
and storage in TypeScript.

A small internal Python service using pyHanko will sign Primer Paso-generated PDFs
with an organisation PKCS#12 certificate.

For the prototype, organisation signing certificates are added manually, encrypted
with a server-side key, and stored in Postgres.

## Consequences

- partner organisations do not need to sign each PDF locally
- Primer Paso temporarily takes custody of encrypted signing material
- private keys must never be committed, logged, or sent to clients
- production requires a separately deployed PDF signer service
- later work may replace PKCS#12 custody with remote eSeal integration

## Alternatives considered

### Manual local signing only

Not chosen because partners report that local signing is one of the largest
operational bottlenecks.

### Remote eSeal provider first

Not chosen for the prototype because partner onboarding and provider procurement
would likely delay the pilot.

### Reimplement PDF signing in TypeScript

Not chosen because PAdES PDF signing is specialised and pyHanko already provides
a focused implementation.

## Review trigger

Review before wider partner rollout, before onboarding many organisations, or when
a remote eSeal provider is selected.

## References

- ADR 016: Certificate issuance belongs to the organisation portal
- ADR 018: Use authenticated organisation review before certificate issue
- ADR 019: Use Supabase Postgres as the runtime database
