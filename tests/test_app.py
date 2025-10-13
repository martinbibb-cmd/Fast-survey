from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


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
