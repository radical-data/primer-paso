# pyright: reportUnknownMemberType=false, reportUnknownVariableType=false
from __future__ import annotations

import base64
import binascii
import hashlib
import io
import os
from datetime import UTC, datetime
from typing import Any

from pyhanko.pdf_utils.incremental_writer import IncrementalPdfFileWriter
from pyhanko.sign import fields, signers
from pyhanko.sign.fields import SigFieldSpec

from pdf_signer.models import (
    InspectCertificateRequest,
    InspectCertificateResponse,
    SignPdfRequest,
    SignPdfResponse,
)


class SigningInputError(ValueError):
    pass


def _max_pdf_bytes() -> int:
    return int(os.environ.get("PDF_SIGNER_MAX_PDF_BYTES", str(10 * 1024 * 1024)))


def _max_pkcs12_bytes() -> int:
    return int(os.environ.get("PDF_SIGNER_MAX_PKCS12_BYTES", str(2 * 1024 * 1024)))


def _decode_base64(value: str, *, field_name: str, max_bytes: int) -> bytes:
    try:
        decoded = base64.b64decode(value, validate=True)
    except binascii.Error as exc:
        raise SigningInputError(f"{field_name} is not valid base64") from exc
    if not decoded:
        raise SigningInputError(f"{field_name} is empty")
    if len(decoded) > max_bytes:
        raise SigningInputError(f"{field_name} exceeds maximum allowed size")
    return decoded


def _certificate_fingerprint_sha256(cert: Any) -> str:
    # pyHanko exposes asn1crypto.x509.Certificate for signing_cert.
    dumped = cert.dump()
    if not isinstance(dumped, bytes):
        raise SigningInputError("signing certificate could not be serialised")
    return hashlib.sha256(dumped).hexdigest()


def _load_pkcs12_signer(pkcs12_data: bytes, passphrase: str) -> signers.SimpleSigner:
    try:
        return signers.SimpleSigner.load_pkcs12_data(
            pkcs12_data,
            passphrase=passphrase.encode("utf-8"),
            other_certs=[],
        )
    except Exception as exc:
        raise SigningInputError("PKCS#12 certificate could not be loaded") from exc


def _normalise_cert_time(value: object) -> datetime | None:
    if value is None:
        return None
    if isinstance(value, datetime):
        if value.tzinfo is None:
            return value.replace(tzinfo=UTC)
        return value
    return None


def _certificate_validity_time(cert: Any, field_name: str) -> datetime | None:
    try:
        value = cert["tbs_certificate"]["validity"][field_name].native
    except Exception as exc:
        raise SigningInputError(
            f"signing certificate validity field could not be read: {field_name}"
        ) from exc

    return _normalise_cert_time(value)


def _validate_certificate_is_current(cert: Any) -> None:
    now = datetime.now(UTC)
    not_before = _certificate_validity_time(cert, "not_before")
    not_after = _certificate_validity_time(cert, "not_after")
    if not_before is not None and not_before > now:
        raise SigningInputError("signing certificate is not valid yet")
    if not_after is not None and not_after <= now:
        raise SigningInputError("signing certificate has expired")


def inspect_certificate(
    request: InspectCertificateRequest,
) -> InspectCertificateResponse:
    pkcs12_data = _decode_base64(
        request.pkcs12_base64,
        field_name="pkcs12_base64",
        max_bytes=_max_pkcs12_bytes(),
    )
    signer = _load_pkcs12_signer(pkcs12_data, request.pkcs12_passphrase)
    signing_cert = signer.signing_cert
    if signing_cert is None:
        raise SigningInputError("PKCS#12 certificate has no signing certificate")
    _validate_certificate_is_current(signing_cert)
    return InspectCertificateResponse(
        signer_subject=signing_cert.subject.human_friendly,
        signer_issuer=signing_cert.issuer.human_friendly,
        certificate_serial_number=str(signing_cert.serial_number),
        certificate_fingerprint_sha256=_certificate_fingerprint_sha256(signing_cert),
        not_before=_certificate_validity_time(signing_cert, "not_before"),
        not_after=_certificate_validity_time(signing_cert, "not_after"),
    )


def sign_pdf(request: SignPdfRequest) -> SignPdfResponse:
    unsigned_pdf = _decode_base64(
        request.unsigned_pdf_base64,
        field_name="unsigned_pdf_base64",
        max_bytes=_max_pdf_bytes(),
    )
    pkcs12_data = _decode_base64(
        request.pkcs12_base64,
        field_name="pkcs12_base64",
        max_bytes=_max_pkcs12_bytes(),
    )

    signer = _load_pkcs12_signer(pkcs12_data, request.pkcs12_passphrase)

    input_stream = io.BytesIO(unsigned_pdf)
    output_stream = io.BytesIO()
    try:
        writer = IncrementalPdfFileWriter(input_stream)
        fields.append_signature_field(
            writer,
            SigFieldSpec(
                request.field_name,
                on_page=request.page_index,
                box=request.box,
            ),
        )
        metadata = signers.PdfSignatureMetadata(
            field_name=request.field_name,
            reason=request.reason,
            location=request.location,
        )
        signers.sign_pdf(
            writer,
            signature_meta=metadata,
            signer=signer,
            output=output_stream,
        )
    except Exception as exc:
        raise SigningInputError("PDF could not be signed") from exc

    signed_pdf = output_stream.getvalue()
    if not signed_pdf:
        raise SigningInputError("signed PDF output was empty")

    signing_cert = signer.signing_cert
    if signing_cert is None:
        raise SigningInputError("PKCS#12 certificate has no signing certificate")
    _validate_certificate_is_current(signing_cert)
    return SignPdfResponse(
        signed_pdf_base64=base64.b64encode(signed_pdf).decode("ascii"),
        signer_subject=signing_cert.subject.human_friendly,
        signer_issuer=signing_cert.issuer.human_friendly,
        certificate_serial_number=str(signing_cert.serial_number),
        certificate_fingerprint_sha256=_certificate_fingerprint_sha256(signing_cert),
    )
