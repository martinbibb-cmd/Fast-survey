"""Minimal survey service implemented with FastAPI."""
from __future__ import annotations

from dataclasses import dataclass, field
from typing import Dict, Iterable, List, MutableMapping, Tuple

from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse


@dataclass(frozen=True)
class Choice:
    """Single selectable choice for a question."""

    value: str
    label: str

    @staticmethod
    def from_payload(raw: MutableMapping[str, object]) -> "Choice":
        value = _require_str(raw.get("value"), "Choice values must be non-empty strings.")
        label = _require_str(raw.get("label"), "Choice labels must be non-empty strings.")
        return Choice(value=value, label=label)


@dataclass(frozen=True)
class Question:
    """Survey question definition."""

    prompt: str
    kind: str = "text"
    choices: Tuple[Choice, ...] = field(default_factory=tuple)

    @staticmethod
    def from_payload(raw: MutableMapping[str, object]) -> "Question":
        prompt = _require_str(raw.get("prompt"), "Question prompt must not be empty.")
        kind = raw.get("kind", "text")
        if not isinstance(kind, str):
            raise HTTPException(status_code=400, detail="Question kind must be a string.")
        kind = kind.strip() or "text"
        if kind not in {"text", "single_choice"}:
            raise HTTPException(
                status_code=400,
                detail="Unsupported question kind. Use 'text' or 'single_choice'.",
            )

        raw_choices = raw.get("choices", [])
        if kind == "single_choice":
            if not isinstance(raw_choices, Iterable) or isinstance(raw_choices, (str, bytes)):
                raise HTTPException(status_code=400, detail="Single choice questions need choices.")
            parsed_choices = tuple(
                Choice.from_payload(_require_mapping(choice, "Each choice must be an object."))
                for choice in raw_choices
            )
            if not parsed_choices:
                raise HTTPException(status_code=400, detail="Single choice questions need choices.")
        else:
            if raw_choices:
                raise HTTPException(
                    status_code=400,
                    detail="Only single choice questions can define choices.",
                )
            parsed_choices = tuple()

        return Question(prompt=prompt, kind=kind, choices=parsed_choices)

    def to_dict(self) -> Dict[str, object]:
        return {
            "prompt": self.prompt,
            "kind": self.kind,
            "choices": [choice.__dict__ for choice in self.choices],
        }


@dataclass(frozen=True)
class Survey:
    """Survey representation returned by the API."""

    id: int
    title: str
    description: str | None
    questions: Tuple[Question, ...]

    def to_dict(self) -> Dict[str, object]:
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "questions": [question.to_dict() for question in self.questions],
        }


class InMemorySurveyStore:
    """Very small in-memory persistence layer."""

    def __init__(self) -> None:
        self._next_id = 1
        self._surveys: Dict[int, Survey] = {}
        self._results: Dict[int, Dict[str, object]] = {}

    def list_surveys(self) -> List[Dict[str, object]]:
        return [survey.to_dict() for survey in self._surveys.values()]

    def get(self, survey_id: int) -> Survey:
        try:
            return self._surveys[survey_id]
        except KeyError as exc:
            raise HTTPException(status_code=404, detail="Survey not found.") from exc

    def create(self, payload: MutableMapping[str, object]) -> Dict[str, object]:
        title = _require_str(payload.get("title"), "Title must not be empty.")
        raw_description = payload.get("description")
        if raw_description is not None:
            if not isinstance(raw_description, str):
                raise HTTPException(status_code=400, detail="Description must be a string if provided.")
            description = raw_description.strip() or None
        else:
            description = None

        raw_questions = payload.get("questions")
        if not isinstance(raw_questions, Iterable) or isinstance(raw_questions, (str, bytes)):
            raise HTTPException(status_code=400, detail="Questions must be a list of objects.")

        questions = tuple(
            Question.from_payload(_require_mapping(raw_question, "Each question must be an object."))
            for raw_question in raw_questions
        )
        if not questions:
            raise HTTPException(status_code=400, detail="At least one question is required.")

        survey_id = self._next_id
        self._next_id += 1
        survey = Survey(id=survey_id, title=title, description=description, questions=questions)
        self._surveys[survey_id] = survey
        self._results[survey_id] = {"responses": 0, "answers": {}}
        return survey.to_dict()

    def submit_response(self, survey_id: int, submission: MutableMapping[str, object]) -> Dict[str, object]:
        survey = self.get(survey_id)
        cleaned_answers = _clean_submission(submission)

        answers_bucket: Dict[str, Dict[str, int]] = self._results[survey_id]["answers"]  # type: ignore[index]

        for index, question in enumerate(survey.questions):
            if index not in cleaned_answers:
                raise HTTPException(status_code=400, detail=f"Missing answer for question {index}")
            answer = cleaned_answers[index]

            if question.kind == "single_choice":
                allowed = {choice.value for choice in question.choices}
                if answer not in allowed:
                    raise HTTPException(status_code=400, detail=f"Invalid choice for question {index}")

            bucket_key = str(index)
            answers_bucket.setdefault(bucket_key, {})
            answers_bucket[bucket_key][answer] = answers_bucket[bucket_key].get(answer, 0) + 1

        self._results[survey_id]["responses"] += 1
        return _deepcopy_dict(self._results[survey_id])  # type: ignore[arg-type]

    def get_results(self, survey_id: int) -> Dict[str, object]:
        self.get(survey_id)
        return _deepcopy_dict(self._results[survey_id])  # type: ignore[arg-type]


def _require_mapping(value: object, message: str) -> MutableMapping[str, object]:
    if not isinstance(value, MutableMapping):
        raise HTTPException(status_code=400, detail=message)
    return value


def _require_str(value: object, message: str) -> str:
    if not isinstance(value, str):
        raise HTTPException(status_code=400, detail=message)
    result = value.strip()
    if not result:
        raise HTTPException(status_code=400, detail=message)
    return result


def _clean_submission(submission: MutableMapping[str, object]) -> Dict[int, str]:
    if not isinstance(submission, MutableMapping):
        raise HTTPException(status_code=400, detail="Submission must be an object.")
    raw_answers = submission.get("answers")
    if not isinstance(raw_answers, MutableMapping):
        raise HTTPException(status_code=400, detail="Submission must contain an 'answers' object.")

    cleaned: Dict[int, str] = {}
    for raw_index, raw_answer in raw_answers.items():
        if isinstance(raw_index, str):
            if not raw_index.isdigit():
                raise HTTPException(status_code=400, detail="Question indexes must be integers.")
            index = int(raw_index)
        elif isinstance(raw_index, int):
            index = raw_index
        else:
            raise HTTPException(status_code=400, detail="Question indexes must be integers.")

        answer = _require_str(raw_answer, "Answer text cannot be empty.")
        cleaned[index] = answer

    return cleaned


def _deepcopy_dict(source: MutableMapping[str, object]) -> Dict[str, object]:
    result: Dict[str, object] = {}
    for key, value in source.items():
        if isinstance(value, MutableMapping):
            result[key] = _deepcopy_dict(value)
        elif isinstance(value, list):
            result[key] = [_deepcopy_dict(item) if isinstance(item, MutableMapping) else item for item in value]
        else:
            result[key] = value
    return result


def build_store() -> InMemorySurveyStore:
    return InMemorySurveyStore()


store = build_store()

app = FastAPI(title="Fast Survey", version="0.1.0")


@app.post("/surveys", status_code=201)
def create_survey(payload: MutableMapping[str, object]) -> Dict[str, object]:
    return store.create(payload)


@app.get("/surveys")
def list_surveys() -> List[Dict[str, object]]:
    return store.list_surveys()


@app.get("/surveys/{survey_id}")
def get_survey(survey_id: int) -> Dict[str, object]:
    return store.get(survey_id).to_dict()


@app.post("/surveys/{survey_id}/responses")
def submit_response(survey_id: int, submission: MutableMapping[str, object]) -> JSONResponse:
    results = store.submit_response(survey_id, submission)
    return JSONResponse(status_code=202, content=results)


@app.get("/surveys/{survey_id}/results")
def survey_results(survey_id: int) -> Dict[str, object]:
    return store.get_results(survey_id)

