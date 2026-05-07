# ADR 021: Support organisation-created certificate reviews

## Status

Accepted

## Date

2026-05-07

## Context

The certificate workflow currently assumes that certificate data starts in the
public Primer Paso service and reaches the organisation portal through a token
handoff.

In real organisation workflows, an applicant may instead arrive with their
documents and complete the certificate intake directly with a volunteer or staff
member. This can happen in person, by phone, or through an authorised
representative. In those cases, requiring the applicant to use the public handoff
flow first would add friction and duplicate data entry.

This is also an adoption constraint. Collaborating organisations are not yet
routinely using the platform, and a workflow that requires them to change their
frontline intake process is harder to trial. Many organisations already have an
established pattern: the applicant turns up with documents, and a volunteer fills
in the required information with them. Supporting organisation-created reviews
lets the portal fit that existing pattern first.

The strategic aim is to make first adoption easier by improving the workflow
organisations already recognise, rather than asking them to reorganise around the
public handoff flow immediately. Once organisations are using the portal for
certificate preparation and issue, the public handoff flow can be introduced as
an additional improvement that reduces repeated entry and prepares better data in
advance.

At the same time, organisation-created certificate records must preserve the same
product boundaries as public handoffs:

- Primer Paso does not issue certificates from the public app.
- The organisation portal owns review, verification, issue, audit, and signing.
- Issued certificates must be generated from reviewed data.
- Applicant data-use confirmation must be explicit and auditable.

This decision builds on:

- ADR 014: token-based certificate handoff
- ADR 016: certificate issuance belongs to the organisation portal
- ADR 018: authenticated organisation review before certificate issue
- ADR 019: audited organisation corrections during certificate review
- ADR 020: integrated organisation PDF signing

## Decision

The organisation portal may create certificate reviews directly, without requiring
a public handoff, where an authorised organisation member collects the applicant
data and applicant confirmation.

Public handoffs and organisation-created reviews will use the same:

- certificate draft schema
- applicant confirmation model
- organisation review workflow
- reviewed-data correction model
- verification checks
- audit trail
- issue path
- PDF generation and signing path

For the current implementation, `certificate_handoff_reviews.handoff_id` may be
nullable. A new `origin` field distinguishes how the review was created:

- `public_handoff`
- `organisation_created`

A public handoff review must reference a handoff. An organisation-created review
does not reference a handoff.

All certificate reviews require applicant confirmation before they can become
`ready_to_issue`.

Public handoff consent maps into the shared applicant confirmation model.
Organisation-created reviews capture applicant confirmation inside the
organisation portal.

Issued certificates continue to be generated from `reviewed_data`, never directly
from `draft_snapshot`.

## Consequences

The public handoff path remains supported but is no longer the only way to start
a certificate review.

The review page becomes the convergence point for all certificate origins.

The system can support in-person and assisted organisation workflows without
duplicating the certificate schema or creating a parallel issue process.

The portal can be introduced into organisations as a smaller operational change:
staff and volunteers can keep their familiar applicant-present intake flow while
using Primer Paso to structure, review, issue, and audit the certificate.

This may make adoption easier for organisations that are cautious about changing
frontline processes or that are not ready to ask applicants to start in the
public service.

The public handoff flow becomes an optional enhancement rather than a prerequisite
for using the portal. It can still be promoted later as a way to reduce repeated
entry, improve preparation before appointments, and speed up in-person review.

The database must preserve whether a review came from a public handoff or was
created by an organisation member.

The organisation portal must make applicant confirmation visible and auditable
for every review.

## Alternatives considered

### Require all applicants to use the public handoff flow

Rejected because it creates unnecessary friction for in-person organisation
workflows and duplicates intake effort. It also makes platform adoption harder by
requiring organisations to change their existing intake process before they have
seen value from the portal.

### Build a separate organisation-only certificate model

Rejected because it would create schema drift between applicant-submitted drafts,
organisation-entered drafts, review data, and issued PDFs.

### Introduce a new certificate case table immediately

Deferred. A case table may become useful if the portal grows into fuller case
management, but the current workflow can be extended safely with a nullable
handoff reference and an explicit origin field.

## Review trigger

Review this decision if the portal becomes a broader case-management system, if
legal review requires stronger applicant authorisation evidence, if multiple
certificate document types are introduced, or if organisation adoption shows that
the handoff-first workflow has become the dominant path.
