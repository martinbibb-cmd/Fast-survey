"""Responses module for the FastAPI shim."""
from __future__ import annotations

from dataclasses import dataclass
from typing import Any


@dataclass
class JSONResponse:
    content: Any
    status_code: int = 200

