from __future__ import annotations

from datetime import datetime
from typing import Annotated

from pydantic import BaseModel, Field, field_validator


SignatureBox = tuple[int, int, int, int]


class SignPdfRequest(BaseModel):
    unsigned_pdf_base64: str = Field(min_length=1)
    pkcs12_base64: str = Field(min_length=1)
    pkcs12_passphrase: str = Field(min_length=1)
    field_name: Annotated[str, Field(min_length=1, max_length=80)] = (
        "organisation_signature"
    )
    page_index: Annotated[int, Field(ge=0)] = 0
    box: SignatureBox = (360, 48, 540, 110)
    reason: Annotated[str | None, Field(max_length=200)] = None
    location: Annotated[str | None, Field(max_length=200)] = None

    @field_validator("box")
    @classmethod
    def validate_box(cls, value: SignatureBox) -> SignatureBox:
        x1, y1, x2, y2 = value
        if x2 <= x1:
            raise ValueError("signature box x2 must be greater than x1")
        if y2 <= y1:
            raise ValueError("signature box y2 must be greater than y1")
        return value


class SignPdfResponse(BaseModel):
    signed_pdf_base64: str
    signer_subject: str
    signer_issuer: str
    certificate_serial_number: str
    certificate_fingerprint_sha256: str


class InspectCertificateRequest(BaseModel):
    pkcs12_base64: str = Field(min_length=1)
    pkcs12_passphrase: str = Field(min_length=1)


class InspectCertificateResponse(BaseModel):
    signer_subject: str
    signer_issuer: str
    certificate_serial_number: str
    certificate_fingerprint_sha256: str
    not_before: datetime | None
    not_after: datetime | None
