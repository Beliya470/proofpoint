from backend_openrouter.core.config import Settings
from backend_openrouter.core.logging import get_logger
from backend_openrouter.llm.structured_client import StructuredLLMClient
from backend_openrouter.models.domain import DerivedTask, ParsedUpdate, TaskAnalysis
from backend_openrouter.prompts.analyzer_prompt import build_analyzer_prompt
from backend_openrouter.utils.normalizers import normalize_task_analysis_payload
from backend_openrouter.utils.response_templates import get_task_analysis_template


class TaskAnalyzerService:
    """Service for stage 2 impact analysis of each derived task."""

    def __init__(self, llm_client: StructuredLLMClient, settings: Settings) -> None:
        self._llm_client = llm_client
        self._settings = settings
        self._logger = get_logger(__name__)

    def analyze_task(
        self,
        *,
        raw_update: str,
        parsed_update: ParsedUpdate,
        task: DerivedTask,
    ) -> TaskAnalysis:
        self._logger.info("Analyzing task: %s", task.task_performed)
        prompt = build_analyzer_prompt(
            raw_update=raw_update,
            parsed_update=parsed_update,
            task=task,
        )
        return self._llm_client.generate_json(
            prompt,
            TaskAnalysis,
            max_tokens=self._settings.openrouter_max_tokens_analyze,
            temperature=self._settings.openrouter_temperature,
            purpose="analyze_task",
            normalizer=normalize_task_analysis_payload,
            repair_template=get_task_analysis_template(),
        )
