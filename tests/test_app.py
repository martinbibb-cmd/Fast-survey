import inspect
import json
from typing import Any, Dict, get_type_hints

from fastapi import HTTPException
from fastapi.responses import JSONResponse
from fastapi.routing import APIRoute
from starlette.routing import Match

from app.main import app


try:
    from fastapi.testclient import TestClient  # type: ignore
except RuntimeError:  # pragma: no cover - fallback when httpx is unavailable
    TestClient = None  # type: ignore


class _SimpleResponse:
    def __init__(self, status_code: int, payload: Any) -> None:
        self.status_code = status_code
        self._payload = payload

    def json(self) -> Any:
        return self._payload

    @property
    def text(self) -> str:
        if isinstance(self._payload, (dict, list)):
            return json.dumps(self._payload)
        return str(self._payload)


class _RouteInvoker:
    """Lightweight stand-in for FastAPI's TestClient without httpx."""

    def __init__(self, fastapi_app):
        self.app = fastapi_app

    def _find_route(self, method: str, path: str) -> tuple[APIRoute, Dict[str, Any]]:
        scope = {"type": "http", "method": method.upper(), "path": path, "root_path": ""}
        for route in self.app.routes:
            if not isinstance(route, APIRoute):
                continue
            match, child_scope = route.matches(scope)
            if match is Match.FULL:
                return route, child_scope
        raise AssertionError(f"No route found for {method} {path}")

    def _convert_param(self, value: Any, annotation: Any) -> Any:
        if annotation is inspect.Signature.empty:
            return value
        try:
            return annotation(value)  # type: ignore[call-arg]
        except Exception:
            return value

    def _call_endpoint(self, route: APIRoute, scope: Dict[str, Any], body: Any) -> _SimpleResponse:
        signature = inspect.signature(route.endpoint)
        type_hints = get_type_hints(route.endpoint)
        kwargs: Dict[str, Any] = {}
        provided_body = False

        for name, parameter in signature.parameters.items():
            annotation = type_hints.get(name, parameter.annotation)
            if "path_params" in scope and name in scope["path_params"]:
                value = scope["path_params"][name]
                kwargs[name] = self._convert_param(value, annotation)
                continue

            if not provided_body:
                kwargs[name] = body
                provided_body = True
                continue

            # Unexpected parameter without body support; let FastAPI raise for clarity.
            kwargs[name] = None

        try:
            result = route.endpoint(**kwargs)
        except HTTPException as exc:  # pragma: no cover - mirrors HTTP error responses
            return _SimpleResponse(exc.status_code, {"detail": exc.detail})

        if isinstance(result, JSONResponse):
            content = json.loads(result.body.decode()) if result.body else None
            return _SimpleResponse(result.status_code, content)

        status_code = route.status_code or 200
        return _SimpleResponse(status_code, result)

    def request(self, method: str, path: str, *, json: Any | None = None) -> _SimpleResponse:
        route, scope = self._find_route(method, path)
        body = json if json is not None else None
        return self._call_endpoint(route, scope, body)

    def get(self, path: str) -> _SimpleResponse:
        return self.request("GET", path)

    def post(self, path: str, *, json: Any | None = None) -> _SimpleResponse:
        return self.request("POST", path, json=json)


client = TestClient(app) if TestClient is not None else _RouteInvoker(app)


def create_sample_survey():
    payload = {
        "title": "Conference feedback",
        "description": "Tell us what you think",
        "questions": [
            {"prompt": "How satisfied are you?", "kind": "single_choice", "choices": [
                {"value": "very", "label": "Very satisfied"},
                {"value": "somewhat", "label": "Somewhat satisfied"},
                {"value": "not", "label": "Not satisfied"},
            ]},
            {"prompt": "What could be improved?"},
        ],
    }
    response = client.post("/surveys", json=payload)
    assert response.status_code == 201, response.text
    return response.json()


def test_create_and_list_surveys():
    survey = create_sample_survey()

    response = client.get("/surveys")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
    assert any(item["id"] == survey["id"] for item in data)


def test_submit_response_and_results():
    survey = create_sample_survey()

    submission = {"answers": {0: "very", 1: "Great speakers"}}
    response = client.post(f"/surveys/{survey['id']}/responses", json=submission)
    assert response.status_code == 202

    results = client.get(f"/surveys/{survey['id']}/results")
    assert results.status_code == 200
    payload = results.json()
    assert payload["responses"] == 1
    assert payload["answers"]["0"]["very"] == 1
    assert payload["answers"]["1"]["Great speakers"] == 1


def test_invalid_choice_is_rejected():
    survey = create_sample_survey()

    submission = {"answers": {0: "invalid", 1: "Great speakers"}}
    response = client.post(f"/surveys/{survey['id']}/responses", json=submission)
    assert response.status_code == 400
    assert "Invalid choice" in response.json()["detail"]
