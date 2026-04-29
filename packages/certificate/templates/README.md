# Certificate PDF templates

This directory owns official PDF templates used by `@primer-paso/certificate`.

## Source template

The official flat PDF received from the administrative source should be kept at:

```txt
packages/certificate/templates/certificado-vulnerabilidad.source.pdf
```

This file should not be edited manually.

## Runtime template

The runtime template used by the application is:

```txt
packages/certificate/templates/certificado-vulnerabilidad.pdf
```

It is derived from the source PDF by running:

```sh
pnpm --filter @primer-paso/certificate template:field
```

The derivation script adds named AcroForm fields on top of the existing visual blanks and checkbox boxes. It does not redraw or reconstruct the official text.

## Field naming

Field names are stable API contract names. Runtime code should fill fields by name rather than by page coordinates.

See:

```txt
packages/certificate/templates/certificado-vulnerabilidad.fields.md
```

The public certificate-draft contract intentionally does not support the official
template's generic "other" vulnerability line. See ADR 017 for the product and
policy rationale.

## Review rule

When the source PDF changes:

1. replace certificado-vulnerabilidad.source.pdf
2. run pnpm --filter @primer-paso/certificate template:field
3. visually inspect the generated fielded template
4. run the test suite
5. update coordinates only in scripts/create-fielded-template.ts
