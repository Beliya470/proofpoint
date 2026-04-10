class ProofPointError(Exception):
    """Base class for controlled backend errors."""

    def __init__(
        self,
        message: str,
        *,
        error_code: str = "proofpoint_error",
        status_code: int = 500,
    ) -> None:
        super().__init__(message)
        self.message = message
        self.error_code = error_code
        self.status_code = status_code


class OpenRouterConfigurationError(ProofPointError):
    def __init__(self, message: str) -> None:
        super().__init__(
            message,
            error_code="openrouter_configuration_error",
            status_code=500,
        )


class OpenRouterAPIError(ProofPointError):
    def __init__(self, message: str) -> None:
        super().__init__(message, error_code="openrouter_api_error", status_code=502)


class LLMTimeoutError(ProofPointError):
    def __init__(self, message: str) -> None:
        super().__init__(message, error_code="llm_timeout", status_code=504)


class InvalidLLMResponseError(ProofPointError):
    def __init__(self, message: str) -> None:
        super().__init__(
            message,
            error_code="invalid_llm_response",
            status_code=502,
        )
