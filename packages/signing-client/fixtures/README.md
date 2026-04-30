# Signing client fixtures

This directory contains fake signing material for local development and smoke
tests only.

The certificate is self-signed and is not issued by FNMT, AOC, Cl@ve, or any
trusted certificate authority. It must never be used for real certificate
issuance.

Committed fixture:

```txt
test-organisation-signing-cert.p12
```

Passphrase:

```txt
test-password
```

Regenerate it from the repository root with:

```sh
pnpm signing:generate-fixture
```

The script writes the temporary private key under `/tmp` and removes it after
creating the PKCS#12 fixture.
