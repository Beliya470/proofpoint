from backend_openrouter.core.logging import get_logger
from backend_openrouter.models.api import AnalyzeUpdateResponse
from backend_openrouter.services.aggregation_service import AggregationService
from backend_openrouter.services.analyzer_service import TaskAnalyzerService
from backend_openrouter.services.parser_service import UpdateParserService


class ProofPointPipelineService:
    """Orchestrate parse, analyze, and aggregate operations."""

    def __init__(
        self,
        *,
        parser_service: UpdateParserService,
        analyzer_service: TaskAnalyzerService,
        aggregation_service: AggregationService,
    ) -> None:
        self._parser_service = parser_service
        self._analyzer_service = analyzer_service
        self._aggregation_service = aggregation_service
        self._logger = get_logger(__name__)

    def analyze_update(self, raw_update: str) -> AnalyzeUpdateResponse:
        parsed_update = self._parser_service.parse_update(raw_update)
        analyses = [
            self._analyzer_service.analyze_task(
                raw_update=raw_update,
                parsed_update=parsed_update,
                task=task,
            )
            for task in parsed_update.derived_tasks
        ]
        summary = self._aggregation_service.build_summary(
            parsed_update=parsed_update,
            task_analyses=analyses,
        )
        self._logger.info(
            "Completed end-to-end analysis for %s derived tasks",
            len(parsed_update.derived_tasks),
        )
        return AnalyzeUpdateResponse(
            raw_update=raw_update,
            parsed_update=parsed_update,
            task_analyses=analyses,
            summary=summary,
        )
