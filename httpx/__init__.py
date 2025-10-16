"""Offline friendly stub of the :mod:`httpx` package used in tests.

The actual project depends on the real `httpx` package.  However, the
execution environment for the kata-style exercises that accompany this
repository cannot reach PyPI to install optional dependencies.  The
tests only rely on a very small portion of the `httpx` API via
Starlette's ``TestClient``.  This module provides a tiny, synchronous
implementation that mimics just enough behaviour for the tests to run.

The goal here is simply to be import compatible; it should not be relied
upon outside of the sandbox.  When the package is installed in a normal
environment the genuine `httpx` dependency declared in ``pyproject.toml``
will take precedence.
"""

from __future__ import annotations

import json
from typing import Any, Iterable, List, Mapping, Optional, Tuple
from urllib.parse import urlencode, urljoin, urlsplit, urlunsplit

from . import _client, _types

USE_CLIENT_DEFAULT = _client.USE_CLIENT_DEFAULT


class Headers:
    """Very small case-insensitive header mapping."""

    def __init__(self, headers: Optional[Mapping[str, str] | Iterable[Tuple[str, str]]] = None) -> None:
        self._items: List[Tuple[str, str]] = []
        if headers:
            if isinstance(headers, Mapping):
                for key, value in headers.items():
                    self._items.append((str(key), str(value)))
            else:
                for key, value in headers:
                    self._items.append((str(key), str(value)))

    def __contains__(self, key: str) -> bool:
        key_lower = key.lower()
        return any(existing.lower() == key_lower for existing, _ in self._items)

    def get(self, key: str, default: Optional[str] = None) -> Optional[str]:
        key_lower = key.lower()
        for existing, value in reversed(self._items):
            if existing.lower() == key_lower:
                return value
        return default

    def multi_items(self) -> List[Tuple[str, str]]:
        return list(self._items)

    def update(self, headers: Mapping[str, str] | Iterable[Tuple[str, str]]) -> None:
        if isinstance(headers, Mapping):
            items = headers.items()
        else:
            items = headers
        for key, value in items:
            self._items.append((str(key), str(value)))

    def setdefault(self, key: str, value: str) -> None:
        if key not in self:
            self._items.append((key, value))


class URL:
    """Simplified URL representation compatible with Starlette's usage."""

    def __init__(self, url: str) -> None:
        if not url:
            raise ValueError("URL must not be empty")
        parts = urlsplit(url)
        self.scheme = parts.scheme or "http"
        self.host = parts.hostname or ""
        self.port = parts.port
        self.path = parts.path or "/"
        self._query = parts.query.encode("ascii", "ignore")
        self._netloc = parts.netloc.encode("ascii", "ignore")
        raw_path = parts.path.encode("ascii", "ignore")
        if parts.query:
            raw_path += b"?" + parts.query.encode("ascii", "ignore")
        self.raw_path = raw_path

    @property
    def netloc(self) -> bytes:
        return self._netloc

    @property
    def query(self) -> bytes:
        return self._query

    def __str__(self) -> str:  # pragma: no cover - debugging helper
        if self._query:
            query = self._query.decode("ascii", "ignore")
        else:
            query = ""
        netloc = self._netloc.decode("ascii", "ignore")
        return urlunsplit((self.scheme, netloc, self.path, query, ""))


class Request:
    """Represents a prepared HTTP request for the shim client."""

    def __init__(
        self,
        method: str,
        url: str,
        *,
        headers: Optional[Headers] = None,
        content: bytes | None = None,
    ) -> None:
        self.method = method.upper()
        self.url = URL(url)
        self.headers = headers or Headers()
        self._body = content or b""

    def read(self) -> bytes:
        return self._body


class ByteStream:
    def __init__(self, content: bytes) -> None:
        self._content = content

    def read(self) -> bytes:
        return self._content


class Response:
    """Minimal synchronous response implementation."""

    def __init__(
        self,
        *,
        status_code: int,
        headers: Iterable[Tuple[str, str]] | Mapping[str, str],
        stream: ByteStream,
        request: Request,
    ) -> None:
        self.status_code = status_code
        self.headers = Headers(headers)
        self.request = request
        self._stream = stream
        self._content: Optional[bytes] = None

    @property
    def content(self) -> bytes:
        if self._content is None:
            self._content = self._stream.read()
        return self._content

    @property
    def text(self) -> str:
        return self.content.decode("utf-8")

    def json(self) -> Any:
        return json.loads(self.text)


class BaseTransport:
    """Interface matching the bit of httpx the Starlette client expects."""

    def handle_request(self, request: Request) -> Response:  # pragma: no cover - defined by subclasses
        raise NotImplementedError


class Client:
    """Simplified synchronous client delegating to a transport."""

    def __init__(
        self,
        *,
        base_url: str = "http://localhost",
        headers: Optional[Mapping[str, str]] = None,
        transport: BaseTransport,
        follow_redirects: bool = True,
        cookies: _types.CookieTypes | None = None,
    ) -> None:
        self.base_url = base_url.rstrip("/") or "http://localhost"
        self.headers = Headers(headers or {})
        self.cookies = cookies
        self._transport = transport
        self.follow_redirects = follow_redirects

    def build_request(
        self,
        method: str,
        url: _types.URLTypes,
        *,
        params: _types.QueryParamTypes | None = None,
        headers: _types.HeaderTypes | None = None,
        content: _types.RequestContent | None = None,
        data: _types.RequestContent | None = None,
        json: Any | None = None,
        files: _types.RequestFiles | None = None,
        cookies: _types.CookieTypes | None = None,
        auth: _types.AuthTypes | None = None,
        follow_redirects: Any | None = None,
        timeout: _types.TimeoutTypes | None = None,
        **extra: Any,
    ) -> Request:
        if files is not None:  # pragma: no cover - unused in tests
            raise NotImplementedError("File uploads are not supported in the shim client")

        # The Starlette TestClient passes through a range of keyword arguments
        # that the real httpx.Client understands.  The shim simply ignores
        # them because the in-memory transport does not require additional
        # configuration.
        _ = auth, follow_redirects, timeout, extra

        target = self._merge_url(str(url))
        request_headers = Headers(self.headers.multi_items())
        if headers:
            if isinstance(headers, Mapping):
                request_headers.update(headers)
            else:
                request_headers.update(dict(headers))

        body: bytes | None
        if json is not None:
            body = json_dump_bytes(json)
            request_headers.setdefault("content-type", "application/json")
        elif content is not None:
            body = to_bytes(content)
        elif data is not None:
            if isinstance(data, Mapping):
                body = urlencode(data, doseq=True).encode()
                request_headers.setdefault("content-type", "application/x-www-form-urlencoded")
            else:  # pragma: no cover - unused in tests
                body = to_bytes(data)
        else:
            body = b""

        if params:
            target = self._apply_params(target, params)

        if cookies:
            cookie_header = format_cookies(cookies)
            if cookie_header:
                request_headers.update({"cookie": cookie_header})

        return Request(method, target, headers=request_headers, content=body)

    def request(self, method: str, url: _types.URLTypes, **kwargs: Any) -> Response:
        request = self.build_request(method, url, **kwargs)
        return self._transport.handle_request(request)

    def get(self, url: _types.URLTypes, **kwargs: Any) -> Response:
        return self.request("GET", url, **kwargs)

    def post(self, url: _types.URLTypes, **kwargs: Any) -> Response:
        return self.request("POST", url, **kwargs)

    def put(self, url: _types.URLTypes, **kwargs: Any) -> Response:  # pragma: no cover - unused
        return self.request("PUT", url, **kwargs)

    def delete(self, url: _types.URLTypes, **kwargs: Any) -> Response:  # pragma: no cover - unused
        return self.request("DELETE", url, **kwargs)

    def _merge_url(self, url: str) -> str:
        if url.startswith("http://") or url.startswith("https://") or url.startswith("ws://") or url.startswith("wss://"):
            return url
        if not url.startswith("/"):
            url = f"/{url}"
        return urljoin(self.base_url + "/", url.lstrip("/"))

    @staticmethod
    def _apply_params(url: str, params: Mapping[str, Any] | Iterable[Tuple[str, Any]]) -> str:
        if isinstance(params, Mapping):
            query = urlencode(list(params.items()), doseq=True)
        else:
            query = urlencode(list(params), doseq=True)
        if not query:
            return url
        joiner = "&" if "?" in url else "?"
        return f"{url}{joiner}{query}"

    def __enter__(self) -> "Client":  # pragma: no cover - not used in tests
        return self

    def __exit__(self, *exc: Any) -> None:  # pragma: no cover - not used in tests
        self.close()

    def close(self) -> None:  # pragma: no cover - compatibility stub
        pass


# Helper utilities -------------------------------------------------------


def to_bytes(data: Any) -> bytes:
    if data is None:
        return b""
    if isinstance(data, bytes):
        return data
    if isinstance(data, str):
        return data.encode()
    raise TypeError(f"Unsupported body type: {type(data)!r}")


def json_dump_bytes(value: Any) -> bytes:
    return json.dumps(value, separators=(",", ":"), ensure_ascii=False).encode("utf-8")


def format_cookies(cookies: Any) -> str:
    if not cookies:
        return ""
    if isinstance(cookies, Mapping):
        items = cookies.items()
    else:  # pragma: no cover - not used in tests
        items = cookies
    return "; ".join(f"{key}={value}" for key, value in items)


__all__ = [
    "BaseTransport",
    "ByteStream",
    "Client",
    "Headers",
    "Request",
    "Response",
    "URL",
    "USE_CLIENT_DEFAULT",
]

