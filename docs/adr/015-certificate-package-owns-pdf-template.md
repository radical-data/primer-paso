# ADR 015: Put certificate schemas and PDF generation in a shared package

## Status

Accepted

## Date

2026-04-25

## Context

The public app will collect certificate draft information from the user. The organisation portal will review that information, add organisation-side data, and issue the final PDF.

Both apps need to agree on the shape, version, and meaning of a vulnerability certificate draft.

The official PDF template is a fixed administrative document with fields completed from both user-provided and organisation-provided information.

## Decision

Certificate-specific types, schemas, template versioning, and PDF generation will live in `packages/certificate`.

The public app may create certificate drafts using this package. The organisation portal may generate issued certificate PDFs using this package.

The package generates the PDF document. Verification, issuance, audit logging, and delivery belong to the organisation portal and persistence layer.

## Consequences

- certificate field names and template versions have one canonical owner
- public and organisation apps cannot silently drift in their interpretation of the certificate model
- PDF generation can be tested independently of either app
- future certificate templates can be versioned in one place

## Alternatives considered

### Generate PDFs directly inside the public app

This was not chosen because the public app does not issue certificates.

### Generate PDFs directly inside the organisation portal only

This was not chosen because the public app still needs the shared draft schema and may need draft previews or validation aligned with final output.

## Review trigger

Review if certificate generation becomes a standalone service or needs a separate runtime.
