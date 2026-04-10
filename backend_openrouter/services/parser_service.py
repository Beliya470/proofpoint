from backend_openrouter.core.config import Settings
from backend_openrouter.core.logging import get_logger
from backend_openrouter.llm.structured_client import StructuredLLMClient
from backend_openrouter.models.domain import ParsedUpdate
from backend_openrouter.prompts.parser_prompt import build_parser_prompt
from backend_openrouter.utils.normalizers import normalize_parsed_update_payload
from backend_openrouter.utils.response_templates import get_parsed_update_template


class UpdateParserService:
    """Service for stage 1 parsing of raw work updates."""

    def __init__(self, llm_client: StructuredLLMClient, settings: Settings) -> None:
        self._llm_client = llm_client
        self._settings = settings
        self._logger = get_logger(__name__)

    def parse_update(self, raw_update: str) -> ParsedUpdate:
        self._logger.info("Parsing update text with %s characters", len(raw_update))
        prompt = build_parser_prompt(raw_update)
        parsed = self._llm_client.generate_json(
            prompt,
            ParsedUpdate,
            max_tokens=self._settings.openrouter_max_tokens_parse,
            temperature=self._settings.openrouter_temperature,
            purpose="parse_update",
            normalizer=normalize_parsed_update_payload,
            repair_template=get_parsed_update_template(),
        )
        self._logger.info("Parsed %s derived tasks", len(parsed.derived_tasks))
        return parsed
