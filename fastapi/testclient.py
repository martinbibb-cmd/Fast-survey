"""Tiny in-process HTTP client compatible with the shimmed ``fastapi`` package."""
from __future__ import annotations

import json
from dataclasses import dataclass
from typing import Any, Dict, Optional

from . import HTTPException, JSONResponse


@dataclass
class _Response:
    status_code: int
    _json: Any

    @property
    def text(self) -> str:
        return json.dumps(self._json)

    def json(self) -> Any:
        return self._json


class TestClient:
    """Subset of :class:`fastapi.testclient.TestClient` used in the tests."""

    __test__ = False  # Prevent pytest from attempting to collect this class.

    def __init__(self, app: Any) -> None:
        self._app = app

    def get(self, path: str) -> _Response:
        return self._request("GET", path, None)

    def post(self, path: str, json: Optional[Dict[str, Any]] = None) -> _Response:
        return self._request("POST", path, json or {})

    def _request(self, method: str, path: str, body: Any) -> _Response:
        try:
            response = self._app._dispatch(method, path, body)
            if isinstance(response, JSONResponse):
                return _Response(status_code=response.status_code, _json=response.content)
            return _Response(status_code=200, _json=response)
        except HTTPException as exc:
            return _Response(status_code=exc.status_code, _json={"detail": exc.detail})
