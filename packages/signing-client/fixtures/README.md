# Signing client fixtures

This directory contains signing material for local development and smoke tests
only.

These fixtures must never be used for real certificate issuance.

## Committed fixture

```txt
fnmt-test-sello-entidad-nosmime.p12
```

This is an FNMT test certificate from the public FNMT test certificate bundle:

```txt
Claves RSA/AC Representación/Certificados pruebas Sello de Entidad/FNMT_SELLO_ENTIDAD_NOSMIME.p12
```

It is used because it behaves more like a Spanish administrative signing
certificate in validation tools than a self-signed local certificate.

The passphrase is stored in:

```txt
fnmt-test-sello-entidad-nosmime.passphrase.txt
```

