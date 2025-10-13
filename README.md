# Fast-survey

This kata implements a minimal survey API using a super lightweight shim of the
FastAPI interface. The goal is to keep the domain behaviour identical to the
original brief while remaining fully runnable in restricted environments where
installing third-party dependencies is not possible.

## Running locally

The project has no runtime dependencies beyond the Python standard library.
The included FastAPI shim is only intended for tests; for a real deployment you
would swap it for the official package.

```bash
python -m app.main
```

The above command does nothing visible but confirms the module imports without
errors.

## Tests

Install the development dependencies and execute the test suite:

```bash
python -m pip install -e .[dev]
pytest
```

If you cannot install packages, the repository already vendors the only modules
used by the tests, so running `pytest` should work in a clean Python 3.12
environment.
