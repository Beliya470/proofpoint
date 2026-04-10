from functools import lru_cache
from pathlib import Path
from typing import Annotated

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, NoDecode, SettingsConfigDict

DEFAULT_API_KEY_FILE = Path(__file__).resolve().parents[2] / "api_openrouter.txt"


class Settings(BaseSettings):
    """Application settings for the OpenRouter implementation."""

    model_config = SettingsConfigDict(
        env_file=("backend_openrouter/.env", ".env.openrouter"),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    app_name: str = "ProofPoint OpenRouter Backend"
    app_env: str = "development"
    api_prefix: str = "/api/v1"
    log_level: str = "INFO"
    cors_origins: Annotated[list[str], NoDecode] = Field(default_factory=lambda: ["*"])

    llm_backend: str = "openrouter"
    openrouter_api_url: str = "https://openrouter.ai/api/v1/chat/completions"
    openrouter_api_key_file: str = str(DEFAULT_API_KEY_FILE)
    openrouter_model: str = "openai/gpt-4o-mini"
    openrouter_temperature: float = 0.1
    openrouter_max_tokens_parse: int = 700
    openrouter_max_tokens_analyze: int = 1100
    openrouter_timeout_seconds: float = 45.0
    openrouter_max_retries: int = Field(default=2, ge=0)
    openrouter_retry_backoff_seconds: float = Field(default=1.0, ge=0.0)
    openrouter_http_referer: str | None = None
    openrouter_app_title: str = "ProofPoint OpenRouter Backend"
    openrouter_require_parameters: bool = True
    openrouter_preload_key_on_startup: bool = False

    @field_validator("cors_origins", mode="before")
    @classmethod
    def parse_cors_origins(cls, value: str | list[str]) -> list[str]:
        if isinstance(value, list):
            return value
        if isinstance(value, str):
            origins = [item.strip() for item in value.split(",") if item.strip()]
            return origins or ["*"]
        raise TypeError("CORS_ORIGINS must be a comma-separated string or list.")

    @field_validator("openrouter_api_key_file", mode="before")
    @classmethod
    def default_key_path(cls, value: str | Path | None) -> str:
        if value in (None, ""):
            return str(DEFAULT_API_KEY_FILE)
        return str(value)

    @field_validator("openrouter_app_title", mode="before")
    @classmethod
    def default_app_title(cls, value: str | None) -> str:
        cleaned = (value or "").strip()
        return cleaned or "ProofPoint OpenRouter Backend"

    @field_validator("openrouter_model", mode="before")
    @classmethod
    def require_model_name(cls, value: str | None) -> str:
        cleaned = (value or "").strip()
        if cleaned:
            return cleaned
        raise ValueError("OPENROUTER_MODEL must not be empty.")


@lru_cache
def get_settings() -> Settings:
    return Settings()
