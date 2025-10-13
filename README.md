# Fast-survey

A minimal FastAPI-powered service for creating lightweight surveys and collecting
responses.

## Running locally

Install dependencies with [`uv`](https://docs.astral.sh/uv/) or `pip`.

```bash
uv sync --extra dev
uv run uvicorn app.main:app --reload
```

Alternatively, using `pip`:

```bash
python -m venv .venv
source .venv/bin/activate
pip install -e .[dev]
uvicorn app.main:app --reload
```

The service exposes REST endpoints for creating surveys, submitting responses,
and retrieving aggregated results.

## Tests

Run the unit tests with:

```bash
uv run pytest
```
