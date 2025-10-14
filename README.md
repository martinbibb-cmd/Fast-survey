# Fast-survey

This kata implements a minimal survey API using the real FastAPI framework.
It mirrors the behaviour of the reference implementation from the original
exercise so you can create surveys, accept responses, and view aggregated
results.

## Running locally

Install the project in editable mode along with its dependencies and run the
application with Uvicorn:

```bash
python -m pip install -e .[dev]
uvicorn app.main:app --reload
```

Once the server is running, you can interact with the API at
`http://127.0.0.1:8000` or visit the automatically generated documentation at
`http://127.0.0.1:8000/docs`.

## Tests

Install the development dependencies and execute the test suite:

```bash
python -m pip install -e .[dev]
pytest
```
