import json
from typing import Any, Callable, TypeVar

from pydantic import BaseModel, ValidationError

from backend_openrouter.core.errors import InvalidLLMResponseError
from backend_openrouter.core.logging import get_logger
from backend_openrouter.llm.base import TextGenerationBackend
from backend_openrouter.utils.json_utils import parse_json_from_text

ResponseModelT = TypeVar("ResponseModelT", bound=BaseModel)
PayloadNormalizer = Callable[[Any], Any]


class StructuredLLMClient:
    """Generate validated JSON from a text-generation backend."""

    def __init__(self, backend: TextGenerationBackend) -> None:
        self._backend = backend
        self._logger = get_logger(__name__)

    def generate_json(
        self,
        prompt: str,
        response_model: type[ResponseModelT],
        *,
        max_tokens: int,
        temperature: float,
        purpose: str,
        normalizer: PayloadNormalizer | None = None,
        repair_template: str | None = None,
    ) -> ResponseModelT:
        self._logger.debug("%s prompt: %s", purpose, prompt)
        raw_output = self._backend.generate(
            prompt,
            temperature=temperature,
            max_tokens=max_tokens,
            json_schema=response_model.model_json_schema(),
        )
        self._logger.debug("%s raw output: %s", purpose, raw_output)

        try:
            return self._parse_and_validate(
                raw_output,
                response_model,
                normalizer=normalizer,
            )
        except (json.JSONDecodeError, ValidationError, ValueError) as first_error:
            self._logger.warning(
                "Invalid model output for %s. Retrying with repair prompt. Error: %s",
                purpose,
                first_error,
            )

        repair_prompt = self._build_repair_prompt(
            prompt,
            raw_output,
            response_model,
            repair_template=repair_template,
        )
        repaired_output = self._backend.generate(
            repair_prompt,
            temperature=0.0,
            max_tokens=max_tokens,
            json_schema=response_model.model_json_schema(),
        )
        self._logger.debug("%s repair output: %s", purpose, repaired_output)

        try:
            return self._parse_and_validate(
                repaired_output,
                response_model,
                normalizer=normalizer,
            )
        except (json.JSONDecodeError, ValidationError, ValueError) as repair_error:
            self._logger.error(
                "Repair attempt failed for %s. Output could not be validated. Error: %s",
                purpose,
                repair_error,
            )
            raise InvalidLLMResponseError(
                f"OpenRouter model returned invalid JSON for {purpose} after one repair attempt."
            ) from repair_error

    @staticmethod
    def _parse_and_validate(
        raw_output: str,
        response_model: type[ResponseModelT],
        *,
        normalizer: PayloadNormalizer | None = None,
    ) -> ResponseModelT:
        parsed = parse_json_from_text(raw_output)
        if normalizer is not None:
            parsed = normalizer(parsed)
        return response_model.model_validate(parsed)

    @staticmethod
    def _build_repair_prompt(
        original_prompt: str,
        invalid_output: str,
        response_model: type[BaseModel],
        *,
        repair_template: str | None = None,
    ) -> str:
        schema_or_template = repair_template or json.dumps(
            response_model.model_json_schema(),
            indent=2,
        )
        return f"""
You previously received an instruction and returned output that did not validate.

Re-run the task and return ONLY valid JSON that matches the required structure below.
Do not include markdown, explanations, or code fences.
Do not invent new facts. Preserve conservative reasoning.
Include every required key, even when arrays are empty.
If a string field is unknown, use an empty string.
If an array field is unknown, use an empty array.

Required JSON structure:
{schema_or_template}

Original instruction:
{original_prompt}

Previous invalid output:
{invalid_output}
""".strip()
