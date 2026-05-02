# ADR 014: Use token-based handoff for certificate drafts

## Status

Accepted

## Date

2026-04-25

## Context

The vulnerability certificate workflow needs to let a person prepare draft information in the public service and bring it to a collaborating organisation for review.

The handoff may involve sensitive personal information, including identity details, contact details, location information, and vulnerability circumstances.

QR codes are useful for in-person handoff, but storing the full sensitive payload inside the QR code would make the QR itself a portable sensitive record.

## Decision

Certificate handoff QR codes will encode the canonical organisation handoff URL carrying a high-entropy opaque token, not the full certificate data.

The QR code and visible organisation handoff link encode the same high-entropy opaque token URL.

The human-readable reference code is not an access credential and must not be usable to open a certificate draft. It exists only as a support identifier.

We are intentionally not implementing reference-code lookup in the pilot because it would create a lower-entropy second access path requiring additional rate limiting, enumeration protection, audit review, support procedures, and ongoing maintenance.

The certificate draft data will be stored server-side with an expiry time and accessed only through the organisation portal after authentication and authorisation checks.

The token must be:

- high entropy
- stored hashed server-side
- time-limited
- revocable where practical
- scoped to the certificate handoff purpose
- excluded from logs where practical

## Consequences

- handoff drafts can expire
- handoff drafts can be revoked or cancelled
- access can be audited
- user data can be corrected before issuing the certificate
- the organisation portal can enforce role-based access before showing sensitive data
- the system now needs a persistence layer for certificate drafts

## Alternatives considered

### Encrypted data inside the QR code

This was not chosen as the default because copied QR codes would remain sensitive objects, revocation would be weaker, correction would be harder, and audit would be less complete.

## Review trigger

Review if field conditions make server-side handoff impossible or if a legal/security review recommends a different data-transfer mechanism.
