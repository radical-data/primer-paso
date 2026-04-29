from __future__ import annotations

import os
from hmac import compare_digest

from fastapi import Depends, FastAPI, Header, HTTPException, status

from pdf_signer.models import SignPdfRequest, SignPdfResponse
from pdf_signer.signing import SigningInputError, sign_pdf


def _get_required_token() -> str:
    token = os.environ.get("PDF_SIGNER_TOKEN")
    if not token:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="PDF_SIGNER_TOKEN is not configured",
        )
    return token


def _authorise(authorization: str | None = Header(default=None)) -> None:
    expected = _get_required_token()
    prefix = "Bearer "
    if authorization is None or not authorization.startswith(prefix):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing bearer token",
        )
    supplied = authorization[len(prefix) :]
    if not compare_digest(supplied, expected):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid bearer token",
        )


def create_app() -> FastAPI:
    app = FastAPI(
        title="Primer Paso PDF Signer",
        version="0.1.0",
        docs_url=None,
        redoc_url=None,
        openapi_url=None,
    )

    @app.get("/healthz")
    def healthz() -> dict[str, str]:
        return {"status": "ok"}

    @app.post(
        "/v1/sign-pdf",
        response_model=SignPdfResponse,
        dependencies=[Depends(_authorise)],
    )
    def sign_pdf_endpoint(request: SignPdfRequest) -> SignPdfResponse:
        try:
            return sign_pdf(request)
        except SigningInputError as exc:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=str(exc),
            ) from exc
        except Exception as exc:
            # Do not leak certificate internals or stack traces to callers.
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="PDF signing failed",
            ) from exc

    return app
