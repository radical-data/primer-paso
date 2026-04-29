# ADR 018: Use authenticated organisation review before certificate issue

## Status

Accepted

## Date

2026-04-26

## Context

Primer Paso now supports certificate draft handoff from the public service to a collaborating organisation.

The handoff contains sensitive personal information, including identity details, contact details, address information, and vulnerability circumstances. The public service prepares a draft only. It does not issue a certificate.

The organisation portal has a different security and operational profile from the public service. It needs organisation users, role-based access, verification confirmations, audit history, and eventually certificate issue.

## Decision

The organisation portal will require authentication before any certificate draft can be viewed.

Certificate handoff tokens will remain opaque references. A token can be opened only by an authenticated organisation member with permission to open handoffs.

The portal will use Supabase Auth magic links for user authentication, with SSR
cookie handling through `@supabase/ssr`. The application still resolves every
authenticated Supabase user against `organisation_members` before granting portal
access, so Supabase Auth is not treated as open registration for the portal.

The organisation workflow will use explicit role-to-permission checks. The first roles are:

- `admin`
- `audit_viewer`
- `intake_volunteer`
- `authorised_signer`

The first permissions are:

- `handoff:open`
- `handoff:review`
- `certificate:prepare`
- `certificate:issue`
- `audit:read`
- `organisation:manage_members`
- `organisation:manage_profile`

Certificate issue will not be implemented in the first authenticated handoff PR. The first organisation portal milestone stops at authenticated handoff pickup, review, verification confirmations, and `ready_to_issue`.

## Consequences

- public handoff QR codes do not expose sensitive data directly
- draft data is shown only after authentication and authorisation
- sessions can be revoked
- member access can be disabled
- handoff open and review actions can be audited
- Supabase API configuration uses a publishable key, not a legacy anon key name
- the final PDF issue step can be added later without changing the access model
- the portal can support both one-actor and two-step organisation workflows
- the portal can support both one-actor and two-step organisation workflows

## Alternatives considered

### Keep handoff review unauthenticated

This was not chosen because possession of a QR code or link is not enough authority to view sensitive certificate draft data.

### Put encrypted certificate data inside the QR code

This was not chosen because copied QR codes would remain sensitive portable records and revocation/audit would be weaker.

### Issue certificates in the same PR as authenticated review

This was not chosen because issue should depend on an organisation review record, verification confirmations, signer attribution, and audit events.

## Review trigger

Review this decision if legal guidance requires stronger signer controls, if partner organisations require separate caseworker and signer stages, or if the portal needs phishing-resistant authentication before wider deployment.

## References

- ADR 014: Use token-based handoff for certificate drafts
- ADR 016: Certificate issuance belongs to the organisation portal
