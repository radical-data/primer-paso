# ADR 019: Allow audited organisation corrections during certificate review

## Status

Accepted

## Date

2026-05-06

## Context

Certificate drafts are prepared in the public Primer Paso service and handed off
to a collaborating organisation for review.

During an in-person review, the applicant may have entered incorrect,
incomplete, or poorly formatted data. The organisation must be able to correct
that data before approving the certificate for digital signature.

However, the original applicant draft remains important evidence of what was
submitted through the public service. The organisation must not silently mutate
that original draft.

This decision builds on:

- ADR 014: token-based certificate handoff
- ADR 016: certificate issuance belongs to the organisation portal
- ADR 018: authenticated organisation review before certificate issue

## Decision

The organisation portal will allow controlled correction of certificate draft
data during review.

The original applicant draft is immutable and remains stored as
`draft_snapshot`.

Organisation-side corrections are applied only to `reviewed_data`.

Every correction stores:

- field path
- previous value
- corrected value
- correction type
- optional note
- correcting member
- timestamp

Correction types are structured rather than free-text by default:

- `typo`
- `confirmed_with_applicant`
- `document_verified`
- `standardised_format`
- `other`

Free-text notes are optional and should be used only when the structured
correction type is insufficient.

Any correction resets review verification and returns the review to
`in_review`. Verification must confirm the current reviewed data, not an older
version of the data.

Corrections are allowed only while the review is in `in_review`.

Issued certificates are generated from `reviewed_data`, never directly from
`draft_snapshot`.

## Consequences

The product supports real-world in-person interview workflows while preserving
the boundary between applicant-submitted data and organisation-confirmed data.

The organisation takes responsibility for corrected data by applying changes
inside an authenticated, role-checked, audited review workflow.

The review UI must expose when fields differ from the original draft.

The database and repository layer must preserve correction history rather than
only storing the latest reviewed state.

Verification becomes tied to the reviewed data version. If the reviewed data is
changed, previous verification is no longer valid.

## Alternatives considered

### Mutate the original draft

Rejected because it destroys provenance and weakens the audit trail.

### Do not allow corrections

Rejected because it does not match in-person review reality and would lead to
known errors being carried into issued certificates.

### Require free-text correction reasons for every change

Rejected because most correction reasons are low-signal in practice. Structured
correction types are faster, more consistent, and easier to audit.

## Review trigger

Review this decision if legal guidance requires stronger evidence capture,
separate signer review, attachment support, or tamper-evident audit storage.
