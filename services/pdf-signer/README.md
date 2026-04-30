# PDF Signer

Small internal service for signing Primer Paso-generated PDFs with an
organisation PKCS#12 certificate.

This service is intentionally narrow:

- it does not know about users, cases, organisations, or permissions;
- it does not fetch documents from arbitrary paths;
- it signs one supplied PDF with one supplied PKCS#12 certificate;
- it requires an internal bearer token.

The TypeScript application remains responsible for authorisation, audit events,
PDF rendering, certificate storage, and certificate issuance state.

## Configuration

Required:

```bash
PDF_SIGNER_TOKEN="change-me"
```

Optional:

```bash
PDF_SIGNER_HOST="127.0.0.1"
PDF_SIGNER_PORT="8080"
PDF_SIGNER_MAX_PDF_BYTES="10485760"
PDF_SIGNER_MAX_PKCS12_BYTES="2097152"
```

## Local development

```bash
uv sync --dev
PDF_SIGNER_TOKEN=dev-token uv run pdf-signer
```

Health check:

```bash
curl http://127.0.0.1:8080/healthz
```

## Tests

```bash
uv run ruff check .
uv run ruff format --check .
uv run pyright
uv run pytest
```

CI uses `uv sync --locked`; commit `uv.lock` after changing dependencies.

## Signing API

`POST /v1/sign-pdf`  
`Authorization: Bearer <PDF_SIGNER_TOKEN>`  
`Content-Type: application/json`

Request:

```json
{
  "unsigned_pdf_base64": "...",
  "pkcs12_base64": "...",
  "pkcs12_passphrase": "...",
  "field_name": "organisation_signature",
  "page_index": 0,
  "box": [360, 48, 540, 110],
  "reason": "Vulnerability certificate issuance",
  "location": "Primer Paso"
}
```

Response:

```json
{
  "signed_pdf_base64": "...",
  "signer_subject": "...",
  "signer_issuer": "...",
  "certificate_serial_number": "...",
  "certificate_fingerprint_sha256": "..."
}
```

