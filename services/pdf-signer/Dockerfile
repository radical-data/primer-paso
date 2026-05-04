FROM python:3.12-slim AS builder

COPY --from=ghcr.io/astral-sh/uv:0.11.0 /uv /uvx /bin/

ENV UV_COMPILE_BYTECODE=1 \
	UV_LINK_MODE=copy \
	UV_PYTHON_DOWNLOADS=0

WORKDIR /app

COPY pyproject.toml uv.lock uv.toml README.md ./

RUN --mount=type=cache,target=/root/.cache/uv \
	uv sync --locked --no-dev --no-install-project --no-editable

COPY src ./src

RUN --mount=type=cache,target=/root/.cache/uv \
	uv sync --locked --no-dev --no-editable


FROM python:3.12-slim AS runtime

ENV PATH="/app/.venv/bin:$PATH" \
	PYTHONUNBUFFERED=1 \
	PDF_SIGNER_HOST=0.0.0.0 \
	PDF_SIGNER_PORT=8080

WORKDIR /app

RUN groupadd --system --gid 10001 app \
	&& useradd --system --uid 10001 --gid app --home-dir /app app

COPY --from=builder --chown=app:app /app/.venv /app/.venv

USER app

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
	CMD python -c "import urllib.request; urllib.request.urlopen('http://127.0.0.1:8080/healthz', timeout=2).read()" || exit 1

CMD ["pdf-signer"]
