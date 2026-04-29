# ADR 016: Certificate issuance belongs to the organisation portal

## Status

Accepted

## Date

2026-04-25

## Context

The public Primer Paso service can help people prepare information for a vulnerability certificate, but it is not a certifying organisation and must not present itself as issuing or accrediting vulnerability.

The certificate template requires data from the certifying entity and includes a signature and seal area. The organisation must review and confirm the information before issuing the document.

In practice, some organisations may allow the same volunteer to review and sign. Others may require an intake volunteer to prepare the record and a separate authorised signer to issue it.

## Decision

The public app prepares certificate drafts only.

The organisation portal owns:

- organisation account setup
- volunteer/member roles
- opening handoff drafts
- reviewing and correcting draft data
- recording verification confirmations
- issuing the final certificate
- generating audit events
- delivering or exporting the issued PDF

The system will support both:

- a single-actor mode where an authorised volunteer reviews and issues
- a two-step mode where an intake volunteer prepares and an authorised signer issues

## Consequences

- user-facing copy must distinguish drafts from issued certificates
- the public app must not describe the user flow as generating a valid certificate
- issued certificate records need organisation and actor attribution
- the organisation portal must enforce authorisation before issuing certificates

## Alternatives considered

### Public app issues certificates directly

This was not chosen because the public app is not the certifying entity and does not verify the supporting information.

## Review trigger

Review if legal or operational guidance changes who may issue, seal, or sign certificates.
