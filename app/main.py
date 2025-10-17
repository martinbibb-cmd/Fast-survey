"""FastAPI application for managing lightweight surveys."""
from __future__ import annotations

import itertools
from typing import Dict, List

from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field, ValidationInfo, field_validator


app = FastAPI(title="Fast Survey", version="0.1.0")


class Choice(BaseModel):
    """Representation of a single selectable choice for a question."""

    value: str = Field(..., description="Value returned when this choice is selected.")
    label: str = Field(..., description="Human readable label for the choice.")

    @field_validator("value", "label", mode="before")
    def _strip(cls, value: str) -> str:
        if not value.strip():
            raise ValueError("Choice values and labels must not be empty.")
        return value.strip()


class Question(BaseModel):
    """Survey question definition."""

    prompt: str = Field(..., description="Text shown to the respondent.")
    kind: str = Field(
        "text",
        description="Type of answer expected. Supported: text, single_choice.",
    )
    choices: List[Choice] = Field(default_factory=list, description="Available choices.")

    @field_validator("prompt", mode="before")
    def _validate_prompt(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("Question prompt must not be empty.")
        return value

    @field_validator("choices", mode="after")
    def _validate_choices(
        cls, value: List[Choice], info: ValidationInfo
    ) -> List[Choice]:
        kind = (info.data or {}).get("kind", "text")
        if kind == "single_choice" and not value:
            raise ValueError("Single choice questions must define at least one choice.")
        if kind != "single_choice" and value:
            raise ValueError("Only single choice questions can define choices.")
        if kind not in {"text", "single_choice"}:
            raise ValueError("Unsupported question kind. Use 'text' or 'single_choice'.")
        return value


class SurveyCreate(BaseModel):
    """Payload used to create new surveys."""

    title: str = Field(..., description="Title displayed to respondents.")
    description: str | None = Field(None, description="Optional survey description.")
    questions: List[Question] = Field(..., min_length=1)

    @field_validator("title", mode="before")
    def _validate_title(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("Title must not be empty.")
        return value


class Survey(SurveyCreate):
    """Survey representation returned by the API."""

    id: int


class ResponseCreate(BaseModel):
    """Payload used when submitting a survey response."""

    answers: Dict[int, str] = Field(..., description="Mapping from question index to answer.")

    @field_validator("answers", mode="after")
    def _validate_answers(cls, answers: Dict[int, str]) -> Dict[int, str]:
        cleaned: Dict[int, str] = {}
        for idx, answer in answers.items():
            if isinstance(answer, str):
                stripped = answer.strip()
                if not stripped:
                    raise ValueError("Answer text cannot be empty.")
                cleaned[idx] = stripped
            else:
                raise ValueError("Answers must be strings.")
        return cleaned


class SurveyResults(BaseModel):
    """Aggregated survey results."""

    responses: int = 0
    answers: Dict[int, Dict[str, int]] = Field(default_factory=dict)


class InMemorySurveyStore:
    """Very small in-memory persistence layer."""

    def __init__(self) -> None:
        self._id_sequence = itertools.count(1)
        self._surveys: Dict[int, Survey] = {}
        self._results: Dict[int, SurveyResults] = {}

    def list_surveys(self) -> List[Survey]:
        return list(self._surveys.values())

    def get(self, survey_id: int) -> Survey:
        try:
            return self._surveys[survey_id]
        except KeyError as exc:
            raise HTTPException(status_code=404, detail="Survey not found.") from exc

    def create(self, payload: SurveyCreate) -> Survey:
        survey_id = next(self._id_sequence)
        survey = Survey(id=survey_id, **payload.model_dump())
        self._surveys[survey_id] = survey
        self._results[survey_id] = SurveyResults()
        return survey

    def submit_response(self, survey_id: int, submission: ResponseCreate, /) -> SurveyResults:
        survey = self.get(survey_id)
        answers: Dict[int, Dict[str, int]] = self._results[survey_id].answers

        for idx, question in enumerate(survey.questions):
            if idx not in submission.answers:
                raise HTTPException(
                    status_code=400,
                    detail=f"Missing answer for question {idx}",
                )
            answer = submission.answers[idx]

            if question.kind == "single_choice":
                allowed = {choice.value for choice in question.choices}
                if answer not in allowed:
                    raise HTTPException(
                        status_code=400,
                        detail=f"Invalid choice for question {idx}",
                    )
            answers.setdefault(idx, {})
            answers[idx][answer] = answers[idx].get(answer, 0) + 1

        self._results[survey_id].responses += 1
        return self._results[survey_id]

    def get_results(self, survey_id: int) -> SurveyResults:
        self.get(survey_id)  # Ensure survey exists
        return self._results[survey_id]


def build_store() -> InMemorySurveyStore:
    return InMemorySurveyStore()


store = build_store()


@app.post("/surveys", response_model=Survey, status_code=201)
def create_survey(payload: SurveyCreate) -> Survey:
    """Create a new survey."""

    return store.create(payload)


@app.get("/surveys", response_model=List[Survey])
def list_surveys() -> List[Survey]:
    """List all surveys."""

    return store.list_surveys()


@app.get("/surveys/{survey_id}", response_model=Survey)
def get_survey(survey_id: int) -> Survey:
    """Retrieve a specific survey."""

    return store.get(survey_id)


@app.post("/surveys/{survey_id}/responses", response_model=SurveyResults)
def submit_response(survey_id: int, submission: ResponseCreate) -> SurveyResults:
    """Submit a response for the given survey."""

    results = store.submit_response(survey_id, submission)
    return JSONResponse(status_code=202, content=results.model_dump())


@app.get("/surveys/{survey_id}/results", response_model=SurveyResults)
def survey_results(survey_id: int) -> SurveyResults:
    """Retrieve aggregated survey results."""

    return store.get_results(survey_id)


__all__ = ["app"]
