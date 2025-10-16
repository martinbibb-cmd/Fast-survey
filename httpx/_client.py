"""Minimal stand-ins for httpx client level constants used in tests.

This lightweight shim only provides the pieces of the public API that
Starlette's TestClient expects when running inside the execution
environment used for kata style exercises.  It is **not** intended to be
a drop-in replacement for the real httpx package – it merely allows the
project's test-suite to run in an offline sandbox where installing third
party wheels is not possible.
"""

from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class UseClientDefault:
    """Sentinel matching httpx.UseClientDefault semantics."""

    def __repr__(self) -> str:  # pragma: no cover - trivial
        return "USE_CLIENT_DEFAULT"


USE_CLIENT_DEFAULT = UseClientDefault()

