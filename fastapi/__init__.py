"""Tiny subset of FastAPI used for the kata tests.

The goal is not to be feature complete; it only provides the handful of
capabilities exercised by the unit tests (routing, path parameters, raising
``HTTPException`` and returning ``JSONResponse`` objects).
"""
from __future__ import annotations

import inspect
import re
from typing import Any, Callable, Dict, List, Optional, get_type_hints


class HTTPException(Exception):
    """Exception raised when a request should result in an HTTP error."""

    def __init__(self, *, status_code: int, detail: str) -> None:
        super().__init__(detail)
        self.status_code = status_code
        self.detail = detail


from .responses import JSONResponse


class _Route:
    """Internal structure representing a registered route."""

    def __init__(self, method: str, path: str, endpoint: Callable[..., Any], default_status: int) -> None:
        self.method = method
        self.path = path
        self.endpoint = endpoint
        self.default_status = default_status
        self.signature = inspect.signature(endpoint)
        self.type_hints = get_type_hints(endpoint, globalns=endpoint.__globals__)
        self.param_names = self._extract_param_names(path)
        self.regex = self._build_regex(path)
        self.body_param = self._identify_body_param()

    @staticmethod
    def _extract_param_names(path: str) -> List[str]:
        names: List[str] = []
        for segment in path.split("/"):
            if segment.startswith("{") and segment.endswith("}"):
                names.append(segment[1:-1])
        return names

    @staticmethod
    def _build_regex(path: str) -> re.Pattern[str]:
        pattern = "^"
        for segment in path.strip("/").split("/"):
            if not segment:
                continue
            if segment.startswith("{") and segment.endswith("}"):
                name = segment[1:-1]
                pattern += rf"/(?P<{name}>[^/]+)"
            else:
                pattern += "/" + re.escape(segment)
        if not pattern.endswith("/") and not pattern.endswith("$"):
            pattern += "$"
        if pattern == "^":
            pattern = r"^/?$"
        return re.compile(pattern)

    def _identify_body_param(self) -> Optional[str]:
        for name in self.signature.parameters:
            if name not in self.param_names:
                return name
        return None

    def match(self, path: str) -> Optional[Dict[str, str]]:
        match = self.regex.match(path)
        if not match:
            return None
        return match.groupdict()

    def call(self, params: Dict[str, str], body: Any) -> Any:
        arguments: Dict[str, Any] = {}
        for name in self.param_names:
            parameter = self.signature.parameters[name]
            annotation = self.type_hints.get(name, parameter.annotation)
            value: Any = params[name]
            if annotation is int:
                try:
                    value = int(value)
                except ValueError as exc:  # pragma: no cover - defensive
                    raise HTTPException(status_code=400, detail="Invalid path parameter.") from exc
            arguments[name] = value

        if self.body_param is not None:
            arguments[self.body_param] = body

        return self.endpoint(**arguments)


class FastAPI:
    """Very small subset of the real :class:`fastapi.FastAPI` interface."""

    def __init__(self, *, title: str = "", version: str = "") -> None:
        self.title = title
        self.version = version
        self._routes: List[_Route] = []

    # Public decorator helpers -------------------------------------------------
    def get(self, path: str, *, status_code: int = 200) -> Callable[[Callable[..., Any]], Callable[..., Any]]:
        return self._register("GET", path, status_code)

    def post(self, path: str, *, status_code: int = 200) -> Callable[[Callable[..., Any]], Callable[..., Any]]:
        return self._register("POST", path, status_code)

    # Internal helpers ---------------------------------------------------------
    def _register(self, method: str, path: str, default_status: int) -> Callable[[Callable[..., Any]], Callable[..., Any]]:
        def decorator(endpoint: Callable[..., Any]) -> Callable[..., Any]:
            self._routes.append(_Route(method, path, endpoint, default_status))
            return endpoint

        return decorator

    # Dispatcher used by the test client --------------------------------------
    def _dispatch(self, method: str, path: str, body: Any) -> JSONResponse:
        for route in self._routes:
            if route.method != method:
                continue
            params = route.match(path)
            if params is None:
                continue
            result = route.call(params, body)
            if isinstance(result, JSONResponse):
                return result
            return JSONResponse(content=result, status_code=route.default_status)
        raise HTTPException(status_code=404, detail="Not Found")


__all__ = ["FastAPI", "HTTPException", "JSONResponse"]
