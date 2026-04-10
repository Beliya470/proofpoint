from typing import Any, Protocol


class TextGenerationBackend(Protocol):
    """Low-level text generation contract for LLM backends."""

    def generate(
        self,
        prompt: str,
        *,
        temperature: float,
        max_tokens: int,
        json_schema: dict[str, Any] | None = None,
    ) -> str:
        ...
