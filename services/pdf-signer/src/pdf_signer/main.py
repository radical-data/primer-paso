from __future__ import annotations

import os

import uvicorn


def main() -> None:
    host = os.environ.get("PDF_SIGNER_HOST", "127.0.0.1")
    port = int(os.environ.get("PDF_SIGNER_PORT", "8080"))
    uvicorn.run(
        "pdf_signer.app:create_app",
        host=host,
        port=port,
        factory=True,
        log_level="info",
    )
