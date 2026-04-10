import json
import re
import time
from typing import Any

import requests
from requests import Response, Session
from requests.exceptions import RequestException, Timeout

from backend_openrouter.core.api_key_loader import load_api_key_from_file
from backend_openrouter.core.config import Settings
from backend_openrouter.core.errors import LLMTimeoutError, OpenRouterAPIError
from backend_openrouter.core.logging import get_logger

TRANSIENT_STATUS_CODES = {408, 409, 425, 429, 500, 502, 503, 504}


class OpenRouterBackend:
    """HTTP client wrapper for OpenRouter chat completions."""

    def __init__(self, settings: Settings, session: Session | None = None) -> None:
        self._settings = settings
        self._session = session or requests.Session()
        self._logger = get_logger(__name__)
        self._api_key: str | None = None

    def warmup(self) -> None:
        """Eagerly validate API key loading without sending a model request."""
        self._get_api_key()

    def generate(
        self,
        prompt: str,
        *,
        temperature: float,
        max_tokens: int,
        json_schema: dict[str, Any] | None = None,
    ) -> str:
        payload = self._build_payload(
            prompt=prompt,
            temperature=temperature,
            max_tokens=max_tokens,
            json_schema=json_schema,
        )
        attempt_count = self._settings.openrouter_max_retries + 1

        for attempt in range(1, attempt_count + 1):
            try:
                response = self._session.post(
                    self._settings.openrouter_api_url,
                    headers=self._build_headers(),
                    json=payload,
                    timeout=self._settings.openrouter_timeout_seconds,
                )
            except Timeout as exc:
                if attempt < attempt_count:
                    self._logger.warning(
                        "OpenRouter timeout on attempt %s/%s. Retrying.",
                        attempt,
                        attempt_count,
                    )
                    self._sleep_before_retry(attempt)
                    continue
                raise LLMTimeoutError(
                    "OpenRouter request timed out after retrying transient failures."
                ) from exc
            except RequestException as exc:
                if attempt < attempt_count:
                    self._logger.warning(
                        "OpenRouter request error on attempt %s/%s: %s. Retrying.",
                        attempt,
                        attempt_count,
                        exc,
                    )
                    self._sleep_before_retry(attempt)
                    continue
                raise OpenRouterAPIError(
                    f"OpenRouter request failed after retries: {exc}"
                ) from exc

            if response.status_code in TRANSIENT_STATUS_CODES and attempt < attempt_count:
                self._logger.warning(
                    "OpenRouter transient status %s on attempt %s/%s. Retrying.",
                    response.status_code,
                    attempt,
                    attempt_count,
                )
                self._sleep_before_retry(attempt)
                continue

            if response.status_code >= 400:
                detail = self._extract_error_message(response)
                raise OpenRouterAPIError(
                    f"OpenRouter request failed with status {response.status_code}: {detail}"
                )

            return self._extract_completion_text(response)

        raise OpenRouterAPIError("OpenRouter request failed after exhausting retries.")

    def _get_api_key(self) -> str:
        if self._api_key is None:
            self._api_key = load_api_key_from_file(self._settings.openrouter_api_key_file)
        return self._api_key

    def _build_headers(self) -> dict[str, str]:
        headers = {
            "Authorization": f"Bearer {self._get_api_key()}",
            "Content-Type": "application/json",
        }
        if self._settings.openrouter_http_referer:
            headers["HTTP-Referer"] = self._settings.openrouter_http_referer
        if self._settings.openrouter_app_title:
            headers["X-OpenRouter-Title"] = self._settings.openrouter_app_title
        return headers

    def _build_payload(
        self,
        *,
        prompt: str,
        temperature: float,
        max_tokens: int,
        json_schema: dict[str, Any] | None,
    ) -> dict[str, Any]:
        payload: dict[str, Any] = {
            "model": self._settings.openrouter_model,
            "messages": [{"role": "user", "content": prompt}],
            "temperature": temperature,
            "max_tokens": max_tokens,
            "stream": False,
            "provider": {
                "require_parameters": self._settings.openrouter_require_parameters,
            },
        }
        if json_schema is not None:
            payload["response_format"] = {
                "type": "json_schema",
                "json_schema": {
                    "name": self._build_schema_name(json_schema),
                    "strict": True,
                    "schema": json_schema,
                },
            }
        return payload

    @staticmethod
    def _build_schema_name(json_schema: dict[str, Any]) -> str:
        raw_name = str(json_schema.get("title") or "proofpoint_response")
        cleaned = re.sub(r"[^a-zA-Z0-9_-]", "_", raw_name).strip("_")
        return cleaned or "proofpoint_response"

    def _extract_completion_text(self, response: Response) -> str:
        try:
            payload = response.json()
        except ValueError as exc:
            raise OpenRouterAPIError("OpenRouter returned a non-JSON HTTP response.") from exc

        choices = payload.get("choices")
        if not isinstance(choices, list) or not choices:
            raise OpenRouterAPIError("OpenRouter response did not include any choices.")

        message = choices[0].get("message", {})
        content = message.get("content")

        if isinstance(content, str) and content.strip():
            return content
        if isinstance(content, dict):
            return json.dumps(content)
        if isinstance(content, list):
            parts: list[str] = []
            for item in content:
                if isinstance(item, str):
                    parts.append(item)
                    continue
                if isinstance(item, dict):
                    text = item.get("text") or item.get("content")
                    if text:
                        parts.append(str(text))
            combined = "".join(parts).strip()
            if combined:
                return combined

        refusal = message.get("refusal")
        if refusal:
            raise OpenRouterAPIError(f"OpenRouter returned a refusal instead of JSON: {refusal}")

        raise OpenRouterAPIError("OpenRouter returned an empty completion message.")

    @staticmethod
    def _extract_error_message(response: Response) -> str:
        try:
            payload = response.json()
        except ValueError:
            text = response.text.strip()
            return text[:300] if text else "<empty response body>"

        error = payload.get("error")
        if isinstance(error, dict):
            message = error.get("message") or json.dumps(error)
        elif error:
            message = str(error)
        else:
            message = payload.get("message") or response.text or "<empty response body>"
        return str(message).strip()[:300]

    def _sleep_before_retry(self, attempt: int) -> None:
        delay_seconds = self._settings.openrouter_retry_backoff_seconds * attempt
        if delay_seconds > 0:
            time.sleep(delay_seconds)
