from __future__ import annotations

from fastapi.testclient import TestClient

from pdf_signer.app import create_app


def test_healthz() -> None:
    client = TestClient(create_app())
    response = client.get("/healthz")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_sign_pdf_requires_bearer_token(monkeypatch) -> None:
    monkeypatch.setenv("PDF_SIGNER_TOKEN", "test-token")
    client = TestClient(create_app())
    response = client.post("/v1/sign-pdf", json={})
    assert response.status_code == 401


def test_sign_pdf_rejects_invalid_payload_with_token(monkeypatch) -> None:
    monkeypatch.setenv("PDF_SIGNER_TOKEN", "test-token")
    client = TestClient(create_app())
    response = client.post(
        "/v1/sign-pdf",
        headers={"Authorization": "Bearer test-token"},
        json={},
    )
    assert response.status_code == 422
