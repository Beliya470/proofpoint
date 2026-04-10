from pathlib import Path

from backend_openrouter.core.errors import OpenRouterConfigurationError


def load_api_key_from_file(path: str | Path) -> str:
    """Load an OpenRouter API key from a local text file without logging the secret."""
    resolved_path = Path(path).expanduser()
    if not resolved_path.is_absolute():
        resolved_path = (Path.cwd() / resolved_path).resolve()
    else:
        resolved_path = resolved_path.resolve()

    if not resolved_path.is_file():
        raise OpenRouterConfigurationError(
            f"OpenRouter API key file was not found at '{resolved_path}'. "
            "Create aliopenrouter.txt or set OPENROUTER_API_KEY_FILE to the correct path."
        )

    try:
        api_key = resolved_path.read_text(encoding="utf-8").strip()
    except OSError as exc:
        raise OpenRouterConfigurationError(
            f"OpenRouter API key file could not be read at '{resolved_path}'."
        ) from exc

    if not api_key:
        raise OpenRouterConfigurationError(
            f"OpenRouter API key file is empty at '{resolved_path}'. "
            "Add the API key to aliopenrouter.txt or point OPENROUTER_API_KEY_FILE at a populated file."
        )

    return api_key
